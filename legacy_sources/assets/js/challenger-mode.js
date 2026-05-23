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
            <div class="challenger-modal-content relative overflow-hidden bg-white border border-gray-100 rounded-[3rem] p-12 max-w-[550px] w-11/12 shadow-2xl text-gray-900">
                <div class="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>
                
                <div class="flex justify-between items-start mb-10">
                    <div class="flex items-center gap-5">
                        <div class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/5">
                            <span class="material-symbols-outlined text-4xl font-black">swords</span>
                        </div>
                        <div>
                            <h2 class="font-headline font-black text-3xl italic uppercase tracking-tighter">Invite Battle</h2>
                            <p class="text-[10px] text-primary font-black uppercase tracking-[0.2em]">High-Stakes Skill Match</p>
                        </div>
                    </div>
                </div>

                <div class="space-y-8">
                    <div class="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 text-center">
                        <p class="text-[10px] text-gray-400 mb-4 uppercase font-black tracking-widest">Target Opponent</p>
                        <div class="flex items-center justify-center gap-4">
                            <img id="challenger-target-avatar" src="" class="w-14 h-14 rounded-full border-2 border-white shadow-sm">
                            <h3 id="challenger-target-name" class="font-headline font-black text-2xl text-gray-900 uppercase italic">---</h3>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-6 text-center">
                        <div class="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
                            <p class="text-[10px] text-gray-400 font-black uppercase mb-1 tracking-widest">Entry Fee</p>
                            <p class="font-headline font-black text-gray-900 text-2xl tracking-tighter">0.5 SOL</p>
                        </div>
                        <div class="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
                            <p class="text-[10px] text-gray-400 font-black uppercase mb-1 tracking-widest">Prize Pool</p>
                            <p class="font-headline font-black text-primary text-2xl tracking-tighter">0.9 SOL</p>
                        </div>
                    </div>

                    <div class="p-6 rounded-[2rem] bg-primary/5 border border-primary/10">
                        <div class="flex items-center gap-2 mb-2">
                             <span class="material-symbols-outlined text-primary text-sm font-black">info</span>
                             <p class="text-[10px] text-primary font-black uppercase tracking-widest">Battle Rules</p>
                        </div>
                        <p class="text-[11px] text-gray-500 leading-relaxed font-medium">
                            Points based on latest match window. Winner takes all (90% payout). Ties result in stakes being returned.
                        </p>
                    </div>

                    <button id="send-challenge-btn" class="w-full py-5 bg-primary text-white font-headline font-black uppercase tracking-widest rounded-[2rem] hover:brightness-110 transition-all shadow-lg text-sm">
                        SEND CHALLENGE →
                    </button>
                    <button onclick="window.challengerMode.close()" class="w-full py-2 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-gray-900 transition-colors">Cancel Challenge</button>
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
            btn.style.color = 'white';
            
            if (window.logActivity) window.logActivity(myWallet, 'CHALLENGE_SENT', { target: isPublic ? 'GLOBAL' : this.targetWallet, stake });

            setTimeout(() => {
                if (isPublic && typeof closeCreateChallengeModal === 'function') closeCreateChallengeModal();
                else this.close();
                
                btn.innerHTML = originalHtml;
                btn.disabled = false;
                btn.style.background = ''; btn.style.color = '';
                
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
                <div class="col-span-full py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">No active open challenges. Issue one below!</p>
                </div>`;
            return;
        }

        container.innerHTML = '';
        challenges.forEach(ch => {
            const challenger = ch.profiles || { username: 'ANON', avatar_url: 'https://lh3.googleusercontent.com/a/default-user', skill_score: 500 };
            const card = document.createElement('div');
            card.className = "bg-white border border-gray-100 rounded-[3rem] p-10 hover:border-primary/40 transition-all group relative overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 duration-300";
            card.innerHTML = `
                <div class="absolute -top-6 -right-6 w-24 h-24 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-colors"></div>
                <div class="flex items-center gap-5 mb-10 relative z-10">
                    <img src="${challenger.avatar_url}" class="w-14 h-14 rounded-full border-2 border-white shadow-sm">
                    <div>
                        <h4 class="font-headline font-black text-xl uppercase italic text-gray-900 leading-tight tracking-tighter">${challenger.username}</h4>
                        <p class="text-[10px] text-primary font-black uppercase tracking-widest">Skill Score: ${challenger.skill_score}</p>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-6 mb-10">
                    <div class="text-center p-5 bg-gray-50 rounded-2xl border border-gray-100">
                        <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Stakes</p>
                        <p class="font-headline font-black text-gray-900 text-lg tracking-tighter">${ch.stake} SOL</p>
                    </div>
                    <div class="text-center p-5 bg-gray-50 rounded-2xl border border-gray-100">
                        <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Prize</p>
                        <p class="font-headline font-black text-primary text-lg tracking-tighter">${(ch.stake * 1.8).toFixed(1)} SOL</p>
                    </div>
                </div>
                <button onclick="window.challengerMode.acceptChallenge('${ch.id}')" class="w-full py-5 bg-primary text-white font-headline font-black rounded-2xl uppercase tracking-widest text-xs hover:shadow-lg transition-all shadow-md">
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
                if (payload.event === 'INSERT' && payload.new.target_id === myWallet) {
                    this.showIncomingChallenge(payload.new);
                }
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
            <div class="challenger-modal-content bg-white border border-gray-100 rounded-[3rem] p-12 max-w-[500px] w-11/12 text-center shadow-2xl">
                <div class="w-24 h-24 rounded-[2rem] bg-error/10 flex items-center justify-center text-error mx-auto mb-8">
                    <span class="material-symbols-outlined text-6xl font-black">swords</span>
                </div>
                <h2 class="font-headline font-black text-3xl uppercase italic mb-2 text-gray-900 tracking-tighter">Battle Request</h2>
                <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-10">Direct Challenge Received</p>
                
                <div class="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 mb-10">
                    <p class="text-[10px] text-gray-400 font-black uppercase mb-2 tracking-widest">Stakes Locked</p>
                    <p class="font-headline font-black text-gray-900 text-4xl tracking-tighter uppercase italic">${challenge.stake} SOL</p>
                </div>

                <div class="flex gap-6">
                    <button onclick="window.challengerMode.rejectChallenge('${challenge.id}')" class="flex-1 py-5 bg-gray-50 text-gray-400 font-headline font-black rounded-2xl hover:bg-gray-100 hover:text-gray-900 transition-all uppercase tracking-widest text-[11px]">Reject</button>
                    <button onclick="window.challengerMode.acceptChallenge('${challenge.id}')" class="flex-2 py-5 bg-primary text-white font-headline font-black rounded-2xl hover:shadow-lg transition-all uppercase tracking-widest text-[11px] px-12 shadow-md">Accept Battle</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    async acceptChallenge(id) {
        try {
            await _supabase.from('challenges').update({ status: 'accepted' }).eq('id', id);

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
    },

    async renderInvitations() {
        const container = document.getElementById('arena-invites');
        if (!container) return;
        container.innerHTML = '<div class="py-20 text-center text-gray-400 font-black uppercase text-[10px] tracking-widest italic">Fetching incoming challenges...</div>';
        
        try {
            const { data: challenges } = await _supabase.from('challenges').select('*').eq('status', 'pending').order('created_at', { ascending: false });
            container.innerHTML = '';
            if (!challenges || challenges.length === 0) {
                container.innerHTML = '<div class="py-20 text-center text-gray-400 font-black uppercase text-[10px] tracking-widest italic">No active invitations</div>';
                return;
            }
            challenges.forEach(c => {
                const div = document.createElement('div');
                div.className = 'bg-white border border-gray-100 rounded-[2rem] p-8 flex items-center justify-between shadow-sm hover:shadow-md transition-all mb-4';
                div.innerHTML = `
                    <div class="flex items-center gap-6">
                        <div class="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-black italic">VS</div>
                        <div>
                            <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Incoming Challenge</p>
                            <p class="text-lg font-black text-gray-900 uppercase italic">Stake: ${c.stake} SOL</p>
                        </div>
                    </div>
                    <div class="flex gap-4">
                        <button onclick="window.challengerMode.rejectChallenge('${c.id}')" class="px-6 py-3 rounded-xl border border-gray-100 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all">Decline</button>
                        <button onclick="window.challengerMode.acceptChallenge('${c.id}')" class="px-6 py-3 rounded-xl bg-primary text-white font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Accept</button>
                    </div>
                `;
                container.appendChild(div);
            });
        } catch (err) { console.error(err); }
    },

    async renderBattleHistory() {
        const container = document.getElementById('arena-history');
        if (!container) return;
        container.innerHTML = '<div class="py-20 text-center text-gray-400 font-black uppercase text-[10px] tracking-widest italic">Archiving duel logs...</div>';
        
        try {
            const { data: history } = await _supabase.from('challenges').select('*').in('status', ['accepted', 'rejected', 'completed']).order('updated_at', { ascending: false }).limit(10);
            container.innerHTML = '';
            if (!history || history.length === 0) {
                container.innerHTML = '<div class="py-20 text-center text-gray-400 font-black uppercase text-[10px] tracking-widest italic">No battle history found</div>';
                return;
            }
            history.forEach(h => {
                const statusColor = h.status === 'completed' ? 'text-primary' : (h.status === 'rejected' ? 'text-error' : 'text-gray-400');
                const div = document.createElement('div');
                div.className = 'bg-white border border-gray-100 rounded-[2.5rem] p-8 flex items-center justify-between opacity-80 mb-4';
                div.innerHTML = `
                    <div class="flex items-center gap-6">
                        <div class="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                            <span class="material-symbols-outlined text-gray-300">history</span>
                        </div>
                        <div>
                            <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Duel ID: ${h.id.slice(0,8)}</p>
                            <p class="text-sm font-black text-gray-900 uppercase italic">STAKE: ${h.stake} SOL</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-[9px] text-gray-300 font-black uppercase tracking-widest mb-1">${new Date(h.updated_at).toLocaleDateString()}</p>
                        <p class="text-xs font-black uppercase tracking-tighter ${statusColor}">${h.status}</p>
                    </div>
                `;
                container.appendChild(div);
            });
        } catch (err) { console.error(err); }
    }
};

window.addEventListener('load', () => {
    window.challengerMode.init();
    if (location.pathname.includes('challenger')) {
        window.challengerMode.renderHubLobby();
        
        const postBtn = document.getElementById('post-challenge-btn');
        if (postBtn) {
            postBtn.onclick = () => {
                const stake = window.currentStake || 0.5;
                window.challengerMode.send(stake, true);
            };
        }
    }
});
