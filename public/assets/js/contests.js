async function fetchUpcomingFixtures(limit = 24) {
  try {
    const response = await fetch(FOOTBALL_API_URL + '?upcoming=1&leagues=39,140,135,78,61&next=' + encodeURIComponent(limit));
    const payload = await response.json();
    const fixtures = Array.isArray(payload?.data) ? payload.data : [];
    return fixtures;
  } catch (error) {
    console.warn('Upcoming fixtures fetch failed', error);
    return [];
  }
}
function contestsFromFixtures(fixtures) {
  return fixtures.map((fixture) => {
    const home = fixture?.teams?.home?.name || 'Home';
    const away = fixture?.teams?.away?.name || 'Away';
    const league = fixture?.league?.name || 'Football';
    const fixtureId = String(fixture?.fixture?.id || ('fx-' + Math.random().toString(36).slice(2, 8)));
    const startsAt = fixture?.fixture?.date || new Date(Date.now() + 86400000).toISOString();
    return normalizeContest({
      id: 'football-live-' + fixtureId,
      title: home + ' vs ' + away,
      sport: 'football',
      league,
      fixture_id: fixtureId,
      entry_mode: 'free',
      entry_asset: 'SOL',
      entry_amount: 0,
      prize_pool: 'Live reputation pool',
      lineup_visibility: 'hidden_until_lock',
      status: 'upcoming',
      starts_at: startsAt,
      contest_size: 900,
      joined: Math.floor(150 + Math.random() * 350),
      scoring_ruleset_id: 'football_classic_v1',
      source: 'live-fixture'
    });
  }).filter(Boolean);
}
window.getContests = async function getContests() {
  const rows = await trySupabaseSelect('contests', '*');
  const normalized = rows.map(normalizeContest).filter(Boolean);

  const liveFixtures = await fetchUpcomingFixtures(24);
  const liveContests = contestsFromFixtures(liveFixtures);

  const seeded = SEEDED_CONTESTS.map((contest) => ({ ...contest, source: 'seed' }));
  const mergedBase = normalized.length ? normalized : seeded;
  const merged = [...liveContests, ...mergedBase].filter((contest, idx, arr) => arr.findIndex((c) => c.id === contest.id) === idx);

  PAGE_STATE.contests = merged;
  return merged;
};
window.getLiveScores = async function getLiveScores() {
  try {
    const response = await fetch(FOOTBALL_API_URL + '?live=1');
    const payload = await response.json();
    if (Array.isArray(payload?.data)) return payload.data;
    if (payload?.data) return [payload.data];
    return [];
  } catch (error) {
    console.warn('Live scores fetch failed', error);
    return [];
  }
};
async function fetchMatchWithLimit(fixtureId) {
  const stateKey = `skillxi_match_${fixtureId}_calls`;
  const calls = readStore(stateKey, []);
  if (calls.length >= 3) return null;

  try {
    const response = await fetch(FOOTBALL_API_URL + '?fixture=' + encodeURIComponent(fixtureId));
    const payload = await response.json();
    const fixture = payload?.data || payload?.response?.[0] || null;
    if (fixture) {
      calls.push({ time: Date.now(), status: fixture.fixture?.status?.short || 'UNK' });
      writeStore(stateKey, calls);
      return fixture;
    }
  } catch (error) {
    console.warn('Live fixture fetch failed', error);
  }
  return null;
}
function contestBadge(contest) {
  if (contest.entry_mode === 'paid_beta') return 'Paid beta';
  if (contest.beta) return 'Beta';
  return 'Free';
}
function contestSportIcon(sport) {
  const icons = { football: '⚽', cricket: '🏏', basketball: '🏀' };
  return icons[sport] || '🏆';
}
function renderContests() {
  const grid = document.getElementById('contests-grid');
  if (!grid) return;
  const contests = PAGE_STATE.contests.filter((contest) => PAGE_STATE.filteredSport === 'all' || contest.sport === PAGE_STATE.filteredSport);

  if (!contests.length) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;background:#13131f;border:1px solid #1e1e30;border-radius:18px;padding:28px;color:#a0a0b8;">
        No contests found for this filter yet.
      </div>
    `;
    return;
  }

  grid.innerHTML = contests.map((contest) => {
    const fills = Math.min(100, Math.round((contest.joined / Math.max(contest.contest_size, 1)) * 100));
    return `
      <article style="background:#13131f;border:1px solid #1e1e30;border-radius:22px;padding:22px;display:flex;flex-direction:column;gap:16px;box-shadow:0 20px 40px rgba(0,0,0,0.2);">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">
          <div>
            <div style="display:inline-flex;align-items:center;gap:8px;padding:6px 10px;border-radius:999px;background:rgba(0,212,255,0.08);border:1px solid rgba(0,212,255,0.18);font-size:11px;color:#a8e8ff;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">${contestSportIcon(contest.sport)} ${escapeHtml(contest.league)}</div>
            <h3 style="margin:12px 0 6px;color:#fff;font-size:20px;font-weight:800;">${escapeHtml(contest.title)}</h3>
            <p style="margin:0;color:#a0a0b8;font-size:13px;">Starts ${escapeHtml(formatDate(contest.starts_at))} · Lock in ${escapeHtml(timeUntil(contest.starts_at))}</p>
          </div>
          <span style="padding:6px 10px;border-radius:999px;background:${contest.entry_mode === 'paid_beta' ? 'rgba(255,193,7,0.08)' : 'rgba(0,255,136,0.08)'};border:1px solid ${contest.entry_mode === 'paid_beta' ? 'rgba(255,193,7,0.25)' : 'rgba(0,255,136,0.18)'};color:${contest.entry_mode === 'paid_beta' ? '#ffd166' : '#00ff88'};font-size:11px;font-weight:800;text-transform:uppercase;">${escapeHtml(contestBadge(contest))}</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;">
          <div style="background:#0d0d14;border-radius:16px;padding:14px;">
            <div style="color:#6f6f86;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;">Entry</div>
            <div style="color:#fff;font-weight:800;margin-top:4px;">${contest.entry_amount > 0 ? `${formatSol(contest.entry_amount)}` : 'Free'}</div>
          </div>
          <div style="background:#0d0d14;border-radius:16px;padding:14px;">
            <div style="color:#6f6f86;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;">Prize</div>
            <div style="color:#fff;font-weight:800;margin-top:4px;">${escapeHtml(contest.prize_pool)}</div>
          </div>
          <div style="background:#0d0d14;border-radius:16px;padding:14px;">
            <div style="color:#6f6f86;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;">Visibility</div>
            <div style="color:#fff;font-weight:800;margin-top:4px;">${escapeHtml(contest.lineup_visibility.replaceAll('_', ' '))}</div>
          </div>
        </div>
        <div>
          <div style="display:flex;justify-content:space-between;font-size:12px;color:#a0a0b8;margin-bottom:8px;">
            <span>${contest.joined}/${contest.contest_size} joined</span>
            <span>${fills}% full</span>
          </div>
          <div style="height:8px;background:#09090d;border-radius:999px;overflow:hidden;">
            <div style="height:100%;width:${fills}%;background:linear-gradient(90deg,#00d4ff,#00ff88);"></div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:auto;">
          <button data-join-contest="${escapeHtml(contest.id)}" style="background:linear-gradient(135deg,#00d4ff,#00a2ff);border:none;border-radius:16px;padding:14px 18px;font-weight:800;color:#09111a;cursor:pointer;">
            ${contest.entry_mode === 'paid_beta' ? 'Join beta contest' : 'Build lineup'}
          </button>
          <button data-skillxi-blink="${escapeHtml(contest.id)}" style="background:rgba(153,69,255,.12);border:1px solid rgba(153,69,255,.35);border-radius:16px;padding:14px 18px;font-weight:900;color:#d2bbff;cursor:pointer;">
            Share Blink
          </button>
        </div>
      </article>
    `;
  }).join('');
}
function setFilterButtonState(activeSport) {
  ['all', 'football', 'cricket', 'basketball'].forEach((sport) => {
    const button = document.getElementById(`filter-${sport}`);
    if (!button) return;
    if (sport === activeSport) {
      button.style.background = '#7c3aed';
      button.style.color = '#fff';
      button.style.border = 'none';
    } else {
      button.style.background = '#13131f';
      button.style.color = '#a0a0b8';
      button.style.border = '1px solid #2a2a40';
    }
  });
}
window.filterContests = function filterContests(sport) {
  PAGE_STATE.filteredSport = sport;
  setFilterButtonState(sport);
  renderContests();
};

