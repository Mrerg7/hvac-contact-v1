# hvac.contact

Premium domain sales landing page for **hvac.contact** — an exact-match HVAC digital asset offered for acquisition.

Built with Astro (static) + Cloudflare Workers Assets on the free Workers/Pages plan. The live flow stays minimal: hero → value → market → vision → acquire.

## Features

- SEO title/meta formatted for domain sales (`[Domain] | Premium Domain for Sale | Brand`)
- Schema.org `WebPage`, `Organization`, and `Product`/`Offer` JSON-LD
- Canonical HTTPS apex enforcement in the Worker (www/http/`index.html` → 301)
- Security headers (HSTS, frame deny, nosniff, referrer, permissions)
- CRO: Buy Now / Make Offer / Contact Agent, escrow trust signals, exit-intent brief
- Mobile-first: 48px tap targets, collapsible nav, 16px base type
- Insights section for content/DA building
- Light/dark theme toggle (defaults to dark)

## Local development

```bash
npm install
npm run dev
```

Dev server defaults to port `4321`. For a quieter port:

```bash
npm run dev -- --port 43123 --host 127.0.0.1
```

## Build & deploy (Cloudflare Workers free plan)

```bash
npm run build
npx wrangler deploy
```

Requires Wrangler auth against the account that owns the `hvac-contact-v1` Worker and the `hvac.contact` custom domains.

## Inquiry API

`POST /api/inquiry` validates the payload and returns a `mailto:` handoff to `sales@desertrich.com` — no paid email binding required on the free plan.

## Project layout

- `src/pages/` — homepage + insights
- `src/components/` — hero, sections, inquiry modal, exit intent
- `src/worker.ts` — redirects, security headers, inquiry endpoint
- `public/` — robots.txt, favicon, cache hints
- `wrangler.toml` — Worker + assets + custom domains

## License

Private listing asset site. All rights reserved by the domain owner.
