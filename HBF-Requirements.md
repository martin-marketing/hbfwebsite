# Heidi Blondin Financial — Website Rebuild Requirements

**Project:** Reface heidiblondin.com (Heidi Blondin Financial Inc., Kingston ON)
**Audience:** Tammy Martin + Claude Code (build agent)
**Format:** Internal build brief — technical, direct
**Date drafted:** 2026-04-16
**Last revised:** 2026-04-20 — locked-in decisions from Tammy/Heidi review folded in (architecture, integrations, scope of service area, kill list, hosting disk usage)
**Source of audit:** Live crawl of heidiblondin.com (Tammy logged in as admin), Yoast XML sitemaps, cPanel Disk Usage report, public regulatory references (CIRO, CRTC/CASL)

---

## 1. Executive summary

heidiblondin.com is a 12-year-old WordPress build (Genesis + Executive Pro child theme, **WordPress 6.9.4**). The site is built primarily in Genesis with hand-coded HTML and Gutenberg blocks, with **Beaver Builder used on at least one published page** (`/insuranceprotection/`) — content for which lives in `wp_postmeta` and requires a separate extraction pass at migration. Elementor is installed but unused. Other accumulated tech debt: legacy Slider Revolution, **stale dealer references** (a "Why Us" page still cites FundEX Investments — absorbed by Investia in 2018), duplicate "About" pages, orphaned test pages, and **61 blog posts spread across nine years** with mixed evergreen/dated content. A complete page-by-page audit lives in the companion deliverable `HBF-Page-Audit.xlsx`.

