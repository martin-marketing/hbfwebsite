# HBF Website — GA4 Traffic Analysis & IA Recommendations

**Date range:** Jan 1, 2024 → Apr 30, 2026 (28 months)
**Total page views:** 14,780 (~17.6/day across all pages)
**Total sessions (entries):** 9,402 (~11.2/day)
**Source files:** `Pages_and_screens_Page_path_and_screen_class.csv`, `Landing_page_Landing_page.csv`

## How to read this

This is a low-traffic site. "High-traffic" here means ~100+ views over 28 months, not big absolute numbers. Ranked traffic and entry behavior matter more than raw counts — and the patterns are signal-rich.

Two newer pages have biased-low data and should be considered with that in mind: `/retirement-income-planning/` (live Nov 2025) and `/client-resources/` (live Nov 2025).

## 1. Headline observations

### 1a. The home page does most of the work

Home: **6,116 views** (41% of all views) and **5,022 entry sessions** (53% of all entries). Most visitors arrive at the home page directly — typing the URL, clicking a business card link, or arriving from Heidi's direct outreach. This validates keeping the home page as the primary brand surface, not a deep-linking funnel.

### 1b. The team pages and Contact page punch above their weight

After the home page, the next four most-visited pages are all about people or contact, not products:

| Rank | Page | Views | Sessions |
|---:|---|---:|---:|
| 2 | /heidi/ | 1,162 | 235 |
| 3 | /contact/ | 1,010 | 295 |
| 4 | /financial-services/ | 490 | 110 |
| 5 | /resources/ | 383 | 113 |
| 9 | /joanne/ | 232 | 148 |

**Implication:** the trust/relationship pages (Heidi, Joanne, Contact) drive the conversion narrative more than any product page. The new top nav should keep these prominent — exactly where they are now.

### 1c. Within the FS dropdown, two pages dominate; the rest are long-tail

Of the 19 pages assigned to the FS mega-menu:

| Page | Views | Mega-menu column |
|---|---:|---|
| /insurance/ | 203 | Insurance |
| /investments/ | 194 | Investing |
| /life-insurance/ | 173 | Insurance |
| /registered-retirement-savings-plans/ | 98 | Investing |
| /tax-free-savings-accounts/ | 92 | Investing |
| /critical-illness-insurance/ | 87 | Insurance |
| /segregated-fund/ | 73 | Investing |
| /charitable_giving/ | 72 | Planning |
| /travel-insurance/ | 68 | Insurance |
| /employee-group-benefits-plans/ | 64 | Insurance |
| /insurance-quote/ | 57 | Insurance (CTA) |
| /individual-health-dental-plans/ | 55 | Insurance |
| /first-home-savings-account/ | 54 | Investing |
| /estate-planning/ | 46 | Planning |
| /registered-education-savings-plans/ | 39 | Investing |
| /group-savings-plans/ | 34 | Investing |
| /disability-insurance/ | 33 | Insurance |
| /combination-insurance/ | 16 | Insurance |
| /retirement-income-planning/ | 12 | Planning |

Investments hub (194v) and Life Insurance (173v) lead by a wide margin. Then a tier of registered plans (RRSP/TFSA/CI ~90v each). Below that, traffic drops to <75v over 28 months. **This justifies reordering each column by actual demand** rather than alphabetically or by Heidi's product hierarchy.

## 1d. Context update from Tammy 2026-04-30

Four traffic patterns that looked organic-or-mysterious in the raw data are actually explainable through Heidi's existing operational channels. This shifts the interpretation of several numbers below:

- **`/insurance/` was the Google Ads landing page** (now off). Its 203 views and 137 entry sessions reflect that history. On the new site it's just the Insurance hub — already top of the Insurance mega-menu column, no special handling needed.
- **`/all-in-banking/` (115v / 47s) was promoted in a quarterly client newsletter.** Traffic is existing-client clicks, not organic search. Removes the top-nav promotion case in §3 below.
- **`/fundex_merger/` (66v / 62s) was also a newsletter announcement** (2018 dealer change). Bookmark/forward traffic, not organic. 301 → `/heidi/` on the new site.
- **`/heidi-2/` and `/executor2/` have already been deleted from WordPress by Jack.** Anyone hitting these URLs right now is getting a 404 (consistent with `/404.html/` showing 72 views in the period). Migration redirect map still needs entries — Google's index doesn't update just because the source page is gone.

