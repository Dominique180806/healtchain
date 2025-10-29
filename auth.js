const express = require('express');
const { client } = require('../services/hedera');
const { AccountCreateTransaction, TopicMessageSubmitTransaction, TopicMessageQuery, PrivateKey } = require('@hashgraph/sdk');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../db');
const multer = require('multer');
const path = require('path');
const router = express.Router();
require('dotenv').config();

// Connexion à SQLite (persistant avec fichier users.db)

db.run('CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY, passwordHash TEXT, username TEXT, role TEXT, accountId TEXT, publicKey TEXT, privateKey TEXT, specialty TEXT, licenseNumber TEXT, pharmacyName TEXT, address TEXT, fullName TEXT, gender TEXT, phoneCode TEXT, phoneNumber TEXT, country TEXT, region TEXT, birthDate TEXT, patientAddress TEXT)');

// Créer la table des docteurs (si pas déjà fait)
db.run(`CREATE TABLE IF NOT EXISTS doctors (
  email TEXT PRIMARY KEY,
  role TEXT,
  fullName TEXT,
  specialties TEXT,
  licenseNumber TEXT UNIQUE,
  phoneNumber TEXT,
  hospital TEXT,
  address TEXT,
  experienceYears INTEGER,
  files TEXT,
  country TEXT,
  region TEXT
)`);
db.run(`ALTER TABLE doctors ADD COLUMN country TEXT`, (err) => {
  if (err && !err.message.includes('duplicate column name')) {
    console.error('Erreur lors de l’ajout de la colonne country:', err);
  }
});
db.run(`ALTER TABLE doctors ADD COLUMN region TEXT`, (err) => {
  if (err && !err.message.includes('duplicate column name')) {
    console.error('Erreur lors de l’ajout de la colonne region:', err);
  }
});
// Créer la table des pharmacies (si pas déjà fait)
db.run(`CREATE TABLE IF NOT EXISTS pharmacies (
  email TEXT PRIMARY KEY,
  role TEXT,
  pharmacyName TEXT,
  licenseNumber TEXT UNIQUE,
  phoneNumber TEXT,
  contactEmail TEXT,
  openingHours TEXT,
  address TEXT,
  files TEXT,
  country TEXT,
  region TEXT
)`);
db.run(`ALTER TABLE pharmacies ADD COLUMN country TEXT`, (err) => {
  if (err && !err.message.includes('duplicate column name')) {
    console.error('Erreur lors de l’ajout de la colonne country:', err);
  }
});
db.run(`ALTER TABLE pharmacies ADD COLUMN region TEXT`, (err) => {
  if (err && !err.message.includes('duplicate column name')) {
    console.error('Erreur lors de l’ajout de la colonne region:', err);
  }
});

// Configurer nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Configurer multer pour les fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (['application/pdf', 'image/jpeg', 'image/png'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier invalide'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo  
});

