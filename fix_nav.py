import os
import re

nav_content_light = """<nav class="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 pb-safe bg-white/95 backdrop-blur-2xl border-t border-gray-100 shadow-lg md:hidden z-50 rounded-t-[2.5rem]">
<a class="flex flex-col items-center justify-center text-gray-400 p-3 hover:text-primary transition-all __LOBBY_ACTIVE__" href="index.html">
<span class="material-symbols-outlined">sports_kabaddi</span>
<span class="font-['Inter'] text-[9px] font-black uppercase tracking-[0.2em] mt-1">Lobby</span>
</a>
<a class="flex flex-col items-center justify-center text-gray-400 p-3 hover:text-primary transition-all __INTEL_ACTIVE__" href="pre-match.html">
<span class="material-symbols-outlined">auto_awesome</span>
<span class="font-['Inter'] text-[9px] font-black uppercase tracking-[0.2em] mt-1">Intel</span>
</a>
<a href="lineup.html" class="flex flex-col items-center justify-center bg-primary text-white rounded-full p-4 -mt-10 shadow-lg active:scale-90 transition-all">
<span class="material-symbols-outlined text-3xl">add</span>
</a>
<a class="flex flex-col items-center justify-center text-gray-400 p-3 hover:text-primary transition-all __STATS_ACTIVE__" href="leaderboard.html">
<span class="material-symbols-outlined">analytics</span>
<span class="font-['Inter'] text-[9px] font-black uppercase tracking-[0.2em] mt-1">Stats</span>
</a>
<a class="flex flex-col items-center justify-center text-gray-400 p-3 hover:text-primary transition-all __PROFILE_ACTIVE__" href="profile.html">
<span class="material-symbols-outlined">person</span>
<span class="font-['Inter'] text-[9px] font-black uppercase tracking-[0.2em] mt-1">Profile</span>
</a>
</nav>"""

nav_content_dark = """<nav class="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 pb-safe bg-[#131318]/90 backdrop-blur-2xl md:hidden z-50 rounded-t-[2rem] border-t border-[#ffffff1a] shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
    <a class="bottom-nav-link flex flex-col items-center justify-center text-[#5a5a75] p-3 hover:text-[#a8e8ff] active:scale-90 transition-all __LOBBY_ACTIVE_DARK__" href="index.html">
        <span class="material-symbols-outlined">sports_kabaddi</span>
        <span class="font-['Inter'] text-[10px] uppercase tracking-widest mt-1">Lobby</span>
    </a>
    <a class="bottom-nav-link flex flex-col items-center justify-center text-[#5a5a75] p-3 hover:text-[#a8e8ff] active:scale-90 transition-all __INTEL_ACTIVE_DARK__" href="pre-match.html">
        <span class="material-symbols-outlined">auto_awesome</span>
        <span class="font-['Inter'] text-[10px] uppercase tracking-widest mt-1">Intel</span>
    </a>
    <a class="flex flex-col items-center justify-center bg-gradient-to-br from-[#a8e8ff] to-[#00d4ff] text-[#131318] rounded-full p-4 shadow-[0_0_20px_rgba(0,212,255,0.4)] active:scale-90 transition-all" href="lineup.html">
        <span class="material-symbols-outlined text-3xl">add_circle</span>
    </a>
    <a class="bottom-nav-link flex flex-col items-center justify-center text-[#5a5a75] p-3 hover:text-[#a8e8ff] active:scale-90 transition-all __STATS_ACTIVE_DARK__" href="leaderboard.html">
        <span class="material-symbols-outlined">analytics</span>
        <span class="font-['Inter'] text-[10px] uppercase tracking-widest mt-1">Stats</span>
    </a>
    <a class="bottom-nav-link flex flex-col items-center justify-center text-[#5a5a75] p-3 hover:text-[#a8e8ff] active:scale-90 transition-all __PROFILE_ACTIVE_DARK__" href="profile.html">
        <span class="material-symbols-outlined">person</span>
        <span class="font-['Inter'] text-[10px] uppercase tracking-widest mt-1">Profile</span>
    </a>
</nav>"""

