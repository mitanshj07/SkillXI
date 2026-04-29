import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { createV1, TokenStandard } from '@metaplex-foundation/mpl-token-metadata';
import { keypairIdentity, generateSigner, publicKey } from '@metaplex-foundation/umi';
import bs58 from 'bs58';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { wallet, badge } = req.body;

  if (!wallet || !badge) {
    return res.status(400).json({ error: 'Wallet and badge type required' });
  }

  try {
    console.log(`[METAPLEX UMI] Initiating ${badge} NFT Mint for ${wallet}...`);

    // 1. Initialize Umi SDK on Devnet
    const umi = createUmi('https://api.devnet.solana.com');

    // 2. Load the App's Master Keypair (Authority)
    // Using demo key or env var
    const SECRET_KEY = process.env.SOLANA_PRIVATE_KEY || '5MigoBnVtF9LndCYVb2Hndy7RkZ7x4dJbA3B9oA1HhN37Ggx4qC3fN7RkZ7x4dJbA3B9oA1HhN37Ggx4qC3fN7Rk';
    let keypair;
    try {
        keypair = umi.eddsa.createKeypairFromSecretKey(bs58.decode(SECRET_KEY));
    } catch(e) {
        keypair = umi.eddsa.generateKeypair(); // Fallback for local testing
    }
    umi.use(keypairIdentity(keypair));

    // 3. Generate a new Mint Signer for the NFT
    const mint = generateSigner(umi);
    const recipientPubKey = publicKey(wallet);

    const badgeName = badge === 'bronze_analyst' ? 'SkillXI Bronze Analyst' : 'SkillXI Elite Badge';

    // 4. Create the NFT using MPL Token Metadata SDK
    console.log('[METAPLEX UMI] Sending Transaction to Solana...');
    await createV1(umi, {
        mint,
        authority: umi.identity,
        name: badgeName,
        symbol: 'SXI',
        uri: 'https://raw.githubusercontent.com/mitanshj07/SkillXI/main/assets/nft-metadata.json',
        sellerFeeBasisPoints: 0,
        tokenStandard: TokenStandard.NonFungible,
        tokenOwner: recipientPubKey,
    }).sendAndConfirm(umi);

    console.log(`[METAPLEX SUCCESS] Minted ${mint.publicKey} to ${wallet}`);

    res.status(200).json({
      success: true,
      mintAddress: mint.publicKey,
      explorerUrl: `https://solscan.io/token/${mint.publicKey}?cluster=devnet`,
      message: `Successfully minted ${badgeName} NFT to ${wallet}`
    });
  } catch (err) {
    console.error('[METAPLEX ERROR] Minting failed:', err);
    res.status(500).json({ error: err.message });
  }
}
