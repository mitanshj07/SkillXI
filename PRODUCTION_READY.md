# SkillXI Production Readiness

SkillXI is now wired as a wallet-native fantasy football beta with live fixture ingestion, fallback-safe pages, serverless AI/sports proxies, wallet-required joins, encrypted remote lineup storage, admin auth, join compliance/risk checks, local/Supabase entry persistence, scoring, settlement, and admin controls.

## Required Vercel Environment Variables

- `FOOTBALL_API_KEY`: API-Football key used only by `/api/scores`.
- `GEMINI_API_KEY`: Gemini key used only by `/api/ai`.
- `OPENAI_API_KEY`: optional fallback for `/api/ai`.
- `SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key.
- `ADMIN_PASSWORD`: long random admin password for `/admin.html`.
- `ADMIN_SESSION_SECRET`: long random signing secret for admin session tokens.
- `PAID_BETA_ALLOWLIST`: comma-separated wallet addresses allowed into paid beta.
- `RESTRICTED_COUNTRIES`: comma-separated country codes blocked from paid contests.
- `MAX_BETA_ENTRY_SOL`: maximum paid beta entry size.
- `KYC_PROVIDER_URL` and `KYC_API_KEY`: required before paid beta is opened beyond explicit devnet testing.
- `ESCROW_ADDRESS`, `ESCROW_OWNER_WALLET`, `SOLANA_NETWORK`: escrow and payout operations configuration.

## Post-Deploy Checks

1. Open `/api/health` and confirm required integrations are `true`.
2. Open `/contests.html`; it should render live API-Football fixtures when the key is configured, otherwise safe fallback contests.
3. Connect Phantom or Solflare; the nav should show the truncated wallet on reload.
4. Join a free contest; confirm/pay should require a connected wallet before saving the entry.
5. Try a paid beta contest; it should block unless the wallet is allowlisted, the region is allowed, the entry cap passes, and KYC/devnet override rules pass.
6. Open `/admin.html`; login should require `ADMIN_PASSWORD` through `/api/admin`, not a hardcoded frontend password.
7. Settle a contest, then verify leaderboard/profile/payout states update.
8. Inspect Supabase `entries`; pre-reveal lineups should be stored as encrypted envelopes/hash, not plaintext lineup data.

## Safety Notes

- Paid contests remain devnet beta until legal, KYC, escrow custody, geo-gating, payout operations, and incident response are formally approved.
- Private lineup beta means encrypted remote lineup storage plus delayed reveal. It is not a fully deployed Solana stealth-payment protocol.
- Admin auth now uses signed server tokens, but any production admin mutations should still be moved fully server-side before real-money launch.
