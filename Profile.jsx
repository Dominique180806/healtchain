// /React/src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [calculatedAge, setCalculatedAge] = useState('');
  const [loading, setLoading] = useState(true);
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
    const fetchUserInfo = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/auth/patient-info?email=${email}`);
        console.log('Données patient reçues (profile):', data);
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
          setUserData(data);
          setCalculatedAge(calculateAge(data.birthDate));
        } else {
          toast.error('Aucune information complète trouvée. Veuillez remplir vos informations.', {
            position: 'top-right',
            theme: 'colored',
          });
          navigate('/patient-info');
        }
      } catch (error) {
        toast.error('Erreur lors de la récupération des informations', {
          position: 'top-right',
          theme: 'colored',
        });
        navigate('/patient-info');
      } finally {
        setLoading(false);
      }
    };
    if (email && role === 'patient') {
      fetchUserInfo();
    } else {
      navigate('/login');
    }
  }, [email, role, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    toast.info('Déconnexion réussie. Redirection vers la page de connexion...', {
      position: 'top-right',
      autoClose: 2000,
      theme: 'colored',
    });
    setTimeout(() => navigate('/login'), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-teal-400">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-t-blue-600 border-gray-200 rounded-full"
        ></motion.div>
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
          Votre Profil HealthChain
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-50 rounded-xl p-6 shadow-inner"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className="text-lg text-gray-800">
              <strong className="font-semibold text-blue-600">Nom complet :</strong> {userData?.fullName}
            </p>
            <p className="text-lg text-gray-800">
              <strong className="font-semibold text-blue-600">Âge :</strong> {calculatedAge}
            </p>
            <p className="text-lg text-gray-800">
              <strong className="font-semibold text-blue-600">Genre :</strong> {userData?.gender}
            </p>
            <p className="text-lg text-gray-800">
              <strong className="font-semibold text-blue-600">Téléphone :</strong> {userData?.phoneCode} {userData?.phoneNumber}
            </p>
            <p className="text-lg text-gray-800">
              <strong className="font-semibold text-blue-600">Pays :</strong> {userData?.country}
            </p>
            <p className="text-lg text-gray-800">
              <strong className="font-semibold text-blue-600">Région :</strong> {userData?.region}
            </p>
            <p className="text-lg text-gray-800">
              <strong className="font-semibold text-blue-600">Date de naissance :</strong> {userData?.birthDate}
            </p>
            {userData?.patientAddress && (
              <p className="text-lg text-gray-800">
                <strong className="font-semibold text-blue-600">Adresse :</strong> {userData?.patientAddress}
              </p>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="mt-6 bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition duration-300 font-semibold w-full md:w-auto"
          >
            Se déconnecter
          </motion.button>
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-8 flex justify-center items-center space-x-3"
      >
        <img src={logo} alt="HealthChain Logo" className="h-10 w-auto" />
        <p className="text-sm text-white font-medium tracking-wide">Propulsé par HealthChain Trace &copy; 2025</p>
      </motion.div>
    </div>
  );
};

export default Profile;