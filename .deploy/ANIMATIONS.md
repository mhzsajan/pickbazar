# Animations — Particle Canvas & Scroll Reveals

> **AI CONTEXT FILE** — Technical reference for all custom animations. Read this before modifying any animation code. Theme: gods, devils, witches, time, universe.

---

## 1. Particle Canvas (`particle-canvas.tsx`)

### What It Is
A pure Canvas 2D animation with **seven layered effects** themed around cosmic/occult iconography:

| # | Layer | Description |
|---|-------|-------------|
| 1 | **Lunar Cycle** | Waxing/waning moon in top-right corner, occasional blood moon |
| 2 | **Ambient Orbs** | 8 large drifting glowing clouds (purple/blue/rose) |
| 3 | **Sigil Circles** | 4 rotating runic symbols: pentagram, hexagram, eye, ouroboros |
| 4 | **Clockwork Gears** | 3 rotating brass gears with teeth and spokes |
| 5 | **Constellation** | 60-180 star dots with faint connection lines |
| 6 | **Spirit Wisps** | 12 floating firefly-like lights drifting on sine-wave paths |
| 7 | **Shooting Stars** | Bright streaks in 10 vibrant colors with burst mode |

### Why Pure Canvas 2D (Not Three.js)
- Zero dependencies — uses the browser's native Canvas API
- No additional bundle size (38KB gzipped vs Three.js ~150KB)
- Simpler to maintain and modify
- Sufficient for a 2D particle effect

### How It Works

| Aspect | Implementation |
|--------|---------------|
| **Rendering** | `requestAnimationFrame` loop, 60fps |
| **Layers** | 7 layers: lunar cycle, ambient orbs, sigil circles, clockwork gears, constellation, spirit wisps, shooting stars |
| **Density** | Auto-scales to viewport per layer — 8 orbs, 4 sigils, 3 gears, 12 wisps, 60-180 particles |
| **Motion** | Varies per layer: Brownian (particles), sine-wave (wisps), continuous rotation (sigils/gears), drift (orbs) |
| **Mouse** | Constellation particles within 250px of cursor are gently pushed away |
| **Theme** | Detects `document.documentElement.classList.contains('dark')` each frame to switch colors |
| **Performance** | `IntersectionObserver` — skips rendering if canvas is off-screen |
| **Memory** | No allocations per frame; arrays reused |

### Layers (Draw Order)

Seven layers render in sequence on the same canvas, bottom to top:

| Layer | Description | Everything |
|-------|-------------|------------|
| **1. Lunar Cycle** | Moon phase + glow in top-right corner | 35px radius, waxes/wanes, 15% chance blood moon, alpha 0.2 (dark) / 0.35 (light) |
| **2. Ambient Orbs** | Large translucent radial gradients that drift and pulse | 8 orbs, radius 150-400px, 8 colors, alpha 0.08-0.20, 2x boost in light mode |
| **3. Sigil Circles** | Rotating occult symbols inside rings | 6 sigils (pentagram, hexagram, eye, ouroboros), alpha 0.15-0.35, 2.5x boost in light mode |
| **4. Clockwork Gears** | Brass-colored rotating gear mechanisms | 5 gears, 8-14 teeth, inner/outer rings, 4 spokes, alpha 0.12-0.30, 2.5x boost in light mode |
| **5. Constellation** | Particle dots + connection lines | 60-180 particles, lines within 180px, mouse repulsion, slow Brownian motion, 1.8x alpha boost in light mode |
| **6. Spirit Wisps** | Floating firefly lights on sine paths | 24 wisps, pastel colors, 2-4px size, soft radial glow, 2x alpha boost in light mode |
| **7. Shooting Stars** | Bright streaks with fading trails | Spawn 0.5-1.5s, 30% burst mode, 10 vibrant colors, thicker trails |

### Layer 1: Lunar Cycle

