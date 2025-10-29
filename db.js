//express/ db.js
const sqlite3 = require('sqlite3').verbose();

// Crée ou ouvre la base de données
const db = new sqlite3.Database('users.db', (err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err.message);
  } else {
    console.log('Connecté à la base de données SQLite (users.db)');
  }
});
// db.js (ajoute après la création de la table doctors)
db.run(`ALTER TABLE doctors ADD COLUMN profileImage TEXT`, (err) => {
  if (err && !err.message.includes('duplicate column name')) {
    console.error('Erreur ajout colonne profileImage:', err);
  }
});
// Création des tables (doit être fait une seule fois)
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    email TEXT PRIMARY KEY,
    passwordHash TEXT,
    username TEXT,
    role TEXT,
    accountId TEXT,
    publicKey TEXT,
    privateKey TEXT,
    specialty TEXT,
    licenseNumber TEXT,
    pharmacyName TEXT,
    address TEXT,
    fullName TEXT,
    gender TEXT,
    phoneCode TEXT,
    phoneNumber TEXT,
    country TEXT,
    region TEXT,
    birthDate TEXT,
    patientAddress TEXT
  )`);

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
// TABLE APPOINTMENTS (NOUVELLE)
db.run(`CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER PRIMARY KEY,
  patient_email TEXT NOT NULL,
  doctor_email TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  motif TEXT,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);
  // Ajout des colonnes si elles n'existent pas
  ['doctors', 'pharmacies'].forEach(table => {
    ['country', 'region'].forEach(col => {
      db.run(`ALTER TABLE ${table} ADD COLUMN ${col} TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.error(`Erreur ajout colonne ${col} dans ${table}:`, err);
        }
      });
    });
  });
});
// === FONCTIONS ASYNC (OBLIGATOIRES) ===
db.runAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

db.getAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

db.allAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};
// Exporte l'instance db
module.exports = db;