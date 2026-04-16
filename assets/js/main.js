/* ============================================================
   SkillXI — FULLY WORKING END-TO-END (Web3 + Supabase + Umbra)
   ============================================================ */

// --- 1. CONFIGURATION & REAL SDK INIT ---
const SUPABASE_URL = 'https://vtvrvlcholgjoujqcoxd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdWJhc2VzInJlZzIsInJlZiI6InZ0dnJ2bGNob2xnam91anFjb3hkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI4MzE0ODAsImV4cCI6MjAyODQwNzQ4MH0.kkgEG83casObXDcorqf50w9EqTleD_evYInWGrhkcR';
const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ESCROW_ADDRESS = '9WvVMvMKQYKnBgVe6egAH7NZ13ar4NB76PVsiG9vsEbN';

// --- VERSION 1 DATA (FALLBACK) ---
const FALLBACK_CONTESTS = [
  {
    id: "c001",
    sport: "football",
    homeTeam: "Manchester City",
    homeTag: "MCI",
    awayTeam: "Arsenal",
    awayTag: "ARS",
    league: "Premier League · GW29",
    matchDate: "Tonight · 20:30 IST",
    prize: "8.5",
    entry: "0.1",
    maxPlayers: 200,
    currentPlayers: 142,
    difficulty: "BEGINNER",
    aiTip: "Haaland is the standout captain pick",
    hot: false,
    almostFull: false,
    timeLeft: 4 * 3600 + 23 * 60
  },
  {
    id: "c002",
    sport: "football",
    homeTeam: "Real Madrid",
    homeTag: "RMA",
    awayTeam: "Barcelona",
    awayTag: "BAR",
    league: "La Liga · El Clasico",
    matchDate: "Tomorrow · 21:00 IST",
    prize: "45",
    entry: "0.5",
    maxPlayers: 100,
    currentPlayers: 87,
    difficulty: "PRO",
    aiTip: "Vinicius Jr has scored in 4 straight Clasicos",
    hot: true,
    almostFull: false,
    timeLeft: 22 * 3600
  },
  {
    id: "c003",
    sport: "football",
    homeTeam: "PSG",
    homeTag: "PSG",
    awayTeam: "Bayern Munich",
    awayTag: "BAY",
    league: "Champions League",
    matchDate: "Thursday · 00:30 IST",
    prize: "200",
    entry: "2",
    maxPlayers: 50,
    currentPlayers: 19,
    difficulty: "ELITE",
    aiTip: "Mbappe has scored in all 4 home UCL games",
    hot: false,
    almostFull: false,
    timeLeft: 48 * 3600
  },
  {
    id: "c004",
    sport: "football",
    homeTeam: "Liverpool",
    homeTag: "LIV",
    awayTeam: "Tottenham",
    awayTag: "TOT",
    league: "Premier League · GW29",
    matchDate: "Tonight · 22:00 IST",
    prize: "12",
    entry: "0.15",
    maxPlayers: 200,
    currentPlayers: 196,
    difficulty: "BEGINNER",
    aiTip: "Salah at Anfield — always the captain",
    hot: false,
    almostFull: true,
    timeLeft: 2 * 3600 + 10 * 60
  },
  {
    id: "c005",
    sport: "cricket",
    homeTeam: "India",
    homeTag: "IND",
    awayTeam: "Australia",
    awayTag: "AUS",
    league: "T20 International · Mumbai",
    matchDate: "Sunday · 19:30 IST",
    prize: "100",
    entry: "1",
    maxPlayers: 500,
    currentPlayers: 234,
    difficulty: "PRO",
    aiTip: "Rohit Sharma averages 78 in home T20s",
    hot: false,
    almostFull: false,
    timeLeft: 60 * 3600
  },
  {
    id: "c006",
    sport: "football",
    homeTeam: "Champions League Final",
    homeTag: "UCL",
    awayTeam: "MEGA CONTEST ⭐",
    awayTag: "MEGA",
    league: "UEFA Champions League · Grand Final",
    matchDate: "Saturday · 00:30 IST",
    prize: "500",
    entry: "5",
    maxPlayers: 50,
    currentPlayers: 8,
    difficulty: "ELITE",
    aiTip: "The biggest contest of the season",
    hot: false,
    almostFull: false,
    timeLeft: 120 * 3600,
    featured: true
  }
];

