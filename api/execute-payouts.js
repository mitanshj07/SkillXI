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
    const secretKeyArray = bs58.decode(SOLANA_PRIVATE_KEY);
    const escrowKeypair = solanaWeb3.Keypair.fromSecretKey(secretKeyArray);
    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'), 'confirmed');

    for (const match of finishedMatches) {
        console.log(`Processing Match ${match.id} | Prize Pool: ${match.prize} SOL`);

        // 2. Fetch All Entries for this match, sorted by points
        const { data: allEntries } = await supabase.from('entries')
             .select('*')
             .eq('match_id', match.id)
             .order('total_points', { ascending: false });

        if (!allEntries || allEntries.length === 0) {
            console.log(`No entries for match ${match.id}. Skipping.`);
            await supabase.from('matches').update({ payouts_completed: true }).eq('id', match.id);
            continue;
        }

        // 3. Calculate Prize Distribution (Top 20% win)
        const totalPrize = parseFloat(match.prize);
        const winnersCount = Math.max(1, Math.floor(allEntries.length * 0.2));
        const winners = allEntries.slice(0, winnersCount);

        console.log(`Total Winners: ${winnersCount} / ${allEntries.length} entries`);

        for (let i = 0; i < winners.length; i++) {
            const player = winners[i];
            let prizeAmount = 0;

            // Tiered logic
            if (i === 0) { // 1st Place (40%)
                prizeAmount = winnersCount === 1 ? totalPrize : totalPrize * 0.4;
            } else if (i === 1) { // 2nd Place (20%)
                prizeAmount = totalPrize * 0.2;
            } else if (i === 2) { // 3rd Place (10%)
                prizeAmount = totalPrize * 0.1;
            } else { // Others in top 20% (Shared 30%)
                const remainingPrize = totalPrize * 0.3;
                const sharedCount = winnersCount - 3;
                prizeAmount = remainingPrize / sharedCount;
            }

            if (prizeAmount <= 0) continue;

            console.log(`Rank #${i+1}: ${player.user_wallet} | Prize: ${prizeAmount.toFixed(4)} SOL`);

            try {
                // 4. Create & Execute Solana Transaction
                const transaction = new solanaWeb3.Transaction().add(
                  solanaWeb3.SystemProgram.transfer({
                     fromPubkey: escrowKeypair.publicKey,
                     toPubkey: new solanaWeb3.PublicKey(player.user_wallet),
                     lamports: Math.floor(prizeAmount * solanaWeb3.LAMPORTS_PER_SOL),
                  })
                );

                const { blockhash } = await connection.getLatestBlockhash('confirmed');
                transaction.recentBlockhash = blockhash;
                transaction.feePayer = escrowKeypair.publicKey;
                transaction.sign(escrowKeypair);

                const txSignature = await connection.sendRawTransaction(transaction.serialize());
                console.log(`   ✅ Sent Rank #${i+1} payout: ${txSignature}`);

                // 5. Update Entry Record
                await supabase.from('entries').update({
                     payout_tx: txSignature,
                     prize_won: prizeAmount,
                     status: 'won',
                     rank: i + 1
                }).eq('id', player.id);
                
                // 6. Update Profile Stats
                const { data: profile } = await supabase.from('profiles').select('skill_score, contests_won, total_earned').eq('wallet_id', player.user_wallet).single();
                if (profile) {
                    await supabase.from('profiles').update({
                        skill_score: (profile.skill_score || 500) + (i < 3 ? 25 : 10),
                        contests_won: (profile.contests_won || 0) + 1,
                        total_earned: (profile.total_earned || 0) + prizeAmount
                    }).eq('wallet_id', player.user_wallet);
                }
            } catch (txErr) {
                console.error(`   ❌ Failed payout for ${player.user_wallet}:`, txErr.message);
            }
        }

        // 7. Mark match as completed
        await supabase.from('matches').update({ payouts_completed: true }).eq('id', match.id);
    }

    return res.status(200).json({ success: true, message: 'Payouts Executed and Recorded!' });
  } catch (err) {
    console.error('Error during automated payouts:', err.message);
    return res.status(500).json({ error: 'Payout execution failed', details: err.message });
  }
}
