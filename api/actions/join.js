import * as web3 from '@solana/web3.js';

const ESCROW_ADDRESS = '9WvVMvMKQYKnBgVe6egAH7NZ13ar4NB76PVsiG9vsEbN'; // Our demo escrow

// CORS configuration for Solana Actions
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Encoding, Accept-Encoding',
};

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).set(headers).send('');
  }

  // Handle GET request - Returns Action Metadata for Twitter/Blink rendering
  if (req.method === 'GET') {
    const payload = {
      title: "Join SkillXI Contest",
      icon: "https://raw.githubusercontent.com/mitanshj07/SkillXI/main/assets/icons/icon-512.png",
      description: "Enter the Man City vs Arsenal fantasy contest. Draft your lineup and win the 5 SOL prize pool!",
      label: "Pay 0.1 SOL Entry",
      links: {
        actions: [
          {
            label: "Join Contest (0.1 SOL)",
            href: "/api/actions/join"
          }
        ]
      }
    };
    return res.status(200).set(headers).json(payload);
  }

  // Handle POST request - Returns the actual Solana Transaction to sign
  if (req.method === 'POST') {
    try {
      const { account } = req.body;
      if (!account) {
        return res.status(400).set(headers).json({ error: 'Wallet account required' });
      }

      const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
      const fromPubkey = new web3.PublicKey(account);
      const toPubkey = new web3.PublicKey(ESCROW_ADDRESS);

      // Create 0.1 SOL transfer transaction
      const transaction = new web3.Transaction().add(
        web3.SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports: Math.floor(0.1 * web3.LAMPORTS_PER_SOL),
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromPubkey;

      // Serialize transaction to base64
      const serializedTransaction = transaction.serialize({ requireAllSignatures: false, verifySignatures: false });
      const base64Transaction = serializedTransaction.toString('base64');

      return res.status(200).set(headers).json({
        transaction: base64Transaction,
        message: "Successfully entered the SkillXI Contest! Draft your team now."
      });
      
    } catch (err) {
      console.error('Blink Error:', err);
      return res.status(500).set(headers).json({ error: 'Failed to create transaction' });
    }
  }

  return res.status(405).set(headers).json({ error: 'Method not allowed' });
}
