/**
 * SkillXI Challenger Mode Controller
 * Handles 1v1 battle invitations and REAL Superbase interactions.
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
            <div class="challenger-modal-content relative overflow-hidden bg-white border border-gray-100 rounded-[2.5rem] p-10 max-w-[500px] w-11/12">
                <div class="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                
                <div class="flex justify-between items-start mb-8">
                    <div class="flex items-center gap-4">
                        <div class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/5">
                            <span class="material-symbols-outlined text-4xl">swords</span>
                        </div>
                        <div>
                            <h2 class="font-headline font-black text-2xl text-gray-900 italic uppercase">Invite Battle</h2>
                            <p class="text-[10px] text-primary font-bold uppercase tracking-[0.2em]">1v1 High-Stakes Skill Match</p>
                        </div>
                    </div>
                </div>

                <div class="space-y-6">
                    <div class="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                        <p class="text-[10px] text-gray-400 mb-2 uppercase font-black tracking-widest">Target Opponent</p>
                        <div class="flex items-center justify-center gap-4">
                            <img id="challenger-target-avatar" src="" class="w-12 h-12 rounded-full border border-gray-100">
                            <h3 id="challenger-target-name" class="font-headline font-bold text-xl text-gray-900">---</h3>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4 text-center">
                        <div class="p-5 bg-white rounded-2xl border border-gray-100">
                            <p class="text-[10px] text-gray-400 font-bold uppercase mb-1 tracking-widest">Entry Fee</p>
                            <p class="font-headline font-black text-gray-900 text-lg">0.5 SOL</p>
                        </div>
                        <div class="p-5 bg-white rounded-2xl border border-gray-100">
                            <p class="text-[10px] text-gray-400 font-bold uppercase mb-1 tracking-widest">Prize Pool</p>
                            <p class="font-headline font-black text-primary text-lg">0.9 SOL</p>
                        </div>
                    </div>

                    <div class="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                        <div class="flex items-center gap-2 mb-2">
                             <span class="material-symbols-outlined text-primary text-sm">info</span>
                             <p class="text-[10px] text-primary font-bold uppercase tracking-widest">Battle Rules</p>
                        </div>
                        <p class="text-[11px] text-gray-500 leading-relaxed font-medium">
                            Points based on GW29 live performance. Winner takes all (90% payout). Ties result in stakes being returned.
                        </p>
                    </div>

                    <button id="send-challenge-btn" class="w-full py-4 bg-primary text-white font-headline font-black border-2 border-primary uppercase tracking-[0.2em] rounded-2xl hover:bg-white hover:text-primary transition-all active:scale-95">
                        SEND CHALLENGE →
                    </button>
                    <button onclick="window.challengerMode.close()" class="w-full py-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">Cancel Challenge</button>
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

    async send() {
        const myWallet = window.localStorage.getItem('skillxi_wallet');
        if (!myWallet) return window.showWalletToast('Connect wallet first', 'error');

        const btn = document.getElementById('send-challenge-btn');
        btn.innerHTML = '<span class="animate-spin inline-block mr-2">🌀</span> SECURING STAKES...';
        btn.disabled = true;

        try {
            // Real Supabase Insert
            const { data, error } = await _supabase.from('challenges').insert({
                challenger_id: myWallet,
                target_id: this.targetWallet,
                stake: 0.5,
                status: 'pending'
            });

            if (error) throw error;

            btn.innerHTML = '✅ CHALLENGE SENT';
            btn.style.background = '#00D09C';
            btn.style.borderColor = '#00D09C';
            btn.style.color = 'white';
            
            window.logActivity(myWallet, 'CHALLENGE_SENT', { target: this.targetWallet });

            setTimeout(() => {
                this.close();
                btn.innerHTML = 'SEND CHALLENGE →';
                btn.disabled = false;
                btn.style.background = ''; btn.style.borderColor = ''; btn.style.color = '';
            }, 1500);

        } catch (err) {
            window.showWalletToast('Challenge failed: ' + err.message, 'error');
            btn.innerHTML = 'SEND CHALLENGE →';
            btn.disabled = false;
        }
    },

    listenForChallenges() {
        const myWallet = window.localStorage.getItem('skillxi_wallet');
        if (!myWallet) return;

        _supabase
            .channel('public:challenges')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'challenges', filter: `target_id=eq.${myWallet}` }, payload => {
                this.showIncomingChallenge(payload.new);
            })
            .subscribe();
    },

    showIncomingChallenge(challenge) {
        if (document.getElementById('incoming-challenge-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'incoming-challenge-modal';
        modal.className = 'challenger-modal-overlay active';
        modal.style.background = 'rgba(255, 255, 255, 0.9)';
        modal.style.backdropFilter = 'blur(20px)';
        modal.innerHTML = `
            <div class="challenger-modal-content shadow-2xl bg-white border border-gray-100 rounded-[2.5rem] p-10 max-w-[450px] w-11/12 text-center">
                <div class="w-20 h-20 rounded-3xl bg-error/10 flex items-center justify-center text-error mx-auto mb-6">
                    <span class="material-symbols-outlined text-5xl">swords</span>
                </div>
                <h2 class="font-headline font-black text-2xl text-gray-900 uppercase italic mb-2">Battle Request</h2>
                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-8">From: ${challenge.challenger_id.slice(0,8)}...</p>
                
                <div class="p-6 bg-gray-50 rounded-2xl border border-gray-100 mb-8">
                    <p class="text-[10px] text-gray-400 font-bold uppercase mb-1">Stakes</p>
                    <p class="font-headline font-black text-gray-900 text-2xl">${challenge.stake} SOL</p>
                </div>

                <div class="flex gap-4">
                    <button onclick="window.challengerMode.rejectChallenge('${challenge.id}')" class="flex-1 py-4 bg-gray-100 text-gray-500 font-headline font-black rounded-2xl hover:bg-gray-200 transition-all uppercase tracking-widest text-xs">Reject</button>
                    <button onclick="window.challengerMode.acceptChallenge('${challenge.id}')" class="flex-2 py-4 bg-primary text-white font-headline font-black rounded-2xl hover:shadow-lg hover:brightness-110 transition-all uppercase tracking-widest text-xs px-10">Accept Battle</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    async acceptChallenge(id) {
        try {
            const { error } = await _supabase.from('challenges').update({ status: 'accepted' }).eq('id', id);
            if (error) throw error;
            
            window.showWalletToast('⚔️ Battle Accepted! Preparing arena...', 'success');
            document.getElementById('incoming-challenge-modal').remove();
            
            // Log activity
            const myWallet = window.localStorage.getItem('skillxi_wallet');
            window.logActivity(myWallet, 'CHALLENGE_ACCEPTED', { challenge_id: id });
            
        } catch (err) {
            window.showWalletToast('Failed to accept: ' + err.message, 'error');
        }
    },

    async rejectChallenge(id) {
        try {
            await _supabase.from('challenges').update({ status: 'rejected' }).eq('id', id);
            document.getElementById('incoming-challenge-modal').remove();
            window.showWalletToast('Challenge declined', 'info');
        } catch (err) {
            console.error(err);
        }
    }
};

window.addEventListener('load', () => window.challengerMode.init());
