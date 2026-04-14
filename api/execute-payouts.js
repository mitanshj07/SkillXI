const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const solanaWeb3 = require('@solana/web3.js');
const bs58 = require('bs58'); // Required to decode string private keys

// Init Supabase with Admin rights
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const FOOTBALL_API_KEY = process.env.FOOTBALL_API_KEY;
const FOOTBALL_API_URL = 'https://v3.football.api-sports.io';
const SOLANA_PRIVATE_KEY = process.env.SOLANA_PRIVATE_KEY; // The escrow's base58 private key

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  console.log('💰 Starting Automated Payouts Job...');

  try {
    // 1. Identify Matches that just moved to FT (Finished) but payouts un-processed
    // In our DB, we keep status as 'FT', but we can have an 'is_payout_complete' boolean. 
    // Here we find 'FT' matches with no payout flag.
    const { data: finishedMatches } = await supabase.from('matches')
        .select('*').eq('status', 'FT').eq('payouts_completed', false);

    if (!finishedMatches || finishedMatches.length === 0) {
        return res.status(200).json({ success: true, message: 'No finished matches awaiting payout' });
    }

    if (!SOLANA_PRIVATE_KEY) {
        throw new Error('Server missing SOLANA_PRIVATE_KEY to execute automated transfers');
    }

    // Load Escrow Keypair
    const secretKeyArray = bs58.default.decode(SOLANA_PRIVATE_KEY);
    const escrowKeypair = solanaWeb3.Keypair.fromSecretKey(secretKeyArray);
    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'), 'confirmed');

    for (const match of finishedMatches) {
        console.log(`Processing Match ${match.id} | Prize Pool: ${match.prize} SOL`);

        // 2. Fetch Top Entry (Winner Takes All logic for now)
        const { data: topEntries } = await supabase.from('entries')
             .select('*')
             .eq('match_id', match.id)
             .order('total_points', { ascending: false })
             .limit(1);

        if (topEntries.length > 0) {
            const winner = topEntries[0];
            console.log(`Winner identified: ${winner.user_wallet} with ${winner.total_points} PTS`);

            // 3. Create & Execute Solana Transaction
            const transaction = new solanaWeb3.Transaction().add(
              solanaWeb3.SystemProgram.transfer({
                 fromPubkey: escrowKeypair.publicKey,
                 toPubkey: new solanaWeb3.PublicKey(winner.user_wallet),
                 lamports: Math.floor(match.prize * solanaWeb3.LAMPORTS_PER_SOL),
              })
            );

            // Fetch blockhash and sign
            const { blockhash } = await connection.getLatestBlockhash('confirmed');
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = escrowKeypair.publicKey;
            transaction.sign(escrowKeypair);

            // Send Transaction
            const txSignature = await connection.sendRawTransaction(transaction.serialize());
            console.log(`✅ Payout sent! Signature: ${txSignature}`);

            // 4. Record Payout Status in Supabase
            await supabase.from('entries').update({
                 payout_tx: txSignature,
                 status: 'won'
            }).eq('id', winner.id);
        }

        // 5. Mark match as completed
        await supabase.from('matches').update({ payouts_completed: true }).eq('id', match.id);
    }

    return res.status(200).json({ success: true, message: 'Payouts Executed and Recorded!' });
  } catch (err) {
    console.error('Error during automated payouts:', err.message);
    return res.status(500).json({ error: 'Payout execution failed', details: err.message });
  }
}
