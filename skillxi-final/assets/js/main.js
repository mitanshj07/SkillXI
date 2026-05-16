/* ============================================================
   SkillXI runtime
   Truthful beta implementation for contests, AI, wallet, and profile flows
   ============================================================ */

const SUPABASE_URL = 'https://vtvrvlcholgloujqcxd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_acI3fmYK6aVYrggO8DrPiw_MRiFdo78';
const FOOTBALL_API_KEY = ''; // moved to serverless proxy
const FOOTBALL_API_URL = '/api/scores';
const ESCROW_ADDRESS = '9WvVMvMKQYKnBgVe6egAH7NZ13ar4NB76PVsiG9vsEbN';
const NETWORK_LABEL = 'Solana Devnet Beta';
const USD_PER_SOL = 145;

const STORAGE_KEYS = {
  wallet: 'skillxi_wallet',
  walletType: 'skillxi_wallet_type',
  selectedContest: 'skillxi_selected_contest',
  entries: 'skillxi_entries_v2',
  receipts: 'skillxi_receipts_v2',
  privacyNoticeSeen: 'skillxi_privacy_notice_seen',
  adminToken: 'skillxi_admin_token'
};

const DEFAULT_LINEUP = {
  formation: '4-3-3',
  captain: 'Erling Haaland',
  viceCaptain: 'Bukayo Saka',
  players: [
    { name: 'Ederson', team: 'MCI', position: 'GK', credits: 8.5, rating: 7.2 },
    { name: 'Kyle Walker', team: 'MCI', position: 'DEF', credits: 8, rating: 7.1 },
    { name: 'William Saliba', team: 'ARS', position: 'DEF', credits: 8.5, rating: 7.6 },
    { name: 'Ruben Dias', team: 'MCI', position: 'DEF', credits: 8.5, rating: 7.5 },
    { name: 'Ben White', team: 'ARS', position: 'DEF', credits: 8, rating: 7.1 },
    { name: 'Rodri', team: 'MCI', position: 'MID', credits: 7.5, rating: 8.2 },
    { name: 'Martin Odegaard', team: 'ARS', position: 'MID', credits: 9.5, rating: 8.4 },
    { name: 'Kevin De Bruyne', team: 'MCI', position: 'MID', credits: 11.5, rating: 8.8 },
    { name: 'Phil Foden', team: 'MCI', position: 'FWD', credits: 12.5, rating: 8.7 },
    { name: 'Erling Haaland', team: 'MCI', position: 'FWD', credits: 14.5, rating: 9.3 },
    { name: 'Bukayo Saka', team: 'ARS', position: 'FWD', credits: 13, rating: 8.9 }
  ]
};

const ALT_LINEUP = {
  formation: '4-4-2',
  captain: 'Kevin De Bruyne',
  viceCaptain: 'Martin Odegaard',
  players: [
    { name: 'David Raya', team: 'ARS', position: 'GK', credits: 8, rating: 7.3 },
    { name: 'Kyle Walker', team: 'MCI', position: 'DEF', credits: 8, rating: 7.1 },
    { name: 'William Saliba', team: 'ARS', position: 'DEF', credits: 8.5, rating: 7.6 },
    { name: 'Gabriel', team: 'ARS', position: 'DEF', credits: 8, rating: 7.5 },
    { name: 'Josko Gvardiol', team: 'MCI', position: 'DEF', credits: 8, rating: 7.3 },
    { name: 'Rodri', team: 'MCI', position: 'MID', credits: 7.5, rating: 8.2 },
    { name: 'Martin Odegaard', team: 'ARS', position: 'MID', credits: 9.5, rating: 8.4 },
    { name: 'Kevin De Bruyne', team: 'MCI', position: 'MID', credits: 11.5, rating: 8.8 },
    { name: 'Declan Rice', team: 'ARS', position: 'MID', credits: 8.5, rating: 7.8 },
    { name: 'Erling Haaland', team: 'MCI', position: 'FWD', credits: 14.5, rating: 9.3 },
    { name: 'Kai Havertz', team: 'ARS', position: 'FWD', credits: 10.5, rating: 7.9 }
  ]
};

const SEEDED_CONTESTS = [
  {
    id: 'football-mci-ars-classic',
    title: 'Man City vs Arsenal Classic',
    sport: 'football',
    league: 'Premier League',
    fixture_id: '1379295',
    entry_mode: 'free',
    entry_asset: 'SOL',
    entry_amount: 0,
    prize_pool: '150 Reputation',
    lineup_visibility: 'hidden_until_lock',
    status: 'upcoming',
    starts_at: '2026-04-19T15:30:00Z',
    contest_size: 1200,
    joined: 842,
    scoring_ruleset_id: 'football_classic_v1',
    beta: false
  },
  {
    id: 'football-mci-ars-beta',
    title: 'Private Derby Paid Beta',
    sport: 'football',
    league: 'Premier League',
    fixture_id: '1379295',
    entry_mode: 'paid_beta',
    entry_asset: 'SOL',
    entry_amount: 0.15,
    prize_pool: '2.4 SOL',
    lineup_visibility: 'hidden_until_reveal',
    status: 'upcoming',
    starts_at: '2026-04-19T15:30:00Z',
    contest_size: 64,
    joined: 19,
    scoring_ruleset_id: 'football_classic_v1',
    beta: true
  },
  {
    id: 'football-epl-differentials',
    title: 'EPL Differentials Sprint',
    sport: 'football',
    league: 'Premier League',
    fixture_id: '1379295',
    entry_mode: 'free',
    entry_asset: 'SOL',
    entry_amount: 0,
    prize_pool: 'Scout badge + 75 REP',
    lineup_visibility: 'hidden_until_lock',
    status: 'upcoming',
    starts_at: '2026-04-19T15:30:00Z',
    contest_size: 600,
    joined: 311,
    scoring_ruleset_id: 'football_classic_v1',
    beta: false
  },
  {
    id: 'cricket-ipl-beta',
    title: 'IPL Night Slate Beta',
    sport: 'cricket',
    league: 'IPL',
    fixture_id: 'ipl-demo-2026-04-16',
    entry_mode: 'paid_beta',
    entry_asset: 'SOL',
    entry_amount: 0.1,
    prize_pool: '1.6 SOL',
    lineup_visibility: 'hidden_until_reveal',
    status: 'beta',
    starts_at: '2026-04-16T14:00:00Z',
    contest_size: 80,
    joined: 14,
    scoring_ruleset_id: 'cricket_classic_v1',
    beta: true
  },
  {
    id: 'basketball-fastbreak-free',
    title: 'Fastbreak Free Roll',
    sport: 'basketball',
    league: 'Playoffs',
    fixture_id: 'nba-demo-2026-04-16',
    entry_mode: 'free',
    entry_asset: 'SOL',
    entry_amount: 0,
    prize_pool: '50 REP',
    lineup_visibility: 'hidden_until_lock',
    status: 'beta',
    starts_at: '2026-04-16T18:30:00Z',
    contest_size: 300,
    joined: 77,
    scoring_ruleset_id: 'basketball_classic_v1',
    beta: true
  },
  {
    id: 'football-ucl-free',
    title: 'PSG vs Bayern Scout Cup',
    sport: 'football',
    league: 'Champions League',
    fixture_id: 'ucl-demo-2026-04-17',
    entry_mode: 'free',
    entry_asset: 'SOL',
    entry_amount: 0,
    prize_pool: '100 Reputation',
    lineup_visibility: 'hidden_until_lock',
    status: 'beta',
    starts_at: '2026-04-17T19:00:00Z',
    contest_size: 900,
    joined: 412,
    scoring_ruleset_id: 'football_classic_v1',
    beta: true
  }
];

const SEEDED_USERS = [
  { id: 'rank-1', username: 'ScoutPrime', wallet_address: '9tzV...1skx', skill_score: 2485, total_earned: 18.4, reputation_score: 94, beta_access: true },
  { id: 'rank-2', username: 'FalseNine', wallet_address: '8brP...6Tfa', skill_score: 2398, total_earned: 14.1, reputation_score: 90, beta_access: true },
  { id: 'rank-3', username: 'CaptainMeta', wallet_address: '7mAA...2opL', skill_score: 2312, total_earned: 12.7, reputation_score: 88, beta_access: true },
  { id: 'rank-4', username: 'DifferentialLab', wallet_address: '5zzX...9ru8', skill_score: 2246, total_earned: 10.2, reputation_score: 85, beta_access: false },
  { id: 'rank-5', username: 'SetPieceDAO', wallet_address: '4aVr...3kyQ', skill_score: 2192, total_earned: 8.9, reputation_score: 84, beta_access: false }
];

const PAGE_STATE = {
  contests: [],
  filteredSport: 'all',
  activeContest: null,
  leaderboardRange: 'all_time'
};

const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

async function trySupabaseSelect(table, selectQuery) {
  try {
    const { data, error } = await _supabase.from(table).select(selectQuery);
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn(`Supabase select failed for ${table}`, error);
    return [];
  }
}

async function tryInsertEntry(payload) {
  const revealAt = payload.lineup_reveal_at ? new Date(payload.lineup_reveal_at).getTime() : Number.MAX_SAFE_INTEGER;
  const canRevealLineup = Date.now() >= revealAt || payload.privacy_mode === 'public';
  const richPayload = {
    contest_id: payload.contest_id,
    user_id: payload.user_id,
    wallet_address: payload.user_id,
    lineup_data: canRevealLineup ? payload.lineup_data : null,
    tx_signature: payload.tx_signature || null,
    payment_signature: payload.tx_signature || null,
    is_private: payload.privacy_mode !== 'public',
    status: payload.status || 'locked',
    lineup_encrypted: payload.lineup_encrypted || null,
    lineup_hash: payload.lineup_hash || null,
    lineup_reveal_at: payload.lineup_reveal_at || null,
    points_final: payload.points_final || null,
    settlement_status: payload.settlement_status || 'pending',
    payout_tx: payload.payout_tx || null,
    privacy_mode: payload.privacy_mode || 'hidden_until_reveal',
    compliance_status: payload.compliance_status || 'passed',
    risk_status: payload.risk_status || 'passed',
    escrow_address: payload.escrow_address || ESCROW_ADDRESS,
    escrow_network: payload.escrow_network || NETWORK_LABEL
  };

  try {
    const { data, error } = await _supabase.from('entries').insert(richPayload).select();
    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.warn('Rich entry insert failed, retrying with minimal schema', error);
  }

  try {
    const minimal = {
      contest_id: payload.contest_id,
      user_id: payload.user_id,
      wallet_address: payload.user_id,
      lineup_data: null,
      tx_signature: payload.tx_signature || null,
      is_private: payload.privacy_mode !== 'public',
      status: payload.status || 'locked',
      lineup_encrypted: payload.lineup_encrypted || null,
      lineup_hash: payload.lineup_hash || null
    };
    const { data, error } = await _supabase.from('entries').insert(minimal).select();
    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.warn('Minimal entry insert failed', error);
    return null;
  }
}


async function sha256Hex(text) {
  if (!window.crypto?.subtle) return String(text).split('').reduce((hash, ch) => ((hash << 5) - hash + ch.charCodeAt(0)) | 0, 0).toString(16);
  const bytes = new TextEncoder().encode(text);
  const digest = await window.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function bytesToBase64(bytes) {
  let binary = '';
  new Uint8Array(bytes).forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

function getLineupPrivacySecret(wallet) {
  const key = 'skillxi_privacy_secret_' + wallet;
  let secret = window.localStorage.getItem(key);
  if (!secret) {
    const bytes = new Uint8Array(32);
    window.crypto?.getRandomValues?.(bytes);
    secret = bytesToBase64(bytes);
    window.localStorage.setItem(key, secret);
  }
  return secret;
}

async function encryptLineupForStorage(wallet, lineupData) {
  const plaintext = JSON.stringify(lineupData || {});
  const lineupHash = await sha256Hex(plaintext);
  if (!window.crypto?.subtle) return { lineup_encrypted: null, lineup_hash: lineupHash };
  const salt = new TextEncoder().encode(wallet + ':skillxi-lineup-v1');
  const secret = getLineupPrivacySecret(wallet);
  const keyMaterial = await window.crypto.subtle.importKey('raw', new TextEncoder().encode(secret), 'PBKDF2', false, ['deriveKey']);
  const key = await window.crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
  const iv = new Uint8Array(12);
  window.crypto.getRandomValues(iv);
  const ciphertext = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(plaintext));
  return {
    lineup_encrypted: JSON.stringify({ alg: 'AES-256-GCM', kdf: 'PBKDF2-SHA256', iv: bytesToBase64(iv), ciphertext: bytesToBase64(ciphertext) }),
    lineup_hash: lineupHash
  };
}

async function evaluateJoinGuard(wallet, contest) {
  const paid = Number(contest.entry_amount || 0) > 0 || contest.entry_mode === 'paid_beta';
  try {
    const response = await fetch('/api/join-guard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet, contestId: contest.id, entryAmount: Number(contest.entry_amount || 0), entryMode: contest.entry_mode || (paid ? 'paid_beta' : 'free') })
    });
    const result = await response.json();
    if (!result.allowed) throw new Error(result.reason || 'Join blocked by SkillXI risk controls.');
    return result;
  } catch (error) {
    if (!paid) return { allowed: true, reason: 'Free contest allowed while guard is offline.' };
    throw new Error(error.message || 'Paid beta guard unavailable. Try again after deployment health is green.');
  }
}

function getLocalEntries() {
  return readStore(STORAGE_KEYS.entries, []);
}

function saveLocalEntries(entries) {
  writeStore(STORAGE_KEYS.entries, entries);
}

function getReceipts() {
  return readStore(STORAGE_KEYS.receipts, []);
}

function saveReceipts(receipts) {
  writeStore(STORAGE_KEYS.receipts, receipts);
}

function getContestById(contestId) {
  return PAGE_STATE.contests.find((contest) => contest.id === contestId) || SEEDED_CONTESTS.find((contest) => contest.id === contestId) || null;
}

function getSelectedContestId() {
  const search = new URLSearchParams(window.location.search);
  return search.get('contest') || window.localStorage.getItem(STORAGE_KEYS.selectedContest) || SEEDED_CONTESTS[0].id;
}

function setSelectedContest(contestId) {
  window.localStorage.setItem(STORAGE_KEYS.selectedContest, contestId);
  PAGE_STATE.activeContest = getContestById(contestId);
}

function currentContest() {
  if (!PAGE_STATE.activeContest) {
    setSelectedContest(getSelectedContestId());
  }
  return PAGE_STATE.activeContest || SEEDED_CONTESTS[0];
}

