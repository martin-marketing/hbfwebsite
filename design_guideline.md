# HBF Website — Design Guidelines

**Project:** Heidi Blondin Financial Inc. — heidiblondin.com rebuild  
**Stack:** Astro + MDX · Tailwind CSS · Cloudflare Pages  
**Last updated:** 2026-05-05  
**Status:** Brand palette locked. Typography direction pending Heidi's final pick from moodboard.

---

## 1. Brand Palette (locked)

All colours confirmed from the live site and the April 2026 moodboard review.

```js
// Tailwind theme.extend.colors.brand
plum:      '#593D58'   // dominant — plum/burgundy; primary bg, text-on-light
plumMid:   '#7A5577'   // secondary plum; subheadings, muted text-on-light
sage:      '#A2A47D'   // sage green; accent, icon fills, tag backgrounds
sageDark:  '#7A7D5E'   // sage dark; labels, borders, secondary text
gold:      '#B87B1E'   // warm gold; highlight, hover states, numbered accents
tintPlum:  '#F5F0F5'   // light plum surface; card bg, section alt bg
tintSage:  '#F2F2EA'   // light sage surface; card bg, section alt bg
pageBg:    '#F0ECF0'   // neutral page background (warm modern direction)
ink:       '#222222'   // body text on white/light surfaces
inkSoft:   '#141413'   // button text
white:     '#FFFFFF'
```

**Usage rules:**
- Plum (`#593D58`) is the primary brand surface. White headings/text sit on it.
- Cream/tint-plum (`#F5F0F5`) is the primary light surface for sections and cards.
- Gold (`#B87B1E`) is an accent only — highlights, hover states, numbered markers. Never a primary background at scale.
- Sage (`#A2A47D`) softens the palette; used for icon containers, tags, borders.
- Never use both sage and gold as competing accents in the same component. Pick one per section.

---

## 2. Typography

### 2.1 Three candidate directions (choose one for launch)

The April 2026 moodboard presented three type pairings, all using the same palette. The **final direction has not been locked** — Heidi to confirm during Phase 1 review. Document your pick in this section once chosen.

| Direction | Heading | Body | Character | Status |
|---|---|---|---|---|
| **01 · Editorial Authority** | Fraunces (variable serif) | Inter | Regal, established, long-form editorial. Signals 20 yrs experience. | Candidate |
| **02 · Warm Modern** | Figtree (humanist sans) | Inter | Approachable, rounded, relationship-first. Locally owned feel. | Candidate |
| **03 · Quiet Confidence** | DM Sans (geometric sans) | DM Sans (lighter weights) | Minimal, grid-driven, contrarian. Differentiates from stock-heavy advisor sites. | Candidate |

**Fallback (current site, known safe):** Playfair Display + Open Sans. Use this for Phase 1 scaffolding if the direction decision is delayed — it's already compliant and client-approved.

### 2.2 Type scale (direction-agnostic)

```
Display  / Hero h1:  clamp(48px, 7vw, 76px)   — leading: 1.05–1.1
Heading  / h2:       clamp(32px, 4vw, 50px)   — leading: 1.1–1.15
Subhead  / h3:       clamp(22px, 3vw, 32px)   — leading: 1.2
Body lg:             19px                      — leading: 1.6
Body base:           16–17px                  — leading: 1.6–1.65
Caption / label:     12–13px                  — letter-spacing: 0.15–0.25em, uppercase
```

### 2.3 Font loading

Self-host all fonts — no Google Fonts CDN calls in production. Reasons: performance, privacy (PIPEDA), removes third-party dependency.

Load path: `/public/fonts/` → referenced via `@font-face` in a global CSS file. Preload the two heaviest cuts (heading regular + bold) via `<link rel="preload">` in `<head>`.

---

## 3. Spacing & Layout

Grid: **12-column**, max content width **1100px**, page edge padding `clamp(16px, 4vw, 40px)`.

