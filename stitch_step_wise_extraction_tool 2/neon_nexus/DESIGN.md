# Design System Document: SkillXI

## 1. Overview & Creative North Star
**The Creative North Star: "The Kinetic Intelligence"**

This design system is not a static interface; it is a living, breathing data-environment. We are moving away from the "flat dashboard" trope of traditional fantasy sports and into a "High-End Editorial" experience that mirrors a futuristic trading floor or an AI-driven command center.

To break the "template" look, we utilize **Intentional Asymmetry**. Hero sections should feature overlapping elements—typography that bleeds behind player cards or neon-glow accents that break the container's edge. We avoid the rigid grid in favor of **Tonal Depth**, where the user feels they are looking *through* layers of glass and light rather than at a flat screen. The visual priority is always "Skill Over Luck," which translates to a precise, high-contrast UI that highlights data as the hero.

---

## 2. Colors & Surface Philosophy
The palette is rooted in deep space blacks and neon luminescence. However, the execution must remain premium, avoiding the "cheap neon" aesthetic by using light as a functional tool rather than a decoration.

### The Color Tokens
- **Surface (Primary):** `#131318` — The canvas.
- **Primary Accent:** `#a8e8ff` (Neon Blue) — Used for core interactive signals.
- **Secondary Accent:** `#d2bbff` (Purple) — Used for AI-enhanced features or special "XI" moments.
- **Tertiary Accent:** `#00ff88` (Green) — Purely for "Success" and "Profit" states.
- **System States:** Error (`#ffb4ab`), Gold (`#ffd700`), Silver (`#c0c0c0`), Bronze (`#cd7f32`).

### The "No-Line" Rule
Standard 1px solid borders are strictly prohibited for sectioning. Structural boundaries must be defined through **Background Color Shifts**. For example, a `surface-container-low` section sitting on a `surface` background creates a clean, sophisticated edge without the visual noise of a line.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, semi-transparent sheets. 
- **Surface-Lowest (`#0e0e13`):** For deep-background sections.
- **Surface-Low (`#1b1b20`):** Standard page sections.
- **Surface-High (`#2a292f`):** Interactive cards and list items.
- **Surface-Highest (`#35343a`):** Modals and hovering tooltips.

### The "Glass & Gradient" Rule
Floating UI elements (Modals, Dropdowns) must use **Glassmorphism**. Apply `surface-variant` at 60% opacity with a `20px` backdrop-blur. Main CTAs should not be flat; use a subtle linear gradient from `primary` (`#a8e8ff`) to `primary-container` (`#00d4ff`) at a 135-degree angle to provide a "liquid" feel.

---

## 3. Typography
We utilize a high-contrast typographic scale to separate data-rich information from editorial brand moments.

- **Display (Space Grotesk, 800):** Used for big numbers, scores, and hero titles. The wide, technical stance of Space Grotesk communicates the "AI/High-Tech" soul.
- **Headline (Space Grotesk, 700):** For section titles.
- **Body & Labels (Inter):** Inter is our "Workhorse." Its neutrality provides the necessary legibility for dense player stats and fantasy rosters.

**Editorial Tip:** Use `display-lg` (3.5rem) paired immediately with `label-sm` (all caps) for a "Data-Brutalist" look that feels premium and intentional.

---

## 4. Elevation & Depth
In this system, light *is* depth.

- **The Layering Principle:** Avoid drop shadows on static elements. Instead, place a `surface-container-highest` card on a `surface-container-low` background. The subtle shift in hex value creates a "Soft Lift."
- **Ambient Shadows:** For floating elements like player detail modals, use a "Cyan-Tinted Shadow": `0 20px 40px rgba(0, 212, 255, 0.08)`. This mimics the glow of a screen rather than a physical shadow.
- **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline-variant` token at 15% opacity. It should be felt, not seen.
- **Neon Accents:** Use the "Neon Border" (`rgba(0, 212, 255, 0.3)`) exclusively for active states or "Captain" selections to signify high-value interaction.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (Blue to Purple), `9999px` (full) roundedness. Box-shadow glow on hover: `0 0 20px rgba(0, 212, 255, 0.4)`.
- **Secondary:** Transparent with a "Ghost Border" (15% opacity). Text in `primary`.
- **Tertiary:** Text only, bold Inter, all caps with `0.1em` letter spacing.

### Cards & Lists
- **Rule:** No divider lines between list items. Use vertical white space or a 1-step shift in surface color (e.g., alternating between `surface-container` and `surface-container-high`).
- **Interaction:** Cards should utilize a subtle `box-shadow: 0 0 30px rgba(0, 212, 255, 0.1)` only on hover to simulate the card "powering up."

### Input Fields
- **Styling:** `surface-container-lowest` fill. No border when inactive. When focused, the bottom edge glows with a 2px `primary` underline.
- **Helper Text:** Use `label-sm` in `text-muted` (`#5a5a75`).

### AI-Insight Chips (Custom Component)
- Small, glassmorphic badges with a `secondary` (purple) glow. These highlight AI-predicted "Skill" picks. They should float slightly offset from player avatars to break the grid.

---

## 6. Do's & Don'ts

### Do:
- **Do** use large amounts of negative space between data clusters.
- **Do** use `tertiary` (Green) sparingly—only for "Win/Profit" confirmations.
- **Do** overlap player imagery over container edges to create 3D depth.
- **Do** use the `full` (9999px) roundedness for action-oriented components (buttons, chips).

### Don't:
- **Don't** use 100% opaque white borders; it breaks the "futuristic glass" illusion.
- **Don't** use standard "Drop Shadows" (Black/Grey). Only use tinted ambient glows.
- **Don't** use Inter for headings; it makes the app look like a standard SaaS tool. Use Space Grotesk to maintain the "Web3/High-Tech" edge.
- **Don't** use "Dividers" to separate list items. Trust the surface shifts and negative space.