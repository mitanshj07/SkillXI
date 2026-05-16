export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const adminConfigured = Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
  const kycConfigured = Boolean(process.env.KYC_PROVIDER_URL && process.env.KYC_API_KEY);
  const escrowConfigured = Boolean(process.env.ESCROW_ADDRESS || process.env.NEXT_PUBLIC_ESCROW_ADDRESS);
  res.status(200).json({
    ok: true,
    service: 'skillxi',
    timestamp: new Date().toISOString(),
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'local',
    integrations: {
      footballApi: Boolean(process.env.FOOTBALL_API_KEY),
      gemini: Boolean(process.env.GEMINI_API_KEY),
      openai: Boolean(process.env.OPENAI_API_KEY),
      supabaseUrl: Boolean(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL),
      supabaseAnon: Boolean(process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      adminAuth: adminConfigured,
      kycProvider: kycConfigured,
      escrow: escrowConfigured,
      paidBetaAllowlist: Boolean(process.env.PAID_BETA_ALLOWLIST)
    },
    controls: {
      restrictedCountries: (process.env.RESTRICTED_COUNTRIES || 'US,IN,CN,KP,IR,SY,CU,RU').split(',').map((item) => item.trim()).filter(Boolean),
      maxBetaEntrySol: Number(process.env.MAX_BETA_ENTRY_SOL || '0.25'),
      paidBetaMode: process.env.ALLOW_UNVERIFIED_DEVNET_PAID === 'true' ? 'devnet_unverified_allowed' : 'kyc_or_blocked',
      solanaNetwork: process.env.SOLANA_NETWORK || 'devnet'
    }
  });
}
