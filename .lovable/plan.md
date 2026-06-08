
## What's wrong now

- Background is a flat, muddy near-black with weak radial washes — reads as "dark mode default", not premium.
- Vermilion CTA sits on warm-brown canvas → low contrast, buttons feel dim and dusty.
- Empty state, footer band, and bottom-nav blend into the same brown — no depth, no hierarchy.
- Glass header is barely distinguishable from body; "BREAKING" tape looks like a sticker on cardboard.

## Direction: "Obsidian Wire"

A cool obsidian/graphite canvas with a single warm signal accent and refined metallic gradients. Think Bloomberg Terminal × Linear × Apple Sports — newsroom seriousness, premium polish.

**Palette (all OKLCH, dark-first):**
- Canvas: deep obsidian `oklch(0.11 0.012 250)` with subtle blue undertone (not brown)
- Surface 1 (cards): `oklch(0.16 0.014 250)`
- Surface 2 (elevated): `oklch(0.19 0.016 250)`
- Border: `oklch(0.26 0.014 250)` + hairline `white/6`
- Foreground: near-white `oklch(0.98 0.003 250)`
- Muted: `oklch(0.66 0.015 250)`
- **Signal (single accent)**: vermilion→amber gradient `oklch(0.70 0.22 28) → oklch(0.80 0.18 55)`
- Ember glow: `oklch(0.78 0.20 38)`
- Up/Down: emerald `oklch(0.78 0.16 155)` / coral `oklch(0.70 0.22 25)`
- Category accents kept but desaturated 15% so signal stays dominant.

**Background system (layered, not flat):**
1. Base obsidian canvas
2. Top-left aurora: signal @ 18% blur 140px
3. Top-right aurora: ember @ 14% blur 160px
4. Subtle vertical noise grain (existing SVG, opacity 0.06)
5. Faint top vignette `linear-gradient(180deg, white/3, transparent 30%)` for "lit from above" feel
6. Bottom fade into pure obsidian behind the nav

**Gradient tokens (reusable):**
- `--gradient-signal`: `linear-gradient(135deg, signal, ember)`
- `--gradient-surface`: `linear-gradient(180deg, surface-2, surface-1)` (card top-light)
- `--gradient-text-headline`: `linear-gradient(180deg, foreground 0%, foreground/70 100%)`
- `--gradient-border-premium`: conic-ish edge using `signal/40 → transparent → ember/30`
- `--shadow-premium`: layered `0 1px 0 white/6 inset, 0 20px 50px -20px black/60, 0 0 30px -10px signal/25`

## Concrete changes

### 1. `src/styles.css` — token + utility overhaul
- Replace warm-brown `--background`/card/border tokens with cool obsidian set above.
- Add `--gradient-signal`, `--gradient-surface`, `--gradient-text-headline`, `--shadow-premium`, `--shadow-card`.
- Rework `body` background: 2 auroras + top vignette + grain. Tune blur sizes so the canvas reads premium at mobile width.
- Rewrite `@utility glass` to use a real `linear-gradient` surface + `backdrop-blur` (no hand-written `-webkit-` prefix; per Tailwind v4 gotchas — let the build prefix).
- Add `@utility surface-card`: gradient surface + premium shadow + 1px inner top-light border.
- Add `@utility btn-signal`: gradient bg, inner highlight, layered shadow, glow on press.
- Add `@utility chip-active` / `chip-idle` for filter pills with subtle gradient + inset highlight.
- Update `.tape-stripe` to use the signal→ember gradient instead of repeating stripes (cleaner, less "construction tape").
- Replace `.headline-gradient` with the new text gradient (white→white/65) so headlines feel chiseled, not orange-tinted.

### 2. `src/components/Header.tsx`
- Header bg: `surface-card` glass with a 1px gradient bottom border instead of plain border.
- BREAKING strap: gradient pill (signal→ember) with subtle inner shadow, not diagonal stripes; right side: thin hairline divider + mono timestamp moved here for "wire" feel.
- Brand wordmark: keep headline gradient but switch to white→white/70 (no orange tint).

### 3. `src/components/AppShell.tsx`
- Bottom nav: switch to `glass` + top-edge gradient hairline; active indicator becomes the signal→ember gradient bar (currently solid).
- Add bottom fade overlay above nav so content dissolves into the bar instead of hard-cutting.

### 4. `src/components/NewsView.tsx`
- Filter chips: active = `chip-active` (gradient surface + inset light); idle = `chip-idle` (no-fill, hairline border, muted text → hover foreground).
- Hero card: full `surface-card` + edge-glow border using the new premium gradient; CTA arrow gets the signal gradient.
- Standard news cards: left accent stripe becomes a 3px gradient (category color → transparent), card gets `surface-card` (subtle top-light).
- Empty state: replace dashed border with a `surface-card` panel + tiny signal dot + smaller muted copy.
- Locked stack: lock pill uses `btn-signal`; subscribe CTA replaced with `btn-signal` (gradient + premium shadow + sweep).
- Sticky CTA: glass shell + `btn-signal` inside.

### 5. `src/components/LiveView.tsx`
- Match card: `surface-card` + edge-glow; score numerals slightly larger, leader number gets gradient text (signal→ember) instead of flat orange.
- Game-filter chips: same `chip-active`/`chip-idle` system as News.
- Watch-in-channel CTA: `btn-signal`.

### 6. `src/components/Onboarding.tsx`
- Recolor auroras to cool obsidian + warm signal (currently both warm → muddy).
- Enter-the-wire CTA: `btn-signal` (gradient + premium shadow + signal-sweep).
- Three category cards keep edge-glow but get `surface-card`.

### 7. `src/components/Ticker.tsx`
- Replace `bg-card/60` band with `glass` + top/bottom 1px gradient hairlines so the ticker feels like a brass rail rather than a brown stripe.

## Out of scope (explicitly not changing)

- API contract / data wiring / funnel events / Telegram script — untouched.
- Routing, i18n strings, brand name, copy — untouched.
- No new dependencies (no MagicUI, no shadcn additions for this pass).

## Technical notes

- All new colors via `@theme` tokens in `src/styles.css`, consumed as Tailwind classes (`bg-signal`, `text-ember`, etc.) — no hardcoded hex in components.
- Gradients exposed as CSS variables + `@utility` wrappers so components stay class-only.
- Comply with Tailwind v4 gotchas: never hand-write `-webkit-backdrop-filter`; use `backdrop-blur-*` utilities; bare `border` always paired with explicit `border-color`.
- Single visual pass; no behavior, no new state, no new routes.
