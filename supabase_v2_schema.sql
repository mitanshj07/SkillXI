-- ==============================================================================
-- SKILLXI VERSION 2: SUPABASE MIGRATION SCHEMA
-- Run this in your Supabase SQL Editor to prepare your database for automation.
-- ==============================================================================

-- 1. Create Matches (Contests) Table
CREATE TABLE IF NOT EXISTS public.matches (
    id TEXT PRIMARY KEY,
    sport TEXT DEFAULT 'football',
    home_team TEXT NOT NULL,
    home_tag TEXT NOT NULL,
    away_team TEXT NOT NULL,
    away_tag TEXT NOT NULL,
    league TEXT NOT NULL,
    match_date TIMESTAMPTZ NOT NULL,
    prize DECIMAL(10, 2) DEFAULT 8.5,
    entry DECIMAL(10, 2) DEFAULT 0.1,
    max_players INT DEFAULT 200,
    current_players INT DEFAULT 0,
    difficulty TEXT DEFAULT 'BEGINNER',
    ai_tip TEXT,
    featured BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'NS', -- NS (Not Started), LIVE, FT (Full Time)
    payouts_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Profiles Table (User Stats)
CREATE TABLE IF NOT EXISTS public.profiles (
    wallet_id TEXT PRIMARY KEY,
    username TEXT UNIQUE,
    skill_score INT DEFAULT 500,
    contests_won INT DEFAULT 0,
    total_earned DECIMAL(10, 2) DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Players Table mapping to Matches
CREATE TABLE IF NOT EXISTS public.players (
    id TEXT PRIMARY KEY,
    match_id TEXT REFERENCES public.matches(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    team_tag TEXT NOT NULL,
    price DECIMAL(10, 1) NOT NULL,
    ai_score DECIMAL(10, 1) DEFAULT 5.0,
    position TEXT NOT NULL CHECK (position IN ('GK', 'DEF', 'MID', 'FWD')),
    photo_url TEXT,
    live_fantasy_points DECIMAL(10, 1) DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Modify/Create Entries Table
-- (Assuming this might already exist or needs these columns)
CREATE TABLE IF NOT EXISTS public.entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id TEXT REFERENCES public.matches(id) ON DELETE CASCADE,
    user_wallet TEXT NOT NULL,
    lineup_data JSONB NOT NULL, -- The array of 11 player IDs, C, VC
    tx_signature TEXT UNIQUE NOT NULL,
    is_private BOOLEAN DEFAULT TRUE,
    status TEXT DEFAULT 'locked',
    total_points DECIMAL(10, 1) DEFAULT 0.0,
    prize_won DECIMAL(10, 2) DEFAULT 0.0,
    payout_tx TEXT, -- Stores the automated Solana payout signature
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(match_id, user_wallet)
);

-- 4. Enable Row Level Security (RLS) for Frontend Reads
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;

-- Allow public reads on matches and players so main.js can fetch them.
CREATE POLICY "Public profiles are viewable by everyone" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Public players are viewable by everyone" ON public.players FOR SELECT USING (true);

-- Users can only see their own entries unless they are public (for the leaderboard end-state)
CREATE POLICY "Users can insert their own entries" ON public.entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own entries" ON public.entries FOR SELECT USING (true); -- Relaxed for leaderboard purposes

-- 5. Social & Nexus Feed Tables
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id TEXT REFERENCES public.profiles(wallet_id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- CONTEST_JOIN, CONTEST_WIN, LEVEL_UP, CHALLENGE_SENT
    payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id TEXT REFERENCES public.profiles(wallet_id) ON DELETE CASCADE,
    following_id TEXT REFERENCES public.profiles(wallet_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- Enable RLS for Social Tables
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Activities are viewable by everyone" ON public.activities FOR SELECT USING (true);
CREATE POLICY "Follows are viewable by everyone" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users can insert own activities" ON public.activities FOR INSERT WITH CHECK (wallet_id = current_user);
CREATE POLICY "Users can insert own follows" ON public.follows FOR INSERT WITH CHECK (follower_id = current_user);
