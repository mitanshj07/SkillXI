// Wallet connect simulation
function connectWallet() {
  const btn = document.getElementById('walletBtn');
  if (btn.classList.contains('connected')) {
    btn.classList.remove('connected');
    btn.textContent = 'Connect Wallet';
  } else {
    btn.classList.add('connected');
    btn.textContent = '7xKp...3mNa ✓';
  }
}

// Mobile menu toggle
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
}

// Highlight active nav link
document.addEventListener('DOMContentLoaded', function() {
  const links = document.querySelectorAll('.nav-links a, .mobile-menu a');
  const current = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    if (link.getAttribute('href') === current) {
      link.style.color = '#00d4ff';
      link.style.borderBottom = '2px solid #00d4ff';
    }
  });
});
