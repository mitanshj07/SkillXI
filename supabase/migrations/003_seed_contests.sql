-- ==============================================================================
-- Migration 003: SEED DATA — Contest & Match Fixtures
-- Safe to re-run (uses ON CONFLICT DO NOTHING)
-- ==============================================================================

-- FOOTBALL MATCHES
INSERT INTO public.matches (id, sport, home_team, away_team, home_tag, away_tag, match_time, prize_pool, entry_fee, max_players, current_players, ai_tip)
VALUES
  ('c001', 'football', 'Manchester City', 'Arsenal', 'MCI', 'ARS', NOW() + INTERVAL '2 hours', 8.5, 0.1, 200, 142,
   'Haaland has scored in 7 of his last 8 home games. Strong pick as Captain.'),
  ('c002', 'football', 'Real Madrid', 'Barcelona', 'RMA', 'BAR', NOW() + INTERVAL '4 hours', 12.0, 0.15, 300, 89,
   'El Clásico differentials: Gavi and Bellingham are high-upside mid picks at low ownership.'),
  ('c003', 'football', 'Liverpool', 'Chelsea', 'LIV', 'CHE', NOW() + INTERVAL '6 hours', 6.5, 0.1, 150, 64,
   'Salah vs Reece James — premium matchup. Salah favoured on expected assists too.')
ON CONFLICT (id) DO NOTHING;

-- CRICKET MATCHES
INSERT INTO public.matches (id, sport, home_team, away_team, home_tag, away_tag, match_time, prize_pool, entry_fee, max_players, current_players, ai_tip)
VALUES
  ('c004', 'cricket', 'India', 'Australia', 'IND', 'AUS', NOW() + INTERVAL '8 hours', 15.0, 0.2, 500, 312,
   'Pitch report favours spinners. Ashwin and Jadeja are must-have picks.'),
  ('c005', 'cricket', 'England', 'Pakistan', 'ENG', 'PAK', NOW() + INTERVAL '10 hours', 9.0, 0.1, 250, 178,
   'Babar Azam in form — 3 consecutive 70+ scores. Top pick at 9.5 Cr.')
ON CONFLICT (id) DO NOTHING;

-- BASKETBALL MATCHES
INSERT INTO public.matches (id, sport, home_team, away_team, home_tag, away_tag, match_time, prize_pool, entry_fee, max_players, current_players, ai_tip)
VALUES
  ('c006', 'basketball', 'Los Angeles Lakers', 'Golden State Warriors', 'LAL', 'GSW', NOW() + INTERVAL '12 hours', 10.0, 0.1, 200, 97,
   'LeBron averaging 28.4 pts in last 5 games. Steph under-owned this week.'),
  ('c007', 'basketball', 'Boston Celtics', 'Miami Heat', 'BOS', 'MIA', NOW() + INTERVAL '14 hours', 7.5, 0.1, 150, 43,
   'Jayson Tatum 40+ pts ceiling this week. Pair with Butler for Heat exposure.')
ON CONFLICT (id) DO NOTHING;
