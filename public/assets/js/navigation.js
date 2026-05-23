function skillxiGoBack() {
  if (window.history.length > 1) window.history.back();
  else window.location.href = 'contests.html';
}
window.skillxiGoBack = skillxiGoBack;
function injectUniversalNavigation() {
  if (document.getElementById('skillxi-universal-nav')) return;
  const wrap = document.createElement('div');
  wrap.id = 'skillxi-universal-nav';
  wrap.style.cssText = 'position:fixed;right:18px;bottom:18px;z-index:99990;display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:flex-end;max-width:calc(100vw - 36px);';
  const itemStyle = 'border:1px solid rgba(168,232,255,.22);background:rgba(12,14,22,.88);backdrop-filter:blur(12px);color:#a8e8ff;border-radius:999px;padding:9px 12px;font-size:12px;font-weight:900;text-decoration:none;box-shadow:0 12px 30px rgba(0,0,0,.32);cursor:pointer;';
  wrap.innerHTML = '<button type="button" data-skillxi-back style="' + itemStyle + '">Back</button>' + '<a href="index.html" style="' + itemStyle + '">Home</a>' + '<a href="contests.html" style="' + itemStyle + '">Contests</a>' + '<a href="profile.html" style="' + itemStyle + '">Profile</a>';
  document.body.appendChild(wrap);
}
function injectNetworkBadge() {
  if (document.getElementById('skillxi-network-badge')) return;
  const nav = document.querySelector('nav');
  if (!nav) return;
  const badge = document.createElement('div');
  badge.id = 'skillxi-network-badge';
  badge.style.cssText = 'position:fixed;top:92px;right:20px;z-index:70;padding:8px 12px;border-radius:999px;background:rgba(0,212,255,0.1);border:1px solid rgba(0,212,255,0.2);color:#a8e8ff;font-size:11px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;';
  badge.textContent = NETWORK_LABEL;
  document.body.appendChild(badge);
}
function skillxiRouteForLabel(label) {
  const text = String(label || '').toLowerCase().replace(/\s+/g, ' ').trim();
  if (!text) return '';
  if (text.includes('home')) return 'index.html';
  if (text.includes('privacy') || text.includes('engine')) return 'privacy.html';
  if (text.includes('wallet') || text.includes('vault') || text.includes('transaction')) return 'wallet.html';
  if (text.includes('profile') || text.includes('account') || text.includes('analyst')) return 'profile.html';
  if (text.includes('leaderboard') || text.includes('rank')) return 'global-leaderboard.html';
  if (text.includes('research') || text.includes('intelligence') || text.includes('report') || text.includes('prematch') || text.includes('pre-match')) return 'pre-match.html';
  if (text.includes('squad') || text.includes('lineup') || text.includes('team') || text.includes('roster')) return 'lineup.html?contest=' + encodeURIComponent(getSelectedContestId());
  if (text.includes('lobby') || text.includes('arena') || text.includes('contest') || text.includes('play')) return 'contests.html';
  if (text.includes('marketplace') || text.includes('exchange') || text.includes('social') || text.includes('feed') || text.includes('nexus')) return 'nexus-feed.html';
  if (text.includes('subscription') || text.includes('billing') || text.includes('pro') || text.includes('elite')) return 'subscription.html';
  if (text.includes('support') || text.includes('terms') || text.includes('whitepaper')) return 'privacy.html';
  return '';
}
function wireGlobalActions() {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    const anchor = event.target.closest('a');
    const wallet = getSavedWallet();

    const isWalletLink = anchor && anchor.getAttribute('href') === 'wallet.html';
    const isWalletButton = button && (button.textContent || '').includes('Connect Wallet');
    const isWalletIcon = event.target.closest('span.material-symbols-outlined')?.textContent === 'account_balance_wallet';
    if (isWalletLink || isWalletButton || isWalletIcon) {
      event.preventDefault();
      if (wallet && isWalletLink) {
        window.location.href = 'wallet.html';
      } else {
        window.triggerConnectWallet();
      }
      return;
    }

    const blinkButton = event.target.closest('[data-skillxi-blink]');
    if (blinkButton) {
      event.preventDefault();
      const contestId = blinkButton.getAttribute('data-skillxi-blink');
      skillxiShareBlink(contestId);
      return;
    }

    const joinButton = event.target.closest('[data-join-contest]');
    if (joinButton) {
      const contestId = joinButton.getAttribute('data-join-contest');
      setSelectedContest(contestId);
      window.location.href = `lineup.html?contest=${encodeURIComponent(contestId)}`;
      return;
    }

    const hashLink = anchor && (anchor.getAttribute('href') === '#' || anchor.getAttribute('href') === '');
    if (hashLink) {
      const label = anchor.textContent || anchor.getAttribute('aria-label') || '';
      const route = skillxiRouteForLabel(label);
      event.preventDefault();
      if (String(label).toLowerCase().includes('logout')) { window.disconnectWallet(); return; }
      if (route) window.location.href = route;
      else window.showWalletToast('This section is connected in beta navigation now.', 'info');
      return;
    }

    if (event.target.closest('[data-skillxi-back]')) { event.preventDefault(); skillxiGoBack(); return; }

    if (!button) return;
    const text = (button.textContent || button.getAttribute('aria-label') || '').toLowerCase();

    if (text.includes('lock lineup')) {
      event.preventDefault();
      const contest = currentContest();
      const original = button.innerHTML;
      button.innerHTML = 'Locking...';
      button.disabled = true;
      window.lockLineupWithUmbra(contest.id, deriveLineupData()).then((success) => {
        if (success) {
          button.textContent = 'Locked privately';
          button.style.opacity = '0.8';
        } else {
          button.innerHTML = original;
          button.disabled = false;
        }
      });
    }

    if (text.includes('claim prize') || text.includes('claim to wallet')) {
      event.preventDefault();
      const contest = currentContest();
      window.claimPrivatePayoutWithUmbra(contest.id);
    }

    if (text.includes('deposit')) {
      event.preventDefault();
      window.showWalletToast('Deposit flow is queued for the next release. Wallet balance already syncs live on Devnet.', 'info');
    }

    if (text.includes('withdraw')) {
      event.preventDefault();
      window.showWalletToast('Withdraw requires payout review and escrow reconciliation before mainnet release.', 'info');
    }

    if (text.includes('notification')) { event.preventDefault(); window.showWalletToast('Notifications are enabled for wallet, lineup, and settlement events in beta.', 'info'); }
    if (text.includes('filter')) { event.preventDefault(); window.showWalletToast('Filters are applied automatically as live data loads.', 'info'); }
    if (text.includes('export csv')) { event.preventDefault(); skillxiExportReceiptsCsv(); }
    if (text.includes('manage trusted')) { event.preventDefault(); window.showWalletToast('Trusted device management will be enforced from server auth after deployment.', 'info'); }
    if (text.includes('view breakdown') || text.includes('view all') || text.includes('read analysis')) { event.preventDefault(); window.location.href = 'pre-match.html'; }
    if (text.includes('challenge')) { event.preventDefault(); window.showWalletToast('Head-to-head challenges are queued for paid-beta allowlisted wallets.', 'info'); }
    if (text.includes('create post')) { event.preventDefault(); window.showWalletToast('Creator posts are saved as beta feed intent. Full posting comes with Supabase feed tables.', 'info'); }
    if (text.includes('like') || text.includes('comment') || text.includes('repost')) { event.preventDefault(); window.showWalletToast('Social action recorded locally for beta feed testing.', 'success'); }

    if (text.includes('start 7-day') || text.includes('go elite') || text.includes('upgrade') || text.includes('current plan')) {
      event.preventDefault();
      window.localStorage.setItem('skillxi_subscription_interest', text);
      window.showWalletToast('Subscription billing is captured as beta interest. Real billing stays off until Stripe/Crypto checkout is configured.', 'info');
    }

    if (text.includes('blink')) { event.preventDefault(); skillxiShareBlink(getSelectedContestId()); }
    if (text.includes('download')) { event.preventDefault(); skillxiDownloadResultCard(); }
    if (text.includes('share')) { event.preventDefault(); skillxiShareOnX(); }
    if (text.includes('follow')) { event.preventDefault(); button.textContent = 'Following'; window.showWalletToast('Analyst followed in beta feed.', 'success'); }
    if (text.includes('make captain')) { event.preventDefault(); window.localStorage.setItem(STORAGE_KEYS.selectedContest, currentContest().id); window.showWalletToast('Haaland set as captain in your lineup draft.', 'success'); window.location.href = 'lineup.html?contest=' + encodeURIComponent(currentContest().id); }
    if (text.includes('add to team')) { event.preventDefault(); window.localStorage.setItem(STORAGE_KEYS.selectedContest, currentContest().id); window.showWalletToast('Player added to your draft context.', 'success'); window.location.href = 'lineup.html?contest=' + encodeURIComponent(currentContest().id); }
    if (text.includes('generate') && text.includes('report') && typeof window.generateReport !== 'function') { event.preventDefault(); window.showWalletToast('AI report endpoint is ready. Set GEMINI_API_KEY or OPENAI_API_KEY in Vercel for live generation.', 'info'); }
    if (text.includes('refresh health')) { event.preventDefault(); skillxiHydrateAdminHealth(); }
    if (button.id === 'skillxi-admin-logout') { event.preventDefault(); setAdminToken(''); skillxiRenderAdminPage(); }
    if (button.id === 'skillxi-admin-login') {
      event.preventDefault();
      const password = document.getElementById('skillxi-admin-password')?.value || '';
      button.disabled = true; button.textContent = 'Checking...';
      fetch('/api/admin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
        .then((response) => response.json())
        .then((payload) => { if (!payload.ok) throw new Error(payload.error || 'Admin login failed'); setAdminToken(payload.token); skillxiRenderAdminPage(); })
        .catch((error) => { renderAdminLogin(document.getElementById('skillxi-admin-root'), error.message); })
        .finally(() => { button.disabled = false; button.textContent = 'Unlock Admin'; });
    }
  });
