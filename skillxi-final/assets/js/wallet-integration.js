// ==================== WEB3 WALLET INTEGRATION v3 - CLEAN & BULLETPROOF ====================

function showWalletToast(message, type = 'info', link = null) {
  console.log(`🔥 Wallet debug: [TOAST] ${type.toUpperCase()} - ${message}`);
  
  let toastContainer = document.getElementById('skillxi-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'skillxi-toast-container';
    toastContainer.style.cssText = 'position:fixed; bottom:24px; right:24px; z-index:99999; display:flex; flex-direction:column; gap:12px; pointer-events:auto;';
    document.body.appendChild(toastContainer);
  }

  const colors = {
    info: { border: 'rgba(0,212,255,0.5)', bg: 'rgba(0,212,255,0.08)', icon: 'info', text: '#00d4ff' },
    success: { border: 'rgba(0,255,136,0.5)', bg: 'rgba(0,255,136,0.08)', icon: 'check_circle', text: '#00ff88' },
    error: { border: 'rgba(255,105,105,0.5)', bg: 'rgba(255,105,105,0.08)', icon: 'error', text: '#ff6969' }
  };
  
  const theme = colors[type] || colors.info;
  const explorerHTML = link ? `<a href="${link}" target="_blank" style="display:inline-block; margin-top:6px; color:${theme.text}; font-size:11px; text-decoration:underline;">View on Solana Explorer →</a>` : '';

  const toast = document.createElement('div');
  toast.style.cssText = `background:#131318; backdrop-filter:blur(12px); border:1px solid ${theme.border}; border-radius:14px; padding:16px 20px; box-shadow:0 0 25px rgba(0,0,0,0.6), inset 0 0 12px ${theme.bg}; display:flex; align-items:flex-start; gap:12px; min-width:320px; max-width:420px; transform:translateX(120%); opacity:0; transition:all 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275);`;

  toast.innerHTML = `
    <span class="material-symbols-outlined" style="color:${theme.text}; font-size:24px;">${theme.icon}</span>
    <div style="flex:1;">
      <div style="color:#fff; font-family:'Space Grotesk', sans-serif; font-weight:700; font-size:14px; margin-bottom:4px; letter-spacing:-0.02em;">${type.toUpperCase()}</div>
      <div style="color:#a0a0b8; font-size:13px; line-height:1.5;">${message}</div>
      ${explorerHTML}
    </div>
    <span class="material-symbols-outlined" style="color:#5a5a75; font-size:16px; cursor:pointer;" onclick="this.parentElement.remove()">close</span>
  `;

  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)';
    toast.style.opacity = '1';
  });

  setTimeout(() => {
    toast.style.transform = 'translateX(120%)';
    toast.style.opacity = '0';
    setTimeout(() => { if (toast.parentElement) toast.remove(); }, 500);
  }, 5000);
}

