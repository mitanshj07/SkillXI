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

