function skillxiBlinkActionUrl(contestId = getSelectedContestId()) {
  return window.location.origin + '/api/actions/join?contest=' + encodeURIComponent(contestId);
}
function skillxiBlinkShareUrl(contestId = getSelectedContestId()) {
  return 'https://dial.to/?action=' + encodeURIComponent(skillxiBlinkActionUrl(contestId));
}
async function skillxiShareBlink(contestId = getSelectedContestId()) {
  const blink = skillxiBlinkShareUrl(contestId);
  try {
    await navigator.clipboard.writeText(blink);
    window.showWalletToast('Contest Blink copied. Share it anywhere Solana Blinks are supported.', 'success');
  } catch (error) {
    window.prompt('Copy this SkillXI Contest Blink:', blink);
  }
}
function skillxiDownloadResultCard() {
  const canvas = document.createElement('canvas');
  canvas.width = 1200; canvas.height = 630;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
  gradient.addColorStop(0, '#07121a'); gradient.addColorStop(1, '#12251f');
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 1200, 630);
  ctx.fillStyle = '#a8e8ff'; ctx.font = 'bold 42px sans-serif'; ctx.fillText('SkillXI', 70, 90);
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 72px sans-serif'; ctx.fillText('I locked a private XI', 70, 210);
  ctx.fillStyle = '#00ff88'; ctx.font = 'bold 54px sans-serif'; ctx.fillText(currentContest().title, 70, 305);
  ctx.fillStyle = '#d8d8e8'; ctx.font = '32px sans-serif'; ctx.fillText('Wallet-native fantasy football on Solana Devnet', 70, 380);
  ctx.fillStyle = '#ffd166'; ctx.font = 'bold 34px sans-serif'; ctx.fillText('Captain: Erling Haaland  |  VC: Bukayo Saka', 70, 465);
  ctx.fillStyle = '#7c7c92'; ctx.font = '26px sans-serif'; ctx.fillText('skill-xi-two.vercel.app', 70, 555);
  const link = document.createElement('a');
  link.download = 'skillxi-result-card.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}
function skillxiShareOnX() {
  const text = encodeURIComponent('I just locked a private XI on SkillXI, wallet-native fantasy football on Solana.');
  window.open('https://twitter.com/intent/tweet?text=' + text + '&url=' + encodeURIComponent('https://skill-xi-two.vercel.app'), '_blank', 'noopener,noreferrer');
}

