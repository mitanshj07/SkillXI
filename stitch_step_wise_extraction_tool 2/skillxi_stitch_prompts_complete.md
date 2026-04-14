# SkillXI — Ultra-Detailed Google Stitch Prompts
### Copy-Paste Ready Prompts for Every Screen of the Website Frontend
> Use each prompt exactly as written in Google Stitch (stitch.withgoogle.com)
> Select Gemini 2.5 Pro (Experimental) mode for best results
> Generate each screen separately, then export HTML/CSS

---

## GLOBAL DESIGN SYSTEM (Read Before Starting)

Before generating any screen, establish this design system. Paste this as your FIRST prompt in a new Stitch project:

```
Create a design system document for a web3 AI fantasy sports platform called SkillXI.

BRAND NAME: SkillXI
TAGLINE: Skill Over Luck

COLOR PALETTE:
- Background primary: #0a0a0f (near black, very dark blue-black)
- Background secondary: #0f0f1a (slightly lighter dark)
- Background cards: #13131f (card surfaces)
- Background elevated: #1a1a2e (modals, dropdowns)
- Border subtle: #1e1e30 (very subtle borders)
- Border accent: #2a2a40 (card borders)
- Neon blue primary: #00d4ff (main accent, CTAs, highlights)
- Neon blue glow: rgba(0, 212, 255, 0.15) (glow backgrounds)
- Purple accent: #7c3aed (secondary accent, badges, icons)
- Purple light: #9d5cf5 (hover states purple)
- Purple glow: rgba(124, 58, 237, 0.15)
- Green success: #00ff88 (wins, positive, success states)
- Green glow: rgba(0, 255, 136, 0.15)
- Red danger: #ff4466 (losses, warnings, errors)
- Gold: #ffd700 (top ranks, trophies, captain badge)
- Silver: #c0c0c0 (second place)
- Bronze: #cd7f32 (third place)
- Text primary: #ffffff (headings, important text)
- Text secondary: #a0a0b8 (body text, descriptions)
- Text muted: #5a5a75 (placeholders, disabled)

TYPOGRAPHY:
- Font family: Inter (primary), Space Grotesk (display headings)
- Display heading: 48-64px, font-weight 800, Space Grotesk
- Section heading: 28-36px, font-weight 700, Inter
- Card heading: 18-22px, font-weight 600, Inter
- Body: 14-16px, font-weight 400, Inter
- Caption: 12px, font-weight 400, Inter
- Number large: 40-56px, font-weight 800, Space Grotesk, tabular nums
- Badge text: 10-12px, font-weight 700, uppercase, letter-spacing 0.05em

SPACING SYSTEM:
- Base unit: 4px
- Common spacing: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px
- Card padding: 20-24px
- Section padding: 64-80px vertical, 24px horizontal (mobile), 80px (desktop)
- Border radius: 8px (buttons), 12px (cards), 16px (large cards), 24px (modals)

EFFECTS:
- Card glow on hover: box-shadow 0 0 30px rgba(0, 212, 255, 0.1)
- Button glow: box-shadow 0 0 20px rgba(0, 212, 255, 0.4)
- Purple button glow: box-shadow 0 0 20px rgba(124, 58, 237, 0.5)
- Green success glow: box-shadow 0 0 20px rgba(0, 255, 136, 0.3)
- Glassmorphism card: background rgba(255,255,255,0.03), backdrop-filter blur(10px)
- Gradient overlay: linear-gradient(135deg, rgba(0,212,255,0.05), rgba(124,58,237,0.05))
- Neon border: border 1px solid rgba(0, 212, 255, 0.3)
- Text gradient: background: linear-gradient(135deg, #00d4ff, #7c3aed), -webkit-background-clip: text

COMPONENT PATTERNS:
- Primary button: bg #7c3aed, hover #9d5cf5, text white, rounded-lg, px-6 py-3, glow on hover
- Secondary button: border 1px solid #00d4ff, text #00d4ff, transparent bg, rounded-lg
- Ghost button: text #a0a0b8, no border, hover text white
- Input field: bg #13131f, border #2a2a40, focus border #00d4ff, text white, rounded-lg
- Badge: rounded-full, small text uppercase, various color combos
- Card: bg #13131f, border #1e1e30, rounded-xl, hover border #2a2a40 + glow

ICON STYLE: Lucide icons style, 20-24px, stroke-based, not filled

LOGO CONCEPT: 
"XI" text in gradient (blue to purple) with a small brain/neural network icon to the left,
or a shield shape containing a stylized "S" with a circuit/neural pattern.
Font: Space Grotesk, weight 800, gradient text from #00d4ff to #7c3aed

Show all colors, typography scales, button states, card styles in a clean design system sheet.
```

---

## SCREEN 1 — NAVIGATION BAR (Reusable Component)

```
Design a fixed top navigation bar for SkillXI, a dark-themed web3 AI fantasy sports platform.

LAYOUT: Full-width, fixed/sticky, height 72px desktop / 60px mobile
BACKGROUND: rgba(10, 10, 15, 0.95) with backdrop-filter blur(20px)
BORDER: border-bottom 1px solid #1e1e30
Z-INDEX: Always on top

LEFT SECTION:
- SkillXI logo: Brain/shield icon in neon blue (#00d4ff) followed by "Skill" in white + "XI" in gradient (#00d4ff to #7c3aed), Space Grotesk font, weight 800, size 24px
- Small glowing dot animation next to logo (live indicator, pulsing green)

CENTER SECTION (desktop only, hidden on mobile):
- Navigation links spaced evenly: "Contests" | "My Lineup" | "Leaderboard" | "AI Analyst" | "Reports"
- Active link: text #00d4ff with 2px underline bar in neon blue
- Inactive links: text #a0a0b8, hover text white
- Font: Inter 15px, font-weight 500
- Between "Leaderboard" and "AI Analyst" show a small "PRO" badge in purple (#7c3aed)

RIGHT SECTION:
- Wallet balance chip: shows "2.45 SOL" with a small Solana icon (purple circle ◎), bg #1a1a2e, rounded-full, border #2a2a40, text #a0a0b8 with SOL value in white
- "Connect Wallet" button: bg linear-gradient(135deg, #7c3aed, #9d5cf5), text white, rounded-lg, px-4 py-2, font-weight 600, size 14px, glow on hover
- Notification bell icon: #a0a0b8 with a small red dot indicator (2px)
- User avatar: 36px circle, gradient border (blue to purple), placeholder gradient inside

MOBILE (≤768px):
- Logo on left
- Hamburger menu icon on right (3 horizontal lines, #a0a0b8)
- Wallet button becomes icon-only (◎ symbol)
- Drawer menu slides in from right when hamburger clicked

STATE: Show both "not connected" (Connect Wallet button visible) and "connected" (wallet address truncated: 7xKp...3mNa) states side by side
```

---

## SCREEN 2 — HOME PAGE (Full Landing Page)