| Aspect | Implementation |
|--------|---------------|
| **Position** | Top-right corner: `x = canvas.width - 100`, `y = 80` |
| **Radius** | 35px |
| **Phase** | Cycles continuously: `phase += 0.001` per frame (full cycle ~105s) |
| **Shadow** | A second circle overlay at `shadowX = mx + (phase - 0.5) * mr * 2.2` — creates waxing/waning illusion |
| **Blood Moon** | 15% chance each cycle — moon tint shifts to `rgba(200, 50, 50, ...)` |
| **Glow** | Radial gradient centered on moon, radius `mr * 3`, alpha decays to 0 at edge |
| **Colors** | Dark: `200,220,255`; Light: `100,120,180`; Blood: `200,50,50` |

### Layer 2: Ambient Orbs

| Aspect | Implementation |
|--------|---------------|
| **Count** | 8 orbs |
| **Size** | `Math.random() * 250 + 150` (150-400px radius) |
| **Colors** | `80,60,180` (purple), `40,80,160` (blue), `100,50,140` (magenta), `180,60,120` (rose), `60,100,180` (indigo), `120,50,160` (violet), `50,90,140` (slate), `150,60,100` (rosewood) |
| **Alpha** | `0.08` to `0.20` (subtle but visible) |
| **Motion** | Slow drift at `±0.15` per axis, **bounces** off canvas edges |
| **Pulse** | Sine wave: `Math.sin(time * pulseSpeed + phase) * 0.3 + 0.7` — each orb has its own speed and phase |
| **Gradient** | `createRadialGradient(x, y, 0, x, y, radius)` with 3 stops: 100% at center, 40% at mid, 0% at edge |

### Layer 2: Constellation Particles

| Aspect | Implementation |
|--------|---------------|
| **Count** | 60-180 auto-scaled to viewport: `min(180, max(60, area/12000))` |
| **Motion** | Brownian: random acceleration `±0.02`/frame, speed capped at 1.2 |
| **Boundaries** | **Wrap** around edges (fade out one side, appear on the other) |
| **Connections** | Lines between particles within 180px, opacity `(1 - dist/180) * 0.15` |
| **Mouse** | Particles within 250px of cursor are gently pushed away |

### Layer 7: Shooting Stars

| Aspect | Implementation |
|--------|---------------|
| **Spawn** | ~0.5-1.5s intervals: `Math.random() * 1000 + 500` ms since last spawn. 30% chance of **burst** (2-3 simultaneous streaks) |
| **Origin** | Random side of canvas (top/bottom/left/right), starts 50px offscreen |
| **Direction** | Random angle (full 360°) |
| **Speed** | `Math.random() * 5 + 4` pixels/frame, decelerates via `*= 0.99` |
| **Life** | Starts at 1.0, decays by `0.006` per frame |
| **Colors** | 10 vibrant colors: red, orange, gold, lime, green, cyan, blue, violet, magenta, hot pink |
| **Trail** | Two segments: outer trail (8 segments, 40% opacity, lineWidth 3), inner trail (3 segments, 90% opacity, lineWidth 2) |
| **Head** | Bright dot at leading tip, alpha `min(life * 2, 1)`, 2.5px radius |
| **Cleanup** | Removed when life ≤ 0 or out of bounds +200px past edges |

### Layer 3: Sigil Circles

| Aspect | Implementation |
|--------|---------------|
| **Count** | 6 sigils |
| **Types** | Pentagram (5-point star, `points=5`), Hexagram (Star of David, `points=6`), Eye of Providence (`points=0`), Ouroboros (serpent eating tail, `points=1`) |
| **Size** | `Math.random() * 80 + 50` (50-130px radius per sigil) |
| **Colors** | Gold `255,200,100`, Violet `200,150,255`, Red `255,100,100`, Cyan `100,200,255`, Pink `255,150,200`, Lime `200,255,150` |
| **Alpha** | `0.15` to `0.35`, pulses via sine wave. 2.5x boost in light mode |
| **Rotation** | Continuous rotation at `±0.004` rad/frame — some clockwise, some counter |
| **Outer Ring** | 2 concentric circles drawn at `r` and `r * 0.85` with 1.5px and 0.5px stroke |
| **Perimeter Dots** | 8 dots evenly spaced around outer ring at `2px` radius |
| **Drawing** | Uses helper functions: `drawPentagram`, `drawHexagram`, `drawEye`, `drawOuroboros` |

### Layer 4: Clockwork Gears

