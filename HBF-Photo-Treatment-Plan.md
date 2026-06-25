# HBF Website — Photo Treatment Plan

**Source:** March 13, 2026 studio shoot by Blondin (31 photos, all in `/team photos/`)
**Direction locked 2026-04-30 (Tammy):** editorial 3/4 body shots throughout. No tight cropped headshots — Heidi's clients respond to relatable, human imagery (Joanne's personal-interest photos on her current profile page are the proof point). Design treatment will lean editorial, not corporate-conventional.

## Team

Five people in the formal team shoot, plus Diane who stays on the team without a new photo (near retirement, not taking new clients — Tammy 2026-04-30):

| Person | Role | New site page | Photo source |
|---|---|---|---|
| **Heidi Blondin** | Founder, CFP — primary advisor | /heidi/ | New shoot |
| **Joanne** | Advisor | /joanne/ | New shoot + existing personal-interest photos preserved (clients love them) |
| **Jack Blondin** | Heidi's son — advisor | /jack/ | New shoot + family shot |
| **Angela** | Team member | /angela/ | New shoot |
| **John Blondin** | Operations Manager (current site title — Heidi's husband) | *(no profile page — see note below)* | New shoot, team appearances only |
| **Diane** | Long-term advisor, near retirement, not accepting new clients | /diane/ | Existing photo retained |

## Photo assignments

### Team / About pages

| Slot | Photo | Why |
|---|---|---|
| Primary team hero | **CORP367** (formal team) | All 5 present, polished, strong composition. Tammy's pick — confirmed. |
| Secondary "human" team shot | **CORP482** (team casual) | Denim + knit, relaxed seated arrangement. Pairs with the formal shot for an editorial About page that shows both registers. |

### Individual profile pages

| Page | Primary photo | Notes |
|---|---|---|
| /heidi/ | **CORP260** (plum suit) | Direct brand-color tie-in (existing brand palette is plum/burgundy + cream). Use as the lead 3/4 body shot. 8 other Heidi shots available for blog bylines, social, seasonal variation. |
| /joanne/ | **CORP273** (cream blazer + tan pants) | Plus: 3 personal-interest photos (fishing, motorcycle, woodworking) in `/team photos/Joanne personal photos/` — clients respond strongly to these per Tammy. 2 other Joanne studio shots available. |
| /jack/ | **CORP378** (navy blazer + light blue shirt) — primary | Plus **CORP531** (Jack + Maddie + Brooks) as a "the personal side of Jack" section. Three-generation shot showing Jack as a young dad/family man. 4 other Jack solo shots available. |
| /angela/ | **CORP287** (camel wrap) | 3 other Angela shots available. |
| /diane/ | Existing photo retained | No new shoot. Page stays as-is per Tammy 2026-04-30. |

### Set aside (do not use on current build)

| Photo | Status |
|---|---|
| **CORP488** (Heidi + Jack + Brooks — three generations) | Heidi flagged this as "nice at some point" but not for current build. Keep filed; revisit during a future content refresh. |
| **CORP528** (Heidi + Brooks — grandmother + grandson) | Personal/family. Set aside. |
| **CORP067** (Heidi + Jack — mother + son working) | Could optionally appear on /heidi/ or /jack/ as a relationship signal, but not required. Lower priority than the picks above. |

## Joanne's personal-interest photos (provided 2026-04-30)

| File | Subject |
|---|---|
| `Joanne fishing.jpeg` | Fishing |
| `Joanne on motorcycle.jpeg` | Motorcycle |
| `Joanne woodworking.jpeg` | Woodworking |

Located in `/team photos/Joanne personal photos/`. Files are ~20KB each — they're already low-resolution (likely sourced from social or personal devices), so they won't scale up to hero size. Treatment recommendation: render them as a 3-up gallery row at small/medium size on `/joanne/` under a "Off the clock" or "What I love" heading. The studio shot (CORP273) carries the page; these add the relatability layer.

**Resolved 2026-04-30 (Tammy):** the profile-page template will support an optional "personal interests" section on every team member's page. Heidi will eventually populate hers; Jack's gets CORP531 (the Jack/Maddie/Brooks family shot) at launch; Joanne's is fully populated now. Angela's stays empty for now but the template slot is ready when she has content. Diane's page keeps its current treatment — no personal section unless she contributes one.

---

## John on the team page

John appears in both team photos but isn't a financial advisor — he's Heidi's husband and serves as the practice's Operations Manager (his title on the current site). Caption confirmed by Tammy 2026-04-30:

> **John Blondin — Operations Manager**

This title is already the site's existing convention, is compliance-clean (Investia/CIRO ad rules require non-licensed people not to be presented as advice-adjacent — "Operations Manager" is a clearly defined non-advisory role), and removes any ambiguity about his function. No profile page; team-photo appearances + caption only.

## Technical / production notes

**Optimization plan (Phase 2 build):** each chosen photo gets converted to:
- **WebP** at 3 widths (480px, 960px, 1440px) for modern browsers
- **JPG fallback** at the same widths
- Responsive `srcset` markup so the browser picks the right size for the viewport

Originals stay archived (the `/team photos/` folder) so we can re-derive at any time.

**File naming on new site:** `/public/team/heidi-portrait.webp`, `/public/team/jack-portrait.webp`, etc. The CORP-numbered originals get renamed to human-readable filenames during the optimization pass.

**Editorial cropping:** for the individual profile pages, the 3/4 body framing stays. No tight headshots. Each page lays out as either a side-by-side (photo + bio text) or a stacked editorial card (photo above, bio below) depending on viewport. Final design choice during Phase 1 component build.

**Profile-page template — optional personal-interests slot:** every profile page renders a "personal interests" gallery section conditionally — present when there's content, hidden when there isn't. At launch: Joanne (3 photos) and Jack (Jack/Maddie/Brooks family shot) populated; Heidi, Angela, Diane left empty. Heidi can add hers anytime via the lightweight content UI without a design change. The template needs to handle 1, 2, 3, or more images gracefully (single hero image, paired layout, or 3-up grid).

## Outstanding decisions

1. ~~John's team-page caption~~ — **resolved 2026-04-30: "Operations Manager" (Tammy).**
2. ~~Joanne's existing personal-interest photos to preserve~~ — **resolved 2026-04-30: 3 photos provided.**
3. ~~Personal-interests treatment scope~~ — **resolved 2026-04-30: optional section on every profile page; populated for Joanne and Jack at launch; Heidi to add hers later; Angela slot reserved (empty); Diane unchanged.**
4. Whether to add CORP067 (Heidi + Jack mother-son shot) anywhere, or set aside with the other family shots.
5. Heidi's personal-interests content (photos + brief captions) — Heidi to supply when ready. Not blocking launch.
6. Angela's personal-interests content — open if/when Angela wants to add it.

---

*Plan generated 2026-04-30. Updates here as decisions land.*