```
Design a complete full-length home/landing page for SkillXI — an AI-powered skill-based fantasy sports platform on Solana blockchain. Dark futuristic theme.

The page should have these sections from top to bottom:

━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1: HERO (viewport height, 100vh)
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Background: #0a0a0f with a subtle radial gradient glow in the center-top area: radial-gradient(ellipse at 50% -20%, rgba(124,58,237,0.15) 0%, transparent 60%)
Also: faint grid pattern overlay (dark lines forming a grid, very subtle opacity 0.03)
Also: floating orb shapes (blurred circles, very low opacity) — one neon blue blurred orb top-left, one purple orb bottom-right

Left column (60%):
- Small chip/badge at top: Icon of a lightning bolt + text "AI-Powered Fantasy Sports" — bg rgba(0,212,255,0.1), border rgba(0,212,255,0.2), text #00d4ff, rounded-full, px-4 py-1.5, font-size 13px
- Main headline (2 lines): "Earn Through" on line 1, "Your Sports Knowledge" on line 2
  - Font: Space Grotesk, weight 800, size 56-64px desktop / 36px mobile
  - "Earn Through" in white (#ffffff)
  - "Your Sports Knowledge" in gradient: linear-gradient(135deg, #00d4ff, #7c3aed), text-fill
- Subheadline below: "Join AI-powered fantasy contests on Solana. Research smarter, pick better, win bigger. Skill over luck — always."
  - Font: Inter, 18px, color #a0a0b8, line-height 1.7, max-width 480px
- Stats row (3 inline stats with dividers):
  [Trophy icon] "$2.4M+ Prizes Paid" | [Users icon] "48,000+ Players" | [Star icon] "94% Skill-Rated"
  Font 13px, #a0a0b8 labels, white values, dividers are #1e1e30 vertical lines
- CTA buttons row (spaced 12px apart):
  Button 1: "Start Competing →" — bg linear-gradient(135deg, #7c3aed, #9d5cf5), white text, rounded-lg, px-7 py-3.5, font-weight 700, 16px, glow: 0 0 30px rgba(124,58,237,0.5)
  Button 2: "Watch Demo ▶" — border 1px solid #2a2a40, text #a0a0b8, transparent bg, hover border #00d4ff hover text white, rounded-lg, px-7 py-3.5

Right column (40%):
- Animated preview card (mock-up of the app interface):
  Outer glow: box-shadow 0 0 60px rgba(0,212,255,0.15)
  Card: bg #13131f, border #1e1e30, rounded-2xl, size roughly 340px wide
  Inside the card show: mini football pitch (green field with white lines, top-down view), 
  6 small player token circles placed in formation positions (3 in defense, 2 in midfield, 1 forward visible),
  Each token: circular, player name, small avatar placeholder, AI score badge "9.2"
  Bottom of card: "AI Lineup Ready ✓" in green (#00ff88), "Lock In →" button in neon blue
  Card has subtle inner gradient overlay

Scroll indicator at very bottom center: chevron down icon, #5a5a75, subtle bounce animation

━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2: LIVE CONTESTS PREVIEW (Contest Cards Grid)
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Background: #0a0a0f (continue from hero)
Section header: Left-aligned "Live Contests" in white 32px Space Grotesk bold, with a green pulsing dot + "4 Active Now" badge (bg rgba(0,255,136,0.1), text #00ff88)
Right of header: "View All Contests →" text link in #00d4ff

Show 3 contest cards in a horizontal row (desktop), stacked on mobile:

CONTEST CARD ANATOMY (repeat 3 times with different data):
- Card bg: #13131f, border: 1px solid #1e1e30, border-radius 16px, padding 20px
- Hover state: border changes to rgba(0,212,255,0.3), box-shadow 0 0 30px rgba(0,212,255,0.08)
- Top row: Sport badge (green pill "⚽ FOOTBALL"), difficulty badge (right-aligned: "BEGINNER" in green, "PRO" in blue, "ELITE" in purple — use all 3 variants across 3 cards)
- Team matchup: "Manchester City" — small "VS" in #5a5a75 — "Arsenal" — Font 16px white bold
- Date/time: Calendar icon + "Tonight • 20:30 IST" — 12px #a0a0b8
- Divider line: #1e1e30
- Stats row (3 columns):
  "Prize Pool" label 11px #5a5a75, value "8.5 SOL" 20px white bold
  "Entry Fee" label, value "0.1 SOL" 20px #00d4ff bold
  "Players" label, value "142/200" 20px white bold
- Progress bar below Players: shows 142/200 fill, neon blue fill on #1e1e30 track, rounded, height 4px
- Bottom: "AI Lineup Ready" green badge on left | "Join Contest →" button right (bg #7c3aed, white text, rounded-lg, small)

Card 1 values: Man City vs Arsenal, 8.5 SOL prize, 0.1 SOL entry, 142/200, Beginner
Card 2 values: Real Madrid vs Barcelona, 45 SOL prize, 0.5 SOL entry, 89/100, Pro  
Card 3 values: PSG vs Bayern, 200 SOL prize, 2 SOL entry, 23/50, Elite (add "HOT" badge in red top-right)

━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3: HOW IT WORKS (Steps)
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Background: #0f0f1a (slightly different shade)
Section header centered: "How SkillXI Works" — white 36px bold
Subtitle centered: "From wallet to winnings in 4 steps" — #a0a0b8 16px

4 steps in a horizontal row with connecting dotted line between them:

Step 1: Icon circle (bg neon blue glow rgba(0,212,255,0.1), border rgba(0,212,255,0.2)) containing wallet icon #00d4ff 28px
Number badge: "01" top-left of circle, tiny, #00d4ff
Title: "Connect Wallet" — white 18px bold
Description: "Connect Phantom, Solflare or Backpack. Your SOL wallet is your identity." — #a0a0b8 14px centered, max 160px

Step 2: Icon = lightning bolt, color #7c3aed, bg purple glow
Title: "Join a Contest"
Description: "Browse live contests. Pick your difficulty. Pay the entry fee in SOL."

Step 3: Icon = brain/neural icon, color #00d4ff
Title: "Build AI Lineup"  
Description: "Our Claude AI analyst suggests the best players. Edit freely or use AI picks."

Step 4: Icon = trophy, color #ffd700
Title: "Win & Get Paid"
Description: "Smart contracts score your lineup and send winnings directly to your wallet."

Connecting arrows between each step: thin dashed line #2a2a40 with arrow direction

━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 4: AI ANALYST PREVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Background: #0a0a0f
Left side (50%): Text content
- Small badge: "Powered by Claude AI" — with Anthropic-style icon, purple pill
- Heading: "Your Personal AI Sports Analyst" — white 36px bold
- List of 5 features (each with checkmark icon in neon blue):
  ✓ Full lineup recommendations with detailed reasoning
  ✓ Player form, injury, and fixture difficulty analysis
  ✓ Captain & vice-captain picks with risk scores
  ✓ Differential (hidden gem) player suggestions
  ✓ Pre-match PDF reports for every fixture
- CTA button: "Try AI Analyst Free" — purple gradient, rounded-lg

Right side (50%): Mockup of AI analyst chat card
Card: bg #13131f, border #1e1e30, rounded-2xl, padding 24px
Header: "SkillXI AI Analyst" + brain icon (neon blue) + "PRO" badge purple
Chat bubbles (2 exchanges):
  User bubble (right-aligned, bg #1a1a2e, rounded-lg): "Who should I captain vs Arsenal?"
  AI bubble (left-aligned, bg rgba(0,212,255,0.05), border rgba(0,212,255,0.1), rounded-lg):
  "📊 Erling Haaland (Man City) is your best captain option.
  Form: 🔥 5 goals in last 4 games
  Fixture: Easy — Arsenal gave up 2.3 xGA last 3 home games
  Ownership: Only 34% in this contest — great differential
  Confidence Score: 9.1/10 ✅"
Input bar at bottom of card: placeholder "Ask anything about your lineup..." + send icon

━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 5: STATS / SOCIAL PROOF TICKER
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Background: #0f0f1a
Full-width horizontal scrolling ticker (like stock market ticker):
Items separated by diamond ◆: 
"🏆 Rahul W. won 12.5 SOL ◆ AI Lineup accuracy: 87% ◆ 2,847 contests completed ◆ ⚡ Live: Man City vs Arsenal — 142 joined ◆ 💰 $2.4M total prizes paid ◆ SkillXI named Top Web3 Sports App 2024 ◆"
Font: 14px, #a0a0b8, ticker scrolls left continuously
Full width, bg #0d0d18, border-top and border-bottom #1e1e30, padding 12px vertical

━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 6: SUBSCRIPTION PREVIEW (Teaser)
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Background: linear-gradient(135deg, rgba(124,58,237,0.05) 0%, rgba(0,212,255,0.05) 100%), #0a0a0f
Centered layout, max-width 800px

Eyebrow text: "SkillXI PRO" — purple badge centered
Heading: "Unlock the Full AI Advantage" — white 36px bold centered
Subtext: "Pro members win 3.2x more often. Get unlimited AI analysis, pre-match reports, and exclusive contests." — #a0a0b8 16px centered

Two plan cards side by side:
Card 1 (Pro): bg #13131f, border #7c3aed with 30% opacity, rounded-2xl, "MOST POPULAR" badge top-center (bg #7c3aed text white tiny)
Price: "$9.99" 40px bold white + "/month" 16px #a0a0b8
Or: "₹299/mo" below in smaller #5a5a75
Features: list of 6 items with purple checkmarks
CTA: "Upgrade to Pro" — purple gradient button full-width

Card 2 (Elite): bg #13131f, border #ffd700 30% opacity, rounded-2xl, "MAXIMUM POWER" badge (gold)
Price: "$24.99" 40px bold white + "/month" 
Features: list of 8 items with gold checkmarks, adds unlimited AI sessions
CTA: "Go Elite" — gold gradient button (from #ffd700 to #ff8c00)

━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 7: SUPPORTED SPORTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Heading: "Sports Available" centered white 28px
Subtitle: "More sports launching throughout 2025" #a0a0b8

Row of sport chips/cards:
[⚽ Football — LIVE badge green] [🏏 Cricket — COMING SOON badge gray] [🏀 Basketball — COMING SOON] [🎮 Esports — COMING SOON] [🎾 Tennis — COMING SOON]
Each: rounded-xl, bg #13131f, border #1e1e30, 120px wide, centered icon 32px + sport name 12px
LIVE sports: border rgba(0,255,136,0.3), icon in color

━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 8: FOOTER
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Background: #0a0a0f, border-top #1e1e30
4 columns:
Column 1: SkillXI logo + tagline "Skill Over Luck" + social icons (Twitter/X, Discord, Telegram) in #5a5a75 hover #00d4ff, 24px icons
Column 2: "Platform" heading — Contests, Leaderboard, AI Analyst, Reports, Subscription
Column 3: "Sports" heading — Football, Cricket (Soon), Basketball (Soon), Esports (Soon)
Column 4: "Legal & Support" heading — Terms of Service, Privacy Policy, FAQ, Contact Us, Security

Bottom bar: "© 2025 SkillXI. Built on Solana. Powered by Claude AI." left | "Solana logo + Anthropic logo" right
Both in #5a5a75 14px

Show entire page as one long scrollable design.
```

---

## SCREEN 3 — CONTEST BROWSER PAGE