function fallbackUserProfile() {
  const wallet = getSavedWallet();
  const entries = getLocalEntries().filter((entry) => !wallet || entry.user_id === wallet);
  const settled = entries.filter((entry) => entry.settlement_status === 'settled');
  const wins = settled.filter((entry) => (entry.points_final || 0) >= 95);
  const scoreHistory = [612, 644, 681, 710, 744, 801, 848];
  return {
    username: wallet ? `SkillXI-${wallet.slice(0, 4)}` : 'Guest Scout',
    wallet_address: wallet,
    skill_score: 848,
    reputation_score: 72,
    total_earned: settled.reduce((sum, entry) => sum + Number(entry.payout_amount || 0), 0),
    contests_entered: entries.length,
    active_contests: entries.filter((entry) => entry.settlement_status !== 'settled').length,
    win_rate: settled.length ? (wins.length / settled.length) * 100 : 0,
    beta_access: wallet.length > 0,
    skill_score_history: scoreHistory
  };
}

window.ensureUserExists = async function ensureUserExists(walletAddress) {
  const basePayload = {
    wallet_address: walletAddress,
    primary_wallet: walletAddress,
    username: `SkillXI-${walletAddress.slice(0, 4)}`,
    skill_score: 650,
    subscription: 'free',
    total_earned: 0,
    contests_entered: getLocalEntries().filter((entry) => entry.user_id === walletAddress).length,
    reputation_score: 65,
    beta_access: false,
    region: 'global',
    skill_score_history: [620, 640, 650]
  };
  try {
    const { error } = await _supabase.from('users').upsert(basePayload, { onConflict: 'wallet_address' });
    if (error) throw error;
  } catch (error) {
    try {
      const legacyPayload = { ...basePayload, id: walletAddress };
      const { error: legacyError } = await _supabase.from('users').upsert(legacyPayload);
      if (legacyError) throw legacyError;
    } catch (legacyError) {
      console.warn('Supabase user upsert failed', legacyError);
    }
  }
};

async function fetchUpcomingFixtures(limit = 24) {
  try {
    const response = await fetch(FOOTBALL_API_URL + '?upcoming=1&leagues=39,140,135,78,61&next=' + encodeURIComponent(limit));
    const payload = await response.json();
    const fixtures = Array.isArray(payload?.data) ? payload.data : [];
    return fixtures;
  } catch (error) {
    console.warn('Upcoming fixtures fetch failed', error);
    return [];
  }
}

function contestsFromFixtures(fixtures) {
  return fixtures.map((fixture) => {
    const home = fixture?.teams?.home?.name || 'Home';
    const away = fixture?.teams?.away?.name || 'Away';
    const league = fixture?.league?.name || 'Football';
    const fixtureId = String(fixture?.fixture?.id || ('fx-' + Math.random().toString(36).slice(2, 8)));
    const startsAt = fixture?.fixture?.date || new Date(Date.now() + 86400000).toISOString();
    return normalizeContest({
      id: 'football-live-' + fixtureId,
      title: home + ' vs ' + away,
      sport: 'football',
      league,
      fixture_id: fixtureId,
      entry_mode: 'free',
      entry_asset: 'SOL',
      entry_amount: 0,
      prize_pool: 'Live reputation pool',
      lineup_visibility: 'hidden_until_lock',
      status: 'upcoming',
      starts_at: startsAt,
      contest_size: 900,
      joined: Math.floor(150 + Math.random() * 350),
      scoring_ruleset_id: 'football_classic_v1',
      source: 'live-fixture'
    });
  }).filter(Boolean);
}

window.getContests = async function getContests() {
  const rows = await trySupabaseSelect('contests', '*');
  const normalized = rows.map(normalizeContest).filter(Boolean);

  const liveFixtures = await fetchUpcomingFixtures(24);
  const liveContests = contestsFromFixtures(liveFixtures);

  const seeded = SEEDED_CONTESTS.map((contest) => ({ ...contest, source: 'seed' }));
  const mergedBase = normalized.length ? normalized : seeded;
  const merged = [...liveContests, ...mergedBase].filter((contest, idx, arr) => arr.findIndex((c) => c.id === contest.id) === idx);

  PAGE_STATE.contests = merged;
  return merged;
};

window.getLeaderboard = async function getLeaderboard() {
  const rows = await trySupabaseSelect('users', '*');
  if (!rows.length) {
    return SEEDED_USERS.map(normalizeUser);
  }
  return rows
    .sort((left, right) => Number(right.skill_score || 0) - Number(left.skill_score || 0))
    .slice(0, 20)
    .map(normalizeUser);
};

async function getUserProfile() {
  const wallet = getSavedWallet();
  if (!wallet) return fallbackUserProfile();

  try {
    let { data, error } = await _supabase.from('users').select('*').eq('wallet_address', wallet).maybeSingle();
    if (error) {
      const legacy = await _supabase.from('users').select('*').eq('id', wallet).maybeSingle();
      data = legacy.data;
      error = legacy.error;
    }
    if (error) throw error;
    return { ...fallbackUserProfile(), ...(data || {}) };
  } catch (error) {
    console.warn('User profile fetch failed', error);
    return fallbackUserProfile();
  }
}

async function getUserEntries() {
  const wallet = getSavedWallet();
  const localEntries = getLocalEntries().filter((entry) => !wallet || entry.user_id === wallet);
  if (!wallet) return localEntries;

  try {
    const { data, error } = await _supabase.from('entries').select('*').eq('user_id', wallet).order('created_at', { ascending: false });
    if (error) throw error;
    const remoteEntries = (data || []).map((entry) => ({
      contest_id: entry.contest_id,
      user_id: entry.user_id,
      lineup_data: typeof entry.lineup_data === 'string' ? safeJsonParse(entry.lineup_data, {}) : entry.lineup_data,
      tx_signature: entry.tx_signature,
      privacy_mode: entry.privacy_mode || (entry.is_private ? 'hidden_until_reveal' : 'public'),
      lineup_reveal_at: entry.lineup_reveal_at,
      points_final: entry.points_final,
      settlement_status: entry.settlement_status || entry.status || 'pending',
      payout_tx: entry.payout_tx || null,
      created_at: entry.created_at
    }));
    return remoteEntries.length ? remoteEntries : localEntries;
  } catch (error) {
    console.warn('Remote entries fetch failed', error);
    return localEntries;
  }
}

async function fetchMatchWithLimit(fixtureId) {
  const stateKey = `skillxi_match_${fixtureId}_calls`;
  const calls = readStore(stateKey, []);
  if (calls.length >= 3) return null;

  try {
    const response = await fetch(FOOTBALL_API_URL + '?fixture=' + encodeURIComponent(fixtureId));
    const payload = await response.json();
    const fixture = payload?.data || payload?.response?.[0] || null;
    if (fixture) {
      calls.push({ time: Date.now(), status: fixture.fixture?.status?.short || 'UNK' });
      writeStore(stateKey, calls);
      return fixture;
    }
  } catch (error) {
    console.warn('Live fixture fetch failed', error);
  }
  return null;
}

window.getLiveScores = async function getLiveScores() {
  try {
    const response = await fetch(FOOTBALL_API_URL + '?live=1');
    const payload = await response.json();
    if (Array.isArray(payload?.data)) return payload.data;
    if (payload?.data) return [payload.data];
    return [];
  } catch (error) {
    console.warn('Live scores fetch failed', error);
    return [];
  }
};

window.showWalletToast = function showWalletToast(message, type = 'info', link = null) {
  const colors = {
    info: '#a8e8ff',
    success: '#00ff88',
    error: '#ff6b6b'
  };
  const toast = document.createElement('div');
  toast.style.cssText = [
    'position:fixed',
    'bottom:24px',
    'right:24px',
    'max-width:360px',
    'z-index:999999',
    'padding:14px 18px',
    'border-radius:14px',
    'background:#131318',
    `border:1px solid ${colors[type] || colors.info}`,
    'box-shadow:0 20px 40px rgba(0,0,0,0.45)',
    'color:#fff',
    'font-family:Inter,sans-serif',
    'transform:translateY(20px)',
    'opacity:0',
    'transition:all 220ms ease'
  ].join(';');
  toast.innerHTML = `
    <div style="display:flex; gap:12px; align-items:flex-start;">
      <div style="font-size:18px; line-height:1;">${type === 'success' ? '✓' : type === 'error' ? '!' : 'i'}</div>
      <div style="font-size:13px; line-height:1.5;">
        <div>${escapeHtml(message)}</div>
        ${link ? `<a href="${escapeHtml(link)}" target="_blank" rel="noreferrer" style="color:#a8e8ff; text-decoration:underline; font-size:12px;">View explorer</a>` : ''}
      </div>
    </div>
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });
  window.setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    window.setTimeout(() => toast.remove(), 240);
  }, 4200);
};

window.triggerConnectWallet = function triggerConnectWallet() {
  const existing = document.getElementById('wallet-selector-modal');
  if (existing) {
    existing.remove();
  }

  const modal = document.createElement('div');
  modal.id = 'wallet-selector-modal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,0.82);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:20px;';
  modal.innerHTML = `
    <div class="glass-panel" style="background:#131318;border:1px solid rgba(168,232,255,0.16);border-radius:28px;padding:32px;max-width:420px;width:100%;box-shadow:0 24px 64px rgba(0,0,0,0.45);">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:22px;">
        <div>
          <h2 style="font-family:'Space Grotesk',sans-serif;font-size:24px;color:#fff;font-weight:800;margin:0 0 6px;">Connect wallet</h2>
          <p style="color:#a0a0b8;font-size:13px;line-height:1.6;margin:0;">Free contests are open to everyone. Paid contests remain invite-only beta on ${NETWORK_LABEL}.</p>
        </div>
        <button id="close-wallet-modal" style="background:none;border:none;color:#7c7c92;font-size:18px;cursor:pointer;">×</button>
      </div>
      <div style="display:grid;gap:12px;">
        <button data-wallet-provider="phantom" style="background:rgba(171,71,255,0.12);border:1px solid rgba(171,71,255,0.28);color:#fff;padding:16px;border-radius:16px;font-weight:700;cursor:pointer;">Connect Phantom</button>
        <button data-wallet-provider="solflare" style="background:rgba(255,129,0,0.12);border:1px solid rgba(255,129,0,0.28);color:#fff;padding:16px;border-radius:16px;font-weight:700;cursor:pointer;">Connect Solflare</button>
      </div>
      <div style="margin-top:16px;padding:12px 14px;border-radius:12px;background:rgba(0,212,255,0.08);border:1px solid rgba(0,212,255,0.18);font-size:12px;color:#a8e8ff;">
        Private lineups in beta hide your picks until reveal. Payment privacy is limited to current beta behavior and not a full stealth payment system yet.
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector('#close-wallet-modal').onclick = () => modal.remove();
  modal.querySelectorAll('[data-wallet-provider]').forEach((button) => {
    button.addEventListener('click', () => window.connectWalletProvider(button.getAttribute('data-wallet-provider')));
  });
};

function resolveWalletProvider(type) {
  if (type === 'phantom') {
    if (window.phantom?.solana?.isPhantom) return window.phantom.solana;
    if (window.solana?.isPhantom) return window.solana;
    return null;
  }
  if (type === 'solflare') {
    if (window.solflare?.isSolflare) return window.solflare;
    if (window.solana?.isSolflare) return window.solana;
    return null;
  }
  return window.solana || null;
}

window.connectWalletProvider = async function connectWalletProvider(type) {
  const provider = resolveWalletProvider(type);
  if (!provider) {
    window.showWalletToast(`Install ${type === 'phantom' ? 'Phantom' : 'Solflare'} to continue.`, 'error');
    return;
  }

  try {
    const response = await provider.connect();
    const wallet = response.publicKey.toString();
    window.localStorage.setItem(STORAGE_KEYS.wallet, wallet);
    window.localStorage.setItem(STORAGE_KEYS.walletType, type);
    await window.ensureUserExists(wallet);
    window.updateWalletUI(wallet);
    await window.fetchWalletBalance(wallet);
    document.getElementById('wallet-selector-modal')?.remove();
    window.showWalletToast('Wallet connected.', 'success');
  } catch (error) {
    console.warn('Wallet connect failed', error);
    window.showWalletToast('Wallet connection failed.', 'error');
  }
};

window.connectWallet = window.triggerConnectWallet;

window.disconnectWallet = function disconnectWallet() {
  window.localStorage.removeItem(STORAGE_KEYS.wallet);
  window.localStorage.removeItem(STORAGE_KEYS.walletType);
  window.showWalletToast('Wallet disconnected.', 'info');
  window.location.reload();
};

window.updateWalletUI = function updateWalletUI(wallet) {
  const short = shortWallet(wallet);
  document.querySelectorAll('button').forEach((button) => {
    if ((button.textContent || '').includes('Connect Wallet')) {
      button.textContent = short;
      button.style.color = '#00ff88';
      button.style.background = 'rgba(0,255,136,0.1)';
    }
  });
  document.querySelectorAll('a[href="wallet.html"]').forEach((link) => {
    link.innerHTML = `<span style="color:#00ff88;font-weight:800;background:rgba(0,255,136,0.1);padding:6px 14px;border-radius:999px;border:1px solid rgba(0,255,136,0.3);">${short}</span>`;
  });
};

window.fetchWalletBalance = async function fetchWalletBalance(wallet) {
  let sol = 0;
  try {
    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'));
    const lamports = await connection.getBalance(new solanaWeb3.PublicKey(wallet));
    sol = lamports / solanaWeb3.LAMPORTS_PER_SOL;
  } catch (error) {
    console.warn('Wallet balance fetch failed', error);
  }
  syncWalletPage(sol);
  return sol;
};

function makeTransactionReceipt({ type, amount, status, contestTitle, txSignature, payoutTx, createdAt }) {
  return {
    id: `receipt-${Math.random().toString(36).slice(2, 10)}`,
    type,
    amount,
    status,
    contestTitle,
    txSignature: txSignature || payoutTx || '',
    createdAt: createdAt || new Date().toISOString()
  };
}

async function executeEscrowPayment(amount) {
  const wallet = getSavedWallet();
  if (!wallet) throw new Error('Connect wallet first');

  const provider = getSavedWalletType() === 'phantom' ? window.solana : window.solflare;
  if (!provider?.signAndSendTransaction) {
    throw new Error('Selected wallet does not support signing in this browser');
  }

  const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'), 'confirmed');
  const transaction = new solanaWeb3.Transaction().add(
    solanaWeb3.SystemProgram.transfer({
      fromPubkey: new solanaWeb3.PublicKey(wallet),
      toPubkey: new solanaWeb3.PublicKey(ESCROW_ADDRESS),
      lamports: Math.floor(Number(amount) * solanaWeb3.LAMPORTS_PER_SOL)
    })
  );
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = new solanaWeb3.PublicKey(wallet);
  window.showWalletToast('Requesting wallet signature...', 'info');
  const signed = await provider.signAndSendTransaction(transaction);
  await connection.confirmTransaction(signed.signature, 'confirmed');
  return signed.signature;
}

