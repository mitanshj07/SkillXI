/**
 * SkillXI Challenger Mode Controller
 * Handles 1v1 battle invitations and REAL Superbase interactions.
 * Expanded for Challenger Hub (Public Arena).
 */

window.challengerMode = {
    init() {
        this.createModal();
        this.listenForChallenges();
    },

    createModal() {
        if (document.getElementById('challenger-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'challenger-modal';
        modal.className = 'challenger-modal-overlay';
        modal.innerHTML = `
            <div class="challenger-modal-content relative overflow-hidden bg-[#131318] border border-white/10 rounded-[2.5rem] p-10 max-w-[500px] w-11/12 text-white">
                <div class="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                
                <div class="flex justify-between items-start mb-8">
                    <div class="flex items-center gap-4">
                        <div class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/5">
                            <span class="material-symbols-outlined text-4xl">swords</span>
                        </div>
                        <div>
                            <h2 class="font-headline font-black text-2xl italic uppercase">Invite Battle</h2>
                            <p class="text-[10px] text-primary font-bold uppercase tracking-[0.2em]">1v1 High-Stakes Skill Match</p>
                        </div>
                    </div>
                </div>

                <div class="space-y-6">
                    <div class="p-6 bg-white/5 rounded-2xl border border-white/5 text-center">
                        <p class="text-[10px] text-gray-500 mb-2 uppercase font-black tracking-widest">Target Opponent</p>
                        <div class="flex items-center justify-center gap-4">
                            <img id="challenger-target-avatar" src="" class="w-12 h-12 rounded-full border border-white/10">
                            <h3 id="challenger-target-name" class="font-headline font-bold text-xl text-white">---</h3>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4 text-center">
                        <div class="p-5 bg-white/5 rounded-2xl border border-white/5">
                            <p class="text-[10px] text-gray-500 font-bold uppercase mb-1 tracking-widest">Entry Fee</p>
                            <p class="font-headline font-black text-white text-lg">0.5 SOL</p>
                        </div>
                        <div class="p-5 bg-white/5 rounded-2xl border border-white/5">
                            <p class="text-[10px] text-gray-400 font-bold uppercase mb-1 tracking-widest">Prize Pool</p>
                            <p class="font-headline font-black text-primary text-lg">0.9 SOL</p>
                        </div>
                    </div>

                    <div class="p-5 rounded-2xl bg-white/5 border border-white/5">
                        <div class="flex items-center gap-2 mb-2">
                             <span class="material-symbols-outlined text-primary text-sm">info</span>
                             <p class="text-[10px] text-primary font-bold uppercase tracking-widest">Battle Rules</p>
                        </div>
                        <p class="text-[11px] text-gray-400 leading-relaxed font-medium">
                            Points based on latest match window. Winner takes all (90% payout). Ties result in stakes being returned.
                        </p>
                    </div>

                    <button id="send-challenge-btn" class="w-full py-4 bg-primary text-white font-headline font-black border-2 border-primary uppercase tracking-[0.2em] rounded-2xl hover:bg-transparent hover:text-primary transition-all active:scale-95">
                        SEND CHALLENGE →
                    </button>
                    <button onclick="window.challengerMode.close()" class="w-full py-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest">Cancel Challenge</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    open(targetName, targetAvatar, targetWallet) {
        this.targetWallet = targetWallet;
        document.getElementById('challenger-target-name').innerText = targetName;
        document.getElementById('challenger-target-avatar').src = targetAvatar || 'https://lh3.googleusercontent.com/a/default-user';
        
        const modal = document.getElementById('challenger-modal');
        modal.classList.add('active');
        document.getElementById('send-challenge-btn').onclick = () => this.send();
    },

    close() {
        document.getElementById('challenger-modal').classList.remove('active');
    },

    async send(stake = 0.5, isPublic = false) {
        const myWallet = window.localStorage.getItem('skillxi_wallet');
        if (!myWallet) return window.showWalletToast?.('Connect wallet first', 'error') || alert('Connect wallet first');

        const btn = isPublic ? document.getElementById('post-challenge-btn') : document.getElementById('send-challenge-btn');
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<span class="animate-spin inline-block mr-2">🌀</span> SECURING STAKES...';
        btn.disabled = true;

        try {
            const { data, error } = await _supabase.from('challenges').insert({
                challenger_id: myWallet,
                target_id: isPublic ? null : this.targetWallet,
                stake: stake,
                status: 'pending'
            });

            if (error) throw error;

            btn.innerHTML = '✅ CHALLENGE POSTED';
            btn.style.background = '#00D09C';
            btn.style.borderColor = '#00D09C';
            btn.style.color = 'white';
            
            if (window.logActivity) window.logActivity(myWallet, 'CHALLENGE_SENT', { target: isPublic ? 'GLOBAL' : this.targetWallet, stake });

            setTimeout(() => {
                if (isPublic && typeof closeCreateChallengeModal === 'function') closeCreateChallengeModal();
                else this.close();
                
                btn.innerHTML = originalHtml;
                btn.disabled = false;
                btn.style.background = ''; btn.style.borderColor = ''; btn.style.color = '';
                
                // Refresh Hub if on that page
                if (location.pathname.includes('challenger')) {
                    this.renderHubLobby();
                }
            }, 1500);

        } catch (err) {
            window.showWalletToast?.('Challenge failed: ' + err.message, 'error') || alert(err.message);
            btn.innerHTML = originalHtml;
            btn.disabled = false;
        }
    },

    async fetchPublicChallenges() {
        const { data, error } = await _supabase
            .from('challenges')
            .select(`
                *,
                profiles:challenger_id (username, avatar_url, skill_score)
            `)
            .is('target_id', null)
            .eq('status', 'pending')
            .order('created_at', { ascending: false });
        
        return data || [];
    },

    async renderHubLobby() {
        const container = document.getElementById('arena-lobby');
        if (!container) return;

        const challenges = await this.fetchPublicChallenges();
        if (challenges.length === 0) {
            container.innerHTML = `
                <div class="col-span-full py-20 text-center bg-white/5 rounded-3xl border border-white/5 border-dashed">
                    <p class="text-xs font-black text-gray-500 uppercase tracking-widest">No active open challenges. Issue one below!</p>
                </div>`;
            return;
        }

        container.innerHTML = '';
        challenges.forEach(ch => {
            const challenger = ch.profiles || { username: 'ANON', avatar_url: 'https://lh3.googleusercontent.com/a/default-user', skill_score: 500 };
            const card = document.createElement('div');
            card.className = "bg-white/5 border border-white/5 rounded-[2rem] p-8 hover:border-primary/40 hover:bg-primary/5 transition-all group relative overflow-hidden";
            card.innerHTML = `
                <div class="absolute -top-4 -right-4 w-20 h-20 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-colors"></div>
                <div class="flex items-center gap-4 mb-8">
                    <img src="${challenger.avatar_url}" class="w-12 h-12 rounded-full border border-white/10">
                    <div>
                        <h4 class="font-headline font-black text-lg uppercase italic text-white leading-tight">${challenger.username}</h4>
                        <p class="text-[9px] text-primary font-black uppercase tracking-widest">Skill Score: ${challenger.skill_score}</p>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4 mb-8">
                    <div class="text-center p-3 bg-black/20 rounded-xl">
                        <p class="text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-1">Stakes</p>
                        <p class="font-headline font-black text-white">${ch.stake} SOL</p>
                    </div>
                    <div class="text-center p-3 bg-black/20 rounded-xl">
                        <p class="text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-1">Prize</p>
                        <p class="font-headline font-black text-primary">${(ch.stake * 1.8).toFixed(1)} SOL</p>
                    </div>
                </div>
                <button onclick="window.challengerMode.acceptChallenge('${ch.id}')" class="w-full py-4 bg-primary text-white font-headline font-black rounded-xl uppercase tracking-widest text-[11px] hover:shadow-[0_0_20px_rgba(0,208,156,0.3)] transition-all">
                    ACCEPT BATTLE
                </button>
            `;
            container.appendChild(card);
        });
    },

    listenForChallenges() {
        const myWallet = window.localStorage.getItem('skillxi_wallet');
        if (!myWallet) return;

        _supabase
            .channel('public:challenges_updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'challenges' }, payload => {
                // If it's a new challenge for ME
                if (payload.event === 'INSERT' && payload.new.target_id === myWallet) {
                    this.showIncomingChallenge(payload.new);
                }
                // If the lobby changed, refresh it
                if (location.pathname.includes('challenger')) {
                    this.renderHubLobby();
                }
            })
            .subscribe();
    },

    showIncomingChallenge(challenge) {
        if (document.getElementById('incoming-challenge-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'incoming-challenge-modal';
        modal.className = 'challenger-modal-overlay active';
        modal.innerHTML = `
            <div class="challenger-modal-content bg-[#131318] border border-white/10 rounded-[2.5rem] p-10 max-w-[450px] w-11/12 text-center text-white">
                <div class="w-20 h-20 rounded-3xl bg-error/10 flex items-center justify-center text-error mx-auto mb-6">
                    <span class="material-symbols-outlined text-5xl">swords</span>
                </div>
                <h2 class="font-headline font-black text-2xl uppercase italic mb-2">Battle Request</h2>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-8">Direct Challenge Received</p>
                
                <div class="p-6 bg-white/5 rounded-2xl border border-white/5 mb-8">
                    <p class="text-[10px] text-gray-500 font-bold uppercase mb-1">Stakes Locked</p>
                    <p class="font-headline font-black text-white text-2xl">${challenge.stake} SOL</p>
                </div>

                <div class="flex gap-4">
                    <button onclick="window.challengerMode.rejectChallenge('${challenge.id}')" class="flex-1 py-4 bg-white/5 text-gray-500 font-headline font-black rounded-2xl hover:bg-white/10 transition-all uppercase tracking-widest text-xs">Reject</button>
                    <button onclick="window.challengerMode.acceptChallenge('${challenge.id}')" class="flex-2 py-4 bg-primary text-white font-headline font-black rounded-2xl hover:shadow-lg transition-all uppercase tracking-widest text-xs px-10">Accept Battle</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

            // Reputation & XP
            const myWallet = window.localStorage.getItem('skillxi_wallet');
            if (window.adjustReputation) await window.adjustReputation(myWallet, 1);
            if (window.calculateKineticXP) await window.calculateKineticXP(myWallet, 'CHALLENGE_ACCEPTED');

            if (window.logActivity) window.logActivity(myWallet, 'CHALLENGE_ACCEPTED', { challenge_id: id });
            
            if (location.pathname.includes('challenger')) this.renderHubLobby();
            
        } catch (err) {
            window.showWalletToast?.('Failed to accept: ' + err.message, 'error') || alert(err.message);
        }
    },

    async rejectChallenge(id) {
        try {
            await _supabase.from('challenges').update({ status: 'rejected' }).eq('id', id);
            
            const myWallet = window.localStorage.getItem('skillxi_wallet');
            if (window.adjustReputation) await window.adjustReputation(myWallet, -2);

            if (document.getElementById('incoming-challenge-modal')) document.getElementById('incoming-challenge-modal').remove();
            window.showWalletToast?.('Challenge declined', 'info');
        } catch (err) {
            console.error(err);
        }
    }
};

window.addEventListener('load', () => {
    window.challengerMode.init();
    if (location.pathname.includes('challenger')) {
        window.challengerMode.renderHubLobby();
        
        // Link the Post Challenge button in the Hub
        const postBtn = document.getElementById('post-challenge-btn');
        if (postBtn) {
            postBtn.onclick = () => {
                const stake = window.currentStake || 0.5;
                window.challengerMode.send(stake, true);
            };
        }
    }
});