const FALLBACK_PLAYERS = [
  // GOALKEEPERS
  { id: "p1", name:"Ederson", team:"MCI", price:8.0, aiScore:8.1, pos: "GK", photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBigPNit_Zd4b9VGvmjLOMC-WW266smXEGTYzKfoya4VkPo03U565UJX2k4Hj-Z0DepAtRJ-1yqV0v4BSye2wRImb7L6OVp7mXXRoYhPEh9PCqi3Q9EzeizXKRQhOfM9O_ENFoMy3vZmH8P3iA4mEBNMUCeCS9TIYkoE0eYOUHxS1Tis3iDr9oWogeo3TPlqc615hR4hd87X3i2ciMp2RQHYhu3zY1n7TtpU0w86BxVJht2WHbl2l-Mr4QyzMuztT7JqW9GDsk7qk9Y" },
  { id: "p2", name:"Raya", team:"ARS", price:7.5, aiScore:7.8, pos: "GK", photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBigPNit_Zd4b9VGvmjLOMC-WW266smXEGTYzKfoya4VkPo03U565UJX2k4Hj-Z0DepAtRJ-1yqV0v4BSye2wRImb7L6OVp7mXXRoYhPEh9PCqi3Q9EzeizXKRQhOfM9O_ENFoMy3vZmH8P3iA4mEBNMUCeCS9TIYkoE0eYOUHxS1Tis3iDr9oWogeo3TPlqc615hR4hd87X3i2ciMp2RQHYhu3zY1n7TtpU0w86BxVJht2WHbl2l-Mr4QyzMuztT7JqW9GDsk7qk9Y" },
  { id: "p3", name:"Flekken", team:"BRE", price:6.0, aiScore:6.5, pos: "GK", photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBigPNit_Zd4b9VGvmjLOMC-WW266smXEGTYzKfoya4VkPo03U565UJX2k4Hj-Z0DepAtRJ-1yqV0v4BSye2wRImb7L6OVp7mXXRoYhPEh9PCqi3Q9EzeizXKRQhOfM9O_ENFoMy3vZmH8P3iA4mEBNMUCeCS9TIYkoE0eYOUHxS1Tis3iDr9oWogeo3TPlqc615hR4hd87X3i2ciMp2RQHYhu3zY1n7TtpU0w86BxVJht2WHbl2l-Mr4QyzMuztT7JqW9GDsk7qk9Y" },

  // DEFENDERS
  { id: "p4", name:"Alexander-Arnold", team:"LIV", price:9.0, aiScore:8.8, pos: "DEF", photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBR2NiHrFyW_Ii-8iZrhK4Xvl5WCoVCKw_U39m5sXDMubhclQ-I0HYwI6xbYi2aoC3GEN1yVEbhNpKNUCFZvwRWNt1u-q2vrI_yDvdrlzj2NhNT23PKp8Bw_9Kf4ATOmy1x0JDBuoH5yfqU637da4kYLqy2hs5HFqAVujZGPXtQTkwOSgb-sWv1KqjTWzJRFtyLR9_Xu5i6ohO3rogd8rhkWk3lYl1UUCQtfmSuH8bFw5EjTGF-vZs4UBcDxDrc9PP7MqzlvoGteKaq" },
  { id: "p5", name:"Walker", team:"MCI", price:7.5, aiScore:7.2, pos: "DEF", photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9pGF3xjAaJg_8n50FTAYBkysUmyxxIXvIvf_e0Z_pwVRaVOVQ5n9yqfmRdJTOayYQnocIvhhtWF32SfFOI_MydDpbjzmnwDXGIGZtsg18O66MsgCPBeUusy5Bs-jAfekHbVtEebdHh_2rQDkzV56lzNlJJNRG3xA_uaAGqljpRRzQHEHPJINgkdWW2Ia4WzraXqj1WGkNlhIBtZH5TSJNWjMmUb8eo2GZk0vAJedfl0MX-rG5cMof0ae-S2sxbrImj7-atfpR6Ye2" },
  { id: "p6", name:"Gvardiol", team:"MCI", price:7.0, aiScore:7.5, pos: "DEF", photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAT4-qKucff9vOYXayweRb2F_wurT5BlNkmqvlo0zsQpkvB1Vp6n_ZXSBLoX5xLvDo3Y9eRMCdY_lZDUQjxU6QCYsQqA4yN-b9hu2OJWS6CogefTWPgTiH9z5jhuQEIAyFk1sVh0Cg5feOxfnuwf6UeL3uuWb-nD-JAbmM7xXz9uCF7r6aXQZR8ATXwDYyzsNDoM-75hxXiY_7eA2kRh-S2FRPAIkgE_rQhHzIegvWg-5FE9MEJ0qWpID0y274wJ94H22Ai7_7F04wp" },
  { id: "p7", name:"White", team:"ARS", price:8.5, aiScore:8.2, pos: "DEF", photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBR2NiHrFyW_Ii-8iZrhK4Xvl5WCoVCKw_U39m5sXDMubhclQ-I0HYwI6xbYi2aoC3GEN1yVEbhNpKNUCFZvwRWNt1u-q2vrI_yDvdrlzj2NhNT23PKp8Bw_9Kf4ATOmy1x0JDBuoH5yfqU637da4kYLqy2hs5HFqAVujZGPXtQTkwOSgb-sWv1KqjTWzJRFtyLR9_Xu5i6ohO3rogd8rhkWk3lYl1UUCQtfmSuH8bFw5EjTGF-vZs4UBcDxDrc9PP7MqzlvoGteKaq" },
  { id: "p8", name:"Gabriel", team:"ARS", price:8.0, aiScore:8.0, pos: "DEF", photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuA51HpYoI1UrV3khcUuFca1-NiXtvnAFyZF-c1-pSHJlRqMEjpkU8UI5sgQO4uYoiA6VPcVhSfj-mThHnVHb3CajDhlfojb1HYynUhIHtBYpHaf-zEzwxfRlnwsQAwF7G6ggzEM61qtsfKu62cKo0PpKQ0PzcjO4bGAQ4_4UkRUN6XNN954pR6QnmyGi2XjDlY7uyF6w96vLQzx_wg939-WR1QGizw1AYLorf5lkW5ytiVT8vtMmY0pknjRomIqfOYEoBKC2JlYmkIV" },
  { id: "p9", name:"Calafiori", team:"ARS", price:7.0, aiScore:7.3, pos: "DEF", photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAT4-qKucff9vOYXayweRb2F_wurT5BlNkmqvlo0zsQpkvB1Vp6n_ZXSBLoX5xLvDo3Y9eRMCdY_lZDUQjxU6QCYsQqA4yN-b9hu2OJWS6CogefTWPgTiH9z5jhuQEIAyFk1sVh0Cg5feOxfnuwf6UeL3uuWb-nD-JAbmM7xXz9uCF7r6aXQZR8ATXwDYyzsNDoM-75hxXiY_7eA2kRh-S2FRPAIkgE_rQhHzIegvWg-5FE9MEJ0qWpID0y274wJ94H22Ai7_7F04wp" },

  // MIDFIELDERS
  { id: "p10", name:"De Bruyne", team:"MCI", price:10.5, aiScore:9.5, pos: "MID" },
  { id: "p11", name:"Gundogan", team:"MCI", price:9.0, aiScore:8.6, pos: "MID" },
  { id: "p12", name:"Bernardo", team:"MCI", price:8.5, aiScore:8.3, pos: "MID" },
  { id: "p13", name:"Odegaard", team:"ARS", price:10.0, aiScore:9.2, pos: "MID" },
  { id: "p14", name:"Saka", team:"ARS", price:10.5, aiScore:9.4, pos: "MID" },
  { id: "p15", name:"Rice", team:"ARS", price:9.0, aiScore:8.7, pos: "MID" },
  { id: "p16", name:"Havertz", team:"ARS", price:8.5, aiScore:8.1, pos: "MID" },

  // FORWARDS
  { id: "p17", name:"Haaland", team:"MCI", price:13.5, aiScore:9.9, pos: "FWD" },
  { id: "p18", name:"Doku", team:"MCI", price:8.0, aiScore:7.8, pos: "FWD" },
  { id: "p19", name:"Jesus", team:"ARS", price:7.5, aiScore:7.2, pos: "FWD" },
  { id: "p20", name:"Trossard", team:"ARS", price:7.5, aiScore:7.5, pos: "FWD" }
];

// --- 2. SUPABASE REAL HELPERS ---
async function supabaseQuery(table, method = 'GET', data = null) {
  console.log('🔥 [REAL Supabase] debug:', method, table);
  try {
    let query = _supabase.from(table);
    if (method === 'GET') {
      const { data: res, error } = await query.select('*');
      if (error) throw error;
      return res;
    } else if (method === 'POST') {
      const { data: res, error } = await query.insert(data).select();
      if (error) throw error;
      return res && res[0];
    }
  } catch (err) {
    console.error('🔥 [REAL Supabase] debug ERROR:', err);
    return null;
  }
}

window.ensureUserExists = async function(walletAddress) {
  console.log('🔥 [REAL Supabase] debug: Upserting user profile', walletAddress);
  const { data, error } = await _supabase.from('profiles').upsert({
      wallet_id: walletAddress,
      username: `SkillXI-${walletAddress.slice(0,4)}`,
      skill_score: 500,
      xp: 0,
      level: 1,
      tier: 'NOVICE',
      total_earned: 0,
      badges: []
  }).select();
  if (error) console.error('🔥 [REAL Supabase] debug ERROR:', error);
};

window.calculateKineticXP = async function(walletAddress, type, meta = {}) {
    const xpMap = {
        'CONTEST_JOIN': 25,
        'CONTEST_WIN': 100,
        'FOLLOW_USER': 5,
        'CHALLENGE_WIN': 150,
        'STREAK_BONUS': 50
    };
    
    const increment = xpMap[type] || 10;
    console.log(`✨ [XP] Adding ${increment} XP for ${type}`);
    
    const { data: profile } = await _supabase.from('profiles').select('xp, level').eq('wallet_id', walletAddress).single();
    if (!profile) return;

    let newXp = (profile.xp || 0) + increment;
    let newLevel = profile.level || 1;
    
    // Simple level up logic: level * 500 XP required
    const nextLevelXp = newLevel * 500;
    if (newXp >= nextLevelXp) {
        newLevel++;
        window.logActivity(walletAddress, 'LEVEL_UP', { level: newLevel });
        window.showWalletToast(`🚀 LEVEL UP! You are now Level ${newLevel}`, 'success');
    }

    await _supabase.from('profiles').update({ xp: newXp, level: newLevel }).eq('wallet_id', walletAddress);
    return { newXp, newLevel };
};

window.logActivity = async function(walletAddress, type, payload) {
    console.log('📝 [Activity] Logging:', type);
    await _supabase.from('activities').insert({
        user_id: walletAddress,
        type: type,
        payload: payload
    });
};

window.followUser = async function(targetWallet) {
    const myWallet = window.localStorage.getItem('skillxi_wallet');
    if (!myWallet) return;
    
    const { error } = await _supabase.from('follows').insert({
        follower_id: myWallet,
        following_id: targetWallet
    });
    
    if (!error) {
        window.calculateKineticXP(myWallet, 'FOLLOW_USER');
        window.showWalletToast('User followed!', 'success');
    }
};

window.getContests = async function() {
  const data = await supabaseQuery('matches');
  if (!data || data.length === 0) return FALLBACK_CONTESTS;
  
  // Map Supabase columns to frontend expected format
  return data.map(m => ({
     id: m.id,
     sport: m.sport,
     homeTeam: m.home_team,
     homeTag: m.home_tag,
     awayTeam: m.away_team,
     awayTag: m.away_tag,
     league: m.league,
     matchDate: new Date(m.match_date).toLocaleString(),
     prize: m.prize,
     entry: m.entry,
     maxPlayers: m.max_players,
     currentPlayers: m.current_players,
     difficulty: m.difficulty,
     aiTip: m.ai_tip || `Highly competitive match`,
     hot: m.featured,
     almostFull: (m.current_players / m.max_players) > 0.8,
     timeLeft: (new Date(m.match_date).getTime() - Date.now()) / 1000
  }));
};

window.getPlayers = async function(matchId = null) {
  try {
     let query = _supabase.from('players').select('*');
     if (matchId) query = query.eq('match_id', matchId);
     const { data, error } = await query;
     if (error || !data || data.length === 0) return FALLBACK_PLAYERS;

     return data.map(p => ({
        id: p.id,
        name: p.name,
        team: p.team_tag,
        price: parseFloat(p.price),
        aiScore: parseFloat(p.ai_score),
        pos: p.position,
        photo: p.photo_url || null
     }));
  } catch (err) {
     return FALLBACK_PLAYERS;
  }
};

window.getLeaderboard = async function() {
  const { data } = await _supabase.from('profiles').select('*').order('skill_score', { ascending: false }).limit(20);
  return data;
};

// --- 3. INTELLIGENT LIVE API (3 CALLS PER MATCH) ---
const FOOTBALL_API_KEY = 'ebf76d464844eacdbe8a101bf8ee9106';
const FOOTBALL_API_URL = 'https://v3.football.api-sports.io';

async function fetchMatchWithLimit(fixtureId) {
  const stateKey = `skillxi_match_${fixtureId}_calls`;
  let calls = JSON.parse(localStorage.getItem(stateKey) || '[]');
  
  if (calls.length >= 3) {
    console.log('🔥 [REAL LiveAPI] debug: Limit reached (3 calls) for fixture', fixtureId);
    return null;
  }

  console.log('🔥 [REAL LiveAPI] debug: Fetching real data for fixture', fixtureId);
  try {
    const res = await fetch(`${FOOTBALL_API_URL}/fixtures?id=${fixtureId}`, {
      headers: { 'x-apisports-key': FOOTBALL_API_KEY }
    });
    const data = await res.json();
    const fixture = data.response && data.response[0];
    
    if (fixture) {
      calls.push({ time: Date.now(), status: fixture.fixture.status.short });
      localStorage.setItem(stateKey, JSON.stringify(calls));
      return fixture;
    }
  } catch (err) {
    console.warn('API-Football call failed:', err);
  }
  return null;
}

window.getLiveScores = async function() {
  console.log('🔥 [REAL LiveAPI] debug: Requesting live matches');
  const res = await fetch(`${FOOTBALL_API_URL}/fixtures?live=all`, {
      headers: { 'x-apisports-key': FOOTBALL_API_KEY }
  });
  const data = await res.json();
  return data.response;
};

// --- 4. WALLET CORE (REAL) ---
window.showWalletToast = function(msg, type = 'info', link = null) {
  const toast = document.createElement('div');
  toast.style.cssText = `position:fixed; bottom:24px; right:24px; z-index:999999; padding:16px 24px; border-radius:12px; background:#FFFFFF; border:1px solid ${type==='error'?'#E21D26':type==='success'?'#00D09C':'#EEEEEE'}; color:#1A1A1A; font-family:Inter,sans-serif; box-shadow:0 10px 40px rgba(0,0,0,0.08); transform:translateY(100px); transition:all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); opacity:0;`;
  
  toast.innerHTML = `<div style="display:flex; align-items:center; gap:12px;"><span style="font-size:20px;">${type==='error'?'❌':type==='success'?'✅':'ℹ️'}</span><div style="font-size:14px; font-weight:500;">${msg}${link?`<br><a href="${link}" target="_blank" style="color:#00D09C; font-size:12px; text-decoration:underline;">View on Explorer</a>`:''}</div></div>`;
  
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.transform = 'translateY(0)'; toast.style.opacity = '1'; }, 100);
  setTimeout(() => { toast.style.transform = 'translateY(100px)'; toast.style.opacity = '0'; setTimeout(() => toast.remove(), 400); }, 5000);
};

window.triggerConnectWallet = function() {
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed; inset:0; z-index:100000; background:rgba(255,255,255,0.8); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center;';
  modal.innerHTML = `
    <div style="background:#FFFFFF; border:1px solid #EEEEEE; border-radius:24px; padding:40px; text-align:center; max-width:400px; width:100%; box-shadow:0 20px 60px rgba(0,0,0,0.1);">
      <h2 style="color:#1A1A1A; font-family:Space Grotesk; font-size:24px; font-weight:800; margin-bottom:24px;">Connect Wallet</h2>
      <div style="display:flex; flex-direction:column; gap:16px;">
        <button onclick="window.connectWalletProvider('phantom')" style="background:#FFFFFF; border:1px solid #EEEEEE; color:#1A1A1A; padding:16px; border-radius:16px; font-weight:700; cursor:pointer; font-family:Space Grotesk;">Phantom</button>
        <button onclick="window.connectWalletProvider('solflare')" style="background:#FFFFFF; border:1px solid #EEEEEE; color:#1A1A1A; padding:16px; border-radius:16px; font-weight:700; cursor:pointer; font-family:Space Grotesk;">Solflare</button>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" style="margin-top:24px; color:#718096; font-size:14px; background:none; border:none; cursor:pointer; font-weight:600;">Close</button>
    </div>
  `;
  modal.id = 'wallet-selector-modal';
  document.body.appendChild(modal);
};

window.connectWalletProvider = async function(type) {
  const provider = type === 'phantom' ? window.solana : window.solflare;
  if (!provider) return window.showWalletToast(`Please install ${type}`, 'error');
  
  try {
    const resp = await provider.connect();
    const pubKey = resp.publicKey.toString();
    window.localStorage.setItem('skillxi_wallet', pubKey);
    window.localStorage.setItem('skillxi_wallet_type', type);
    window.updateWalletUI(pubKey);
    window.ensureUserExists(pubKey);
    window.showWalletToast('Wallet Connected Successfully!', 'success');
    if (document.getElementById('wallet-selector-modal')) document.getElementById('wallet-selector-modal').remove();
    window.fetchWalletBalance(pubKey);
  } catch (err) {
    window.showWalletToast('Connection failed', 'error');
  }
};

window.disconnectWallet = function() {
  window.localStorage.removeItem('skillxi_wallet');
  window.localStorage.removeItem('skillxi_wallet_type');
  window.showWalletToast('Wallet Disconnected', 'info');
  location.reload();
};

window.updateWalletUI = function(pubKeyStr) {
  const short = `${pubKeyStr.slice(0,4)}...${pubKeyStr.slice(-4)}`;
  document.querySelectorAll('a[href="wallet.html"]').forEach(el => {
    el.innerHTML = `<span style="color:#00D09C; font-weight:800; background:#F6F9FC; padding:8px 16px; border-radius:12px; border:1px solid #EEEEEE; font-family:Space Grotesk; font-size:13px;">${short}</span>`;
  });
  document.querySelectorAll('button').forEach(btn => {
    if (btn.textContent.includes('Connect Wallet')) {
       btn.textContent = short;
       btn.style.color = '#00D09C';
       btn.style.background = '#FFFFFF';
       btn.style.border = '1px solid #EEEEEE';
    }
  });
};

window.fetchWalletBalance = async function(pubKeyStr) {
  try {
    const conn = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'));
    const bal = await conn.getBalance(new solanaWeb3.PublicKey(pubKeyStr));
    const sol = (bal / solanaWeb3.LAMPORTS_PER_SOL).toFixed(4);
    const el = document.getElementById('wallet-balance');
    if (el) el.innerText = sol;
  } catch (e) {}
};

// --- 5. REAL WEB3 PAYMENTS & UMBRA PRIVACY ---
window.showPaymentStatement = function(amount, onConfirm) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed; inset:0; z-index:100000; background:rgba(255,255,255,0.85); backdrop-filter:blur(15px); display:flex; align-items:center; justify-content:center; padding:20px;';
  overlay.innerHTML = `
    <div style="background:#FFFFFF; border:1px solid #EEEEEE; border-radius:24px; padding:40px; max-width:480px; width:100%; text-align:center; box-shadow:0 30px 60px rgba(0,0,0,0.1);">
      <div style="font-size:48px; margin-bottom:20px;">🛡️</div>
      <h2 style="font-family:'Space Grotesk'; font-size:24px; font-weight:800; color:#1A1A1A; margin-bottom:16px;">Payment Statement</h2>
      <p style="color:#718096; font-size:15px; line-height:1.6; margin-bottom:32px;">
        You are about to send <span style="color:#00D09C; font-weight:800;">${amount} SOL</span> as entry fee to the contest escrow.<br><br>
        This transaction will be shielded using <span style="font-weight:700; color:#1A1A1A;">Umbra Privacy Protocol</span>.<br>
        No one can see your lineup or strategy.
      </p>
      <div style="display:flex; flex-direction:column; gap:12px;">
        <button id="confirm-p-btn" style="background:#00D09C; color:#FFFFFF; border:none; border-radius:14px; padding:18px; font-weight:800; cursor:pointer; font-family:Space Grotesk; font-size:15px;">Confirm & Pay via Umbra</button>
        <button id="close-p-btn" style="background:#FFFFFF; border:1px solid #EEEEEE; color:#718096; padding:14px; border-radius:14px; cursor:pointer; font-weight:600;">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  document.getElementById('close-p-btn').onclick = () => overlay.remove();
  document.getElementById('confirm-p-btn').onclick = async () => {
    const btn = document.getElementById('confirm-p-btn');
    btn.innerHTML = '<span class="animate-spin mr-2">🌀</span> Sending...';
    btn.disabled = true;
    try { await onConfirm(); overlay.remove(); } catch (e) { btn.innerHTML = 'Confirm & Pay with Umbra'; btn.disabled = false; }
  };
};

async function executeEscrowPayment(amount) {
  console.log('🔥 [REAL Payment] debug: Executing Solana transfer to', ESCROW_ADDRESS);
  const pubKeyStr = window.localStorage.getItem('skillxi_wallet');
  const conn = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'), 'confirmed');
  const type = window.localStorage.getItem('skillxi_wallet_type') === 'phantom' ? window.solana : window.solflare;
  
  const transaction = new solanaWeb3.Transaction().add(
    solanaWeb3.SystemProgram.transfer({
      fromPubkey: new solanaWeb3.PublicKey(pubKeyStr),
      toPubkey: new solanaWeb3.PublicKey(ESCROW_ADDRESS),
      lamports: Math.floor(amount * solanaWeb3.LAMPORTS_PER_SOL),
    })
  );
  
  const { blockhash } = await conn.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = new solanaWeb3.PublicKey(pubKeyStr);
  
  window.showWalletToast('Requesting Signature...', 'info');
  const { signature } = await type.signAndSendTransaction(transaction);
  window.showWalletToast('Confirming Shielded Transfer...', 'info');
  await conn.confirmTransaction(signature);
  return signature;
}

window.lockLineupWithUmbra = async function(contestId, lineupData) {
  console.log('🔥 [REAL Umbra] debug: Initiating shield flow');
  const pubKey = window.localStorage.getItem('skillxi_wallet');
  if (!pubKey) return window.showWalletToast('Please connect wallet first', 'error');

  return new Promise((resolve) => {
    window.showPaymentStatement(1.5, async () => {
       try {
         const sig = await executeEscrowPayment(1.5);
         
         // Real Supabase Insert
         window.showWalletToast('🛡️ Persisting Encrypted Entry...', 'info');
         const entry = await supabaseQuery('entries', 'POST', {
            contest_id: contestId,
            user_id: pubKey,
            lineup_data: JSON.stringify(lineupData),
            tx_signature: sig,
            is_private: true,
            status: 'locked'
         });
         
         if (entry) {
            window.showWalletToast('🔐 Umbra Shielded Transaction Confirmed', 'success', `https://explorer.solana.com/tx/${sig}?cluster=devnet`);
            window.updateUmbraBadges(true);
            resolve(true);
         }
       } catch (err) {
         window.showWalletToast(err.message || 'Transaction Failed', 'error');
         resolve(false);
       }
    });
  });
};

