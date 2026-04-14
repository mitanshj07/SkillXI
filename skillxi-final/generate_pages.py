#!/usr/bin/env python3
"""
SkillXI Page Generator
Extracts main content from source HTML files and wraps with unified navigation.
"""
import re
import os

SRC_BASE = "/Users/mitansh7/Desktop/SkillXI-web-project"
DEST = "/Users/mitansh7/Desktop/SkillXI-web-project/skillxi-final"

# Page configurations: (output_filename, source_path, title, description, body_class_override)
PAGES = [
    ("contests.html", "stitch_step_wise_extraction_tool 2/skillxi_contest_browser_full/code.html",
     "Browse Contests | SkillXI", "Browse and join AI-powered fantasy sports contests on SkillXI.", None),
    ("lineup.html", "stitch_step_wise_extraction_tool 2/skillxi_lineup_builder/code.html",
     "Lineup Builder | SkillXI", "Build your optimal fantasy lineup with AI-powered insights.", None),
    ("leaderboard.html", "stitch_step_wise_extraction_tool 2/skillxi_live_leaderboard/code.html",
     "Live Leaderboard | SkillXI", "Track live contest rankings and leaderboard standings.", None),
    ("payout.html", "stitch_step_wise_extraction_tool 2/skillxi_contest_results_payout/code.html",
     "Contest Results & Payouts | SkillXI", "View contest results, payouts, and your earnings history.", None),
    ("player-analysis.html", "stitch_step_wise_extraction_tool 2/skillxi_player_analysis_detail/code.html",
     "Player Analysis | SkillXI", "Deep dive into player statistics, AI verdicts, and performance metrics.", None),
    ("ai-chat.html", "stitch_step_wise_extraction_tool 2/skillxi_ai_analyst_chat/code.html",
     "AI Analyst Chat | SkillXI", "Chat with the AI Analyst for lineup optimization and match intelligence.", "overflow-hidden"),
    ("profile.html", "stitch_step_wise_extraction_tool 2/skillxi_user_profile_skill_score/code.html",
     "User Profile | SkillXI", "View your skill score, earnings, badges, and activity history.", None),
    ("subscription.html", "stitch_step_wise_extraction_tool 2/skillxi_subscription_plans/code.html",
     "Subscription Plans | SkillXI", "Upgrade to Pro or Elite for advanced AI features and tools.", None),
    ("pre-match.html", "stitch_step_wise_extraction_tool 2/skillxi_pre_match_intelligence_report/code.html",
     "Pre-Match Intelligence | SkillXI", "AI-powered pre-match analysis, score predictions, and tactical breakdowns.", None),
    ("onboarding.html", "stitch_step_wise_extraction_tool 3/skillxi_web3_onboarding/code.html",
     "Connect Identity | SkillXI", "Connect your Web3 wallet to enter the SkillXI arena.", None),
    ("wallet.html", "stitch_step_wise_extraction_tool 3/skillxi_wallet_history/code.html",
     "Vault Control | SkillXI", "Manage your wallet, view transactions, and track your balance.", None),
    ("nexus-feed.html", "stitch_step_wise_extraction_tool 3/skillxi_nexus_feed/code.html",
     "Nexus Feed | SkillXI", "Real-time intelligence and community activity from the SkillXI ecosystem.", None),
    ("roster-lab.html", "stitch_step_wise_extraction_tool 5/roster_lab_cyberpunk_edition/code.html",
     "Roster Lab | SkillXI", "Advanced roster editing with cyberpunk-style tactical formation builder.", "overflow-hidden"),
    ("global-leaderboard.html", "stitch_step_wise_extraction_tool 5/skillxi_global_leaderboard/code.html",
     "Global Leaderboard | SkillXI", "Hall of Fame rankings and global skill-based leaderboard.", None),
]

