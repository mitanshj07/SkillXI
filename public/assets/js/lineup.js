function deriveLineupData() {
  const contest = currentContest();
  const base = contest?.entry_mode === 'paid_beta' ? ALT_LINEUP : DEFAULT_LINEUP;
  return {
    ...base,
    contest_id: contest.id,
    contest_title: contest.title,
    projected_points: calculateProjectedPoints(base)
  };
}
function calculateProjectedPoints(lineup) {
  return Math.round(lineup.players.reduce((sum, player) => sum + player.rating * 11, 0));
}
function calculateFinalPoints(lineup) {
  return lineup.players.reduce((sum, player) => {
    let points = Math.round(player.rating * 10);
    if (player.name === lineup.captain) points *= 2;
    if (player.name === lineup.viceCaptain) points += 12;
    if (player.position === 'DEF') points += 6;
    if (player.position === 'MID') points += 4;
    if (player.position === 'FWD') points += 7;
    return sum + points;
  }, 0);
}
function updateLocalEntry(entry) {
  const entries = getLocalEntries();
  const index = entries.findIndex((item) => item.id === entry.id);
  if (index >= 0) {
    entries[index] = entry;
  } else {
    entries.unshift(entry);
  }
  saveLocalEntries(entries);
}
window.lockLineupWithUmbra = async function lockLineupWithUmbra(contestId, lineupData) {
  const wallet = getSavedWallet();
  if (!wallet) {
    window.showWalletToast('Connect your wallet before locking a lineup.', 'error');
    return false;
  }

  const contest = getContestById(contestId) || currentContest();
  return new Promise((resolve) => {
    window.showPaymentStatement(contest, async () => {
      let txSignature = '';
      const guard = await evaluateJoinGuard(wallet, contest);
      if (contest.entry_amount > 0) {
        txSignature = await executeEscrowPayment(contest.entry_amount);
      }
      const privacyEnvelope = await encryptLineupForStorage(wallet, lineupData);
      const entry = {
        id: `entry-${Math.random().toString(36).slice(2, 10)}`,
        contest_id: contest.id,
        user_id: wallet,
        contest_title: contest.title,
        lineup_data: lineupData,
        ...privacyEnvelope,
        tx_signature: txSignature,
        privacy_mode: contest.lineup_visibility || 'hidden_until_reveal',
        lineup_reveal_at: contest.starts_at,
        compliance_status: 'passed',
        risk_status: guard?.checks?.paid ? 'paid_beta_checked' : 'free_checked',
        escrow_address: ESCROW_ADDRESS,
        escrow_network: NETWORK_LABEL,
        points_final: null,
        settlement_status: 'pending',
        payout_tx: null,
        payout_amount: 0,
        created_at: new Date().toISOString()
      };

      updateLocalEntry(entry);
      await tryInsertEntry(entry);

      const receipts = getReceipts();
      receipts.unshift(makeTransactionReceipt({
        type: contest.entry_amount > 0 ? 'Entry fee' : 'Contest lock',
        amount: contest.entry_amount > 0 ? -contest.entry_amount : 0,
        status: 'Success',
        contestTitle: contest.title,
        txSignature,
        createdAt: entry.created_at
      }));
      saveReceipts(receipts);

      window.updatePrivacyBadges(true);
      window.showWalletToast(
        contest.entry_amount > 0 ? 'Lineup locked and beta payment recorded.' : 'Lineup locked.',
        'success',
        txSignature ? `https://explorer.solana.com/tx/${txSignature}?cluster=devnet` : null
      );
      syncWalletPage();
      syncProfilePage();
      resolve(true);
    });
  });
};
window.claimPrivatePayoutWithUmbra = async function claimPrivatePayoutWithUmbra(contestId) {
  const wallet = getSavedWallet();
  if (!wallet) {
    window.showWalletToast('Connect wallet before claiming.', 'error');
    return;
  }

  const entries = getLocalEntries();
  const entry = entries.find((item) => item.contest_id === contestId && item.user_id === wallet) || entries.find((item) => item.user_id === wallet);
  if (!entry) {
    window.showWalletToast('No entry found for this wallet yet.', 'error');
    return;
  }

  const contest = getContestById(entry.contest_id) || currentContest();
  let fixture = null;
  if (contest.fixture_id && /^\d+$/.test(contest.fixture_id)) {
    fixture = await fetchMatchWithLimit(contest.fixture_id);
  }

  const entryAgeMs = Date.now() - new Date(entry.created_at || Date.now()).getTime();
  const demoSettlementReady = entryAgeMs > 60000;
  const isFinished = contest.status === 'completed' || contest.status === 'settled' || fixture?.fixture?.status?.short === 'FT' || demoSettlementReady;
  if (!isFinished) {
    window.showWalletToast('Contest is not settled yet. Try again after kickoff settles.', 'info');
    return;
  }

  const finalPoints = calculateFinalPoints(entry.lineup_data || DEFAULT_LINEUP);
  const payoutAmount = contest.entry_mode === 'paid_beta' ? Number((contest.entry_amount * 4.2).toFixed(2)) : 0;
  const payoutTx = payoutAmount > 0 ? `beta-payout-${Math.random().toString(36).slice(2, 10)}` : null;
  const updatedEntry = {
    ...entry,
    points_final: finalPoints,
    settlement_status: 'settled',
    payout_tx: payoutTx,
    payout_amount: payoutAmount
  };
  updateLocalEntry(updatedEntry);

  const receipts = getReceipts();
  receipts.unshift(makeTransactionReceipt({
    type: payoutAmount > 0 ? 'Contest payout' : 'Contest settled',
    amount: payoutAmount,
    status: 'Success',
    contestTitle: contest.title,
    payoutTx,
    createdAt: new Date().toISOString()
  }));
  saveReceipts(receipts);

  window.updatePrivacyBadges(true, true);
  window.showWalletToast(
    payoutAmount > 0 ? `Contest settled. ${formatSol(payoutAmount)} ready in beta payout history.` : `Contest settled with ${finalPoints} fantasy points.`,
    'success',
    payoutTx ? `https://explorer.solana.com/address/${ESCROW_ADDRESS}?cluster=devnet` : null
  );
  syncWalletPage();
  syncProfilePage();
  skillxiLiveDataBoot();
  skillxiScheduleLiveRefresh();
};
window.updatePrivacyBadges = function updatePrivacyBadges(isLocked = false, isClaimed = false) {
  document.querySelectorAll('.umbra-badge, #umbra-notice').forEach((node) => {
    if (isClaimed) {
      node.innerHTML = '<span style="color:#00ff88;font-weight:700;">Private lineup reveal complete</span>';
      return;
    }
    if (isLocked) {
      node.innerHTML = '<span style="color:#00ff88;font-weight:700;">Hidden until reveal</span>';
    }
  });
};
function hydrateLineupHeader() {
  const contest = currentContest();
  const h1 = document.querySelector('h1.text-xl.font-headline.font-bold.text-on-surface');
  if (h1) {
    h1.textContent = `${contest.title} · ${contest.league}`;
  }

  const timeNode = document.querySelector('.material-symbols-outlined.text-sm + span');
  if (timeNode) {
    timeNode.textContent = `Locks in ${timeUntil(contest.starts_at)}`;
  }

  const privacyTitle = Array.from(document.querySelectorAll('div')).find((node) => node.textContent?.trim() === 'UMBRA PRIVACY ENABLED');
  if (privacyTitle) {
    privacyTitle.textContent = 'PRIVATE LINEUP BETA';
    privacyTitle.style.color = '#a8e8ff';
  }

  const privacyBody = Array.from(document.querySelectorAll('div')).find((node) => (node.textContent || '').includes('legacy stealth privacy copy'));
  if (privacyBody) {
    privacyBody.textContent = 'SkillXI beta hides your lineup until reveal where available. Entry payments currently use standard wallet signatures on Solana Devnet.';
  }

  const aiBadge = Array.from(document.querySelectorAll('p')).find((node) => (node.textContent || '').includes('Powered by Gemini AI'));
  if (aiBadge) {
    aiBadge.textContent = 'Powered by live contest context · Beta';
  }
}
function renderLineupResult(title, body, listItems = []) {
  const loading = document.getElementById('ai-lineup-loading');
  const result = document.getElementById('ai-lineup-result');
  if (!result) return;
  if (loading) loading.style.display = 'none';
  result.style.display = 'block';
  result.innerHTML = `
    <div style="background:#13131f;border:1px solid #1e1e30;border-radius:16px;padding:18px;">
      <h3 style="margin:0 0 8px;color:#fff;font-size:18px;font-weight:800;">${escapeHtml(title)}</h3>
      <p style="margin:0;color:#a0a0b8;font-size:14px;line-height:1.7;">${escapeHtml(body)}</p>
      ${listItems.length ? `<ul style="margin:14px 0 0;padding-left:18px;color:#d7d7e4;font-size:13px;line-height:1.8;">${listItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : ''}
    </div>
  `;
}
window.generateAILineup = async function generateAILineup() {
  const loading = document.getElementById('ai-lineup-loading');
  const contest = currentContest();
  if (loading) loading.style.display = 'block';
  window.setTimeout(() => {
    renderLineupResult(
      'Suggested lineup',
      `For ${contest.title}, the model is leaning toward a safer possession-heavy core with Haaland as captain and Saka as vice-captain.`,
      [
        'Core stack: Haaland, De Bruyne, Rodri',
        'Best Arsenal bring-back: Saka or Odegaard',
        'Risk-managed defender pair: Saliba + Ruben Dias'
      ]
    );
  }, 350);
};
window.askCaptain = function askCaptain() {
  const lineup = deriveLineupData();
  renderLineupResult(
    'Captain recommendation',
    `${lineup.captain} remains the strongest captain because of shot volume, penalty equity, and the highest median fantasy floor in this slate.`,
    [
      `${lineup.captain}: best floor + ceiling`,
      `${lineup.viceCaptain}: safer leverage if you want lower ownership`,
      'If chasing rank, switch captain to De Bruyne in large-field contests'
    ]
  );
};
window.findDifferentials = function findDifferentials() {
  renderLineupResult(
    'Differential targets',
    'These are the lower-owned plays with realistic upside if the match stays tactical rather than turning into a pure striker slate.',
    [
      'Ben White: crossing volume + clean-sheet route',
      'Declan Rice: minutes safety and all-around stat floor',
      'Josko Gvardiol: attacking overlap upside from defense'
    ]
  );
};
function skillxiDefaultLineupState() {
  return { contestId: getSelectedContestId(), selected: [], captain: '', viceCaptain: '', formation: '4-3-3', savedAt: null };
}
function skillxiReadLineupState() {
  const stored = readStore(SKILLXI_LINEUP_KEY, null);
  if (!stored || stored.contestId !== getSelectedContestId()) return skillxiDefaultLineupState();
  return { ...skillxiDefaultLineupState(), ...stored };
}
function skillxiWriteLineupState(state) {
  writeStore(SKILLXI_LINEUP_KEY, { ...state, contestId: getSelectedContestId(), savedAt: new Date().toISOString() });
}
function skillxiPlayersByName(names) {
  return names.map((name) => SKILLXI_PLAYERS.find((player) => player.name === name)).filter(Boolean);
}
function skillxiLineupPayload() {
  const state = skillxiReadLineupState();
  const selectedPlayers = skillxiPlayersByName(state.selected);
  const contest = currentContest();
  const players = selectedPlayers.length ? selectedPlayers : DEFAULT_LINEUP.players;
  return { formation: state.formation || '4-3-3', captain: state.captain || players[0]?.name || 'Erling Haaland', viceCaptain: state.viceCaptain || players[1]?.name || 'Bukayo Saka', players, contest_id: contest.id, contest_title: contest.title, projected_points: Math.round(players.reduce((sum, player) => sum + (player.projection || player.rating * 10), 0)) };
}
function skillxiLineupCost(state) {
  return skillxiPlayersByName(state.selected).reduce((sum, player) => sum + Number(player.credits || 0), 0);
}
function skillxiPositionCounts(state) {
  return skillxiPlayersByName(state.selected).reduce((counts, player) => { counts[player.position] = (counts[player.position] || 0) + 1; return counts; }, { GK: 0, DEF: 0, MID: 0, FWD: 0 });
}
function skillxiValidateLineup(state) {
  const players = skillxiPlayersByName(state.selected);
  const counts = skillxiPositionCounts(state);
  const cost = skillxiLineupCost(state);
  const errors = [];
  if (players.length !== 11) errors.push('Select exactly 11 players.');
  if (cost > 100) errors.push('Stay inside the 100 credit budget.');
  if (counts.GK < 1) errors.push('Pick at least one goalkeeper.');
  if (counts.DEF < 3) errors.push('Pick at least three defenders.');
  if (counts.MID < 3) errors.push('Pick at least three midfielders.');
  if (counts.FWD < 1) errors.push('Pick at least one forward.');
  if (!state.captain) errors.push('Choose a captain.');
  if (!state.viceCaptain) errors.push('Choose a vice-captain.');
  if (state.captain && state.captain === state.viceCaptain) errors.push('Captain and vice-captain must be different.');
  return errors;
}
function skillxiAutoFillLineup() {
  const selected = DEFAULT_LINEUP.players.map((player) => player.name);
  skillxiWriteLineupState({ ...skillxiDefaultLineupState(), selected, captain: 'Erling Haaland', viceCaptain: 'Bukayo Saka' });
  skillxiRenderLineupBuilder();
  window.showWalletToast('AI auto-filled a legal 11-player team.', 'success');
}
function skillxiRenderLineupBuilder() {
  if (getPath() !== 'lineup.html') return;
  const existing = document.getElementById('skillxi-lineup-builder');
  const state = skillxiReadLineupState();
  const cost = skillxiLineupCost(state);
  const counts = skillxiPositionCounts(state);
  const selectedPlayers = skillxiPlayersByName(state.selected);
  const contest = currentContest();
  const selectedOptions = selectedPlayers.map((player) => '<option value="' + escapeHtml(player.name) + '">' + escapeHtml(player.name) + ' - ' + escapeHtml(player.team) + ' ' + escapeHtml(player.position) + '</option>').join('');
  const captainOptions = selectedOptions.replace('value="' + escapeHtml(state.captain) + '"', 'value="' + escapeHtml(state.captain) + '" selected');
  const vcOptions = selectedOptions.replace('value="' + escapeHtml(state.viceCaptain) + '"', 'value="' + escapeHtml(state.viceCaptain) + '" selected');
  const lineupSummary = selectedPlayers.length ? selectedPlayers.map((player, index) => '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;background:#10101a;border:1px solid #242438;border-radius:12px;padding:10px 12px;"><span style="color:#fff;font-size:13px;font-weight:800;">' + (index + 1) + '. ' + escapeHtml(player.name) + '</span><span style="color:#a0a0b8;font-size:12px;">' + escapeHtml(player.position) + ' &bull; ' + player.credits + ' Cr' + (state.captain === player.name ? ' &bull; C' : '') + (state.viceCaptain === player.name ? ' &bull; VC' : '') + '</span></div>').join('') : '<p style="margin:0;color:#a0a0b8;font-size:13px;line-height:1.6;">Add players from the pool. Your match lineup appears here, then choose captain and vice captain separately.</p>';
  const lineupControls = '<aside data-skillxi-match-lineup style="background:#13131f;border:1px solid #242438;border-radius:16px;padding:16px;display:grid;gap:14px;align-self:start;"><div><p style="margin:0;color:#a8e8ff;font-size:11px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;">Your Match Lineup</p><h3 style="margin:6px 0 0;color:#fff;font-size:18px;">Selected XI, Captain, Vice</h3></div><div style="display:grid;gap:8px;max-height:285px;overflow:auto;">' + lineupSummary + '</div><label style="display:grid;gap:8px;color:#ffd166;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;">Captain (2x points)<select data-skillxi-captain-select ' + (selectedPlayers.length ? '' : 'disabled') + ' style="width:100%;background:#0d0d14;color:#fff;border:1px solid #35354a;border-radius:12px;padding:12px;font-weight:800;"><option value="">Select captain</option>' + captainOptions + '</select></label><label style="display:grid;gap:8px;color:#d2bbff;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;">Vice Captain (1.5x points)<select data-skillxi-vc-select ' + (selectedPlayers.length ? '' : 'disabled') + ' style="width:100%;background:#0d0d14;color:#fff;border:1px solid #35354a;border-radius:12px;padding:12px;font-weight:800;"><option value="">Select vice captain</option>' + vcOptions + '</select></label></aside>';
  const cards = SKILLXI_PLAYERS.map((player) => {
    const selected = state.selected.includes(player.name);
    const isCaptain = state.captain === player.name;
    const isVc = state.viceCaptain === player.name;
    return `
      <article style="background:${selected ? 'rgba(0,255,136,.08)' : '#13131f'};border:1px solid ${selected ? 'rgba(0,255,136,.35)' : '#242438'};border-radius:14px;padding:14px;display:grid;gap:10px;">
        <div style="display:flex;justify-content:space-between;gap:10px;"><div><h3 style="margin:0;color:#fff;font-size:15px;font-weight:800;">${escapeHtml(player.name)}</h3><p style="margin:4px 0 0;color:#a0a0b8;font-size:12px;">${player.team} • ${player.position} • ${player.credits} Cr</p></div><div style="text-align:right;color:#a8e8ff;font-size:12px;font-weight:800;">AI ${player.rating}</div></div>
        <div style="display:flex;gap:8px;align-items:center;"><button data-skillxi-player="${escapeHtml(player.name)}" style="flex:1;border:none;border-radius:10px;padding:9px 10px;background:${selected ? '#ff6b6b' : 'linear-gradient(135deg,#00d4ff,#00ff88)'};color:${selected ? '#fff' : '#07121a'};font-weight:800;cursor:pointer;">${selected ? 'Remove' : 'Add'}</button><button data-skillxi-captain="${escapeHtml(player.name)}" ${selected ? '' : 'disabled'} style="border:1px solid ${isCaptain ? '#ffd166' : '#35354a'};border-radius:10px;padding:9px 10px;background:${isCaptain ? '#ffd166' : '#0d0d14'};color:${isCaptain ? '#111' : '#ffd166'};font-weight:900;cursor:${selected ? 'pointer' : 'not-allowed'};opacity:${selected ? 1 : .35};">C</button><button data-skillxi-vc="${escapeHtml(player.name)}" ${selected ? '' : 'disabled'} style="border:1px solid ${isVc ? '#d2bbff' : '#35354a'};border-radius:10px;padding:9px 10px;background:${isVc ? '#d2bbff' : '#0d0d14'};color:${isVc ? '#111' : '#d2bbff'};font-weight:900;cursor:${selected ? 'pointer' : 'not-allowed'};opacity:${selected ? 1 : .35};">VC</button></div>
      </article>`;
  }).join('');
  const builderHtml = `
    <section id="skillxi-lineup-builder" style="background:#0f0f1a;border:1px solid #1e1e30;border-radius:18px;padding:20px;margin:0 0 24px;">
      <div style="display:flex;justify-content:space-between;gap:16px;align-items:flex-start;flex-wrap:wrap;margin-bottom:16px;"><div><p style="margin:0;color:#a8e8ff;font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;">Selectable Player Pool</p><h2 style="margin:6px 0 0;color:#fff;font-size:22px;font-weight:900;font-family:'Space Grotesk',sans-serif;">${escapeHtml(contest.title)}</h2></div><div style="display:flex;gap:10px;flex-wrap:wrap;"><div style="background:#13131f;border:1px solid #2a2a40;border-radius:12px;padding:10px 12px;color:#fff;font-weight:800;">${selectedPlayers.length}/11 selected</div><div style="background:#13131f;border:1px solid ${cost > 100 ? '#ff6b6b' : '#2a2a40'};border-radius:12px;padding:10px 12px;color:${cost > 100 ? '#ff6b6b' : '#00ff88'};font-weight:800;">${cost.toFixed(1)} / 100 Cr</div></div></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;color:#a0a0b8;font-size:12px;"><span>GK ${counts.GK}</span><span>DEF ${counts.DEF}</span><span>MID ${counts.MID}</span><span>FWD ${counts.FWD}</span></div>
      <div style="display:grid;grid-template-columns:minmax(260px,.85fr) minmax(300px,1.15fr);gap:16px;align-items:start;">${lineupControls}<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;max-height:580px;overflow:auto;padding-right:4px;">${cards}</div></div>
      <div id="skillxi-lineup-errors" style="color:#ffb4ab;font-size:13px;line-height:1.6;margin-top:14px;"></div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:16px;"><button data-skillxi-autofill style="background:#7c3aed;color:#fff;border:none;border-radius:12px;padding:12px 16px;font-weight:800;cursor:pointer;">AI Auto-Fill Team</button><button data-skillxi-reset style="background:#1f1f2e;color:#a0a0b8;border:1px solid #35354a;border-radius:12px;padding:12px 16px;font-weight:800;cursor:pointer;">Reset Team</button><button data-skillxi-next style="margin-left:auto;background:linear-gradient(135deg,#00ff88,#00d4ff);color:#061118;border:none;border-radius:12px;padding:12px 20px;font-weight:900;cursor:pointer;">Next Step: Review & Pay</button></div>
    </section>`;
  if (existing) { existing.outerHTML = builderHtml; return; }
  const target = Array.from(document.querySelectorAll('div')).find((node) => (node.textContent || '').includes('Lock Lineup'));
  const section = target?.closest('.flex.flex-wrap') || document.querySelector('section.w-full.md\\:w-\\[60\\%\\]');
  if (section?.insertAdjacentHTML) section.insertAdjacentHTML(section.classList?.contains('flex-wrap') ? 'afterend' : 'afterbegin', builderHtml);
}
function skillxiGoToConfirm() {
  const state = skillxiReadLineupState();
  const errors = skillxiValidateLineup(state);
  const errorNode = document.getElementById('skillxi-lineup-errors');
  if (errors.length) { if (errorNode) errorNode.innerHTML = errors.map((error) => `<div>${escapeHtml(error)}</div>`).join(''); window.showWalletToast(errors[0], 'error'); return; }
  skillxiWriteLineupState(state);
  window.location.href = `contest-confirm.html?contest=${encodeURIComponent(getSelectedContestId())}`;
}
function skillxiRenderConfirmPage() {
  const root = document.getElementById('skillxi-confirm-root');
  if (!root) return;
  const contest = currentContest();
  const lineup = skillxiLineupPayload();
  root.innerHTML = `<section class="sx-shell"><div class="sx-header"><a href="contests.html" class="sx-logo">SkillXI</a><button onclick="connectWallet()" class="sx-wallet">${escapeHtml(shortWallet(getSavedWallet()))}</button></div><main class="sx-main"><div class="sx-copy"><p class="sx-kicker">Review & Pay</p><h1>${escapeHtml(contest.title)}</h1><p>${escapeHtml(contest.league)} • ${escapeHtml(formatDate(contest.starts_at))}</p></div><div class="sx-grid"><section class="sx-panel sx-team"><div class="sx-panel-head"><h2>Your XI</h2><span>${lineup.players.length}/11</span></div><div class="sx-player-grid">${lineup.players.map((player) => `<article><strong>${escapeHtml(player.name)}</strong><span>${escapeHtml(player.team)} • ${escapeHtml(player.position)} • ${player.credits} Cr</span>${lineup.captain === player.name ? '<b>C</b>' : lineup.viceCaptain === player.name ? '<b>VC</b>' : ''}</article>`).join('')}</div></section><aside class="sx-panel sx-pay"><p>Entry Fee</p><h2>${contest.entry_amount > 0 ? formatSol(contest.entry_amount) : 'Free'}</h2><div class="sx-row"><span>Prize pool</span><strong>${escapeHtml(contest.prize_pool)}</strong></div><div class="sx-row"><span>Projected points</span><strong>${lineup.projected_points}</strong></div><div class="sx-note">Private lineup beta: picks stay hidden until reveal. Paid entries use Solana Devnet wallet signatures where available. New: create a Solana Blink proof receipt without exposing your lineup.</div><button id="skillxi-pay-join">Pay & Join Contest</button><button data-skillxi-blink="${contest.id}" class="sx-secondary">Copy Contest Blink</button><button class="sx-secondary" onclick="location.href='lineup.html?contest=${encodeURIComponent(contest.id)}'">Edit lineup</button></aside></div></main></section>`;
}
async function skillxiPayAndJoin() {
  const contest = currentContest();
  const lineup = skillxiLineupPayload();
  const wallet = getSavedWallet();
  let txSignature = '';
  const payButton = document.getElementById('skillxi-pay-join');
  if (!wallet) {
    window.showWalletToast('Connect Phantom or Solflare before joining a contest.', 'error');
    if (typeof window.connectWallet === 'function') window.connectWallet();
    return;
  }
  if (payButton) { payButton.disabled = true; payButton.textContent = 'Joining...'; }
  try {
    await ensureUserExists(wallet);
    const guard = await evaluateJoinGuard(wallet, contest);
    if (contest.entry_amount > 0) txSignature = await executeEscrowPayment(contest.entry_amount);
    else await new Promise((resolve) => setTimeout(resolve, 700));
    const privacyEnvelope = await encryptLineupForStorage(wallet, lineup);
    const entry = { id: `entry-${Math.random().toString(36).slice(2, 10)}`, contest_id: contest.id, user_id: wallet, contest_title: contest.title, lineup_data: lineup, ...privacyEnvelope, tx_signature: txSignature, privacy_mode: contest.lineup_visibility || 'hidden_until_reveal', lineup_reveal_at: contest.starts_at, compliance_status: 'passed', risk_status: guard?.checks?.paid ? 'paid_beta_checked' : 'free_checked', escrow_address: ESCROW_ADDRESS, escrow_network: NETWORK_LABEL, points_final: null, settlement_status: 'pending', payout_tx: null, payout_amount: 0, created_at: new Date().toISOString() };
    updateLocalEntry(entry); await tryInsertEntry(entry);
    const receipts = getReceipts();
    receipts.unshift(makeTransactionReceipt({ type: contest.entry_amount > 0 ? 'Entry fee' : 'Free entry', amount: contest.entry_amount > 0 ? -contest.entry_amount : 0, status: 'Success', contestTitle: contest.title, txSignature, createdAt: entry.created_at }));
    saveReceipts(receipts);
    if (payButton) payButton.textContent = 'You are in!';
    window.showWalletToast('Contest joined. Redirecting to leaderboard.', 'success');
    setTimeout(() => { window.location.href = `leaderboard.html?contest=${encodeURIComponent(contest.id)}`; }, 900);
  } catch (error) { console.warn('Pay and join failed', error); if (payButton) { payButton.disabled = false; payButton.textContent = 'Pay & Join Contest'; } window.showWalletToast(error.message || 'Could not join contest.', 'error'); }
}
function skillxiRenderMatchLobby() {
  const root = document.getElementById('skillxi-match-lobby-root');
  if (!root) return;
  const contest = currentContest();
  const cards = [{ type: 'Mega Contest', size: '1200 players', prize: '150 Reputation', entry: 'Free', id: 'football-mci-ars-classic' }, { type: 'Head to Head', size: '2 players', prize: 'Winner takes all', entry: '0.05 SOL beta', id: 'football-mci-ars-beta' }, { type: 'Mini League', size: '64 players', prize: '2.4 SOL beta', entry: '0.15 SOL', id: 'football-mci-ars-beta' }];
  root.innerHTML = `<section class="sx-shell"><div class="sx-header"><a class="sx-logo" href="index.html">SkillXI</a><a class="sx-wallet" href="contests.html">Back to contests</a></div><main class="sx-main"><p class="sx-kicker">Match Lobby</p><h1>${escapeHtml(contest.title)}</h1><p>${escapeHtml(contest.league)} • Locks in ${escapeHtml(timeUntil(contest.starts_at))}</p><div class="sx-card-list">${cards.map((card) => `<article class="sx-panel"><p>${escapeHtml(card.type)}</p><h2>${escapeHtml(card.prize)}</h2><div class="sx-row"><span>${escapeHtml(card.size)}</span><strong>${escapeHtml(card.entry)}</strong></div><button onclick="localStorage.setItem('skillxi_selected_contest','${escapeHtml(card.id)}');location.href='lineup.html?contest=${escapeHtml(card.id)}'">Create Team</button></article>`).join('')}</div><div class="sx-note">AI insight: City possession stacks are safest; Arsenal attackers create the best leverage.</div></main></section>`;
}
function skillxiRenderNexusFallback() {
  if (getPath() !== 'nexus-feed.html' || document.getElementById('skillxi-nexus-fallback')) return;
  const header = Array.from(document.querySelectorAll('h1')).find((node) => (node.textContent || '').includes('NEXUS'));
  if (!header?.parentElement) return;
  header.parentElement.insertAdjacentHTML('afterend', `<section id="skillxi-nexus-fallback" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;margin:0 0 26px;">${SKILLXI_NEXUS_ACTIVITY.map((item) => `<article style="background:#13131f;border:1px solid #242438;border-left:3px solid ${item.tone};border-radius:14px;padding:16px;"><div style="font-size:24px;margin-bottom:8px;">${item.icon}</div><h3 style="margin:0;color:#fff;font-size:15px;font-weight:800;">${escapeHtml(item.title)}</h3><p style="margin:6px 0 0;color:#a0a0b8;font-size:13px;line-height:1.5;">${escapeHtml(item.detail)}</p></article>`).join('')}</section>`);
}
window.calculateEntryPoints = function calculateEntryPoints(lineup, matchEvents = SKILLXI_MATCH_EVENTS) {
  const players = Array.isArray(lineup) ? lineup : (lineup?.players || []);
  const captain = lineup?.captain || players.find((player) => player.isCaptain)?.name;
  const viceCaptain = lineup?.viceCaptain || lineup?.vc || players.find((player) => player.isVC)?.name;
  return Math.round(players.reduce((total, player) => {
    let points = 0;
    matchEvents.forEach((event) => { if (event.player !== player.name) return; if (event.type === 'goal') points += SKILLXI_SCORING[`goal_${String(player.position || player.pos || '').toLowerCase()}`] || 50; if (event.type === 'assist') points += SKILLXI_SCORING.assist; if (event.type === 'yellow') points += SKILLXI_SCORING.yellow_card; if (event.type === 'red') points += SKILLXI_SCORING.red_card; });
    points += SKILLXI_SCORING.minutes_played_60;
    if (player.name === captain) points *= 2;
    if (player.name === viceCaptain) points *= 1.5;
    return total + points;
  }, 0));
};
window.settleContest = async function settleContest(contestId = getSelectedContestId()) {
  const entries = getLocalEntries();
  const contestEntries = entries.filter((entry) => entry.contest_id === contestId);
  const targetEntries = contestEntries.length ? contestEntries : entries;
  if (!targetEntries.length) { window.showWalletToast('No entries to settle yet.', 'info'); return []; }
  const contest = getContestById(contestId) || currentContest();
  const ranked = targetEntries.map((entry) => ({ ...entry, points_final: window.calculateEntryPoints(entry.lineup_data || DEFAULT_LINEUP, SKILLXI_MATCH_EVENTS), settlement_status: 'settled' })).sort((a, b) => b.points_final - a.points_final).map((entry, index, all) => { const rank = index + 1; const winnerCount = Math.max(1, Math.ceil(all.length * 0.2)); const payoutAmount = rank <= winnerCount && contest.entry_amount > 0 ? Number((contest.entry_amount * Math.max(1.2, all.length / winnerCount)).toFixed(2)) : 0; return { ...entry, rank, payout_amount: payoutAmount, payout_tx: payoutAmount ? `settled-${Date.now()}-${rank}` : null }; });
  const merged = entries.map((entry) => ranked.find((item) => item.id === entry.id) || entry);
  saveLocalEntries(merged);
  const receipts = getReceipts();
  ranked.filter((entry) => entry.payout_amount > 0).forEach((entry) => receipts.unshift(makeTransactionReceipt({ type: 'Contest payout', amount: entry.payout_amount, status: 'Success', contestTitle: entry.contest_title || contest.title, payoutTx: entry.payout_tx, createdAt: new Date().toISOString() })));
  saveReceipts(receipts); syncWalletPage(); syncProfilePage(); window.showWalletToast(`Settled ${ranked.length} entries for ${contest.title}.`, 'success'); return ranked;
};

