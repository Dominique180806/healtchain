// src/components/HashPackWallet.jsx
import React, { useState, useEffect } from 'react';
import { HashConnect } from 'hashconnect';
import { motion } from 'framer-motion';

const HashPackWallet = ({ onConnect, onDisconnect }) => {
  const [hashconnect, setHashconnect] = useState(null);
  const [pairingData, setPairingData] = useState(null);
  const [accountId, setAccountId] = useState('');
  const [balance, setBalance] = useState('0');

  useEffect(() => {
    const init = async () => {
      const hc = new HashConnect();
      await hc.init('healthchain-app', 'https://healthchain.africa', true); // testnet
      hc.pairingEvent.on((data) => {
        setPairingData(data);
        setAccountId(data.accountIds[0]);
        onConnect({ accountId: data.accountIds[0], pairingData: data });
      });
      setHashconnect(hc);
    };
    init();
  }, [onConnect]);

  const connect = () => {
    if (hashconnect) {
      const pairingString = hashconnect.generatePairingString();
      hashconnect.connectToWallet(pairingString);
    }
  };

  const disconnect = () => {
    hashconnect?.disconnect();
    setPairingData(null);
    setAccountId('');
    onDisconnect();
  };

  return (
    <div className="flex items-center gap-3">
      {pairingData ? (
        <>
          <span className="text-sm font-medium">{accountId.slice(0, 10)}...</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={disconnect}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            Déconnecter
          </motion.button>
        </>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={connect}
          className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
          </svg>
          Payer avec HashPack
        </motion.button>
      )}
    </div>
  );
};

export default HashPackWallet;
