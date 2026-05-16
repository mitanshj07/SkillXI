-- SkillXI beta schema and seed data
create table if not exists contests (
  id text primary key,
  home_team text,
  away_team text,
  league text,
  sport text default 'football',
  match_date timestamptz,
  entry_fee numeric default 0,
  prize_pool numeric default 0,
  max_players integer default 100,
  current_players integer default 0,
  difficulty text default 'BEGINNER',
  status text default 'open',
  contest_type text default 'Mega',
  ai_tip text,
  featured boolean default false,
  created_at timestamptz default now()
);
create table if not exists users (
  id uuid default gen_random_uuid() primary key,
  wallet_address text unique,
  username text,
  email text,
  skill_score integer default 500,
  subscription text default 'free',
  total_earned numeric default 0,
  contests_entered integer default 0,
  contests_won integer default 0,
  referral_code text,
  referred_by text,
  created_at timestamptz default now()
);
create table if not exists entries (
  id uuid default gen_random_uuid() primary key,
  contest_id text references contests(id),
  wallet_address text,
  user_id text,
  lineup jsonb,
  lineup_data jsonb,
  captain text,
  vc text,
  total_points numeric default 0,
  points_final numeric default 0,
  rank integer,
  payment_signature text,
  tx_signature text,
  payout_amount numeric default 0,
  payout_tx text,
  status text default 'pending',
  settlement_status text default 'pending',
  privacy_mode text default 'hidden_until_reveal',
  created_at timestamptz default now()
);
create table if not exists leaderboard (
  id uuid default gen_random_uuid() primary key,
  username text,
  wallet_address text,
  skill_score integer default 500,
  total_winnings numeric default 0,
  contests_won integer default 0,
  updated_at timestamptz default now()
);
insert into contests (id, home_team, away_team, league, sport, match_date, entry_fee, prize_pool, max_players, current_players, difficulty, status, contest_type, ai_tip, featured) values
('football-mci-ars-classic','Manchester City','Arsenal','Premier League','football','2026-04-19 15:30:00+00',0,150,1200,842,'BEGINNER','open','Mega','Haaland is the safest captain; De Bruyne is the leverage pivot.',true),
('football-mci-ars-beta','Manchester City','Arsenal','Premier League','football','2026-04-19 15:30:00+00',0.15,2.4,64,19,'PRO','open','Mini League','Hidden lineup beta enabled for this contest.',true),
('football-epl-differentials','Manchester City','Arsenal','Premier League','football','2026-04-19 15:30:00+00',0,75,600,311,'BEGINNER','open','Differentials','Ben White and Gvardiol are low-owned defensive pivots.',false)
on conflict (id) do nothing;
insert into leaderboard (username, wallet_address, skill_score, total_winnings, contests_won) values
('ScoutPrime','9tzV1111111111111111111111111111111111111skx',2485,18.4,11),
('FalseNine','8brP1111111111111111111111111111111111116Tfa',2398,14.1,9),
('CaptainMeta','7mAA111111111111111111111111111111111112opL',2312,12.7,8),
('DifferentialLab','5zzX111111111111111111111111111111111119ru8',2246,10.2,7),
('SetPieceDAO','4aVr111111111111111111111111111111111113kyQ',2192,8.9,6)
on conflict do nothing;

-- Production hardening columns for privacy, compliance, and payout operations
alter table contests add column if not exists entry_mode text default 'free';
alter table contests add column if not exists entry_asset text default 'SOL';
alter table contests add column if not exists fixture_id text;
alter table contests add column if not exists scoring_ruleset_id text default 'football_classic_v1';
alter table contests add column if not exists lineup_visibility text default 'hidden_until_reveal';

alter table users add column if not exists reputation_score integer default 50;
alter table users add column if not exists beta_access boolean default false;
alter table users add column if not exists primary_wallet text;
alter table users add column if not exists region text;
alter table users add column if not exists kyc_status text default 'not_started';
alter table users add column if not exists risk_status text default 'standard';
alter table users add column if not exists skill_score_history jsonb default '[]'::jsonb;

alter table entries add column if not exists is_private boolean default true;
alter table entries add column if not exists lineup_encrypted text;
alter table entries add column if not exists lineup_hash text;
alter table entries add column if not exists lineup_reveal_at timestamptz;
alter table entries add column if not exists compliance_status text default 'pending';
alter table entries add column if not exists risk_status text default 'pending';
alter table entries add column if not exists escrow_address text;
alter table entries add column if not exists escrow_network text default 'devnet';
alter table entries add column if not exists payout_status text default 'not_due';
alter table entries add column if not exists settlement_audit jsonb default '{}'::jsonb;

create table if not exists admin_audit_log (
  id uuid default gen_random_uuid() primary key,
  actor_wallet text,
  action text not null,
  target_type text,
  target_id text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists risk_reviews (
  id uuid default gen_random_uuid() primary key,
  wallet_address text,
  contest_id text,
  reason text,
  status text default 'open',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