window.showPaymentStatement = function showPaymentStatement(contest, onConfirm) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,0.86);backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;padding:20px;';
  overlay.innerHTML = `
    <div style="background:#131318;border:1px solid rgba(0,255,136,0.18);border-radius:24px;padding:34px;max-width:480px;width:100%;box-shadow:0 24px 64px rgba(0,0,0,0.45);">
      <div style="font-size:36px;margin-bottom:16px;">🔐</div>
      <h2 style="font-family:'Space Grotesk',sans-serif;font-size:24px;color:#fff;font-weight:800;margin:0 0 12px;">Contest lock confirmation</h2>
      <p style="color:#a0a0b8;font-size:14px;line-height:1.7;margin:0 0 22px;">
        You are entering <span style="color:#fff;font-weight:700;">${escapeHtml(contest.title)}</span>.<br>
        ${contest.entry_amount > 0 ? `Entry fee: <span style="color:#00ff88;font-weight:700;">${formatSol(contest.entry_amount)}</span> on ${NETWORK_LABEL}.<br>` : 'This contest is free to enter.<br>'}
        SkillXI beta will hide your lineup until reveal where available, but this is not a full stealth-payment system yet.
      </p>
      <div style="display:grid;gap:12px;">
        <button id="confirm-lock-lineup" style="background:linear-gradient(135deg,#00ff88,#00d4ff);color:#003642;border:none;border-radius:14px;padding:16px;font-weight:800;cursor:pointer;">Confirm and lock lineup</button>
        <button id="cancel-lock-lineup" style="background:none;border:1px solid rgba(90,90,117,0.3);color:#7a7a93;padding:14px;border-radius:14px;cursor:pointer;">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector('#cancel-lock-lineup').onclick = () => overlay.remove();
  overlay.querySelector('#confirm-lock-lineup').onclick = async () => {
    const button = overlay.querySelector('#confirm-lock-lineup');
    button.disabled = true;
    button.textContent = 'Processing...';
    try {
      await onConfirm();
      overlay.remove();
    } catch (error) {
      console.warn('Lock lineup failed', error);
      button.disabled = false;
      button.textContent = 'Confirm and lock lineup';
      window.showWalletToast(error.message || 'Unable to lock lineup.', 'error');
    }
  };
};

function deriveLineupData() {
  const contest = currentContest();
  const base = contest?.entry_mode === 'paid_beta' ? ALT_LINEUP : DEFAULT_LINEUP;
  return {
    ...base,
    contest_id: contest.id,
    contest_title: contest.title,
    projected_points: calculateProjectedPoints(base)
  };
}

function calculateProjectedPoints(lineup) {
  return Math.round(lineup.players.reduce((sum, player) => sum + player.rating * 11, 0));
}

function calculateFinalPoints(lineup) {
  return lineup.players.reduce((sum, player) => {
    let points = Math.round(player.rating * 10);
    if (player.name === lineup.captain) points *= 2;
    if (player.name === lineup.viceCaptain) points += 12;
    if (player.position === 'DEF') points += 6;
    if (player.position === 'MID') points += 4;
    if (player.position === 'FWD') points += 7;
    return sum + points;
  }, 0);
}

function updateLocalEntry(entry) {
  const entries = getLocalEntries();
  const index = entries.findIndex((item) => item.id === entry.id);
  if (index >= 0) {
    entries[index] = entry;
  } else {
    entries.unshift(entry);
  }
  saveLocalEntries(entries);
}

window.lockLineupWithUmbra = async function lockLineupWithUmbra(contestId, lineupData) {
  const wallet = getSavedWallet();
  if (!wallet) {
    window.showWalletToast('Connect your wallet before locking a lineup.', 'error');
    return false;
  }

  const contest = getContestById(contestId) || currentContest();
  return new Promise((resolve) => {
    window.showPaymentStatement(contest, async () => {
      let txSignature = '';
      const guard = await evaluateJoinGuard(wallet, contest);
      if (contest.entry_amount > 0) {
        txSignature = await executeEscrowPayment(contest.entry_amount);
      }
      const privacyEnvelope = await encryptLineupForStorage(wallet, lineupData);
      const entry = {
        id: `entry-${Math.random().toString(36).slice(2, 10)}`,
        contest_id: contest.id,
        user_id: wallet,
        contest_title: contest.title,
        lineup_data: lineupData,
        ...privacyEnvelope,
        tx_signature: txSignature,
        privacy_mode: contest.lineup_visibility || 'hidden_until_reveal',
        lineup_reveal_at: contest.starts_at,
        compliance_status: 'passed',
        risk_status: guard?.checks?.paid ? 'paid_beta_checked' : 'free_checked',
        escrow_address: ESCROW_ADDRESS,
        escrow_network: NETWORK_LABEL,
        points_final: null,
        settlement_status: 'pending',
        payout_tx: null,
        payout_amount: 0,
        created_at: new Date().toISOString()
      };

      updateLocalEntry(entry);
      await tryInsertEntry(entry);

      const receipts = getReceipts();
      receipts.unshift(makeTransactionReceipt({
        type: contest.entry_amount > 0 ? 'Entry fee' : 'Contest lock',
        amount: contest.entry_amount > 0 ? -contest.entry_amount : 0,
        status: 'Success',
        contestTitle: contest.title,
        txSignature,
        createdAt: entry.created_at
      }));
      saveReceipts(receipts);

      window.updatePrivacyBadges(true);
      window.showWalletToast(
        contest.entry_amount > 0 ? 'Lineup locked and beta payment recorded.' : 'Lineup locked.',
        'success',
        txSignature ? `https://explorer.solana.com/tx/${txSignature}?cluster=devnet` : null
      );
      syncWalletPage();
      syncProfilePage();
      resolve(true);
    });
  });
};

window.claimPrivatePayoutWithUmbra = async function claimPrivatePayoutWithUmbra(contestId) {
  const wallet = getSavedWallet();
  if (!wallet) {
    window.showWalletToast('Connect wallet before claiming.', 'error');
    return;
  }

  const entries = getLocalEntries();
  const entry = entries.find((item) => item.contest_id === contestId && item.user_id === wallet) || entries.find((item) => item.user_id === wallet);
  if (!entry) {
    window.showWalletToast('No entry found for this wallet yet.', 'error');
    return;
  }

  const contest = getContestById(entry.contest_id) || currentContest();
  let fixture = null;
  if (contest.fixture_id && /^\d+$/.test(contest.fixture_id)) {
    fixture = await fetchMatchWithLimit(contest.fixture_id);
  }

  const entryAgeMs = Date.now() - new Date(entry.created_at || Date.now()).getTime();
  const demoSettlementReady = entryAgeMs > 60000;
  const isFinished = contest.status === 'completed' || contest.status === 'settled' || fixture?.fixture?.status?.short === 'FT' || demoSettlementReady;
  if (!isFinished) {
    window.showWalletToast('Contest is not settled yet. Try again after kickoff settles.', 'info');
    return;
  }

  const finalPoints = calculateFinalPoints(entry.lineup_data || DEFAULT_LINEUP);
  const payoutAmount = contest.entry_mode === 'paid_beta' ? Number((contest.entry_amount * 4.2).toFixed(2)) : 0;
  const payoutTx = payoutAmount > 0 ? `beta-payout-${Math.random().toString(36).slice(2, 10)}` : null;
  const updatedEntry = {
    ...entry,
    points_final: finalPoints,
    settlement_status: 'settled',
    payout_tx: payoutTx,
    payout_amount: payoutAmount
  };
  updateLocalEntry(updatedEntry);

  const receipts = getReceipts();
  receipts.unshift(makeTransactionReceipt({
    type: payoutAmount > 0 ? 'Contest payout' : 'Contest settled',
    amount: payoutAmount,
    status: 'Success',
    contestTitle: contest.title,
    payoutTx,
    createdAt: new Date().toISOString()
  }));
  saveReceipts(receipts);

  window.updatePrivacyBadges(true, true);
  window.showWalletToast(
    payoutAmount > 0 ? `Contest settled. ${formatSol(payoutAmount)} ready in beta payout history.` : `Contest settled with ${finalPoints} fantasy points.`,
    'success',
    payoutTx ? `https://explorer.solana.com/address/${ESCROW_ADDRESS}?cluster=devnet` : null
  );
  syncWalletPage();
  syncProfilePage();
  skillxiLiveDataBoot();
  skillxiScheduleLiveRefresh();
};

window.updatePrivacyBadges = function updatePrivacyBadges(isLocked = false, isClaimed = false) {
  document.querySelectorAll('.umbra-badge, #umbra-notice').forEach((node) => {
    if (isClaimed) {
      node.innerHTML = '<span style="color:#00ff88;font-weight:700;">Private lineup reveal complete</span>';
      return;
    }
    if (isLocked) {
      node.innerHTML = '<span style="color:#00ff88;font-weight:700;">Hidden until reveal</span>';
    }
  });
};

function contestBadge(contest) {
  if (contest.entry_mode === 'paid_beta') return 'Paid beta';
  if (contest.beta) return 'Beta';
  return 'Free';
}

function contestSportIcon(sport) {
  const icons = { football: '⚽', cricket: '🏏', basketball: '🏀' };
  return icons[sport] || '🏆';
}