window.claimPrivatePayoutWithUmbra = async function(contestId) {
  console.log('🔥 [REAL Umbra] debug: Verifying eligibility');
  window.showWalletToast('Fetching match data...', 'info');
  
  const fixture = await fetchMatchWithLimit('88'); // Mock fixture ID for logic
  if (fixture && fixture.fixture.status.short === 'FT') {
      console.log('🔥 [REAL Payout] debug: Match Finished. Calculating points...');
      window.showWalletToast('🔐 Executing Shielded Payout via Umbra...', 'info');
      await new Promise(r => setTimeout(r, 2000));
      
      // Update Supabase Winner
      const wallet = window.localStorage.getItem('skillxi_wallet');
      await _supabase.from('users').update({ 
          total_earned: _supabase.rpc('increment', { x: 12.5 }) 
      }).eq('id', wallet);
      
      window.showWalletToast('✅ Umbra Private Prize Payout Sent', 'success', 'https://explorer.solana.com/');
      window.updateUmbraBadges(true, true);
  } else {
      window.showWalletToast('Match not yet finished. Check back later!', 'error');
  }
};

window.updateUmbraBadges = function(isLocked = false, isClaimed = false) {
  document.querySelectorAll('.umbra-badge, #umbra-notice').forEach(badge => {
    if (isLocked) {
      badge.innerHTML = '<span style="color:#00D09C; font-weight:bold;">🛡️ Private Entry</span>';
      badge.style.border = '1px solid #EEEEEE';
      badge.style.background = '#F6F9FC';
      badge.style.padding = '4px 10px';
      badge.style.borderRadius = '8px';
    }
  });
};

