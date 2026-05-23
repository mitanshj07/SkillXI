function getPath() {
  const parts = window.location.pathname.split('/');
  return parts[parts.length - 1] || 'index.html';
}

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch (_error) {
    return fallback;
  }
}

function readStore(key, fallback) {
  return safeJsonParse(window.localStorage.getItem(key), fallback);
}

function writeStore(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function getSavedWallet() {
  return window.localStorage.getItem(STORAGE_KEYS.wallet) || '';
}

function getSavedWalletType() {
  return window.localStorage.getItem(STORAGE_KEYS.walletType) || 'phantom';
}

function shortWallet(wallet) {
  return wallet ? `${wallet.slice(0, 4)}...${wallet.slice(-4)}` : 'Not connected';
}

function formatSol(amount) {
  return `${Number(amount || 0).toFixed(2)} SOL`;
}

function formatUsd(amount) {
  return `$${Number(amount || 0).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
}

function formatDate(dateString) {
  if (!dateString) return 'TBD';
  const date = new Date(dateString);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function timeUntil(dateString) {
  const diffMs = new Date(dateString).getTime() - Date.now();
  if (diffMs <= 0) return 'Locked';
  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function normalizeContest(contest) {
  if (!contest) return null;
  return {
    id: contest.id || contest.contest_id || `contest-${Math.random().toString(36).slice(2, 8)}`,
    title: contest.title || contest.name || 'SkillXI Contest',
    sport: (contest.sport || 'football').toLowerCase(),
    league: contest.league || contest.competition || 'Featured',
    fixture_id: contest.fixture_id || contest.match_id || '',
    entry_mode: contest.entry_mode || (Number(contest.entry_amount) > 0 ? 'paid_beta' : 'free'),
    entry_asset: contest.entry_asset || 'SOL',
    entry_amount: Number(contest.entry_amount || 0),
    prize_pool: contest.prize_pool || (Number(contest.entry_amount) > 0 ? `${Number(contest.entry_amount || 0) * 16} SOL` : 'Reputation rewards'),
    lineup_visibility: contest.lineup_visibility || 'hidden_until_lock',
    status: contest.status || 'upcoming',
    starts_at: contest.starts_at || contest.start_time || contest.kickoff_at || new Date(Date.now() + 86400000).toISOString(),
    contest_size: Number(contest.contest_size || contest.max_entries || 100),
    joined: Number(contest.joined || contest.entries_count || 0),
    scoring_ruleset_id: contest.scoring_ruleset_id || 'football_classic_v1',
    beta: Boolean(contest.beta || contest.entry_mode === 'paid_beta'),
    source: contest.source || 'supabase'
  };
}

function normalizeUser(user, rank = 0) {
  return {
    id: user.id || `user-${rank}`,
    username: user.username || user.handle || shortWallet(user.wallet_address || user.id || ''),
    wallet_address: user.wallet_address || user.primary_wallet || user.id || '',
    skill_score: Number(user.skill_score || 500),
    total_earned: Number(user.total_earned || 0),
    reputation_score: Number(user.reputation_score || Math.max(40, 100 - rank * 4)),
    beta_access: Boolean(user.beta_access),
    rank: rank + 1
  };
}

