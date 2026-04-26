-- ==============================================================================
-- SKILLXI VERSION 2: SEED DATA
-- Run this in your Supabase SQL Editor to populate your database with 
-- real-world simulated match data, players, and social activity.
-- ==============================================================================

-- 1. Insert Matches
INSERT INTO public.matches (id, sport, home_team, home_tag, away_team, away_tag, league, match_date, prize, entry, max_players, current_players, featured, status)
VALUES 
('m1', 'football', 'Manchester City', 'MCI', 'Arsenal', 'ARS', 'Premier League', NOW() + INTERVAL '48 hours', 10.5, 0.25, 500, 142, true, 'NS'),
('m2', 'football', 'Liverpool', 'LIV', 'Chelsea', 'CHE', 'Premier League', NOW() + INTERVAL '24 hours', 5.0, 0.1, 200, 89, false, 'NS'),
('m3', 'football', 'Real Madrid', 'RMA', 'Barcelona', 'BAR', 'La Liga', NOW() + INTERVAL '72 hours', 25.0, 0.5, 1000, 412, true, 'NS')
ON CONFLICT (id) DO UPDATE SET 
    match_date = EXCLUDED.match_date,
    prize = EXCLUDED.prize,
    current_players = EXCLUDED.current_players;

-- 2. Insert Players
INSERT INTO public.players (id, match_id, name, team_tag, price, ai_score, position)
VALUES 
-- Man City vs Arsenal (m1)
('p1', 'm1', 'E. Haaland', 'MCI', 12.0, 9.8, 'FWD'),
('p2', 'm1', 'K. De Bruyne', 'MCI', 10.5, 8.9, 'MID'),
('p3', 'm1', 'Phil Foden', 'MCI', 9.5, 8.5, 'MID'),
('p4', 'm1', 'B. Saka', 'ARS', 10.5, 9.2, 'MID'),
('p5', 'm1', 'M. Odegaard', 'ARS', 9.0, 8.1, 'MID'),
('p6', 'm1', 'Kai Havertz', 'ARS', 8.5, 7.8, 'FWD'),
-- Liverpool vs Chelsea (m2)
('p7', 'm2', 'Mo Salah', 'LIV', 12.5, 9.5, 'FWD'),
('p8', 'm2', 'L. Diaz', 'LIV', 9.0, 7.9, 'MID'),
('p9', 'm2', 'Cole Palmer', 'CHE', 10.0, 9.0, 'MID'),
('p10', 'm2', 'N. Jackson', 'CHE', 8.0, 7.2, 'FWD')
ON CONFLICT (id) DO UPDATE SET 
    price = EXCLUDED.price,
    ai_score = EXCLUDED.ai_score;

-- 3. Insert Mock Profiles (Community Leaders)
INSERT INTO public.profiles (wallet_id, username, skill_score, total_earned)
VALUES 
('0xScoutMaster', 'ScoutMaster_AI', 850, 42.5),
('0xTacticalGenius', 'Tactician_XI', 790, 28.1),
('0xWhaleAnalyst', 'SolWhale_Pro', 720, 15.4),
('0xDataDiver', 'DataDiver', 680, 5.2)
ON CONFLICT (wallet_id) DO UPDATE SET 
    skill_score = EXCLUDED.skill_score,
    total_earned = EXCLUDED.total_earned;

-- 4. Insert Social Activities (Nexus Feed)
INSERT INTO public.activities (user_id, type, payload)
VALUES 
('0xScoutMaster', 'DEPLOYMENT', '{"match": "MCI vs ARS", "prize": "10.5 SOL"}'),
('0xTacticalGenius', 'VICTORY', '{"match": "LIV vs CHE", "win": "4.2 SOL"}'),
('0xWhaleAnalyst', 'AI_CHAT', '{"topic": "Differential Captains"}'),
('0xDataDiver', 'FOLLOW', '{"target": "ScoutMaster_AI"}');

-- 5. Mark as seeded in system
-- This is a placeholder; usually handled by app logic
-- But we can add a log or metadata if needed.

COMMIT;