| Aspect | Implementation |
|--------|---------------|
| **Count** | 5 gears |
| **Size** | Inner radius 25-55px, outer radius = inner + 10-25px (gear rim) |
| **Teeth** | `Math.floor(Math.random() * 6 + 8)` — 8-14 teeth per gear |
| **Colors** | Brass tones: `200,180,120`, `180,150,100`, `160,140,80`, `190,170,140`, `150,120,70` |
| **Alpha** | `0.12` to `0.30`, pulses via sine wave. 2.5x boost in light mode |
| **Rotation** | Continuous at `±0.003` rad/frame — mix of directions |
| **Structure** | Outer tooth ring → inner ring at `inR * 0.7` → center hub at `inR * 0.2` → 4 spokes |
| **Drawing** | `drawGear(cx, cy, inR, outR, teeth, rotation, color, alpha)` — uses `ctx.save/translate/rotate/restore` |
| **Tooth shape** | Each tooth is a triangle wedge: outer point at `outR`, inner valley at `outR - (outR - inR) * 0.3` |

### Layer 6: Spirit Wisps

| Aspect | Implementation |
|--------|---------------|
| **Count** | 24 wisps |
| **Size** | `Math.random() * 2 + 2` (2-4px radius) |
| **Colors** | Pastel: pale blue `180,220,255`, pale green `200,255,200`, pale pink `255,200,220`, warm gold `255,230,180` |
| **Alpha** | `0.15` to `0.50`, pulses with `life` multiplier that fades in/out. 2x boost in light mode |
| **Motion** | Sine-wave Lissajous pattern: `x = baseX + sin(phase) * ampX`, `y = baseY + cos(phase * 0.7) * ampY` |
| **Amplitude** | `ampX` 20-60px, `ampY` 40-100px |
| **Speed** | `phase += 0.0002-0.0005` per frame (very slow drift) |
| **Glow** | `createRadialGradient(x, y, 0, x, y, size * 4)` creates soft halo around each wisp |

### Light Mode Visibility

Every layer uses a theme-aware alpha multiplier computed once per frame:

```javascript
const lightBoost = isDark ? 1 : 2.5;  // applied to sigils, gears, orbs
// Wisps: 2x in light mode
// Constellation dots: 1.8x in light mode
// Constellation lines: 2.5x in light mode
// Moon: alpha 0.2 (dark) / 0.35 (light)
```

All alpha values are clamped to `max(1)` — never fully opaque.

### Colors

| Mode | Dot Color | Line Color | Background |
|------|-----------|------------|------------|
| Dark | `200, 220, 255` (light blue) | `140, 180, 255` (mid blue) | `#06051d` (body bg) |
| Light | `50, 70, 160` (dark blue) | `70, 90, 180` (mid blue) | `#ffffff` (body bg) |

### Configuration (Tunable)

