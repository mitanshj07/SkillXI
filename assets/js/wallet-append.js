// ============================================
// WEB3 WALLET INTEGRATION (Phantom / Solflare)
// ============================================

function showToast(message, type = 'info', link = null) {
  let toastContainer = document.getElementById('skillxi-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'skillxi-toast-container';
    toastContainer.style.cssText = 'position:fixed; bottom:24px; right:24px; z-index:9999; display:flex; flex-direction:column; gap:12px;';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const colors = {
    info: { border: 'rgba(0,212,255,0.4)', bg: 'rgba(0,212,255,0.05)', icon: 'info', text: '#00d4ff' },
    success: { border: 'rgba(0,255,136,0.4)', bg: 'rgba(0,255,136,0.05)', icon: 'check_circle', text: '#00ff88' },
    error: { border: 'rgba(255,105,105,0.4)', bg: 'rgba(255,105,105,0.05)', icon: 'error', text: '#ff6969' }
  };
  
  const theme = colors[type] || colors.info;
  let explorerLink = link ? `<a href="${link}" target="_blank" style="display:inline-block; margin-top:6px; color:${theme.text}; font-size:11px; text-decoration:underline;">View on Solana Explorer →</a>` : '';

  toast.style.cssText = `
    background: #131318;
    backdrop-filter: blur(10px);
    border: 1px solid ${theme.border};
    border-radius: 12px;
    padding: 16px 20px;
    box-shadow: 0 0 20px rgba(0,0,0,0.5), inset 0 0 10px ${theme.bg};
    display: flex;
    align-items: flex-start;
    gap: 12px;
    min-width: 300px;
    transform: translateX(120%);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  `;
  
  toast.innerHTML = `
    <span class="material-symbols-outlined" style="color:${theme.text}; font-size:24px;">${theme.icon}</span>
    <div style="flex:1;">
      <div style="color:#fff; font-family:'Space Grotesk', sans-serif; font-weight:700; font-size:15px; margin-bottom:4px;">${type.toUpperCase()}</div>
      <div style="color:#a0a0b8; font-size:13px; line-height:1.4;">${message}</div>
      ${explorerLink}
    </div>
    <span class="material-symbols-outlined close-toast" style="color:#5a5a75; font-size:18px; cursor:pointer;" onclick="this.parentElement.remove()">close</span>
  `;

  toastContainer.appendChild(toast);
  
  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)';
    toast.style.opacity = '1';
  });

  setTimeout(() => {
    toast.style.transform = 'translateX(120%)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 5000);
}

const getProvider = () => {
  if ('solana' in window && window.solana.isPhantom) return window.solana;
  if ('solflare' in window) return window.solflare;
  return null;
};

async function connectWallet() {
  const provider = getProvider();
  
  if (!provider) {
    showToast("No Solana wallet found. Please install Phantom or Solflare.", "error", "https://phantom.app/");
    return;
  }

  try {
    showToast("Requesting wallet connection...", "info");
    const resp = await provider.connect();
    const pubKey = resp.publicKey.toString();
    
    showToast(`Connected: ${pubKey.slice(0,4)}...${pubKey.slice(-4)}`, "success");
    window.localStorage.setItem('skillxi_wallet', pubKey);
    updateUIWithWallet(pubKey);
    await getWalletBalance(pubKey);
    
  } catch (err) {
    console.error(err);
    if (err.code === 4001) {
      showToast("Request rejected by user.", "error");
    } else {
      showToast("Failed to connect wallet.", "error");
    }
  }
}

async function getWalletBalance(pubKeyStr) {
  if (typeof solanaWeb3 === 'undefined') {
    console.warn("Solana web3 CDN not loaded.");
    return;
  }
  try {
    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'), 'confirmed');
    const pubKey = new solanaWeb3.PublicKey(pubKeyStr);
    const balance = await connection.getBalance(pubKey);
    const sol = (balance / solanaWeb3.LAMPORTS_PER_SOL).toFixed(4);
    
    showToast(`Fetched Balance: ${sol} SOL`, "info", \`https://explorer.solana.com/address/\${pubKeyStr}\`);
    document.querySelectorAll('.wallet-balance-display').forEach(el => el.innerText = sol + ' SOL');
  } catch (e) {
    console.error("Balance fetch error:", e);
    showToast("Could not fetch balance from Solana Mainnet.", "error");
  }
}

async function disconnectWallet() {
  const provider = getProvider();
  if (provider) {
    await provider.disconnect();
    window.localStorage.removeItem('skillxi_wallet');
    showToast("Wallet disconnected successfully.", "info");
    document.querySelectorAll('a[href="wallet.html"]').forEach(btn => {
      btn.innerHTML = \`<span class="material-symbols-outlined text-[#a8e8ff]">account_balance_wallet</span>\`;
    });
  }
}

function updateUIWithWallet(pubKey) {
  document.querySelectorAll('a[href="wallet.html"]').forEach(btn => {
    btn.innerHTML = \`<span style="color:#00ff88; font-family:'Space Grotesk', sans-serif; font-size:12px; font-weight:800; background:rgba(0,255,136,0.1); padding:4px 10px; border-radius:999px; border:1px solid rgba(0,255,136,0.2);">\${pubKey.slice(0,4)}...\${pubKey.slice(-4)}</span>\`;
  });
}

// Auto-connect on load if trusted
window.addEventListener('load', async () => {
    const provider = getProvider();
    if (provider && window.localStorage.getItem('skillxi_wallet')) {
        try {
            const resp = await provider.connect({ onlyIfTrusted: true });
            const pubKey = resp.publicKey.toString();
            updateUIWithWallet(pubKey);
            await getWalletBalance(pubKey);
        } catch (e) {
            // Fails silently if not trusted yet
        }
    }
});
