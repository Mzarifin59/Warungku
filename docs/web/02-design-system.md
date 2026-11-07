# 02 — Design System

Visual source of truth. **Do not use values outside the tokens.** If a new
value is needed, propose adding a token here first.

## 1. Visual personality

Warm, clean, and trustworthy, like a tidy warungs. Lots of whitespace,
rounded corners, product photo as the hero, minimal decoration. Friendly to
non-technical users: large clear text, large buttons, icons always labeled
on important actions.

## 2. Color

Use semantic tokens in components, not raw color names. Values come from
the Tailwind palette (orange, green, stone, etc.) for consistency.

### 2.1 Brand & actions

| Token | Value | Used for |
|---|---|---|
| `--primary` | `#C2410C` (orange-700) | Primary button, active links, focus |
| `--primary-hover` | `#9A3412` (orange-800) | Primary button hover/active |
| `--primary-subtle` | `#FFEDD5` (orange-100) | Active chip background, soft highlight |
| `--primary-border` | `#FDBA74` (orange-300) | Border of primary-subtle elements |
| `--primary-foreground` | `#FFFFFF` | Text on primary |
| `--whatsapp` | `#15803D` (green-700) | **Only** the "Continue to WhatsApp" button and WA-related elements |
| `--whatsapp-hover` | `#166534` (green-800) | WhatsApp button hover |
| `--whatsapp-subtle` | `#DCFCE7` (green-100) | Light info/success background |

### 2.2 Neutrals (stone)

| Token | Value | Used for |
|---|---|---|
| `--bg` | `#FAFAF9` (stone-50) | Page background |
| `--surface` | `#FFFFFF` | Cards, dialogs, inputs |
| `--surface-muted` | `#F5F5F4` (stone-100) | Skeleton background, secondary areas |
| `--border` | `#E7E5E4` (stone-200) | Card borders, dividers |
| `--border-strong` | `#D6D3D1` (stone-300) | Input borders |
| `--text` | `#1C1917` (stone-900) | Primary text |
| `--text-muted` | `#57534E` (stone-600) | Secondary text |
| `--text-subtle` | `#78716C` (stone-500) | Placeholders, captions (only ≥14px) |

### 2.3 Semantics

| Token | Value | Used for |
|---|---|---|
| `--success` / `--success-subtle` | `#15803D` / `#DCFCE7` | Success, Published status |
| `--warning` / `--warning-subtle` | `#B45309` / `#FEF3C7` | Warning, Draft status |
| `--danger` / `--danger-subtle` | `#B91C1C` / `#FEE2E2` | Error, delete, Sold-out label |
| `--info` / `--info-subtle` | `#1D4ED8` / `#DBEAFE` | Neutral info |

### 2.4 Color rules
- Body text must have a contrast ratio ≥ 4.5:1 against its background;
  large text (≥ 24px, or ≥ 18.66px bold) ≥ 3:1. **Verify with a contrast
  tool** before adding a new combination; the contrast numbers in this
  document are estimates.
- Statuses **must not** be distinguished by color alone: always include
  text/icon (e.g. a "Sold out" badge, not just red).
- `--whatsapp` is not used for non-WhatsApp actions.
- Dark mode: out of scope. Do not add `dark:` variants.

### 2.5 Token implementation
Define them as CSS variables in `globals.css` and map them to Tailwind
through the theme configuration (the exact way depends on the installed
Tailwind version; verify). Components use semantic classes such as
`bg-primary`, `text-muted`, `border-border`, not `bg-orange-700`.

```css
:root {
  --primary: #C2410C;
  --primary-hover: #9A3412;
  --primary-subtle: #FFEDD5;
  --whatsapp: #15803D;
  --bg: #FAFAF9;
  --surface: #FFFFFF;
  --border: #E7E5E4;
  --text: #1C1917;
  --text-muted: #57534E;
  /* ...complete per the table above */
  --radius-md: 10px;
}
```

## 3. Typography

**Font:** Plus Jakarta Sans (loaded via `next/font/google`, weights 400,
500, 600, 700), with a `system-ui, sans-serif` fallback. One font family
for all text.

| Role | Mobile | Desktop (≥ md) | Weight | Note |
|---|---|---|---|---|
| Display (landing hero) | 32/40 | 48/56 | 700 | Landing only |
| H1 (page title) | 24/32 | 30/38 | 700 | One per page |
| H2 (section title) | 20/28 | 24/32 | 600 | |
| H3 (card/dialog title) | 18/26 | 18/26 | 600 | |
| Body | 16/24 | 16/24 | 400 | Minimum for form content (prevents iOS zoom) |
| Small body | 14/20 | 14/20 | 400 | Helper text, meta |
| Caption | 12/16 | 12/16 | 500 | Badge labels only |
| Price | 16/24 | 16/24 | 600 | `tabular-nums` |

Rules: reading text line length maximum ≈65 characters; do not use all
caps for sentences; product name maximum 2 lines (`line-clamp-2`).