```
Space scale (Tailwind rem defaults):
2   →  8px   fine detail, icon padding
4   →  16px  component internal padding
6   →  24px  between related elements
8   →  32px  between components in a group
12  →  48px  between sections on mobile
16  →  64px  between sections on desktop
24  →  96px  major section gaps desktop
32  → 128px  hero padding
```

Section rhythm: alternate between plum-bg sections and tint/white sections. Never two identical backgrounds in a row.

---

## 4. Components

### 4.1 Navigation

**Desktop:** Horizontal top nav. Logo left, links centre, phone CTA right.  
**Mobile:** Hamburger → slide-in drawer. Column headers become accordion toggles.

Top-nav link order:
```
Home · About · Testimonials · Financial Services [mega-menu] · Videos · Blog · Contact · Resources · [phone]
```

**Financial Services mega-menu — 3 columns:**

| Investing | Insurance | Planning |
|---|---|---|
| Investments (hub) | Insurance (hub) | Estate Planning |
| RRSP | Life Insurance | Charitable Giving |
| TFSA | Critical Illness Insurance | Retirement Income Planning |
| FHSA | Disability Insurance | |
| RESP | Combination Insurance | |
| Group Retirement Savings | Individual Health & Dental Plans | |
| Segregated Funds | Travel Insurance | |
| | Group Benefits & Savings | |
| | *Request a Quote →* (CTA button) | |

Column headers link to `/financial-services/?view=investing` (etc.) — not just labels.  
Mobile: accordion collapse, one column at a time.

### 4.2 Header

- Logo: SVG, links to `/`
- Phone CTA: `tel:6138872726` — always visible on desktop; sticky on mobile scroll
- No hamburger label text — icon only on mobile, `aria-label="Open menu"`
- Sticky on scroll with a reduced-height variant (logo smaller, bg semi-opaque)

### 4.3 Footer

Two-zone layout:
1. **Content zone** — columns: About blurb + address, Quick links, Services, Contact
2. **Compliance zone** — full-width, distinct bg (slightly darker plum or plum-dark), smaller type

**Compliance zone must include (on every page, verbatim):**

```
MUTUAL FUNDS, APPROVED EXEMPT MARKET PRODUCTS AND/OR EXCHANGE TRADED FUNDS ARE OFFERED THROUGH 
INVESTIA FINANCIAL SERVICES INC.
LIFE INSURANCE AND RELATED PRODUCTS ARE OFFERED THROUGH HEIDI BLONDIN FINANCIAL / QUALIFIED 
FINANCIAL SERVICES.
[CIRO "Regulated by CIRO" logo → link to ciro.ca]
© [year] Heidi Blondin Financial Inc. · Privacy Policy · Website Compliance
785 Midpark Drive, Suite 100, Kingston ON K7M 7G3
```

**CIRO logo:** place in compliance zone. Link target `https://www.ciro.ca` (English). Required since Dec 31, 2024 — absence is a compliance gap.

### 4.4 Hero / Page Header

- Full-width, plum background
- H1 in white (heading font)
- Optional short lede in `#D9C8D8` (muted plum-on-plum)
- Optional hero image: editorial 3/4 body shot, right-aligned on desktop, stacked on mobile
- Primary CTA: cream/white button → contact form; Secondary CTA: phone link

### 4.5 CTABand

Full-width section, plum bg, centred headline + single CTA button. Used at the base of most service pages before the footer.

```
CTA routes to: /contact/ (contact form) — NOT a public Calendly link
CTA text: "Schedule a Free Consultation" or "Get in Touch"
```

### 4.6 Cards

Three variants:

**Service card** — used in mega-menu previews and the FS hub page.  
- White bg, `tintSage` or `tintPlum` surface, subtle shadow
- Icon (sage-tinted square with dot or SVG), heading, 1-2 line description, arrow link

**Blog card** — title, category tag, date, excerpt (2–3 lines), "Read more →"

**Team member card** — editorial 3/4 body photo (not headshot), name, role, short bio, optional personal-interests gallery row

