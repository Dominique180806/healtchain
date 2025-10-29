// src/pages/VerifyQR.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { QrCode, Shield, CheckCircle } from 'lucide-react';

const VerifyQR = () => {
  const [searchParams] = useSearchParams();
  const tokenId = searchParams.get('token');
  const email = searchParams.get('email');
  const [verified, setVerified] = useState(false);
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    if (tokenId && email) {
      verifyToken();
    }
  }, [tokenId, email]);

  const verifyToken = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/hedera/verify?token=${tokenId}&email=${email}`);
      setPatient(res.data);
      setVerified(true);
    } catch (error) {
      setVerified(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center"
      >
        {verified ? (
          <>
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-blue-600 mb-4">Accès Autorisé</h2>
            <p className="text-gray-700 mb-2">Patient: <strong>{patient.fullName}</strong></p>
            <p className="text-sm text-gray-500">Token: {tokenId}</p>
            <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold">
              Voir le dossier
            </button>
          </>
        ) : (
          <>
            <QrCode className="w-20 h-20 text-red-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-red-600 mb-4">Accès Refusé</h2>
            <p className="text-gray-700">Token invalide ou expiré</p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyQR;