files_to_update = [
    "ai-chat.html", "contests.html", "global-leaderboard.html", "index.html", 
    "leaderboard.html", "lineup.html", "match-lobby.html", "payout.html", 
    "player-analysis.html", "pre-match.html", "privacy.html", "profile.html", 
    "roster-lab.html", "subscription.html", "wallet.html"
]

def replace_nav(file_path):
    if not os.path.exists(file_path):
        return False
        
    with open(file_path, 'r') as f:
        content = f.read()
    
    is_dark_nav = file_path in ['index.html', 'global-leaderboard.html']
    nav = nav_content_dark if is_dark_nav else nav_content_light
    
    if file_path in ['index.html', 'contests.html', 'match-lobby.html']:
        nav = nav.replace('__LOBBY_ACTIVE__', 'bg-primary/10 text-primary rounded-2xl px-6 py-2')
        nav = nav.replace('__LOBBY_ACTIVE_DARK__', 'text-[#a8e8ff] font-bold')
    else:
        nav = nav.replace('__LOBBY_ACTIVE__', '')
        nav = nav.replace('__LOBBY_ACTIVE_DARK__', '')

    if file_path in ['pre-match.html', 'player-analysis.html', 'ai-chat.html']:
        nav = nav.replace('__INTEL_ACTIVE__', 'bg-primary/10 text-primary rounded-2xl px-6 py-2')
        nav = nav.replace('__INTEL_ACTIVE_DARK__', 'text-[#a8e8ff] font-bold')
    else:
        nav = nav.replace('__INTEL_ACTIVE__', '')
        nav = nav.replace('__INTEL_ACTIVE_DARK__', '')

    if file_path in ['leaderboard.html', 'global-leaderboard.html']:
        nav = nav.replace('__STATS_ACTIVE__', 'bg-primary/10 text-primary rounded-2xl px-6 py-2')
        nav = nav.replace('__STATS_ACTIVE_DARK__', 'text-[#a8e8ff] font-bold')
    else:
        nav = nav.replace('__STATS_ACTIVE__', '')
        nav = nav.replace('__STATS_ACTIVE_DARK__', '')

    if file_path in ['profile.html', 'wallet.html', 'subscription.html', 'payout.html', 'privacy.html', 'roster-lab.html']:
        nav = nav.replace('__PROFILE_ACTIVE__', 'bg-primary/10 text-primary rounded-2xl px-6 py-2')
        nav = nav.replace('__PROFILE_ACTIVE_DARK__', 'text-[#a8e8ff] font-bold')
    else:
        nav = nav.replace('__PROFILE_ACTIVE__', '')
        nav = nav.replace('__PROFILE_ACTIVE_DARK__', '')

    # Find the start
    start_idx = content.find('<nav class="fixed bottom-0')
    if start_idx == -1:
        start_idx = content.find('<div class="fixed bottom-0')
        if start_idx == -1:
            return False
            
    # Stack-based parse
    stack = []
    i = start_idx
    end_idx = -1
    while i < len(content):
        if content[i:i+2] == '</':
            end_tag_idx = content.find('>', i)
            close_tag = content[i+2:end_tag_idx].strip()
            if stack and stack[-1] == close_tag:
                stack.pop()
                if len(stack) == 0:
                    end_idx = end_tag_idx + 1
                    break
            i = end_tag_idx + 1
        elif content[i] == '<' and content[i:i+4] != '<!--':
            end_tag_idx = content.find('>', i)
            if end_tag_idx != -1 and content[end_tag_idx-1] != '/':
                space_idx = content.find(' ', i, end_tag_idx)
                if space_idx == -1:
                    open_tag = content[i+1:end_tag_idx].strip()
                else:
                    open_tag = content[i+1:space_idx].strip()
                
                if open_tag not in ['img', 'input', 'br', 'hr', 'meta', 'link']:
                    stack.append(open_tag)
            i = end_tag_idx + 1
        else:
            i += 1
            
    if end_idx != -1 and len(stack) == 0:
        new_content = content[:start_idx] + nav + content[end_idx:]
        with open(file_path, 'w') as f:
            f.write(new_content)
        print(f"Updated {file_path}")
        return True
    return False

for f in files_to_update:
    replace_nav(f)
