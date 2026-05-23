# Design System: Cyber-Node Edition

## 1. Overview & Creative North Star
**Creative North Star: "The Kinetic Intelligence – Overclocked"**

This design system is not a static interface; it is a high-performance terminal designed for the elite "Knowledge Runners." We are moving beyond the "flat" web. Our goal is to create a sense of **Digital Brutalism**—where the UI feels machined, aggressive, and alive. 

To break the "template" look, we employ **intentional asymmetry**. Layouts should avoid perfect centered balance. Instead, use heavy left-aligned "data clusters" paired with expansive, scanning-line-textured voids. Elements should overlap, with "HUD-style" decorative elements (coordinates, technical readouts) bleeding off the edges of the screen to suggest a much larger, complex system operating beneath the surface.

---

## 2. Colors & The Neon-Void Contrast
The color palette is built on the "Ultra Dark" philosophy: a pure black `#000000` base that allows our hyper-neon tokens to achieve maximum luminance through glow effects.

### Color Tokens
*   **Surface (The Void):** `#131313` (Base), `#000000` (Pure Background).
*   **Primary (Neon Cyan):** `#00f3ff` – Used for data-critical paths and primary actions.
*   **Secondary (Acid Green):** `#ccff00` – Used for success states, progress, and "overclocked" metrics.
*   **Tertiary (Glitch Pink):** `#ff003c` – Reserved for "Critical" errors, high-risk warnings, and intentional glitch highlights.

### The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for sectioning. To separate content, use:
1.  **Tonal Transitions:** Shift from `surface-container-low` (`#1b1b1b`) to `surface` (`#131313`).
2.  **Hard Chamfers:** The silhouette of a 45-degree cut corner creates the boundary, not a line.
3.  **Glitch Offsets:** Use a 2px offset "ghost" container in a secondary color to define a section’s edge without closing the box.

### Surface Hierarchy & Nesting
Treat the UI as a **stacked hardware stack**.
*   **Level 0 (Background):** Pure `#000000`.
*   **Level 1 (Main Panels):** `surface-container-low` (`#1b1b1b`) with a 5% digital noise overlay.
*   **Level 2 (Active Nodes):** `surface-container-high` (`#2a2a2a`) to pull important data closer to the "Runner."

### Signature Textures
Apply a **Scanning Line Overlay** (linear-gradient of 1px lines at 4px intervals) at 3% opacity over all large surfaces. For main CTAs, use a "Pulse Gradient" transitioning from `primary` (`#e3fdff`) to `primary-container` (`#00f3ff`) to simulate glowing hardware.

---

## 3. Typography: Editorial Aggression
We pair the technical precision of **Space Grotesk** with the utilitarian clarity of **Inter**.

*   **Display & Headlines (Space Grotesk):** Use `display-lg` (3.5rem) for hero moments. These must utilize **Chromatic Aberration** (a subtle red/blue split shadow) and a `0.5px` letter-spacing to feel like a projected HUD.
*   **UI Labels & Body (Inter):** These are your "system readouts." All `label-sm` and `label-md` text should be uppercase with `1px` tracking to maintain a military-grade terminal aesthetic.
*   **Hierarchy as Identity:** Use massive size contrasts. A `display-lg` headline should sit directly next to a `label-sm` metadata string (e.g., "SKILL_NODE_01") to create an editorial, data-dense look.

---

## 4. Elevation & Depth: Tonal Layering
In a Cyberpunk world, depth isn't created by "light"; it's created by **emissive glow**.

*   **The Layering Principle:** Instead of shadows, use **Outer Glows**. A "floating" element should have a drop shadow with the color of the element itself (e.g., a Neon Cyan glow for a primary card) at a 15% opacity and 20px blur.
*   **Glassmorphism & Depth:** Use `surface-container-highest` (`#353535`) at 60% opacity with a `20px` backdrop-blur for modal overlays. This ensures the "Knowledge Runner" never loses sight of the data-grid behind the active task.
*   **The "Ghost Border" Fallback:** If containment is required for high-density data, use a `1px` border of `outline-variant` (`#3a494b`) at **15% opacity**. It should be barely visible—a suggestion of a container, not a cage.

---

## 5. Components: The Machined Aesthetic

### Buttons (The Kinetic Triggers)
*   **Primary:** Solid `primary-container` (`#00f3ff`) with 45-degree chamfered corners. No roundedness. Text is `on-primary` (Deep Teal). On hover, add an intense cyan outer glow.
*   **Secondary:** Outlined with a "Glitch Border"—two staggered 1px strokes (one Cyan, one Pink) offset by 2px. 
*   **Tertiary:** Text-only in `secondary` (Acid Green), prefixed with a geometric icon (e.g., `[ > ]`).

### Cards & Data Nodes
Forbid divider lines. Separate "modules" within a card using a vertical 8px gap and a slight background shift to `surface-container-highest`. Use 45-degree chamfers on the top-right and bottom-left corners only to create an aggressive, asymmetric silhouette.

### Input Fields
Inputs are "Data Ports." Use a bottom-only border of `primary-fixed` (`#6ff6ff`). When focused, the bottom border should "overclock," thickening to 2px with a subtle flickering animation.

### Additional Components: "Status HUDs"
*   **The Progress Blade:** A horizontal bar using `secondary-fixed` (Acid Green) that features a "scanning" animation—a high-luminance highlight that travels across the bar every 3 seconds.
*   **Data Scrim:** A semi-transparent overlay with a "Noise" filter used when a process is loading, making the UI look like it's descrambling.

---

## 6. Do’s and Don’ts

### Do:
*   **DO** use monospaced numbers for data readouts to maintain the terminal feel.
*   **DO** embrace "Visual Noise." A small amount of static or technical "gibberish" (e.g., `SEC_AUTH_099x`) in the corners of sections adds to the immersion.
*   **DO** align elements to a strict baseline grid but vary the widths of containers to create an asymmetric flow.

### Don't:
*   **DON'T** use border-radius. Every corner in this system is a 0px hard edge or a 45-degree chamfer.
*   **DON'T** use soft, "friendly" colors. If it’s not neon or void-dark, it doesn't belong here.
*   **DON'T** use standard "drop shadows" (black/grey). Shadows must be emissive (tinted by the accent color) or non-existent.