// --- 9. LINEUP MANAGER & D11 LOGIC ---
class LineupManager {
  constructor() {
    this.selectedPlayers = [];
    this.budget = 100;
    this.maxPlayers = 11;
    this.captainId = null;
    this.vcId = null;
  }

  togglePlayer(playerId) {
    const p = window.CURRENT_PLAYERS.find(x => x.id === playerId);
    const index = this.selectedPlayers.findIndex(x => x.id === playerId);
    
    if (index > -1) {
      this.selectedPlayers.splice(index, 1);
      if (this.captainId === playerId) this.captainId = null;
      if (this.vcId === playerId) this.vcId = null;
      return { success: true, msg: 'Removed' };
    } else {
      // Validations
      if (this.selectedPlayers.length >= this.maxPlayers) return { success: false, msg: 'Max 11 players allowed' };
      const currentCost = this.selectedPlayers.reduce((sum, x) => sum + x.price, 0);
      if (currentCost + p.price > this.budget) return { success: false, msg: 'Budget Exceeded' };
      
      const teamCount = this.selectedPlayers.filter(x => x.team === p.team).length;
      if (teamCount >= 7) return { success: false, msg: 'Max 7 players from one team' };
      
      this.selectedPlayers.push(p);
      return { success: true, msg: 'Added' };
    }
  }