function showWalletChooserModal() {
  console.log("🔥 Wallet debug: Showing dual-wallet selector modal");
  const existing = document.getElementById('skillxi-wallet-modal');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'skillxi-wallet-modal';
  overlay.style.cssText = 'position:fixed; inset:0; z-index:99998; background:rgba(0,0,0,0.7); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; animation:fadeInModal 0.3s ease;';

  const card = document.createElement('div');
  card.style.cssText = 'background:#1a1a22; border:1px solid rgba(168,232,255,0.15); border-radius:24px; padding:40px; min-width:380px; text-align:center; box-shadow:0 0 60px rgba(0,212,255,0.12), 0 20px 40px rgba(0,0,0,0.5);';

  card.innerHTML = `
    <div style="font-family:'Space Grotesk', sans-serif; font-size:22px; font-weight:800; color:#fff; margin-bottom:8px; letter-spacing:-0.03em;">Select Wallet</div>
    <div style="color:#5a5a75; font-size:13px; margin-bottom:32px;">Connect to SkillXI via Solana</div>
    <div id="wallet-modal-buttons" style="display:flex; flex-direction:column; gap:14px;"></div>
    <div style="margin-top:20px;">
      <button onclick="document.getElementById('skillxi-wallet-modal').remove()" style="background:none; border:1px solid rgba(90,90,117,0.3); color:#5a5a75; padding:10px 28px; border-radius:12px; font-size:13px; cursor:pointer; font-family:'Space Grotesk', sans-serif; font-weight:600;">Cancel</button>
    </div>
  `;

  overlay.appendChild(card);
  document.body.appendChild(overlay);

  const btnContainer = document.getElementById('wallet-modal-buttons');

  const phantomBtn = document.createElement('button');
  phantomBtn.style.cssText = 'background:linear-gradient(135deg, rgba(171,99,255,0.15), rgba(171,99,255,0.05)); border:1px solid rgba(171,99,255,0.3); color:#fff; padding:16px 24px; border-radius:16px; font-size:15px; font-weight:700; cursor:pointer; font-family:\'Space Grotesk\', sans-serif; display:flex; align-items:center; justify-content:center; gap:12px; transition:all 0.2s;';
  phantomBtn.innerHTML = '<span style="font-size:24px;">👻</span> Phantom';
  phantomBtn.onclick = () => { overlay.remove(); connectWalletProvider('phantom'); };
  btnContainer.appendChild(phantomBtn);

  const solflareBtn = document.createElement('button');
  solflareBtn.style.cssText = 'background:linear-gradient(135deg, rgba(252,163,17,0.15), rgba(252,163,17,0.05)); border:1px solid rgba(252,163,17,0.3); color:#fff; padding:16px 24px; border-radius:16px; font-size:15px; font-weight:700; cursor:pointer; font-family:\'Space Grotesk\', sans-serif; display:flex; align-items:center; justify-content:center; gap:12px; transition:all 0.2s;';
  solflareBtn.innerHTML = '<span style="font-size:24px;">🔥</span> Solflare';
  solflareBtn.onclick = () => { overlay.remove(); connectWalletProvider('solflare'); };
  btnContainer.appendChild(solflareBtn);
}

async function triggerConnectWallet() {
  console.log("🔥 Wallet debug: triggerConnectWallet() activated by click.");
  const hasPhantom = !!(window.solana && window.solana.isPhantom);
  const hasSolflare = !!window.solflare;
  
  if (!hasPhantom && !hasSolflare) {
    console.log("🔥 Wallet debug: No valid wallets found in window object.");
    showWalletToast('🔴 ERROR: No Solana wallet found. Please install Phantom or Solflare.', 'error', 'https://phantom.app/');
    return;
  }

  if (hasPhantom && hasSolflare) {
    showWalletChooserModal();
  } else if (hasPhantom) {
    await connectWalletProvider('phantom');
  } else {
    await connectWalletProvider('solflare');
  }
}

async function connectWalletProvider(walletType) {
  console.log(`🔥 Wallet debug: Attempting to connect to ${walletType}`);
  let provider = walletType === 'phantom' ? window.solana : window.solflare;

  try {
    showWalletToast(`Requesting connection to ${walletType}...`, 'info');
    const resp = await provider.connect();
    const pubKeyStr = resp.publicKey.toString();
    const shortKey = `${pubKeyStr.slice(0, 4)}...${pubKeyStr.slice(-4)}`;
    
    console.log(`🔥 Wallet debug: Connected! Pubkey: ${pubKeyStr}`);
    window.localStorage.setItem('skillxi_wallet', pubKeyStr);
    window.localStorage.setItem('skillxi_wallet_type', walletType);

    showWalletToast(`✅ Wallet Connected! ${shortKey}`, 'success', `https://explorer.solana.com/address/${pubKeyStr}?cluster=devnet`);
    updateWalletUI(pubKeyStr);
    await fetchWalletBalance(pubKeyStr);
  } catch (err) {
    console.error("🔥 Wallet debug: Connection error:", err);
    showWalletToast(err.code === 4001 ? 'Connection request rejected.' : `Failed to connect: ${err.message}`, 'error');
  }
}

