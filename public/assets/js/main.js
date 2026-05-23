/* ============================================================
   SkillXI — Main Orchestrator
   Loads all modules and initializes the application
   ============================================================ */

function initPage() {
  if (typeof wireGlobalActions === 'function') wireGlobalActions();
  if (typeof injectNetworkBadge === 'function') injectNetworkBadge();
  if (typeof injectUniversalNavigation === 'function') injectUniversalNavigation();
  if (typeof syncCopyTruths === 'function') syncCopyTruths();

  const wallet = typeof getSavedWallet === 'function' ? getSavedWallet() : null;
  if (wallet && typeof window.updateWalletUI === 'function') {
    window.updateWalletUI(wallet);
    if (typeof window.fetchWalletBalance === 'function') window.fetchWalletBalance(wallet);
  }

  if (typeof window.getContests === 'function') {
    window.getContests().then((contests) => {
      if (typeof PAGE_STATE !== 'undefined') PAGE_STATE.contests = contests;
      if (typeof setSelectedContest === 'function' && typeof getSelectedContestId === 'function') {
        setSelectedContest(getSelectedContestId());
      }

      if (document.getElementById('contests-grid') && typeof window.filterContests === 'function') window.filterContests('all');
      if (document.getElementById('leaderboard-table') && typeof window.loadLeaderboard === 'function') window.loadLeaderboard('all_time');
      if (document.getElementById('ai-chat-container') && typeof seedChatContext === 'function') seedChatContext();
      if (document.getElementById('ai-lineup-section') && typeof hydrateLineupHeader === 'function') hydrateLineupHeader();

      if (typeof syncWalletPage === 'function') syncWalletPage();
      if (typeof syncProfilePage === 'function') syncProfilePage();
    });
  }
}

function skillxiInitCompletionLayer() {
  if (typeof skillxiRenderLineupBuilder === 'function') skillxiRenderLineupBuilder();
  if (typeof skillxiRenderConfirmPage === 'function') skillxiRenderConfirmPage();
  if (typeof skillxiRenderMatchLobby === 'function') skillxiRenderMatchLobby();
  if (typeof skillxiRenderNexusFallback === 'function') skillxiRenderNexusFallback();
  if (typeof skillxiRenderAdminPage === 'function') skillxiRenderAdminPage();
  if (typeof skillxiHydrateAdminHealth === 'function') skillxiHydrateAdminHealth();
  if (typeof skillxiHydrateAiSidebar === 'function') skillxiHydrateAiSidebar();
}

window.addEventListener('load', () => {
  const wallet = typeof getSavedWallet === 'function' ? getSavedWallet() : null;
  const type = typeof getSavedWalletType === 'function' ? getSavedWalletType() : null;
  
  if (wallet && type && typeof resolveWalletProvider === 'function') {
    const provider = resolveWalletProvider(type);
    if (provider && provider.connect) {
      provider.connect({ onlyIfTrusted: true }).then((response) => {
        if (typeof window.updateWalletUI === 'function') window.updateWalletUI(response.publicKey.toString());
        if (typeof window.fetchWalletBalance === 'function') window.fetchWalletBalance(response.publicKey.toString());
      }).catch(() => {
        if (typeof window.updateWalletUI === 'function') window.updateWalletUI(wallet);
      });
    }
  }
  
  initPage();
  skillxiInitCompletionLayer();
});
