# Project Alpaca — Alpacee Directory · Technical Documentation

_Last updated: September 2026_

This document describes the Alpacee Directory web app: what it is, how it's built, how data flows, how to perform common maintenance tasks, and what's still open. It's written for whoever maintains the site next (developer or technically-comfortable team member).

---

## 1. What this is

The **Alpacee Directory** is a public web app that showcases Project Alpaca's students ("Alpacees") — under-resourced NYC college students entering tech — so mentors, recruiters, and employers can browse profiles and reach out. It pulls its roster live from a Google Sheet and displays each person as a photo card that opens into a full profile.

- **Live site:** `https://project-alpaca.pages.dev`
- **Repo:** `https://github.com/jellyfishing2346/project-alpaca`
- **Hosting:** Cloudflare Pages (auto-deploys on push to `main`)

> **Scope note:** The repo also contains marketing pages (Home, About, Get Involved, Community Programs, Flagship, Contact, Donate). Per Michelle, **the marketing site is being built in Framer** (so the team can edit via a CMS without code). Those pages were an exploration and are **not the deliverable** — the **directory is the focus**. They still exist at their routes but shouldn't be treated as the source of truth for marketing content.

---

## 2. Tech stack

| Layer | Choice |
|---|---|
| UI | React 18 |
| Build tool | Vite 5 |
| Routing | React Router (`react-router-dom`) |
| Styling | Plain CSS in one global file (`styles.css`) |
| Data source | Google Sheet via the gviz CSV endpoint |
| Image hosting | Images committed to the repo under `public/photos/` |
| Deploy | Cloudflare Pages (free tier), builds on push |

No backend server. Everything is a static build plus a client-side fetch of the Google Sheet.

---

## 3. File structure

```
project-alpaca/
├── index.html                    # page shell; sets <title> + favicon
├── main.jsx                      # entry point -> mounts App.jsx
├── App.jsx                       # React Router: routes + stub pages
├── alpacees-directory-final.jsx  # the directory + profile + shared Nav/Footer/Newsletter
├── sheet.js                      # loads + normalizes the roster from Google Sheets
├── styles.css                    # ALL styling (global stylesheet)
├── Home.jsx                      # marketing homepage         (out of scope - Framer)
├── About.jsx                     # marketing About            (out of scope - Framer)
├── GetInvolved.jsx               # marketing Get Involved      (out of scope - Framer)
├── CommunityPrograms.jsx         # marketing Community Programs (out of scope - Framer)
├── Flagship.jsx                  # marketing Flagship Program  (out of scope - Framer)
├── Contact.jsx                   # marketing Contact           (out of scope - Framer)
├── Donate.jsx                    # marketing Donate            (out of scope - Framer)
├── public/
│   ├── project-alpaca-logo.png       # main logo (dark, for light backgrounds)
│   ├── project-alpaca-logo-white.png # spare (unused)
│   ├── _redirects                    # Cloudflare SPA fallback (see section 11)
│   └── photos/                       # committed headshots, one file per student
├── vite.config.js
├── package.json / package-lock.json
├── DOCS.md                       # this file
└── README.md
```

**Render flow:** `index.html` -> `main.jsx` -> `App.jsx` (router) -> either the directory (`alpacees-directory-final.jsx`) or a marketing page. `styles.css` is imported globally so every route is styled. `sheet.js` feeds live data into the directory.

---

## 4. Data flow

1. On load, the directory calls `loadAlpacees()` in `sheet.js`.
2. That fetches the sheet as CSV from the **gviz endpoint** (near real-time - no publish-cache delay).
3. The CSV is parsed, and **only the public-safe columns** (see section 6) are read into records.
4. Each record is enriched (category inferred, skills cleaned, photo resolved) and rendered.

If the fetch fails, the app falls back to a small inline roster baked into the code, so the page never breaks.

**Sheet coordinates** (in `sheet.js`):
```
SHEET_ID = "1ADZgC4L81O27dSX-7SXJ6PLeOucaJ-T0SLd8JTULUFA"
GID      = "1999310915"   // the tab to read
```
The sheet must be shared **"Anyone with the link -> Viewer"** for the fetch to work.