```
Design a full-page contest browser for SkillXI, a dark web3 AI fantasy sports platform.

PAGE TITLE SECTION:
Background: #0a0a0f with radial gradient purple glow at top (subtle)
Breadcrumb: "Home / Contests" in #5a5a75 12px
H1: "Active Contests" 36px Space Grotesk bold white
Subtitle: "Join skill-based fantasy contests. AI-assisted lineup building. On-chain payouts." #a0a0b8 16px
Stats chips row: 
"🟢 14 Live Contests" (green pill) | "⏱ 6 Starting Soon" (yellow pill) | "🏆 142.5 SOL in Prizes" (purple pill)
Each pill: rounded-full, bg respective color with 10% opacity, border same color 20% opacity, text 13px bold

FILTER + SORT BAR:
Full-width bar: bg #0f0f1a, border-bottom #1e1e30, padding 16px 24px, sticky below navbar

Left: Sport filter tabs:
[All Sports ✓] [⚽ Football] [🏏 Cricket] [🏀 Basketball] [🎮 Esports]
Active tab: bg #7c3aed, white text, rounded-lg
Inactive: #a0a0b8 text, transparent bg, hover bg #1a1a2e

Middle: Difficulty chips:
[All] [Beginner] [Pro] [Elite]
Each: small pill, border #2a2a40, text #a0a0b8, active has colored bg

Right: Sort dropdown: "Sort by: Prize Pool ▼" — bg #13131f, border #2a2a40, text white, rounded-lg
And: "Entry Fee" range filter: "0.05 SOL — 5 SOL" slider

CONTESTS GRID:
2-column grid desktop, 1-column mobile, gap 20px, padding 24px

Design 8 detailed contest cards total (mix of sports/difficulties/states):

━━━ CONTEST CARD FULL DESIGN ━━━
Card dimensions: roughly 480px wide, auto height
bg: #13131f
border: 1px solid #1e1e30
border-radius: 16px
padding: 20px
transition on hover: border-color → rgba(0,212,255,0.25), box-shadow → 0 8px 40px rgba(0,212,255,0.08), transform translateY(-2px)

ROW 1 — TOP LABELS:
Left: Sport badge — rounded-full bg rgba(0,255,136,0.1) border rgba(0,255,136,0.2) text #00ff88 font-size 11px font-weight 700 uppercase letter-spacing 0.05em px-3 py-1 — "⚽ FOOTBALL"
Center: Match name — "Premier League" #5a5a75 12px
Right: Difficulty badge:
  Beginner: bg rgba(0,255,136,0.1), text #00ff88, border rgba(0,255,136,0.2)
  Pro: bg rgba(0,212,255,0.1), text #00d4ff, border rgba(0,212,255,0.2)
  Elite: bg rgba(124,58,237,0.1), text #9d5cf5, border rgba(124,58,237,0.2)
  (All rounded-full 11px uppercase bold)

ROW 2 — MATCH TEAMS:
Large team matchup area:
Left team: Team crest circle (36px, gradient placeholder bg) + Team name "Manchester City" 18px bold white
Center: "VS" in a hexagon shape or just bold text #5a5a75 20px  
Right team: Team crest circle + "Arsenal" 18px bold white
Below: "📅 Gameweek 28 · Tonight 20:30 IST · Premier League" — 12px #5a5a75

ROW 3 — KEY STATS (3 column grid):
Column 1 "Prize Pool":
  Label: "PRIZE POOL" 10px uppercase #5a5a75 letter-spacing 0.08em
  Value: "8.5 SOL" 24px Space Grotesk bold white
  Sub: "≈ $1,105" 12px #5a5a75
Column 2 "Entry Fee":
  Label: "ENTRY FEE"
  Value: "0.1 SOL" 24px bold #00d4ff (blue to indicate cost)
  Sub: "≈ $13"
Column 3 "Players":
  Label: "PLAYERS"
  Value: "142/200" 24px bold white
  Progress bar below: full width, height 5px, rounded, track #1e1e30, fill #00d4ff, fill at 71%

ROW 4 — AI INSIGHT STRIP:
Full-width strip: bg rgba(0,212,255,0.04), border-top #1e1e30, border-bottom #1e1e30, padding 10px 16px
Icon: brain icon in #00d4ff 16px
Text: "AI says: Haaland & Saka are must-haves this week. Low-ownership pick: Gündogan" — #a0a0b8 13px italic
"See Analysis →" link in #00d4ff

ROW 5 — DEADLINE COUNTDOWN:
"⏱ Locks in: 4h 23m 15s" — countdown with 3 small boxes each showing H/M/S:
Small boxes: bg #1a1a2e, rounded-md, 28px wide, text white 14px bold, label below 10px #5a5a75
Between boxes: ":" in #5a5a75

ROW 6 — BOTTOM ACTION ROW:
Left: Tags — "📊 Stats Available" (tiny chip) "🔒 Secure Escrow" (tiny chip) — both #5a5a75 bg #1a1a2e rounded px-2 py-0.5 text 11px
Right: Two buttons:
  "Preview →" — ghost button, border #2a2a40, text #a0a0b8, rounded-lg px-4 py-2 text 13px
  "Join Contest" — bg linear-gradient(135deg, #7c3aed, #9d5cf5), white text, rounded-lg px-5 py-2 text 14px font-weight 600, glow on hover

━━━ 8 CARD VARIATIONS TO SHOW ━━━
Card 1: Man City vs Arsenal | 8.5 SOL | 0.1 SOL entry | 142/200 | Beginner | 4h countdown
Card 2: Real Madrid vs Barcelona | 45 SOL | 0.5 SOL entry | 89/100 | Pro | 1h countdown | "HOT 🔥" badge top-right corner (red pill)
Card 3: PSG vs Bayern | 200 SOL | 2 SOL entry | 23/50 | Elite | 6h countdown | "NEW" badge in purple
Card 4: Liverpool vs Tottenham | 12 SOL | 0.15 SOL | 178/200 | Beginner | 2h countdown | "ALMOST FULL" warning orange pill
Card 5: Dortmund vs Man United | 30 SOL | 0.35 SOL | 45/100 | Pro | 8h countdown
Card 6: India vs Australia (Cricket) | 100 SOL | 1 SOL | 67/150 | Pro | 12h countdown | "🏏 CRICKET" badge
Card 7: Juventus vs Milan | 6 SOL | 0.08 SOL | 198/200 | Beginner | 30min countdown | "FILLING FAST ⚡" red warning
Card 8: Champions League Final (Special) | 500 SOL | 5 SOL | 11/50 | Elite | 24h countdown | "FEATURED ⭐" gold badge, card has gold border glow instead of blue

SIDEBAR (right 280px, desktop only):
━━━ SIDEBAR CONTENT ━━━
Card 1: "My Active Contests" — bg #13131f, shows 2 entered contests with current rank and points
Card 2: "Top Earners Today" — leaderboard mini with 3 users, avatars, earnings
Card 3: "AI Tip of the Day" — brain icon, blue border, short AI tip text
Card 4: "Referral Banner" — "Invite friends, earn 10% of their contest fees" — purple gradient card
```

---

## SCREEN 4 — AI LINEUP BUILDER (Core Feature Screen)

```
Design the main AI Lineup Builder page for SkillXI. This is the most important screen. Make it look premium, exciting, and functional.

PAGE LAYOUT: Split-screen horizontal on desktop (left: pitch + lineup, right: AI panel). Full-screen stacked on mobile.

━━━━━━━━━━━━━━━━━━━━━━━━━━━
LEFT PANEL (60% width) — FOOTBALL PITCH + LINEUP
━━━━━━━━━━━━━━━━━━━━━━━━━━━

TOP BAR ABOVE PITCH:
"Man City vs Arsenal · GW28 · Locks in 2h 47m" — white 14px
Right: Budget meter: "💰 Budget: 87.5 / 100 Credits" — green text remaining, red if over budget
Progress bar: budget used visualization

FOOTBALL PITCH:
Container: rounded-2xl overflow hidden, height roughly 520px desktop
Pitch background: dark green #1a3a1a with white line markings:
- Center circle (white outline)
- Center line horizontal
- Penalty boxes top and bottom (white outlines)
- Corner arc marks
- Overall pitch feel: realistic top-down view but dark themed

Pitch has subtle gradient: slightly lighter green in center fading to darker at edges
Subtle pattern: very faint grass stripe texture (alternating slightly different greens, very subtle)

FORMATION (4-3-3) — Player positions on pitch:

GK position (bottom center of pitch):
Player token: circular 64px, bg gradient (#1a1a2e to #0d0d1a), border 2px solid #2a2a40
Player photo placeholder: initials "AL" in gradient text
Player name: "Alisson" white 11px bold below circle
Team badge: tiny 14px circle badge bottom-right of player circle
Price: "6.5cr" — tiny #a0a0b8 below name
AI Score badge: "8.4" — small pill top-right of circle, bg rgba(0,212,255,0.9), text #0a0a0f font-weight 800 10px

DEF row (4 players across, slightly above GK):
Same token design for: "Alexander-Arnold (8.1)", "Van Dijk (7.9)", "Gabriel (8.6)", "Pedro Poro (7.2)"

MID row (3 players centered):
"Salah (9.4)", "Bellingham (9.1)", "Ødegaard (8.8)"

FWD row (3 players near top of pitch):
"Haaland (9.8)" — captain badge ©️ overlaid (gold C badge), "Saka (9.2)", "Son (8.5)"

Captain token special: Haaland's circle has gold border (2px solid #ffd700), gold glow box-shadow, small gold "C" badge overlay top-left
Vice captain: Saka has silver "V" badge

EMPTY SLOT (if player not selected): 
Dashed circle 64px, border 2px dashed #2a2a40, center "+" icon #5a5a75, "Add Player" text 10px #5a5a75 below

Floating "Swap" mini-buttons appear on hover of each token (small, top of circle)

━━━ BELOW PITCH ━━━
Row of 3 action buttons:
"🔄 Auto-Fill AI" — bg rgba(0,212,255,0.1), border rgba(0,212,255,0.3), text #00d4ff, rounded-lg
"👁 Preview Lineup" — ghost button
"🔒 Lock Lineup" — bg linear-gradient(135deg, #00ff88, #00cc66), text #0a0a0f font-weight 700, rounded-lg — most prominent button

Formation selector: small pills below: "4-3-3 ✓" "4-4-2" "3-5-2" "4-2-3-1" — select active pill in purple

━━━━━━━━━━━━━━━━━━━━━━━━━━━
RIGHT PANEL (40% width) — AI ANALYST PANEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━

Panel bg: #0f0f1a, border-left 1px solid #1e1e30, full height, scrollable

Panel Header:
"🤖 AI Analyst" title 18px bold white left
"PRO" badge purple right
Sub: "Powered by Claude AI" #5a5a75 12px
Refresh button (circular arrow) #a0a0b8 right

TABS inside panel:
[Lineup Picks] [Player Search] [Match Report] [Differentials]
Active tab: bottom border #00d4ff, text white. Inactive: #5a5a75

━━━ TAB 1: LINEUP PICKS ━━━
Team summary strip:
bg rgba(0,212,255,0.04), rounded-xl, border rgba(0,212,255,0.1), padding 12px
"Your team looks strong ✅" — #00ff88 14px bold
"Budget efficiency: 87%" | "Avg AI Score: 8.9" | "Risk: Medium" — 3 micro stats in #a0a0b8 12px

AI reasoning cards (scrollable list, 4-5 visible):

Each reasoning card:
bg #13131f, border #1e1e30, rounded-xl, padding 12px, margin-bottom 8px

Card content:
Row 1: Player name "Erling Haaland" 14px bold white + position badge "FWD" rounded purple tiny + "9.8 AI" blue pill
Row 2: Captain badge "⭐ CAPTAIN PICK" — gold tiny uppercase bold
Row 3: Reason text: "5 goals in last 4 games. Arsenal gave up 2.3 xGA at home last 3 fixtures. High ownership risk at 62%, but ceiling is enormous." — 12px #a0a0b8, line-height 1.6
Row 4: Mini stats chips: "🔥 Form 5/5" (green) | "✅ Fit" (green) | "⚡ Fixture 9/10" (blue)
Bottom row: "Remove" ghost tiny button right

Captain/Vice-captain selector section:
Label: "Set Captain" white 13px bold
Two player chips side by side with "C" and "VC" labels — selectable, currently: Haaland (C) and Saka (VC)

━━━ TAB 2: PLAYER SEARCH ━━━
Search input: "Search players..." — bg #13131f, border #2a2a40, focus border #00d4ff, text white, rounded-lg, search icon left

Filter row: [All Positions] [GK] [DEF] [MID] [FWD] — small pills
Price sort: [Cheapest] [Most Expensive] | AI Sort: [Highest AI Score]

Player list (5-6 rows):
Each row: player photo circle 40px | Name + Team 13px | Position tiny badge | Price "6.5cr" | AI Score pill | "Add +" button right in #7c3aed

Highlight: if player is already in team, row has green left border and "Added ✓" instead of "Add +"

━━━ DIFFERENTIAL PICKS SECTION (inside panel, below) ━━━
Section title: "💎 AI Differentials" — neon blue 14px bold
Subtitle: "Low-owned, high-upside picks" — #5a5a75 12px

2 differential pick cards:
Card bg: rgba(124,58,237,0.05), border rgba(124,58,237,0.2), rounded-xl, padding 12px
"💎 Differential Pick" label #9d5cf5 10px uppercase bold
Player name "Bruno Fernandes" 15px white bold
"Only 8.2% ownership in this contest" — #5a5a75 12px
AI verdict: "Undervalued given Man City's injury crisis in midfield. Could be the captaincy differential." — #a0a0b8 12px
"Add to Team" button purple outline small
```

