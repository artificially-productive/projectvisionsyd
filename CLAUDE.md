# CLAUDE.md — Project Vision website

Context for Claude Code. Read this before editing.

## What this is

A single-page marketing website for **Project Vision Pty Ltd** — an integrated
NSW property firm (developers, architects, builders, est. 1999). This is the
finalised **"Editorial"** design direction.

Static site. **No build step, no framework, no npm dependencies.**

## File map

```
index.html      The ENTIRE site — markup, styles, and logic in one file.
support.js      Required runtime. Do not edit or delete.
assets/         30 images: 7 hero photos, 21 project photos (3 × 7 projects),
                directors photo, textures (nolli.png, emboss-blue.png),
                logo.png, linkedin.png, facebook.png
vercel.json     Caching headers + clean URLs for Vercel hosting.
```

## Architecture

`index.html` contains a component defined inside `<x-dc>` with two parts:

1. **Template** — the markup between `<x-dc>` and `</x-dc>`. Uses `{{ value }}`
   holes, `<sc-for list="{{ items }}" as="item">` for repetition, and
   `<sc-if value="{{ flag }}">` for conditionals.
2. **Logic** — a `class Component extends DCLogic` in the `<script data-dc-script>`
   block at the bottom. Its `renderVals()` return object supplies every
   `{{ value }}` the template reads. State lives in `this.state`.

To change content, find the data arrays near the top of `renderVals()`:
`RAW` (projects), `TESTIMONIALS`, `SECTORS_A`, `disciplines`, `stats`.

## Hard rules

- **Inline styles only.** No CSS classes, no stylesheets, no Tailwind. Every
  style is a `style="..."` attribute. Pseudo-states use `style-hover="..."`.
- The only global CSS lives in `<helmet><style>` at the top of the template:
  the reset, `@keyframes`, and print rules. Nothing else belongs there.
- **Single Unified Website.** There are no AB views or switchers. The website is
  a single, clean, cohesive build.

## Design tokens

| Token          | Value     |
|----------------|-----------|
| Brand blue     | `#1B6FE4` |
| Blue pressed   | `#1559BD` |
| Light blue     | `#5b9bff` |
| Ink navy       | `#0D1E35` |
| Deep navy      | `#09152B` |
| Body text      | `#1C2B3A` |
| Muted text     | `#6B7A90` |
| Hairline       | `#DDE4EE` |
| Editorial beige| `#F7F6F3` |
| Accent red     | `#C0392B` |

Fonts: **Inter** (all UI, weights 500–900) and **Playfair Display italic**
(accents only — the last clause of headings, quotes, ghost numerals).
All sizes use `clamp()`. Shared easing: `cubic-bezier(.16, 1, .3, 1)`.

## Animation system

Keyframes are declared once in the helmet: `pvKen` (hero Ken Burns), `pvUp`
(hero entrance), `pvTick` (sector marquee), `pvDrift` (ambient gradient),
`pvReveal` (scroll reveal), `pvCapA`/`pvCapB` (caption swap), `pvRolePulse`
(discipline highlight).

- **Scroll reveal**: add `data-rv` to any element; optional `data-rv-d="80"` for
  a stagger delay. An IntersectionObserver adds `.pv-in`. Uses an *animation*,
  not a transition — a transition can strand elements invisible on re-render.
  A 4s safety timeout force-reveals anything still hidden.
- **Count-ups**: `data-countup data-target="2200"` with optional
  `data-suffix`/`data-prefix`. 1600ms, cubic ease-out.
- **Scroll progress**: 2px red bar at the top, driven by `--pv-p` on
  `[data-progress]`.
- Timers: hero 6s, works carousel 5.5s, testimonials 5s. All pause while the
  menu or modal is open.

## Responsive

Single JS breakpoint: `isMobile = window.innerWidth < 880`. Everything else is
fluid via `clamp()` and `flex-wrap`. Mobile-specific overrides are computed in
`renderVals()` and passed down as values (e.g. `sectorsCols`, `whyBtnWidth`,
`carouselAspect`) — never as CSS media queries.

`body` uses `overflow-x: clip`, **not** `hidden` — `hidden` breaks
`window.scrollY` and `position: sticky`.

## Running locally

Any static server works:

```bash
npx serve .
# or
python3 -m http.server 8000
```

Opening `index.html` directly via `file://` also works.

## Deploying

Vercel, Netlify, Cloudflare Pages, GitHub Pages — all work with zero config.
Framework preset **Other**, no build command, output directory is the repo root.
See `README.md` for Vercel steps and the DNS records for projectvision.com.au.

## Content reference

Office: Unit 11 / 8 Avenue of Americas, Newington NSW 2127 · 02 9654 4030 ·
info@projectvision.com.au
Directors: Branko Poljak (+61 411 281 299), Amitav Goswami (+61 411 208 890)

Positioning: three standalone disciplines that can be engaged individually or
together; remuneration tied to the client's profit margin, not billable hours.