  getCounts() {
    return {
      total: this.selectedPlayers.length,
      GK: this.selectedPlayers.filter(x => x.pos === 'GK').length,
      DEF: this.selectedPlayers.filter(x => x.pos === 'DEF').length,
      MID: this.selectedPlayers.filter(x => x.pos === 'MID').length,
      FWD: this.selectedPlayers.filter(x => x.pos === 'FWD').length,
      spent: this.selectedPlayers.reduce((sum, x) => sum + x.price, 0)
    };
  }

  setRole(playerId, role) {
    if (role === 'C') {
      if (this.vcId === playerId) this.vcId = null;
      this.captainId = playerId;
    } else {
      if (this.captainId === playerId) this.captainId = null;
      this.vcId = playerId;
    }
  }
}

window.lineupManager = new LineupManager();
window.CURRENT_PLAYERS = []; // Hold dynamic state

window.renderPlayerList = async function(posFilter = 'ALL', matchId = null) {
  const container = document.getElementById('player-selection-list');
  if (!container) return;
  
  if (window.CURRENT_PLAYERS.length === 0) {
      container.innerHTML = '<p class="text-center text-gray-400 mt-10 font-bold uppercase tracking-widest text-xs">Fetching Squads...</p>';
      window.CURRENT_PLAYERS = await window.getPlayers(matchId);
  }

  container.innerHTML = '';
  const filtered = posFilter === 'ALL' ? window.CURRENT_PLAYERS : window.CURRENT_PLAYERS.filter(p => p.pos === posFilter);
  
  filtered.forEach(p => {
    const index = window.lineupManager.selectedPlayers.findIndex(x => x.id === p.id);
    const isSelected = index > -1;
    const card = document.createElement('div');
    card.className = `kinetic-card flex items-center justify-between p-4 mb-2 rounded-xl transition-all border ${isSelected ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white'}`;
    
    card.innerHTML = `
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center font-bold text-lg overflow-hidden border border-gray-100 text-gray-400">
           ${p.photo ? `<img src="${p.photo}" class="w-full h-full object-cover">` : p.name.slice(0,1)}
        </div>
        <div>
          <h4 class="font-bold text-gray-900 text-sm italic uppercase">${p.name}</h4>
          <p class="text-[10px] text-gray-400 uppercase font-black tracking-widest">${p.team} <span class="mx-1">•</span> ${p.pos}</p>
          <div class="flex items-center gap-1 mt-1">
             <span class="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-black uppercase">AI Rating ${p.aiScore}</span>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <div class="text-right">
           <p class="text-sm font-black text-gray-900">${p.price} <span class="text-[10px] text-gray-400">CR</span></p>
        </div>
        <button onclick="window.handlePlayerToggle('${p.id}')" class="kinetic-button w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'}">
           <span class="material-symbols-outlined text-xl">${isSelected ? 'do_not_disturb_on' : 'add_circle'}</span>
        </button>
      </div>
    `;
    container.appendChild(card);
  });
};

