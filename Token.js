const express = require('express');
const router = express.Router();
const { Client, TokenCreateTransaction, TokenAssociateTransaction, AccountBalanceQuery, PrivateKey, TokenMintTransaction } = require('@hashgraph/sdk');
const QRCode = require('qrcode');
require('dotenv').config();

// Client Hedera
const client = Client.forTestnet(); // ou .forMainnet()
client.setOperator(process.env.HEDERA_ACCOUNT_ID, process.env.HEDERA_PRIVATE_KEY);

// Créer un token pour le patient
router.post('/create-token', async (req, res) => {
  try {
    const { email } = req.body;

    // Créer clé privée pour le patient
    const patientPrivateKey = PrivateKey.generate();
    const patientPublicKey = patientPrivateKey.publicKey;

    // Créer transaction token
    const createTokenTx = new TokenCreateTransaction()
      .setTokenName("HealthToken - " + email)
      .setTokenSymbol("HLT")
      .setDecimals(0)
      .setInitialSupply(1)
      .setTreasuryAccountId(client.operatorAccountId)
      .setAdminKey(client.operatorPublicKey)
      .setSupplyKey(client.operatorPublicKey);

    const txResponse = await createTokenTx.execute(client);
    const receipt = await txResponse.getReceipt(client);
    const tokenId = receipt.tokenId;

    // Générer QR Code
    const qrData = `https://healthchain.africa/verify?token=${tokenId}&email=${email}`;
    const qrCode = await QRCode.toDataURL(qrData);

    res.json({
      tokenId: tokenId.toString(),
      qrCode,
      privateKey: patientPrivateKey.toString(),
      publicKey: patientPublicKey.toString(),
      message: 'Token créé + QR généré'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Associer token au patient (si besoin)
router.post('/associate-token', async (req, res) => {
  const { tokenId, patientAccountId, patientPrivateKey } = req.body;
  const patientClient = Client.forTestnet().setOperator(patientAccountId, patientPrivateKey);

  const associateTx = new TokenAssociateTransaction()
    .setAccountId(patientAccountId)
    .setTokenIds([tokenId])
    .freezeWith(patientClient);

  const signTx = await associateTx.sign(PrivateKey.fromString(patientPrivateKey));
  const txResponse = await signTx.execute(patientClient);
  const receipt = await txResponse.getReceipt(patientClient);

  res.json({ status: receipt.status.toString() });
});

module.exports = router;
