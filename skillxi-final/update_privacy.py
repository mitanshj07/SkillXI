import re

with open("privacy.html", "r") as f:
    content = f.read()

# Replace main content
privacy_main = """<main class="ml-0 lg:ml-64 pt-24 pb-24 px-4 md:px-12 relative min-h-screen overflow-hidden">
  <div style="max-width:1000px; margin:0 auto;">
    
    <!-- Title -->
    <div style="text-align:center; margin-bottom:48px;">
      <h1 style="color:#fff; font-size:42px; font-weight:800; font-family:'Space Grotesk',sans-serif; margin-bottom:16px;">
        🔐 Private by Default
      </h1>
      <p style="color:#a0a0b8; font-size:18px; line-height:1.6; max-width:700px; margin:0 auto;">
        SkillXI uses Umbra Privacy Protocol to keep your contest entries, lineups, and winnings completely confidential on Solana
      </p>
    </div>

    <!-- Section 1 -->
    <h2 style="color:#fff; font-size:24px; font-weight:700; margin-bottom:24px;">Why Privacy Matters in Fantasy Sports</h2>
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:24px; margin-bottom:56px;">
      
      <div style="background:#13131f; border:1px solid #1e1e30; border-radius:16px; padding:24px;">
        <h3 style="color:#fff; font-size:18px; font-weight:700; margin:0 0 12px;">🕵️ Nobody Sees Your Strategy</h3>
        <p style="color:#a0a0b8; font-size:14px; line-height:1.6; margin:0;">
          Without privacy, any competitor can watch your wallet on-chain and copy your lineup picks. Umbra breaks this link completely.
        </p>
      </div>

      <div style="background:#13131f; border:1px solid #1e1e30; border-radius:16px; padding:24px;">
        <h3 style="color:#fff; font-size:18px; font-weight:700; margin:0 0 12px;">💰 Private Prize Payouts</h3>
        <p style="color:#a0a0b8; font-size:14px; line-height:1.6; margin:0;">
          When you win, your prize arrives in your wallet privately. Nobody knows how much you earned or that you won at all.
        </p>
      </div>

      <div style="background:#13131f; border:1px solid #1e1e30; border-radius:16px; padding:24px;">
        <h3 style="color:#fff; font-size:18px; font-weight:700; margin:0 0 12px;">🔒 Anonymous Contest Entry</h3>
        <p style="color:#a0a0b8; font-size:14px; line-height:1.6; margin:0;">
          Your wallet address is never linked to your contest participation on the public blockchain. Your strategy stays yours.
        </p>
      </div>
    </div>

    <!-- Section 2 -->
    <h2 style="color:#fff; font-size:24px; font-weight:700; margin-bottom:24px;">How It Works</h2>
    <div style="display:flex; flex-direction:column; gap:16px; margin-bottom:56px;">
      
      <div style="background:rgba(124,58,237,0.05); border:1px solid rgba(124,58,237,0.2); border-radius:12px; padding:20px; display:flex; align-items:flex-start; gap:16px;">
        <div style="background:#9d5cf5; color:#fff; font-weight:bold; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0;">1</div>
        <div>
          <h4 style="color:#fff; font-size:16px; margin:0 0 4px;">Connect Wallet</h4>
          <p style="color:#a0a0b8; font-size:14px; margin:0;">You connect Phantom/Solflare.</p>
        </div>
      </div>

      <div style="background:rgba(124,58,237,0.05); border:1px solid rgba(124,58,237,0.2); border-radius:12px; padding:20px; display:flex; align-items:flex-start; gap:16px;">
        <div style="background:#9d5cf5; color:#fff; font-weight:bold; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0;">2</div>
        <div>
          <h4 style="color:#fff; font-size:16px; margin:0 0 4px;">Enter Umbra Pool</h4>
          <p style="color:#a0a0b8; font-size:14px; margin:0;">Your SOL enters Umbra's encrypted anonymity pool via SDK.</p>
        </div>
      </div>

      <div style="background:rgba(124,58,237,0.05); border:1px solid rgba(124,58,237,0.2); border-radius:12px; padding:20px; display:flex; align-items:flex-start; gap:16px;">
        <div style="background:#9d5cf5; color:#fff; font-weight:bold; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0;">3</div>
        <div>
          <h4 style="color:#fff; font-size:16px; margin:0 0 4px;">Compete Privately</h4>
          <p style="color:#a0a0b8; font-size:14px; margin:0;">Entry fees and lineup submissions are shielded from public view.</p>
        </div>
      </div>

      <div style="background:rgba(124,58,237,0.05); border:1px solid rgba(124,58,237,0.2); border-radius:12px; padding:20px; display:flex; align-items:flex-start; gap:16px;">
        <div style="background:#9d5cf5; color:#fff; font-weight:bold; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0;">4</div>
        <div>
          <h4 style="color:#fff; font-size:16px; margin:0 0 4px;">Receive Winnings</h4>
          <p style="color:#a0a0b8; font-size:14px; margin:0;">Prize paid to private Umbra address, unlinkable to public wallet.</p>
        </div>
      </div>
    </div>

    <!-- Section 3 -->
    <h2 style="color:#fff; font-size:24px; font-weight:700; margin-bottom:24px; text-align:center;">Powered By</h2>
    <div style="display:flex; justify-content:center; gap:20px; flex-wrap:wrap; margin-bottom:56px;">
      
      <div style="background:#13131f; border:1px solid #1e1e30; border-radius:12px; padding:16px 24px; box-shadow:0 0 20px rgba(0,212,255,0.05);">
        <h4 style="color:#fff; font-size:14px; margin:0; font-weight:700;">⚡ Built on Solana</h4>
      </div>
      
      <div style="background:#13131f; border:1px solid rgba(124,58,237,0.3); border-radius:12px; padding:16px 24px; box-shadow:0 0 20px rgba(124,58,237,0.1);">
        <h4 style="color:#fff; font-size:14px; margin:0; font-weight:700;">🔐 Umbra Privacy SDK</h4>
      </div>

      <div style="background:#13131f; border:1px solid rgba(0,255,136,0.2); border-radius:12px; padding:16px 24px; box-shadow:0 0 20px rgba(0,255,136,0.05);">
        <h4 style="color:#fff; font-size:14px; margin:0; font-weight:700;">🧠 Arcium MPC Network</h4>
      </div>
    </div>

    <!-- Section 4 -->
    <div style="background:rgba(0,255,136,0.05); border:1px solid rgba(0,255,136,0.3); border-radius:16px; padding:24px; text-align:center;">
      <h3 style="color:#00ff88; font-size:16px; font-weight:700; margin:0 0 12px; text-transform:uppercase; letter-spacing:1px;">✅ Compliance Ready</h3>
      <p style="color:#a0a0b8; font-size:14px; line-height:1.6; margin:0;">
        SkillXI's privacy implementation is compliance-ready. Umbra includes optional viewing keys for authorized auditors, meaning privacy and accountability can coexist. We follow all applicable regulations.
      </p>
    </div>

  </div>
</main>"""

new_content = re.sub(r'<main.*?</main>', privacy_main, content, flags=re.DOTALL)

with open("privacy.html", "w") as f:
    f.write(new_content)