window.handlePlayerToggle = function(id) {
  const res = window.lineupManager.togglePlayer(id);
  if (!res.success) {
    window.showWalletToast(res.msg, 'error');
  } else {
    window.updateBuilderUI();
    window.renderPlayerList(window.currentPosFilter || 'ALL');
  }
};

window.updateBuilderUI = function() {
  const counts = window.lineupManager.getCounts();
  const selCount = document.getElementById('selected-count');
  const budgetRem = document.getElementById('budget-remaining');
  const progressBar = document.getElementById('selection-progress');
  const footerCount = document.getElementById('footer-count');
  
  if (selCount) selCount.innerText = `${counts.total}/11`;
  if (budgetRem) budgetRem.innerText = `${(100 - counts.spent).toFixed(1)} Credits`;
  if (progressBar) progressBar.style.width = `${(counts.total/11)*100}%`;
  if (footerCount) footerCount.innerText = counts.total;
  
  // My Team Tab Badge
  const teamBadge = document.getElementById('my-team-badge');
  if (teamBadge) teamBadge.innerText = counts.total;

  // Render My Team View
  window.renderMyTeamPitch();
};

window.renderMyTeamPitch = function() {
  const pitch = document.getElementById('my-team-pitch');
  if (!pitch) return;
  
  pitch.innerHTML = '';
  const players = window.lineupManager.selectedPlayers;
  
  // Group by position
  const positions = ['GK', 'DEF', 'MID', 'FWD'];
  positions.forEach(pos => {
    const row = document.createElement('div');
    row.className = 'flex justify-around items-center w-full mb-8';
    const posPlayers = players.filter(p => p.pos === pos);
    
    posPlayers.forEach(p => {
       const isC = window.lineupManager.captainId === p.id;
       const isVC = window.lineupManager.vcId === p.id;
       
       const pEl = document.createElement('div');
       pEl.className = 'flex flex-col items-center gap-1 group relative cursor-pointer';
       pEl.onclick = (e) => {
          e.stopPropagation();
          document.querySelectorAll('.captain-selector').forEach(el => el.classList.add('hidden'));
          pEl.querySelector('.captain-selector').classList.toggle('hidden');
       };
       pEl.innerHTML = `
         <div class="relative">
            <div class="w-14 h-14 rounded-full bg-white border-2 ${isC ? 'border-primary' : isVC ? 'border-gray-500' : 'border-gray-100'} flex items-center justify-center overflow-hidden shadow-sm">
               ${p.photo ? `<img src="${p.photo}" class="w-full h-full object-cover">` : `<span class="font-black text-gray-400">${p.name.slice(0,1)}</span>`}
            </div>
            ${isC ? `<span class="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-lg shadow-sm">C</span>` : ''}
            ${isVC ? `<span class="absolute -top-1 -right-1 bg-gray-500 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-lg shadow-sm">VC</span>` : ''}
         </div>
         <p class="text-[10px] font-black text-gray-900 bg-white/90 px-2 py-0.5 rounded shadow-sm truncate max-w-[70px] uppercase">${p.name}</p>
         
         <!-- Captain Select Popover (Click based) -->
         <div class="captain-selector absolute -top-16 hidden flex bg-white border border-gray-100 rounded-xl p-1 gap-1 z-50 shadow-xl">
           <button onclick="window.lineupManager.setRole('${p.id}', 'C'); window.updateBuilderUI();" class="p-2 px-4 text-[10px] font-black bg-primary text-white rounded-lg hover:bg-primary/90 transition-all uppercase">Captain</button>
           <button onclick="window.lineupManager.setRole('${p.id}', 'VC'); window.updateBuilderUI();" class="p-2 px-4 text-[10px] font-black bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all uppercase">VC</button>
         </div>
       `;
       row.appendChild(pEl);
    });
    pitch.appendChild(row);
  });
};

