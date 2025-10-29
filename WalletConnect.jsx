// src/components/WalletConnect.jsx
import React, { useState } from 'react';
import { Client, Wallet, PrivateKey } from '@hashgraph/sdk';
import { motion } from 'framer-motion';

const WalletConnect = ({ onConnect }) => {
  const [connecting, setConnecting] = useState(false);

  const connectWallet = async () => {
    setConnecting(true);
    try {
      // Simule création de compte (en prod: HashPack, Blade, etc.)
      const privateKey = PrivateKey.generate();
      const publicKey = privateKey.publicKey;
      const accountId = publicKey.toAccountId(0, 0); // testnet

      const client = Client.forTestnet();
      client.setOperator(accountId, privateKey);

      onConnect({ client, privateKey: privateKey.toString(), accountId: accountId.toString() });
    } catch (error) {
      alert('Erreur wallet: ' + error.message);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={connectWallet}
      disabled={connecting}
      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
      {connecting ? 'Connexion...' : 'Connecter Wallet Hedera'}
    </motion.button>
  );
};

export default WalletConnect;
