import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

const RequestCode = () => {
  const [publicKey, setPublicKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/request-code', { publicKey });
      setCode(data.code);
      toast.success('Code récupéré avec succès !', { position: 'top-right' });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Code non trouvé', { position: 'top-right' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-green-500 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8"
      >
        <motion.img
          src={logo}
          alt="HealthChain Logo"
          className="mx-auto h-20 sm:h-28 mb-6 w-auto"
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
          Récupérer votre Code d'Autorisation
        </motion.h2>
        <form onSubmit={handleRequest} className="space-y-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">Clé Publique Hedera</label>
            <input
              type="text"
              placeholder="Entrez votre clé publique (DER)"
              value={publicKey}
              onChange={(e) => setPublicKey(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
            {loading ? 'Récupération en cours...' : 'Récupérer mon code'}
          </motion.button>
        </form>
        {code && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center text-green-600 font-semibold"
          >
            Votre code : {code}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default RequestCode;