---

## SCREEN 5 — PLAYER ANALYSIS DETAIL CARD (Popup/Modal)

```
Design a player analysis detail modal/card for SkillXI that appears when a user taps a player.

MODAL OVERLAY:
Background overlay: rgba(0,0,0,0.8) with backdrop-filter blur(8px) covering the page
Modal card: centered, max-width 520px, bg #13131f, border 1px solid #2a2a40, border-radius 24px, padding 0 (sections have own padding)

━━━ MODAL TOP SECTION ━━━
Background: linear-gradient(135deg, rgba(0,212,255,0.08), rgba(124,58,237,0.08))
Padding: 24px
Close button: X icon top-right, #5a5a75, hover #ffffff

Row 1: Player visual area
Left: Player avatar circle 72px — gradient bg (team colors), initials "EH", team badge tiny circle overlay bottom-right
Right: Player details:
  Name: "Erling Haaland" 22px bold white Space Grotesk
  Team + League: "Manchester City · Premier League" #a0a0b8 14px
  Position badge: "FWD" — rounded-full bg rgba(124,58,237,0.2) text #9d5cf5 bold 12px
  Price: "💰 12.5 Credits" — white 13px
  
Injury status badge (prominent): 
  Green: "✅ FULLY FIT" — bg rgba(0,255,136,0.1), border rgba(0,255,136,0.2), text #00ff88, rounded-full px-3 py-1 bold 12px
  Amber: "⚠️ SLIGHT DOUBT" — yellow colors
  Red: "🚫 RULED OUT" — red colors
  Show "✅ FULLY FIT" for Haaland

━━━ AI VERDICT BANNER ━━━
Full-width strip: bg rgba(0,212,255,0.06), border-top and border-bottom rgba(0,212,255,0.1), padding 12px 24px
Left: brain icon #00d4ff 20px
Center: "AI Verdict: MUST HAVE" — #00d4ff 14px bold uppercase
Right: AI confidence score: "9.8" in large bold white with "/10" smaller #a0a0b8, circle gauge around it (neon blue stroke showing 98% fill)

━━━ TABS ━━━
[Overview] [Stats] [Fixtures] [History]
Tab bar: border-bottom #1e1e30, padding 0 24px
Active: bottom border #00d4ff 2px text white. Inactive: #5a5a75

━━━ OVERVIEW TAB CONTENT (padding 24px) ━━━

FORM (last 5 games):
Label: "RECENT FORM" 11px uppercase #5a5a75 letter-spacing bold
5 circular dots in a row, each 32px:
  W = bg #00ff88 text #0a0a0f "W" bold — won/scored
  D = bg #ffd700 text #0a0a0f "D" — drew/clean sheet
  L = bg #ff4466 text white "L" — poor match
For Haaland: W(G2) W(G1) W(A1) D W(G3) — show points scored inside each dot instead

Points for each dot: tiny number below dot showing fantasy points scored (12, 9, 14, 6, 18)

KEY STATS grid (2x3 grid of stat cards):
Each stat cell: centered, border-right and border-bottom #1e1e30
  "Goals" → "5" (large white) + "Last 4 games" (#5a5a75 11px)
  "Assists" → "2" + "Last 4 games"
  "xG" → "4.8" + "Expected Goals"
  "Shots" → "18" + "Last 4 games" 
  "Minutes" → "340" + "played"
  "FPL Pts" → "74" + "This season"

EXPECTED POINTS:
"Expected Points This Week" label
Range visualization: 
  Minimum: "6" in gray | bar fills from left | Maximum: "28" in green | Likely: marker at "16" position in blue
  Below: "Most likely: 14-18 points" #a0a0b8 13px

OWNERSHIP:
"Contest Ownership" label
Horizontal bar: neon blue fill at 62%, text "62% of players have Haaland" #a0a0b8 13px
AI tip: "High ownership means safe but lower advantage. Consider as captain only if confident." italic #5a5a75 12px

AI ANALYSIS TEXT:
Small section with brain icon heading:
"Erling Haaland is the standout captain option for this fixture. Arsenal's high defensive line leaves them exposed to through balls — exactly what Haaland thrives on. His aerial dominance (78% win rate) is a bonus from set pieces. The only concern is tactical rotation risk given a UCL match 3 days later."
Font: 13px #a0a0b8, line-height 1.7, bg rgba(0,212,255,0.03) rounded-xl padding 12px border rgba(0,212,255,0.08)

FIXTURE DIFFICULTY:
"Next 5 Fixtures" label
5 small fixtures in a row: each showing opponent abbreviation + difficulty color dot:
ARS (Easy 🟢) | BHA (Easy 🟢) | MCI-UCL (Hard 🔴) | NEW (Med 🟡) | BUR (Easy 🟢)

━━━ BOTTOM ACTION BAR ━━━
Sticky bottom strip: bg #0a0a0f, border-top #1e1e30, padding 16px 24px
"Make Captain" button: gold border, gold text "#ffd700", transparent bg, rounded-lg flex-1
"Add to Team" button: bg linear-gradient(135deg, #7c3aed, #9d5cf5), white text, rounded-lg flex-1, font-weight 700
(If already in team, "Add to Team" becomes "Remove from Team" in red outline)
```

---

## SCREEN 6 — LIVE LEADERBOARD PAGE

```
Design a live contest leaderboard page for SkillXI. This screen shows the real-time rankings during an active match.

PAGE HEADER:
bg: #0a0a0f
Breadcrumb: "Contests / Man City vs Arsenal / Leaderboard" — #5a5a75 12px

Contest title bar:
Left: "⚽ Man City vs Arsenal" — white 24px bold | "GW28 · Premier League" #a0a0b8 14px
Right: Live score widget: 
  "MCI 2 — 1 ARS" displayed in a score badge
  bg #13131f, border #1e1e30, rounded-xl, padding 8px 16px
  "MCI" white 13px | "2" neon blue 22px bold | "—" #5a5a75 | "1" 22px bold white | "ARS" white 13px
  "LIVE ●" pulsing red dot 12px text below center, "74'" minute

Stats row below title:
"🏆 Prize Pool: 8.5 SOL" | "👥 142 Players" | "💰 Top Prize: 3.5 SOL" | "⏱ Ends: 90 - 74 = 16min"
Chips in row, #5a5a75 text, #13131f bg, border #1e1e30, rounded-full

MY POSITION HIGHLIGHT (pinned at top of table):
bg: rgba(0,212,255,0.06), border: 1px solid rgba(0,212,255,0.2), rounded-xl, padding 12px 20px, margin-bottom 16px
"YOUR CURRENT POSITION" #00d4ff 11px uppercase bold left
Row: "#7" in neon blue 28px bold Space Grotesk | Your avatar + "You" | "127 pts" white 20px bold | "In prize zone ✅" green chip | prize amount "0.8 SOL" green 16px bold right
Mini arrow up: "↑ 3 positions since half time" #00ff88 12px

LEADERBOARD TABLE:
Table bg: #0f0f1a, border #1e1e30, rounded-2xl overflow hidden

Table header row: bg #13131f
Columns: "RANK" | "PLAYER" | "CAPTAIN" | "POINTS" | "PRIZE" | "LIVE"
Each header: 11px uppercase #5a5a75 letter-spacing 0.08em font-weight 700

Table rows (show 15 rows):
Row height: 56px
Even rows: bg transparent. Odd rows: bg rgba(255,255,255,0.01)
Hover: bg rgba(0,212,255,0.03)
Border-bottom: #1e1e30

RANK COLUMN (60px):
#1: Gold crown icon 🏆 or "1" with golden bg circle, glow
#2: Silver medal / "2" silver circle
#3: Bronze / "3" bronze circle
#4-10: "#N" in white with tiny rank badge, left-aligned, gray bg pill
#7 (your row): special highlight — neon blue pill with "#7" text

PLAYER COLUMN (flex 1):
Avatar circle 36px (gradient placeholder) + Username text "Crypto_Analyst_99" 14px white bold + small flag emoji "🇮🇳" + "PRO" badge tiny purple if subscribed

CAPTAIN COLUMN (120px):
Shows captain name: "Haaland" 13px white + captain points: "(×2) 38pts" green text small

POINTS COLUMN (100px):
Live points: "186" in white 20px bold Space Grotesk tabular
Points below: "+12" green or "-4" red (change since last update, with up/down arrow)
Tiny "updating..." animation or last updated "23 sec ago" in #5a5a75 10px

PRIZE COLUMN (100px):
Current prize if finished now: "3.5 SOL" #ffd700 (top 3) or "0.8 SOL" green (prize zone) or "—" gray (out of prizes)
Prize zone indicator: small trophy icon before amount for prize positions

LIVE COLUMN (80px):
Progress bar: horizontal, shows % of players' match remaining
Or: mini sparkline chart showing points over match time
"+" animation when points just added

SPECIAL ROW STYLES:
Top 3 rows: left border 3px (gold/silver/bronze), subtle bg glow matching their medal color
Your row (#7): left border 3px neon blue, bg rgba(0,212,255,0.04), row is highlighted
Prize cutoff row: dashed line after row #20 (prize zone ends), label "Prize Zone ↑" on left

MATCH EVENTS SIDEBAR (right 260px, desktop):
Title: "📡 Live Match Feed" 14px white bold
Events list (scrollable):
Each event: time chip + description
"74' 🥅 GOAL — Haaland (Man City)" — green border, bg rgba(0,255,136,0.05)
"68' 🟡 Yellow Card — Saliba" — yellow border
"63' 🔄 Sub: De Bruyne → Doku" — gray border
"45' ⚽ Half Time: MCI 1-1 ARS" — separator
"23' 🥅 GOAL — Saka (Arsenal)" — green border

Point update ticker below: "📈 Haaland just scored! +12 pts for captains (+6 for others)" — #00ff88 animated

BOTTOM: Refresh button + "Live scores refresh every 30s" disclaimer
```

