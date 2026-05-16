const cache = new Map();
const TOP_FOOTBALL_LEAGUES = ['39', '140', '135', '78', '61']; // EPL, LaLiga, Serie A, Bundesliga, Ligue 1

function withCache(key, ttlMs, fetcher) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.time < ttlMs) return Promise.resolve(cached.value);
  return fetcher().then((value) => {
    cache.set(key, { time: Date.now(), value });
    return value;
  });
}

async function apiFetch(url, key) {
  const response = await fetch(url, { headers: { 'x-apisports-key': key } });
  const payload = await response.json();
  if (!response.ok) throw new Error(`API-Football HTTP ${response.status}`);
  return payload;
}

function currentFootballSeason() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;
  return String(month >= 7 ? year : year - 1);
}

function parseList(value, fallback) {
  return String(value || fallback.join(','))
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function normalizeFixtureList(fixtures, limit) {
  return fixtures
    .filter((f) => ['NS', 'TBD', '1H', 'HT', '2H', 'ET', 'BT', 'P', 'LIVE'].includes(f?.fixture?.status?.short))
    .sort((a, b) => new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime())
    .filter((fixture, index, arr) => arr.findIndex((item) => item?.fixture?.id === fixture?.fixture?.id) === index)
    .slice(0, limit);
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  const key = process.env.FOOTBALL_API_KEY;
  const fixture = req.query.fixture;
  const live = req.query.live === '1' || req.query.live === 'true';
  const upcoming = req.query.upcoming === '1' || req.query.upcoming === 'true';
  const leagues = parseList(req.query.leagues || req.query.league, TOP_FOOTBALL_LEAGUES);
  const season = req.query.season || currentFootballSeason();
  const next = Math.max(4, Math.min(40, Number(req.query.next || 24)));

  if (!key) {
    if (upcoming) return res.status(200).json({ source: 'fallback', data: fallbackUpcoming() });
    return res.status(200).json({ source: 'fallback', data: fallbackScore(live) });
  }

  try {
    if (upcoming) {
      const data = await withCache(`upcoming:${leagues.join('-')}:${season}:${next}`, 5 * 60 * 1000, async () => {
        const perLeague = Math.max(4, Math.ceil(next / leagues.length) + 2);
        const batches = await Promise.all(leagues.map(async (league) => {
          const url = `https://v3.football.api-sports.io/fixtures?league=${encodeURIComponent(league)}&season=${encodeURIComponent(season)}&next=${encodeURIComponent(perLeague)}`;
          const payload = await apiFetch(url, key);
          return Array.isArray(payload.response) ? payload.response : [];
        }));
        return normalizeFixtureList(batches.flat(), next);
      });
      return res.status(200).json({ source: 'api-football', season, leagues, data });
    }

    const data = await withCache(
      `${live ? 'live' : 'fixture'}:${fixture || '1379295'}`,
      live ? 30000 : 60000,
      async () => {
        const url = live
          ? 'https://v3.football.api-sports.io/fixtures?live=all'
          : `https://v3.football.api-sports.io/fixtures?id=${encodeURIComponent(fixture || '1379295')}`;
        const payload = await apiFetch(url, key);
        if (live) return Array.isArray(payload.response) ? payload.response : [];
        return payload.response?.[0] || fallbackScore(false);
      }
    );

    return res.status(200).json({ source: 'api-football', data });
  } catch (error) {
    if (upcoming) return res.status(200).json({ source: 'fallback', data: fallbackUpcoming(), warning: error.message });
    return res.status(200).json({ source: 'fallback', data: fallbackScore(live), warning: error.message });
  }
}

function futureDate(daysFromNow, hour = 15) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + daysFromNow);
  date.setUTCHours(hour, 30, 0, 0);
  return date.toISOString();
}

function fallbackUpcoming() {
  return [
    {
      fixture: { id: 1379295, status: { short: 'NS', long: 'Not Started' }, date: futureDate(2, 15) },
      teams: { home: { name: 'Manchester City' }, away: { name: 'Arsenal' } },
      league: { name: 'Premier League' },
      goals: { home: null, away: null }
    },
    {
      fixture: { id: 1379300, status: { short: 'NS', long: 'Not Started' }, date: futureDate(3, 18) },
      teams: { home: { name: 'Liverpool' }, away: { name: 'Chelsea' } },
      league: { name: 'Premier League' },
      goals: { home: null, away: null }
    },
    {
      fixture: { id: 2400101, status: { short: 'NS', long: 'Not Started' }, date: futureDate(4, 19) },
      teams: { home: { name: 'Barcelona' }, away: { name: 'Real Madrid' } },
      league: { name: 'La Liga' },
      goals: { home: null, away: null }
    },
    {
      fixture: { id: 3400202, status: { short: 'NS', long: 'Not Started' }, date: futureDate(5, 16) },
      teams: { home: { name: 'Bayern Munich' }, away: { name: 'Borussia Dortmund' } },
      league: { name: 'Bundesliga' },
      goals: { home: null, away: null }
    }
  ];
}

function fallbackScore(liveMode) {
  if (liveMode) return fallbackUpcoming().slice(0, 1);
  return fallbackUpcoming()[0];
}
