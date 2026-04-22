-- ==============================================================================
-- Migration 001: SKILLXI CORE TABLES
-- Includes: matches, contests, entries, and contest seed data
-- ==============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. MATCHES TABLE (live or upcoming fixtures)
CREATE TABLE IF NOT EXISTS public.matches (
    id TEXT PRIMARY KEY,                        -- e.g. 'c001', 'f101'
    sport TEXT NOT NULL DEFAULT 'football',     -- 'football', 'cricket', 'basketball'
    home_team TEXT NOT NULL,
    away_team TEXT NOT NULL,
    home_tag TEXT NOT NULL,                     -- short code e.g. 'MCI'
    away_tag TEXT NOT NULL,
    match_time TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'upcoming',             -- upcoming, live, completed
    api_fixture_id INT,                         -- API-Football fixture ID (optional)
    prize_pool DECIMAL(10,2) DEFAULT 8.5,
    entry_fee DECIMAL(10,2) DEFAULT 0.1,
    max_players INT DEFAULT 200,
    current_players INT DEFAULT 0,
    ai_tip TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CONTESTS TABLE (instances of a match with different formats)
CREATE TABLE IF NOT EXISTS public.contests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id TEXT REFERENCES public.matches(id) ON DELETE CASCADE,
    type TEXT DEFAULT 'mega',                   -- 'mega', '1v1', 'mini'
    prize_pool DECIMAL(10,2) NOT NULL,
    entry_fee DECIMAL(10,2) NOT NULL,
    max_spots INT DEFAULT 200,
    filled_spots INT DEFAULT 0,
    status TEXT DEFAULT 'open',                 -- 'open', 'locked', 'settled'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ENTRIES TABLE (user lineup submissions)
CREATE TABLE IF NOT EXISTS public.entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_wallet TEXT NOT NULL,
    match_id TEXT REFERENCES public.matches(id),
    contest_id UUID REFERENCES public.contests(id),
    lineup_data JSONB NOT NULL DEFAULT '[]',
    captain_id TEXT,
    vc_id TEXT,
    total_points DECIMAL(8,2),
    rank INT,
    prize_won DECIMAL(10,2),
    tx_signature TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;

-- Policies (read-heavy for public contest data)
CREATE POLICY "Matches are public" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Contests are public" ON public.contests FOR SELECT USING (true);
CREATE POLICY "Users can insert entries" ON public.entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own entries" ON public.entries FOR SELECT USING (true);

-- Enable Realtime for live scoring
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.entries;