// Route pour l'inscription
router.post('/register', async (req, res) => {
  try {
    const { username, email, profession } = req.body;
    console.log('Body reçu:', req.body);
    if (!username || username.length < 3) return res.status(400).json({ error: 'Nom d’utilisateur invalide (minimum 3 caractères)' });
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Email invalide' });
    if (!profession) return res.status(400).json({ error: 'Profession requise' });
    const emailExists = await new Promise((resolve) => {
      db.get('SELECT email FROM users WHERE email = ?', [email], (err, row) => {
        if (err) console.error('Erreur SQLite:', err);
        resolve(!!row);
      });
    });
    if (emailExists) return res.status(400).json({ error: 'Email déjà utilisé' });
    let role = 'patient';
    if (profession === 'docteur') role = 'doctor';
    else if (profession === 'pharmacien') role = 'pharmacy';
    const newPrivateKey = PrivateKey.generateED25519();
    const tx = await new AccountCreateTransaction()
      .setKey(newPrivateKey.publicKey)
      .setInitialBalance(10)
      .execute(client);
    const accountId = (await tx.getReceipt(client)).accountId;
    const userData = { username, email, role, accountId: accountId.toString(), publicKey: newPrivateKey.publicKey.toStringDer() };
    const topicId = '0.0.7129100';
    const hcsTx = await new TopicMessageSubmitTransaction()
      .setTopicId(topicId)
      .setMessage(JSON.stringify(userData))
      .execute(client);
    const hcsReceipt = await hcsTx.getReceipt(client);
    console.log('HCS Transaction ID:', hcsReceipt.topicSequenceNumber.toString());
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (email, username, role, accountId, publicKey, privateKey) VALUES (?, ?, ?, ?, ?, ?)',
        [email, username, role, accountId.toString(), newPrivateKey.publicKey.toStringDer(), newPrivateKey.toStringDer()],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
    const token = jwt.sign({ email }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Bienvenue sur HealthChain Trace',
      html: `
        <h2>Bienvenue, ${username} !</h2>
        <p>Votre compte HealthChain a été créé avec succès.</p>
        <p><strong>Clé privée Hedera :</strong> ${newPrivateKey.toStringDer()}</p>
        <p><strong>Attention :</strong> Conservez cette clé en lieu sûr et ne la partagez jamais.</p>
        <p><a href="http://localhost:5173/set-password?token=${token}">Cliquez ici pour définir votre mot de passe</a></p>
      `,
    };
    await transporter.sendMail(mailOptions);
    res.status(201).json({
      accountId: accountId.toString(),
      publicKey: newPrivateKey.publicKey.toStringDer(),
      role,
      hcsTxId: hcsReceipt.topicSequenceNumber.toString(),
      message: 'Compte créé. Vérifiez votre email pour définir votre mot de passe.',
    });
  } catch (error) {
    console.error('Erreur lors de l’inscription:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route pour définir le mot de passe
router.post('/set-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!password || password.length < 6) return res.status(400).json({ error: 'Mot de passe invalide (minimum 6 caractères)' });
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    } catch (error) {
      return res.status(400).json({ error: 'Token invalide ou expiré' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await new Promise((resolve, reject) => {
      db.run('UPDATE users SET passwordHash = ? WHERE email = ?', [passwordHash, decoded.email], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    res.status(200).json({ message: 'Mot de passe défini avec succès' });
  } catch (error) {
    console.error('Erreur lors de la définition du mot de passe:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route pour la connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Body reçu (login):', req.body);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Email invalide' });
    if (!password) return res.status(400).json({ error: 'Mot de passe requis' });
    let userData = await new Promise((resolve) => {
      db.get('SELECT email, username, role, accountId, publicKey FROM users WHERE email = ?', [email], (err, row) => {
        if (err) console.error('Erreur SQLite:', err);
        resolve(row);
      });
    });
    if (!userData) {
      const messages = [];
      const topicId = '0.0.7129100';
      await new Promise((resolve) => {
        new TopicMessageQuery()
          .setTopicId(topicId)
          .subscribe(client, (message) => {
            try {
              const data = JSON.parse(message.contents.toString());
              messages.push(data);
              console.log('Message HCS reçu:', data);
              if (data.email === email) {
                userData = data;
              }
            } catch (e) {
              console.error('Erreur parsing message HCS:', e);
            }
          }, (error) => {
            console.error('Erreur TopicMessageQuery:', error);
            resolve();
          });
        setTimeout(resolve, 20000);
      });
      console.log('Messages HCS lus:', messages);
    }
    if (!userData) {
      return res.status(401).json({ error: 'Email incorrect' });
    }
    const user = await new Promise((resolve) => {
      db.get('SELECT passwordHash FROM users WHERE email = ?', [email], (err, row) => {
        if (err) console.error('Erreur SQLite:', err);
        resolve(row);
      });
    });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Aucun mot de passe défini pour cet email' });
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }
    // Déterminer la redirection en fonction du rôle
    let redirectTo = '/home'; // Par défaut pour les patients
    if (userData.role === 'doctor') {
      const doctorInfo = await new Promise((resolve) => {
        db.get('SELECT email FROM doctors WHERE email = ?', [email], (err, row) => {
          if (err) console.error('Erreur SQLite (doctor check):', err);
          resolve(row);
        });
      });
      redirectTo = doctorInfo ? '/doctor-dashboard' : '/doctor-complete-info';
    } else if (userData.role === 'pharmacy') {
      const pharmacyInfo = await new Promise((resolve) => {
        db.get('SELECT email FROM pharmacies WHERE email = ?', [email], (err, row) => {
          if (err) console.error('Erreur SQLite (pharmacy check):', err);
          resolve(row);
        });
      });
      redirectTo = pharmacyInfo ? '/dashboard' : '/pharmacy-complete-info';
    }
    res.status(200).json({
      accountId: userData.accountId,
      publicKey: userData.publicKey,
      role: userData.role,
      email: userData.email,
      message: 'Connexion réussie',
      redirectTo,
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
});

// Route pour compléter les informations (unifiée pour tous les rôles)
router.post('/complete-info',
upload.fields([
  { name: 'files', maxCount: 5 },
  { name: 'profileImage', maxCount: 1 }
]),
async (req, res) => {
  const files = req.files['files'] ? req.files['files'].map(f => f.path) : [];
  const profileImage = req.files['profileImage'] ? req.files['profileImage'][0].path : null;
  try {
    console.log('Body reçu (complete-info):', req.body);
    console.log('Fichiers reçus:', req.files);
    const { email, role } = req.body;
    
    if (!email || !role) return res.status(400).json({ error: 'Email et rôle requis' });
    const userExists = await new Promise((resolve) => {
      db.get('SELECT role FROM users WHERE email = ?', [email], (err, row) => {
        if (err) console.error('Erreur SQLite:', err);
        resolve(row);
      });
    });
    if (!userExists || userExists.role !== role) {
      return res.status(404).json({ error: 'Utilisateur non trouvé ou rôle incorrect' });
    }
    if (role === 'doctor') {
      const { 
        fullName, specialties, licenseNumber, phoneNumber, hospital, address, 
        experienceYears, country, region 
      } = req.body;
      if (!fullName || !specialties || !licenseNumber || !phoneNumber || !hospital || !address || experienceYears === undefined || !country || !region) {
        return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis pour le docteur' });
      }
      if (!licenseNumber.match(/^[a-zA-Z0-9]{6,}$/)) {
        return res.status(400).json({ error: 'Numéro de licence invalide' });
      }
      const licenseExists = await new Promise((resolve) => {
        db.get('SELECT licenseNumber FROM doctors WHERE licenseNumber = ?', [licenseNumber], (err, row) => {
          if (err) console.error('Erreur SQLite:', err);
          resolve(!!row);
        });
      });
      if (licenseExists) {
        return res.status(400).json({ error: 'Numéro de licence déjà utilisé' });
      }
      if (!profileImage) {
        return res.status(400).json({ error: 'Photo de profil requise' });
      }
      if (!phoneNumber.match(/^\+\d{9,15}$/)) {
        return res.status(400).json({ error: 'Format de téléphone invalide' });
      }
      let specialtiesArray;
      try {
        specialtiesArray = JSON.parse(specialties);
        if (!Array.isArray(specialtiesArray) || specialtiesArray.length === 0) {
          return res.status(400).json({ error: 'Au moins une spécialité est requise' });
        }
      } catch (e) {
        return res.status(400).json({ error: 'Spécialités invalides' });
      }
      if (isNaN(experienceYears) || experienceYears < 0) {
        return res.status(400).json({ error: 'Années d’expérience invalides' });
      }
      if (files.length > 5) {
        return res.status(400).json({ error: 'Maximum 5 fichiers' });
      }
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT OR REPLACE INTO doctors (
            email, role, fullName, specialties, licenseNumber, phoneNumber, 
            hospital, address, experienceYears, files, country, region, profileImage
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            email, role, fullName, JSON.stringify(specialtiesArray), licenseNumber, 
            phoneNumber, hospital, address, parseInt(experienceYears), 
            JSON.stringify(files), country, region, profileImage // ← Ajout
          ],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    } else if (role === 'pharmacy') {
      const { pharmacyName, licenseNumber, phoneNumber, contactEmail, openingHours, address, country, region } = req.body;
      if (!pharmacyName || !licenseNumber || !phoneNumber || !contactEmail || !openingHours || !address || !country || !region) {
        return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis pour la pharmacie' });
      }
      if (!licenseNumber.match(/^[a-zA-Z0-9]{6,}$/)) {
        return res.status(400).json({ error: 'Numéro de licence invalide' });
      }
      const licenseExists = await new Promise((resolve) => {
        db.get('SELECT licenseNumber FROM pharmacies WHERE licenseNumber = ?', [licenseNumber], (err, row) => {
          if (err) console.error('Erreur SQLite:', err);
          resolve(!!row);
        });
      });
      if (licenseExists) {
        return res.status(400).json({ error: 'Numéro de licence déjà utilisé' });
      }
      if (!phoneNumber.match(/^\+\d{9,15}$/)) {
        return res.status(400).json({ error: 'Format de téléphone invalide' });
      }
      if (!contactEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return res.status(400).json({ error: 'Email de contact invalide' });
      }
      if (files.length > 5) {
        return res.status(400).json({ error: 'Maximum 5 fichiers' });
      }
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT OR REPLACE INTO pharmacies (email, role, pharmacyName, licenseNumber, phoneNumber, contactEmail, openingHours, address, files, country, region)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [email, role, pharmacyName, licenseNumber, phoneNumber, contactEmail, openingHours, address, JSON.stringify(files), country, region],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    } else if (role === 'patient') {
      const { fullName, gender, phoneCode, phoneNumber, country, region, birthDate, patientAddress } = req.body;
      if (!fullName || !gender || !phoneCode || !phoneNumber || !country || !region || !birthDate) {
        return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis pour le patient' });
      }
      await new Promise((resolve, reject) => {
        db.run(
          'UPDATE users SET fullName = ?, gender = ?, phoneCode = ?, phoneNumber = ?, country = ?, region = ?, birthDate = ?, patientAddress = ? WHERE email = ? AND role = ?',
          [fullName, gender, phoneCode, phoneNumber, country, region, birthDate, patientAddress || null, email, 'patient'],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    }
    res.status(200).json({ message: 'Informations enregistrées avec succès' });
  } catch (error) {
    console.error('Erreur lors de l’enregistrement des informations:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route pour réinitialiser le mot de passe (forgot-password)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Body reçu (forgot-password):', req.body);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Email invalide' });
    const user = await new Promise((resolve) => {
      db.get('SELECT privateKey, username FROM users WHERE email = ?', [email], (err, row) => {
        if (err) console.error('Erreur SQLite:', err);
        resolve(row);
      });
    });
    if (!user || !user.privateKey) {
      return res.status(401).json({ error: 'Email non trouvé ou clé privée manquante' });
    }
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Réinitialisation de mot de passe - HealthChain Trace',
      html: `
        <h2>Réinitialisation de mot de passe</h2>
        <p>Bonjour, ${user.username} !</p>
        <p>Voici votre clé privée Hedera pour réinitialiser votre mot de passe :</p>
        <p><strong>Clé privée :</strong> ${user.privateKey}</p>
        <p><strong>Attention :</strong> Conservez cette clé en lieu sûr et ne la partagez jamais.</p>
        <p><a href="http://localhost:5173/reset-password?email=${email}">Cliquez ici pour réinitialiser votre mot de passe</a></p>
      `,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Clé privée envoyée à votre email' });
  } catch (error) {
    console.error('Erreur lors de l’envoi de la clé privée:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route pour réinitialiser le mot de passe
router.post('/reset-password', async (req, res) => {
  try {
    const { email, privateKey, newPassword } = req.body;
    console.log('Body reçu (reset-password):', req.body);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Email invalide' });
    if (!privateKey) return res.status(400).json({ error: 'Clé privée requise' });
    if (!newPassword || newPassword.length < 6) return res.status(400).json({ error: 'Nouveau mot de passe invalide (minimum 6 caractères)' });
    const user = await new Promise((resolve) => {
      db.get('SELECT privateKey FROM users WHERE email = ?', [email], (err, row) => {
        if (err) console.error('Erreur SQLite:', err);
        resolve(row);
      });
    });
    if (!user || user.privateKey !== privateKey) {
      return res.status(401).json({ error: 'Clé privée incorrecte' });
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await new Promise((resolve, reject) => {
      db.run('UPDATE users SET passwordHash = ? WHERE email = ?', [passwordHash, email], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route pour enregistrer les informations du patient
router.post('/patient-info', async (req, res) => {
  try {
    const { email, fullName, gender, phoneCode, phoneNumber, country, region, birthDate, patientAddress } = req.body;
    console.log('Body reçu (patient-info):', req.body);
    if (!email || !fullName || !gender || !phoneCode || !phoneNumber || !country || !region || !birthDate) {
      return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis' });
    }
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET fullName = ?, gender = ?, phoneCode = ?, phoneNumber = ?, country = ?, region = ?, birthDate = ?, patientAddress = ? WHERE email = ? AND role = ?',
        [fullName, gender, phoneCode, phoneNumber, country, region, birthDate, patientAddress || null, email, 'patient'],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
    res.status(200).json({ message: 'Informations patient enregistrées avec succès' });
  } catch (error) {
    console.error('Erreur lors de l’enregistrement des informations patient:', error);
    res.status(500).json({ error: error.message });
  }
});
router.get('/pharmacy-info', async (req, res) => {
  try {
    const { email } = req.query;
    console.log('Requête pharmacy-info pour email:', email);
    if (!email) return res.status(400).json({ error: 'Email requis' });
    const pharmacy = await new Promise((resolve) => {
      db.get(
        'SELECT pharmacyName, licenseNumber, phoneNumber, contactEmail, openingHours, address, files, country, region FROM pharmacies WHERE email = ?',
        [email],
        (err, row) => {
          if (err) console.error('Erreur SQLite:', err);
          resolve(row || {});
        }
      );
    });
    res.status(200).json(pharmacy);
  } catch (error) {
    console.error('Erreur lors de la récupération des informations pharmacien:', error);
    res.status(500).json({ error: error.message });
  }
});
router.get('/doctor-info', async (req, res) => {
  try {
    const { email } = req.query;
    console.log('Requête doctor-info pour email:', email);
    if (!email) return res.status(400).json({ error: 'Email requis' });
    const doctor = await new Promise((resolve) => {
      db.get(
        'SELECT fullName, specialties, licenseNumber, phoneNumber, hospital, address, experienceYears, files, country, region, profileImage FROM doctors WHERE email = ?',
        [email],
        (err, row) => {
          if (err) console.error('Erreur SQLite:', err);
          resolve(row || {});
        }
      );
    });
    res.status(200).json(doctor);
  } catch (error) {
    console.error('Erreur lors de la récupération des informations docteur:', error);
    res.status(500).json({ error: error.message });
  }
});
// Route pour récupérer les informations du patient
router.get('/patient-info', async (req, res) => {
  try {
    const { email } = req.query;
    console.log('Requête patient-info pour email:', email);
    if (!email) return res.status(400).json({ error: 'Email requis' });
    const user = await new Promise((resolve) => {
      db.get(
        'SELECT fullName, gender, phoneCode, phoneNumber, country, region, birthDate, patientAddress FROM users WHERE email = ? AND role = ?',
        [email, 'patient'],
        (err, row) => {
          if (err) console.error('Erreur SQLite:', err);
          resolve(row || {});
        }
      );
    });
    res.status(200).json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération des informations patient:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;