-- ==============================================================================
-- SKILLXI: SOCIAL & COMPETITIVE ENGINE TABLES
-- ==============================================================================

-- 1. Profiles Table (Extending basic user data)
CREATE TABLE IF NOT EXISTS public.profiles (
    wallet_id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    xp BIGINT DEFAULT 0,
    level INT DEFAULT 1,
    reputation INT DEFAULT 100,
    skill_score INT DEFAULT 500,
    total_earned DECIMAL(10, 2) DEFAULT 0.0,
    total_lost DECIMAL(10, 2) DEFAULT 0.0,
    badges JSONB DEFAULT '[]',
    tier TEXT DEFAULT 'NOVICE',
    is_private BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Challenges Table (1v1 Matchmaking)
CREATE TABLE IF NOT EXISTS public.challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenger_id TEXT REFERENCES public.profiles(wallet_id) ON DELETE CASCADE,
    target_id TEXT REFERENCES public.profiles(wallet_id) ON DELETE CASCADE,
    match_id TEXT REFERENCES public.matches(id), -- Optional: tied to a specific match
    stake DECIMAL(10, 2) DEFAULT 0.5,
    status TEXT DEFAULT 'pending', -- pending, accepted, completed, rejected, cancelled
    winner_id TEXT REFERENCES public.profiles(wallet_id),
    tx_signature TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '2 hours')
);

-- 3. Follows Table (Social Connections)
CREATE TABLE IF NOT EXISTS public.follows (
    follower_id TEXT REFERENCES public.profiles(wallet_id) ON DELETE CASCADE,
    following_id TEXT REFERENCES public.profiles(wallet_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id)
);

-- 4. Activities Table (Social Feed)
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES public.profiles(wallet_id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'CONTEST_JOIN', 'CONTEST_WIN', 'BADGE_EARNED', 'LEVEL_UP', 'CHALLENGE_WON'
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Profiles are readable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid()::text = wallet_id);

CREATE POLICY "Challenges viewable by involved parties" ON public.challenges FOR SELECT USING (auth.uid()::text = challenger_id OR auth.uid()::text = target_id);
CREATE POLICY "Users can create challenges" ON public.challenges FOR INSERT WITH CHECK (true);

CREATE POLICY "Follows are readable by everyone" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users can manage their follows" ON public.follows FOR ALL USING (auth.uid()::text = follower_id);

CREATE POLICY "Activities are public" ON public.activities FOR SELECT USING (true);
CREATE POLICY "System/Users can log activity" ON public.activities FOR INSERT WITH CHECK (true);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.challenges;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activities;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