### 4.7 Testimonials

- Pull-quote style: large opening quotation mark (gold), quote text, attribution (initials + city)
- Attribution: initials only, city in Ontario (per CIRO/IIROC advertising rules — no full names without written consent on file)
- No star ratings (regulatory: quantified endorsements require support documentation)

### 4.8 Video Embeds

Use `lite-youtube-embed` web component. Lazy loads the iframe only on click — prevents YouTube from loading tracking scripts on page load (privacy/performance).

```html
<lite-youtube videoid="YOUTUBE_ID" playlabel="Play: [title]"></lite-youtube>
```

### 4.9 Resource Downloads

Downloads live at `/downloads/{filename}` (in-repo at `/public/downloads/`). No Dropbox links.

```html
<a href="/downloads/budget-worksheet.xlsx" download class="resource-link">
  Budget Worksheet (XLS)
</a>
```

### 4.10 Forms

**Contact form fields:** First Name (req), Last Name (req), Email (req), Phone (req), Questions/Comments (req)  
**Insurance Quote fields:** First Name (req), Last Name (req), Insurance Type (req), Sex (req), Overall Health (req), Date of Birth (req), Coverage Amount (req), Smoker? (req), Email (req), Phone (req), Additional Comments (opt)

**Both forms must include:**
- Cloudflare Turnstile widget (spam gate)
- CASL consent checkbox — **unchecked by default**:  
  `"I consent to Heidi Blondin Financial contacting me about my inquiry."`
- Submit → Cloudflare Pages Function → Resend → notify `angela@heidiblondin.com` + `jack@heidiblondin.com`
- Success state: inline message (do not redirect off the page)
- Error state: field-level validation messages, accessible (`aria-describedby`)

**No SIN collection anywhere on the site — ever.**

---

## 5. Photography Treatment

Direction locked 2026-04-30 (Tammy): **editorial 3/4 body shots throughout. No tight headshots.**

### 5.1 Team photo assignments

| Page | Primary photo | Notes |
|---|---|---|
| Team hero (About) | CORP367 (formal team) | All 5 present, polished |
| Team casual (About) | CORP482 (team casual) | Denim + knit — shows both registers |
| /heidi/ | CORP260 (plum suit) | Brand-colour tie-in |
| /joanne/ | CORP273 (cream blazer) | + 3 personal-interest photos (fishing, motorcycle, woodworking) |
| /jack/ | CORP378 (navy blazer) — primary | + CORP531 (Jack + Maddie + Brooks) personal section |
| /angela/ | CORP287 (camel wrap) | 3 backup shots available |
| /diane/ | Existing photo retained | No new shoot; near retirement |

John Blondin appears in team photos only. Caption: **"John Blondin — Operations Manager"**. No profile page.

### 5.2 Personal-interests section (profile pages)

Every team profile page has an optional personal-interests section — rendered when content exists, hidden when not.  
At launch: Joanne (3 photos) and Jack (CORP531) populated. Others empty.

Joanne's photos are low-res (~20KB each) — render as a 3-up row at small/medium size, not as heroes.

### 5.3 Image optimization pipeline

Convert each photo to:
- WebP + JPG fallback, three widths: 480px · 960px · 1440px
- `srcset` markup via Astro's `<Image>` component (Sharp-powered)
- Naming: `/public/team/heidi-portrait.webp` (human-readable, not CORP-numbered)

**Set aside (not used in current build):** CORP488, CORP528, CORP067 — family/personal shots flagged by Heidi for future consideration.

---

## 6. Supabase / Blog Data Model

Blog posts are stored in Supabase (Postgres). The Astro build fetches posts at build time via the Supabase JS client. On-demand revalidation is triggered by a Cloudflare Pages deploy hook when a post is published or updated.

### 6.1 Table: `posts`