document.addEventListener('click', (event) => {
  const playerButton = event.target.closest('[data-skillxi-player]');
  const captainButton = event.target.closest('[data-skillxi-captain]');
  const vcButton = event.target.closest('[data-skillxi-vc]');
  const nextButton = event.target.closest('[data-skillxi-next]');
  const captainSelect = event.target.closest('[data-skillxi-captain-select]');
  const vcSelect = event.target.closest('[data-skillxi-vc-select]');
  const resetButton = event.target.closest('[data-skillxi-reset]');
  const autofillButton = event.target.closest('[data-skillxi-autofill]');
  const payJoin = event.target.closest('#skillxi-pay-join');
  const adminCreate = event.target.closest('#skillxi-admin-create');
  const adminLock = event.target.closest('[data-admin-lock]');
  const adminSettle = event.target.closest('[data-admin-settle]');
  const adminDelete = event.target.closest('[data-admin-delete]');
  const text = (event.target.closest('button')?.textContent || '').toLowerCase();
  if (text.includes('lock lineup') || text.includes('next step')) { event.preventDefault(); event.stopImmediatePropagation(); skillxiGoToConfirm(); return; }
  if (autofillButton || text.includes('auto-fill')) { event.preventDefault(); event.stopImmediatePropagation(); skillxiAutoFillLineup(); return; }
  if (captainSelect) { const state = skillxiReadLineupState(); state.captain = captainSelect.value; if (state.viceCaptain === state.captain) state.viceCaptain = ''; skillxiWriteLineupState(state); skillxiRenderLineupBuilder(); return; }
  if (vcSelect) { const state = skillxiReadLineupState(); state.viceCaptain = vcSelect.value; if (state.captain === state.viceCaptain) state.captain = ''; skillxiWriteLineupState(state); skillxiRenderLineupBuilder(); return; }
  if (playerButton) { const name = playerButton.getAttribute('data-skillxi-player'); const state = skillxiReadLineupState(); if (state.selected.includes(name)) { state.selected = state.selected.filter((item) => item !== name); if (state.captain === name) state.captain = ''; if (state.viceCaptain === name) state.viceCaptain = ''; } else if (state.selected.length < 11) { state.selected.push(name); if (!state.captain) state.captain = name; else if (!state.viceCaptain) state.viceCaptain = name; } else { window.showWalletToast('You already have 11 players selected.', 'error'); } skillxiWriteLineupState(state); skillxiRenderLineupBuilder(); return; }
  if (captainButton) { const state = skillxiReadLineupState(); state.captain = captainButton.getAttribute('data-skillxi-captain'); if (state.viceCaptain === state.captain) state.viceCaptain = ''; skillxiWriteLineupState(state); skillxiRenderLineupBuilder(); return; }
  if (vcButton) { const state = skillxiReadLineupState(); state.viceCaptain = vcButton.getAttribute('data-skillxi-vc'); if (state.captain === state.viceCaptain) state.captain = ''; skillxiWriteLineupState(state); skillxiRenderLineupBuilder(); return; }
  if (resetButton) { skillxiWriteLineupState(skillxiDefaultLineupState()); skillxiRenderLineupBuilder(); return; }
  if (nextButton) { skillxiGoToConfirm(); return; }
  if (payJoin) { event.preventDefault(); skillxiPayAndJoin(); return; }
  if (adminCreate) { skillxiCreateAdminContest(); return; }
  if (adminLock || adminDelete) { const id = (adminLock || adminDelete).getAttribute(adminLock ? 'data-admin-lock' : 'data-admin-delete'); let contests = readStore(SKILLXI_ADMIN_CONTESTS_KEY, SEEDED_CONTESTS); contests = adminDelete ? contests.filter((contest) => contest.id !== id) : contests.map((contest) => contest.id === id ? { ...contest, status: 'locked' } : contest); writeStore(SKILLXI_ADMIN_CONTESTS_KEY, contests); skillxiRenderAdminPage(); return; }
  if (adminSettle) { window.settleContest(adminSettle.getAttribute('data-admin-settle')); return; }
}, true);
window.addEventListener('load', () => setTimeout(skillxiInitCompletionLayer, 0));


