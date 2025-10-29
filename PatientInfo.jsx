// /React/src/pages/PatientInfo.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const countryCodes = [
  { name: 'Algérie', code: '+213' },
  { name: 'Angola', code: '+244' },
  { name: 'Bénin', code: '+229' },
  { name: 'Botswana', code: '+267' },
  { name: 'Burkina Faso', code: '+226' },
  { name: 'Burundi', code: '+257' },
  { name: 'Cameroun', code: '+237' },
  { name: 'Cap-Vert', code: '+238' },
  { name: 'Centrafrique', code: '+236' },
  { name: 'Comores', code: '+269' },
  { name: 'Congo', code: '+242' },
  { name: 'RD Congo', code: '+243' },
  { name: 'Côte d\'Ivoire', code: '+225' },
  { name: 'Djibouti', code: '+253' },
  { name: 'Égypte', code: '+20' },
  { name: 'Érythrée', code: '+291' },
  { name: 'Eswatini', code: '+268' },
  { name: 'Éthiopie', code: '+251' },
  { name: 'Gabon', code: '+241' },
  { name: 'Gambie', code: '+220' },
  { name: 'Ghana', code: '+233' },
  { name: 'Guinée', code: '+224' },
  { name: 'Guinée-Bissau', code: '+245' },
  { name: 'Guinée équatoriale', code: '+240' },
  { name: 'Kenya', code: '+254' },
  { name: 'Lesotho', code: '+266' },
  { name: 'Libéria', code: '+231' },
  { name: 'Libye', code: '+218' },
  { name: 'Madagascar', code: '+261' },
  { name: 'Malawi', code: '+265' },
  { name: 'Mali', code: '+223' },
  { name: 'Maroc', code: '+212' },
  { name: 'Maurice', code: '+230' },
  { name: 'Mauritanie', code: '+222' },
  { name: 'Mozambique', code: '+258' },
  { name: 'Namibie', code: '+264' },
  { name: 'Niger', code: '+227' },
  { name: 'Nigeria', code: '+234' },
  { name: 'Ouganda', code: '+256' },
  { name: 'Rwanda', code: '+250' },
  { name: 'São Tomé-et-Principe', code: '+239' },
  { name: 'Sénégal', code: '+221' },
  { name: 'Seychelles', code: '+248' },
  { name: 'Sierra Leone', code: '+232' },
  { name: 'Somalie', code: '+252' },
  { name: 'Soudan', code: '+249' },
  { name: 'Soudan du Sud', code: '+211' },
  { name: 'Tanzanie', code: '+255' },
  { name: 'Tchad', code: '+235' },
  { name: 'Togo', code: '+228' },
  { name: 'Tunisie', code: '+216' },
  { name: 'Zambie', code: '+260' },
  { name: 'Zimbabwe', code: '+263' },
  { name: 'Suisse', code: '+41' },
  { name: 'Royaume-Uni', code: '+44' },
];