```sql
create table posts (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,           -- URL slug, e.g. "maximize-your-oas-benefits"
  title       text not null,
  excerpt     text,                           -- 2–3 sentence preview for cards
  body        text not null,                  -- Markdown / MDX body content
  author      text default 'Heidi Blondin',
  category    text,                           -- 'Financial Planning' | 'Retirement' | etc.
  tags        text[],
  cover_image text,                           -- path in /public/media/ or full URL
  meta_title  text,                           -- Yoast-migrated SEO title
  meta_desc   text,                           -- Yoast-migrated meta description
  published_at timestamptz not null,
  updated_at  timestamptz default now(),
  is_published boolean default true,
  noindex     boolean default false
);
```

Row-level security: read-only from the public anon key. Write operations require the service-role key (server-side only — never exposed to the browser).

### 6.2 Astro fetch pattern

```ts
// src/lib/posts.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_ANON_KEY
)

export async function getAllPosts() {
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
  return data ?? []
}

export async function getPostBySlug(slug: string) {
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  return data
}
```

### 6.3 Environment variables

```
# Cloudflare Pages → Settings → Environment Variables
SUPABASE_URL=           # Project URL from Supabase dashboard
SUPABASE_ANON_KEY=      # Public anon key (safe to expose in build)
SUPABASE_SERVICE_KEY=   # Service role key — server-side only, never client bundle
RESEND_API_KEY=         # For form notification emails
TURNSTILE_SECRET_KEY=   # Cloudflare Turnstile server-side validation
PUBLIC_TURNSTILE_SITE_KEY=  # Cloudflare Turnstile client-side
```

---

## 7. SEO & Structured Data

Every page requires:
- `<title>` — from `meta_title` field (posts) or page frontmatter
- `<meta name="description">` — from `meta_desc` or frontmatter
- Canonical `<link rel="canonical">`
- Open Graph tags (og:title, og:description, og:image, og:type)

**Schema markup targets:**

| Schema Type | Where |
|---|---|
| Organization | Every page (in `<head>`) — name, logo, address, phones |
| LocalBusiness + FinancialService | Homepage + contact page |
| Person | /heidi/ — name, credentials (CFP®, EPC), employer |
| Article | All blog posts |
| FAQPage | Service pages with Q&A sections |
| BreadcrumbList | All pages except home |

**sitemap.xml:** generated at build time by `@astrojs/sitemap`. Exclude `/client-resources/` via `exclude` option.

**robots.txt:**
```
User-agent: *
Allow: /
Disallow: /client-resources/

Sitemap: https://heidiblondin.com/sitemap-index.xml
```

---

## 8. Accessibility (WCAG 2.1 AA)

- Skip-to-content link: first focusable element in `<body>`, visually hidden until focused
- Focus rings: visible, 2px solid gold (`#B87B1E`) offset 2px — never `outline: none`
- Colour contrast: all text/bg combinations must pass 4.5:1 (AA). Plum-on-cream, white-on-plum both clear. Sage-on-white must be checked.
- All images: non-decorative images require `alt` text. Decorative images use `alt=""`
- Forms: every input has a visible `<label>`, errors announced via `aria-live`
- Mega-menu: keyboard navigable. `Escape` closes it. Focus trap within when open on mobile
- Videos: YouTube embeds — captions on by default where available
- Run axe-core in CI (GitHub Actions) — fail build on new WCAG violations

---

## 9. Compliance UI Requirements

These are non-negotiable build constraints.

| Requirement | Placement | Notes |
|---|---|---|
| Investia footer disclaimer (verbatim) | Footer compliance zone, every page | Never truncate or paraphrase |
| CIRO "Regulated by CIRO" logo + link | Footer compliance zone, every page | `href="https://www.ciro.ca"` |
| iA Financial Group Privacy Policy | `/privacy-policy/` | Preserve verbatim — no edits |
| Investia Website Compliance text | `/website-compliance/` | Preserve verbatim — no edits |
| CASL consent checkbox | Contact + Insurance Quote forms | Unchecked by default |
| "Ontario only" service area | All advisor-side copy | Strip any "ON + QC" references |
| No FundEX references | Everywhere | Retired with `/heidi3/` — sweep migrated content |
| Mutual fund attribution | Anywhere mutual funds mentioned | "offered through Investia Financial Services Inc." |

