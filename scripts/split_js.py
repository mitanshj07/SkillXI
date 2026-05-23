import os

lines = []
with open("public/assets/js/main.js") as f:
    lines = f.readlines()

def write_module(name, ranges):
    with open(f"public/assets/js/{name}", "w") as out:
        for start, end in ranges:
            # lines are 0-indexed
            out.writelines(lines[start-1:end])
        out.write("\n")

write_module("config.js", [(1, 189), (1805, 1847)])
write_module("utils.js", [(191, 295)])
write_module("crypto.js", [(363, 403)])
write_module("wallet.js", [(297, 306), (308, 360), (405, 420), (422, 428), (430, 436), (438, 440), (442, 457), (459, 477), (479, 505), (573, 590), (592, 617), (652, 695), (697, 729), (731, 743), (745, 766), (768, 768), (770, 775), (777, 789), (791, 802), (804, 814), (816, 840), (842, 876), (1415, 1465), (1560, 1569)])
write_module("contests.js", [(507, 517), (519, 545), (547, 560), (639, 650), (619, 637), (1055, 1059), (1061, 1064), (1066, 1126), (1128, 1142), (1144, 1148)])
write_module("lineup.js", [(878, 887), (889, 891), (893, 903), (905, 914), (916, 978), (980, 1041), (1043, 1053), (1150, 1177), (1179, 1192), (1194, 1209), (1211, 1222), (1224, 1234), (1849, 1851), (1852, 1856), (1857, 1859), (1860, 1862), (1863, 1869), (1870, 1872), (1873, 1875), (1876, 1891), (1892, 1897), (1898, 1933), (1934, 1941), (1942, 1948), (1949, 1976), (1977, 1983), (1984, 1989), (1990, 2002), (2003, 2015)])
write_module("chat.js", [(1236, 1259), (1261, 1270), (1272, 1282), (1284, 1288), (1290, 1295), (1297, 1308), (1310, 1354), (2065, 2072)])
write_module("leaderboard.js", [(562, 571), (1356, 1372), (1374, 1404)])
write_module("profile.js", [(1406, 1413), (1467, 1494), (1496, 1529)])
write_module("admin.js", [(2016, 2016), (2017, 2017), (2018, 2027), (2028, 2030), (2031, 2041), (2042, 2048), (2049, 2064)])
write_module("navigation.js", [(1544, 1548), (1550, 1558), (1531, 1540), (1571, 1586), (1631, 1749), (2075, 2165)])
write_module("blinks.js", [(1589, 1591), (1593, 1595), (1597, 1605), (1607, 1624), (1626, 1629)])

new_main = """/* ============================================================
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
"""
with open("public/assets/js/main.js", "w") as f:
    f.write(new_main)

print("Split completed.")