---

## SCREEN 7 — PAYOUT / RESULTS PAGE

```
Design the contest results and payout screen for SkillXI. This appears after a contest ends. Make it feel celebratory and satisfying.

FULL PAGE — CELEBRATION STATE (user won prizes)

BACKGROUND:
#0a0a0f with animated particle effect (small dots/stars floating upward slowly, very subtle)
Radial glow at top-center: rgba(255,215,0,0.08) for gold celebration feel

━━━ RESULT HERO SECTION ━━━
Centered, padding 60px top

Position announcement:
Large "#2" — Space Grotesk 120px font-weight 800
Text gradient: linear-gradient(135deg, #c0c0c0, #a0a0a0) [silver for 2nd place]
(If 1st: gold gradient, if 3rd: bronze gradient, if outside prizes: white/gray)

Below the number:
"FINAL RANK" — 13px uppercase #5a5a75 letter-spacing 0.15em
Out of: "of 142 Players" — 16px #a0a0b8

Trophy emoji or icon (SVG trophy, 64px) — silver color for 2nd, gold for 1st

Contest name: "Man City vs Arsenal · GW28" — 18px white below trophy
Final score: "Your lineup scored 219 pts" — #a0a0b8 16px

━━━ PRIZE ANNOUNCEMENT ━━━
Large prize card: bg linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,140,0,0.05)), border 1px solid rgba(255,215,0,0.2), rounded-2xl, padding 32px, max-width 400px centered

"YOU WON" — 14px uppercase #ffd700 letter-spacing 0.1em font-weight 700
Prize amount: "4.5 SOL" — Space Grotesk 64px font-weight 800 color #ffd700
USD equivalent: "≈ $585.00" — 18px #a0a0b8 below
Status: "✅ Sent to your wallet" — #00ff88 14px bold

Wallet confirmation strip below:
bg rgba(0,255,136,0.05), border rgba(0,255,136,0.1), rounded-xl, padding 12px 20px
"Wallet: 7xKp...3mNa" left | "Txn: 5kXm...9pQ2 (Solana)" right as clickable link → Solscan

━━━ SKILL SCORE UPDATE ━━━
Skill score card: bg #13131f, border #1e1e30, rounded-2xl, padding 24px, max-width 400px centered, margin top 24px

Left: "Your Skill Score" label + before/after
  Before: "1,240" in gray strikethrough
  Arrow → right
  After: "1,337" in neon blue bold 32px
  Change: "+97 points" in #00ff88 with up arrow
  
Right: Circular gauge (donut chart style):
  Outer ring: neon blue stroke, showing score percentile
  Center: "Top 8%" white bold
  Label below: "Better than 92% of players"

━━━ PERFORMANCE BREAKDOWN ━━━
Section: "Your Performance" — white 20px bold

2-column stat grid:
"Best Player" | "Haaland — 42pts ⭐" (captain bonus)
"Worst Player" | "Pedro Poro — 2pts"  
"AI Accuracy" | "8/11 picks were top scorers"
"Captain Pick" | "✅ Correct (34% chose Haaland)"
"Differential" | "Bruno Fernandes 19pts (only 8% ownership)"
"Entry Fee Paid" | "0.1 SOL"
"Profit" | "+4.4 SOL" in green

Each pair: label #5a5a75 13px | value white 14px bold, border-bottom #1e1e30 between pairs

━━━ WINNING LINEUP DISPLAY ━━━
"Your Winning Lineup" — white 18px bold
Small pitch view (compact, 300px tall):
Show the 11 player tokens on pitch positions
Each token now shows: player name + actual points scored (green for high, red for low)
Haaland shows gold crown + "C 42pts"
Hover tooltip shows breakdown

━━━ SHARE RESULT SECTION ━━━
"Share Your Win" — white 16px bold, centered

Preview of shareable card (160x100px preview):
Dark card with SkillXI logo, "#2 of 142", "Won 4.5 SOL", lineup top 3 players, user's username
Gold border glow on preview card

Share buttons row:
[🐦 Share on X] — bg #000000 border #333, text white, rounded-lg
[💬 Share on WhatsApp] — bg #25D366 text white, rounded-lg
[📋 Copy Result Card] — bg #13131f border #2a2a40 text white, rounded-lg

━━━ NEXT ACTIONS ━━━
Bottom: 2 prominent buttons centered
"🎮 Play Again" — bg linear-gradient(135deg, #7c3aed, #9d5cf5), white text, rounded-xl, px-8 py-4, font-weight 700, glow
"📊 Full Analytics →" — border #00d4ff text #00d4ff, rounded-xl px-8 py-4

Also show: "Similar contests starting soon:" — 2 small contest chips previewing next opportunities
```

---

## SCREEN 8 — AI SUBSCRIPTION / UPGRADE PAGE

