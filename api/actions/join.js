import { Connection, PublicKey, Transaction, TransactionInstruction, clusterApiUrl } from '@solana/web3.js';

const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');
const DEFAULT_CONTEST = 'football-mci-ars-classic';

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept-Encoding');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
}

function baseUrl(req) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'skill-xi-two.vercel.app';
  return `${proto}://${host}`;
}

function contestFromReq(req) {
  return String(req.query.contest || req.query.id || DEFAULT_CONTEST).slice(0, 80);
}

function contestTitle(contestId) {
  return contestId
    .replace(/^football-/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  const contestId = contestFromReq(req);
  const base = baseUrl(req);
  const title = contestTitle(contestId);
  const actionUrl = `${base}/api/actions/join?contest=${encodeURIComponent(contestId)}`;

  if (req.method === 'GET') {
    return res.status(200).json({
      type: 'action',
      icon: `${base}/assets/skillxi-blink.svg`,
      title: `SkillXI Proof: ${title}`,
      description: 'Create a Solana Memo proof that you joined or locked a SkillXI contest. No lineup details are written on-chain.',
      label: 'Create on-chain proof',
      links: {
        actions: [
          { label: 'Create proof receipt', href: actionUrl },
          { label: 'Open lineup builder', href: `${base}/lineup.html?contest=${encodeURIComponent(contestId)}` },
          { label: 'View contest lobby', href: `${base}/match-lobby.html?id=${encodeURIComponent(contestId)}` }
        ]
      }
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  try {
    const account = new PublicKey(req.body?.account || req.body?.wallet || '');
    const network = process.env.SOLANA_NETWORK === 'mainnet-beta' ? 'mainnet-beta' : 'devnet';
    const connection = new Connection(process.env.SOLANA_RPC_URL || clusterApiUrl(network), 'confirmed');
    const memo = JSON.stringify({
      app: 'SkillXI',
      type: 'proof_of_lineup_intent',
      contest: contestId,
      privacy: 'lineup_hidden_offchain',
      ts: new Date().toISOString()
    });
    const instruction = new TransactionInstruction({
      programId: MEMO_PROGRAM_ID,
      keys: [{ pubkey: account, isSigner: true, isWritable: false }],
      data: Buffer.from(memo, 'utf8')
    });
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    const tx = new Transaction({ feePayer: account, recentBlockhash: blockhash }).add(instruction);
    const serialized = tx.serialize({ requireAllSignatures: false, verifySignatures: false }).toString('base64');
    return res.status(200).json({
      transaction: serialized,
      message: `Create a SkillXI on-chain proof receipt for ${title}. This writes only a memo, not your lineup.`,
      links: {
        next: {
          type: 'post',
          href: `${base}/api/actions/join/complete?contest=${encodeURIComponent(contestId)}&lastValidBlockHeight=${lastValidBlockHeight}`
        }
      }
    });
  } catch (error) {
    return res.status(400).json({ error: { message: error.message || 'Could not create SkillXI proof transaction.' } });
  }
}