**Operational implication for IA:** newsletter-driven traffic doesn't need navigational discoverability. The pages should still resolve (so old newsletter links don't break), but they don't need to be findable through the menu by a first-time visitor.

## 2. Recommended mega-menu reordering

Current order in §3.4 of the requirements doc was conceptual (hub first, then registered plans, then specialty products). The traffic data argues for usage-driven order within each column:

### Investing column — reorder

**New order:** Investments *(hub)* · RRSP · TFSA · Segregated Funds · FHSA · RESP · Group RSP

| Item | Views | Notes |
|---|---:|---|
| Investments hub | 194 | Strong hub — keep at top |
| RRSP | 98 | Highest-traffic registered plan |
| TFSA | 92 | Close second |
| Segregated Funds | 73 | Surprisingly strong (was placed last in proposal) |
| FHSA | 54 | Demote — below Seg Funds despite being newer |
| RESP | 39 | Demote |
| Group RSP | <25 | Demote to bottom |

### Insurance column — reorder

**New order:** Insurance *(hub)* · Life · Critical Illness · Travel · Group Benefits · Health & Dental · Disability · Combination · *(Request a Quote → CTA)*

| Item | Views | Notes |
|---|---:|---|
| Insurance hub | 203 | Strong hub — top |
| Life Insurance | 173 | Highest specialty product |
| Critical Illness | 87 | |
| Travel | 68 | Promote — surprisingly high vs. earlier proposal placement |
| Group Benefits | 64 | |
| Health & Dental | 55 | |
| Disability | <40 | Demote |
| Combination | <30 | Demote to bottom |

### Planning column — reorder

**New order:** Charitable Giving · Estate Planning · Retirement Income Planning

Charitable Giving leads (72v) — surprising given how often it's positioned as an afterthought topic. Estate Planning (46v). RIP (low — but only live since Nov 2025; trust the data after a few quarters of fresh history).

## 3. Top-nav promotion candidates

Two pages outside the current main nav are pulling enough traffic to consider promoting:

**`/all-in-banking/` — 115 views, 47 entry sessions.** *Resolved 2026-04-30:* traffic is from Heidi's quarterly client newsletter, not organic search. **Leave as a standalone LP.** No mega-menu placement. Preserve URL on new site so old newsletter links don't 404.

**`/whole-life-insurance/` — 94 views, 80 entry sessions.** Also a campaign LP. The 80 entries vs. 94 views ratio (85%) means almost everyone who hits this page came in cold from search. Solid SEO performance for a niche term. Either: (a) keep as a standalone LP and link from `/financial-services/life-insurance/`, or (b) merge into Life Insurance with a `#whole-life` anchor section. Recommend (a) — preserve the SEO asset.

## 4. 301-redirect priorities — high-traffic kill-list URLs

Three URLs already on the kill list (or duplicate-content list) are getting meaningful Google traffic. Their 301 destinations need to be specific, not just `/`:

| URL | 28-mo traffic | Status | Recommended 301 target |
|---|---:|---|---|
| /heidi-2/ | 307v / 262 sessions | **Already deleted from WP by Jack** — currently 404s | → /heidi/ |
| /heidi-2/testimonials/ | 288v / 82 sessions | **Already deleted (parent)** — currently 404s | → /testimonials/ |
| /executor2/ | 59v / 45 sessions | **Already deleted from WP by Jack** — currently 404s | → /resources/ (was an executor checklist LP) |
| /fundex_merger/ | 66v / 62 sessions | Still resolving on current site | → /heidi/ — was a newsletter announcement (2018 dealer change). Bookmark/forward traffic. /heidi/ already mentions Investia. |