---

## 10. Motion & Interaction

- Transitions: `200ms ease` for hover states (color, background, shadow)
- No auto-playing animations or carousels — `prefers-reduced-motion` must be respected
- Page transitions: none (static site, instant navigation)
- Mega-menu open: fade-in + slight translate-y (150ms). Closes on outside click or Escape
- Mobile drawer: slide-in from left (200ms ease-out)
- Form submission: button enters loading state (spinner + disabled), success message fades in

---

## 11. Content Tone & Voice

- **Direct, warm, expert** — not corporate. Heidi is a real person, not a faceless brand.
- **No jargon without explanation.** RRSP/TFSA are fine (universal). "Segregated funds" needs a one-line context line.
- **Ontario-specific** — Kingston, local references. Never "across Canada."
- **Compliance-clean** — avoid superlatives ("best", "guaranteed returns"). Flag any claim that could be read as advice.
- **First-person plural** ("we", "our team") for team pages. First-person singular ("I") only in Heidi's direct quotes.

---

## 12. Tailwind Config Starter

```js
// tailwind.config.mjs
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          plum:      '#593D58',
          plumMid:   '#7A5577',
          sage:      '#A2A47D',
          sageDark:  '#7A7D5E',
          gold:      '#B87B1E',
          tintPlum:  '#F5F0F5',
          tintSage:  '#F2F2EA',
          pageBg:    '#F0ECF0',
          ink:       '#222222',
          inkSoft:   '#141413',
        },
      },
      fontFamily: {
        // Update once typography direction is confirmed
        serif: ['"Playfair Display"', 'Georgia', 'serif'],   // Phase 1 fallback
        sans:  ['"Open Sans"', 'system-ui', 'sans-serif'],   // Phase 1 fallback
        // Direction 01: serif: ['"Fraunces"', ...], sans: ['Inter', ...]
        // Direction 02: sans: ['Figtree', 'Inter', ...]
        // Direction 03: sans: ['"DM Sans"', ...]
      },
      maxWidth: {
        content: '1100px',
      },
    },
  },
  plugins: [],
}
```

---

## 13. Redirect Map (Cloudflare Pages `_redirects`)

```
# Confirmed retirements
/heidi3/                        /heidi/                         301
/heidi-2/testimonials/          /testimonials/                  301
/test/                          /                               301
/executor2/                     /resources/                     301
/intake/                        /contact/                       301

# Testimonials canonical move
/heidi-2/                       /heidi/                         301

# Thank-you page consolidation (TBD — examples)
/joanne-thank-you/              /contact-thank-you/             301
/life-insurance/thank-you/      /contact-thank-you/             301
/whole-life-confirmation/       /contact-thank-you/             301
/insurance-submitted/           /contact-thank-you/             301
```

Full redirect map to be generated during Phase 2 migration (all 54 pages + 62 posts mapped).

---

## 14. Open Design Decisions

| # | Decision | Owner | Status |
|---|---|---|---|
| 1 | Typography direction (Editorial Authority / Warm Modern / Quiet Confidence) | Heidi | **Pending — blocks Phase 1 component styling** |
| 2 | Secondary accent for service pages — gold vs sage per section | Tammy | Pending |
| 3 | CIRO logo asset (obtain approved SVG from ciro.ca) | Tammy | Pending |
| 4 | Redundant insurance pages canonical decision | Tammy/Heidi | Pending |
| 5 | Heidi personal-interests photos for /heidi/ profile section | Heidi | Not blocking launch |
| 6 | Angela personal-interests content | Angela | Not blocking launch |
| 7 | CORP067 (Heidi + Jack mother-son) — use anywhere or set aside | Heidi | Not blocking launch |
| 8 | Notification recipients: confirm Angela + Jack as primary | Tammy | Pending (provisional) |
