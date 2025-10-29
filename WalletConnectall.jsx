// src/components/WalletConnect.jsx
import React, { useState, useEffect } from 'react';
import { HashConnect } from 'hashconnect';
import { motion } from 'framer-motion';

const WalletConnect = ({ onConnect }) => {
  const [hashConnect, setHashConnect] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const initHashConnect = () => {
      const hc = new HashConnect();
      hc.init(
        'your-app-id', // Récup sur hashconnect.hashgraph.com
        'http://localhost:3000', // Ton app URL
        true // Testnet
      );
      setHashConnect(hc);
    };
    initHashConnect();
  }, []);

  const connect = async () => {
    if (!hashConnect) return;
    try {
      const account = await hashConnect.connect();
      setConnected(true);
      onConnect({
        accountId: account.accountIds[0],
        publicKey: account.publicKey,
        wallet: hashConnect
      });
    } catch (error) {
      alert('Erreur connexion: ' + error);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={connect}
      disabled={connected}
      className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50"
    >
      {connected ? 'Connecté' : 'Connecter HashPack'}
    </motion.button>
  );
};

export default WalletConnect;