```
Design a premium subscription/upgrade page for SkillXI. Must feel high-value, trustworthy, and conversion-optimized.

PAGE HEADER:
bg: radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.2) 0%, #0a0a0f 60%)
Centered content, padding 80px top 40px bottom

Eyebrow badge: "🚀 SKILLXI PREMIUM" — purple pill badge centered, bg rgba(124,58,237,0.15), border rgba(124,58,237,0.3), text #9d5cf5 12px bold uppercase
H1: "Unlock Your Full Potential" — white 48px Space Grotesk bold centered
Subtitle: "Pro members win 3.2x more contests. Elite members are our top earners. Join them." — #a0a0b8 18px centered max-width 560px
Social proof: ⭐⭐⭐⭐⭐ "Rated 4.9/5 by 12,400 players" — gold stars + #a0a0b8 text, centered

━━━ BILLING TOGGLE ━━━
Monthly / Annual toggle centered:
Pill shape toggle, "Monthly" left | "Annual" right
Annual selected state: bg shifts to "Annual" side
Badge next to Annual: "Save 40%" — green pill #00ff88

Current state shows monthly pricing

━━━ PRICING CARDS (3 columns) ━━━
Three cards side by side with spacing:

CARD 1: FREE
bg: #13131f
border: 1px solid #1e1e30
rounded-2xl, padding 32px
opacity slightly lower to de-emphasize

"FREE" badge — gray pill at top
Plan name: "Starter" — 20px white bold
Price: "$0" — 40px white bold Space Grotesk + "/month" 16px #a0a0b8
Subtext: "Forever free"

Feature list (with icons):
✅ "3 free contests per week" — white 14px
✅ "Basic AI lineup suggestion (no explanation)" — white 14px  
✅ "Public leaderboard access" — white 14px
✅ "Basic player stats" — white 14px
❌ "AI explanations & reasoning" — #5a5a75 14px strikethrough  
❌ "Pre-match reports (PDF)" — #5a5a75 14px strikethrough
❌ "Differential picks" — #5a5a75 14px strikethrough
❌ "AI chat sessions" — #5a5a75 14px strikethrough

CTA: "Current Plan" — border #2a2a40 text #5a5a75, rounded-xl full-width, disabled style

━━━━━━━━━━━━━━━━━━
CARD 2: PRO — FEATURED (slightly taller, elevated)
━━━━━━━━━━━━━━━━━━
bg: #13131f
border: 2px solid #7c3aed 
box-shadow: 0 0 60px rgba(124,58,237,0.2), 0 0 120px rgba(124,58,237,0.08)
rounded-2xl, padding 32px
transform: scale(1.04) [slightly larger than others]

Top banner inside card: bg linear-gradient(135deg, #7c3aed, #9d5cf5), height 36px, rounded-t-2xl (covers card top), centered "⭐ MOST POPULAR" white 12px bold uppercase

"PRO" badge — purple pill
Plan name: "Pro Analyst" — 20px white bold
Price: "$9.99" — 48px Space Grotesk bold, gradient text (blue to purple) + "/month" 16px #a0a0b8
India price: "or ₹299/mo" — 13px #5a5a75 below
Annual note: "(or $71.99/yr — save $47)" — #5a5a75 12px

What you get header: "Everything in Free, plus:" — 13px #a0a0b8 italic, margin-top 8px

Feature list:
✅ "Unlimited AI lineup suggestions" — white 14px bold
✅ "Full AI reasoning for every pick" — white 14px
✅ "Pre-match PDF reports per fixture" — white 14px
✅ "AI differential & hidden gem picks" — white 14px
✅ "Captain & vice-captain AI rationale" — white 14px
✅ "Advanced personal analytics" — white 14px
✅ "Exclusive Pro-only contest rooms" — white 14px
✅ "20 AI chat queries per day" — white 14px
✅ "Lineup share card generator" — white 14px
✅ "Multi-language AI responses" — white 14px (badge: "NEW")

CTA: "Upgrade to Pro →" — bg linear-gradient(135deg, #7c3aed, #9d5cf5), white text, rounded-xl full-width, padding 14px, font-weight 700, font-size 16px, glow: 0 0 30px rgba(124,58,237,0.4)
Below CTA: "Cancel anytime. No lock-in." — #5a5a75 12px centered

━━━━━━━━━━━━━━━━━━
CARD 3: ELITE
━━━━━━━━━━━━━━━━━━
bg: #13131f
border: 2px solid rgba(255,215,0,0.3)
box-shadow: 0 0 40px rgba(255,215,0,0.08)
rounded-2xl, padding 32px

Top banner: bg linear-gradient(135deg, #ffd700, #ff8c00), "👑 MAXIMUM POWER" white 12px bold uppercase

"ELITE" badge — gold pill
Plan name: "Elite Oracle" — 20px white bold
Price: "$24.99" — 48px bold white + "/month"
India: "or ₹799/mo"

Feature list (all Pro features plus):
Everything in Pro, plus: header
✅ "Unlimited AI chat sessions" — white 14px bold
✅ "AI Scouting Engine — full differential list" — white 14px
✅ "1-on-1 AI strategy deep dives" — white 14px
✅ "Seasonal tournament auto-entry" — white 14px
✅ "Free NFT badge mint per season" — white 14px + "🏅 NFT" badge tiny
✅ "Priority customer support" — white 14px
✅ "Beta features early access" — white 14px
✅ "Dedicated performance coaching AI" — white 14px bold (NEW badge)

CTA: "Go Elite →" — bg linear-gradient(135deg, #ffd700, #ff8c00), text #0a0a0f, rounded-xl full-width, padding 14px, font-weight 800, font-size 16px
Below: "For serious competitors only" — #5a5a75 12px italic centered

━━━ FEATURE COMPARISON TABLE ━━━
Below pricing cards: full-width comparison table
Header: "Full Feature Comparison" — white 24px bold centered

Table: bg #0f0f1a, border #1e1e30, rounded-2xl overflow hidden, max-width 900px centered
Column headers: "Feature" | "Free" | "Pro" | "Elite"
Column widths: 50% | 16.7% | 16.7% | 16.7%
Each header: 13px bold white uppercase, centered (except Feature: left-aligned)

Row groups with section dividers:
"AI Features" section header row: bg #13131f colspan 4, "AI FEATURES" text #7c3aed 11px uppercase bold left-padded

Rows:
AI lineup suggestion | ✅ Basic | ✅ Full | ✅ Full+
AI reasoning & explanation | ❌ | ✅ | ✅
Pre-match PDF reports | ❌ | ✅ | ✅
Differential picks | ❌ | ✅ | ✅
AI chat queries/day | ❌ | 20 | Unlimited
AI Scouting Engine | ❌ | ❌ | ✅
AI strategy sessions | ❌ | ❌ | ✅

"Contests" section divider
Free contests/week | 3 | Unlimited | Unlimited
Pro-only contests | ❌ | ✅ | ✅
Elite tournament access | ❌ | ❌ | ✅

"Rewards" section divider
NFT Badge minting | ❌ | Purchasable | 1 free/season
Skill score multiplier | 1x | 1.5x | 2x

Each ✅: green #00ff88, ❌: red #ff4466, text values: white. Alternating row bg.

━━━ TESTIMONIALS ━━━
"What Pro Members Say" — white 24px bold centered

3 testimonial cards in a row:
Card: bg #13131f, border #1e1e30, rounded-2xl, padding 24px
Stars: ⭐⭐⭐⭐⭐ gold
Quote: "The AI lineup builder paid for itself in the first contest. Won 12 SOL in week 1 of Pro." — white 14px italic
Author: "Rahul M." | "PRO Member" | "🇮🇳 Mumbai" — #a0a0b8 13px
Avatar circle: 40px gradient bg

━━━ TRUST BADGES ━━━
Row of 4 trust badges centered:
[🔒 256-bit Encryption] [⚡ Instant SOL Payouts] [🔄 Cancel Anytime] [🤖 Powered by Claude AI]
Each: icon + text, #a0a0b8 13px, separated by dots

━━━ FAQ SECTION ━━━
"Frequently Asked Questions" — white 24px bold
5 FAQ accordion items (show expanded state for one):
Q: "Can I cancel my subscription anytime?" 
A: "Yes, cancel from your profile settings anytime. You keep Pro access until the end of your billing period."
Other Q's: About AI data accuracy, SOL payments, skill score, refunds
```

---

## SCREEN 9 — USER PROFILE & SKILL SCORE PAGE

```
Design a user profile page for SkillXI showing skill score, badges, stats, and history.

PROFILE HEADER SECTION:
bg: linear-gradient(180deg, #0f0f1a 0%, #0a0a0f 100%)
border-bottom: 1px solid #1e1e30

Cover/Banner area (height 160px desktop):
bg: linear-gradient(135deg, rgba(124,58,237,0.3), rgba(0,212,255,0.15)), #0f0f1a
Subtle grid pattern at very low opacity overlay

Profile info row (below banner, negative top margin to overlap):
Left: Avatar circle 88px — gradient bg (purple to blue), border 3px solid #0a0a0f (creates "cut out" effect), border-radius 50%
Above avatar: small trophy icon if top 100 player
Verified checkmark badge if Pro subscriber: small #7c3aed circle with ✓

Profile details:
Username: "CryptoAnalyst_99" — 24px bold white Space Grotesk
Subtitle: "🇮🇳 Mumbai · Member since Jan 2025"  — 13px #a0a0b8
Subscription badge: "⭐ PRO MEMBER" — purple pill, 12px bold
Wallet: "7xKp...3mNa" — 12px #5a5a75 with copy icon, Solana logo before address

Right side: Edit Profile button (ghost, #a0a0b8 text) and Share Profile button

━━━ SKILL SCORE HERO ━━━
Large centered skill score visualization:

Outer container: bg #13131f, border #1e1e30, rounded-2xl, padding 32px, max-width 600px, centered
Title: "Your Skill Score" — 14px uppercase #5a5a75 letter-spacing bold, centered

Large circular gauge (SVG donut chart, 180px diameter):
Outer ring: neon blue stroke 8px, shows score level (e.g., 73% fill = 1337/1825 max)
Inner ring: purple stroke 4px at 40% opacity (secondary ring)
Center: "1,337" — Space Grotesk 48px bold white
Below center number: "ELITE TIER" — 12px uppercase #7c3aed bold
Below tier: small star rating ⭐⭐⭐⭐☆

Tier levels shown as small pills around the gauge:
500: "Rookie" → 750: "Analyst" → 1000: "Strategist" → 1250: "Expert" → 1500: "Oracle" → 2000: "Legend"
Current tier pill highlighted: "Expert" — neon blue filled pill

Below gauge, 4 mini stats in a row:
"Global Rank" "#847" | "Top 8%" | "This Month: +97" (green) | "Best Rank: #312"

━━━ NFT BADGES SECTION ━━━
"My Badges" — white 20px bold left-aligned
"3 earned · 1 mintable" — #5a5a75 14px right-aligned + "Mint Now →" link #00d4ff

Horizontal scroll row of badge cards:

BADGE CARD (180px × 200px):
bg: linear-gradient(135deg, #1a1a2e, #13131f)
border: depends on tier
rounded-2xl
overflow hidden

Top 60% of card: gradient background matching badge tier color
Badge icon in center: stylized SkillXI shield/crown icon, 56px, with tier-appropriate colors
Sparkle/glow effect around icon

Bottom 40%: badge info
  Badge name: "Gold Scout" — 14px bold white
  Season: "GW 2024-25" — 11px #5a5a75
  Trait: "Top 5% Analyst" — 12px matching tier color
  "MINTED ✓" or "UNMINTED" status chip
  If minted: small Solana logo + "On-chain" green text

Badge tier styles:
Bronze (earned 3+ contests): bg gradient bronze colors, bronze border glow
Silver (top 20%): silver gradient, silver glow
Gold (top 5%): gold gradient, gold glow, "HOT" if just earned
Diamond (top 1%): holographic shimmer effect, #a0d4ff color, sparkle border animation
"Earn Next Badge" placeholder card: dashed border, lock icon, "Win 3 Elite contests to unlock"

━━━ STATS DASHBOARD ━━━
2x3 grid of stat cards:

Each stat card: bg #13131f, border #1e1e30, rounded-xl, padding 16px 20px

Card 1: "Total Earned"
Icon: 💰 (or SOL symbol)
Value: "47.8 SOL" — 32px bold Space Grotesk white
Subtext: "≈ $6,214" — #5a5a75 14px
Trend: "↑ +8.2 SOL this month" — #00ff88 13px

Card 2: "Win Rate"
Icon: 🎯
Value: "34%" — 32px bold white
"From 89 contests"
"↑ +4% last 30 days" — green

Card 3: "Contests Entered"
Icon: 🎮
Value: "89" — 32px bold white
"47 won prizes" — #a0a0b8
"Avg Rank: #12" — blue

Card 4: "Prediction Accuracy"
Icon: 🤖 (brain)
Value: "76%" — 32px bold white
"AI vs My picks: 68%/76%" — #a0a0b8
"You outperform AI 🎉" — #00ff88 small

Card 5: "Best Contest Win"
Icon: 🏆
Value: "22.5 SOL" — 32px bold gold
"Elite contest, GW18" — #a0a0b8
"Man City vs Atletico" — 12px #5a5a75

Card 6: "Skill Rank Trend"
Icon: 📈
Mini sparkline chart (SVG line chart): shows skill score trend over last 8 weeks
Line in neon blue, gradient fill below line
Value: "1,337 → 1,397 next target" — white small

━━━ PERFORMANCE CHART ━━━
"Earnings History" section — white 20px bold
Line/area chart (full width, height 180px):
X-axis: last 10 contests labeled with match name shortened
Y-axis: SOL earned per contest (0 to max)
Line: neon blue, smooth curve
Area fill below: gradient rgba(0,212,255,0.1) to transparent
Data points: small circles on line, hover shows tooltip "GW24 Man City vs Arsenal: +4.5 SOL"
Horizontal reference line: "Break even (entry fee)" shown as dashed #5a5a75

━━━ RECENT ACTIVITY ━━━
"Recent Contests" — white 20px bold
Filter: [All] [Won Prize] [Not Placed]

Table rows (last 6 contests):
Match | Date | Entry | Result | Rank | Prize/Loss | Skill Pts
"Man City vs Arsenal" | "3 days ago" | "0.1 SOL" | "Win 🏆" | "#2/142" | "+4.5 SOL" | "+97pts"
Each: colored left border (green=prize, red=no prize), full row clickable to replay

━━━ SETTINGS SECTION ━━━
Small section at bottom:
"Account Settings" tabs: [Preferences] [Notifications] [Privacy] [Connected Apps]
One tab shown: notification toggles, language preference, dark/light mode (dark default)
"Danger Zone": Cancel subscription (red), Delete account (gray)
```