const PatientInfo = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    phoneCode: '+261',
    phoneNumber: '',
    country: 'Madagascar',
    region: '',
    birthDate: '',
    address: '',
  });
  const [calculatedAge, setCalculatedAge] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);
  const email = localStorage.getItem('email') || '';
  const role = localStorage.getItem('role') || '';
  const navigate = useNavigate();

  const calculateAge = (birthDate) => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age.toString();
  };

  useEffect(() => {
    const checkUserInfo = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/auth/patient-info?email=${email}`);
        console.log('Données patient reçues:', data);
        if (
          data &&
          data.fullName &&
          data.gender &&
          data.phoneCode &&
          data.phoneNumber &&
          data.country &&
          data.region &&
          data.birthDate
        ) {
          setIsFormFilled(true);
          navigate('/home'); // Redirection vers /home si infos remplies
        }
      } catch (error) {
        console.error('Erreur lors de la vérification des infos:', error);
      }
    };
    if (email && role === 'patient') {
      checkUserInfo();
    } else {
      navigate('/login');
    }
  }, [email, role, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'country') {
      const selectedCountry = countryCodes.find((country) => country.name === value);
      setFormData((prev) => ({
        ...prev,
        country: value,
        phoneCode: selectedCountry ? selectedCountry.code : prev.phoneCode,
      }));
    } else if (name === 'birthDate') {
      setFormData((prev) => ({ ...prev, birthDate: value }));
      setCalculatedAge(calculateAge(value));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/patient-info', { email, ...formData });
      toast.success('Informations enregistrées ! Redirection vers la page d’accueil...', {
        position: 'top-right',
        autoClose: 2000,
        theme: 'colored',
      });
      setTimeout(() => navigate('/home'), 2000);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur lors de l’enregistrement', {
        position: 'top-right',
        theme: 'colored',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: '',
      gender: '',
      phoneCode: '+261',
      phoneNumber: '',
      country: 'Madagascar',
      region: '',
      birthDate: '',
      address: '',
    });
    setCalculatedAge('');
    toast.info('Formulaire réinitialisé.', {
      position: 'top-right',
      autoClose: 2000,
      theme: 'colored',
    });
  };

  if (role !== 'patient') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-teal-400 p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 text-center"
        >
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Accès restreint</h2>
          <p className="text-gray-600 text-lg">Bienvenue, {role} ! Cette page est réservée aux patients.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className="mt-6 bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition duration-300 font-semibold"
          >
            Retour à la connexion
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-500 to-teal-400 p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-auto p-6 sm:p-8"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-3xl font-bold text-center text-blue-600 mb-8"
        >
          Complétez vos informations personnelles
        </motion.h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Ex: Jean Dupont"
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 transition duration-200 shadow-sm"
              required
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Âge (calculé automatiquement)</label>
            <input
              type="text"
              value={calculatedAge}
              disabled
              className="w-full p-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.5 }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 transition duration-200 shadow-sm"
              required
            >
              <option value="">Sélectionnez votre genre</option>
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
              <option value="Autre">Autre</option>
            </select>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7, duration: 0.5 }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de téléphone</label>
            <div className="flex space-x-2">
              <select
                name="phoneCode"
                value={formData.phoneCode}
                onChange={handleChange}
                className="w-1/3 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 transition duration-200 shadow-sm"
                required
              >
                {countryCodes.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name} ({country.code})
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Ex: 123456789"
                className="w-2/3 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 transition duration-200 shadow-sm"
                required
              />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8, duration: 0.5 }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 transition duration-200 shadow-sm"
              required
            >
              <option value="">Sélectionnez votre pays</option>
              {countryCodes.map((country) => (
                <option key={country.name} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9, duration: 0.5 }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Région</label>
            <input
              type="text"
              name="region"
              value={formData.region}
              onChange={handleChange}
              placeholder="Ex: Analamanga"
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 transition duration-200 shadow-sm"
              required
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0, duration: 0.5 }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 transition duration-200 shadow-sm"
              required
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1, duration: 0.5 }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Adresse (optionnel)</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Ex: 123 Rue Principale"
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 transition duration-200 shadow-sm"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="md:col-span-2 flex space-x-4"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              type="submit"
              disabled={loading}
              className={`flex-1 bg-gradient-to-r from-blue-600 to-teal-500 text-white p-3 rounded-lg hover:from-blue-700 hover:to-teal-600 transition duration-300 font-semibold shadow-md ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Enregistrement...' : 'Enregistrer et continuer'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCancel}
              className="flex-1 bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition duration-300 font-semibold shadow-md"
            >
              Annuler
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.5 }}
        className="mt-8 flex justify-center items-center space-x-3"
      >
        <img src={logo} alt="HealthChain Logo" className="h-10 w-auto" />
        <p className="text-sm text-white font-medium tracking-wide">Propulsé par HealthChain Trace &copy; 2025</p>
      </motion.div>
    </div>
  );
};

export default PatientInfo;