TAILWIND_CONFIG = '''    <script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "on-error-container": "#ffdad6", "secondary-fixed-dim": "#d2bbff",
                        "outline": "#859398", "primary": "#a8e8ff", "surface": "#131318",
                        "tertiary-fixed-dim": "#00e479", "surface-container": "#1f1f25",
                        "on-secondary-container": "#c9aeff", "error-container": "#93000a",
                        "on-primary-container": "#00586b", "on-secondary-fixed-variant": "#5a00c6",
                        "on-secondary": "#3f008e", "on-secondary-fixed": "#25005a",
                        "tertiary-fixed": "#60ff99", "on-surface": "#e4e1e9",
                        "surface-container-highest": "#35343a", "on-background": "#e4e1e9",
                        "on-surface-variant": "#bbc9cf", "surface-container-lowest": "#0e0e13",
                        "secondary": "#d2bbff", "on-primary-fixed": "#001f27",
                        "error": "#ffb4ab", "secondary-fixed": "#eaddff",
                        "surface-tint": "#3cd7ff", "surface-container-low": "#1b1b20",
                        "inverse-on-surface": "#303036", "tertiary-container": "#00df76",
                        "surface-container-high": "#2a292f", "secondary-container": "#6001d1",
                        "primary-fixed": "#b4ebff", "on-tertiary-fixed": "#00210c",
                        "inverse-surface": "#e4e1e9", "surface-variant": "#35343a",
                        "surface-bright": "#39383e", "background": "#131318",
                        "primary-container": "#00d4ff", "on-primary": "#003642",
                        "tertiary": "#00ff88", "on-primary-fixed-variant": "#004e5f",
                        "surface-dim": "#131318", "on-tertiary-fixed-variant": "#005228",
                        "on-error": "#690005", "inverse-primary": "#00677e",
                        "outline-variant": "#3c494e", "on-tertiary": "#003919",
                        "on-tertiary-container": "#005d2d", "primary-fixed-dim": "#3cd7ff"
                    },
                    borderRadius: { DEFAULT: "0.125rem", lg: "0.25rem", xl: "0.5rem", full: "9999px" },
                    fontFamily: { headline: ["Space Grotesk"], body: ["Inter"], label: ["Inter"] }
                },
            },
        }
    </script>'''

TOP_NAV = '''<!-- ===== TOP NAV BAR ===== -->
<nav class="fixed top-0 w-full z-50 bg-[#131318]/80 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,212,255,0.08)]">
    <div class="flex justify-between items-center px-8 h-20 w-full max-w-[1920px] mx-auto">
        <div class="flex items-center gap-8">
            <a href="index.html" class="text-2xl font-extrabold tracking-tighter text-[#a8e8ff] font-['Space_Grotesk']">SkillXI</a>
            <div class="hidden md:flex gap-6">
                <a class="top-nav-link text-slate-400 font-medium hover:text-white transition-colors font-['Space_Grotesk'] tracking-tight" href="index.html">Home</a>
                <a class="top-nav-link text-slate-400 font-medium hover:text-white transition-colors font-['Space_Grotesk'] tracking-tight" href="contests.html">Contests</a>
                <a class="top-nav-link text-slate-400 font-medium hover:text-white transition-colors font-['Space_Grotesk'] tracking-tight" href="lineup.html">Squads</a>
                <a class="top-nav-link text-slate-400 font-medium hover:text-white transition-colors font-['Space_Grotesk'] tracking-tight" href="pre-match.html">Intelligence</a>
            </div>
        </div>
        <div class="flex items-center gap-4">
            <a href="wallet.html" class="p-2 rounded-full hover:bg-[#a8e8ff]/10 transition-all duration-300 active:scale-95">
                <span class="material-symbols-outlined text-[#a8e8ff]">account_balance_wallet</span>
            </a>
            <button class="p-2 rounded-full hover:bg-[#a8e8ff]/10 transition-all duration-300 active:scale-95">
                <span class="material-symbols-outlined text-[#a8e8ff]">notifications</span>
            </button>
            <a href="profile.html" class="w-10 h-10 rounded-full border-2 border-[#a8e8ff]/30 overflow-hidden">
                <img alt="User Profile Avatar" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuWHy486rZWdwY1x41y0EEiakZeMKzCtels-E4FhYeP6C8L5eXU4ad4CDChNvgUAdFJkEvHni22VQsfSQ8SR2AuvdePWlbmTt5wm5GpkYQZ0OFhBf51CrQScJqioPhDKpNZGzQyyUWUet8n14uUIAonLXrVgs-Q9p-RsWdj6iqE9rHZ28JcC6Ju78M30mUbwcg0Zk5-FxsA0lFfGgEzhm7PmL7hCSH5NQ6azaPkSleSlSxq-hOv190dPle36yV_Up7g1_au8L2CLqt"/>
            </a>
        </div>
    </div>
</nav>'''

