function getAdminToken() { return window.sessionStorage.getItem(STORAGE_KEYS.adminToken) || ''; }
function setAdminToken(token) { if (token) window.sessionStorage.setItem(STORAGE_KEYS.adminToken, token); else window.sessionStorage.removeItem(STORAGE_KEYS.adminToken); }
async function verifyAdminToken() {
  const token = getAdminToken();
  if (!token) return false;
  try {
    const response = await fetch('/api/admin', { headers: { Authorization: 'Bearer ' + token }, cache: 'no-store' });
    const payload = await response.json();
    if (!payload.ok) setAdminToken('');
    return Boolean(payload.ok);
  } catch (error) { return false; }
}
function renderAdminLogin(root, message = '') {
  root.innerHTML = `<section class="sx-shell"><div class="sx-header"><a class="sx-logo" href="index.html">SkillXI Admin</a><a class="sx-wallet" href="index.html">Back home</a></div><main class="sx-main"><p class="sx-kicker">Secure Ops</p><h1>Admin Access</h1><section class="sx-panel" style="max-width:520px;"><p class="sx-muted">Admin is protected by server-side Vercel environment variables. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET before production use.</p>${message ? `<div class="sx-note">${escapeHtml(message)}</div>` : ''}<input id="skillxi-admin-password" type="password" placeholder="Admin password" style="width:100%;box-sizing:border-box;margin:16px 0;padding:14px;border-radius:12px;border:1px solid #35354a;background:#0d0d14;color:#fff;"><button id="skillxi-admin-login">Unlock Admin</button></section></main></section>`;
}
async function skillxiRenderAdminPage() {
  const root = document.getElementById('skillxi-admin-root');
  if (!root) return;
  const isAdmin = await verifyAdminToken();
  if (!isAdmin) { renderAdminLogin(root); return; }
  const adminContests = readStore(SKILLXI_ADMIN_CONTESTS_KEY, PAGE_STATE.contests || []);
  const users = await window.getLeaderboard ? await window.getLeaderboard() : [];
  const entries = getLocalEntries();
  root.innerHTML = `<section class="sx-shell"><div class="sx-header"><a class="sx-logo" href="index.html">SkillXI Admin</a><button class="sx-wallet" id="skillxi-admin-logout">Lock admin</button></div><main class="sx-main"><p class="sx-kicker">Ops Dashboard</p><h1>Contest Control</h1><div class="sx-stats"><article><b>${users.length}</b><span>Total users</span></article><article><b>${adminContests.filter((c) => c.status !== 'settled').length}</b><span>Active contests</span></article><article><b>${entries.length}</b><span>Local entries</span></article><article><b id="skillxi-api-health">Checking</b><span>API health</span></article></div><section class="sx-panel"><div class="sx-panel-head"><h2>Contest Manager</h2><button id="skillxi-admin-create">Create Contest</button></div><div class="sx-table">${adminContests.map((contest) => `<div><span>${escapeHtml(contest.title)}</span><span>${escapeHtml(contest.status)}</span><span>${escapeHtml(contest.prize_pool)}</span><button data-admin-lock="${escapeHtml(contest.id)}">Lock</button><button data-admin-settle="${escapeHtml(contest.id)}">Settle</button><button data-admin-delete="${escapeHtml(contest.id)}">Delete</button></div>`).join('')}</div></section><section class="sx-panel"><div class="sx-panel-head"><h2>User Manager</h2><span>Production user data comes from Supabase after schema migration</span></div><div class="sx-table">${users.map((user) => `<div><span>${escapeHtml(user.username)}</span><span>${escapeHtml(shortWallet(user.wallet_address))}</span><span>${user.skill_score}</span><span>${formatSol(user.total_earned || 0)}</span></div>`).join('')}</div></section><section class="sx-panel"><div class="sx-panel-head"><h2>Compliance & Risk</h2><button id="skillxi-admin-health-refresh">Refresh Health</button></div><p class="sx-muted">Paid beta requires allowlisted wallets, region checks, entry caps, and KYC provider configuration unless devnet override is explicitly enabled.</p></section><section class="sx-panel"><div class="sx-panel-head"><h2>Leaderboard</h2><button onclick="settleContest()">Sync From Entries</button></div><p class="sx-muted">Settlement creates local receipts and can be reconciled with Supabase after migration.</p></section></main></section>`;
  skillxiHydrateAdminHealth();
}
function skillxiCreateAdminContest() {
  const title = prompt('Contest title:', 'Man City vs Arsenal Mini League');
  if (!title) return;
  const contests = readStore(SKILLXI_ADMIN_CONTESTS_KEY, PAGE_STATE.contests || []);
  contests.unshift({ ...(PAGE_STATE.contests[0] || {}), id: `admin-${Date.now()}`, title, status: 'open', joined: 0, source: 'local-admin' });
  writeStore(SKILLXI_ADMIN_CONTESTS_KEY, contests); PAGE_STATE.contests = contests; skillxiRenderAdminPage();
}
async function skillxiHydrateAdminHealth() {
  const node = document.getElementById('skillxi-api-health');
  if (!node) return;
  try {
    const response = await fetch('/api/health', { cache: 'no-store' });
    const payload = await response.json();
    const integrations = payload?.integrations || {};
    const requiredReady = integrations.footballApi && (integrations.gemini || integrations.openai);
    node.textContent = requiredReady ? 'Live' : 'Needs keys';
    node.style.color = requiredReady ? '#00ff88' : '#ffd166';
    node.title = 'Football API: ' + Boolean(integrations.footballApi) + ', AI: ' + Boolean(integrations.gemini || integrations.openai);
  } catch (error) {
    node.textContent = 'Offline';
    node.style.color = '#ff6b6b';
  }
}