async function fetchWalletBalance(pubKeyStr) {
  console.log(`🔥 Wallet debug: Fetching Devnet SOL balance for ${pubKeyStr}`);
  if (typeof solanaWeb3 === 'undefined') {
    console.warn("🔥 Wallet debug: solanaWeb3 global is undefined. Ensure Web3 IIFE CDN is loaded.");
    return;
  }
  
  try {
    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'), 'confirmed');
    const pubKey = new solanaWeb3.PublicKey(pubKeyStr);
    const balance = await connection.getBalance(pubKey);
    const sol = (balance / solanaWeb3.LAMPORTS_PER_SOL).toFixed(4);
    
    console.log(`🔥 Wallet debug: Balance fetched: ${sol} SOL`);
    document.querySelectorAll('.wallet-balance-display').forEach(el => el.innerText = `${sol} SOL`);
    const bigBalance = document.querySelector('.font-headline.font-extrabold.text-7xl');
    if (bigBalance) bigBalance.innerText = sol;
  } catch (err) {
    console.error("🔥 Wallet debug: Balance fetch failed:", err);
  }
}

async function disconnectWallet() {
  console.log("🔥 Wallet debug: Disconnecting wallet...");
  const type = window.localStorage.getItem('skillxi_wallet_type') || 'phantom';
  const provider = type === 'phantom' ? window.solana : window.solflare;
  
  try {
    if (provider && provider.disconnect) await provider.disconnect();
  } catch(e) {
     console.error("🔥 Wallet debug: Disconnect provider err:", e);
  }
  window.localStorage.removeItem('skillxi_wallet');
  window.localStorage.removeItem('skillxi_wallet_type');
  showWalletToast('Wallet disconnected securely.', 'info');
  console.log("🔥 Wallet debug: Wallet disconnected fully.");
  
  document.querySelectorAll('a[href="wallet.html"]').forEach(btn => {
    btn.innerHTML = `<span class="material-symbols-outlined text-[#a8e8ff]">account_balance_wallet</span>`;
  });
  
  document.querySelectorAll('button').forEach(btn => {
    if (btn.textContent.includes('...')) {
      btn.textContent = 'Connect Wallet';
      btn.style.cssText = 'background:linear-gradient(to right, #a8e8ff, #00d4ff); color:#00586b;';
      btn.onclick = (e) => { e.preventDefault(); triggerConnectWallet(); };
    }
  });
}

function updateWalletUI(pubKeyStr) {
  const shortKey = `${pubKeyStr.slice(0, 4)}...${pubKeyStr.slice(-4)}`;
  console.log(`🔥 Wallet debug: Updating UI for ${shortKey}`);
  
  document.querySelectorAll('a[href="wallet.html"]').forEach(btn => {
    btn.innerHTML = `<span style="color:#00ff88; font-family:'Space Grotesk', sans-serif; font-size:12px; font-weight:800; background:rgba(0,255,136,0.1); padding:4px 10px; border-radius:999px; border:1px solid rgba(0,255,136,0.2);">${shortKey}</span>`;
  });

  const walletPageBtns = document.querySelectorAll('button');
  walletPageBtns.forEach(btn => {
    if (btn.textContent.trim().includes('Connect Wallet')) {
      btn.textContent = shortKey;
      btn.style.background = 'rgba(0,255,136,0.1)';
      btn.style.border = '1px solid rgba(0,255,136,0.3)';
      btn.style.color = '#00ff88';
      btn.onclick = (e) => { e.preventDefault(); disconnectWallet(); };
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  console.log("🔥 Wallet debug: DOMContentLoaded binding wallet icons.");
  
  const walletLinks = document.querySelectorAll('a[href="wallet.html"]');
  walletLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const saved = window.localStorage.getItem('skillxi_wallet');
      if (!saved) triggerConnectWallet();
      else disconnectWallet();
    });
  });

  // Reconnect if trusted
  const savedKey = window.localStorage.getItem('skillxi_wallet');
  const savedType = window.localStorage.getItem('skillxi_wallet_type') || 'phantom';
  
  if (savedKey) {
    const provider = savedType === 'phantom' ? window.solana : window.solflare;
    if (provider) {
       console.log("🔥 Wallet debug: Auto-reconnecting existing trusted wallet.");
       provider.connect({ onlyIfTrusted: true })
         .then(resp => {
            updateWalletUI(resp.publicKey.toString());
            fetchWalletBalance(resp.publicKey.toString());
         }).catch(e => {
            console.log("🔥 Wallet debug: Auto-reconnect not authorized yet.");
         });
    }
  }
});
