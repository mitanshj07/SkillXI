window.getLeaderboard = async function getLeaderboard() {
  const rows = await trySupabaseSelect('users', '*');
  return rows
    .sort((left, right) => Number(right.skill_score || 0) - Number(left.skill_score || 0))
    .slice(0, 20)
    .map(normalizeUser);
};
function buildLeaderboardRows(users) {
  return users.map((user, index) => {
    const rank = index + 1;
    return `
      <div style="display:grid;grid-template-columns:70px 1.4fr 1fr 1fr 120px;gap:16px;align-items:center;padding:16px 20px;border-top:${index === 0 ? 'none' : '1px solid rgba(255,255,255,0.04)'};">
        <div style="font-weight:900;color:${rank <= 3 ? '#ffd166' : '#a8e8ff'};">#${rank}</div>
        <div>
          <div style="color:#fff;font-weight:700;">${escapeHtml(user.username)}</div>
          <div style="color:#6f6f86;font-size:12px;">${escapeHtml(shortWallet(user.wallet_address || user.id))}</div>
        </div>
        <div style="color:#fff;font-weight:800;">${Math.round(user.skill_score)}</div>
        <div style="color:#a0a0b8;">REP ${Math.round(user.reputation_score)}</div>
        <div style="text-align:right;color:${user.beta_access ? '#00ff88' : '#a0a0b8'};font-size:12px;font-weight:700;">${user.beta_access ? 'Beta access' : 'Public'}</div>
      </div>
    `;
  }).join('');
}
window.loadLeaderboard = async function loadLeaderboard(range = 'all_time') {
  PAGE_STATE.leaderboardRange = range;
  const users = await window.getLeaderboard();
  const table = document.getElementById('leaderboard-table');
  if (!table) return;

  const adjusted = users.map((user, index) => {
    const delta = range === 'weekly' ? 65 - index * 4 : range === 'monthly' ? 120 - index * 6 : 0;
    return { ...user, skill_score: user.skill_score + Math.max(delta, 0) };
  }).sort((left, right) => right.skill_score - left.skill_score);

  ['all', 'week', 'month'].forEach((id) => {
    const button = document.getElementById(`lb-${id}`);
    if (!button) return;
    const active = (range === 'all_time' && id === 'all') || (range === 'weekly' && id === 'week') || (range === 'monthly' && id === 'month');
    button.style.background = active ? '#7c3aed' : '#13131f';
    button.style.color = active ? '#fff' : '#a0a0b8';
    button.style.border = active ? 'none' : '1px solid #2a2a40';
  });

  table.innerHTML = `
    <div style="display:grid;grid-template-columns:70px 1.4fr 1fr 1fr 120px;gap:16px;padding:18px 20px;background:#0d0d14;color:#6f6f86;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;font-weight:700;">
      <div>Rank</div>
      <div>Analyst</div>
      <div>Skill score</div>
      <div>Reputation</div>
      <div style="text-align:right;">Access</div>
    </div>
    ${buildLeaderboardRows(adjusted)}
  `;
};