## 4. Spacing, layout, shape

### 4.1 Spacing scale (4px base)
`1=4 · 2=8 · 3=12 · 4=16 · 5=20 · 6=24 · 8=32 · 10=40 · 12=48 · 16=64`
(Tailwind units). Space between page sections: 32–48px. Space inside cards:
16px.

### 4.2 Container & page padding

| Context | Max width | Horizontal padding |
|---|---|---|
| Landing | `max-w-6xl` | `px-4 sm:px-6 lg:px-8` |
| Public shop page | `max-w-5xl` | same |
| Dashboard (content) | `max-w-5xl` beside the sidebar | same |
| Forms (auth, shop, product) | `max-w-xl` | same |

### 4.3 Breakpoints
Use Tailwind defaults: `sm 640`, `md 768`, `lg 1024`, `xl 1280`.
**Design baseline 360px.** Test at 360, 390, 768, 1280.

### 4.4 Radius
`sm 6px` (small badges) · `md 10px` (buttons, inputs) · `lg 14px`
(cards) · `xl 20px` (sheet, dialog) · `full` (chips, avatars).

### 4.5 Elevation
Prefer **borders** over shadows. Only two shadows: `shadow-sm`
(interactive card on hover) and `shadow-lg` (dialog, sheet, popover). No
colored shadows.

## 5. Icons & images

- Icons: **lucide-react**, sizes 16 (inline), 20 (button/menu), 24
  (empty/hero), stroke 2. Decorative icons `aria-hidden`; unlabeled icons
  need `aria-label`.
- Product photo: ratio **1:1**, `object-cover`, radius `md`. Always have a
  fallback (first letter of product name on `--primary-subtle`).
- Shop logo: 40–64px circle; fallback = shop initials.
- No external images in Phase 1 (only local assets/placeholders).

## 6. Motion

- Duration 150–200ms, easing `ease-out`. Only for feedback (hover, open/close
  sheet, toggle).
- Respect `prefers-reduced-motion` (disable non-essential transitions).
- No decorative animation, parallax, or autoplay.

## 7. Base component styles

### Buttons
| Variant | Style | Use for |
|---|---|---|
| `primary` | bg `--primary`, white text | One primary action per screen |
| `whatsapp` | bg `--whatsapp`, white text, WA icon | Only "Continue to WhatsApp" |
| `secondary` | border `--border-strong`, bg surface | Secondary action |
| `ghost` | no border/bg | Tertiary actions, icons |
| `destructive` | bg `--danger`, white text | Delete (after confirmation) |

Sizes: `sm` height 36, `md` height 44 (default), `lg` height 48.
**Minimum touch target 44×44px** (`sm` buttons only in desktop areas or with
extra padding). States: hover, active, `focus-visible` (ring 2px
`--primary` + offset 2px), disabled (opacity 50%, cursor not-allowed),
loading (spinner + text, fixed width).

### Input
Height 44, radius `md`, border `--border-strong`, surface background, 16px
text. Label **always visible above** the input (not placeholder-only).
Helper text below (14px muted). Error: border `--danger`, red message
below with icon, `aria-describedby` linking to the message. Required fields
marked with text "(required)", optional with "(optional)", not just a star.

### Card
Surface background, `--border`, radius `lg`, 16px padding. Clickable card:
hover `shadow-sm` + `--border-strong`, `focus-visible` ring.

### Badge/status
Radius `full`, text 12/16 weight 500, padding 2×8, always text + (optional)
icon.
`Published` (success-subtle), `Draft` (warning-subtle), `Sold out`
(danger-subtle), `Available` (neutral).

### Dialog, sheet, toast
- Dialog: centered on desktop; on mobile it becomes a **bottom sheet**
  (radius `xl` on top).
- Cart & checkout: bottom sheet on mobile, right side panel on ≥ md.
- Toast (sonner): bottom-center on mobile, top-right on desktop; 4s
  duration; not for errors that need action (use an inline message instead).

### Skeleton
Background `--surface-muted`, radius per element, gentle pulse animation
(disabled under reduced-motion).

## 8. Page patterns

- **Dashboard page header:** H1 + short description (optional) + primary
  action on the right (desktop) / below the title (mobile).
- **Lists:** mobile uses stacked cards; desktop may use a table. No wide
  tables requiring horizontal scroll on mobile.
- **Forms:** one column, action button below; on mobile the primary button
  is full width.
- **Empty:** 24–48px icon + title + one sentence + one action button.

## 9. Do / Don't

| Do | Don't |
|---|---|
| Semantic tokens (`bg-primary`) | Raw hex / `orange-700` in a component |
| One `primary` button per screen | Two competing `primary` buttons |
| Text + icon for status | Color only |
| Bottom sheet on mobile | Small modal with long content on mobile |
| Skeleton for loading | Full-screen spinner |
| Everyday Indonesian text | Technical terms (slug, publish, SKU) in the UI |
