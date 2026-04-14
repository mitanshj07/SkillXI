const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

// Init Supabase with Admin rights
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const FOOTBALL_API_KEY = process.env.FOOTBALL_API_KEY;
const FOOTBALL_API_URL = 'https://v3.football.api-sports.io';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  console.log('⚡ Starting Live Scoring Update...');

  try {
    // 1. Get matches currently marked as LIVE ('1H', '2H', 'HT', 'PEN')
    const { data: liveMatches } = await supabase.from('matches')
        .select('*').in('status', ['1H', '2H', 'HT', 'PEN']);
    
    if (!liveMatches || liveMatches.length === 0) {
        return res.status(200).json({ success: true, message: 'No live matches' });
    }

    for (const match of liveMatches) {
       const apiFixtureId = match.id.replace('m_', ''); // We prefixed IDs with 'm_'

       // 2. Fetch live events for the fixture from API-Football
       const { data: eventData } = await axios.get(`${FOOTBALL_API_URL}/fixtures/events?fixture=${apiFixtureId}`, {
          headers: { 'x-apisports-key': FOOTBALL_API_KEY }
       });

       const events = eventData.response || [];
       const pointsMap = {}; // { 'p_playerId_m_matchId': 15.0 }

       // SkillXI Points Formula
       // Goal: +10, Assist: +5, Yellow: -2, Red: -5
       for (const ev of events) {
          const pId = `p_${ev.player.id}_${match.id}`;
          if (!pointsMap[pId]) pointsMap[pId] = 0;

          if (ev.type === 'Goal') pointsMap[pId] += 10;
          if (ev.type === 'Card' && ev.detail === 'Yellow Card') pointsMap[pId] -= 2;
          if (ev.type === 'Card' && ev.detail === 'Red Card') pointsMap[pId] -= 5;
       }

       // 3. Update Players Table in DB
       for (const [pId, pts] of Object.entries(pointsMap)) {
          await supabase.from('players').update({ live_fantasy_points: pts }).eq('id', pId);
       }
       console.log(`✅ Updated ${Object.keys(pointsMap).length} players for match ${match.id}`);

       // 4. Update Users' Lineup Scores
       // We must fetch all entries for this match
       const { data: entries } = await supabase.from('entries').select('*').eq('match_id', match.id);
       for (const ent of entries) {
           let total = 0;
           const squad = ent.lineup_data; // [{id: 'p_1_m_2', role: 'C'}]
           for (const squadP of squad) {
              const basePts = pointsMap[squadP.id] || 0;
              const multiplier = squadP.role === 'C' ? 2 : squadP.role === 'VC' ? 1.5 : 1;
              total += (basePts * multiplier);
           }
           // Update Total Team Points
           await supabase.from('entries').update({ total_points: total }).eq('id', ent.id);
       }
       console.log(`✅ Updated ${entries.length} entries for match ${match.id}`);
    }

    return res.status(200).json({ success: true, message: 'Scoring complete' });
  } catch (err) {
    console.error('Error during live scoring:', err.message);
    return res.status(500).json({ error: 'Scoring failed', details: err.message });
  }
}