---

## 5. The Google Sheet

- File: **"Consolidated Cohort Students & Alpacees Directory V2"**
- The app reads the tab identified by `GID` above.
- The site reads the columns whose headers match `COLUMN_MAP` in `sheet.js`. **Header text must match exactly.**

### Columns the app reads

| App field | Sheet column header |
|---|---|
| name | `Name` |
| cohort | `Cohort` |
| school | `School` |
| major | `Major` |
| grad | `Graduation Year` |
| role | `Current Job / Role` |
| company | `Current Company` |
| linkedin | `LinkedIn Profile` |
| portfolio | `Website / Portfolio` |
| quote | `Testimonial about Project Alpaca` |
| skills | `Skills` |
| photo | `Photo link` |
| bio | `Bio` |
| resume | `Resume Link` |
| completion | `Completion` |
| photoPos | `Photo Position` (optional) |

---

## 6. Data & privacy (important)

The source sheet contains sensitive columns - **Email** and demographic fields (race, immigrant status, first-generation-college). These are **deliberately never mapped** in `COLUMN_MAP`, so even if they appear in the CSV response they never reach the app or the browser. **Do not add these to `COLUMN_MAP`.**

Only the public-safe fields listed in section 5 are ever displayed.

---

## 7. Photos (the hosting system)

