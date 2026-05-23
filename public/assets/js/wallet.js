async function trySupabaseSelect(table, selectQuery) {
  try {
    const { data, error } = await _supabase.from(table).select(selectQuery);
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn(`Supabase select failed for ${table}`, error);
    return [];
  }
}
async function tryInsertEntry(payload) {
  const revealAt = payload.lineup_reveal_at ? new Date(payload.lineup_reveal_at).getTime() : Number.MAX_SAFE_INTEGER;
  const canRevealLineup = Date.now() >= revealAt || payload.privacy_mode === 'public';
  const richPayload = {
    contest_id: payload.contest_id,
    user_id: payload.user_id,
    wallet_address: payload.user_id,
    lineup_data: canRevealLineup ? payload.lineup_data : null,
    tx_signature: payload.tx_signature || null,
    payment_signature: payload.tx_signature || null,
    is_private: payload.privacy_mode !== 'public',
    status: payload.status || 'locked',
    lineup_encrypted: payload.lineup_encrypted || null,
    lineup_hash: payload.lineup_hash || null,
    lineup_reveal_at: payload.lineup_reveal_at || null,
    points_final: payload.points_final || null,
    settlement_status: payload.settlement_status || 'pending',
    payout_tx: payload.payout_tx || null,
    privacy_mode: payload.privacy_mode || 'hidden_until_reveal',
    compliance_status: payload.compliance_status || 'passed',
    risk_status: payload.risk_status || 'passed',
    escrow_address: payload.escrow_address || ESCROW_ADDRESS,
    escrow_network: payload.escrow_network || NETWORK_LABEL
  };

  try {
    const { data, error } = await _supabase.from('entries').insert(richPayload).select();
    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.warn('Rich entry insert failed, retrying with minimal schema', error);
  }

  try {
    const minimal = {
      contest_id: payload.contest_id,
      user_id: payload.user_id,
      wallet_address: payload.user_id,
      lineup_data: null,
      tx_signature: payload.tx_signature || null,
      is_private: payload.privacy_mode !== 'public',
      status: payload.status || 'locked',
      lineup_encrypted: payload.lineup_encrypted || null,
      lineup_hash: payload.lineup_hash || null
    };
    const { data, error } = await _supabase.from('entries').insert(minimal).select();
    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.warn('Minimal entry insert failed', error);
    return null;
  }
}
async function evaluateJoinGuard(wallet, contest) {
  const paid = Number(contest.entry_amount || 0) > 0 || contest.entry_mode === 'paid_beta';
  try {
    const response = await fetch('/api/join-guard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet, contestId: contest.id, entryAmount: Number(contest.entry_amount || 0), entryMode: contest.entry_mode || (paid ? 'paid_beta' : 'free') })
    });
    const result = await response.json();
    if (!result.allowed) throw new Error(result.reason || 'Join blocked by SkillXI risk controls.');
    return result;
  } catch (error) {
    if (!paid) return { allowed: true, reason: 'Free contest allowed while guard is offline.' };
    throw new Error(error.message || 'Paid beta guard unavailable. Try again after deployment health is green.');
  }
}
function getLocalEntries() {
  return readStore(STORAGE_KEYS.entries, []);
}

function saveLocalEntries(entries) {
  writeStore(STORAGE_KEYS.entries, entries);
}
function getReceipts() {
  return readStore(STORAGE_KEYS.receipts, []);
}

function saveReceipts(receipts) {
  writeStore(STORAGE_KEYS.receipts, receipts);
}
function getContestById(contestId) {
  return PAGE_STATE.contests.find((contest) => contest.id === contestId) || null;
}
function getSelectedContestId() {
  const search = new URLSearchParams(window.location.search);
  return search.get('contest') || window.localStorage.getItem(STORAGE_KEYS.selectedContest) || (PAGE_STATE.contests[0]?.id || null);
}

function setSelectedContest(contestId) {
  window.localStorage.setItem(STORAGE_KEYS.selectedContest, contestId);
  PAGE_STATE.activeContest = getContestById(contestId);
}

