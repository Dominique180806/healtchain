// /React/src/pages/Placeholder.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Placeholder = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur p-10 rounded-2xl shadow-2xl text-center max-w-md"
      >
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <p className="text-gray-300 mb-6">
          Cette fonctionnalité est en cours de développement.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          ← Retour
        </button>
      </motion.div>
    </div>
  );
};

export default Placeholder;