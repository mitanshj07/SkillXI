const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

// Init Supabase with Admin rights for backend insertion
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://vtvrvlcholgloujqcxd.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Must be set in Vercel
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const FOOTBALL_API_KEY = process.env.FOOTBALL_API_KEY || 'ebf76d464844eacdbe8a101bf8ee9106';
const FOOTBALL_API_URL = 'https://v3.football.api-sports.io';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  // Security lock for cron job running it
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized Backend Caller' });
  }

  console.log('🔄 Starting Fixture Sync from API-Football...');

  try {
    // 1. Fetch upcoming matches for English Premier League (League 39) for next 3 days
    const today = new Date().toISOString().split('T')[0];
    const { data: fixData } = await axios.get(`${FOOTBALL_API_URL}/fixtures?league=39&season=2023&from=${today}&to=${today}`, {
      headers: { 'x-apisports-key': FOOTBALL_API_KEY }
    });

    const matches = fixData.response || [];
    console.log(`Found ${matches.length} upcoming matches.`);

    // 2. Iterate and format for Supabase
    for (const match of matches.slice(0, 3)) { // Limit to 3 to save quota on dev
      const mId = `m_${match.fixture.id}`;
      const homeInfo = match.teams.home;
      const awayInfo = match.teams.away;

      // Upsert Match
      await supabase.from('matches').upsert({
         id: mId,
         sport: 'football',
         home_team: homeInfo.name,
         home_tag: homeInfo.name.substring(0, 3).toUpperCase(),
         away_team: awayInfo.name,
         away_tag: awayInfo.name.substring(0, 3).toUpperCase(),
         league: match.league.name,
         match_date: match.fixture.date,
         prize: 10.0, // Default real pool value
         entry: 0.1,  // 0.1 SOL entry
         max_players: 100,
         difficulty: 'PRO',
         status: match.fixture.status.short, // 'NS', '1H', 'FT'
      });

      console.log(`✅ Upserted Match: ${homeInfo.name} vs ${awayInfo.name}`);

      // 3. Fetch Real Squads to Generate Draftable Players
      // Fetch Home Squad
      const { data: homeSquadData } = await axios.get(`${FOOTBALL_API_URL}/players/squads?team=${homeInfo.id}`, {
          headers: { 'x-apisports-key': FOOTBALL_API_KEY }
      });
      // Fetch Away Squad
      const { data: awaySquadData } = await axios.get(`${FOOTBALL_API_URL}/players/squads?team=${awayInfo.id}`, {
          headers: { 'x-apisports-key': FOOTBALL_API_KEY }
      });

      const homePlayers = homeSquadData.response[0]?.players || [];
      const awayPlayers = awaySquadData.response[0]?.players || [];

      // Consolidate & Upsert Players
      const processPlayer = async (p, teamObj) => {
         const posMap = { 'Goalkeeper': 'GK', 'Defender': 'DEF', 'Midfielder': 'MID', 'Attacker': 'FWD'};
         const pos = posMap[p.position] || 'MID';
         const price = pos === 'FWD' ? 10.5 : pos === 'MID' ? 8.5 : pos === 'DEF' ? 7.5 : 6.0;

         await supabase.from('players').upsert({
            id: `p_${p.id}_${mId}`,
            match_id: mId,
            name: p.name,
            team_tag: teamObj.name.substring(0, 3).toUpperCase(),
            price: price,
            ai_score: parseFloat((Math.random() * 4 + 6).toFixed(1)), // 6.0 to 10.0 AI estimate
            position: pos,
            photo_url: p.photo
         });
      };

      // Only insert first 11 from each side to save DB rows on free tier
      for (const p of homePlayers.slice(0,11)) await processPlayer(p, homeInfo);
      for (const p of awayPlayers.slice(0,11)) await processPlayer(p, awayInfo);
      console.log(`✅ Synced 22 Players for Match ${mId}`);
    }

    return res.status(200).json({ success: true, message: 'Sync Complete' });

  } catch (err) {
    console.error('Error during sync:', err.message);
    return res.status(500).json({ error: 'Sync failed', details: err.message });
  }
}
