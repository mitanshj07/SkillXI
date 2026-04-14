/**
 * SkillXI Challenger Mode Controller
 * Handles 1v1 battle invitations and modal interactions.
 */

window.challengerMode = {
    init() {
        this.createModal();
    },

    createModal() {
        if (document.getElementById('challenger-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'challenger-modal';
        modal.className = 'challenger-modal-overlay';
        modal.innerHTML = `
            <div class="challenger-modal-content relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
                
                <div class="flex justify-between items-start mb-8">
                    <div class="flex items-center gap-4">
                        <div class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                            <span class="material-symbols-outlined text-4xl">swords</span>
                        </div>
                        <div>
                            <h2 class="font-headline font-black text-2xl text-white italic">CHALLENGE INVITE</h2>
                            <p class="text-[10px] text-primary font-bold uppercase tracking-[0.2em]">1v1 High-Stakes Battle</p>
                        </div>
                    </div>
                    <button onclick="window.challengerMode.close()" class="p-2 text-slate-500 hover:text-white transition-colors">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div class="space-y-6">
                    <div class="p-6 bg-surface-container-high rounded-2xl border border-white/5 text-center">
                        <p class="text-xs text-slate-400 mb-2 uppercase font-bold tracking-widest">Target Opponent</p>
                        <div class="flex items-center justify-center gap-4">
                            <img id="challenger-target-avatar" src="" class="w-12 h-12 rounded-full border border-primary/30">
                            <h3 id="challenger-target-name" class="font-headline font-bold text-xl text-white">---</h3>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="p-4 bg-surface-container-low rounded-xl border border-white/5">
                            <p class="text-[10px] text-slate-500 font-bold uppercase mb-1">Entry Fee</p>
                            <p class="font-headline font-black text-white">0.5 SOL</p>
                        </div>
                        <div class="p-4 bg-surface-container-low rounded-xl border border-white/5">
                            <p class="text-[10px] text-slate-500 font-bold uppercase mb-1">Prize Pool</p>
                            <p class="font-headline font-black text-tertiary">0.9 SOL</p>
                        </div>
                    </div>

                    <div class="p-4 rounded-xl bg-secondary/5 border border-secondary/20">
                        <div class="flex items-center gap-2 mb-2">
                             <span class="material-symbols-outlined text-secondary text-sm">info</span>
                             <p class="text-[10px] text-secondary font-bold uppercase">Battle Rules</p>
                        </div>
                        <p class="text-[11px] text-on-surface-variant leading-relaxed">
                            Points are calculated based on GW29 live performance. Winner takes all (minus 10% platform fee). Tie results in stake return.
                        </p>
                    </div>

                    <button id="send-challenge-btn" class="w-full py-4 bg-gradient-to-r from-primary to-secondary text-black font-headline font-black uppercase tracking-widest rounded-xl shadow-[0_10px_30px_rgba(168,232,255,0.2)] hover:scale-[1.02] transition-transform active:scale-95">
                        SEND CHALLENGE →
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('send-challenge-btn').onclick = () => this.send();
    },

    open(targetName, targetAvatar) {
        document.getElementById('challenger-target-name').innerText = targetName;
        document.getElementById('challenger-target-avatar').src = targetAvatar || 'https://lh3.googleusercontent.com/a/default-user';
        document.getElementById('challenger-modal').classList.add('active');
    },

    close() {
        document.getElementById('challenger-modal').classList.remove('active');
    },

    send() {
        const btn = document.getElementById('send-challenge-btn');
        btn.innerHTML = '<span class="animate-spin inline-block mr-2">🌀</span> SENDING...';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = '✅ CHALLENGE SENT';
            btn.classList.add('bg-tertiary/20', 'text-tertiary', 'border', 'border-tertiary/30');
            btn.classList.remove('from-primary', 'to-secondary');
            
            window.showWalletToast('Invitation sent to ' + document.getElementById('challenger-target-name').innerText, 'success');
            
            setTimeout(() => {
                this.close();
                // Reset button for next time
                setTimeout(() => {
                    btn.innerHTML = 'SEND CHALLENGE →';
                    btn.disabled = false;
                    btn.classList.remove('bg-tertiary/20', 'text-tertiary', 'border', 'border-tertiary/30');
                    btn.classList.add('from-primary', 'to-secondary');
                }, 500);
            }, 1500);
        }, 2000);
    }
};

// Auto-init
window.addEventListener('load', () => window.challengerMode.init());