```typescript
// In particle-canvas.tsx, inside the useEffect:
// --- Lunar Cycle ---
MOON_RADIUS = 35;           // Moon radius in px
MOON_X_OFFSET = 100;        // Distance from right edge
MOON_Y_OFFSET = 80;         // Distance from top edge
MOON_PHASE_SPEED = 0.001;   // Phase change per frame
MOON_BLOOD_CHANCE = 0.15;   // 15% chance of blood moon per cycle
MOON_GLOW_MULTIPLIER = 3;   // Glow radius = moon radius * this
MOON_DARK_ALPHA = 0.2;      // Moon alpha in dark mode
MOON_LIGHT_ALPHA = 0.35;    // Moon alpha in light mode

// --- Constellation ---
DENSITY_DIVISOR = 12000;    // Lower = more particles (was 7000)
MAX_PARTICLES = 180;        // Upper cap (was 300)
MIN_PARTICLES = 60;         // Lower cap (was 100)
MAX_SPEED = 1.2;            // Speed cap per axis
JITTER = 0.02;              // Random acceleration per frame (was 0.025)
CONNECT_DIST = 180;         // Max px for connection lines (was 220)
CONNECT_OPACITY = 0.15;     // Line opacity at full proximity (was 0.35)
CONNECT_WIDTH = 0.5;        // Line width (was 0.8)
MOUSE_RADIUS = 250;         // Mouse interaction radius
INITIAL_SPEED = 0.4;        // Initial speed per axis (was 0.6)
PARTICLE_MIN_SIZE = 0.8;    // Min dot size (was 1)
PARTICLE_SIZE_RANGE = 1.2;  // Added to min for max (was 2)
PARTICLE_MIN_ALPHA = 0.25;  // Min dot alpha (was 0.4)
PARTICLE_ALPHA_RANGE = 0.35; // Added to min for max alpha (was 0.5)

// --- Ambient Orbs ---
ORB_COUNT = 8;              // Number of glow orbs (was 6)
ORB_MIN_RADIUS = 150;       // Minimum orb radius (was 120)
ORB_MAX_RADIUS_OFFSET = 250; // Added to min for max: min + offset (was 200)
ORB_DRIFT = 0.15;           // Max drift speed per axis
ORB_PULSE_MIN = 0.003;      // Min pulse speed
ORB_PULSE_OFFSET = 0.005;   // Added to min for max pulse speed
ORB_MIN_ALPHA = 0.08;       // Min orb alpha (was 0.03)
ORB_ALPHA_RANGE = 0.12;     // Added to min for max alpha (was 0.06)

// --- Shooting Stars ---
STREAK_MIN_INTERVAL = 500;  // Min ms between streaks (was 1000)
STREAK_INTERVAL_RANGE = 1000; // Random extra ms: max = min + range (was 2000)
STREAK_BURST_CHANCE = 0.3;  // 30% chance of 2-3 simultaneous streaks
STREAK_MIN_SPEED = 4;       // Min speed (was 3)
STREAK_SPEED_RANGE = 5;     // Added for max speed (was 4)
STREAK_LENGTH_MIN = 40;     // Min trail pixels (was 30)
STREAK_LENGTH_RANGE = 50;   // Added for max trail (was 40)
STREAK_DECAY = 0.006;       // Life lost per frame (was 0.008)
STREAK_OUTER_WIDTH = 3;     // Outer trail width (was 2)
STREAK_INNER_WIDTH = 2;     // Inner trail width (was 1.5)
STREAK_HEAD_RADIUS = 2.5;   // Head dot radius (was 2)
STREAK_OUTER_OPACITY = 0.4; // Outer trail opacity (was 0.3)
STREAK_INNER_OPACITY = 0.9; // Inner trail opacity (was 0.8)

// --- Sigil Circles ---
SIGIL_COUNT = 4;            // Number of sigils
SIGIL_MIN_RADIUS = 40;      // Min sigil radius
SIGIL_RADIUS_RANGE = 60;    // Added to min for max radius
SIGIL_ROTATION_SPEED = 0.004; // Max rotation speed per frame
SIGIL_PERIMETER_DOTS = 8;   // Dots around outer ring
SIGIL_MIN_ALPHA = 0.1;      // Min alpha
SIGIL_ALPHA_RANGE = 0.15;   // Added to min for max alpha
// Sigil types: 5=pentagram, 6=hexagram, 0=eye, 1=ouroboros

// --- Clockwork Gears ---
GEAR_COUNT = 3;             // Number of gears
GEAR_MIN_INNER_R = 25;      // Min inner radius
GEAR_INNER_R_RANGE = 30;    // Added to min for max inner
GEAR_RIM_MIN = 10;          // Min rim thickness
GEAR_RIM_RANGE = 15;        // Added to min for max rim
GEAR_MIN_TEETH = 8;         // Min teeth count
GEAR_TEETH_RANGE = 6;       // Added to min for max teeth
GEAR_ROTATION_SPEED = 0.003; // Max rotation speed per frame
GEAR_SPOKE_COUNT = 4;        // Spokes per gear
GEAR_MIN_ALPHA = 0.08;       // Min alpha
GEAR_ALPHA_RANGE = 0.12;     // Added to min for max alpha

// --- Spirit Wisps ---
WISP_COUNT = 12;             // Number of wisps
WISP_MIN_SIZE = 1.5;         // Min wisp radius
WISP_SIZE_RANGE = 2;         // Added to min for max size
WISP_AMP_X_MIN = 20;         // Min horizontal amplitude
WISP_AMP_X_RANGE = 40;       // Added to min for max amp
WISP_AMP_Y_MIN = 40;         // Min vertical amplitude
WISP_AMP_Y_RANGE = 60;       // Added to min for max amp
WISP_MIN_SPEED = 0.0002;     // Min phase speed
WISP_SPEED_RANGE = 0.0003;   // Added to min for max speed
WISP_MIN_ALPHA = 0.1;        // Min alpha
WISP_ALPHA_RANGE = 0.3;      // Added to min for max alpha
// Wisp glow: radial gradient at size * 4 (soft halo)

// --- Shooting Stars ---
STREAK_MIN_INTERVAL = 500;  // Min ms between streaks (was 1000)

### Where It's Included

| Layout File | Pages Covered | Has Canvas? |
|---|---|---|
| `_home.tsx` | Homepage `/`, type pages (`/grocery`, `/bakery`, etc.) | ✅ `relative` wrapper, `bg-transparent` |
| `_general.tsx` | Info pages (search, manufacturer detail) | ✅ `relative` wrapper, `bg-transparent` |
| `layout-with-footer.tsx` | Terms, privacy, contact, flash sales, shop sub-pages | ✅ `relative` wrapper, `bg-transparent` |
| `layout.tsx` | Shop pages (`/shops`, `/shops/[slug]`), checkout, orders, products | ❌ Intentionally excluded |

### Adding the Canvas to a New Layout

```tsx
import ParticleCanvas from '@/components/ui/particle-canvas';

