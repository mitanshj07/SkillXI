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
    console.log(`Minting ${badge} for ${wallet}...`);
    
    // Simulate Metaplex / cNFT minting delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock mint address
    const mintAddress = 'badge_' + Math.random().toString(36).substring(7);

    res.status(200).json({
      success: true,
      mintAddress: mintAddress,
      explorerUrl: `https://solscan.io/token/${mintAddress}?cluster=devnet`,
      message: `Successfully minted ${badge} badge to ${wallet}`
    });
  } catch (err) {
    console.error('Minting error:', err);
    res.status(500).json({ error: err.message });
  }
}