**Why not Google Drive:** Drive image links get blocked by browsers (Firefox's "OpaqueResponseBlocking" / ORB) because Drive doesn't return clean image responses. They load inconsistently and fail entirely in Firefox. **Drive is not a viable image host for a public site.**

**The solution:** headshots are committed to the repo under `public/photos/` and matched to people **automatically by name**.

### How matching works
For each person, `sheet.js`:
1. If their `Photo link` cell has a value (a filename or full URL), that is used.
2. Otherwise, it **slugifies their `Name`** and looks for a matching file in `public/photos/`.

**Slug rule:** lowercase, spaces -> hyphens, parentheses/dots/underscores removed. Examples:
- `Patricia Pack Falcon` -> `patricia-pack-falcon`
- `Noel Madera, Jr.` -> `noel-madera-jr`
- `Opinderjit Kaur (Amy)` -> `opinderjit-kaur-amy`

The known filenames + extensions live in the `PHOTO_FILES` map in `sheet.js`, and `photoBySlug()` turns a slug into `/photos/<slug>.<ext>`.

### The golden rule
**A person's photo shows only if `slugify(their sheet Name)` exactly equals their photo's filename (minus extension).** If they show an initials tile instead of a photo, the name and the filename don't match - fix one to match the other (see section 10).

### Graceful fallback
If a photo is missing OR fails to load, the `Face` component renders a **colored initials tile** (e.g. "PP") instead of a broken image. So the grid never looks broken, even mid-migration.

---

## 8. Directory features

**Design source:** Figma file "Web design - Project Alpaca" (`pI4KbsmcNLeNbyQvCtJXn7`), page **Visual Design - Desktop**, frame **Directory - Home** (`1395:8563`), by Studio Haven. (The same file's "Wireframes" page is the older gray wireframe; don't build from that.)

- **Header** - directory-only (`DirHeader`): a "Want to hire one of our Alpacees? Email us" banner (mails partnership@projectalpaca.org), the logo with an "Alpacee Directory" label, and "Meet the Alpacees / See Projects" links. "See Projects" points to `/flagship` until a projects page exists. The marketing pages keep the shared `Nav`.
- **Search by name** - free-text filter (not in the Figma; kept because it's useful, styled like the filter pills).
- **Category filter pills** - Software Engineering / Data / Design / Business / Marketing, each opening a dropdown of checkboxes: "All <category>" plus sub-buckets. A pill fills with its category color once anything is picked, and its label lists the picks (e.g. "Design: UI Design, UX Research"), as in the Figma. Picks combine with OR. Category is inferred per person by `inferCategory()`.
- **Category colors** - `CAT_COLORS` in `alpacees-directory-final.jsx`, from the Studio Haven palette. The same color fills the pill and tints that category's skill tags at 60% (per the Figma "Skill tag" component: Purple = Design, Night Sky = Project management, Mellow Yellow = Technical).
- **Sub-buckets** - `SUBCATEGORIES` in the same file; the final list is still TBD. Each is a label plus a keyword pattern matched against major/role/skills within that category. Edit there; empty ones hide automatically.
- **Clear all** - appears once a filter or search is set.
- (The "Open to opportunities" filter and badge were removed per team decision. The site no longer reads the `Open to Opportunities` sheet column.)
- **Pagination** - 12 per page; "Previous / 1 2 3 … 5 6 / Next" in GT America caps, per the Figma. Changing page scrolls to the top. Resets to page 1 when a filter or search changes.
- **Completers-only** - anyone whose `Completion` cell says **`No`** is hidden entirely (both card and profile). Blank/anything else shows. This keeps non-completers off the public directory.
- **Photo cards** - 600px tall, full-bleed headshot (or an initials tile in a brand color) with the name (GT America 40px), "role at company" and category-colored skill tags overlaid at the bottom.
- **Get Involved** - five cards in brand colors (Support Us, Become Our Partner, Become an Alpaca, Join a Cohort, Join as a Volunteer), per the Figma. Photos load from `public/images/get-involved/` as `support.jpg`, `partner.jpg`, `mentor.jpg`, `cohort.jpg`, `volunteer.jpg`; export them from the Figma frame. Until a file exists, its card shows without a photo.
- **Newsletter and footer** - directory versions (`DirNewsletter`, `DirFooter`) per the Figma; the marketing pages keep the shared `Newsletter` and `Footer`. The newsletter form isn't connected to an email service yet.
- **Logo files** - `project-alpaca-logo.png` has a white background (the header blends it into the cream with `mix-blend-mode`; the footer shows it on a white tile). `project-alpaca-logo-white.png` is a solid white square and isn't usable; a transparent logo export from Figma would fix both.

---

## 9. Profile pages

Clicking a card opens that person's profile (currently via in-app state, not a separate URL - see section 13). The page scrolls to the top when a profile opens and when returning to the directory, so it reads as a new page; route changes (e.g. footer links) also reset scroll via `ScrollToTop` in `App.jsx`.

Layout:
- **Left rail:** the photo at its **natural proportions** (no forced square crop, so faces aren't cut off), then **Education** (school, grad year, major) and **Experience** (company, role).
- **Right column:** cohort/category label, name, skill tags, a green **Contact** button and **Download resume** link, an **About** section (bio, or "Bio coming soon"), a **Project Showcase** slot (placeholder pending data), **Recommendations** (their testimonial; hidden if they have none), and a hiring CTA.
- **Other Alpacees with similar skills** - three cards from the same category.

Working links: **Contact** -> the person's `LinkedIn Profile`; **Download resume** -> their `Resume Link`.

---

## 10. Common tasks

### Add or update a student's photo
1. Save the image as `firstname-lastname.<ext>` - **lowercase, hyphens**, matching what `slugify(their sheet Name)` produces. Keep the real extension (`.jpg`, `.png`, `.jpeg`).
2. Put the file in `public/photos/`.
3. Add one line to `PHOTO_FILES` in `sheet.js`: `"firstname-lastname":"jpg",`
4. Commit + push.

If their photo shows as an initials tile, the filename doesn't match `slugify(Name)`. Either rename the file, or fix the sheet Name - they must agree.

### Hide a non-completer
Put `No` in their `Completion` cell. They disappear from the site on the next load. (Self-maintaining - remove the `No` and they reappear.)

### Adjust a photo's crop on the card
The gallery card crops photos toward the top by default (faces). To fine-tune one, put a CSS `object-position` value in their `Photo Position` cell (e.g. `center top`, `center 40%`, `right center`). The profile photo shows in full, so it's unaffected.

### Add a student to the roster
Add a row to the sheet with at least a `Name`. Fill the public-safe columns you have. Add their photo per the steps above. They appear on the next load.

---

## 11. Deployment

- Cloudflare Pages watches `main` and rebuilds on every push. No manual deploy step.
- **SPA fallback:** `public/_redirects` contains `/*  /index.html  200`. This is required so that opening a deep link (e.g. `/directory`) directly doesn't 404 - Cloudflare serves `index.html` and the router takes over.
- Local build check before pushing: `npm run build` (fails loudly if something's broken).

### Local development
```
npm install            # first time only
npm run dev            # local dev server (usually http://localhost:5173)
npm run build          # production build (verify before committing)
npm run preview        # preview the production build locally
```
Note: files added to `public/` while `npm run dev` is running aren't picked up until you **restart the dev server**.

---

## 12. Routing

| Path | Renders |
|---|---|
| `/` | Marketing Homepage |
| `/directory` | The Alpacee directory (also the catch-all `*`) |
| `/about`, `/get-involved`, `/community-programs`, `/flagship`, `/contact`, `/donate` | Marketing pages (out of scope - Framer) |
| `/projects` | Stub ("coming soon") - never had a design |

Nav + Footer are shared components (defined in `alpacees-directory-final.jsx`) used across all pages.

---

## 13. Known decisions & deviations

- **Marketing pages -> Framer.** They're built here but out of scope; the team's marketing CMS is Framer.
- **Directory header** now follows the Figma (see section 8); the marketing pages keep the shared nav.
- **Where the directory differs from the Figma:** no "Open to opportunities" filter (removed per Michelle); an added search box; Software Engineering, Data and Marketing use palette colors the Figma doesn't assign (only Design, Project management and Technical tags are defined there).
- **Profiles are in-app state, not URLs.** Clicking a card opens the profile without changing the URL (no shareable `/alpacee/:id` links yet). A clean fast-follow if wanted.

---

## 14. Placeholder / pending content

These render but await real data from the team:
- Board members, junior board, mentors, teaching team (on the marketing pages).
- Program/hero/partner images and press items.
- Per-profile **Project Showcase** and (real) **Recommendations**.
- Payment processor for the Donate widget; confirm the emails (`hello@`, `partnership@`, `giving@`) are live inboxes.

---

### Fonts
- **GT America Compressed** (Medium 500, Black 900) is self-hosted from `public/fonts/` via `@font-face` at the bottom of `styles.css`, and preloaded in `index.html`. Used for headings, nav, and small labels only; the Compressed cut is too narrow for paragraphs. GT America is a commercial typeface, so confirm the web license covers this domain.
- **Public Sans** (Google Fonts) is the body font, matching the Figma wireframes.
- **Merriweather** (Google Fonts) is the serif accent: the directory intro and the profile recommendation quote.
- All three are set as CSS variables (`--font-display`, `--font-body`, `--font-serif`) in the Typography block. If Standard-width GT America weights are licensed later, add their `@font-face` rules and point `--font-body` at them.

## 15. Open items / next steps

- **Awaiting founder review.** Michelle shared the live site with Catherine Mann (founder) for feedback. Build against her actual notes rather than pre-emptively reworking.
- **Directory <-> Figma fidelity** is the current priority per Michelle ("get it as close to the Figma as possible, on brand"). The directory list page now follows the Studio Haven design (frame `1395:8563`); next is the profile page (frame `1158:7075` on the same page), the final sub-bucket list, and the Get Involved photos.
- **Subdomain.** `alpacees.projectalpaca.org` was the original plan for the directory (needs a DNS CNAME). Now that this is a full site with a homepage, revisit whether that subdomain is still the plan.
- **Repo is public** with real student names - confirm with the team that's intentional.
- **Photo workflow is now a code commit** (not a sheet paste) - make sure the team knows.

---

## 16. Quick reference

| I want to... | Do this |
|---|---|
| Add a photo | Drop `name-slug.ext` in `public/photos/`, add a line to `PHOTO_FILES`, commit |
| Hide a non-completer | `No` in their `Completion` cell |
| Nudge a card's photo crop | CSS value in their `Photo Position` cell |
| Change footer contact info | Edit the `Footer` component in `alpacees-directory-final.jsx` |
| Fix a "wrong data" issue | It's almost always the sheet - check the exact column header and cell value |
| Deploy | `git push` to `main` (Cloudflare rebuilds) |