// In the wrapper div:
<div className="relative flex min-h-screen flex-col bg-transparent ...">
  <ParticleCanvas />
  {/* rest of content */}
</div>
```

### Excluding the Canvas from a Layout

Just don't import it. The layout uses its original `bg-gray-100` or `bg-surface` class.

### Performance

- **CPU usage:** ~1-3% on a modern machine (180 particles, 60fps)
- **Pauses when off-screen** via `IntersectionObserver` — zero cost when tab is in background or canvas is scrolled past
- **No layout thrashing** — uses `requestAnimationFrame`, no DOM writes
- **No memory leaks** — clean up cancels RAF, removes listeners, disconnects observer

---

## 2. Scroll Reveals (`animated-section.tsx`)

### What It Is
A framer-motion wrapper that fades sections in as they scroll into view.

### How It Works

| Prop | Default | Description |
|------|---------|-------------|
| `delay` | `0` | Stagger delay in seconds |
| `className` | — | Passed through to motion.div |

### Animation Values

```typescript
initial:  { opacity: 0, y: 30 }
whileInView: { opacity: 1, y: 0 }
viewport: { once: true, margin: '-50px' }
transition: { duration: 0.6, ease: 'easeOut', delay }
```

### Usage

```tsx
import AnimatedSection from '@/components/ui/animated-section';

<AnimatedSection delay={0.1}>
  <YourContent />
