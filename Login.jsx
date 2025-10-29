// /React/src/pages/Login.jsx
/*
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('hederaAccountId', data.accountId);
      localStorage.setItem('hederaPublicKey', data.publicKey);
      localStorage.setItem('role', data.role);
      localStorage.setItem('email', data.email);
      toast.success(`Connexion réussie ! Bienvenue, ${data.role}.`, {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
      if (data.role === 'doctor') {
        navigate('/doctor-complete-info');
      } else if (data.role === 'pharmacy') {
        navigate('/pharmacy-complete-info');
      } else {
        try {
          const { data: patientData } = await axios.get(`http://localhost:5000/api/auth/patient-info?email=${data.email}`);
          console.log('Données patient reçues (login):', patientData);
          if (
            patientData &&
            patientData.fullName &&
            patientData.gender &&
            patientData.phoneCode &&
            patientData.phoneNumber &&
            patientData.country &&
            patientData.region &&
            patientData.birthDate
          ) {
            navigate('/home'); // Redirection vers /home si infos complètes
          } else {
            navigate('/patient-info');
          }
        } catch (error) {
          navigate('/patient-info');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur lors de la connexion', {
        position: 'top-right',
        theme: 'colored',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-green-500 p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8"
      >
        <motion.img
          src={logo}
          alt="HealthChain Logo"
          className="mx-auto h-16 sm:h-24 mb-6 w-auto"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        />
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl sm:text-3xl font-bold text-center text-blue-600 mb-6"
        >
          Connexion à HealthChain
        </motion.h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de Passe</label>
            <input
              type="password"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </motion.button>
        </form>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center text-sm text-gray-600 mt-4"
        >
          Pas de compte ?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Inscrivez-vous
          </a>
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-center text-sm text-gray-600 mt-2"
        >
          Mot de passe oublié ?{' '}
          <a href="/forgot-password" className="text-blue-600 hover:underline">
            Réinitialiser
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;
*/

// /React/src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Mot de passe invalide (minimum 6 caractères)';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      toast.success(response.data.message, {
        position: 'top-right',
        autoClose: 2000,
      });
      localStorage.setItem('email', response.data.email);
      localStorage.setItem('role', response.data.role);
      setTimeout(() => {
        navigate(response.data.redirectTo || '/home');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur lors de la connexion', {
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8"
      >
        <motion.img
          src={logo}
          alt="HealthChain Logo"
          className="mx-auto h-16 sm:h-24 mb-6 w-auto"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        />
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl sm:text-3xl font-bold text-center text-blue-600 mb-6"
        >
          Connexion
        </motion.h2>
        <form onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-4"
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez votre email"
              required
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mb-6"
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez votre mot de passe"
              required
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </motion.button>
        </form>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-4 text-center"
        >
          <a href="/forgot-password" className="text-blue-600 hover:underline">
            Mot de passe oublié ?
          </a>

          <a href="/register" className="text-blue-600 hover:underline">
            Inscrivez-vous
          </a>
        </motion.div>
        <footer className="mt-8 text-center text-sm text-gray-500">
          <div className="flex justify-center items-center space-x-3">
            <img src={logo} alt="HealthChain Logo" className="h-8 w-auto" />
            <p>Propulsé par HealthChain Trace &copy; 2025</p>
          </div>
        </footer>
      </motion.div>
    </div>
  );
};

export default Login;