The brand identity is solid (plum/burgundy + cream, Playfair Display headings, Open Sans body) and the compliance footer is in place. The dealer relationship is **Investia Financial Services Inc.** with insurance through **Qualified Financial Services** MGA. **Heidi is licensed and services Ontario only** (the Investia disclaimer's QC reference reflects the dealer's footprint, not Heidi's personal advice scope).

**Confirmed target stack (committed by Heidi 2026-04-20):** static site / file-and-git path, Astro + MDX content, Cloudflare Pages hosting, Resend for form mail, Cloudflare Turnstile for spam, Plausible for analytics. Justification in §10. **All copy revisions and any restructuring of disclaimers must go through Investia compliance pre-approval before launch** — non-negotiable. Tammy owns the Investia review workflow end-to-end; Claude flags what needs review.

**Migration payload (from cPanel Disk Usage 2026-04-20):** account 2.74 GB total. The actionable migration is ~781 MB of `/wp-content/uploads/` media + a small set of Genesis HTML pages. Plugins (319 MB) and themes (3 MB) do not migrate. Staging subdomain (`staging.heidiblondin.com`, 1.23 GB) confirmed abandoned — leftover from a past Elementor Pro test; ignored for migration purposes.

**Critical gaps to fix in rebuild:**

1. CIRO membership disclosure not visible on homepage (regulatory requirement since Dec 2024).
2. Stale FundEX dealer reference on `/heidi3/` (resolved by retiring the page — see kill list §3.3).
3. CASL-compliant consent language missing from contact form.
4. Resources page links to Dropbox (external, fragile — bring assets in-house).
5. Service-area copy needs a sweep — anywhere the advisor side claims "ON + QC service" should read "Ontario" (Investia footer disclaimer remains verbatim).

---

## 2. Project context

**Client:** Heidi Blondin Financial Inc.
**Principal:** Heidi Blondin, BA, CFP®, EPC
**Office:** 785 Midpark Drive, Suite 100, Kingston ON K7M 7G3
**Phones:** 613-887-2726 (Heidi) | 613-817-9641 (Angela) | 1-855-844-3927 (toll free)
**Email:** hbadmin@heidiblondin.com (admin) | heidi@heidiblondin.com (per `/heidi3/`)
**Team (current, per `/heidi/`):** Heidi Blondin, Angela McCann (Licensed Assistant), Joanne Charron (Insurance Advisor), John Blondin (Operations), Jack Blondin (Assistant)
**Markets served:** **Ontario only** (per Tammy 2026-04-20). Heidi is not licensed in Quebec. The Investia dealer disclaimer references QC because that's the dealer's licensed footprint, not Heidi's personal advice scope. Insurance side: ON + NB through Qualified Financial Services MGA.
**Founded:** 2013 (Heidi has been in financial services since 2007)

**Dealer / regulatory:**

- **Mutual funds:** Investia Financial Services Inc. (a wholly-owned subsidiary of iA Financial Group / Industrial Alliance)
- **Insurance:** Heidi Blondin Financial / Qualified Financial Services (MGA)
- **Designations:** Certified Financial Planner (CFP®), Elder Planning Counselor (EPC)

**Why we're rebuilding:** Maintenance overhead, accumulated tech debt, missed compliance updates (CIRO branding), and a desire to move toward a cleaner stack a coding agent can maintain without WordPress upkeep.

**Definition of done:**

- All current public-facing content migrated with no copy regressions (or improved with Heidi/Investia sign-off)
- All current URLs preserved or 301-redirected (SEO parity required)
- Investia compliance approval secured before launch
- Lighthouse performance ≥ 90 mobile (current site is well below this)
- No external content dependencies that can break (Dropbox links replaced)
- A coding agent (Claude Code) can ship copy/content updates by editing Markdown files in a git repo

---

## 3. Current state — site anatomy

### 3.1 Tech stack (inventoried from live source)

| Layer | Current |
|---|---|
| CMS | WordPress 6.9.4 |
| Theme | Genesis Framework + Executive Pro child theme (StudioPress / WP Engine) |
| Page builders | **Beaver Builder Lite 2.9.4.2 AND Elementor (kit 2122)** — both loaded |
| CDN | Cloudflare |
| Caching plugin | WP Fastest Cache |
| Forms | Gravity Forms (with Akismet anti-spam wired in) — per Tammy 2026-04-20 |
| SEO | Yoast SEO (generates `sitemap_index.xml` + WebPage/BreadcrumbList JSON-LD) |
| Analytics | Google Tag Manager (via duracelltomi-google-tag-manager plugin) + MonsterInsights Lite + gtag.js + Universal `analytics.js` |
| Conversion tracking | Google Ads (`googleads.g.doubleclick.net/pagead/viewthroughconversion/17464138396/`) |
| Spam protection | Google reCAPTCHA + Akismet |
| Sliders | **Slider Revolution (revslider)** — legacy plugin, historic security CVE history |
| Galleries | Envira Gallery (via `envira-sitemap.xml`) |
| Misc plugins | Ultimate Blocks, WP Mail SMTP, Simple Social Icons, WP Fade-In Text News |
| Scripts | jQuery + jquery-migrate (legacy), YouTube IFrame API, Cloudflare Insights beacon |
| Brand fonts | Google Fonts: Playfair Display (serif headings) + Open Sans (sans body) |
| External content | Resources page links to **Dropbox** for downloads (calculators, PDFs) |

**Risks flagged:**

- **Beaver Builder is meaningfully used on at least one page** (revised 2026-04-28 from wp_posts CSV analysis). `/insuranceprotection/` (ID 1687, "Why Insurance Protection Matters", published 2025-08-12) has empty `post_content` containing only `<!-- wp:fl-builder/layout -->` markers — its real content lives in the `wp_postmeta` table. There may be other Beaver Builder pages we can't detect without exporting `wp_postmeta` (filtered by `meta_key LIKE '_fl_builder%'`). Migration implication: at least one extra extraction pass is required for BB content. Earlier "Genesis + hand-HTML only" framing was incomplete.
- Elementor remains effectively unused — only one draft template (`Elementor #2123`) which was never published. Safe to drop.
- Slider Revolution has a CVE history (2014 RevSlider exploit, 2022 CVE-2022-2538, others). Even patched, the plugin's bloat is a load-speed tax.
- jQuery + jquery-migrate signals legacy code paths; modern stack drops these entirely.
- Both gtag.js and `analytics.js` (Universal Analytics) are loaded — UA was sunset in 2023. This is dead code firing on every page.
- Cloudflare Insights beacon + Google Analytics + GTM = three measurement layers. Choose one.

**Page-builder migration impact (revised):** since Genesis + hand-HTML is the real build pattern, HTML→MDX conversion should be straightforward (clean semantic HTML, not nested builder shortcodes). No reverse-engineering of Beaver/Elementor markup required.

### 3.2 Hosting & infrastructure

- **Cloudflare** in front (confirmed by `static.cloudflareinsights.com/beacon` and `cloudflare insights` references). Likely Cloudflare DNS at minimum, possibly proxied.
- WordPress hosting provider: **Allcare** (local Kingston, ON cPanel host — Tammy 2026-04-24). New site moves to Cloudflare Pages; Allcare account decommissioned post-cutover.
- **New Cloudflare account:** fresh account created by Jack Blondin 2026-04-24. Clean slate for Pages deployment, DNS management, Turnstile, and analytics. Supersedes whatever Cloudflare Insights/beacon relationship existed on the legacy site.
- SSL: HTTPS confirmed.
- Email delivery (form notifications): WP Mail SMTP plugin installed → outbound mail goes through SMTP relay. New stack uses Resend directly, so this becomes irrelevant at cutover.
- **DNS: Allcare** (host + registrar, confirmed 2026-04-24 — previously at GoDaddy, since moved to Allcare). Cutover = single support ticket to Allcare requesting a nameserver change to the new Cloudflare account's assigned nameservers. No registrar transfer needed.
- **Inbound email: Microsoft 365** (Tammy 2026-04-24 — correcting earlier Google Workspace note). Managed by Allcare as IT partner, but underlying email infrastructure is Microsoft's (MX → `*.mail.protection.outlook.com`). DNS cutover does not change the MX record values; email continuity is preserved **as long as we faithfully recreate the full Microsoft 365 DNS record set (MX + Autodiscover CNAME + SPF TXT + DKIM TXTs + DMARC TXT + any SRV records) in the new Cloudflare account before the nameserver switch.**
- **DNS zone export required pre-cutover:** pull the complete current zone from Allcare's control panel (Zone Editor) so we can recreate every record in Cloudflare. Cross-check with `dig heidiblondin.com ANY +noall +answer`. Any missed record risks silent email breakage (Autodiscover failures, SPF rejections, DKIM validation loss).

**Disk usage snapshot (cPanel, 2026-04-20):**

| Path | Size | Migration disposition |
|---|---|---|
| Account total | 2735.98 MB | — |
| `public_html/` | 2440.27 MB | Source of truth for migration |
| `public_html/staging.heidiblondin.com/` | 1225.94 MB | **Confirmed abandoned** (Tammy 2026-04-20 — Elementor Pro test from a few months ago, dropped due to cost). Ignore; cleans up when old hosting account is decommissioned post-cutover. |
| `public_html/wp-content/uploads/` | 780.93 MB | **Migrates to `/public/media/` in new repo** |
| `public_html/wp-content/plugins/` | 318.78 MB | Discard — replaced by code in new stack |
| `public_html/wp-includes/` | 56.78 MB | Discard — WP core not migrating |
| `public_html/wp-content/cache/` | 39.44 MB | Discard — regenerable |
| `public_html/wp-admin/` | 10.32 MB | Discard — WP core not migrating |
| `public_html/wp-content/themes/` | 2.84 MB | Discard (theme replaced); confirms Genesis+HTML build pattern |
| `tmp/` | 221.32 MB | Housekeeping — purge after cutover |
| `softaculous_backups/` | 47.64 MB | Housekeeping — purge after own clean export taken |

**Net migration payload:** ~781 MB media + small set of HTML pages. Single-pass rsync or All-in-One WP Migration export will cover it; no chunked transfer or CDN gymnastics needed.

### 3.3 Information architecture (current)

**Main navigation** (from live homepage):

Home · Heidi · Testimonials · Financial Services · Videos · Blog · Contact

**Resources** is in nav but lives at `/resources/`. Phone CTA `tel:6138872726` in header.

**Footer:** Copyright + Privacy Policy link + Website Compliance link + Investia disclaimer block.

**Page count:** 54 pages in `page-sitemap.xml`; 62 posts in `post-sitemap.xml`. Full URL inventory in §13 (Appendix A).

**Confirmed kill list (Tammy 2026-04-20 — these pages will be deleted, not migrated):**

- `/test/` — leftover test page
- `/heidi3/` — duplicate "Why Us" with stale FundEX dealer reference
- `/executor2/` — versioned slug, old draft never deleted
- `/heidi-2/` parent slug (testimonials child page moves to `/testimonials/`)

Each gets a 301 to its closest equivalent (most likely → `/heidi/` or `/`).

**Remaining content debt (still needs keep/redirect/merge decisions):**

- Multiple legacy "thank you" pages (`/contact-thank-you/`, `/joanne-thank-you/`, `/life-insurance/thank-you/`, `/whole-life-confirmation/`, `/insurance-submitted/`) — consolidate where possible.
- Several near-duplicate insurance pages: `/insurance/`, `/financial-services/insurance/`, `/financial-services/insuranceprotection/`, `/financial-services/life-insurance/`, `/whole-life-insurance/`, `/life-insurance-peace-of-mind/`, `/life-insurance-for-parents/`, `/life-insurance-broker/`. Audit for canonical version.
- 62 blog posts: ~30 are 2018-2020 vintage (review for evergreen vs. retire). Recent posts (2024–2026) all worth keeping.

---

### 3.4 Information architecture — proposed (locked Tammy 2026-04-30)

The current Financial Services dropdown holds 17–19 items, which is past the readable threshold. Replace with a **3-column mega-menu** under the existing "Financial Services" top-nav entry. Discoverability win: visitors who don't know whether their question is an investing or insurance one see all options side-by-side.

**Main navigation (target):**

Home · About · Testimonials · **Financial Services** *(mega-menu)* · Videos · Blog · Contact · Resources · *(phone CTA)*

**Financial Services mega-menu — 3 columns:**

| Investing | Insurance | Planning |
|---|---|---|
| Investments *(hub)* | Insurance *(hub)* | Estate Planning |
| Registered Retirement Savings Plans (RRSP) | Life Insurance | Charitable Giving |
| Tax-Free Savings Accounts (TFSA) | Critical Illness Insurance | Retirement Income Planning |
| First Home Savings Account (FHSA) | Disability Insurance | |
| Registered Education Savings Plans (RESP) | Combination Insurance | |
| Group Retirement Savings Plans | Individual Health & Dental Plans | |
| Segregated Funds | Travel Insurance | |
| | Group Benefits & Savings | |
| | *Request a Quote →* (CTA button at column foot) | |

**Column header behavior:** each column header (Investing / Insurance / Planning) is itself a link — to `/financial-services/?view=investing` (or equivalent landing anchor) — so visitors can land on a category overview page without committing to a single product page. Hub pages `/investments/` and `/insurance/` already exist for the first two; a `/planning/` overview page will need to be created (Phase 2 build task).

**Orphan placements (for the audit trail):**

- **Estate Planning → Planning.** Planning topic, not a product.
- **Charitable Giving → Planning.** Estate-adjacent, planning-led conversation.
- **Group Benefits & Savings → Insurance.** Employer-facing benefits package; primary entry point is the insurance/benefits framing.
- **Insurance Quote → Insurance**, but rendered as a CTA button at the column foot, not a list item, since it's an action.
- **Retirement Income Planning → Planning** (Tammy 2026-04-30). Heidi's original instruction (2026-04-29) was "near RRSP" in a flat dropdown. With the mega-menu, RRSP and RIP sit in adjacent columns — visual proximity is preserved while RIP keeps its conceptually correct home with the other planning topics. **Flag for Heidi:** confirm she's comfortable with this column placement before launch (low-risk change; mention it during the next compliance / content review).

**Mobile fallback:** mega-menus collapse to a nested accordion. Each column header becomes a tappable section that expands to reveal its items. This is a build pattern, not a design decision — flagging so it's not a surprise during Phase 1.

**Out of scope for the mega-menu:**

- Not in nav (intentional): `/client-resources/` (unlinked per Heidi 2026-04-29), `/intake/` (retired), `/insuranceprotection/` (legacy duplicate slated for review).
- Utility links (`/contact/`, `/resources/`, phone) stay where they are in the top nav and footer.

---

## 4. Content inventory

### 4.1 Page summaries (key public pages)

**Home (`/`)** — Headline narrative around aligning money with life goals. Three guiding questions ("Will I have enough money? Will my family be ok if life throws them a curveball? Do I feel good about the way I'm investing my money?"). Free-consultation CTA + toll-free phone. **Recent Awards** block — actual award images render correctly per Tammy; the "(Edit)" was just admin-view chrome, not a content gap.

**About Heidi (`/heidi/`)** — Combined Why Us + Heidi bio + team list. Current team listed correctly. Includes line "Mutual funds are offered through Investia Financial Services Inc."

**Why Us alt (`/heidi3/`)** — STALE. Cites "Mutual Funds Provided Through FundEX Investments Inc." (incorrect post-2018), lists wrong team. **Confirmed retired (Tammy 2026-04-20): 301 → `/heidi/`.**

**Testimonials (`/heidi-2/testimonials/`)** — Six testimonials, anonymized to initials + city ("A.F. – Kingston, Ontario"). Move to `/testimonials/`.

**Financial Services hub (`/financial-services/`)** — List of 18 service categories. Sub-pages exist for many (TFSA, FHSA, RRSP, RESP, life insurance, critical illness, disability, travel, group benefits, segregated funds, estate planning, individual health/dental, combination insurance, insurance quote, etc.).

**Videos (`/videos/`)** — ~22 YouTube-embedded videos covering FHSA, TFSA, RRSP, life insurance, CPP timing, retirement, estate, RESPs, etc. Three video category sub-pages exist (`/videos/heidi-blondin-financial-financial-literacy-videos/`, `/videos/financial-resp-videos/`, `/videos/heidi-blondin-financial-retirement-planning-videos/`, `/videos/heidi-blondin-financial-videos-estate-planning-videos/`).

**Blog (`/blog/`)** — Categories: Blog, Saving Money. Tags include Certified Financial Planner, Financial Planning, Financial Services, Retirement Income, etc. Single post visible per page (pagination). 62 posts total.

**Contact (`/contact/`)** — WPForms with First/Last name (split), Email, Phone, Questions/Comments. Akismet honeypot wired (`ak_js_1`). Sidebar lists multiple phone numbers, email, and Kingston address. CTAs to insurance subpages.

**Resources (`/resources/`)** — Calculators (budget, net worth, education savings, mortgage, retirement income), Legacy Planning Checklist, Personal Records Organizers (Canada Life + Sun Life), Empire Life Executor Checklist, Will Planning Worksheet, POA templates, Digital Assets worksheet. **All downloads currently linked to Dropbox** (e.g., `dropbox.com/s/323kfztzx4ekqao/Worry_Free_IncomeandExpenseWorksheet.xlsx`). **Action: bring all downloads in-house.**

**Privacy Policy (`/privacy-policy/`)** — iA Financial Group corporate privacy policy (parent of Investia). ~1,200 words. **Must preserve verbatim** — corporate-mandated.

**Website Compliance (`/website-compliance/`)** — Investia-mandated disclaimer covering mutual funds, segregated funds, GICs, life/health insurance, plus general "not personalized advice" + "Canadian residents only" language. **Must preserve verbatim — re-approval by Investia required if any wording changes.**

**Intake (`/intake/`)** — **RETIRE (Heidi 2026-04-29).** The hand-coded Salesforce Web-to-Lead form duplicates data Heidi already captures during her qualification call. No replacement on new site. 301 → `/contact/`.

**Client Resources (`/client-resources/`)** — **KEEP, unlinked (Heidi 2026-04-29).** Page is for signed clients only; Heidi shares the URL through her client newsletter. **No password protection** (avoids friction for clients). Instead, treat the page as security-through-unlinkability: `noindex, nofollow` meta, excluded from `sitemap.xml`, no inbound links from any public page, and the Calendly URL embedded on this page must not appear on any indexable page. Slug stays `/client-resources/`. If/when Heidi wants stronger gating later, a Cloudflare Access email-OTP policy or a one-time-link mailer is the upgrade path.

**Retirement Income Planning (`/retirement-income-planning/`)** — **KEEP. Placed in the Planning column of the Financial Services mega-menu** (Tammy 2026-04-30, refining Heidi 2026-04-29). Heidi's original instruction was "near RRSP"; with the new mega-menu IA (§3.4), RRSP sits in the adjacent Investing column, so visual proximity is preserved while RIP keeps its conceptually correct home with the other planning topics. Nav label: "Retirement Income Planning". URL preserved at `/retirement-income-planning/`. Existing `staging.heidiblondin.com` image refs get rewritten at migration. **Confirm column placement with Heidi before launch.**

### 4.2 Page-level migration decisions (template)

For each URL in §13 Appendix A, decide one of:

| Decision | Action |
|---|---|
| **KEEP** | Migrate copy as-is; URL preserved |
| **REVISE** | Migrate with copy updates; URL preserved; route through Investia compliance |
| **MERGE** | Combine into another page; old URL → 301 to new |
| **RETIRE** | Delete; old URL → 301 to closest relevant page (or `/` as last resort) |

This decision must be made for all 54 pages + 62 posts before build starts. Output as a CSV in `/content-decisions.csv` for tracking.

---

## 5. Brand & design system

### 5.1 Colors (sampled from live computed styles)

| Role | Value | Notes |
|---|---|---|
| Primary brand (body bg) | `rgb(89, 61, 88)` ≈ **#593D58** | Deep plum/burgundy |
| Body text | `rgb(34, 34, 34)` ≈ **#222222** | Near-black |
| Heading text on dark | `#FFFFFF` | Used for H2 over plum bg |
| Button bg | `rgb(250, 249, 245)` ≈ **#FAF9F5** | Cream/off-white |
| Button text | `rgb(20, 20, 19)` ≈ **#141413** | Near-black |

**TBD:** secondary accent color (gold? rose?), link color (currently `rgb(240, 240, 241)` reported, but that's the admin bar color — needs verification on a non-admin view).

### 5.2 Typography

| Role | Family | Notes |
|---|---|---|
| Headings | **Playfair Display**, serif | Loaded via Google Fonts; H2 = 50px / 400 weight on homepage |
| Body | **Open Sans**, sans-serif | 16px / 400 weight base |

Both Google Fonts links present (`fonts.googleapis.com/css`). For rebuild, **self-host fonts** to remove third-party dependency and improve performance + privacy.

### 5.3 Imagery

- Logo: served from theme — needs export at high-res (SVG ideal).
- Header hero: 4 images on home (per Yoast image count for `/`).
- Service-page imagery: averages 1-2 images per page.
- Stock vs. custom: **TBD pending media library audit (admin login).** Likely a mix; advisor sites typically lean on stock.
- Photos of Heidi + team: present on team-member pages (`/john/`, `/angela/`, `/jack/`, `/joanne/`, `/heidi/`).

### 5.4 Responsive / accessibility

- Current site is Genesis-based with a `responsive-menu.js` — has mobile breakpoints, but specifics TBD.
- **Accessibility TBD** — needs Lighthouse + axe audit. Common issues on this stack: low contrast on buttons, missing alt text on stock photos, no skip-to-content link, modal focus traps.
- Rebuild target: WCAG 2.1 AA minimum.

---

## 6. Forms, integrations & business workflows

| System | Role | Migration plan |
|---|---|---|
| Gravity Forms (Contact, Insurance Quote, Sign-UP, Workshop) | Lead capture | Replace with code-built forms → POST to Cloudflare Pages Function → Resend for email notification. Sign-UP and Workshop forms RETIRE per scope. |
| Akismet | Form spam filter | Replace with Cloudflare Turnstile (free, privacy-friendly) |
| Google reCAPTCHA | Secondary spam check | Drop; Turnstile covers this |
| WP Mail SMTP | Outbound email reliability | N/A — new stack uses transactional email API directly |
| Google Tag Manager | Tag orchestration | **Drop.** No active Google Ads campaigns; analytics moves to Plausible. Removes a layer entirely. |
| Google Analytics (gtag.js) | Site analytics | **Replace with Plausible** (cookie-free, no consent banner needed). UA `analytics.js` dropped regardless. |
| Google Ads conversion (`17464138396`) | Ad conversion tracking | **Drop entirely** (Tammy 2026-04-20 — Heidi is not running Google Ads). |
| Cloudflare Insights | Performance/RUM | Optional — Cloudflare Pages provides basic analytics natively |
| Envira Gallery | Image galleries | Replace with native `<picture>` + responsive images in Astro |
| YouTube embeds | Video content | Keep as YouTube embeds; lazy-load via `lite-youtube-embed` to fix performance hit |
| Dropbox (resources) | File downloads | **Bring downloads into the repo** — host in `/public/downloads/` for direct serving |

### 6.1 CRM, Booking, Newsletter scope

**CRM (Salesforce) — disconnected from new website (Tammy 2026-04-28):** Heidi continues to use Salesforce internally for clients she qualifies, but **the new site has zero technical connection to Salesforce.** No webhooks, no Web-to-Lead servlets, no Zapier bridge. Form leads route to email only; Heidi promotes qualified leads into SF manually as part of her existing workflow. This supersedes the earlier "manual ~20% flow" framing — that describes Heidi's workflow, not site integration.

**Booking — private/invitation-only (Tammy 2026-04-20):** Calendar booking is restricted to viable leads and existing clients. **No public Calendly embed, no public "book a free 30-minute consultation" page.** Heidi sends a personal scheduling link only after a lead is qualified. The "free consultation" homepage CTA should route to the contact form, not a public scheduler.

**Newsletter — clients-only (Tammy 2026-04-20):** No public newsletter signup on the site. Email sequences exist only for signed clients (onboarding). Do not add a public signup form, footer subscribe input, or popup.

### 6.2 Forms inventory — locked schemas (Tammy 2026-04-28, from Gravity Forms JSON export)

| Form | Source | Fields | Notify | Confirmation | Status |
|---|---|---|---|---|---|
| **Contact** | GF #3 on `/contact/` | Name (req, first+last), Email (req), Phone (req), Questions/Comments | heidi@heidiblondin.com (active) — `webadmin@responseit.ca` and `marshall@allcareit.com` notifications also exist but are **inactive**; do NOT carry forward | Inline message: "Thanks for contacting us! We will get in touch with you shortly." | **BUILD** |
| **Insurance Quote** | GF #1 on `/insurance-quote/` | Name (first+last), Insurance Type (Life / Life+CI / CI / Disability / Life-no-medical), Sex (M/F), Overall health (Excellent/Above avg/Average/Some health concerns), Date of Birth, Amount of insurance required, Smoke? (Y/N), Email, Phone, Additional Comments. **All fields currently optional in GF — fix in new build (require name, email, phone, type, DOB at minimum).** | heidi@heidiblondin.com | Redirect to `/thank-you/` (page ID 148) | **BUILD** |
| **Client Intake** | Hand-coded HTML on `/intake/` (NOT Gravity Forms) | First Name, Last Name, Birth Date, **Social Insurance Number**, Street, City, State/Province, etc. POSTs directly to `webto.salesforce.com/servlet/servlet.WebToLead`. reCAPTCHA v2. | Direct POST to Salesforce | SalesForce default | **RETIRE (Heidi 2026-04-29)** — duplicates data Heidi already collects during qualification call. No replacement form. 301 `/intake/` → `/contact/`. |
| **Travel Insurance** | Page link only, no form | Button on `/travel-insurance/` → `travelunderwriters.com/consumerexpress-app/...` | N/A — external partner site | N/A | **NO FORM** — page is a redirect to TravelUnderwriters partner portal. Verify partner URL during migration. |
| **Sign-UP** | GF #2 (associated with `/sign-up/` draft page) | Name (first+last), Email, Phone, Comments/Questions | heidi@heidiblondin.com | Inline message | **RETIRE** — no public newsletter signup per scope. |
| **Workshop Registration** | GF #4 (no current published page) | Name (req), Email (req), Phone (req), Date radio (one option: "Date to be determined- Financial Fundamentals") | heidi@heidiblondin.com | Inline message | **RETIRE** — no workshops currently planned (Tammy 2026-04-28). Rebuild on demand if a future workshop is scheduled. |

### 6.3 New-build form contract

Each form that survives (Contact, Insurance Quote): submission → Cloudflare Pages Function → Resend → email notification.

- **Notification recipients (new site): `angela@heidiblondin.com` + `jack@heidiblondin.com`** (Tammy 2026-04-28 — provisional, pending double-check). This is a deliberate change from current behavior where everything goes to `heidi@` only. Reflects delegation of lead handling. Drop the inactive Allcare/responseit test notifications regardless.
- **Spam protection:** Cloudflare Turnstile on every form. No reCAPTCHA, no honeypots.
- **CASL consent:** explicit checkbox on Contact and Insurance Quote forms. Microcopy: "I consent to Heidi Blondin Financial contacting me about my inquiry."
- **PIPEDA-sensitive fields:** Insurance Quote captures DOB, sex, health status, smoking status — collectively PI under PIPEDA. Email transmission to M365 is acceptable since M365 is encrypted in transit (TLS) and at rest. Do NOT echo full payload back in customer confirmation email — only an acknowledgment.
- **No SIN collection on the new site under any circumstance** (Tammy 2026-04-28).

---

## 7. SEO, performance, analytics & migration

### 7.1 SEO

- Yoast SEO is the source of meta titles, meta descriptions, sitemaps, JSON-LD schema (WebPage + BreadcrumbList confirmed on home).
- **Meta titles + descriptions for all 54 pages + 62 posts must be exported** (Yoast → Tools → Import/Export → Export settings, or scrape via WP REST API once admin authenticated).
- Schema markup currently includes WebPage type. Rebuild should add: **Organization** (with logo, address, phones), **FinancialService**, **LocalBusiness** (Kingston address + service area), **Person** (Heidi, with credentials), **FAQPage** (where Q&A blocks exist), **Article** (blog posts).
- **CIRO membership disclosure** must be added to homepage with link to ciro.ca per CIRO Membership Disclosure Policy update (effective Dec 31, 2024). Current site does not display this — compliance gap.

### 7.2 Performance

- Current site loads: jQuery, jquery-migrate, two page builders, Slider Revolution, Envira, MonsterInsights, GTM, GA, reCAPTCHA, YouTube widget API, Cloudflare beacon. **Estimated 30+ HTTP requests for JS/CSS alone.**
- Lighthouse audit not yet run; do this as a baseline before/after.
- Rebuild target: **Lighthouse mobile ≥ 90**, LCP ≤ 2.5s on 3G, CLS ≤ 0.1.

### 7.3 Migration plan

**Payload (confirmed 2026-04-20 from cPanel Disk Usage):**

- **Media:** ~781 MB in `/wp-content/uploads/`. Single-pass rsync or All-in-One WP Migration export. No CDN gymnastics.
- **Content pages:** 54 published pages + 61 published blog posts (locked 2026-04-28 from `wp_posts` CSV export). Mostly Genesis + hand-HTML and Gutenberg blocks — clean MDX conversion. **Beaver Builder content on at least `/insuranceprotection/` (and possibly others) requires a separate `wp_postmeta` extraction pass** — see step 4b below.
- **Plugins / themes / WP core:** ~389 MB combined. None migrate. Replaced by code in new stack.
- **Staging clone:** `staging.heidiblondin.com` (1.23 GB) — confirmed abandoned (Elementor Pro test). Not a migration source; ignored. **However**, image `src` attributes on `/whole-life-insurance/` and possibly other recent landing pages still point at `staging.heidiblondin.com/wp-content/uploads/...`. These references must be rewritten to `heidiblondin.com/...` or to local `/public/media/...` paths during migration — see step 4c below.

**URL preservation:**

- Build a redirect map in Cloudflare Pages `_redirects` file.
- All 54 pages + 62 posts must have a destination — either same URL on new site or 301 to closest equivalent.
- **Locked retirements (301 sources, Tammy 2026-04-20):** `/heidi3/` → `/heidi/`, `/heidi-2/testimonials/` → `/testimonials/`, `/test/` → `/`, `/executor2/` → closest executor-related page (likely `/resources/`).
- Redundant insurance pages still need canonical-version decisions.
- Trailing-slash consistency (current site uses trailing slashes — preserve).

**Content migration sequence:**

1. **Pre-migration cleanup** — confirm staging subdomain status; snapshot + delete if abandoned. Take a clean WP export as our "source of truth" zip before any deletions.
2. **Export WP content** via WP REST API (`/wp-json/wp/v2/pages?per_page=100` and `/wp-json/wp/v2/posts?per_page=100`). Save raw to `/extracted/wp-pages.json`, `/extracted/wp-posts.json`.
3. **Bulk media download** — rsync `/wp-content/uploads/` → local; reorganize into `/public/media/{year}/{month}/` mirroring WP's structure to keep image URLs in posts resolvable. Re-encode to AVIF/WebP at build time.
4. **HTML → MDX conversion** — for each page, pull `content.rendered` from REST API, run through HTML-to-MDX converter, hand-clean any Genesis `<div class="...-wrap">` artifacts. Validate front-matter (title, slug, meta description from Yoast).
4b. **Beaver Builder content extraction (parallel to step 4)** — export `wp_postmeta` filtered by `meta_key LIKE '_fl_builder%'` from phpMyAdmin (CSV format). Reconstruct rendered output for affected pages (confirmed: `/insuranceprotection/`; potentially others). For BB pages, the workflow is: read the BB layout JSON → render each module's content into MDX equivalents (text, image, columns map cleanly; specialty modules may need bespoke handling). If only one or two pages have meaningful BB content, manually rewriting them in MDX may be faster than building a generalized extractor.
4c. **Staging-subdomain URL rewrite (parallel to step 4)** — grep all migrated content for `staging.heidiblondin.com` and rewrite to either production domain or local `/public/media/` paths. Confirmed affected: `/whole-life-insurance/`. Verify zero `staging.*` references remain in MDX before commit.
5. **Resource downloads** — re-fetch every Dropbox-hosted file (calculators, checklists, worksheets) and commit directly to `/public/downloads/` in the repo. Files serve from `heidiblondin.com/downloads/` via Cloudflare Pages — no Drive, no Dropbox, no external dependency. Update all internal links from `dropbox.com/s/...` to `/downloads/{filename}`.
6. **Redirect map generation** — produce `_redirects` from old → new URL inventory + the locked retirements above.
7. **Cleanup tagging analytics** — strip Google Ads conversion ID `17464138396`, GTM container, gtag.js, Universal Analytics `analytics.js` from any migrated content (none should carry over, but sweep to be safe).

**Pre-launch validation:**

- Crawl staging build with screaming-frog-equivalent → diff against current sitemap to confirm zero unintended 404s.
- Spot-check 10 highest-traffic posts (from Search Console) render correctly with images.
- Verify Investia footer disclaimer renders verbatim on every page.

**Cutover:**

1. **Pre-flight DNS zone export** — pull the complete current zone from Allcare's Zone Editor. Capture every record type (A, AAAA, CNAME, MX, TXT, SRV). Microsoft 365 typically adds 5-10 records beyond the basics.
2. **Recreate zone in Cloudflare** — add every record from the export into the new Cloudflare account's DNS settings for heidiblondin.com. A/AAAA records point at Cloudflare Pages; every other record is a verbatim copy of what Allcare had.
3. **Verify the Cloudflare zone** against `dig heidiblondin.com ANY +noall +answer` and against the Allcare export. Zero-delta on MX, SPF, DKIM, DMARC, Autodiscover records.
4. **Submit Allcare support ticket** — *"Change authoritative nameservers for heidiblondin.com to [Cloudflare nameservers]."* One line.
5. **Monitor propagation** (typically 5 minutes to 48 hours; usually <2 hours). Verify with `dig NS heidiblondin.com @8.8.8.8` showing Cloudflare nameservers.
6. **Smoke test email** once propagated — send external test emails in/out of heidi@ and hbadmin@, verify Autodiscover works for a fresh device setup.
7. **Submit new sitemap** to Google Search Console + Bing Webmaster Tools day of launch.
8. **Monitor 404s** in Cloudflare Analytics for 7 days, patch redirect map.
9. **Monitor Search Console** for crawl errors for 60 days post-launch.

**Post-launch housekeeping:**

- Purge cPanel `tmp/` (221 MB) and `softaculous_backups/` (48 MB) once migration is confirmed stable for 14 days.
- Keep WordPress install live but unindexed (`robots.txt` disallow + Search Console removal request) for ~30 days as a rollback option, then archive and decommission.

---

## 8. Compliance requirements

This site sells regulated financial products. Compliance is non-negotiable and must be locked in **before launch**, not after. The build agent (Claude Code) MUST treat these as hard constraints.

### 8.1 Investia / dealer compliance

- **Investia compliance pre-approval is mandatory before launch.** Most Canadian mutual fund dealers require advisor websites to be reviewed and approved annually. Confirm Investia's current process with Heidi's compliance contact at Investia.
- The exact text of the **Website Compliance** disclaimer (`/website-compliance/`) must be preserved verbatim. Any change requires Investia re-approval.
- Footer disclaimer block ("MUTUAL FUNDS, APPROVED EXEMPT MARKET PRODUCTS AND/OR EXCHANGE TRADED FUNDS ARE OFFERED THROUGH INVESTIA FINANCIAL SERVICES INC...") must appear on every page footer.
- The **Privacy Policy** is iA Financial Group's corporate policy. Preserve verbatim. Do not edit unless replaced by an updated version provided by Investia/iA.
- Where mutual funds are mentioned anywhere on the site, the standard "offered through Investia Financial Services Inc." attribution must appear.
- **Remove all FundEX references.** The `/heidi3/` page is the active offender; sweep the full content corpus during migration for any other instances.

### 8.2 CIRO membership disclosure (regulatory)

- The **MFDA was rolled into CIRO** (Canadian Investment Regulatory Organization) effective January 2023.
- CIRO requires dealer members to display the **"Regulated by CIRO" logo** on the dealer website homepage and link to **ciro.ca** (English) or ocri.ca (French) — deadline was December 31, 2024. **Current site does not display this. Compliance gap.**
- Dealer-member disclosure obligations extend to advisor websites. Rebuild must include CIRO logo + link in the footer or homepage prominent area. Confirm with Investia which placement they require.

### 8.3 CASL (Canada's Anti-Spam Legislation)

- Contact form must include an **opt-in consent checkbox** for marketing email (unchecked by default — pre-checked is prohibited under CASL).
- Consent language must be specific (e.g., "I agree to receive occasional emails from Heidi Blondin Financial. I can unsubscribe anytime.").
- Every commercial electronic message (CEM) sent from the form/list must include: (1) sender identification (Heidi Blondin Financial Inc.), (2) physical mailing address (785 Midpark Drive, Suite 100, Kingston ON K7M 7G3), (3) unsubscribe mechanism that works for at least 60 days.
- Penalties: up to $10M per violation for businesses. This is not optional.

### 8.4 PIPEDA (federal privacy law)

- Site collects personal information via forms (name, email, phone). PIPEDA applies.
- The current iA Financial Group Privacy Policy on `/privacy-policy/` covers this for Investia-channeled business. **Confirm with Heidi/Investia** whether HBF needs a supplementary privacy notice covering the website itself (cookie use, analytics, third-party processors).
- GA/GTM is being dropped (see §6) and Plausible is cookie-free. **No cookie consent banner needed.** Heidi services Ontario only, so Quebec Law 25's stricter consent rules don't apply to her advisor-side site (see §8.5).

### 8.5 Quebec Law 25 (privacy) — limited applicability

- Effective Sept 2023, Quebec privacy law (formerly Bill 64, now Law 25) applies to organizations doing business with Quebec residents.
- **Heidi services Ontario only and is not licensed in Quebec (Tammy 2026-04-20).** Rebuild should not represent the business as serving QC.
- The iA Financial Group privacy policy at `/privacy-policy/` is corporate-mandated and references Investia's Quebec Privacy Officer. That covers the Investia-channeled (dealer) side regardless of where individual clients reside, and must be preserved verbatim.
- **Practical implication:** no separate French-language site, no Law 25-specific advisor-side disclosures needed beyond what's already in the iA policy. If a QC resident happens to land on the site and submit a form, the iA privacy policy governs.
- **Content cleanup:** sweep all advisor-side copy (not the Investia footer) for "ON + QC" or "Quebec" references and revise to "Ontario." Examples to verify: any "About" text, service-area descriptions, FAQ entries.

### 8.6 Accessibility (AODA — Ontario)

- Ontario AODA (Accessibility for Ontarians with Disabilities Act) requires public-facing websites of organizations with 50+ employees to meet **WCAG 2.0 AA**. HBF is likely under the threshold, but WCAG conformance is best practice and improves SEO/UX.
- Target: **WCAG 2.1 AA** in rebuild. Run axe-core in CI.

### 8.7 Compliance checklist (must be complete before launch)

**Tammy owns the Investia review workflow end-to-end (2026-04-20).** Claude's job is to flag copy that needs review and surface blockers, not manage the approval process.

- [ ] Investia compliance pre-approval secured (Tammy)
- [ ] Website Compliance page text verbatim
- [ ] Privacy Policy text verbatim
- [ ] Footer disclaimer block on every page
- [ ] CIRO logo + ciro.ca link on homepage/footer
- [ ] All FundEX references purged (covered by `/heidi3/` retirement; sweep migrated content for stragglers)
- [ ] All advisor-side "ON + QC service" copy corrected to "Ontario"
- [ ] CASL consent checkbox on contact + any signup forms
- [ ] Physical address + unsubscribe in any outbound email template
- [ ] No cookie/consent banner needed (Plausible is cookie-free; GA/GTM dropped)
- [ ] Accessibility audit (axe) pass at WCAG 2.1 AA

---

## 9. Migration & data extraction tasks

These are pre-build tasks that need admin access to complete:

1. **Yoast SEO export** — Tools → Import/Export → download Yoast settings (preserves all meta titles, descriptions, focus keywords, schema configs).
2. **WP REST API content dump** — `GET /wp-json/wp/v2/pages?per_page=100&_fields=id,slug,title,content,modified,status` and same for `posts`. Save raw to `/extracted/wp-pages.json`, `/extracted/wp-posts.json`.
3. **Media library export** — Tools → Export → "All content" gives an XML; for media binaries, either (a) FTP/SSH `/wp-content/uploads/` or (b) use the All-in-One WP Migration plugin to grab a full archive.
4. **Gravity Forms export** — capture form definitions (fields, validation, notification recipients) for the surviving forms (contact + insurance quote) before tearing down Gravity Forms. WP admin → Forms → Import/Export → Export Forms gives a JSON. Travel is an outbound link (not a form); intake retired per Heidi 2026-04-29.
5. **GTM container export** — `tagmanager.google.com` → Admin → Export Container → preserve as JSON.
6. ~~**GA4 property settings**~~ — N/A. GA4 and GTM are being dropped (no Google Ads, no consent banner needed). Skip.
7. **Search Console data** — export top 1000 queries + top landing pages for last 12 months as a baseline (validates redirect map covers high-traffic URLs).
8. **Hosting + DNS audit** — record current hosting provider, registrar, DNS records (A, MX, TXT/SPF/DKIM/DMARC), SSL cert expiry. Required for cutover.
9. **All form submission destinations** — where do current form leads go? (Inbox? CRM?) Document so we don't break the lead flow.

---

## 10. Target stack — CONFIRMED

Heidi committed to the file/git path on 2026-04-20. This section is no longer a recommendation; it's the plan.

### 10.1 Stack: **Astro + MDX, Cloudflare Pages, Resend, Turnstile, Plausible**

| Layer | Choice | Why |
|---|---|---|
| Framework | **Astro 5+** | Static-first, ships zero JS by default, MDX content support, excellent for content sites with light interactivity. Coding-agent friendly: file-based routes, type-safe content collections, simple mental model. |
| Content format | **MDX in content collections** | Each page = one `.mdx` file. Heidi/Tammy can edit copy in plain text without touching code. Git history = full revision log. |
| Styling | **Tailwind CSS** + design tokens for brand colors/fonts | Constraints prevent design drift. Easy for Claude Code to work in. |
| Hosting | **Cloudflare Pages** | Free tier covers HBF's traffic, edge-served (fast everywhere), automatic deploys on git push, built-in redirects file, free SSL, DDoS protection. |
| Forms backend | **Cloudflare Pages Functions + Resend** | Form posts to a Function, which sends email via Resend (3000 emails/mo free). Optionally also writes to a Google Sheet or Airtable for lead tracking. |
| Spam | **Cloudflare Turnstile** | Free, privacy-friendly, no Google dependency, solves CAPTCHA UX. |
| Analytics | **Plausible** ($9/mo) | Cookie-free, CASL/Law-25 friendly, no consent banner needed. (GA4 alternative dropped — Heidi isn't running Google Ads.) |
| Search (if desired) | **Pagefind** | Static, runs at build time, no server needed |
| Image optimization | Astro's built-in `<Image>` + Sharp | Modern formats (AVIF/WebP), responsive sizes, automatic. |

**Why this beats the alternatives for HBF:**

- **No CMS to maintain.** No WordPress updates, no plugin updates, no security patches, no malware risk. Heidi's site is content, not a SaaS app.
- **Coding-agent friendly.** Claude Code can read all content as Markdown, create/edit/delete pages by manipulating files. Git is the system of record.
- **Compliance-friendly.** All disclaimer text lives in version-controlled files, so any change is reviewable/auditable. Investia compliance can be sent a diff.
- **Performance.** Static HTML at edge = sub-second loads everywhere. Lighthouse 95+ is achievable.
- **Cost.** ~$15/mo total (Plausible) vs. WordPress hosting ($25-50/mo) + plugin licenses.

### 10.2 Alternatives considered (closed — for archival reference only)

| Option | Pro | Con | Verdict |
|---|---|---|---|
| **WordPress + new theme** | Heidi can edit in WP admin she already knows | All current maintenance burden persists; doesn't escape WP/plugin update cycle; agent-edit is awkward | Rejected — Heidi committed to file/git path 2026-04-20 |
| **Webflow** | Visual editor, no code needed for design changes | $23+/mo, no git history, agent integration is limited, vendor lock-in | Rejected — agent-unfriendly |
| **Headless CMS (Sanity / Payload) + Next.js** | Heidi gets a friendly admin UI, content lives in CMS | More moving parts, monthly costs add up, overkill for ~100 mostly-static pages | Rejected — over-engineered |
| **Squarespace** | Trivial to maintain | Limited customization, no agent integration, generic design | Rejected — doesn't differentiate Heidi's brand |
| **Node.js server-rendered (Next.js + DB)** | Full app capability | $20-50/mo hosting, server to patch/monitor, slower than static, no need for any of it | Rejected — no dynamic-per-user features in scope |

### 10.3 Editing workflow with the recommended stack

For Heidi to update a page:

1. Tammy or Heidi opens the GitHub repo (or Tammy does it on her behalf — likely default).
2. Edit the `.mdx` file in the GitHub web editor or VS Code.
3. Commit → Cloudflare Pages auto-deploys in ~30 seconds.
4. Done.

For Claude Code to update a page (Tammy's primary path):

1. Open the project in Claude Code.
2. "Update the FHSA page with the new 2026 contribution limit."
3. Claude Code edits the file, runs build, opens a preview.
4. Tammy reviews, commits.

---

## 11. Build plan (phases for Claude Code)

**Phase 0 — Pre-build (this doc + admin access):**

- [x] Public-side audit complete (this document)
- [x] Stack decision locked (file/git path, Astro+MDX, confirmed by Heidi 2026-04-20)
- [x] Hosting disk usage audited (~781 MB media payload confirmed)
- [x] Kill list confirmed (`/test/`, `/heidi3/`, `/executor2/`, `/heidi-2/`)
- [x] Integration scope locked (no public booking, no public newsletter, no GA/GTM, no Google Ads conversion, email-routed forms)
- [x] Service area corrected (Ontario only)
- [ ] Hosting provider name from Tammy
- [ ] Staging subdomain status confirmed (active vs. abandoned)
- [x] Form fates locked (intake retired Heidi 2026-04-29; insurance quote schemas in §6.2)
- [ ] Yoast settings exported, REST API content extracted, media downloaded
- [ ] Page-by-page keep/revise/merge/retire decisions for non-killed pages, in `/content-decisions.csv`
- [ ] Investia compliance contact engaged; pre-approval timeline set (Tammy)

**Phase 1 — Scaffolding:**

- Initialize Astro project with Tailwind, MDX content collections, Cloudflare Pages adapter
- Set up design tokens (colors, fonts, spacing)
- Build component library: Header, Footer, Nav, Hero, Card, Testimonial, CTABand, FormShell, VideoEmbed, ResourceLink, DisclaimerBlock
- Implement layout shell with footer compliance block on every page

**Phase 2 — Migration:**

- Convert WP content → MDX one section at a time (homepage, about, services hub, ~10 service pages, testimonials, resources, videos, contact, privacy, compliance)
- Migrate blog posts (62) into `/blog/` content collection with original publish dates preserved
- Build redirect map from old → new URLs in `_redirects`
- Migrate media into `/public/media/` with optimized formats

**Phase 3 — Forms + integrations:**

- Build contact form + Pages Function backend
- Wire Turnstile, Resend
- Add CASL consent checkbox + verification logic
- Build insurance quote form (intake retired per Heidi 2026-04-29)
- Set up Plausible analytics

**Phase 4 — Compliance + polish:**

- CIRO logo + link added to footer
- All disclaimer text reviewed against Investia-approved wording
- Accessibility pass (axe + manual keyboard nav + screen reader spot check)
- Lighthouse pass (target 90+ mobile)
- SEO pass (meta titles, descriptions, schema markup, sitemap.xml, robots.txt)
- Investia compliance review

**Phase 5 — Launch:**

- DNS cutover
- Submit sitemap to Search Console + Bing
- Monitor 404s in Cloudflare Analytics for 7 days, patch redirect map
- Monitor for Search Console crawl errors for 60 days

---

## 12. Open questions

### 12.1 Resolved 2026-04-20 (Tammy/Heidi)

| # | Question | Answer |
|---|---|---|
| 1 | Hosting + WP admin credentials? | Tammy has them. Hosting + DNS resolved in Q15 (Allcare). |
| 2 | Visual editing vs file/git path? | **File/git path committed by Heidi** |
| 3 | CRM integration for form leads? | No auto-sync. Salesforce used manually for ~20% of leads after qualification. Forms route to email. |
| 4 | Active Google Ads? | No. Strip conversion ID `17464138396` and GTM. |
| 5 | Newsletter signup on public site? | No. Email sequences only for signed clients (onboarding). |
| 6 | Booking integration? | No public booking. Calendar restricted to viable leads + clients. |
| 7 | Investia compliance contact + lead time? | Tammy owns this end-to-end. |
| 8 | SVG logo? | Reuse existing logo. Pull highest-res from media library; vectorize if needed. |
| 9 | Awards block content? | Already populated — "(Edit)" was admin chrome, not a content gap. |
| 10 | Current dealer status? | Investia only. FundEX reference (on `/heidi3/`) retired with the page. |
| 12 | Beaver Builder vs Elementor? | **Revised 2026-04-28:** Beaver Builder IS used on at least `/insuranceprotection/` (content in `wp_postmeta`). Elementor remains effectively unused (one draft template only). See §3.1 risks and §7.3 step 4b. |
| 13 | Kill list approval? | Approved: `/test/`, `/heidi3/`, `/executor2/`, `/heidi-2/` parent retire. |
| 14 | French-language version for QC? | Not needed — Heidi services Ontario only. |
| 15 | DNS location? | **Allcare** — both host and registrar (confirmed Tammy 2026-04-24, domain was previously at GoDaddy but moved). DNS migration = one support ticket to Allcare requesting a nameserver change to Cloudflare. |
| 16 | Inbound email routing? | Microsoft 365 (managed by Allcare as IT partner). MX → Microsoft infrastructure; no cutover risk *provided* full DNS record set is recreated in Cloudflare before nameserver switch. |
| 17 | Staging subdomain status? | Abandoned. Past Elementor Pro test, dropped for cost. Ignore. |
| 18 | Form plugin on current site? | Gravity Forms (not WPForms — earlier public-crawl misread). |
| 19 | Specialty forms: keep or consolidate? | **Revised 2026-04-28** after GF JSON export: actually 4 GF forms exist (Contact, Insurance Quote, Sign-UP, Workshop). Sign-UP and Workshop RETIRE per scope. Travel is not a form (outbound link only). Intake is hand-coded SF form pending Heidi decision. See §6.2. |
| 20 | Resource downloads: host where? | In-repo at `/public/downloads/`, served from `heidiblondin.com/downloads/` via Cloudflare Pages. No external dependency. |

### 12.1b Resolved 2026-04-28 (from Gravity Forms JSON export + page audit)

| # | Question | Answer |
|---|---|---|
| 21 | Exact form field schemas? | Locked from GF export. See §6.2 for full inventory. Intake form RETIRED per Heidi 2026-04-29. |
| 22 | New site → Salesforce connection? | **None.** Locked. New site has zero technical connection to SF. Heidi continues to use SF as an internal tool, but website forms route to email only. See §6.1. |
| 23 | Workshop Registration form? | **Retire.** No workshops currently planned (Tammy 2026-04-28). Rebuild on demand if needed. |
| 24 | Notification recipients on new site? | `angela@heidiblondin.com` + `jack@heidiblondin.com` (provisional, Tammy to verify). Drop heidi@-only routing. Drop inactive Allcare/responseit test notifications. See §6.3. |
| 25 | Page audit — orphans, kills, consolidations? | Locked deliverable: `HBF-Page-Audit.xlsx` in project folder (54 pages, 14 drafts, 61 posts, with action recommendations and main-nav placement). |

### 12.2 Still outstanding

These are the remaining open decisions before the doc fully locks. None block Phase 1 scaffolding work.

1. **Notification recipients verification** — Tammy to confirm Angela + Jack as primary recipients (provisional decision in §6.3).
2. **Resource files extraction** — pull every Dropbox-hosted file linked from `/resources/` (and any linked from specialty service pages) into a local folder for commit to `/public/downloads/`. Full enumeration happens during the migration crawl; no pre-work needed from Tammy.
3. **Beaver Builder content extraction** — export `wp_postmeta` from phpMyAdmin filtered by `meta_key LIKE '_fl_builder%'` to capture content for `/insuranceprotection/` and any other BB-rendered pages. Technical migration task, see §7.3 step 4b.

### 12.3 Decisions resolved 2026-04-29 (Heidi)

| # | Question | Answer |
|---|---|---|
| 26 | Intake form fate? | **Retire.** Hand-coded SF Web-to-Lead duplicates qualification-call intake. 301 `/intake/` → `/contact/`. See §4.1, §6.2. |
| 27 | `/client-resources/` purpose? | **Keep, unlinked.** Heidi shares URL via client newsletter only. No password protection — protect via `noindex/nofollow`, sitemap exclusion, and keeping the embedded Calendly link off all public pages. See §4.1. |
| 28 | `/retirement-income-planning/` placement? | **Financial Services mega-menu — Planning column** (Tammy 2026-04-30, refining Heidi 2026-04-29 "near RRSP" given the new IA in §3.4). Visual adjacency preserved via Investing column on the left. Nav label "Retirement Income Planning". URL stays `/retirement-income-planning/`. Confirm with Heidi before launch. |
| 29 | FS dropdown structure (17+ items unscannable)? | **Mega-menu, 3 columns: Investing / Insurance / Planning** (Tammy 2026-04-30). Replaces flat 17-item dropdown. Full IA in §3.4. |

---

## 13. Appendix A — Full URL inventory

### Pages (54, from `page-sitemap.xml`)

```
/
/all-in-banking/
/angela/
/blog_disclaimer/
/charitable_giving/
/client-resources/
/contact/
/contact-thank-you/
/executor2/
/financial-services/
/financial-services/combination-insurance/
/financial-services/critical-illness-insurance/
/financial-services/disability-insurance/
/financial-services/employee-group-benefits-plans/
/financial-services/estate-planning/
/financial-services/first-home-savings-account/
/financial-services/group-savings-plans/
/financial-services/individual-health-dental-plans/
/financial-services/insurance/
/financial-services/insurance-quote/
/financial-services/insuranceprotection/
/financial-services/investments/
/financial-services/life-insurance/
/financial-services/registered-education-savings-plans/
/financial-services/registered-retirement-savings-plans/
/financial-services/segregated-fund/
/financial-services/tax-free-savings-accounts/
/financial-services/travel-insurance/
/heidi/
/heidi-2/testimonials/
/heidi3/
/insurance/
/insurance-submitted/
/intake/
/jack/
/joanne/
/joanne-thank-you/
/john/
/life-insurance/thank-you/
/life-insurance-broker/
/life-insurance-for-parents/
/life-insurance-peace-of-mind/
/privacy-policy/
/resources/
/retirement-income-planning/
/test/
/videos/
/videos/financial-resp-videos/
/videos/heidi-blondin-financial-financial-literacy-videos/
/videos/heidi-blondin-financial-retirement-planning-videos/
/videos/heidi-blondin-financial-videos-estate-planning-videos/
/website-compliance/
/whole-life-confirmation/
/whole-life-insurance/
```

### Posts (62, from `post-sitemap.xml`)

Spans 2017-09 through 2026-02. Full list omitted from inline; pull from `https://heidiblondin.com/post-sitemap.xml` directly during migration. Highlights of recent (keep-and-migrate) posts:

```
/the-most-underestimated-risk-in-retirement-planning-sickspan/  (2026-02)
/mortgage-insurance-vs-life-insurance-what-you-need-to-know/    (2025-10)
/executor-essentials-navigating-your-responsibilities-with-confidence/ (2025-10)
/financial-planning-for-new-grads-secure-your-future-today/    (2025-07)
/maximize-your-oas-benefits-old-age-security-simplified/        (2025-03)
/boost-your-retirement-savings/                                 (2025-01)
/how-to-easily-reduce-the-emotional-and-financial-burden-of-settling-your-estate1/ (2025-01)
/financial-planning-insights-2024-fidelity-retirement-report/   (2024-12)
/navigating-life-financial-waves-three-phases-life-insurance/   (2024-05)
```

Older posts (2017-2022): audit for evergreen value vs retire. Posts dated `2018-12-03` are likely a backdated import batch.

---

## 14. Appendix B — Brand starter tokens (for Tailwind config)

```js
// tailwind.config.js — proposed starting palette
theme: {
  extend: {
    colors: {
      brand: {
        plum: '#593D58',      // primary brand bg
        plumDark: '#3F2C3E',
        cream: '#FAF9F5',     // button bg, light surfaces
        ink: '#222222',       // body text
        inkSoft: '#141413',   // button text
        // TBD: secondary accent (consider a warm gold or rose)
      },
    },
    fontFamily: {
      serif: ['"Playfair Display"', 'Georgia', 'serif'],
      sans: ['"Open Sans"', 'system-ui', 'sans-serif'],
    },
  },
}
```

---

## 15. Appendix C — Sources & verification

This document was assembled from a live crawl of heidiblondin.com on 2026-04-16 (Tammy logged in as admin), supplemented by:

- [Yoast XML Sitemap Index](https://heidiblondin.com/sitemap_index.xml)
- [Page Sitemap](https://heidiblondin.com/page-sitemap.xml) (54 URLs)
- [Post Sitemap](https://heidiblondin.com/post-sitemap.xml) (61 URLs)
- [Privacy Policy](https://heidiblondin.com/privacy-policy/) — iA Financial Group corporate policy
- [Website Compliance](https://heidiblondin.com/website-compliance/) — Investia-mandated disclaimer
- [CIRO Membership Disclosure update](https://www.ciro.ca/newsroom/publications/update-membership-disclosure-requirements) — December 31, 2024 deadline for "Regulated by CIRO" branding
- [CRTC CASL FAQ](https://crtc.gc.ca/eng/com500/faq500.htm) — opt-in consent, identification, unsubscribe requirements
- [Investia legal & compliance](https://investia.ca/en/legal-and-compliance) — dealer-side compliance reference

**Companion deliverables (in project folder):**

- **`HBF-Page-Audit.xlsx`** (2026-04-28) — full page-by-page audit of the 54 published pages, 14 drafts, 61 posts. Action recommendations (KEEP/KILL/CONSOLIDATE/REVIEW), main-nav placement, inbound link counts, page builder dependency, form embedding, external dependencies. Built from `wp_posts` CSV export from phpMyAdmin and the Gravity Forms JSON export. Color-coded for fast scanning.
- **`gravityforms-export-2026-04-28.json`** (in `/uploads/`) — raw Gravity Forms JSON export source for §6.2.
- **`wp_posts.csv`** (in `/uploads/`) — raw `wp_posts` table export source for the page audit.