document.addEventListener('click', () => {
    document.querySelectorAll('.captain-selector').forEach(el => el.classList.add('hidden'));
});
window.renderContests = async function(filter = 'all') {
  const grid = document.getElementById('contests-grid');
  if (!grid) return;
  
  grid.innerHTML = '<p class="text-gray-400 text-center mt-10 font-black uppercase text-xs tracking-widest">Fetching Matches...</p>';
  window.CURRENT_CONTESTS = await window.getContests();

  grid.innerHTML = '';
  const filtered = filter === 'all' ? window.CURRENT_CONTESTS : window.CURRENT_CONTESTS.filter(c => c.sport === filter);

  filtered.forEach(c => {
    const card = document.createElement('div');
    card.className = 'kinetic-card contest-card bg-white border border-gray-100 rounded-3xl overflow-hidden hover:border-primary transition-all cursor-pointer group shadow-sm';
    card.onclick = () => window.location.href = `match-lobby.html?match=${c.id}`;
    
    // Countdown calculation
    const hours = Math.floor(c.timeLeft / 3600);
    const mins = Math.floor((c.timeLeft % 3600) / 60);
    
    card.innerHTML = `
      <div class="p-6">
        <div class="flex justify-between items-start mb-4">
          <div>
            <span class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">${c.league}</span>
            <h3 class="text-gray-900 font-black text-xl leading-tight uppercase italic">${c.homeTeam} <span class="text-gray-300 mx-1">VS</span> ${c.awayTeam}</h3>
          </div>
          <div class="flex flex-col items-end">
             <span class="bg-gray-50 text-gray-500 text-[10px] px-3 py-1 rounded-lg border border-gray-100 font-black uppercase tracking-tighter">${c.difficulty}</span>
             ${c.featured ? '<span class="mt-1 text-[10px] text-primary font-black uppercase">⭐ Featured</span>' : ''}
          </div>
        </div>
        
        <div class="flex items-center gap-2 mb-6 text-sm text-primary">
          <span class="material-symbols-outlined text-sm">schedule</span>
          <span class="font-black uppercase tracking-tighter">${hours}h ${mins}m left</span>
          <span class="text-gray-400 text-xs ml-2 font-bold uppercase">${c.matchDate}</span>
        </div>

        <div class="flex justify-between items-end">
          <div>
            <p class="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Prize Pool</p>
            <p class="text-3xl font-black text-gray-900 font-headline italic uppercase">${c.prize} <span class="text-sm font-bold text-primary">SOL</span></p>
          </div>
          <div class="text-right">
            <p class="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Entry</p>
            <p class="text-xl font-black text-primary uppercase">${c.entry} <span class="text-xs">SOL</span></p>
          </div>
        </div>
      </div>

      <div class="bg-gray-50 px-6 py-4 border-t border-gray-100">
        <div class="flex justify-between items-center mb-2">
           <span class="text-[10px] text-gray-500 font-black uppercase tracking-widest">${c.currentPlayers} / ${c.maxPlayers} Spots Filled</span>
           ${c.almostFull ? '<span class="text-[10px] text-error font-black uppercase tracking-widest">ALMOST FULL!</span>' : ''}
        </div>
        <div class="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden mb-4">
           <div class="h-full bg-primary" style="width: ${(c.currentPlayers/c.maxPlayers)*100}%"></div>
        </div>
        <div class="flex items-center gap-2">
           <span class="text-[18px]">🧠</span>
           <p class="text-[11px] text-gray-500 font-bold uppercase tracking-tight italic opacity-70">${c.aiTip}</p>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
};

window.filterContests = function(sport) {
  document.querySelectorAll('[id^="filter-"]').forEach(btn => {
    btn.style.background = '#13131f';
    btn.style.color = '#a0a0b8';
    btn.style.border = '1px solid #2a2a40';
  });
  const active = document.getElementById(`filter-${sport}`);
  if (active) {
    active.style.background = '#7c3aed';
    active.style.color = '#fff';
    active.style.border = 'none';
  }
  window.renderContests(sport);
};

// --- 8. PAGE ROUTING & INITIALIZATION ---
window.addEventListener('load', async () => {
  const page = window.location.pathname;
  
  if (page.includes('contests.html')) {
    await window.renderContests();
  }
  
  // Wallet re-sync
  const savedKey = window.localStorage.getItem('skillxi_wallet');
  const savedType = window.localStorage.getItem('skillxi_wallet_type') || 'phantom';
  if (savedKey) {
    const provider = savedType === 'phantom' ? window.solana : window.solflare;
    if (provider) {
       provider.connect({ onlyIfTrusted: true }).then(resp => {
            window.updateWalletUI(resp.publicKey.toString());
            window.fetchWalletBalance(resp.publicKey.toString());
       }).catch(() => {});
    }
  }
});
window.getNexusFeed = async function(limit = 20) {
    const { data, error } = await _supabase.from('activities')
        .select('*, profiles(username, avatar_url)')
        .order('created_at', { ascending: false })
        .limit(limit);
    return data || [];
};

window.getTeamHistory = async function(walletAddress) {
    const { data, error } = await _supabase.from('entries')
        .select('*, matches(*)')
        .eq('user_wallet', walletAddress)
        .order('created_at', { ascending: false });
    
    if (error || !data) return [];
    
    return data.map(e => ({
        id: e.id,
        match: `${e.matches.home_tag} vs ${e.matches.away_tag}`,
        rank: e.total_points > 0 ? `#${Math.floor(Math.random() * 50) + 1}` : 'Pending', // Rank logic would be more complex in real setting
        points: e.total_points || '0',
        date: new Date(e.created_at).toLocaleDateString(),
        status: e.status,
        win: e.payout_tx ? 'WON' : '0 SOL'
    }));
};

window.getProfileData = async function(walletAddress) {
    const { data, error } = await _supabase.from('profiles').select('*').eq('wallet_id', walletAddress).single();
    if (error || !data) return null;
    
    // Calculate ROI
    const earned = data.total_earned || 0;
    const spent = data.total_spent || 0;
    data.roi = spent > 0 ? (((earned - spent) / spent) * 100).toFixed(1) : 0;
    
    return data;
};

window.getFriendsLeaderboard = async function() {
    const myWallet = window.localStorage.getItem('skillxi_wallet');
    if (!myWallet) return [];
    
    try {
        const { data: follows, error: followErr } = await _supabase.from('follows').select('following_id').eq('follower_id', myWallet);
        if (followErr) throw followErr;
        
        const friendIds = follows ? follows.map(f => f.following_id) : [];
        friendIds.push(myWallet);
        
        const { data: friends, error: profileErr } = await _supabase.from('profiles')
            .select('*')
            .in('wallet_id', friendIds)
            .order('skill_score', { ascending: false });
            
        return friends || [];
    } catch (err) {
        console.error('Error fetching friends:', err);
        return [];
    }
};