---

## SCREEN 10 — AI CHAT SESSION PAGE (Pro/Elite Feature)

```
Design the full AI Analyst chat session page for SkillXI Pro/Elite subscribers.

PAGE LAYOUT: Three-column layout. Left sidebar (context), center (chat), right sidebar (quick actions).

━━━ LEFT SIDEBAR (240px) ━━━
bg: #0f0f1a, border-right: 1px solid #1e1e30, full height sticky

Logo section: "🤖 AI Sessions" — #00d4ff 16px bold
Usage meter: "12 / 20 queries today" — Pro plan limit
Progress bar: neon blue fill showing 60%, below: "8 left today · Resets midnight"
"Upgrade to Elite for unlimited" — purple link 12px

Session History list:
"New Chat +" button at top — bg rgba(0,212,255,0.1), border rgba(0,212,255,0.2), text #00d4ff, rounded-lg full-width

Previous sessions list:
Each: rounded-lg padding 8px 12px, cursor pointer, hover bg #13131f
"📅 Today" section header (12px uppercase #5a5a75)
Session rows: "Man City analysis" 13px white + "2h ago" 11px #5a5a75 right | AI icon tiny
Active session: bg #13131f border-left 2px #00d4ff

Active contest context:
Card: bg #13131f, border #1e1e30, rounded-xl, padding 12px, margin 12px
"Current Contest Context" 11px uppercase #5a5a75
"⚽ MCI vs ARS" white 13px bold
"Your lineup: 4 players picked" #a0a0b8 12px
"Deadline: 3h 22m" countdown red small

━━━ CENTER PANEL (flex 1) — MAIN CHAT ━━━
Full height, flex column

TOP BAR:
bg: #0a0a0f, border-bottom: #1e1e30, padding 16px 24px
Left: "SkillXI AI Analyst" 18px bold white + brain icon #00d4ff 20px
Middle: "Elite Session" gold badge | "Pro Session" purple badge
Right: "Clear chat" ghost button, Settings gear icon

━━━ CHAT MESSAGES AREA ━━━
bg: #0a0a0f, flex-1, overflow-y scroll, padding 24px 0

MESSAGES SHOWN IN SEQUENCE:

1. SYSTEM WELCOME MESSAGE (centered, special style):
bg: rgba(0,212,255,0.04), border: rgba(0,212,255,0.1), rounded-2xl, padding 20px, max-width 480px, centered, margin 20px auto
Brain icon 32px #00d4ff centered
"Welcome to your AI Analyst Session" white 16px bold centered
"I'm your personal SkillXI sports analyst powered by Claude AI. I have full context of your active contests, current lineup, and historical performance. Ask me anything." #a0a0b8 14px centered
Quick start chips below: [Analyze my lineup] [Who should I captain?] [Find differentials] [Pre-match report]

2. USER MESSAGE (right-aligned):
bubble: bg #1a1a2e, border #2a2a40, rounded-2xl rounded-tr-sm, padding 12px 16px, max-width 70%, margin-left auto
"You" avatar: 28px circle, gradient bg, top-right of bubble
"Who should I captain for the Man City vs Arsenal match tonight?" white 14px

Timestamp below: "2:34 PM" #5a5a75 10px right-aligned

3. AI RESPONSE (left-aligned):
AI avatar: 36px circle, bg linear-gradient(135deg, #00d4ff, #7c3aed), brain icon white inside, top-left
bubble: bg #13131f, border #1e1e30, rounded-2xl rounded-tl-sm, padding 16px 20px, max-width 80%

Response content (formatted, not just plain text):
"**Captain Recommendation: Erling Haaland (Man City)**" — first line white 14px bold (markdown bold rendered)

"Here's my analysis:" — 13px white

Mini card embedded in message (bg rgba(0,212,255,0.05), border rgba(0,212,255,0.1), rounded-xl, padding 12px, margin 8px 0):
Row: "⚡ Form" — "5 goals in last 4 games" | bar in green
Row: "🎯 Fixture" — "Arsenal gave up 2.3 xGA at home" | bar in neon blue  
Row: "📊 Ownership" — "62% — high but worth the risk" | bar at 62%
Row: "🔮 Confidence" — "9.4/10" | bar nearly full in gold

Continued text below card:
"**My verdict:** Haaland is the standout captain. Arsenal's defensive line is high — perfect for his movement. His expected goals this fixture is 1.8 (highest in the league). Even at 62% ownership, his ceiling justifies the captain pick."

"**Alternative if you want a differential:** Mohamed Salah at 28% ownership. Liverpool are at home against Wolves — Salah typically delivers big in these fixtures."

Emoji bullet points section:
"✅ Start him | ⭐ Captain | 📈 High ceiling | ⚠️ Rotation risk is low"

Reaction buttons below bubble: 👍 👎 🔖 (save) — tiny, #5a5a75, hover color

4. USER MESSAGE:
"What about Saka for vice-captain?"

5. AI RESPONSE:
Shorter response with mini analysis card
"Saka is an excellent vice-captain choice..."

━━━ BOTTOM INPUT AREA ━━━
bg: #0a0a0f, border-top: #1e1e30, padding 16px 24px

QUICK ACTION CHIPS (above input, horizontal scroll):
[🔍 Analyze full lineup] [⚽ Captain advice] [💎 Find differentials] [📊 Match report] [🏆 Contest strategy] [⚠️ Injury check]
Each: rounded-full bg #13131f border #2a2a40 text #a0a0b8 text-13px px-3 py-1.5, hover bg #1a1a2e border #3a3a50 text white

INPUT ROW:
bg: #13131f, border: 1px solid #2a2a40, border-radius 16px, padding 4px 4px 4px 16px, display flex align-center
Focus: border-color #00d4ff, box-shadow 0 0 0 2px rgba(0,212,255,0.1)
Textarea: flex-1, bg transparent, border none, text white 14px, placeholder "Ask me about your lineup, players, strategy..." color #5a5a75, resize none, min-height 20px max-height 120px, auto-expand
Attach icon: paperclip #5a5a75 (for uploading lineup screenshot) left of input
Send button (right, inside input): circular 40px bg linear-gradient(135deg, #7c3aed, #9d5cf5), send icon white, hover glow, disabled state when empty

"AI can make mistakes. Always verify with official injury reports." — 11px #5a5a75 centered below input

━━━ RIGHT SIDEBAR (260px) ━━━
bg: #0f0f1a, border-left: #1e1e30

"My Current Lineup" card:
Shows 11 players in compact list view
Each player: small position badge | name | AI score | "Captain C" badge for captain

"Live Context" card:
Match stats updating: "MCI 1-0 ARS · 34'" live score
"Haaland: 1 goal, 14pts so far" green
"Saka: 0 points yet" gray

"Quick Stats" card:
Player search: small search input
"Top Performers Today" — mini list showing today's highest scorers in live matches

"Save Session" button: ghost button full-width, saves chat for later review
```

---

## SCREEN 11 — PRE-MATCH REPORT PAGE