</AnimatedSection>
```

### Where It's Applied

- `classic.tsx` — wraps PromotionSliders, FilterBar, and the product grid section

---

## 3. Card Hover Effects

Product cards use Tailwind hover classes — no JS involved.

| Card Type | Classes |
|-----------|---------|
| `helium` (default) | `hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/10` |
| `argon` (bakery) | `hover:-translate-y-1 hover:shadow-downfall-lg hover:shadow-accent/10` |
| `neon` (grocery-two) | `hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/10` |

---

## 4. Key Architectural Decisions

1. **Canvas at layout level, not page level** — Ensures one canvas instance per page, not duplicated
2. **Fixed positioning** — Canvas stays in viewport, content scrolls over it (like Midjourney)
3. **Transparent backgrounds** — Layout wrappers use `bg-transparent` so canvas shows through; child components keep their own backgrounds
4. **Seven layers on one canvas** — All 7 layers share one `requestAnimationFrame` loop and one canvas context, drawn bottom-to-top: moon → orbs → sigils → gears → constellation → wisps → streaks. Avoids z-index issues, ensures proper draw order, minimal overhead.
5. **Continuous motion (Brownian + Lissajous + rotation)** — Constellation uses Brownian (random acceleration), wisps use Lissajous sine-wave paths (never repeat), sigils/gears use constant rotation. No layer ever settles.
6. **Wrap boundaries (particles), bounce boundaries (orbs), continuous (sigils/gears/wisps)** — Particles wrap for organic cosmic feel; orbs bounce to keep them in viewport; sigils/gears rotate in place; wisps loop on their sine paths indefinitely.
7. **No SSR for canvas** — Canvas rendering is entirely client-side via `useEffect`. The component returns a single `<canvas>` element that JS hydrates
8. **Theme-aware** — Detects `dark` class on `<html>` every frame. No React state needed, no re-renders on theme change

---

## 5. History

- **Session 24** — Initial implementation: canvas in BannerWithSearch only, absolute positioning, slow spring return motion
- **Session 25** — Moved to `_home.tsx` as fixed background, added to `_general.tsx`, tuned visibility/speed
- **Session 26** — Continuous Brownian motion (no settling), added to `layout-with-footer.tsx`, excluded from `layout.tsx` (shop pages), wrap boundaries
- **Session 27** — Added ambient glow orbs (6 drifting radial gradients, layer 1) and shooting stars (random streaks with fading trails, layer 3). Documented three-layer architecture. 6.10 combined approach implemented.
- **Session 28** — Optimized all three layers: orbs (8 → more visible 0.08-0.20 alpha), constellation (reduced to 60-180, slower jitter 0.02, fainter lines), shooting stars (10 vibrant colors, 0.5-1.5s spawns, 30% burst mode, thicker trails, longer life).
- **Session 29** — Added 4 new universe-themed layers: lunar cycle (waxing/waning/blood moon), sigil circles (pentagram/hexagram/eye/ouroboros), clockwork gears (3 brass gears with teeth), spirit wisps (12 floating sine-wave lights). 7-layer architecture complete.
- **Session 30** — Boosted volume: sigils 4→6, gears 3→5, wisps 12→24. Added light mode visibility: all layers get 2-2.5x alpha boost in light mode, moon alpha 0.2→0.35 in light mode, constellation dots/lines also boosted.

---

## 6. Future Animation Ideas

| # | Style | Status | Dependencies | Difficulty |
|---|-------|--------|-------------|------------|
| 6.1 | **Ambient Glow Orbs** | ✅ Done (Session 27) | None | Easy |
| 6.2 | **Mouse-reactive Parallax Depth** | Pending | None | Easy |
| 6.3 | **Fluid Gradient Mesh** | Pending | Optional: `simplex-noise` (~5KB) | Medium |
| 6.4 | **Shooting Stars / Streaks** | ✅ Done (Session 27) | None | Easy |
| 6.5 | **Ripple / Pulse on Interaction** | Pending | None | Easy |
| 6.6 | **Constellation with Star Shapes** | Pending | None | Easy |
| 6.7 | **Aurora / Light Waves** | Pending | None | Medium |
| 6.8 | **Floating Geometric Shapes** | ✅ Done (Session 29 — Gears) | None | Medium |
| 6.9 | **Glow Ring Pulse** | ✅ Done (Session 29 — Sigil rings) | None | Easy |
| 6.10 | **Combined: Constellation + Orbs + Streaks** | ✅ Done (Session 27) | None | Easy-Medium |
| 6.11 | **Lunar Cycle** | ✅ Done (Session 29) | None | Easy |
| 6.12 | **Sigil / Rune Circles** | ✅ Done (Session 29) | None | Easy |
| 6.13 | **Clockwork Gears** | ✅ Done (Session 29) | None | Medium |
| 6.14 | **Spirit Wisps** | ✅ Done (Session 29) | None | Easy |
| 6.15 | **Crow / Raven Silhouettes** | Pending | None | Medium |
| 6.16 | **Dimensional Rifts** | Pending | None | Medium |
| 6.17 | **Hourglass Sand Timer** | Pending | None | Medium |
| 6.18 | **Falling Stars Shower** | Pending | None | Easy |

**Recommendation for next:** 6.5 (Ripple / Pulse on Interaction) — adds tactile feedback with zero dependencies.

---

*Created: Session 26 — June 29, 2026*
*Last updated: Session 30 — June 29, 2026*
