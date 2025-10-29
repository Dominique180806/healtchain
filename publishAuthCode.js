const { Client, AccountId, PrivateKey, TopicMessageSubmitTransaction } = require('@hashgraph/sdk');
require('dotenv').config();

async function publishAuthCode(code, role, publicKey) {
  const client = Client.forTestnet();
  const operatorId = AccountId.fromString(process.env.HEDERA_OPERATOR_ID);
  const operatorKey = PrivateKey.fromStringECDSA(process.env.HEDERA_OPERATOR_KEY);

  client.setOperator(operatorId, operatorKey);

  try {
    const data = { code, role, publicKey };
    const message = JSON.stringify(data);
    const topicId = '0.0.7129100'; // Ton topic HCS

    const hcsTx = await new TopicMessageSubmitTransaction()
      .setTopicId(topicId)
      .setMessage(message)
      .execute(client);
    const hcsReceipt = await hcsTx.getReceipt(client);

    console.log('------------------------------ Code Publié ------------------------------');
    console.log('Code:', code);
    console.log('Rôle:', role);
    console.log('Clé Publique:', publicKey);
    console.log('HCS Tx ID:', hcsReceipt.topicSequenceNumber.toString());
    console.log('Hashscan URL:', `https://hashscan.io/testnet/topic/${topicId}`);
  } catch (error) {
    console.error('Erreur lors de la publication du code:', error);
  } finally {
    client.close();
  }
}

// Exemple : node publishAuthCode.js DOC-abc123 doctor <publicKey>
const [,, code, role, publicKey] = process.argv;
if (code && role && publicKey) {
  publishAuthCode(code, role, publicKey);
} else {
  console.log('Usage: node publishAuthCode.js <code> <role> <publicKey>');
}