```
Design a pre-match report page for SkillXI. Looks like a premium sports intelligence report.

PAGE HEADER:
bg: #0a0a0f

Breadcrumb: "Reports / Man City vs Arsenal · GW28"
Report badge: "📄 AI PRE-MATCH REPORT" — #00d4ff 12px bold uppercase pill
Match title: "Manchester City vs Arsenal" — white 36px Space Grotesk bold
Competition: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League · Gameweek 28 · Etihad Stadium" — #a0a0b8 16px
Date/time: "📅 Saturday, March 15 2025 · 20:30 IST" — #a0a0b8 14px

ACTION ROW:
Left: "Generated by SkillXI AI" + brain icon + "Claude AI" + "PRO" badge (required)
Right: "⬇️ Download PDF" button — bg rgba(0,212,255,0.1) border rgba(0,212,255,0.2) text #00d4ff rounded-lg
"📋 Copy to Notes" ghost button
"🔗 Share Report" ghost button

━━━ SCORE PREDICTION HERO ━━━
bg: #13131f, border #1e1e30, rounded-2xl, padding 24px 32px, margin-bottom 24px

Left: AI Score Prediction
"AI PREDICTED SCORE" 11px uppercase #5a5a75
"Manchester City 2 — 1 Arsenal" — large match prediction display
  MCI badge circle 48px | "2" 48px bold #00d4ff | "—" #5a5a75 | "1" 48px bold white | ARS badge circle 48px
"Confidence: 68%" — neon blue progress bar showing 68%

Center dividers with stats:
Win probability row: 3 sections with values
"MCI Win 54%" green bar | "Draw 22%" yellow bar | "ARS Win 24%" red bar
Bar chart style horizontal with labels

Right: AI Verdict Card
bg: rgba(0,212,255,0.04), border rgba(0,212,255,0.1), rounded-xl, padding 16px
"🤖 AI VERDICT" uppercase 10px #00d4ff bold
"A cagey affair expected. City's home advantage and Haaland's form make them favorites, but Arsenal's recent defensive solidity could limit the margin. Expect goals from set pieces." — 13px #a0a0b8, line-height 1.7

━━━ REPORT SECTIONS (card-based layout) ━━━
2-column grid layout for report sections, gap 20px:

SECTION CARD STYLE:
bg: #13131f, border: #1e1e30, rounded-2xl, padding 24px
Section title: icon + "SECTION NAME" — 14px bold white
Section subtitle: #a0a0b8 12px italic

━━━ SECTION 1: KEY PLAYERS TO TARGET (full width) ━━━
Title: "⭐ Players to Target"
Subtitle: "AI-ranked picks ordered by expected fantasy points"

Table headers: "Player" | "Team" | "Position" | "AI Score" | "Exp Pts" | "Ownership" | "Verdict"

6 player rows:
Row 1: Haaland | MCI | FWD | 9.8 ⭐ | 16-28 | 62% | "MUST HAVE" green badge
Row 2: Saka | ARS | MID | 9.2 | 11-18 | 54% | "MUST HAVE" green badge
Row 3: Ødegaard | ARS | MID | 8.8 | 9-15 | 38% | "STRONG PICK" blue badge
Row 4: De Bruyne | MCI | MID | 8.6 | 8-14 | 41% | "STRONG PICK" blue badge
Row 5: Bruno (differential) | MCI | MID | 7.9 | 7-12 | 8% | "DIFFERENTIAL 💎" purple badge
Row 6: Raya | ARS | GK | 7.5 | 5-10 | 29% | "SOLID PICK" gray badge

Table style: clean, border-bottom #1e1e30 between rows, alternating subtle bg

━━━ SECTION 2: TEAM ANALYSIS (2 columns) ━━━
Left card: "Manchester City" analysis
Team strength rating: 5 stars displayed as golden dots ●●●●○
Attack: ████████░░ 82%
Defense: ███████░░░ 74%
Form (5): W W W D W — colored dots
Key stat: "Scoring 3.1 goals/game at home this season"
AI note: "City are in brilliant form but may rotate ahead of UCL. Watch for De Bruyne start."

Right card: "Arsenal" analysis  
Rating: 4.5 stars ●●●●◐
Attack: ███████░░░ 74%
Defense: ████████░░ 80%
Form: W W D W W
Key stat: "Clean sheets in 4 of last 5 away games"
AI note: "Arsenal's high press could unsettle City's build-up. Saka is the key threat."

━━━ SECTION 3: INJURY & AVAILABILITY ━━━
Title: "🏥 Injury & Availability Report"
2-column table:

Manchester City:                    Arsenal:
✅ Haaland — Fully Fit              ✅ Saka — Fully Fit  
✅ De Bruyne — Fully Fit            ⚠️ White — Slight Knock (75% chance)
⚠️ Walker — Doubt (50%)            ✅ Ødegaard — Fit
🚫 Gündogan — Out 4 weeks          ✅ Raya — Fit
Each entry: status icon | player name | status text | impact on fantasy

━━━ SECTION 4: TACTICAL OVERVIEW ━━━
Title: "♟️ Tactical Breakdown"
Left mini pitch diagram (top-down, small, 200px):
Shows City's expected formation 4-3-3 with player names positioned
Right: text analysis
"Expected Formations: City 4-3-3 vs Arsenal 4-2-3-1"
3 bullet tactical points with small icons

━━━ SECTION 5: HEAD-TO-HEAD HISTORY ━━━
Title: "📜 H2H History (Last 5)"
Timeline of 5 previous matches:
Each: date | result | scoreline | key scorers | fantasy captain who delivered
Visual: home team logo | score in green/gray/red box | away team logo
"Last 5: City won 3, Arsenal won 1, Drew 1" — summary chip

━━━ SECTION 6: CAPTAIN RECOMMENDATION ━━━
Full-width premium card:
bg: linear-gradient(135deg, rgba(255,215,0,0.06), rgba(0,212,255,0.04)), border rgba(255,215,0,0.2), rounded-2xl, padding 24px

"👑 CAPTAIN RECOMMENDATION" — gold 11px uppercase bold
"Erling Haaland (Manchester City)" — white 24px bold Space Grotesk
Captain score: circular gauge 9.8/10, gold color
Reasoning: "Haaland leads the Premier League in xG (18.4) and goals (24). Arsenal allow an average of 1.3 goals per game at home, presenting a high-ceiling fixture for Haaland, especially given his aerial dominance vs Arsenal's high line."
Expected captain points: "16-42 captain points (×2 bonus applied)"
Risk indicator: "⚡ Medium-High risk | 📈 Very high ceiling"

"Alternative Captain:" — "Saka at 28% ownership — best differential captain" purple section below

━━━ SECTION 7: DIFFERENTIAL PICK ━━━
bg: rgba(124,58,237,0.04), border rgba(124,58,237,0.15), rounded-2xl, padding 20px

"💎 DIFFERENTIAL PICK OF THE MATCH"
"Bruno Fernandes (Man City)" — BUT correct: pick a realistic differential
Let's say: "Phil Foden (Man City)" — white 20px bold
"Only 9.3% ownership in current contest"
AI analysis: "With Gündogan out, Foden moves centrally and had 2 assists from this role last match vs Brentford. His recent form (3 attacks, 1 assist in 2 games) makes him a great differential vs Arsenal's high-line."
Expected points: 8-16 points
Risk: Low | Ownership upside: High

Download CTA (sticky at bottom):
"Download Full PDF Report" — prominent neon blue button
"Generated: 6h before match · Updated with latest team news"
```

---

## SCREEN 12 — MOBILE RESPONSIVE VERSIONS

```
Design mobile (375px width) responsive versions of these 3 key screens for SkillXI. Show all 3 as phone mockups side by side:

━━━━━━━━━━━━━━━━━━━━
PHONE 1: Mobile Home Page
━━━━━━━━━━━━━━━━━━━━
Inside a phone frame (iPhone 15 style, 390x844px screen area):
Status bar at top (black, with time 9:41 AM, signal, battery)

Fixed Navbar (60px):
bg rgba(10,10,15,0.95) blur
Left: "Skill" + "XI" gradient text logo 20px
Right: "◎" Solana icon button (connects wallet) + notification bell icon

Hero section (300px height):
bg: radial gradient dark purple at top
"Win With Knowledge" — 28px bold white 2 lines
Tagline: "AI-powered fantasy on Solana" — 14px #a0a0b8
CTA: "Start Competing →" button full-width purple gradient, rounded-xl, 50px tall

Contest cards section:
Horizontal scroll row (cards visible at 80% width hinting next card):
Card: 280px wide, shows match, prize, entry fee, join button
Scroll indicator dots below

Bottom navigation bar:
Fixed bottom, 56px, bg rgba(10,10,15,0.98), border-top #1e1e30
5 icons in equal columns:
🏠 Home | 🏆 Contests | 🤖 AI | 📊 Rank | 👤 Profile
Active icon: neon blue with dot indicator below

━━━━━━━━━━━━━━━━━━━━
PHONE 2: Mobile Lineup Builder
━━━━━━━━━━━━━━━━━━━━
Top: Match name + deadline countdown (fixed header below nav)

Pitch view (300px wide, 320px tall) — full width football pitch
Player tokens scaled to 48px circles (smaller for mobile)
Formation visible: 4-3-3

BELOW PITCH (swipeable tabs):
Tab row: [Lineup] [AI Picks] [Players] [Stats]
Active tab content visible

In "AI Picks" tab:
Scrollable list of AI recommendation cards (110px height each):
Player name + position + AI score + short reason text + Add button

Bottom: Fixed action bar
"Budget: 87.5/100" left | "Lock Lineup →" button right (green)

━━━━━━━━━━━━━━━━━━━━
PHONE 3: Mobile Leaderboard
━━━━━━━━━━━━━━━━━━━━
Top: Match score "MCI 2 — 1 ARS · LIVE ●" — prominent header
"Prize Pool: 8.5 SOL · 142 Players"

MY POSITION (sticky at top of table):
Blue-bordered card: "#7 of 142 · 127pts · 0.8 SOL" compact
"↑ 3 places since KO" green tiny text

LEADERBOARD TABLE:
Simplified columns on mobile: Rank | Player + Captain | Points | Prize
Rows height 48px (more compact)
Top 3 with colored left borders
My row highlighted with blue background tint

LIVE MATCH EVENTS:
Collapsible section at bottom: "📡 Live Events ▼"
Shows 3 most recent events in condensed format

Show all 3 phones in a row with subtle drop shadows, realistic frame, all on #0a0a0f background.
Dark mode only.
```

---

## TIPS FOR BEST STITCH RESULTS

1. **Generate each screen separately** — do not try to generate all screens in one prompt
2. **Start with Gemini 2.5 Pro (Experimental mode)** — much better results for complex layouts
3. **If result is missing elements**, use the chat to refine: "Add the countdown timer to the contest card header area"
4. **Color accuracy** — if Stitch doesn't use exact hex colors, refine with: "Change the main button background to exactly #7c3aed"
5. **Export method** — after each screen is ready: Click Export → Download HTML — save as `screen-01-home.html`, `screen-02-contests.html` etc.
6. **Paste to Figma** — use the Figma export for team collaboration or further design editing
7. **Use the voice feature** — speak your refinements for faster iteration: "Make the hero section taller, move the stats row to be horizontal"
8. **Run 3 variants** — for the Home page and Lineup Builder, generate 3 variants and pick the best
9. **The DESIGN.md export** — once you finalize a look, export DESIGN.md from Stitch to maintain consistency across all screens
10. **Order to generate**: Nav → Home → Contests → Lineup Builder → Player Card → Leaderboard → Payout → Subscription → Profile → AI Chat → Report → Mobile

---

*SkillXI Stitch Prompts — Complete Frontend Design Brief*
*12 screens + design system + mobile versions = Full frontend ready for Antigravity import*
