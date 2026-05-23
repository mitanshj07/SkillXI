function updateTextByLabel(label, value, suffixSelector = 'h3') {
  const labels = Array.from(document.querySelectorAll('p, span, div'));
  const node = labels.find((item) => item.textContent?.trim() === label);
  if (!node) return;
  const parent = node.parentElement;
  const valueNode = parent?.querySelector(suffixSelector);
  if (valueNode) valueNode.textContent = value;
}
function syncProfilePage() {
  if (getPath() !== 'profile.html') return;
  getUserProfile().then((profile) => {
    const rankBadge = Array.from(document.querySelectorAll('span')).find((node) => (node.textContent || '').includes('Global Ranking:'));
    if (rankBadge) rankBadge.textContent = `Global Ranking: #${Math.max(120, 1000 - profile.skill_score)}`;

    const scoreNode = document.querySelector('h1.text-6xl.md\\:text-8xl.font-headline.font-extrabold.text-on-surface.tracking-tighter.skill-score-glow.mb-2');
    if (scoreNode) scoreNode.textContent = `${Math.round(profile.skill_score).toLocaleString()}`;

    const tierNode = Array.from(document.querySelectorAll('p')).find((node) => (node.textContent || '').includes('EXPERT TIER'));
    if (tierNode) {
      tierNode.innerHTML = `${profile.skill_score >= 900 ? 'ELITE TIER' : 'EXPERT TIER'} <span class="text-outline/50 ml-2">/ ${profile.reputation_score >= 80 ? 'TRUSTED' : 'BETA'}</span>`;
    }

    updateTextByLabel('Total Earned', formatUsd(profile.total_earned * USD_PER_SOL));
    updateTextByLabel('Win Rate', `${profile.win_rate.toFixed(1)}%`);
    updateTextByLabel('Squads Created', `${profile.contests_entered}`);
    updateTextByLabel('Active Contests', `${profile.active_contests}`);

    const chartBars = document.querySelectorAll('.relative.h-64.w-full .w-8');
    if (chartBars.length && profile.skill_score_history?.length) {
      profile.skill_score_history.slice(0, chartBars.length).forEach((value, index) => {
        const normalized = Math.max(25, Math.min(100, Math.round((value / 900) * 100)));
        if (chartBars[index]) chartBars[index].style.height = `${normalized}%`;
      });
    }
  });
}
function syncCopyTruths() {
  document.title = document.title.replace('Elite', 'Beta');

  const lineupPower = Array.from(document.querySelectorAll('p')).find((node) => (node.textContent || '').includes('Powered by Gemini AI'));
  if (lineupPower) {
    lineupPower.textContent = lineupPower.textContent.replace('Powered by Gemini AI', 'Powered by SkillXI beta context');
  }

  const chatPower = Array.from(document.querySelectorAll('p')).find((node) => (node.textContent || '').includes('● Online · Powered by Gemini AI'));
  if (chatPower) {
    chatPower.textContent = '● Online · Powered by live contest context';
  }

  const homeUmbra = Array.from(document.querySelectorAll('*')).find((node) => (node.textContent || '').includes('legacy privacy protocol copy'));
  if (homeUmbra) {
    homeUmbra.textContent = homeUmbra.textContent.replace('legacy privacy protocol copy. Your', 'ship private lineup reveal beta. Your');
  }

  const privacyHeadline = Array.from(document.querySelectorAll('p, div')).find((node) => (node.textContent || '').includes('legacy privacy headline'));
  if (privacyHeadline) {
    privacyHeadline.textContent = 'SkillXI beta currently focuses on hidden lineups, delayed reveal, and wallet-signed entry flows on Solana Devnet.';
  }

  const privacyBody = Array.from(document.querySelectorAll('p, div')).find((node) => (node.textContent || '').includes('Umbra breaks this link completely.'));
  if (privacyBody) {
    privacyBody.textContent = 'Without privacy controls, competitors can copy visible picks. SkillXI beta reduces that by hiding lineups until reveal where configured.';
  }

  const payoutTitle = Array.from(document.querySelectorAll('*')).find((node) => (node.textContent || '').includes('legacy payout privacy title'));
  if (payoutTitle) payoutTitle.textContent = 'Beta payout receipt';

  const payoutText = Array.from(document.querySelectorAll('*')).find((node) => (node.textContent || '').includes("Umbra's anonymity pool"));
  if (payoutText) payoutText.textContent = 'Payout states are currently beta-tracked inside SkillXI while settlement and monitoring mature.';
}