function currentContest() {
  if (!PAGE_STATE.activeContest) {
    setSelectedContest(getSelectedContestId());
  }
  return PAGE_STATE.activeContest || PAGE_STATE.contests[0] || null;
}
function fallbackUserProfile() {
  const wallet = getSavedWallet();
  const entries = getLocalEntries().filter((entry) => !wallet || entry.user_id === wallet);
  const settled = entries.filter((entry) => entry.settlement_status === 'settled');
  const wins = settled.filter((entry) => (entry.points_final || 0) >= 95);
  const scoreHistory = [612, 644, 681, 710, 744, 801, 848];
  return {
    username: wallet ? `SkillXI-${wallet.slice(0, 4)}` : 'Guest Scout',
    wallet_address: wallet,
    skill_score: 848,
    reputation_score: 72,
    total_earned: settled.reduce((sum, entry) => sum + Number(entry.payout_amount || 0), 0),
    contests_entered: entries.length,
    active_contests: entries.filter((entry) => entry.settlement_status !== 'settled').length,
    win_rate: settled.length ? (wins.length / settled.length) * 100 : 0,
    beta_access: wallet.length > 0,
    skill_score_history: scoreHistory
  };
}
window.ensureUserExists = async function ensureUserExists(walletAddress) {
  const basePayload = {
    wallet_address: walletAddress,
    primary_wallet: walletAddress,
    username: `SkillXI-${walletAddress.slice(0, 4)}`,
    skill_score: 650,
    subscription: 'free',
    total_earned: 0,
    contests_entered: getLocalEntries().filter((entry) => entry.user_id === walletAddress).length,
    reputation_score: 65,
    beta_access: false,
    region: 'global',
    skill_score_history: [620, 640, 650]
  };
  try {
    const { error } = await _supabase.from('users').upsert(basePayload, { onConflict: 'wallet_address' });
    if (error) throw error;
  } catch (error) {
    try {
      const legacyPayload = { ...basePayload, id: walletAddress };
      const { error: legacyError } = await _supabase.from('users').upsert(legacyPayload);
      if (legacyError) throw legacyError;
    } catch (legacyError) {
      console.warn('Supabase user upsert failed', legacyError);
    }
  }
};
async function getUserProfile() {
  const wallet = getSavedWallet();
  if (!wallet) return fallbackUserProfile();

  try {
    let { data, error } = await _supabase.from('users').select('*').eq('wallet_address', wallet).maybeSingle();
    if (error) {
      const legacy = await _supabase.from('users').select('*').eq('id', wallet).maybeSingle();
      data = legacy.data;
      error = legacy.error;
    }
    if (error) throw error;
    return { ...fallbackUserProfile(), ...(data || {}) };
  } catch (error) {
    console.warn('User profile fetch failed', error);
    return fallbackUserProfile();
  }
}
async function getUserEntries() {
  const wallet = getSavedWallet();
  const localEntries = getLocalEntries().filter((entry) => !wallet || entry.user_id === wallet);
  if (!wallet) return localEntries;

  try {
    const { data, error } = await _supabase.from('entries').select('*').eq('user_id', wallet).order('created_at', { ascending: false });
    if (error) throw error;
    const remoteEntries = (data || []).map((entry) => ({
      contest_id: entry.contest_id,
      user_id: entry.user_id,
      lineup_data: typeof entry.lineup_data === 'string' ? safeJsonParse(entry.lineup_data, {}) : entry.lineup_data,
      tx_signature: entry.tx_signature,
      privacy_mode: entry.privacy_mode || (entry.is_private ? 'hidden_until_reveal' : 'public'),
      lineup_reveal_at: entry.lineup_reveal_at,
      points_final: entry.points_final,
      settlement_status: entry.settlement_status || entry.status || 'pending',
      payout_tx: entry.payout_tx || null,
      created_at: entry.created_at
    }));
    return remoteEntries.length ? remoteEntries : localEntries;
  } catch (error) {
    console.warn('Remote entries fetch failed', error);
    return localEntries;
  }
}
window.showWalletToast = function showWalletToast(message, type = 'info', link = null) {
  const colors = {
    info: '#a8e8ff',
    success: '#00ff88',
    error: '#ff6b6b'
  };
  const toast = document.createElement('div');
  toast.style.cssText = [
    'position:fixed',
    'bottom:24px',
    'right:24px',
    'max-width:360px',
    'z-index:999999',
    'padding:14px 18px',
    'border-radius:14px',
    'background:#131318',
    `border:1px solid ${colors[type] || colors.info}`,
    'box-shadow:0 20px 40px rgba(0,0,0,0.45)',
    'color:#fff',
    'font-family:Inter,sans-serif',
    'transform:translateY(20px)',
    'opacity:0',
    'transition:all 220ms ease'
  ].join(';');
  toast.innerHTML = `
    <div style="display:flex; gap:12px; align-items:flex-start;">
      <div style="font-size:18px; line-height:1;">${type === 'success' ? '✓' : type === 'error' ? '!' : 'i'}</div>
      <div style="font-size:13px; line-height:1.5;">
        <div>${escapeHtml(message)}</div>
        ${link ? `<a href="${escapeHtml(link)}" target="_blank" rel="noreferrer" style="color:#a8e8ff; text-decoration:underline; font-size:12px;">View explorer</a>` : ''}
      </div>
    </div>
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });
  window.setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    window.setTimeout(() => toast.remove(), 240);
  }, 4200);
};
window.triggerConnectWallet = function triggerConnectWallet() {
  const existing = document.getElementById('wallet-selector-modal');
  if (existing) {
    existing.remove();
  }

  const modal = document.createElement('div');
  modal.id = 'wallet-selector-modal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,0.82);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:20px;';
  modal.innerHTML = `
    <div class="glass-panel" style="background:#131318;border:1px solid rgba(168,232,255,0.16);border-radius:28px;padding:32px;max-width:420px;width:100%;box-shadow:0 24px 64px rgba(0,0,0,0.45);">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:22px;">
        <div>
          <h2 style="font-family:'Space Grotesk',sans-serif;font-size:24px;color:#fff;font-weight:800;margin:0 0 6px;">Connect wallet</h2>
          <p style="color:#a0a0b8;font-size:13px;line-height:1.6;margin:0;">Free contests are open to everyone. Paid contests remain invite-only beta on ${NETWORK_LABEL}.</p>
        </div>
        <button id="close-wallet-modal" style="background:none;border:none;color:#7c7c92;font-size:18px;cursor:pointer;">×</button>
      </div>
      <div style="display:grid;gap:12px;">
        <button data-wallet-provider="phantom" style="background:rgba(171,71,255,0.12);border:1px solid rgba(171,71,255,0.28);color:#fff;padding:16px;border-radius:16px;font-weight:700;cursor:pointer;">Connect Phantom</button>
        <button data-wallet-provider="solflare" style="background:rgba(255,129,0,0.12);border:1px solid rgba(255,129,0,0.28);color:#fff;padding:16px;border-radius:16px;font-weight:700;cursor:pointer;">Connect Solflare</button>
      </div>
      <div style="margin-top:16px;padding:12px 14px;border-radius:12px;background:rgba(0,212,255,0.08);border:1px solid rgba(0,212,255,0.18);font-size:12px;color:#a8e8ff;">
        Private lineups in beta hide your picks until reveal. Payment privacy is limited to current beta behavior and not a full stealth payment system yet.
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector('#close-wallet-modal').onclick = () => modal.remove();
  modal.querySelectorAll('[data-wallet-provider]').forEach((button) => {
    button.addEventListener('click', () => window.connectWalletProvider(button.getAttribute('data-wallet-provider')));
  });
};
function resolveWalletProvider(type) {
  if (type === 'phantom') {
    if (window.phantom?.solana?.isPhantom) return window.phantom.solana;
    if (window.solana?.isPhantom) return window.solana;
    return null;
  }
  if (type === 'solflare') {
    if (window.solflare?.isSolflare) return window.solflare;
    if (window.solana?.isSolflare) return window.solana;
    return null;
  }
  return window.solana || null;
}
window.connectWalletProvider = async function connectWalletProvider(type) {
  const provider = resolveWalletProvider(type);
  if (!provider) {
    window.showWalletToast(`Install ${type === 'phantom' ? 'Phantom' : 'Solflare'} to continue.`, 'error');
    return;
  }

  try {
    const response = await provider.connect();
    const wallet = response.publicKey.toString();
    window.localStorage.setItem(STORAGE_KEYS.wallet, wallet);
    window.localStorage.setItem(STORAGE_KEYS.walletType, type);
    await window.ensureUserExists(wallet);
    window.updateWalletUI(wallet);
    await window.fetchWalletBalance(wallet);
    document.getElementById('wallet-selector-modal')?.remove();
    window.showWalletToast('Wallet connected.', 'success');
  } catch (error) {
    console.warn('Wallet connect failed', error);
    window.showWalletToast('Wallet connection failed.', 'error');
  }
};
window.connectWallet = window.triggerConnectWallet;
window.disconnectWallet = function disconnectWallet() {
  window.localStorage.removeItem(STORAGE_KEYS.wallet);
  window.localStorage.removeItem(STORAGE_KEYS.walletType);
  window.showWalletToast('Wallet disconnected.', 'info');
  window.location.reload();
};
window.updateWalletUI = function updateWalletUI(wallet) {
  const short = shortWallet(wallet);
  document.querySelectorAll('button').forEach((button) => {
    if ((button.textContent || '').includes('Connect Wallet')) {
      button.textContent = short;
      button.style.color = '#00ff88';
      button.style.background = 'rgba(0,255,136,0.1)';
    }
  });
  document.querySelectorAll('a[href="wallet.html"]').forEach((link) => {
    link.innerHTML = `<span style="color:#00ff88;font-weight:800;background:rgba(0,255,136,0.1);padding:6px 14px;border-radius:999px;border:1px solid rgba(0,255,136,0.3);">${short}</span>`;
  });
};
window.fetchWalletBalance = async function fetchWalletBalance(wallet) {
  let sol = 0;
  try {
    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'));
    const lamports = await connection.getBalance(new solanaWeb3.PublicKey(wallet));
    sol = lamports / solanaWeb3.LAMPORTS_PER_SOL;
  } catch (error) {
    console.warn('Wallet balance fetch failed', error);
  }
  syncWalletPage(sol);
  return sol;
};
function makeTransactionReceipt({ type, amount, status, contestTitle, txSignature, payoutTx, createdAt }) {
  return {
    id: `receipt-${Math.random().toString(36).slice(2, 10)}`,
    type,
    amount,
    status,
    contestTitle,
    txSignature: txSignature || payoutTx || '',
    createdAt: createdAt || new Date().toISOString()
  };
}
async function executeEscrowPayment(amount) {
  const wallet = getSavedWallet();
  if (!wallet) throw new Error('Connect wallet first');

  const provider = getSavedWalletType() === 'phantom' ? window.solana : window.solflare;
  if (!provider?.signAndSendTransaction) {
    throw new Error('Selected wallet does not support signing in this browser');
  }

  const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'), 'confirmed');
  const transaction = new solanaWeb3.Transaction().add(
    solanaWeb3.SystemProgram.transfer({
      fromPubkey: new solanaWeb3.PublicKey(wallet),
      toPubkey: new solanaWeb3.PublicKey(ESCROW_ADDRESS),
      lamports: Math.floor(Number(amount) * solanaWeb3.LAMPORTS_PER_SOL)
    })
  );
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = new solanaWeb3.PublicKey(wallet);
  window.showWalletToast('Requesting wallet signature...', 'info');
  const signed = await provider.signAndSendTransaction(transaction);
  await connection.confirmTransaction(signed.signature, 'confirmed');
  return signed.signature;
}
window.showPaymentStatement = function showPaymentStatement(contest, onConfirm) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,0.86);backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;padding:20px;';
  overlay.innerHTML = `
    <div style="background:#131318;border:1px solid rgba(0,255,136,0.18);border-radius:24px;padding:34px;max-width:480px;width:100%;box-shadow:0 24px 64px rgba(0,0,0,0.45);">
      <div style="font-size:36px;margin-bottom:16px;">🔐</div>
      <h2 style="font-family:'Space Grotesk',sans-serif;font-size:24px;color:#fff;font-weight:800;margin:0 0 12px;">Contest lock confirmation</h2>
      <p style="color:#a0a0b8;font-size:14px;line-height:1.7;margin:0 0 22px;">
        You are entering <span style="color:#fff;font-weight:700;">${escapeHtml(contest.title)}</span>.<br>
        ${contest.entry_amount > 0 ? `Entry fee: <span style="color:#00ff88;font-weight:700;">${formatSol(contest.entry_amount)}</span> on ${NETWORK_LABEL}.<br>` : 'This contest is free to enter.<br>'}
        SkillXI beta will hide your lineup until reveal where available, but this is not a full stealth-payment system yet.
      </p>
      <div style="display:grid;gap:12px;">
        <button id="confirm-lock-lineup" style="background:linear-gradient(135deg,#00ff88,#00d4ff);color:#003642;border:none;border-radius:14px;padding:16px;font-weight:800;cursor:pointer;">Confirm and lock lineup</button>
        <button id="cancel-lock-lineup" style="background:none;border:1px solid rgba(90,90,117,0.3);color:#7a7a93;padding:14px;border-radius:14px;cursor:pointer;">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector('#cancel-lock-lineup').onclick = () => overlay.remove();
  overlay.querySelector('#confirm-lock-lineup').onclick = async () => {
    const button = overlay.querySelector('#confirm-lock-lineup');
    button.disabled = true;
    button.textContent = 'Processing...';
    try {
      await onConfirm();
      overlay.remove();
    } catch (error) {
      console.warn('Lock lineup failed', error);
      button.disabled = false;
      button.textContent = 'Confirm and lock lineup';
      window.showWalletToast(error.message || 'Unable to lock lineup.', 'error');
    }
  };
};
function syncWalletPage(balanceOverride) {
  if (getPath() !== 'wallet.html') return;
  const wallet = getSavedWallet();
  const defaultBalance = typeof balanceOverride === 'number' ? balanceOverride : readStore('skillxi_cached_balance', 0);
  if (typeof balanceOverride === 'number') {
    writeStore('skillxi_cached_balance', defaultBalance);
  }

  const amountNode = document.querySelector('span.font-headline.font-extrabold.text-7xl.tracking-tighter.text-white');
  if (amountNode) amountNode.textContent = Number(defaultBalance).toFixed(4);

  const usdNode = Array.from(document.querySelectorAll('div')).find((node) => (node.textContent || '').includes('USD') && (node.textContent || '').includes('≈'));
  if (usdNode) usdNode.textContent = `≈ ${formatUsd(defaultBalance * USD_PER_SOL)} USD`;

  const devices = Array.from(document.querySelectorAll('div.text-sm.font-bold'));
  if (devices[0] && wallet) devices[0].textContent = `Connected wallet ${shortWallet(wallet)}`;
  const deviceMeta = Array.from(document.querySelectorAll('div.text-[10px].text-slate-500'));
  if (deviceMeta[0]) deviceMeta[0].textContent = `${NETWORK_LABEL} • ${wallet ? 'Active now' : 'Guest mode'}`;

  const tbody = document.querySelector('tbody.divide-y.divide-white\\/5');
  if (tbody) {
    const receipts = getReceipts();
    const fallbackRows = receipts.length ? receipts : [
      makeTransactionReceipt({ type: 'Demo payout', amount: 0, status: 'Pending', contestTitle: 'Free contests only', createdAt: new Date().toISOString() })
    ];
    tbody.innerHTML = fallbackRows.slice(0, 6).map((receipt) => {
      const positive = Number(receipt.amount) >= 0;
      const amount = Number(receipt.amount) === 0 ? '--' : `${positive ? '+' : '-'}${formatSol(Math.abs(receipt.amount))}`;
      return `
        <tr class="hover:bg-white/[0.02] transition-colors">
          <td class="px-8 py-5">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined ${positive ? 'text-secondary' : 'text-primary'}" style="font-variation-settings: 'FILL' 1;">${positive ? 'stars' : 'payments'}</span>
              <span class="font-bold">${escapeHtml(receipt.type)}</span>
            </div>
          </td>
          <td class="px-8 py-5 text-slate-400 text-sm">${escapeHtml(formatDate(receipt.createdAt))}</td>
          <td class="px-8 py-5 ${positive ? 'text-tertiary' : 'text-white'} font-headline font-bold">${escapeHtml(amount)}</td>
          <td class="px-8 py-5">
            <span class="px-3 py-1 rounded-full ${receipt.status === 'Success' ? 'bg-tertiary/10 text-tertiary' : 'bg-primary/10 text-primary'} text-[10px] font-bold uppercase">${escapeHtml(receipt.status)}</span>
          </td>
          <td class="px-8 py-5 text-right">
            <a class="text-primary hover:underline text-xs flex items-center justify-end gap-1" href="${receipt.txSignature ? `https://explorer.solana.com/tx/${receipt.txSignature}?cluster=devnet` : '#'}" target="_blank" rel="noreferrer">
              Explorer <span class="material-symbols-outlined text-xs">open_in_new</span>
            </a>
          </td>
        </tr>
      `;
    }).join('');
  }
}
function skillxiExportReceiptsCsv() {
  const rows = [['type', 'contest', 'amount', 'status', 'tx', 'created_at']].concat(getReceipts().map((receipt) => [receipt.type || '', receipt.contestTitle || '', receipt.amount || 0, receipt.status || '', receipt.txSignature || receipt.payoutTx || '', receipt.createdAt || '']));
  const csv = rows.map((row) => row.map((cell) => '"' + String(cell).replace(/"/g, '""') + '"').join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'skillxi-wallet-receipts.csv';
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