SIDE_NAV = '''<!-- ===== SIDE NAV BAR (Desktop) ===== -->
<aside class="hidden lg:flex fixed left-0 top-0 h-full w-64 border-r border-[#ffffff0f] bg-[#0e0e13] flex-col py-8 z-40">
    <div class="px-6 mb-12 mt-20">
        <h2 class="text-[#d2bbff] font-black text-xl font-headline tracking-tighter">KINETIC AI</h2>
        <p class="text-[10px] text-[#5a5a75] tracking-[0.2em] font-bold">V3.2 ACTIVE</p>
    </div>
    <div class="flex flex-col flex-1">
        <a class="side-nav-link text-[#5a5a75] hover:text-white flex items-center gap-4 px-6 py-4 hover:bg-[#2a292f] transition-all active:translate-x-1 duration-200" href="index.html">
            <span class="material-symbols-outlined">grid_view</span>
            <span class="font-headline font-bold">Home</span>
        </a>
        <a class="side-nav-link text-[#5a5a75] hover:text-white flex items-center gap-4 px-6 py-4 hover:bg-[#2a292f] transition-all active:translate-x-1 duration-200" href="ai-chat.html">
            <span class="material-symbols-outlined">psychology</span>
            <span class="font-headline font-bold">AI Analyst</span>
        </a>
        <a class="side-nav-link text-[#5a5a75] hover:text-white flex items-center gap-4 px-6 py-4 hover:bg-[#2a292f] transition-all active:translate-x-1 duration-200" href="contests.html">
            <span class="material-symbols-outlined">emoji_events</span>
            <span class="font-headline font-bold">Contests</span>
        </a>
        <a class="side-nav-link text-[#5a5a75] hover:text-white flex items-center gap-4 px-6 py-4 hover:bg-[#2a292f] transition-all active:translate-x-1 duration-200" href="lineup.html">
            <span class="material-symbols-outlined">database</span>
            <span class="font-headline font-bold">Squad Builder</span>
        </a>
        <a class="side-nav-link text-[#5a5a75] hover:text-white flex items-center gap-4 px-6 py-4 hover:bg-[#2a292f] transition-all active:translate-x-1 duration-200" href="leaderboard.html">
            <span class="material-symbols-outlined">leaderboard</span>
            <span class="font-headline font-bold">Leaderboard</span>
        </a>
        <a class="side-nav-link text-[#5a5a75] hover:text-white flex items-center gap-4 px-6 py-4 hover:bg-[#2a292f] transition-all active:translate-x-1 duration-200" href="profile.html">
            <span class="material-symbols-outlined">settings</span>
            <span class="font-headline font-bold">Settings</span>
        </a>
    </div>
    <div class="px-6 mt-auto">
        <a href="subscription.html" class="w-full block text-center bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-extrabold py-3 rounded-full shadow-[0_0_20px_rgba(0,212,255,0.4)] hover:scale-[1.02] transition-transform active:scale-95">
            UPGRADE TO PRO
        </a>
        <div class="mt-8 flex flex-col gap-4">
            <a class="text-[#5a5a75] hover:text-white flex items-center gap-4 transition-all" href="#">
                <span class="material-symbols-outlined">help</span>
                <span class="font-headline font-bold">Support</span>
            </a>
            <a class="text-[#5a5a75] hover:text-white flex items-center gap-4 transition-all" href="#">
                <span class="material-symbols-outlined">logout</span>
                <span class="font-headline font-bold">Logout</span>
            </a>
        </div>
    </div>
</aside>'''

BOTTOM_NAV = '''<!-- ===== BOTTOM NAV BAR (Mobile) ===== -->
<nav class="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 pb-safe bg-[#131318]/90 backdrop-blur-2xl md:hidden z-50 rounded-t-[2rem] border-t border-[#ffffff1a] shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
    <a class="bottom-nav-link flex flex-col items-center justify-center text-[#5a5a75] p-3 hover:text-[#a8e8ff] active:scale-90 transition-all" href="index.html">
        <span class="material-symbols-outlined">sports_kabaddi</span>
        <span class="font-['Inter'] text-[10px] uppercase tracking-widest mt-1">Home</span>
    </a>
    <a class="bottom-nav-link flex flex-col items-center justify-center text-[#5a5a75] p-3 hover:text-[#a8e8ff] active:scale-90 transition-all" href="pre-match.html">
        <span class="material-symbols-outlined">auto_awesome</span>
        <span class="font-['Inter'] text-[10px] uppercase tracking-widest mt-1">Intel</span>
    </a>
    <a class="flex flex-col items-center justify-center bg-gradient-to-br from-[#a8e8ff] to-[#00d4ff] text-[#131318] rounded-full p-4 shadow-[0_0_20px_rgba(0,212,255,0.4)] active:scale-90 transition-all" href="lineup.html">
        <span class="material-symbols-outlined text-3xl">add_circle</span>
    </a>
    <a class="bottom-nav-link flex flex-col items-center justify-center text-[#5a5a75] p-3 hover:text-[#a8e8ff] active:scale-90 transition-all" href="leaderboard.html">
        <span class="material-symbols-outlined">analytics</span>
        <span class="font-['Inter'] text-[10px] uppercase tracking-widest mt-1">Stats</span>
    </a>
    <a class="bottom-nav-link flex flex-col items-center justify-center text-[#5a5a75] p-3 hover:text-[#a8e8ff] active:scale-90 transition-all" href="wallet.html">
        <span class="material-symbols-outlined">account_balance_wallet</span>
        <span class="font-['Inter'] text-[10px] uppercase tracking-widest mt-1">Wallet</span>
    </a>
</nav>'''