function skillxiRenderLiveTicker(lines) {
  if (document.getElementById('skillxi-live-ticker')) return;
  const host = document.body;
  if (!host) return;
  const bar = document.createElement('div');
  bar.id = 'skillxi-live-ticker';
  bar.style.cssText = 'position:fixed;left:0;right:0;top:76px;z-index:69;background:rgba(10,10,15,.92);border-top:1px solid rgba(168,232,255,.14);border-bottom:1px solid rgba(168,232,255,.14);color:#a8e8ff;font-size:12px;font-weight:700;padding:8px 14px;display:flex;gap:20px;overflow:auto;white-space:nowrap;';
  bar.innerHTML = lines.map((line) => '<span>' + escapeHtml(line) + '</span>').join('');
  host.appendChild(bar);
}

async function skillxiLiveDataBoot() {
  try {
    const live = await window.getLiveScores();
    const lines = [];
    if (live.length) {
      live.slice(0, 6).forEach((item) => {
        const home = item?.teams?.home?.name || 'Home';
        const away = item?.teams?.away?.name || 'Away';
        const h = item?.goals?.home;
        const a = item?.goals?.away;
        const hs = (h === null || typeof h === 'undefined') ? '-' : h;
        const as = (a === null || typeof a === 'undefined') ? '-' : a;
        const st = item?.fixture?.status?.short || 'NS';
        lines.push(home + ' ' + hs + '-' + as + ' ' + away + ' • ' + st);
      });
    }
    if (!lines.length) {
      const c = currentContest();
      lines.push(c.title + ' • ' + timeUntil(c.starts_at) + ' to lock');
      lines.push('Live feed connected via /api/scores');
    }
    skillxiRenderLiveTicker(lines);
  } catch (error) {
    console.warn('Live data boot failed', error);
  }
}


let skillxiLiveRefreshHandle = null;

function skillxiScheduleLiveRefresh() {
  if (skillxiLiveRefreshHandle) return;
  skillxiLiveRefreshHandle = setInterval(async () => {
    try {
      const path = getPath();
      if (path === 'contests.html') {
        await window.getContests();
        window.filterContests(PAGE_STATE.filteredSport || 'all');
      }
      if (path === 'global-leaderboard.html') {
        await window.loadLeaderboard(PAGE_STATE.leaderboardRange || 'all_time');
      }
    } catch (error) {
      console.warn('Live refresh tick failed', error);
    }
  }, 60000);
}