**Note on already-deleted URLs:** the 301s still belong in the migration redirect map. Google has these URLs indexed; clients may have them bookmarked or saved in old newsletters. The fact that they currently 404 means traffic is being lost right now — the new-site launch is the moment to fix that, not the moment to introduce the redirects. (`/404.html/` shows 72 views over the period, which is consistent with this leakage.)

## 5. Pages getting traffic that aren't in the audit

These URLs got traffic but didn't come up in the page audit pass — worth investigating before launch:

| URL | Views | Sessions | Likely category | Action |
|---|---:|---:|---|---|
| /insurance-landing-page/ | 81 | 20 | **Not the Google Ads LP** (that was /insurance/, per Tammy 2026-04-30). 40 key events on 12 active users (~3x event/user ratio) suggests admin/test traffic inflating event counts, not real conversion. | Investigate — likely a stale duplicate. Probably 301 → /insurance/. |
| /maximize-your-oas-benefits.../ | 78 | 44 | Blog post pulling steady organic | Confirm it's in the blog migration list |
| /hiring/ | 61 | 54 | HR/jobs page | Confirm with Heidi — keep, retire, or update |
| /fhsa/ | 56 | 17 | Duplicate of /financial-services/first-home-savings-account/? | 301 the loser; pick the winner based on backlinks |
| /diane/ | 35 | 12 | Team member page not in audit? | Confirm — current team or former? |
| /working/ | 21 | 12 | Unknown slug | Investigate |
| /heidiblondin.com/ | 25 | 25 | Self-referential broken URL | Clean up; 301 → / |

## 6. Footer-only candidates (low traffic, must-keep for compliance)

| Page | Views | Why footer |
|---|---:|---|
| /privacy-policy/ | 68 | Standard footer placement |
| /website-compliance/ | 87 | Standard footer placement (Investia-mandated) |
| /blog_disclaimer/ | <20 | Compliance — footer or per-blog-post |

## 7. Zero-traffic audit pages

Seven pages in the audit got zero views over 28 months. Most are explainable:

- **/testimonials/** — zero is correct; this is the *new* slug we're moving testimonials to. Real traffic lives at `/heidi-2/testimonials/` (288v).
- **/thank-you/** — generic form thank-you, expected to be low. Other thank-you pages exist (`/life-insurance/thank-you/` = 19v / 8 key events).
- **/financial-resp-videos/, /heidi-blondin-financial-financial-literacy-videos/, /heidi-blondin-financial-retirement-planning-videos/, /heidi-blondin-financial-videos-estate-planning-videos/** — these slugs exist as standalone pages but get zero traffic. The `/videos/...` versions of the same paths DO get ~200 combined views. Conclusion: the audit-listed bare slugs are likely orphaned/duplicate; the canonical versions are nested under `/videos/`. Migrate the nested versions, drop the bare ones.
- **/=SUM(B59:B70)/** — spreadsheet formula leak in audit data. Junk row, ignore.

## 8. Decisions surfaced for Tammy/Heidi

**Resolved 2026-04-30 (Tammy):**

- ✓ /all-in-banking/ — newsletter-driven, leave as standalone LP, preserve URL.
- ✓ /fundex_merger/ — newsletter announcement, 301 → /heidi/.
- ✓ /heidi-2/ + /executor2/ — already deleted at source; redirect map still needed.
- ✓ /insurance-landing-page/ — likely stale duplicate (the real Ads LP was /insurance/); 301 → /insurance/.

**Still open:**

1. Apply column reordering in §2 to §3.4 of the requirements doc? *(Recommend: yes — small change, big readability win.)*
2. `/whole-life-insurance/` — keep standalone or merge into Life Insurance? (94 views / 80 entries — strong cold-search performance.)
3. `/hiring/` (61v / 54s) — current or stale? Confirm with Heidi.
4. `/fhsa/` vs `/financial-services/first-home-savings-account/` — which is canonical? Likely consolidate.
5. 301 destinations for any other newsletter-promoted URLs that aren't on the audit yet — worth scanning past newsletters once for any pages we missed.

---

*Generated 2026-04-30 from GA4 export against HBF-Page-Audit.xlsx v4. Audit updated to v5 with three new GA4 columns appended.*