def extract_main_content(html):
    """Extract the main content area from the source HTML, removing nav/aside/bottom-nav."""
    # Find <main> tag content
    main_match = re.search(r'(<main\b.*?</main>)', html, re.DOTALL)
    if main_match:
        return main_match.group(1)
    
    # For pages without <main> (like onboarding), get body content minus nav/aside
    body_match = re.search(r'<body[^>]*>(.*)</body>', html, re.DOTALL)
    if body_match:
        content = body_match.group(1)
        # Remove nav elements
        content = re.sub(r'<nav\b[^>]*>.*?</nav>', '', content, flags=re.DOTALL)
        # Remove aside elements 
        content = re.sub(r'<aside\b[^>]*>.*?</aside>', '', content, flags=re.DOTALL)
        # Remove header (top nav) elements
        content = re.sub(r'<header\b[^>]*class="[^"]*(?:fixed|sticky)[^"]*"[^>]*>.*?</header>', '', content, flags=re.DOTALL)
        return content.strip()
    
    return html


def fix_internal_links(content):
    """Replace placeholder links with actual page links."""
    # Replace # links in buttons/anchors that relate to specific pages
    replacements = {
        '{{DATA:SCREEN:SCREEN_27}}': 'index.html',
        '{{DATA:SCREEN:SCREEN_28}}': 'index.html',
        '{{DATA:SCREEN:SCREEN_10}}': 'wallet.html',
        '{{DATA:SCREEN:SCREEN_12}}': 'roster-lab.html',
        '{{DATA:SCREEN:SCREEN_31}}': 'global-leaderboard.html',
        '{{DATA:SCREEN:SCREEN_32}}': 'lineup.html',
        '{{DATA:SCREEN:SCREEN_41}}': 'subscription.html',
    }
    for placeholder, target in replacements.items():
        content = content.replace(placeholder, target)
    return content


def generate_page(filename, source_path, title, description, body_class_override=None):
    """Generate a unified page from source content."""
    src_file = os.path.join(SRC_BASE, source_path)
    
    with open(src_file, 'r', encoding='utf-8') as f:
        source_html = f.read()
    
    main_content = extract_main_content(source_html)
    main_content = fix_internal_links(main_content)
    
    body_class = body_class_override or ""
    body_extra = f" {body_class}" if body_class else ""
    
    # Special pages that don't need the standard nav
    skip_nav = filename in ['onboarding.html', 'roster-lab.html']
    
    page_html = f'''<!DOCTYPE html>
<html class="dark" lang="en">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>{title}</title>
    <meta name="description" content="{description}"/>
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <link rel="stylesheet" href="assets/css/style.css"/>
{TAILWIND_CONFIG}
</head>
<body class="bg-surface text-on-surface font-body min-h-screen{body_extra}">

'''
    
    if not skip_nav:
        page_html += TOP_NAV + '\n\n' + SIDE_NAV + '\n\n'
    
    page_html += main_content + '\n\n'
    
    if not skip_nav:
        page_html += BOTTOM_NAV + '\n\n'
    
    page_html += '''<script src="assets/js/main.js"></script>
</body>
</html>'''
    
    dest_file = os.path.join(DEST, filename)
    with open(dest_file, 'w', encoding='utf-8') as f:
        f.write(page_html)
    
    print(f"✅ Created: {filename}")


def main():
    for page_config in PAGES:
        try:
            generate_page(*page_config)
        except Exception as e:
            print(f"❌ Error creating {page_config[0]}: {e}")
    
    print(f"\n🎉 All {len(PAGES)} pages generated in {DEST}/")


if __name__ == '__main__':
    main()
