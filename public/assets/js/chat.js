function chatResponseForPrompt(prompt, entries) {
  const normalized = prompt.toLowerCase();
  const lastEntry = entries[0];
  const contest = currentContest();

  if (normalized.includes('captain')) {
    return `For ${contest.title}, captain Haaland in smaller fields and De Bruyne if you want leverage. Your last locked lineup also leaned attack-heavy, so this keeps your profile consistent.`;
  }
  if (normalized.includes('differential')) {
    return 'Three strong differentials right now are Ben White, Declan Rice, and Josko Gvardiol. They fit a lower-owned build without completely sacrificing floor.';
  }
  if (normalized.includes('lineup') || normalized.includes('4-3-3')) {
    return `Best current shell is 4-3-3 with Haaland, Saka, and Foden up top. ${lastEntry ? `Your most recent locked entry scored a projected ${lastEntry.lineup_data?.projected_points || 0} points, so I would keep a similar core.` : 'Once you lock more entries, I will compare against your actual history too.'}`;
  }
  if (normalized.includes('match') || normalized.includes('arsenal') || normalized.includes('man city')) {
    return `${contest.title} looks like a medium-tempo slate: City control possession, Arsenal counter with transition value, and midfielders gain extra floor if the match stays tight.`;
  }
  if (normalized.includes('history') || normalized.includes('recent')) {
    return lastEntry
      ? `Your latest entry was for ${lastEntry.contest_title}. It is currently marked ${lastEntry.settlement_status}. I can use that history to keep future builds more aggressive or more balanced.`
      : 'You do not have locked entries yet, so I am still working from the current contest context rather than personal history.';
  }
  return 'I can help with captaincy, differentials, match analysis, lineup builds, and reviewing your recent locked entries.';
}
function appendChatMessage(role, message) {
  const container = document.getElementById('chat-messages');
  if (!container) return;
  const isUser = role === 'user';
  const bubble = document.createElement('div');
  bubble.style.cssText = `max-width:78%;align-self:${isUser ? 'flex-end' : 'flex-start'};background:${isUser ? 'linear-gradient(135deg,#00d4ff,#0099bb)' : '#13131f'};border:${isUser ? 'none' : '1px solid #1e1e30'};color:${isUser ? '#07121a' : '#fff'};padding:14px 16px;border-radius:18px;font-size:14px;line-height:1.7;`;
  bubble.innerHTML = escapeHtml(message);
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}
async function seedChatContext() {
  const container = document.getElementById('chat-messages');
  if (!container || container.dataset.skillxiReady) return;
  container.dataset.skillxiReady = 'true';
  const entries = await getUserEntries();
  const contest = currentContest();
  const intro = entries.length
    ? `I have your recent entry history loaded. Ask me about captaincy, differentials, or how your last locked lineup compares to ${contest.title}.`
    : `I have the ${contest.title} context ready. Ask me for a lineup, captain, differentials, or pre-match breakdown.`;
  appendChatMessage('assistant', intro);
}
window.quickAsk = function quickAsk(prompt) {
  const input = document.getElementById('chat-input');
  if (input) input.value = prompt;
  window.sendChatMessage();
};
window.handleChatKey = function handleChatKey(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    window.sendChatMessage();
  }
};
window.sendChatMessage = async function sendChatMessage() {
  const input = document.getElementById('chat-input');
  if (!input) return;
  const prompt = input.value.trim();
  if (!prompt) return;
  appendChatMessage('user', prompt);
  input.value = '';
  const entries = await getUserEntries();
  window.setTimeout(() => {
    appendChatMessage('assistant', chatResponseForPrompt(prompt, entries));
  }, 180);
};
window.generateReport = async function generateReport() {
  const loading = document.getElementById('report-loading');
  const result = document.getElementById('report-result');
  const contest = currentContest();
  if (loading) loading.style.display = 'block';
  if (result) result.style.display = 'none';

  let liveFixture = null;
  if (contest.fixture_id && /^\d+$/.test(contest.fixture_id)) {
    liveFixture = await fetchMatchWithLimit(contest.fixture_id);
  }

  window.setTimeout(() => {
    if (loading) loading.style.display = 'none';
    if (!result) return;

    const formStatus = liveFixture?.fixture?.status?.short ? `Live status: ${liveFixture.fixture.status.short}` : 'Live status: pre-match';
    result.style.display = 'block';
    result.innerHTML = `
      <div style="background:#13131f;border:1px solid #1e1e30;border-radius:18px;padding:22px;">
        <h3 style="margin:0 0 10px;color:#fff;font-size:20px;font-weight:800;">${escapeHtml(contest.title)} report</h3>
        <p style="margin:0 0 18px;color:#a0a0b8;line-height:1.7;font-size:14px;">${escapeHtml(formStatus)}. SkillXI currently projects a control-heavy match with City dominating touches and Arsenal offering more transition upside than raw possession.</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;">
          <div style="background:#0d0d14;border-radius:14px;padding:16px;">
            <div style="color:#6f6f86;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;">Best captain</div>
            <div style="color:#fff;font-size:18px;font-weight:800;margin-top:6px;">Erling Haaland</div>
          </div>
          <div style="background:#0d0d14;border-radius:14px;padding:16px;">
            <div style="color:#6f6f86;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;">Best leverage</div>
            <div style="color:#fff;font-size:18px;font-weight:800;margin-top:6px;">Kevin De Bruyne</div>
          </div>
          <div style="background:#0d0d14;border-radius:14px;padding:16px;">
            <div style="color:#6f6f86;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;">Defensive value</div>
            <div style="color:#fff;font-size:18px;font-weight:800;margin-top:6px;">Saliba / White</div>
          </div>
        </div>
        <ul style="margin:18px 0 0;padding-left:18px;color:#d6d6e6;line-height:1.8;font-size:13px;">
          <li>Prioritize players with locked minutes and set-piece involvement.</li>
          <li>In large fields, swap one City attacker for an Arsenal defender to get leverage.</li>
          <li>Paid beta contests should avoid duplicate chalk builds because reveal happens later.</li>
        </ul>
      </div>
    `;
  }, 240);
};
function skillxiHydrateAiSidebar() {
  if (getPath() !== 'ai-chat.html') return;
  const activeContext = Array.from(document.querySelectorAll('section.w-80, section')).find((node) => (node.textContent || '').includes('Current Lineup'));
  if (!activeContext) return;
  activeContext.innerHTML = `<div class="p-6 border-b border-[#ffffff0f]"><h3 class="text-xs font-bold text-secondary tracking-widest uppercase mb-4">Active Context</h3><div class="bg-surface-container-high rounded-2xl p-4 border border-outline-variant/10"><div class="flex justify-between items-start mb-2"><span class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Contest</span><span class="bg-tertiary/10 text-tertiary text-[10px] font-bold px-2 py-0.5 rounded-full">Beta</span></div><h4 class="font-headline font-bold text-sm">Man City vs Arsenal</h4><div class="mt-4 flex items-center justify-between"><div class="text-center"><p class="text-[10px] text-[#5a5a75] uppercase">Budget</p><p class="text-sm font-headline font-black text-white">87.5 / 100 Cr</p></div><div class="w-[1px] h-8 bg-outline-variant/20"></div><div class="text-center"><p class="text-[10px] text-[#5a5a75] uppercase">Projection</p><p class="text-sm font-headline font-black text-primary">742.8</p></div></div></div></div><div class="flex-1 overflow-y-auto p-6"><div class="flex items-center justify-between mb-4"><h3 class="text-xs font-bold text-[#5a5a75] tracking-widest uppercase">Current Lineup</h3><span class="text-[10px] font-bold text-primary">11 / 11</span></div><div class="space-y-3">${DEFAULT_LINEUP.players.slice(0, 6).map((player) => `<div class="flex items-center gap-3 p-2 rounded-xl bg-surface-container-low border border-transparent hover:border-primary/20 transition-all"><div class="w-10 h-10 rounded-full bg-[#1f1f2e] border border-outline-variant/30 flex items-center justify-center text-[10px] font-bold text-primary">${escapeHtml(player.position)}</div><div class="flex-1"><p class="text-xs font-bold text-white leading-tight">${escapeHtml(player.name)}</p><p class="text-[10px] text-[#5a5a75]">${player.credits} Cr | ${Math.round(player.rating * 10)} Pt</p></div></div>`).join('')}</div></div>`;
  const proBadge = Array.from(document.querySelectorAll('span')).find((node) => (node.textContent || '').trim() === 'PRO FEATURE');
  if (proBadge) proBadge.textContent = 'BETA FEATURE';
}

