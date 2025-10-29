// express/service/create-rdv-topic.js
const { TopicCreateTransaction } = require('@hashgraph/sdk');
const { client } = require('../services/hedera');

async function createRdvTopic() {
  const tx = await new TopicCreateTransaction().execute(client);
  const receipt = await tx.getReceipt(client);
  const topicId = receipt.topicId;
  console.log("Topic RDV créé :", topicId.toString());
  return topicId.toString();
}

createRdvTopic().catch(console.error);