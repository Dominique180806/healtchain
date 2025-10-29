// Ajoute import
import { Client, TokenCreateTransaction, PrivateKey } from '@hashgraph/sdk';
import WalletConnect from '../components/WalletConnect';

// Dans le composant
const [wallet, setWallet] = useState(null);

const mintMedicalNFT = async () => {
  if (!wallet) return;

  const client = Client.forTestnet();
  client.setOperator(wallet.accountId, wallet.publicKey);

  // Créer NFT (HTS)
  const tx = new TokenCreateTransaction()
    .setTokenName('MedicalRecord NFT')
    .setTokenSymbol('MEDREC')
    .setDecimals(0)
    .setInitialSupply(1)
    .setTreasuryAccountId(wallet.accountId)
    .setSupplyKey(wallet.publicKey)
    .setAdminKey(wallet.publicKey);

  const response = await tx.execute(client);
  const receipt = await response.getReceipt(client);
  const tokenId = receipt.tokenId.toString();

  // Mint NFT (1 instance unique)
  const mintTx = new TokenMintTransaction()
    .setTokenId(tokenId)
    .setAmount(1);

  const mintResponse = await mintTx.execute(client);
  await mintResponse.getReceipt(client);

  // Générer QR
  const qrData = `https://healthchain.africa/nft?token=${tokenId}&owner=${wallet.accountId}`;
  const qrCode = <QRCode value={qrData} size={200} />;

  toast.success(`NFT Minted: ${tokenId}`);
  setDossierNFT({ tokenId, qrCode });
};

return (
  <div className="...">
    {/* Formulaire */}
    <WalletConnect onConnect={setWallet} />
    <button onClick={mintMedicalNFT} className="bg-green-600 text-white px-6 py-3 rounded-xl">
      Mint NFT Dossier
    </button>
    {dossierNFT && <img src={dossierNFT.qrCode} alt="QR NFT" />}
  </div>
);