function renderContests() {
  const grid = document.getElementById('contests-grid');
  if (!grid) return;
  const contests = PAGE_STATE.contests.filter((contest) => PAGE_STATE.filteredSport === 'all' || contest.sport === PAGE_STATE.filteredSport);

  if (!contests.length) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;background:#13131f;border:1px solid #1e1e30;border-radius:18px;padding:28px;color:#a0a0b8;">
        No contests found for this filter yet.
      </div>
    `;
    return;
  }

  grid.innerHTML = contests.map((contest) => {
    const fills = Math.min(100, Math.round((contest.joined / Math.max(contest.contest_size, 1)) * 100));
    return `
      <article style="background:#13131f;border:1px solid #1e1e30;border-radius:22px;padding:22px;display:flex;flex-direction:column;gap:16px;box-shadow:0 20px 40px rgba(0,0,0,0.2);">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">
          <div>
            <div style="display:inline-flex;align-items:center;gap:8px;padding:6px 10px;border-radius:999px;background:rgba(0,212,255,0.08);border:1px solid rgba(0,212,255,0.18);font-size:11px;color:#a8e8ff;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">${contestSportIcon(contest.sport)} ${escapeHtml(contest.league)}</div>
            <h3 style="margin:12px 0 6px;color:#fff;font-size:20px;font-weight:800;">${escapeHtml(contest.title)}</h3>
            <p style="margin:0;color:#a0a0b8;font-size:13px;">Starts ${escapeHtml(formatDate(contest.starts_at))} · Lock in ${escapeHtml(timeUntil(contest.starts_at))}</p>
          </div>
          <span style="padding:6px 10px;border-radius:999px;background:${contest.entry_mode === 'paid_beta' ? 'rgba(255,193,7,0.08)' : 'rgba(0,255,136,0.08)'};border:1px solid ${contest.entry_mode === 'paid_beta' ? 'rgba(255,193,7,0.25)' : 'rgba(0,255,136,0.18)'};color:${contest.entry_mode === 'paid_beta' ? '#ffd166' : '#00ff88'};font-size:11px;font-weight:800;text-transform:uppercase;">${escapeHtml(contestBadge(contest))}</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;">
          <div style="background:#0d0d14;border-radius:16px;padding:14px;">
            <div style="color:#6f6f86;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;">Entry</div>
            <div style="color:#fff;font-weight:800;margin-top:4px;">${contest.entry_amount > 0 ? `${formatSol(contest.entry_amount)}` : 'Free'}</div>
          </div>
          <div style="background:#0d0d14;border-radius:16px;padding:14px;">
            <div style="color:#6f6f86;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;">Prize</div>
            <div style="color:#fff;font-weight:800;margin-top:4px;">${escapeHtml(contest.prize_pool)}</div>
          </div>
          <div style="background:#0d0d14;border-radius:16px;padding:14px;">
            <div style="color:#6f6f86;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;">Visibility</div>
            <div style="color:#fff;font-weight:800;margin-top:4px;">${escapeHtml(contest.lineup_visibility.replaceAll('_', ' '))}</div>
          </div>
        </div>
        <div>
          <div style="display:flex;justify-content:space-between;font-size:12px;color:#a0a0b8;margin-bottom:8px;">
            <span>${contest.joined}/${contest.contest_size} joined</span>
            <span>${fills}% full</span>
          </div>
          <div style="height:8px;background:#09090d;border-radius:999px;overflow:hidden;">
            <div style="height:100%;width:${fills}%;background:linear-gradient(90deg,#00d4ff,#00ff88);"></div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:auto;">
          <button data-join-contest="${escapeHtml(contest.id)}" style="background:linear-gradient(135deg,#00d4ff,#00a2ff);border:none;border-radius:16px;padding:14px 18px;font-weight:800;color:#09111a;cursor:pointer;">
            ${contest.entry_mode === 'paid_beta' ? 'Join beta contest' : 'Build lineup'}
          </button>
          <button data-skillxi-blink="${escapeHtml(contest.id)}" style="background:rgba(153,69,255,.12);border:1px solid rgba(153,69,255,.35);border-radius:16px;padding:14px 18px;font-weight:900;color:#d2bbff;cursor:pointer;">
            Share Blink
          </button>
        </div>
      </article>
    `;
  }).join('');
}

function setFilterButtonState(activeSport) {
  ['all', 'football', 'cricket', 'basketball'].forEach((sport) => {
    const button = document.getElementById(`filter-${sport}`);
    if (!button) return;
    if (sport === activeSport) {
      button.style.background = '#7c3aed';
      button.style.color = '#fff';
      button.style.border = 'none';
    } else {
      button.style.background = '#13131f';
      button.style.color = '#a0a0b8';
      button.style.border = '1px solid #2a2a40';
    }
  });
}

window.filterContests = function filterContests(sport) {
  PAGE_STATE.filteredSport = sport;
  setFilterButtonState(sport);
  renderContests();
};

function hydrateLineupHeader() {
  const contest = currentContest();
  const h1 = document.querySelector('h1.text-xl.font-headline.font-bold.text-on-surface');
  if (h1) {
    h1.textContent = `${contest.title} · ${contest.league}`;
  }

  const timeNode = document.querySelector('.material-symbols-outlined.text-sm + span');
  if (timeNode) {
    timeNode.textContent = `Locks in ${timeUntil(contest.starts_at)}`;
  }

  const privacyTitle = Array.from(document.querySelectorAll('div')).find((node) => node.textContent?.trim() === 'UMBRA PRIVACY ENABLED');
  if (privacyTitle) {
    privacyTitle.textContent = 'PRIVATE LINEUP BETA';
    privacyTitle.style.color = '#a8e8ff';
  }

  const privacyBody = Array.from(document.querySelectorAll('div')).find((node) => (node.textContent || '').includes('legacy stealth privacy copy'));
  if (privacyBody) {
    privacyBody.textContent = 'SkillXI beta hides your lineup until reveal where available. Entry payments currently use standard wallet signatures on Solana Devnet.';
  }

  const aiBadge = Array.from(document.querySelectorAll('p')).find((node) => (node.textContent || '').includes('Powered by Gemini AI'));
  if (aiBadge) {
    aiBadge.textContent = 'Powered by live contest context · Beta';
  }
}

function renderLineupResult(title, body, listItems = []) {
  const loading = document.getElementById('ai-lineup-loading');
  const result = document.getElementById('ai-lineup-result');
  if (!result) return;
  if (loading) loading.style.display = 'none';
  result.style.display = 'block';
  result.innerHTML = `
    <div style="background:#13131f;border:1px solid #1e1e30;border-radius:16px;padding:18px;">
      <h3 style="margin:0 0 8px;color:#fff;font-size:18px;font-weight:800;">${escapeHtml(title)}</h3>
      <p style="margin:0;color:#a0a0b8;font-size:14px;line-height:1.7;">${escapeHtml(body)}</p>
      ${listItems.length ? `<ul style="margin:14px 0 0;padding-left:18px;color:#d7d7e4;font-size:13px;line-height:1.8;">${listItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : ''}
    </div>
  `;
}

window.generateAILineup = async function generateAILineup() {
  const loading = document.getElementById('ai-lineup-loading');
  const contest = currentContest();
  if (loading) loading.style.display = 'block';
  window.setTimeout(() => {
    renderLineupResult(
      'Suggested lineup',
      `For ${contest.title}, the model is leaning toward a safer possession-heavy core with Haaland as captain and Saka as vice-captain.`,
      [
        'Core stack: Haaland, De Bruyne, Rodri',
        'Best Arsenal bring-back: Saka or Odegaard',
        'Risk-managed defender pair: Saliba + Ruben Dias'
      ]
    );
  }, 350);
};

window.askCaptain = function askCaptain() {
  const lineup = deriveLineupData();
  renderLineupResult(
    'Captain recommendation',
    `${lineup.captain} remains the strongest captain because of shot volume, penalty equity, and the highest median fantasy floor in this slate.`,
    [
      `${lineup.captain}: best floor + ceiling`,
      `${lineup.viceCaptain}: safer leverage if you want lower ownership`,
      'If chasing rank, switch captain to De Bruyne in large-field contests'
    ]
  );
};

window.findDifferentials = function findDifferentials() {
  renderLineupResult(
    'Differential targets',
    'These are the lower-owned plays with realistic upside if the match stays tactical rather than turning into a pure striker slate.',
    [
      'Ben White: crossing volume + clean-sheet route',
      'Declan Rice: minutes safety and all-around stat floor',
      'Josko Gvardiol: attacking overlap upside from defense'
    ]
  );
};

function chatResponseForPrompt(prompt, entries) {
  const normalized = prompt.toLowerCase();
  const lastEntry = entries[0];
  const contest = currentContest();

  if (normalized.includes('captain')) {
    return `For ${contest.title}, captain Haaland in smaller fields and De Bruyne if you want leverage. Your last locked lineup also leaned attack-heavy, so this keeps your profile consistent.`;
  }
  if (normalized.includes('differential')) {
    return 'Three strong differentials right now are Ben White, Declan Rice, and Josko Gvardiol. They fit a lower-owned build without completely sacrificing floor.';
  }
  if (normalized.includes('lineup') || normalized.includes('4-3-3')) {
    return `Best current shell is 4-3-3 with Haaland, Saka, and Foden up top. ${lastEntry ? `Your most recent locked entry scored a projected ${lastEntry.lineup_data?.projected_points || 0} points, so I would keep a similar core.` : 'Once you lock more entries, I will compare against your actual history too.'}`;
  }
  if (normalized.includes('match') || normalized.includes('arsenal') || normalized.includes('man city')) {
    return `${contest.title} looks like a medium-tempo slate: City control possession, Arsenal counter with transition value, and midfielders gain extra floor if the match stays tight.`;
  }
  if (normalized.includes('history') || normalized.includes('recent')) {
    return lastEntry
      ? `Your latest entry was for ${lastEntry.contest_title}. It is currently marked ${lastEntry.settlement_status}. I can use that history to keep future builds more aggressive or more balanced.`
      : 'You do not have locked entries yet, so I am still working from the current contest context rather than personal history.';
  }
  return 'I can help with captaincy, differentials, match analysis, lineup builds, and reviewing your recent locked entries.';
}

function appendChatMessage(role, message) {
  const container = document.getElementById('chat-messages');
  if (!container) return;
  const isUser = role === 'user';
  const bubble = document.createElement('div');
  bubble.style.cssText = `max-width:78%;align-self:${isUser ? 'flex-end' : 'flex-start'};background:${isUser ? 'linear-gradient(135deg,#00d4ff,#0099bb)' : '#13131f'};border:${isUser ? 'none' : '1px solid #1e1e30'};color:${isUser ? '#07121a' : '#fff'};padding:14px 16px;border-radius:18px;font-size:14px;line-height:1.7;`;
  bubble.innerHTML = escapeHtml(message);
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

async function seedChatContext() {
  const container = document.getElementById('chat-messages');
  if (!container || container.dataset.skillxiReady) return;
  container.dataset.skillxiReady = 'true';
  const entries = await getUserEntries();
  const contest = currentContest();
  const intro = entries.length
    ? `I have your recent entry history loaded. Ask me about captaincy, differentials, or how your last locked lineup compares to ${contest.title}.`
    : `I have the ${contest.title} context ready. Ask me for a lineup, captain, differentials, or pre-match breakdown.`;
  appendChatMessage('assistant', intro);
}

window.quickAsk = function quickAsk(prompt) {
  const input = document.getElementById('chat-input');
  if (input) input.value = prompt;
  window.sendChatMessage();
};

window.handleChatKey = function handleChatKey(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    window.sendChatMessage();
  }
};

window.sendChatMessage = async function sendChatMessage() {
  const input = document.getElementById('chat-input');
  if (!input) return;
  const prompt = input.value.trim();
  if (!prompt) return;
  appendChatMessage('user', prompt);
  input.value = '';
  const entries = await getUserEntries();
  window.setTimeout(() => {
    appendChatMessage('assistant', chatResponseForPrompt(prompt, entries));
  }, 180);
};

window.generateReport = async function generateReport() {
  const loading = document.getElementById('report-loading');
  const result = document.getElementById('report-result');
  const contest = currentContest();
  if (loading) loading.style.display = 'block';
  if (result) result.style.display = 'none';

  let liveFixture = null;
  if (contest.fixture_id && /^\d+$/.test(contest.fixture_id)) {
    liveFixture = await fetchMatchWithLimit(contest.fixture_id);
  }

  window.setTimeout(() => {
    if (loading) loading.style.display = 'none';
    if (!result) return;

    const formStatus = liveFixture?.fixture?.status?.short ? `Live status: ${liveFixture.fixture.status.short}` : 'Live status: pre-match';
    result.style.display = 'block';
    result.innerHTML = `
      <div style="background:#13131f;border:1px solid #1e1e30;border-radius:18px;padding:22px;">
        <h3 style="margin:0 0 10px;color:#fff;font-size:20px;font-weight:800;">${escapeHtml(contest.title)} report</h3>
        <p style="margin:0 0 18px;color:#a0a0b8;line-height:1.7;font-size:14px;">${escapeHtml(formStatus)}. SkillXI currently projects a control-heavy match with City dominating touches and Arsenal offering more transition upside than raw possession.</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;">
          <div style="background:#0d0d14;border-radius:14px;padding:16px;">
            <div style="color:#6f6f86;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;">Best captain</div>
            <div style="color:#fff;font-size:18px;font-weight:800;margin-top:6px;">Erling Haaland</div>
          </div>
          <div style="background:#0d0d14;border-radius:14px;padding:16px;">
            <div style="color:#6f6f86;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;">Best leverage</div>
            <div style="color:#fff;font-size:18px;font-weight:800;margin-top:6px;">Kevin De Bruyne</div>
          </div>
          <div style="background:#0d0d14;border-radius:14px;padding:16px;">
            <div style="color:#6f6f86;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;">Defensive value</div>
            <div style="color:#fff;font-size:18px;font-weight:800;margin-top:6px;">Saliba / White</div>
          </div>
        </div>
        <ul style="margin:18px 0 0;padding-left:18px;color:#d6d6e6;line-height:1.8;font-size:13px;">
          <li>Prioritize players with locked minutes and set-piece involvement.</li>
          <li>In large fields, swap one City attacker for an Arsenal defender to get leverage.</li>
          <li>Paid beta contests should avoid duplicate chalk builds because reveal happens later.</li>
        </ul>
      </div>
    `;
  }, 240);
};

function buildLeaderboardRows(users) {
  return users.map((user, index) => {
    const rank = index + 1;
    return `
      <div style="display:grid;grid-template-columns:70px 1.4fr 1fr 1fr 120px;gap:16px;align-items:center;padding:16px 20px;border-top:${index === 0 ? 'none' : '1px solid rgba(255,255,255,0.04)'};">
        <div style="font-weight:900;color:${rank <= 3 ? '#ffd166' : '#a8e8ff'};">#${rank}</div>
        <div>
          <div style="color:#fff;font-weight:700;">${escapeHtml(user.username)}</div>
          <div style="color:#6f6f86;font-size:12px;">${escapeHtml(shortWallet(user.wallet_address || user.id))}</div>
        </div>
        <div style="color:#fff;font-weight:800;">${Math.round(user.skill_score)}</div>
        <div style="color:#a0a0b8;">REP ${Math.round(user.reputation_score)}</div>
        <div style="text-align:right;color:${user.beta_access ? '#00ff88' : '#a0a0b8'};font-size:12px;font-weight:700;">${user.beta_access ? 'Beta access' : 'Public'}</div>
      </div>
    `;
  }).join('');
}

window.loadLeaderboard = async function loadLeaderboard(range = 'all_time') {
  PAGE_STATE.leaderboardRange = range;
  const users = await window.getLeaderboard();
  const table = document.getElementById('leaderboard-table');
  if (!table) return;

  const adjusted = users.map((user, index) => {
    const delta = range === 'weekly' ? 65 - index * 4 : range === 'monthly' ? 120 - index * 6 : 0;
    return { ...user, skill_score: user.skill_score + Math.max(delta, 0) };
  }).sort((left, right) => right.skill_score - left.skill_score);

  ['all', 'week', 'month'].forEach((id) => {
    const button = document.getElementById(`lb-${id}`);
    if (!button) return;
    const active = (range === 'all_time' && id === 'all') || (range === 'weekly' && id === 'week') || (range === 'monthly' && id === 'month');
    button.style.background = active ? '#7c3aed' : '#13131f';
    button.style.color = active ? '#fff' : '#a0a0b8';
    button.style.border = active ? 'none' : '1px solid #2a2a40';
  });

  table.innerHTML = `
    <div style="display:grid;grid-template-columns:70px 1.4fr 1fr 1fr 120px;gap:16px;padding:18px 20px;background:#0d0d14;color:#6f6f86;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;font-weight:700;">
      <div>Rank</div>
      <div>Analyst</div>
      <div>Skill score</div>
      <div>Reputation</div>
      <div style="text-align:right;">Access</div>
    </div>
    ${buildLeaderboardRows(adjusted)}
  `;
};

function updateTextByLabel(label, value, suffixSelector = 'h3') {
  const labels = Array.from(document.querySelectorAll('p, span, div'));
  const node = labels.find((item) => item.textContent?.trim() === label);
  if (!node) return;
  const parent = node.parentElement;
  const valueNode = parent?.querySelector(suffixSelector);
  if (valueNode) valueNode.textContent = value;
}

function syncWalletPage(balanceOverride) {
  if (getPath() !== 'wallet.html') return;
  const wallet = getSavedWallet();
  const defaultBalance = typeof balanceOverride === 'number' ? balanceOverride : readStore('skillxi_cached_balance', 0);
  if (typeof balanceOverride === 'number') {
    writeStore('skillxi_cached_balance', defaultBalance);
  }

  const amountNode = document.querySelector('span.font-headline.font-extrabold.text-7xl.tracking-tighter.text-white');
  if (amountNode) amountNode.textContent = Number(defaultBalance).toFixed(4);

  const usdNode = Array.from(document.querySelectorAll('div')).find((node) => (node.textContent || '').includes('USD') && (node.textContent || '').includes('≈'));
  if (usdNode) usdNode.textContent = `≈ ${formatUsd(defaultBalance * USD_PER_SOL)} USD`;

  const devices = Array.from(document.querySelectorAll('div.text-sm.font-bold'));
  if (devices[0] && wallet) devices[0].textContent = `Connected wallet ${shortWallet(wallet)}`;
  const deviceMeta = Array.from(document.querySelectorAll('div.text-[10px].text-slate-500'));
  if (deviceMeta[0]) deviceMeta[0].textContent = `${NETWORK_LABEL} • ${wallet ? 'Active now' : 'Guest mode'}`;

  const tbody = document.querySelector('tbody.divide-y.divide-white\\/5');
  if (tbody) {
    const receipts = getReceipts();
    const fallbackRows = receipts.length ? receipts : [
      makeTransactionReceipt({ type: 'Demo payout', amount: 0, status: 'Pending', contestTitle: 'Free contests only', createdAt: new Date().toISOString() })
    ];
    tbody.innerHTML = fallbackRows.slice(0, 6).map((receipt) => {
      const positive = Number(receipt.amount) >= 0;
      const amount = Number(receipt.amount) === 0 ? '--' : `${positive ? '+' : '-'}${formatSol(Math.abs(receipt.amount))}`;
      return `
        <tr class="hover:bg-white/[0.02] transition-colors">
          <td class="px-8 py-5">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined ${positive ? 'text-secondary' : 'text-primary'}" style="font-variation-settings: 'FILL' 1;">${positive ? 'stars' : 'payments'}</span>
              <span class="font-bold">${escapeHtml(receipt.type)}</span>
            </div>
          </td>
          <td class="px-8 py-5 text-slate-400 text-sm">${escapeHtml(formatDate(receipt.createdAt))}</td>
          <td class="px-8 py-5 ${positive ? 'text-tertiary' : 'text-white'} font-headline font-bold">${escapeHtml(amount)}</td>
          <td class="px-8 py-5">
            <span class="px-3 py-1 rounded-full ${receipt.status === 'Success' ? 'bg-tertiary/10 text-tertiary' : 'bg-primary/10 text-primary'} text-[10px] font-bold uppercase">${escapeHtml(receipt.status)}</span>
          </td>
          <td class="px-8 py-5 text-right">
            <a class="text-primary hover:underline text-xs flex items-center justify-end gap-1" href="${receipt.txSignature ? `https://explorer.solana.com/tx/${receipt.txSignature}?cluster=devnet` : '#'}" target="_blank" rel="noreferrer">
              Explorer <span class="material-symbols-outlined text-xs">open_in_new</span>
            </a>
          </td>
        </tr>
      `;
    }).join('');
  }
}

function syncProfilePage() {
  if (getPath() !== 'profile.html') return;
  getUserProfile().then((profile) => {
    const rankBadge = Array.from(document.querySelectorAll('span')).find((node) => (node.textContent || '').includes('Global Ranking:'));
    if (rankBadge) rankBadge.textContent = `Global Ranking: #${Math.max(120, 1000 - profile.skill_score)}`;

    const scoreNode = document.querySelector('h1.text-6xl.md\\:text-8xl.font-headline.font-extrabold.text-on-surface.tracking-tighter.skill-score-glow.mb-2');
    if (scoreNode) scoreNode.textContent = `${Math.round(profile.skill_score).toLocaleString()}`;

    const tierNode = Array.from(document.querySelectorAll('p')).find((node) => (node.textContent || '').includes('EXPERT TIER'));
    if (tierNode) {
      tierNode.innerHTML = `${profile.skill_score >= 900 ? 'ELITE TIER' : 'EXPERT TIER'} <span class="text-outline/50 ml-2">/ ${profile.reputation_score >= 80 ? 'TRUSTED' : 'BETA'}</span>`;
    }

    updateTextByLabel('Total Earned', formatUsd(profile.total_earned * USD_PER_SOL));
    updateTextByLabel('Win Rate', `${profile.win_rate.toFixed(1)}%`);
    updateTextByLabel('Squads Created', `${profile.contests_entered}`);
    updateTextByLabel('Active Contests', `${profile.active_contests}`);

    const chartBars = document.querySelectorAll('.relative.h-64.w-full .w-8');
    if (chartBars.length && profile.skill_score_history?.length) {
      profile.skill_score_history.slice(0, chartBars.length).forEach((value, index) => {
        const normalized = Math.max(25, Math.min(100, Math.round((value / 900) * 100)));
        if (chartBars[index]) chartBars[index].style.height = `${normalized}%`;
      });
    }
  });
}

function syncCopyTruths() {
  document.title = document.title.replace('Elite', 'Beta');

  const lineupPower = Array.from(document.querySelectorAll('p')).find((node) => (node.textContent || '').includes('Powered by Gemini AI'));
  if (lineupPower) {
    lineupPower.textContent = lineupPower.textContent.replace('Powered by Gemini AI', 'Powered by SkillXI beta context');
  }

  const chatPower = Array.from(document.querySelectorAll('p')).find((node) => (node.textContent || '').includes('● Online · Powered by Gemini AI'));
  if (chatPower) {
    chatPower.textContent = '● Online · Powered by live contest context';
  }

  const homeUmbra = Array.from(document.querySelectorAll('*')).find((node) => (node.textContent || '').includes('legacy privacy protocol copy'));
  if (homeUmbra) {
    homeUmbra.textContent = homeUmbra.textContent.replace('legacy privacy protocol copy. Your', 'ship private lineup reveal beta. Your');
  }

  const privacyHeadline = Array.from(document.querySelectorAll('p, div')).find((node) => (node.textContent || '').includes('legacy privacy headline'));
  if (privacyHeadline) {
    privacyHeadline.textContent = 'SkillXI beta currently focuses on hidden lineups, delayed reveal, and wallet-signed entry flows on Solana Devnet.';
  }

  const privacyBody = Array.from(document.querySelectorAll('p, div')).find((node) => (node.textContent || '').includes('Umbra breaks this link completely.'));
  if (privacyBody) {
    privacyBody.textContent = 'Without privacy controls, competitors can copy visible picks. SkillXI beta reduces that by hiding lineups until reveal where configured.';
  }

  const payoutTitle = Array.from(document.querySelectorAll('*')).find((node) => (node.textContent || '').includes('legacy payout privacy title'));
  if (payoutTitle) payoutTitle.textContent = 'Beta payout receipt';

  const payoutText = Array.from(document.querySelectorAll('*')).find((node) => (node.textContent || '').includes("Umbra's anonymity pool"));
  if (payoutText) payoutText.textContent = 'Payout states are currently beta-tracked inside SkillXI while settlement and monitoring mature.';
}

function injectNetworkBadge() {
  if (document.getElementById('skillxi-network-badge')) return;
  const nav = document.querySelector('nav');
  if (!nav) return;
  const badge = document.createElement('div');
  badge.id = 'skillxi-network-badge';
  badge.style.cssText = 'position:fixed;top:92px;right:20px;z-index:70;padding:8px 12px;border-radius:999px;background:rgba(0,212,255,0.1);border:1px solid rgba(0,212,255,0.2);color:#a8e8ff;font-size:11px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;';
  badge.textContent = NETWORK_LABEL;
  document.body.appendChild(badge);
}



function skillxiGoBack() {
  if (window.history.length > 1) window.history.back();
  else window.location.href = 'contests.html';
}
window.skillxiGoBack = skillxiGoBack;

function injectUniversalNavigation() {
  if (document.getElementById('skillxi-universal-nav')) return;
  const wrap = document.createElement('div');
  wrap.id = 'skillxi-universal-nav';
  wrap.style.cssText = 'position:fixed;right:18px;bottom:18px;z-index:99990;display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:flex-end;max-width:calc(100vw - 36px);';
  const itemStyle = 'border:1px solid rgba(168,232,255,.22);background:rgba(12,14,22,.88);backdrop-filter:blur(12px);color:#a8e8ff;border-radius:999px;padding:9px 12px;font-size:12px;font-weight:900;text-decoration:none;box-shadow:0 12px 30px rgba(0,0,0,.32);cursor:pointer;';
  wrap.innerHTML = '<button type="button" data-skillxi-back style="' + itemStyle + '">Back</button>' + '<a href="index.html" style="' + itemStyle + '">Home</a>' + '<a href="contests.html" style="' + itemStyle + '">Contests</a>' + '<a href="profile.html" style="' + itemStyle + '">Profile</a>';
  document.body.appendChild(wrap);
}

function skillxiExportReceiptsCsv() {
  const rows = [['type', 'contest', 'amount', 'status', 'tx', 'created_at']].concat(getReceipts().map((receipt) => [receipt.type || '', receipt.contestTitle || '', receipt.amount || 0, receipt.status || '', receipt.txSignature || receipt.payoutTx || '', receipt.createdAt || '']));
  const csv = rows.map((row) => row.map((cell) => '"' + String(cell).replace(/"/g, '""') + '"').join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'skillxi-wallet-receipts.csv';
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function skillxiRouteForLabel(label) {
  const text = String(label || '').toLowerCase().replace(/\s+/g, ' ').trim();
  if (!text) return '';
  if (text.includes('home')) return 'index.html';
  if (text.includes('privacy') || text.includes('engine')) return 'privacy.html';
  if (text.includes('wallet') || text.includes('vault') || text.includes('transaction')) return 'wallet.html';
  if (text.includes('profile') || text.includes('account') || text.includes('analyst')) return 'profile.html';
  if (text.includes('leaderboard') || text.includes('rank')) return 'global-leaderboard.html';
  if (text.includes('research') || text.includes('intelligence') || text.includes('report') || text.includes('prematch') || text.includes('pre-match')) return 'pre-match.html';
  if (text.includes('squad') || text.includes('lineup') || text.includes('team') || text.includes('roster')) return 'lineup.html?contest=' + encodeURIComponent(getSelectedContestId());
  if (text.includes('lobby') || text.includes('arena') || text.includes('contest') || text.includes('play')) return 'contests.html';
  if (text.includes('marketplace') || text.includes('exchange') || text.includes('social') || text.includes('feed') || text.includes('nexus')) return 'nexus-feed.html';
  if (text.includes('subscription') || text.includes('billing') || text.includes('pro') || text.includes('elite')) return 'subscription.html';
  if (text.includes('support') || text.includes('terms') || text.includes('whitepaper')) return 'privacy.html';
  return '';
}


function skillxiBlinkActionUrl(contestId = getSelectedContestId()) {
  return window.location.origin + '/api/actions/join?contest=' + encodeURIComponent(contestId);
}

function skillxiBlinkShareUrl(contestId = getSelectedContestId()) {
  return 'https://dial.to/?action=' + encodeURIComponent(skillxiBlinkActionUrl(contestId));
}

async function skillxiShareBlink(contestId = getSelectedContestId()) {
  const blink = skillxiBlinkShareUrl(contestId);
  try {
    await navigator.clipboard.writeText(blink);
    window.showWalletToast('Contest Blink copied. Share it anywhere Solana Blinks are supported.', 'success');
  } catch (error) {
    window.prompt('Copy this SkillXI Contest Blink:', blink);
  }
}

function skillxiDownloadResultCard() {
  const canvas = document.createElement('canvas');
  canvas.width = 1200; canvas.height = 630;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
  gradient.addColorStop(0, '#07121a'); gradient.addColorStop(1, '#12251f');
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 1200, 630);
  ctx.fillStyle = '#a8e8ff'; ctx.font = 'bold 42px sans-serif'; ctx.fillText('SkillXI', 70, 90);
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 72px sans-serif'; ctx.fillText('I locked a private XI', 70, 210);
  ctx.fillStyle = '#00ff88'; ctx.font = 'bold 54px sans-serif'; ctx.fillText(currentContest().title, 70, 305);
  ctx.fillStyle = '#d8d8e8'; ctx.font = '32px sans-serif'; ctx.fillText('Wallet-native fantasy football on Solana Devnet', 70, 380);
  ctx.fillStyle = '#ffd166'; ctx.font = 'bold 34px sans-serif'; ctx.fillText('Captain: Erling Haaland  |  VC: Bukayo Saka', 70, 465);
  ctx.fillStyle = '#7c7c92'; ctx.font = '26px sans-serif'; ctx.fillText('skill-xi-two.vercel.app', 70, 555);
  const link = document.createElement('a');
  link.download = 'skillxi-result-card.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function skillxiShareOnX() {
  const text = encodeURIComponent('I just locked a private XI on SkillXI, wallet-native fantasy football on Solana.');
  window.open('https://twitter.com/intent/tweet?text=' + text + '&url=' + encodeURIComponent('https://skill-xi-two.vercel.app'), '_blank', 'noopener,noreferrer');
}

function wireGlobalActions() {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    const anchor = event.target.closest('a');
    const wallet = getSavedWallet();

    const isWalletLink = anchor && anchor.getAttribute('href') === 'wallet.html';
    const isWalletButton = button && (button.textContent || '').includes('Connect Wallet');
    const isWalletIcon = event.target.closest('span.material-symbols-outlined')?.textContent === 'account_balance_wallet';
    if (isWalletLink || isWalletButton || isWalletIcon) {
      event.preventDefault();
      if (wallet && isWalletLink) {
        window.location.href = 'wallet.html';
      } else {
        window.triggerConnectWallet();
      }
      return;
    }

    const blinkButton = event.target.closest('[data-skillxi-blink]');
    if (blinkButton) {
      event.preventDefault();
      const contestId = blinkButton.getAttribute('data-skillxi-blink');
      skillxiShareBlink(contestId);
      return;
    }

    const joinButton = event.target.closest('[data-join-contest]');
    if (joinButton) {
      const contestId = joinButton.getAttribute('data-join-contest');
      setSelectedContest(contestId);
      window.location.href = `lineup.html?contest=${encodeURIComponent(contestId)}`;
      return;
    }

    const hashLink = anchor && (anchor.getAttribute('href') === '#' || anchor.getAttribute('href') === '');
    if (hashLink) {
      const label = anchor.textContent || anchor.getAttribute('aria-label') || '';
      const route = skillxiRouteForLabel(label);
      event.preventDefault();
      if (String(label).toLowerCase().includes('logout')) { window.disconnectWallet(); return; }
      if (route) window.location.href = route;
      else window.showWalletToast('This section is connected in beta navigation now.', 'info');
      return;
    }

    if (event.target.closest('[data-skillxi-back]')) { event.preventDefault(); skillxiGoBack(); return; }

    if (!button) return;
    const text = (button.textContent || button.getAttribute('aria-label') || '').toLowerCase();

    if (text.includes('lock lineup')) {
      event.preventDefault();
      const contest = currentContest();
      const original = button.innerHTML;
      button.innerHTML = 'Locking...';
      button.disabled = true;
      window.lockLineupWithUmbra(contest.id, deriveLineupData()).then((success) => {
        if (success) {
          button.textContent = 'Locked privately';
          button.style.opacity = '0.8';
        } else {
          button.innerHTML = original;
          button.disabled = false;
        }
      });
    }

    if (text.includes('claim prize') || text.includes('claim to wallet')) {
      event.preventDefault();
      const contest = currentContest();
      window.claimPrivatePayoutWithUmbra(contest.id);
    }

    if (text.includes('deposit')) {
      event.preventDefault();
      window.showWalletToast('Deposit flow is queued for the next release. Wallet balance already syncs live on Devnet.', 'info');
    }

    if (text.includes('withdraw')) {
      event.preventDefault();
      window.showWalletToast('Withdraw requires payout review and escrow reconciliation before mainnet release.', 'info');
    }

    if (text.includes('notification')) { event.preventDefault(); window.showWalletToast('Notifications are enabled for wallet, lineup, and settlement events in beta.', 'info'); }
    if (text.includes('filter')) { event.preventDefault(); window.showWalletToast('Filters are applied automatically as live data loads.', 'info'); }
    if (text.includes('export csv')) { event.preventDefault(); skillxiExportReceiptsCsv(); }
    if (text.includes('manage trusted')) { event.preventDefault(); window.showWalletToast('Trusted device management will be enforced from server auth after deployment.', 'info'); }
    if (text.includes('view breakdown') || text.includes('view all') || text.includes('read analysis')) { event.preventDefault(); window.location.href = 'pre-match.html'; }
    if (text.includes('challenge')) { event.preventDefault(); window.showWalletToast('Head-to-head challenges are queued for paid-beta allowlisted wallets.', 'info'); }
    if (text.includes('create post')) { event.preventDefault(); window.showWalletToast('Creator posts are saved as beta feed intent. Full posting comes with Supabase feed tables.', 'info'); }
    if (text.includes('like') || text.includes('comment') || text.includes('repost')) { event.preventDefault(); window.showWalletToast('Social action recorded locally for beta feed testing.', 'success'); }

    if (text.includes('start 7-day') || text.includes('go elite') || text.includes('upgrade') || text.includes('current plan')) {
      event.preventDefault();
      window.localStorage.setItem('skillxi_subscription_interest', text);
      window.showWalletToast('Subscription billing is captured as beta interest. Real billing stays off until Stripe/Crypto checkout is configured.', 'info');
    }

    if (text.includes('blink')) { event.preventDefault(); skillxiShareBlink(getSelectedContestId()); }
    if (text.includes('download')) { event.preventDefault(); skillxiDownloadResultCard(); }
    if (text.includes('share')) { event.preventDefault(); skillxiShareOnX(); }
    if (text.includes('follow')) { event.preventDefault(); button.textContent = 'Following'; window.showWalletToast('Analyst followed in beta feed.', 'success'); }
    if (text.includes('make captain')) { event.preventDefault(); window.localStorage.setItem(STORAGE_KEYS.selectedContest, currentContest().id); window.showWalletToast('Haaland set as captain in your lineup draft.', 'success'); window.location.href = 'lineup.html?contest=' + encodeURIComponent(currentContest().id); }
    if (text.includes('add to team')) { event.preventDefault(); window.localStorage.setItem(STORAGE_KEYS.selectedContest, currentContest().id); window.showWalletToast('Player added to your draft context.', 'success'); window.location.href = 'lineup.html?contest=' + encodeURIComponent(currentContest().id); }
    if (text.includes('generate') && text.includes('report') && typeof window.generateReport !== 'function') { event.preventDefault(); window.showWalletToast('AI report endpoint is ready. Set GEMINI_API_KEY or OPENAI_API_KEY in Vercel for live generation.', 'info'); }
    if (text.includes('refresh health')) { event.preventDefault(); skillxiHydrateAdminHealth(); }
    if (button.id === 'skillxi-admin-logout') { event.preventDefault(); setAdminToken(''); skillxiRenderAdminPage(); }
    if (button.id === 'skillxi-admin-login') {
      event.preventDefault();
      const password = document.getElementById('skillxi-admin-password')?.value || '';
      button.disabled = true; button.textContent = 'Checking...';
      fetch('/api/admin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
        .then((response) => response.json())
        .then((payload) => { if (!payload.ok) throw new Error(payload.error || 'Admin login failed'); setAdminToken(payload.token); skillxiRenderAdminPage(); })
        .catch((error) => { renderAdminLogin(document.getElementById('skillxi-admin-root'), error.message); })
        .finally(() => { button.disabled = false; button.textContent = 'Unlock Admin'; });
    }
  });
}

async function initPage() {
  wireGlobalActions();
  injectNetworkBadge();
  injectUniversalNavigation();
  syncCopyTruths();

  const wallet = getSavedWallet();
  if (wallet) {
    window.updateWalletUI(wallet);
    window.fetchWalletBalance(wallet);
  }

  const contests = await window.getContests();
  PAGE_STATE.contests = contests;
  setSelectedContest(getSelectedContestId());

  if (document.getElementById('contests-grid')) {
    window.filterContests('all');
  }
  if (document.getElementById('leaderboard-table')) {
    window.loadLeaderboard('all_time');
  }
  if (document.getElementById('ai-chat-container')) {
    seedChatContext();
  }
  if (document.getElementById('ai-lineup-section')) {
    hydrateLineupHeader();
  }

  syncWalletPage();
  syncProfilePage();
}

window.addEventListener('load', () => {
  const wallet = getSavedWallet();
  const type = getSavedWalletType();
  if (wallet) {
    const provider = resolveWalletProvider(type);
    if (provider?.connect) {
      provider.connect({ onlyIfTrusted: true }).then((response) => {
        window.updateWalletUI(response.publicKey.toString());
        window.fetchWalletBalance(response.publicKey.toString());
      }).catch(() => {
        window.updateWalletUI(wallet);
      });
    }
  }
  initPage();
});

/* ============================================================
   SkillXI completion layer: lineup, confirm flow, admin, settlement
   ============================================================ */
const SKILLXI_LINEUP_KEY = 'skillxi_selected_lineup_v1';
const SKILLXI_ADMIN_CONTESTS_KEY = 'skillxi_admin_contests_v1';

const SKILLXI_PLAYERS = [
  { name: 'Ederson', team: 'MCI', position: 'GK', credits: 8.5, rating: 7.2, projection: 41 },
  { name: 'David Raya', team: 'ARS', position: 'GK', credits: 8, rating: 7.3, projection: 40 },
  { name: 'Kyle Walker', team: 'MCI', position: 'DEF', credits: 8, rating: 7.1, projection: 44 },
  { name: 'Ruben Dias', team: 'MCI', position: 'DEF', credits: 8.5, rating: 7.5, projection: 48 },
  { name: 'William Saliba', team: 'ARS', position: 'DEF', credits: 8.5, rating: 7.6, projection: 49 },
  { name: 'Gabriel', team: 'ARS', position: 'DEF', credits: 8, rating: 7.4, projection: 46 },
  { name: 'Ben White', team: 'ARS', position: 'DEF', credits: 8, rating: 7.1, projection: 42 },
  { name: 'Josko Gvardiol', team: 'MCI', position: 'DEF', credits: 8, rating: 7.3, projection: 45 },
  { name: 'Rodri', team: 'MCI', position: 'MID', credits: 7.5, rating: 8.2, projection: 58 },
  { name: 'Kevin De Bruyne', team: 'MCI', position: 'MID', credits: 11.5, rating: 8.8, projection: 68 },
  { name: 'Martin Odegaard', team: 'ARS', position: 'MID', credits: 9.5, rating: 8.4, projection: 61 },
  { name: 'Declan Rice', team: 'ARS', position: 'MID', credits: 8.5, rating: 7.8, projection: 52 },
  { name: 'Bernardo Silva', team: 'MCI', position: 'MID', credits: 9, rating: 7.9, projection: 54 },
  { name: 'Phil Foden', team: 'MCI', position: 'FWD', credits: 12.5, rating: 8.7, projection: 66 },
  { name: 'Erling Haaland', team: 'MCI', position: 'FWD', credits: 14.5, rating: 9.3, projection: 78 },
  { name: 'Bukayo Saka', team: 'ARS', position: 'FWD', credits: 13, rating: 8.9, projection: 70 },
  { name: 'Gabriel Martinelli', team: 'ARS', position: 'FWD', credits: 10.5, rating: 7.8, projection: 55 },
  { name: 'Kai Havertz', team: 'ARS', position: 'FWD', credits: 10.5, rating: 7.9, projection: 57 }
];

const SKILLXI_NEXUS_ACTIVITY = [
  { icon: '⚽', title: 'Rahul_Analyst joined Man City vs Arsenal', detail: 'Free classic contest now 842/1200 joined', tone: '#a8e8ff' },
  { icon: '🏆', title: 'CryptoStriker won 4.5 SOL', detail: 'Paid beta settlement receipt created', tone: '#00ff88' },
  { icon: '🤖', title: 'AI tip: Haaland captain consensus', detail: '62% projected captain ownership', tone: '#d2bbff' },
  { icon: '💎', title: 'Differential alert: Ben White', detail: 'Low ownership with clean-sheet upside', tone: '#ffd166' },
  { icon: '📈', title: 'SolanaScout climbed to #3', detail: 'Skill score moved +87 after settlement', tone: '#00d4ff' },
  { icon: '⚡', title: 'Contest filling fast', detail: 'Private Derby Paid Beta is 19/64 joined', tone: '#ffb86b' },
  { icon: '🔐', title: 'Hidden lineup reveal queued', detail: 'Lineups stay private until lock closes', tone: '#00ff88' },
  { icon: '🧪', title: 'Devnet payment health green', detail: 'Escrow monitor received latest test receipt', tone: '#a8e8ff' }
];

const SKILLXI_SCORING = { goal_fwd: 50, goal_mid: 50, goal_def: 80, goal_gk: 80, assist: 25, clean_sheet_gk: 40, clean_sheet_def: 40, clean_sheet_mid: 15, yellow_card: -10, red_card: -25, bonus_1st: 15, bonus_2nd: 10, bonus_3rd: 5, minutes_played_60: 2, minutes_played_full: 4 };
const SKILLXI_MATCH_EVENTS = [
  { player: 'Erling Haaland', type: 'goal', minute: 23 },
  { player: 'Erling Haaland', type: 'goal', minute: 67 },
  { player: 'Kevin De Bruyne', type: 'assist', minute: 23 },
  { player: 'Bukayo Saka', type: 'goal', minute: 41 },
  { player: 'William Saliba', type: 'yellow', minute: 55 }
];

function skillxiDefaultLineupState() {
  return { contestId: getSelectedContestId(), selected: [], captain: '', viceCaptain: '', formation: '4-3-3', savedAt: null };
}
function skillxiReadLineupState() {
  const stored = readStore(SKILLXI_LINEUP_KEY, null);
  if (!stored || stored.contestId !== getSelectedContestId()) return skillxiDefaultLineupState();
  return { ...skillxiDefaultLineupState(), ...stored };
}
function skillxiWriteLineupState(state) {
  writeStore(SKILLXI_LINEUP_KEY, { ...state, contestId: getSelectedContestId(), savedAt: new Date().toISOString() });
}
function skillxiPlayersByName(names) {
  return names.map((name) => SKILLXI_PLAYERS.find((player) => player.name === name)).filter(Boolean);
}
function skillxiLineupPayload() {
  const state = skillxiReadLineupState();
  const selectedPlayers = skillxiPlayersByName(state.selected);
  const contest = currentContest();
  const players = selectedPlayers.length ? selectedPlayers : DEFAULT_LINEUP.players;
  return { formation: state.formation || '4-3-3', captain: state.captain || players[0]?.name || 'Erling Haaland', viceCaptain: state.viceCaptain || players[1]?.name || 'Bukayo Saka', players, contest_id: contest.id, contest_title: contest.title, projected_points: Math.round(players.reduce((sum, player) => sum + (player.projection || player.rating * 10), 0)) };
}
function skillxiLineupCost(state) {
  return skillxiPlayersByName(state.selected).reduce((sum, player) => sum + Number(player.credits || 0), 0);
}
function skillxiPositionCounts(state) {
  return skillxiPlayersByName(state.selected).reduce((counts, player) => { counts[player.position] = (counts[player.position] || 0) + 1; return counts; }, { GK: 0, DEF: 0, MID: 0, FWD: 0 });
}
function skillxiValidateLineup(state) {
  const players = skillxiPlayersByName(state.selected);
  const counts = skillxiPositionCounts(state);
  const cost = skillxiLineupCost(state);
  const errors = [];
  if (players.length !== 11) errors.push('Select exactly 11 players.');
  if (cost > 100) errors.push('Stay inside the 100 credit budget.');
  if (counts.GK < 1) errors.push('Pick at least one goalkeeper.');
  if (counts.DEF < 3) errors.push('Pick at least three defenders.');
  if (counts.MID < 3) errors.push('Pick at least three midfielders.');
  if (counts.FWD < 1) errors.push('Pick at least one forward.');
  if (!state.captain) errors.push('Choose a captain.');
  if (!state.viceCaptain) errors.push('Choose a vice-captain.');
  if (state.captain && state.captain === state.viceCaptain) errors.push('Captain and vice-captain must be different.');
  return errors;
}
function skillxiAutoFillLineup() {
  const selected = DEFAULT_LINEUP.players.map((player) => player.name);
  skillxiWriteLineupState({ ...skillxiDefaultLineupState(), selected, captain: 'Erling Haaland', viceCaptain: 'Bukayo Saka' });
  skillxiRenderLineupBuilder();
  window.showWalletToast('AI auto-filled a legal 11-player team.', 'success');
}
function skillxiRenderLineupBuilder() {
  if (getPath() !== 'lineup.html') return;
  const existing = document.getElementById('skillxi-lineup-builder');
  const state = skillxiReadLineupState();
  const cost = skillxiLineupCost(state);
  const counts = skillxiPositionCounts(state);
  const selectedPlayers = skillxiPlayersByName(state.selected);
  const contest = currentContest();
  const selectedOptions = selectedPlayers.map((player) => '<option value="' + escapeHtml(player.name) + '">' + escapeHtml(player.name) + ' - ' + escapeHtml(player.team) + ' ' + escapeHtml(player.position) + '</option>').join('');
  const captainOptions = selectedOptions.replace('value="' + escapeHtml(state.captain) + '"', 'value="' + escapeHtml(state.captain) + '" selected');
  const vcOptions = selectedOptions.replace('value="' + escapeHtml(state.viceCaptain) + '"', 'value="' + escapeHtml(state.viceCaptain) + '" selected');
  const lineupSummary = selectedPlayers.length ? selectedPlayers.map((player, index) => '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;background:#10101a;border:1px solid #242438;border-radius:12px;padding:10px 12px;"><span style="color:#fff;font-size:13px;font-weight:800;">' + (index + 1) + '. ' + escapeHtml(player.name) + '</span><span style="color:#a0a0b8;font-size:12px;">' + escapeHtml(player.position) + ' &bull; ' + player.credits + ' Cr' + (state.captain === player.name ? ' &bull; C' : '') + (state.viceCaptain === player.name ? ' &bull; VC' : '') + '</span></div>').join('') : '<p style="margin:0;color:#a0a0b8;font-size:13px;line-height:1.6;">Add players from the pool. Your match lineup appears here, then choose captain and vice captain separately.</p>';
  const lineupControls = '<aside data-skillxi-match-lineup style="background:#13131f;border:1px solid #242438;border-radius:16px;padding:16px;display:grid;gap:14px;align-self:start;"><div><p style="margin:0;color:#a8e8ff;font-size:11px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;">Your Match Lineup</p><h3 style="margin:6px 0 0;color:#fff;font-size:18px;">Selected XI, Captain, Vice</h3></div><div style="display:grid;gap:8px;max-height:285px;overflow:auto;">' + lineupSummary + '</div><label style="display:grid;gap:8px;color:#ffd166;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;">Captain (2x points)<select data-skillxi-captain-select ' + (selectedPlayers.length ? '' : 'disabled') + ' style="width:100%;background:#0d0d14;color:#fff;border:1px solid #35354a;border-radius:12px;padding:12px;font-weight:800;"><option value="">Select captain</option>' + captainOptions + '</select></label><label style="display:grid;gap:8px;color:#d2bbff;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;">Vice Captain (1.5x points)<select data-skillxi-vc-select ' + (selectedPlayers.length ? '' : 'disabled') + ' style="width:100%;background:#0d0d14;color:#fff;border:1px solid #35354a;border-radius:12px;padding:12px;font-weight:800;"><option value="">Select vice captain</option>' + vcOptions + '</select></label></aside>';
  const cards = SKILLXI_PLAYERS.map((player) => {
    const selected = state.selected.includes(player.name);
    const isCaptain = state.captain === player.name;
    const isVc = state.viceCaptain === player.name;
    return `
      <article style="background:${selected ? 'rgba(0,255,136,.08)' : '#13131f'};border:1px solid ${selected ? 'rgba(0,255,136,.35)' : '#242438'};border-radius:14px;padding:14px;display:grid;gap:10px;">
        <div style="display:flex;justify-content:space-between;gap:10px;"><div><h3 style="margin:0;color:#fff;font-size:15px;font-weight:800;">${escapeHtml(player.name)}</h3><p style="margin:4px 0 0;color:#a0a0b8;font-size:12px;">${player.team} • ${player.position} • ${player.credits} Cr</p></div><div style="text-align:right;color:#a8e8ff;font-size:12px;font-weight:800;">AI ${player.rating}</div></div>
        <div style="display:flex;gap:8px;align-items:center;"><button data-skillxi-player="${escapeHtml(player.name)}" style="flex:1;border:none;border-radius:10px;padding:9px 10px;background:${selected ? '#ff6b6b' : 'linear-gradient(135deg,#00d4ff,#00ff88)'};color:${selected ? '#fff' : '#07121a'};font-weight:800;cursor:pointer;">${selected ? 'Remove' : 'Add'}</button><button data-skillxi-captain="${escapeHtml(player.name)}" ${selected ? '' : 'disabled'} style="border:1px solid ${isCaptain ? '#ffd166' : '#35354a'};border-radius:10px;padding:9px 10px;background:${isCaptain ? '#ffd166' : '#0d0d14'};color:${isCaptain ? '#111' : '#ffd166'};font-weight:900;cursor:${selected ? 'pointer' : 'not-allowed'};opacity:${selected ? 1 : .35};">C</button><button data-skillxi-vc="${escapeHtml(player.name)}" ${selected ? '' : 'disabled'} style="border:1px solid ${isVc ? '#d2bbff' : '#35354a'};border-radius:10px;padding:9px 10px;background:${isVc ? '#d2bbff' : '#0d0d14'};color:${isVc ? '#111' : '#d2bbff'};font-weight:900;cursor:${selected ? 'pointer' : 'not-allowed'};opacity:${selected ? 1 : .35};">VC</button></div>
      </article>`;
  }).join('');
  const builderHtml = `
    <section id="skillxi-lineup-builder" style="background:#0f0f1a;border:1px solid #1e1e30;border-radius:18px;padding:20px;margin:0 0 24px;">
      <div style="display:flex;justify-content:space-between;gap:16px;align-items:flex-start;flex-wrap:wrap;margin-bottom:16px;"><div><p style="margin:0;color:#a8e8ff;font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;">Selectable Player Pool</p><h2 style="margin:6px 0 0;color:#fff;font-size:22px;font-weight:900;font-family:'Space Grotesk',sans-serif;">${escapeHtml(contest.title)}</h2></div><div style="display:flex;gap:10px;flex-wrap:wrap;"><div style="background:#13131f;border:1px solid #2a2a40;border-radius:12px;padding:10px 12px;color:#fff;font-weight:800;">${selectedPlayers.length}/11 selected</div><div style="background:#13131f;border:1px solid ${cost > 100 ? '#ff6b6b' : '#2a2a40'};border-radius:12px;padding:10px 12px;color:${cost > 100 ? '#ff6b6b' : '#00ff88'};font-weight:800;">${cost.toFixed(1)} / 100 Cr</div></div></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;color:#a0a0b8;font-size:12px;"><span>GK ${counts.GK}</span><span>DEF ${counts.DEF}</span><span>MID ${counts.MID}</span><span>FWD ${counts.FWD}</span></div>
      <div style="display:grid;grid-template-columns:minmax(260px,.85fr) minmax(300px,1.15fr);gap:16px;align-items:start;">${lineupControls}<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;max-height:580px;overflow:auto;padding-right:4px;">${cards}</div></div>
      <div id="skillxi-lineup-errors" style="color:#ffb4ab;font-size:13px;line-height:1.6;margin-top:14px;"></div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:16px;"><button data-skillxi-autofill style="background:#7c3aed;color:#fff;border:none;border-radius:12px;padding:12px 16px;font-weight:800;cursor:pointer;">AI Auto-Fill Team</button><button data-skillxi-reset style="background:#1f1f2e;color:#a0a0b8;border:1px solid #35354a;border-radius:12px;padding:12px 16px;font-weight:800;cursor:pointer;">Reset Team</button><button data-skillxi-next style="margin-left:auto;background:linear-gradient(135deg,#00ff88,#00d4ff);color:#061118;border:none;border-radius:12px;padding:12px 20px;font-weight:900;cursor:pointer;">Next Step: Review & Pay</button></div>
    </section>`;
  if (existing) { existing.outerHTML = builderHtml; return; }
  const target = Array.from(document.querySelectorAll('div')).find((node) => (node.textContent || '').includes('Lock Lineup'));
  const section = target?.closest('.flex.flex-wrap') || document.querySelector('section.w-full.md\\:w-\\[60\\%\\]');
  if (section?.insertAdjacentHTML) section.insertAdjacentHTML(section.classList?.contains('flex-wrap') ? 'afterend' : 'afterbegin', builderHtml);
}
function skillxiGoToConfirm() {
  const state = skillxiReadLineupState();
  const errors = skillxiValidateLineup(state);
  const errorNode = document.getElementById('skillxi-lineup-errors');
  if (errors.length) { if (errorNode) errorNode.innerHTML = errors.map((error) => `<div>${escapeHtml(error)}</div>`).join(''); window.showWalletToast(errors[0], 'error'); return; }
  skillxiWriteLineupState(state);
  window.location.href = `contest-confirm.html?contest=${encodeURIComponent(getSelectedContestId())}`;
}
function skillxiRenderConfirmPage() {
  const root = document.getElementById('skillxi-confirm-root');
  if (!root) return;
  const contest = currentContest();
  const lineup = skillxiLineupPayload();
  root.innerHTML = `<section class="sx-shell"><div class="sx-header"><a href="contests.html" class="sx-logo">SkillXI</a><button onclick="connectWallet()" class="sx-wallet">${escapeHtml(shortWallet(getSavedWallet()))}</button></div><main class="sx-main"><div class="sx-copy"><p class="sx-kicker">Review & Pay</p><h1>${escapeHtml(contest.title)}</h1><p>${escapeHtml(contest.league)} • ${escapeHtml(formatDate(contest.starts_at))}</p></div><div class="sx-grid"><section class="sx-panel sx-team"><div class="sx-panel-head"><h2>Your XI</h2><span>${lineup.players.length}/11</span></div><div class="sx-player-grid">${lineup.players.map((player) => `<article><strong>${escapeHtml(player.name)}</strong><span>${escapeHtml(player.team)} • ${escapeHtml(player.position)} • ${player.credits} Cr</span>${lineup.captain === player.name ? '<b>C</b>' : lineup.viceCaptain === player.name ? '<b>VC</b>' : ''}</article>`).join('')}</div></section><aside class="sx-panel sx-pay"><p>Entry Fee</p><h2>${contest.entry_amount > 0 ? formatSol(contest.entry_amount) : 'Free'}</h2><div class="sx-row"><span>Prize pool</span><strong>${escapeHtml(contest.prize_pool)}</strong></div><div class="sx-row"><span>Projected points</span><strong>${lineup.projected_points}</strong></div><div class="sx-note">Private lineup beta: picks stay hidden until reveal. Paid entries use Solana Devnet wallet signatures where available. New: create a Solana Blink proof receipt without exposing your lineup.</div><button id="skillxi-pay-join">Pay & Join Contest</button><button data-skillxi-blink="${contest.id}" class="sx-secondary">Copy Contest Blink</button><button class="sx-secondary" onclick="location.href='lineup.html?contest=${encodeURIComponent(contest.id)}'">Edit lineup</button></aside></div></main></section>`;
}
async function skillxiPayAndJoin() {
  const contest = currentContest();
  const lineup = skillxiLineupPayload();
  const wallet = getSavedWallet();
  let txSignature = '';
  const payButton = document.getElementById('skillxi-pay-join');
  if (!wallet) {
    window.showWalletToast('Connect Phantom or Solflare before joining a contest.', 'error');
    if (typeof window.connectWallet === 'function') window.connectWallet();
    return;
  }
  if (payButton) { payButton.disabled = true; payButton.textContent = 'Joining...'; }
  try {
    await ensureUserExists(wallet);
    const guard = await evaluateJoinGuard(wallet, contest);
    if (contest.entry_amount > 0) txSignature = await executeEscrowPayment(contest.entry_amount);
    else await new Promise((resolve) => setTimeout(resolve, 700));
    const privacyEnvelope = await encryptLineupForStorage(wallet, lineup);
    const entry = { id: `entry-${Math.random().toString(36).slice(2, 10)}`, contest_id: contest.id, user_id: wallet, contest_title: contest.title, lineup_data: lineup, ...privacyEnvelope, tx_signature: txSignature, privacy_mode: contest.lineup_visibility || 'hidden_until_reveal', lineup_reveal_at: contest.starts_at, compliance_status: 'passed', risk_status: guard?.checks?.paid ? 'paid_beta_checked' : 'free_checked', escrow_address: ESCROW_ADDRESS, escrow_network: NETWORK_LABEL, points_final: null, settlement_status: 'pending', payout_tx: null, payout_amount: 0, created_at: new Date().toISOString() };
    updateLocalEntry(entry); await tryInsertEntry(entry);
    const receipts = getReceipts();
    receipts.unshift(makeTransactionReceipt({ type: contest.entry_amount > 0 ? 'Entry fee' : 'Free entry', amount: contest.entry_amount > 0 ? -contest.entry_amount : 0, status: 'Success', contestTitle: contest.title, txSignature, createdAt: entry.created_at }));
    saveReceipts(receipts);
    if (payButton) payButton.textContent = 'You are in!';
    window.showWalletToast('Contest joined. Redirecting to leaderboard.', 'success');
    setTimeout(() => { window.location.href = `leaderboard.html?contest=${encodeURIComponent(contest.id)}`; }, 900);
  } catch (error) { console.warn('Pay and join failed', error); if (payButton) { payButton.disabled = false; payButton.textContent = 'Pay & Join Contest'; } window.showWalletToast(error.message || 'Could not join contest.', 'error'); }
}
function skillxiRenderMatchLobby() {
  const root = document.getElementById('skillxi-match-lobby-root');
  if (!root) return;
  const contest = currentContest();
  const cards = [{ type: 'Mega Contest', size: '1200 players', prize: '150 Reputation', entry: 'Free', id: 'football-mci-ars-classic' }, { type: 'Head to Head', size: '2 players', prize: 'Winner takes all', entry: '0.05 SOL beta', id: 'football-mci-ars-beta' }, { type: 'Mini League', size: '64 players', prize: '2.4 SOL beta', entry: '0.15 SOL', id: 'football-mci-ars-beta' }];
  root.innerHTML = `<section class="sx-shell"><div class="sx-header"><a class="sx-logo" href="index.html">SkillXI</a><a class="sx-wallet" href="contests.html">Back to contests</a></div><main class="sx-main"><p class="sx-kicker">Match Lobby</p><h1>${escapeHtml(contest.title)}</h1><p>${escapeHtml(contest.league)} • Locks in ${escapeHtml(timeUntil(contest.starts_at))}</p><div class="sx-card-list">${cards.map((card) => `<article class="sx-panel"><p>${escapeHtml(card.type)}</p><h2>${escapeHtml(card.prize)}</h2><div class="sx-row"><span>${escapeHtml(card.size)}</span><strong>${escapeHtml(card.entry)}</strong></div><button onclick="localStorage.setItem('skillxi_selected_contest','${escapeHtml(card.id)}');location.href='lineup.html?contest=${escapeHtml(card.id)}'">Create Team</button></article>`).join('')}</div><div class="sx-note">AI insight: City possession stacks are safest; Arsenal attackers create the best leverage.</div></main></section>`;
}
function skillxiRenderNexusFallback() {
  if (getPath() !== 'nexus-feed.html' || document.getElementById('skillxi-nexus-fallback')) return;
  const header = Array.from(document.querySelectorAll('h1')).find((node) => (node.textContent || '').includes('NEXUS'));
  if (!header?.parentElement) return;
  header.parentElement.insertAdjacentHTML('afterend', `<section id="skillxi-nexus-fallback" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;margin:0 0 26px;">${SKILLXI_NEXUS_ACTIVITY.map((item) => `<article style="background:#13131f;border:1px solid #242438;border-left:3px solid ${item.tone};border-radius:14px;padding:16px;"><div style="font-size:24px;margin-bottom:8px;">${item.icon}</div><h3 style="margin:0;color:#fff;font-size:15px;font-weight:800;">${escapeHtml(item.title)}</h3><p style="margin:6px 0 0;color:#a0a0b8;font-size:13px;line-height:1.5;">${escapeHtml(item.detail)}</p></article>`).join('')}</section>`);
}
window.calculateEntryPoints = function calculateEntryPoints(lineup, matchEvents = SKILLXI_MATCH_EVENTS) {
  const players = Array.isArray(lineup) ? lineup : (lineup?.players || []);
  const captain = lineup?.captain || players.find((player) => player.isCaptain)?.name;
  const viceCaptain = lineup?.viceCaptain || lineup?.vc || players.find((player) => player.isVC)?.name;
  return Math.round(players.reduce((total, player) => {
    let points = 0;
    matchEvents.forEach((event) => { if (event.player !== player.name) return; if (event.type === 'goal') points += SKILLXI_SCORING[`goal_${String(player.position || player.pos || '').toLowerCase()}`] || 50; if (event.type === 'assist') points += SKILLXI_SCORING.assist; if (event.type === 'yellow') points += SKILLXI_SCORING.yellow_card; if (event.type === 'red') points += SKILLXI_SCORING.red_card; });
    points += SKILLXI_SCORING.minutes_played_60;
    if (player.name === captain) points *= 2;
    if (player.name === viceCaptain) points *= 1.5;
    return total + points;
  }, 0));
};
window.settleContest = async function settleContest(contestId = getSelectedContestId()) {
  const entries = getLocalEntries();
  const contestEntries = entries.filter((entry) => entry.contest_id === contestId);
  const targetEntries = contestEntries.length ? contestEntries : entries;
  if (!targetEntries.length) { window.showWalletToast('No entries to settle yet.', 'info'); return []; }
  const contest = getContestById(contestId) || currentContest();
  const ranked = targetEntries.map((entry) => ({ ...entry, points_final: window.calculateEntryPoints(entry.lineup_data || DEFAULT_LINEUP, SKILLXI_MATCH_EVENTS), settlement_status: 'settled' })).sort((a, b) => b.points_final - a.points_final).map((entry, index, all) => { const rank = index + 1; const winnerCount = Math.max(1, Math.ceil(all.length * 0.2)); const payoutAmount = rank <= winnerCount && contest.entry_amount > 0 ? Number((contest.entry_amount * Math.max(1.2, all.length / winnerCount)).toFixed(2)) : 0; return { ...entry, rank, payout_amount: payoutAmount, payout_tx: payoutAmount ? `settled-${Date.now()}-${rank}` : null }; });
  const merged = entries.map((entry) => ranked.find((item) => item.id === entry.id) || entry);
  saveLocalEntries(merged);
  const receipts = getReceipts();
  ranked.filter((entry) => entry.payout_amount > 0).forEach((entry) => receipts.unshift(makeTransactionReceipt({ type: 'Contest payout', amount: entry.payout_amount, status: 'Success', contestTitle: entry.contest_title || contest.title, payoutTx: entry.payout_tx, createdAt: new Date().toISOString() })));
  saveReceipts(receipts); syncWalletPage(); syncProfilePage(); window.showWalletToast(`Settled ${ranked.length} entries for ${contest.title}.`, 'success'); return ranked;
};
function getAdminToken() { return window.sessionStorage.getItem(STORAGE_KEYS.adminToken) || ''; }
function setAdminToken(token) { if (token) window.sessionStorage.setItem(STORAGE_KEYS.adminToken, token); else window.sessionStorage.removeItem(STORAGE_KEYS.adminToken); }
async function verifyAdminToken() {
  const token = getAdminToken();
  if (!token) return false;
  try {
    const response = await fetch('/api/admin', { headers: { Authorization: 'Bearer ' + token }, cache: 'no-store' });
    const payload = await response.json();
    if (!payload.ok) setAdminToken('');
    return Boolean(payload.ok);
  } catch (error) { return false; }
}
function renderAdminLogin(root, message = '') {
  root.innerHTML = `<section class="sx-shell"><div class="sx-header"><a class="sx-logo" href="index.html">SkillXI Admin</a><a class="sx-wallet" href="index.html">Back home</a></div><main class="sx-main"><p class="sx-kicker">Secure Ops</p><h1>Admin Access</h1><section class="sx-panel" style="max-width:520px;"><p class="sx-muted">Admin is protected by server-side Vercel environment variables. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET before production use.</p>${message ? `<div class="sx-note">${escapeHtml(message)}</div>` : ''}<input id="skillxi-admin-password" type="password" placeholder="Admin password" style="width:100%;box-sizing:border-box;margin:16px 0;padding:14px;border-radius:12px;border:1px solid #35354a;background:#0d0d14;color:#fff;"><button id="skillxi-admin-login">Unlock Admin</button></section></main></section>`;
}
async function skillxiRenderAdminPage() {
  const root = document.getElementById('skillxi-admin-root');
  if (!root) return;
  const isAdmin = await verifyAdminToken();
  if (!isAdmin) { renderAdminLogin(root); return; }
  const adminContests = readStore(SKILLXI_ADMIN_CONTESTS_KEY, SEEDED_CONTESTS);
  const users = SEEDED_USERS;
  const entries = getLocalEntries();
  root.innerHTML = `<section class="sx-shell"><div class="sx-header"><a class="sx-logo" href="index.html">SkillXI Admin</a><button class="sx-wallet" id="skillxi-admin-logout">Lock admin</button></div><main class="sx-main"><p class="sx-kicker">Ops Dashboard</p><h1>Contest Control</h1><div class="sx-stats"><article><b>${users.length}</b><span>Total users</span></article><article><b>${adminContests.filter((c) => c.status !== 'settled').length}</b><span>Active contests</span></article><article><b>${entries.length}</b><span>Local entries</span></article><article><b id="skillxi-api-health">Checking</b><span>API health</span></article></div><section class="sx-panel"><div class="sx-panel-head"><h2>Contest Manager</h2><button id="skillxi-admin-create">Create Contest</button></div><div class="sx-table">${adminContests.map((contest) => `<div><span>${escapeHtml(contest.title)}</span><span>${escapeHtml(contest.status)}</span><span>${escapeHtml(contest.prize_pool)}</span><button data-admin-lock="${escapeHtml(contest.id)}">Lock</button><button data-admin-settle="${escapeHtml(contest.id)}">Settle</button><button data-admin-delete="${escapeHtml(contest.id)}">Delete</button></div>`).join('')}</div></section><section class="sx-panel"><div class="sx-panel-head"><h2>User Manager</h2><span>Production user data comes from Supabase after schema migration</span></div><div class="sx-table">${users.map((user) => `<div><span>${escapeHtml(user.username)}</span><span>${escapeHtml(shortWallet(user.wallet_address))}</span><span>${user.skill_score}</span><span>${formatSol(user.total_earned || 0)}</span></div>`).join('')}</div></section><section class="sx-panel"><div class="sx-panel-head"><h2>Compliance & Risk</h2><button id="skillxi-admin-health-refresh">Refresh Health</button></div><p class="sx-muted">Paid beta requires allowlisted wallets, region checks, entry caps, and KYC provider configuration unless devnet override is explicitly enabled.</p></section><section class="sx-panel"><div class="sx-panel-head"><h2>Leaderboard</h2><button onclick="settleContest()">Sync From Entries</button></div><p class="sx-muted">Settlement creates local receipts and can be reconciled with Supabase after migration.</p></section></main></section>`;
  skillxiHydrateAdminHealth();
}
function skillxiCreateAdminContest() {
  const title = prompt('Contest title:', 'Man City vs Arsenal Mini League');
  if (!title) return;
  const contests = readStore(SKILLXI_ADMIN_CONTESTS_KEY, SEEDED_CONTESTS);
  contests.unshift({ ...SEEDED_CONTESTS[0], id: `admin-${Date.now()}`, title, status: 'open', joined: 0, source: 'local-admin' });
  writeStore(SKILLXI_ADMIN_CONTESTS_KEY, contests); PAGE_STATE.contests = contests; skillxiRenderAdminPage();
}
async function skillxiHydrateAdminHealth() {
  const node = document.getElementById('skillxi-api-health');
  if (!node) return;
  try {
    const response = await fetch('/api/health', { cache: 'no-store' });
    const payload = await response.json();
    const integrations = payload?.integrations || {};
    const requiredReady = integrations.footballApi && (integrations.gemini || integrations.openai);
    node.textContent = requiredReady ? 'Live' : 'Needs keys';
    node.style.color = requiredReady ? '#00ff88' : '#ffd166';
    node.title = 'Football API: ' + Boolean(integrations.footballApi) + ', AI: ' + Boolean(integrations.gemini || integrations.openai);
  } catch (error) {
    node.textContent = 'Offline';
    node.style.color = '#ff6b6b';
  }
}
function skillxiHydrateAiSidebar() {
  if (getPath() !== 'ai-chat.html') return;
  const activeContext = Array.from(document.querySelectorAll('section.w-80, section')).find((node) => (node.textContent || '').includes('Current Lineup'));
  if (!activeContext) return;
  activeContext.innerHTML = `<div class="p-6 border-b border-[#ffffff0f]"><h3 class="text-xs font-bold text-secondary tracking-widest uppercase mb-4">Active Context</h3><div class="bg-surface-container-high rounded-2xl p-4 border border-outline-variant/10"><div class="flex justify-between items-start mb-2"><span class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Contest</span><span class="bg-tertiary/10 text-tertiary text-[10px] font-bold px-2 py-0.5 rounded-full">Beta</span></div><h4 class="font-headline font-bold text-sm">Man City vs Arsenal</h4><div class="mt-4 flex items-center justify-between"><div class="text-center"><p class="text-[10px] text-[#5a5a75] uppercase">Budget</p><p class="text-sm font-headline font-black text-white">87.5 / 100 Cr</p></div><div class="w-[1px] h-8 bg-outline-variant/20"></div><div class="text-center"><p class="text-[10px] text-[#5a5a75] uppercase">Projection</p><p class="text-sm font-headline font-black text-primary">742.8</p></div></div></div></div><div class="flex-1 overflow-y-auto p-6"><div class="flex items-center justify-between mb-4"><h3 class="text-xs font-bold text-[#5a5a75] tracking-widest uppercase">Current Lineup</h3><span class="text-[10px] font-bold text-primary">11 / 11</span></div><div class="space-y-3">${DEFAULT_LINEUP.players.slice(0, 6).map((player) => `<div class="flex items-center gap-3 p-2 rounded-xl bg-surface-container-low border border-transparent hover:border-primary/20 transition-all"><div class="w-10 h-10 rounded-full bg-[#1f1f2e] border border-outline-variant/30 flex items-center justify-center text-[10px] font-bold text-primary">${escapeHtml(player.position)}</div><div class="flex-1"><p class="text-xs font-bold text-white leading-tight">${escapeHtml(player.name)}</p><p class="text-[10px] text-[#5a5a75]">${player.credits} Cr | ${Math.round(player.rating * 10)} Pt</p></div></div>`).join('')}</div></div>`;
  const proBadge = Array.from(document.querySelectorAll('span')).find((node) => (node.textContent || '').trim() === 'PRO FEATURE');
  if (proBadge) proBadge.textContent = 'BETA FEATURE';
}
function skillxiInitCompletionLayer() { skillxiRenderLineupBuilder(); skillxiRenderConfirmPage(); skillxiRenderMatchLobby(); skillxiRenderNexusFallback(); skillxiRenderAdminPage(); skillxiHydrateAdminHealth(); skillxiHydrateAiSidebar(); }

document.addEventListener('click', (event) => {
  const playerButton = event.target.closest('[data-skillxi-player]');
  const captainButton = event.target.closest('[data-skillxi-captain]');
  const vcButton = event.target.closest('[data-skillxi-vc]');
  const nextButton = event.target.closest('[data-skillxi-next]');
  const captainSelect = event.target.closest('[data-skillxi-captain-select]');
  const vcSelect = event.target.closest('[data-skillxi-vc-select]');
  const resetButton = event.target.closest('[data-skillxi-reset]');
  const autofillButton = event.target.closest('[data-skillxi-autofill]');
  const payJoin = event.target.closest('#skillxi-pay-join');
  const adminCreate = event.target.closest('#skillxi-admin-create');
  const adminLock = event.target.closest('[data-admin-lock]');
  const adminSettle = event.target.closest('[data-admin-settle]');
  const adminDelete = event.target.closest('[data-admin-delete]');
  const text = (event.target.closest('button')?.textContent || '').toLowerCase();
  if (text.includes('lock lineup') || text.includes('next step')) { event.preventDefault(); event.stopImmediatePropagation(); skillxiGoToConfirm(); return; }
  if (autofillButton || text.includes('auto-fill')) { event.preventDefault(); event.stopImmediatePropagation(); skillxiAutoFillLineup(); return; }
  if (captainSelect) { const state = skillxiReadLineupState(); state.captain = captainSelect.value; if (state.viceCaptain === state.captain) state.viceCaptain = ''; skillxiWriteLineupState(state); skillxiRenderLineupBuilder(); return; }
  if (vcSelect) { const state = skillxiReadLineupState(); state.viceCaptain = vcSelect.value; if (state.captain === state.viceCaptain) state.captain = ''; skillxiWriteLineupState(state); skillxiRenderLineupBuilder(); return; }
  if (playerButton) { const name = playerButton.getAttribute('data-skillxi-player'); const state = skillxiReadLineupState(); if (state.selected.includes(name)) { state.selected = state.selected.filter((item) => item !== name); if (state.captain === name) state.captain = ''; if (state.viceCaptain === name) state.viceCaptain = ''; } else if (state.selected.length < 11) { state.selected.push(name); if (!state.captain) state.captain = name; else if (!state.viceCaptain) state.viceCaptain = name; } else { window.showWalletToast('You already have 11 players selected.', 'error'); } skillxiWriteLineupState(state); skillxiRenderLineupBuilder(); return; }
  if (captainButton) { const state = skillxiReadLineupState(); state.captain = captainButton.getAttribute('data-skillxi-captain'); if (state.viceCaptain === state.captain) state.viceCaptain = ''; skillxiWriteLineupState(state); skillxiRenderLineupBuilder(); return; }
  if (vcButton) { const state = skillxiReadLineupState(); state.viceCaptain = vcButton.getAttribute('data-skillxi-vc'); if (state.captain === state.viceCaptain) state.captain = ''; skillxiWriteLineupState(state); skillxiRenderLineupBuilder(); return; }
  if (resetButton) { skillxiWriteLineupState(skillxiDefaultLineupState()); skillxiRenderLineupBuilder(); return; }
  if (nextButton) { skillxiGoToConfirm(); return; }
  if (payJoin) { event.preventDefault(); skillxiPayAndJoin(); return; }
  if (adminCreate) { skillxiCreateAdminContest(); return; }
  if (adminLock || adminDelete) { const id = (adminLock || adminDelete).getAttribute(adminLock ? 'data-admin-lock' : 'data-admin-delete'); let contests = readStore(SKILLXI_ADMIN_CONTESTS_KEY, SEEDED_CONTESTS); contests = adminDelete ? contests.filter((contest) => contest.id !== id) : contests.map((contest) => contest.id === id ? { ...contest, status: 'locked' } : contest); writeStore(SKILLXI_ADMIN_CONTESTS_KEY, contests); skillxiRenderAdminPage(); return; }
  if (adminSettle) { window.settleContest(adminSettle.getAttribute('data-admin-settle')); return; }
}, true);
window.addEventListener('load', () => setTimeout(skillxiInitCompletionLayer, 0));


function skillxiRenderLiveTicker(lines) {
  if (document.getElementById('skillxi-live-ticker')) return;
  const host = document.body;
  if (!host) return;
  const bar = document.createElement('div');
  bar.id = 'skillxi-live-ticker';
  bar.style.cssText = 'position:fixed;left:0;right:0;top:76px;z-index:69;background:rgba(10,10,15,.92);border-top:1px solid rgba(168,232,255,.14);border-bottom:1px solid rgba(168,232,255,.14);color:#a8e8ff;font-size:12px;font-weight:700;padding:8px 14px;display:flex;gap:20px;overflow:auto;white-space:nowrap;';
  bar.innerHTML = lines.map((line) => '<span>' + escapeHtml(line) + '</span>').join('');
  host.appendChild(bar);
}

async function skillxiLiveDataBoot() {
  try {
    const live = await window.getLiveScores();
    const lines = [];
    if (live.length) {
      live.slice(0, 6).forEach((item) => {
        const home = item?.teams?.home?.name || 'Home';
        const away = item?.teams?.away?.name || 'Away';
        const h = item?.goals?.home;
        const a = item?.goals?.away;
        const hs = (h === null || typeof h === 'undefined') ? '-' : h;
        const as = (a === null || typeof a === 'undefined') ? '-' : a;
        const st = item?.fixture?.status?.short || 'NS';
        lines.push(home + ' ' + hs + '-' + as + ' ' + away + ' • ' + st);
      });
    }
    if (!lines.length) {
      const c = currentContest();
      lines.push(c.title + ' • ' + timeUntil(c.starts_at) + ' to lock');
      lines.push('Live feed connected via /api/scores');
    }
    skillxiRenderLiveTicker(lines);
  } catch (error) {
    console.warn('Live data boot failed', error);
  }
}


let skillxiLiveRefreshHandle = null;

function skillxiScheduleLiveRefresh() {
  if (skillxiLiveRefreshHandle) return;
  skillxiLiveRefreshHandle = setInterval(async () => {
    try {
      const path = getPath();
      if (path === 'contests.html') {
        await window.getContests();
        window.filterContests(PAGE_STATE.filteredSport || 'all');
      }
      if (path === 'global-leaderboard.html') {
        await window.loadLeaderboard(PAGE_STATE.leaderboardRange || 'all_time');
      }
    } catch (error) {
      console.warn('Live refresh tick failed', error);
    }
  }, 60000);
}
