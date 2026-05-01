# Design

## Theme

Light by default (Recruiter Light). The page is read mid‑afternoon on a laptop in good ambient light; paper‑forward neutrals make the embedded PDF look native and let the assistant feel quieter than a dark surface would. Nine alternate themes ship as opinionated recolors, not slider variants.

## Color

OKLCH throughout. Every neutral is tinted toward a small graphite‑teal hue (h ≈ 215, c ≈ 0.006) so nothing is pure gray. Strategy is **Restrained** in every theme: tinted neutral surfaces plus a single decisive accent. Themes differ in surface lightness, accent hue, and chip/border treatment, not by stacking new colors.

Accent role only appears on:

- The primary CTA (Download resume).
- The active suggested chip on hover/focus.
- The active link in the action row.
- The streaming caret in the chat surface.

It does **not** appear as section dividers, decorative tints, alert bars, or gradient text.

## Typography

- **UI / body:** Inter Tight, weights 400 / 500 / 600. System fallback `ui-sans-serif`.
- **Mono accents:** IBM Plex Mono, weight 500. Used for the stack chips, timestamps in admin, and the assistant's "verified" markers.
- **Scale:** 1.25 ratio. 12 / 13 / 15.5 / 19 / 24 / 30. Body line‑height 1.55, headings 1.2. Body measure capped at 65ch in the chat column.
- **Numbers:** `font-feature-settings: "tnum" 1, "ss01" 1` in any place numbers stack (admin tables, contact phone).

## Layout

- 12‑column conceptual grid; the actual layout is two real columns split by a 1px draggable divider with an 8px hit zone.
- Resume panel default width 50%, min 32%, max 68%. Drag persists to `localStorage` under key `resume.split.left`.
- Mobile (<860px) collapses to stacked: resume first (auto height with PDF capped at 70vh), assistant below (sticky composer).
- Spacing rhythm: 4 / 8 / 12 / 16 / 24 / 32 / 48. The action row uses 8px between buttons; the resume edge has 24px of left padding; the chat composer has 16px breathing room above the suggested chips.
- No card around the PDF. A 1px hairline frame and a top metadata row (filename, page count, "Open in tab") instead.

## Surfaces

- `--bg`: page background, always the lightest surface.
- `--panel`: the two column surfaces; usually equal to `--bg` in light themes, slightly raised in dark themes via lightness, never via shadow.
- `--panel-soft`: chat user bubble fill, suggested chip fill at rest.
- `--border`: 1px hairlines. Always low‑contrast, derived from neutral L − 0.08.
- `--accent` and `--accent-fg`: paired so the CTA always passes contrast on its own.

No drop shadows on cards. Elevation comes from border + neutral shift only.

## Components

- **Action row:** outlined ghost buttons with a single solid primary (Download). Icons are 14px, leading the label, never centered alone.
- **Suggested chips:** soft pill, 13px label, 9px / 14px padding, hairline border, hover lifts to `--panel-soft` with accent border. Wrapping is allowed; never horizontal scroll.
- **Chat bubbles:** assistant turn is borderless on the page surface (no bubble), user turn is a `--panel-soft` pill with the same hairline as chips. This keeps the assistant's answer reading like a paragraph, not a chat toy.
- **Streaming indicator:** a single 1px caret, blinks with `steps(1)` 1s. Disabled under `prefers-reduced-motion`.
- **PDF viewer:** native `<iframe>` with `#toolbar=0&navpanes=0&view=FitH`. A hairline frame and a small toolbar above (filename, page indicator, open‑in‑tab link).
- **Theme switcher:** popover with 10 swatch dots in a 5×2 grid; each swatch is a 16px disc showing `--bg` filled and `--accent` as a 1px ring. Active item gets a larger ring.

## Motion

- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` (ease‑out‑quart) for opacity and transform. Never on layout properties.
- Durations: 120ms (hover), 180ms (popover, toast), 240ms (theme transition fade).
- The chat caret is the only continuous motion on the page.

## Themes (10)

All restrained. Surface and accent only.

| Theme | Mode | Surface character | Accent (OKLCH) |
|---|---|---|---|
| Recruiter Light *(default)* | light | warm paper, h≈85 | oklch(0.46 0.07 200) |
| Ivory Minimal | light | true ivory, h≈70 | oklch(0.32 0.02 60) |
| Warm Editorial | light | cream, h≈55 | oklch(0.42 0.13 30) |
| Soft Glass | light | cool pearl, h≈220 | oklch(0.52 0.08 240) |
| Executive Dark | dark | warm charcoal, h≈35 | oklch(0.78 0.10 75) |
| Premium Black | dark | near‑black, h≈215 | oklch(0.92 0.01 215) |
| Midnight Blue | dark | deep navy, h≈245 | oklch(0.74 0.11 230) |
| Graphite Purple | dark | warm graphite, h≈300 | oklch(0.72 0.10 305) |
| Cyber Slate | dark | cold slate, h≈195 | oklch(0.80 0.10 180) |
| Terminal Pro | dark | tinted carbon, h≈140 | oklch(0.80 0.16 145) |

The accent values above are tuned per surface; high‑chroma values are reserved for mid‑lightness only.

## Iconography

Lucide, 14–16px, stroke 1.6. No color fills. Mixed icon styles are forbidden.

## Don'ts (project‑specific)

- No colored side‑stripes on chat bubbles or callouts.
- No gradient text anywhere, including hero name.
- No glass blur on panels. The "Soft Glass" theme uses surface tinting, not `backdrop-filter`.
- No floating "AI is thinking" animation. The caret carries that role.
- No card around the PDF. No card‑in‑card anywhere.
- No emoji in UI copy. Lucide icons only.
