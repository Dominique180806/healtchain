const { Client, AccountId, PrivateKey, TopicCreateTransaction } = require('@hashgraph/sdk');
require('dotenv').config();

async function createTopic() {
  const client = Client.forTestnet();
  const operatorId = AccountId.fromString(process.env.HEDERA_OPERATOR_ID);
  const operatorKey = PrivateKey.fromStringECDSA(process.env.HEDERA_OPERATOR_KEY);

  client.setOperator(operatorId, operatorKey);

  try {
    // Créer le topic HCS
    const tx = await new TopicCreateTransaction().execute(client);
    const receipt = await tx.getReceipt(client);
    const topicId = receipt.topicId.toString();

    console.log('------------------------------ Topic Créé ------------------------------');
    console.log('Topic ID:', topicId);
    console.log('Hashscan URL:', `https://hashscan.io/testnet/topic/${topicId}`);
  } catch (error) {
    console.error('Erreur lors de la création du topic:', error);
  } finally {
    client.close();
  }
}

createTopic();