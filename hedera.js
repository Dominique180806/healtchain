//Express/services/hedera.js
const { Client, AccountId, PrivateKey } = require('@hashgraph/sdk');
require('dotenv').config();

const operatorId = AccountId.fromString(process.env.HEDERA_OPERATOR_ID);
const operatorKey = PrivateKey.fromStringECDSA(process.env.HEDERA_OPERATOR_KEY);
const client = Client.forTestnet().setOperator(operatorId, operatorKey);

module.exports = { client, operatorId, operatorKey };