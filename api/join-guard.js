const RESTRICTED_COUNTRIES = (process.env.RESTRICTED_COUNTRIES || 'US,IN,CN,KP,IR,SY,CU,RU')
  .split(',')
  .map((item) => item.trim().toUpperCase())
  .filter(Boolean);

function parseAllowlist() {
  return (process.env.PAID_BETA_ALLOWLIST || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function countryFromRequest(req) {
  return String(
    req.headers['x-vercel-ip-country'] ||
    req.headers['cf-ipcountry'] ||
    req.headers['x-skillxi-country'] ||
    'UNKNOWN'
  ).toUpperCase();
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ allowed: false, reason: 'Method not allowed' });

  const body = req.body || {};
  const wallet = String(body.wallet || '').trim();
  const entryAmount = Number(body.entryAmount || 0);
  const entryMode = String(body.entryMode || (entryAmount > 0 ? 'paid_beta' : 'free'));
  const country = countryFromRequest(req);
  const allowlist = parseAllowlist();
  const kycConfigured = Boolean(process.env.KYC_PROVIDER_URL && process.env.KYC_API_KEY);
  const maxEntrySol = Number(process.env.MAX_BETA_ENTRY_SOL || '0.25');
  const paid = entryAmount > 0 || entryMode === 'paid_beta';

  const checks = {
    country,
    paid,
    kycConfigured,
    walletAllowlisted: allowlist.includes(wallet),
    maxEntrySol,
    network: process.env.SOLANA_NETWORK || 'devnet'
  };

  if (!wallet) return res.status(200).json({ allowed: false, reason: 'Connect wallet first.', checks });
  if (RESTRICTED_COUNTRIES.includes(country)) {
    return res.status(200).json({ allowed: false, reason: `Paid fantasy contests are not available in ${country}.`, checks });
  }
  if (!paid) return res.status(200).json({ allowed: true, reason: 'Free contest allowed.', checks });
  if (entryAmount > maxEntrySol) {
    return res.status(200).json({ allowed: false, reason: `Entry exceeds beta cap of ${maxEntrySol} SOL.`, checks });
  }
  if (!allowlist.length || !allowlist.includes(wallet)) {
    return res.status(200).json({ allowed: false, reason: 'Paid beta is invite-only. Add this wallet to PAID_BETA_ALLOWLIST.', checks });
  }
  if (!kycConfigured && process.env.ALLOW_UNVERIFIED_DEVNET_PAID !== 'true') {
    return res.status(200).json({ allowed: false, reason: 'KYC provider is not configured. Paid beta is blocked until KYC is enabled or ALLOW_UNVERIFIED_DEVNET_PAID=true for devnet testing.', checks });
  }

  return res.status(200).json({ allowed: true, reason: 'Paid beta guard passed.', checks });
}
