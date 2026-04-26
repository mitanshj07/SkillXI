const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
    console.log('🚀 Starting SkillXI Database Seed...');

    // 1. Seed Matches
    const matches = [
        {
            id: 'm1',
            sport: 'football',
            home_team: 'Manchester City',
            home_tag: 'MCI',
            away_team: 'Arsenal',
            away_tag: 'ARS',
            league: 'Premier League',
            match_date: new Date(Date.now() + 3600000 * 48).toISOString(), // 48 hours from now
            prize: 10.5,
            entry_fee: 0.25,
            max_players: 500,
            current_players: 142,
            featured: true,
            status: 'NS'
        },
        {
            id: 'm2',
            sport: 'football',
            home_team: 'Liverpool',
            home_tag: 'LIV',
            away_team: 'Chelsea',
            away_tag: 'CHE',
            league: 'Premier League',
            match_date: new Date(Date.now() + 3600000 * 24).toISOString(), // 24 hours from now
            prize: 5.0,
            entry_fee: 0.1,
            max_players: 200,
            current_players: 89,
            featured: false,
            status: 'NS'
        },
        {
            id: 'm3',
            sport: 'football',
            home_team: 'Real Madrid',
            home_tag: 'RMA',
            away_team: 'Barcelona',
            away_tag: 'BAR',
            league: 'La Liga',
            match_date: new Date(Date.now() + 3600000 * 72).toISOString(),
            prize: 25.0,
            entry_fee: 0.5,
            max_players: 1000,
            current_players: 412,
            featured: true,
            status: 'NS'
        }
    ];

    console.log('Inserting matches...');
    const { error: mError } = await supabase.from('matches').upsert(matches);
    if (mError) console.error('Matches Error:', mError);

    // 2. Seed Players
    const players = [
        // Man City
        { id: 'p1', name: 'E. Haaland', team: 'Manchester City', team_tag: 'MCI', price: 12.0, position: 'FWD', ai_score: 9.8, match_id: 'm1' },
        { id: 'p2', name: 'K. De Bruyne', team: 'Manchester City', team_tag: 'MCI', price: 10.5, position: 'MID', ai_score: 8.9, match_id: 'm1' },
        { id: 'p3', name: 'Phil Foden', team: 'Manchester City', team_tag: 'MCI', price: 9.5, position: 'MID', ai_score: 8.5, match_id: 'm1' },
        // Arsenal
        { id: 'p4', name: 'B. Saka', team: 'Arsenal', team_tag: 'ARS', price: 10.5, position: 'MID', ai_score: 9.2, match_id: 'm1' },
        { id: 'p5', name: 'M. Odegaard', team: 'Arsenal', team_tag: 'ARS', price: 9.0, position: 'MID', ai_score: 8.1, match_id: 'm1' },
        { id: 'p6', name: 'Kai Havertz', team: 'Arsenal', team_tag: 'ARS', price: 8.5, position: 'FWD', ai_score: 7.8, match_id: 'm1' },
        // Liverpool
        { id: 'p7', name: 'Mo Salah', team: 'Liverpool', team_tag: 'LIV', price: 12.5, position: 'FWD', ai_score: 9.5, match_id: 'm2' },
        { id: 'p8', name: 'L. Diaz', team: 'Liverpool', team_tag: 'LIV', price: 9.0, position: 'MID', ai_score: 7.9, match_id: 'm2' },
        // Chelsea
        { id: 'p9', name: 'Cole Palmer', team: 'Chelsea', team_tag: 'CHE', price: 10.0, position: 'MID', ai_score: 9.0, match_id: 'm2' },
        { id: 'p10', name: 'N. Jackson', team: 'Chelsea', team_tag: 'CHE', price: 8.0, position: 'FWD', ai_score: 7.2, match_id: 'm2' }
    ];

    console.log('Inserting players...');
    const { error: pError } = await supabase.from('players').upsert(players);
    if (pError) console.error('Players Error:', pError);

    // 3. Seed Profiles (Mock Analysts)
    const mockProfiles = [
        { wallet_id: '0xScoutMaster', username: 'ScoutMaster_AI', skill_score: 850, xp: 4500, level: 12, tier: 'ELITE', reputation: 98 },
        { wallet_id: '0xTacticalGenius', username: 'Tactician_XI', skill_score: 790, xp: 3800, level: 9, tier: 'EXPERT', reputation: 95 },
        { wallet_id: '0xWhaleAnalyst', username: 'SolWhale_Pro', skill_score: 720, xp: 2100, level: 5, tier: 'PRO', reputation: 92 },
        { wallet_id: '0xDataDiver', username: 'DataDiver', skill_score: 680, xp: 1200, level: 3, tier: 'NOVICE', reputation: 88 }
    ];

    console.log('Inserting mock profiles...');
    const { error: prError } = await supabase.from('profiles').upsert(mockProfiles);
    if (prError) console.error('Profiles Error:', prError);

    // 4. Seed Activities (Nexus Feed)
    const activities = [
        { user_id: '0xScoutMaster', type: 'DEPLOYMENT', payload: { match: 'MCI vs ARS', prize: '10.5 SOL' } },
        { user_id: '0xTacticalGenius', type: 'VICTORY', payload: { match: 'LIV vs CHE', win: '4.2 SOL' } },
        { user_id: '0xWhaleAnalyst', type: 'AI_CHAT', payload: { topic: 'Differential Captains' } },
        { user_id: '0xDataDiver', type: 'FOLLOW', payload: { target: 'ScoutMaster_AI' } }
    ];

    console.log('Inserting activities...');
    const { error: aError } = await supabase.from('activities').insert(activities);
    if (aError) console.error('Activities Error:', aError);

    console.log('✅ Seed Complete! SkillXI is now populated with live-simulated data.');
}

seed();
