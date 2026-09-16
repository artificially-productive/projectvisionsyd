# Project Vision — website

Single-page marketing site for Project Vision Pty Ltd. Editorial design
direction. Static HTML, no build step, no dependencies.

## Quick start

```bash
npm run dev      # serves at http://localhost:3000
```

Or with anything else that serves static files:

```bash
python3 -m http.server 8000
```

Opening `index.html` directly in a browser also works.

## Structure

```
index.html      the whole site (markup + inline styles + logic)
support.js      required runtime — do not edit
assets/         photography, textures, logo, social icons
vercel.json     caching headers + clean URLs
CLAUDE.md       architecture and conventions — read before editing
```

## Editing

All content lives in `index.html`. Text is editable directly in the markup;
structured data (projects, testimonials, sectors) sits in arrays at the top of
`renderVals()` in the script block at the bottom of the file.

Styling is **inline only** — there are no CSS classes. See `CLAUDE.md` for the
colour tokens, type scale, and animation system.

## Deploy to Vercel

### Drag and drop

1. Go to https://vercel.com/new
2. Drag this entire folder onto the page.
3. Framework Preset **Other**. Leave Build Command and Output Directory empty.
4. Deploy.

### CLI

```bash
npm i -g vercel
vercel          # preview
vercel --prod   # production
```

### Git

Push this folder to a repo and import it at https://vercel.com/new.
Framework Preset **Other**, no build command.

## Custom domain

Vercel dashboard → project → **Settings → Domains → Add** → `projectvision.com.au`.
Then at your registrar:

| Type  | Name | Value                |
|-------|------|----------------------|
| A     | @    | 76.76.21.21          |
| CNAME | www  | cname.vercel-dns.com |

DNS typically propagates within an hour. HTTPS is issued automatically.
