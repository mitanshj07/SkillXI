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

