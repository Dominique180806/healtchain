// src/pages/VerifyNFT.jsx
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Client } from '@hashgraph/sdk';

const VerifyNFT = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('nft');
  const [verified, setVerified] = useState(false);
  const [owner, setOwner] = useState('');

  const verify = async () => {
    const client = Client.forTestnet();
    const balance = await new AccountBalanceQuery().setAccountId(token).execute(client);
    setVerified(balance.tokens.has(token));
    setOwner(balance.accountId.toString());
  };

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center">
      <motion.div
        animate={{ scale: verified ? 1 : 0.95 }}
        className="bg-white p-8 rounded-2xl shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-4">Vérification NFT</h2>
        <p>Token: {token}</p>
        <p>Propriétaire: {owner}</p>
        {verified ? <CheckCircle className="w-16 h-16 text-green-500" /> : <AlertCircle className="w-16 h-16 text-red-500" />}
      </motion.div>
    </div>
  );
};

export default VerifyNFT;
