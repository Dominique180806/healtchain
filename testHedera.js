const { client } = require('./services/hedera');
const { AccountBalanceQuery } = require('@hashgraph/sdk');

async function testHedera() {
  try {
    const balance = await new AccountBalanceQuery()
      .setAccountId(client.operatorAccountId)
      .execute(client);
    console.log(`Balance: ${balance.hbars.toString()} hbars`);
  } catch (error) {
    console.error('Erreur Hedera:', error);
  }
}

testHedera();