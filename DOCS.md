# Project Alpaca Website · Technical Documentation

_Last updated: October 2026_

This document describes the Project Alpaca website: the Alpacee Directory, the marketing pages, and the Sanity CMS the team uses to edit content. It covers what it is, how it's built, where its data comes from, how to do common maintenance tasks, and what's still open. It's written for whoever maintains the site next (a developer or a technically comfortable team member). **Non-technical editors** don't need this file; see the editor guide (section "Content management"). **New contributors:** start with [CONTRIBUTING.md](CONTRIBUTING.md) for setup, conventions and the pull request checklist, then come back here for the details.

---

## 1. What this is

The **Alpacee Directory** is a public web app that showcases Project Alpaca's students ("Alpacees"), under-resourced NYC college students entering tech, so mentors, recruiters and employers can browse profiles and reach out. It pulls its roster live from a Google Sheet and shows each person as a photo card that opens into a full profile.

- **Live site:** `https://project-alpaca.pages.dev`
- **Repo:** `https://github.com/jellyfishing2346/project-alpaca` (public)
- **Hosting:** Cloudflare Pages (auto-deploys on every push to `main`)

> **Scope:** The site has two parts, all in this repo:
> - **The Alpacee Directory** (`/directory`): student profiles, read live from a Google Sheet.
> - **The marketing site:** Home, About, Get Involved, Community Programs, Flagship, Contact, Donate, built to the Studio Haven Figma designs (sections 8–8g).
>
> The original plan was to build the marketing site in Framer so the team could edit it without code. Since no Framer volunteers were available, it was built here instead (Oct 2026), and a **Sanity CMS** was added so non-technical editors can update events, news and people themselves (see "Content management (Sanity CMS)"). Everything else is still edited in the code.

---

## 2. Tech stack

| Layer | Choice |
|---|---|
| UI | React 18 |
| Build tool | Vite 5 |
| Routing | React Router (`react-router-dom`) |
| Styling | Plain CSS in one global file (`styles.css`) |
| Content (events, news, people) | Sanity CMS, fetched at build time (`scripts/fetch-content.mjs`, `cms.js`) |
| Content editing dashboard | Sanity Studio in `studio/`, hosted at https://projectalpaca.sanity.studio |
| Data | Google Sheet, fetched in the browser as CSV (gviz endpoint) |
| Images | Committed to the repo under `public/photos/` |
| Fonts | GT America Compressed (self-hosted), Merriweather + Public Sans (Google Fonts) |
| Deploy | Cloudflare Pages (free tier), builds on push |

No backend server: a static build plus a client-side fetch of the Google Sheet.

---

## 3. File structure

```
project-alpaca/
├── index.html                    # page shell; <title>, favicon, font preloads
├── main.jsx                      # entry point -> mounts App.jsx
├── App.jsx                       # React Router routes, ScrollToTop, per-page tab titles
├── alpacees-directory-final.jsx  # the directory + profile (and shared Nav/Footer/Newsletter for marketing pages)
├── sheet.js                      # loads + normalizes the roster from Google Sheets
├── cms.js                        # gives pages the Sanity content (or null -> built-in lists)
├── styles.css                    # ALL styling (global stylesheet)
├── Home.jsx, About.jsx, GetInvolved.jsx, CommunityPrograms.jsx,
│   Flagship.jsx, Contact.jsx, Donate.jsx   # marketing pages (sections 8–8g)
├── scripts/
│   └── fetch-content.mjs         # build step: saves published Sanity content to content/
├── content/                      # generated at build time; not committed (.gitignore)
├── snapshot/                     # nightly copy of the Sanity content, committed by the GitHub Action
├── .github/workflows/            # sanity-snapshot.yml: the nightly snapshot Action
├── studio/                       # Sanity Studio (separate project, its own package.json)
│   ├── sanity.config.js          # Studio setup (project 9uh7bydp, dataset production)
│   ├── sanity.cli.js             # deploy settings (studio host, app ID)
│   ├── structure.js              # the Studio's left-hand menu
│   ├── schemaTypes/              # the editing forms: event, newsItem, person, teamLists
│   └── scripts/import-current-content.js   # one-time import of the original content
├── public/
│   ├── favicon.png               # tab icon (from projectalpaca.org)
│   ├── logo-dark.svg / logo-white.svg # transparent vector logos (from the Figma export)
│   ├── fonts/                    # GT America Compressed Medium + Black (woff2/woff)
│   ├── images/                   # page photos, by page (home/, flagship/, community/, about/, people/, …)
│   ├── photos/                   # directory headshots, one file per student
│   └── _redirects                # Cloudflare SPA fallback (section 12)
├── vite.config.js                # Vite + the macOS dev-server page-refresh fix
├── package.json / package-lock.json
├── DOCS.md                       # this file
├── CONTRIBUTING.md               # how to contribute (setup, conventions, PR checklist)
└── README.md
```

**Render flow:** `index.html` -> `main.jsx` -> `App.jsx` (router) -> the directory (`alpacees-directory-final.jsx`) or a marketing page. `sheet.js` feeds live data into the directory; `cms.js` feeds Sanity content (events, news, people) into the marketing pages.

---

## 4. Data flow

1. On load, the directory calls `loadAlpacees()` in `sheet.js`.
2. It fetches one tab of the sheet as CSV from Google's **gviz endpoint** (near real-time; no publish delay).
3. Only the columns listed in `COLUMN_MAP` (section 5) are read into records.
4. Each record is enriched (category, skills cleaned, photo resolved) and rendered.

If the fetch fails, the app falls back to a small roster baked into the code, so the page never breaks.

**Sheet coordinates** (in `sheet.js`):
```
SHEET_ID = "1ADZgC4L81O27dSX-7SXJ6PLeOucaJ-T0SLd8JTULUFA"
GID      = "1999310915"   // the tab to read
```
The fetch only works if the file is shared **"Anyone with the link"** (Viewer is enough). **Read section 6 before changing anything here.**

### Google blanks some text values
The gviz endpoint gives each column a single type based on most of its cells. In a mostly-numeric column like `Graduation Year`, text values ("Fall 2023", "Graduated") arrive **blank**. Google's `QUERY` function does the same. The public-sheet formula in section 6 converts every cell to text, which fixes this. On profiles, `gradLabel()` also tidies whatever arrives: "Fall 2023" stays, "2022 (From BMCC…)" shows as "2022", and "Graduated" (no year) is hidden.

---

## 5. The Google Sheet

- File: **"Consolidated Cohort Students & Alpacees Directory V2"**, in the Project Alpaca shared drive.
- Main tab: **"Consolidated Cohort Students & Alpacees Directory V2"** (columns A–Y today). The app reads the tab set by `GID`.
- Second tab: **"Project Showcase"** (section 9).
- The app reads columns by **header text, which must match exactly**. Column order doesn't matter.

### Columns the app reads (`COLUMN_MAP` in `sheet.js`)

| App field | Sheet column header | Used for |
|---|---|---|
| name | `Name` | Cards, profiles, photo matching |
| cohort | `Cohort` | "Cohort N" labels |
| completion | `Completion` | `No` hides the person entirely |
| photo | `Photo link` | Overrides the automatic photo match (section 7) |
| school | `School` | Profile Education |
| major | `Major` | Profile Education, card fallback text, category sorting |
| grad | `Graduation Year` | Profile Education |
| linkedin | `LinkedIn Profile` | Profile icon |
| portfolio | `Website / Portfolio` | Profile icon |
| github | `Github Link` | Profile icon |
| social | `Instagram / YouTube Link (if professional)` | Profile icon (YouTube or Instagram to match) |
| resume | `Resume Link` | "Download Resume" button |
| role | `Current Job / Role` | Cards, profiles, category sorting |
| company | `Current Company` | "role at company", profile Experience |
| quote | `Testimonial about Project Alpaca` | Profile Recommendations |
| skills | `Skills` | Tags, category sorting |
| bio | `Bio` | Profile About |
| photoPos | `Photo Position` (optional, not in the sheet yet) | Photo crop (section 10) |
| category | `Category` (optional, not in the sheet yet) | Overrides category sorting (section 10) |
| action | `Action Shot Link` (optional, not in the sheet yet) | Hover photo on cards (section 10) |

The three optional columns don't exist yet. When they're added, put them right after `first_gen_college` (column Y): **Z = Category, AA = Action Shot Link, AB = Photo Position**. The public-sheet formula in section 6 expects them there.

---

## 6. Data, privacy and sharing (important)

The master sheet contains sensitive columns: **Email** and demographic fields (`race_raw`, `race_hispanic`, `race`, `immigrant`, `first_gen_college`). The app never maps or displays these. **Do not add them to `COLUMN_MAP`.**

**However, not displaying them is not the same as not exposing them.** The browser downloads the *entire tab* as CSV, every column included, and the code then ignores the sensitive ones. Anyone can see the full download in their browser's network tools, and the sheet ID is visible in the public repo and the site's code.

### Current state (as of October 2026)
- The master file is shared **"Anyone with the link: Editor."** Anyone with the ID can read *and edit* every column, and edits show up on the live site.
- The fix below needs someone who manages the shared drive (hello@, Michelle, Catherine or Claire) to change the master's sharing.

### The fix: a separate public sheet
1. Create a new Google Sheet, e.g. **"Alpacee Directory – Public"**.
2. In cell **A1**, paste the formula below, then click **Allow access** when prompted:
   ```
   =ARRAYFORMULA(TO_TEXT(CHOOSECOLS(IMPORTRANGE("https://docs.google.com/spreadsheets/d/1ADZgC4L81O27dSX-7SXJ6PLeOucaJ-T0SLd8JTULUFA", "'Consolidated Cohort Students & Alpacees Directory V2'!A1:AB"), 1,2,5,6,8,9,10,11,12,13,14,15,16,17,18,19,20,26,27,28)))
   ```
   It copies **only** the public columns (Cohort, Name, Completion, Photo link, School, Major, Graduation Year, LinkedIn, Website, GitHub, Instagram/YouTube, Resume, Role, Company, Testimonial, Skills, Bio, Category, Action Shot Link, Photo Position), stays in sync with the master automatically, and converts everything to text so nothing is blanked (section 4).
3. Share the new sheet as **"Anyone with the link: Viewer."**
4. Point `sheet.js` at it: set `SHEET_ID` to the new file's ID and `GID` to its tab's gid. Deploy and confirm the site loads.
5. **Then** set the master's general access to **Restricted** (named people and the projectalpaca.org team keep access). Do steps 1–4 first, or the site loses its data in between.

If the Project Showcase tab is wired in later (section 9), give it the same treatment: a second tab in the public sheet that imports only its columns.

---

## 7. Photos

**Why not Google Drive:** Drive image links are unreliable on a public site. Browsers (Firefox especially, via "OpaqueResponseBlocking") block them because Drive doesn't return clean image responses. `sheet.js` converts Drive links to Drive's thumbnail endpoint as a best effort, but **files in the repo are the reliable option.**

Headshots are committed under `public/photos/` and matched to people **automatically by name**.

### How matching works
For each person, `sheet.js`:
1. Uses their `Photo link` cell if it has a value (a filename in `public/photos/`, or a full URL).
2. Otherwise **slugifies their `Name`** and looks it up in `PHOTO_FILES`.

**Slug rule:** lowercase, spaces -> hyphens, parentheses/dots/commas removed. Examples:
- `Patricia Pack Falcon` -> `patricia-pack-falcon`
- `Noel Madera, Jr.` -> `noel-madera-jr`
- `Opinderjit Kaur (Amy)` -> `opinderjit-kaur-amy`

`PHOTO_FILES` in `sheet.js` lists each known filename and extension; `photoBySlug()` turns a slug into `/photos/<slug>.<ext>`.

**The golden rule:** a photo shows only if `slugify(their sheet Name)` exactly equals the photo's filename (minus extension). If someone shows an initials tile, the two don't match; rename the file or fix the Name.

**Fallback:** if a photo is missing or fails to load, the `Face` component shows a colored initials tile instead of a broken image.

**Check new photos for stray borders.** One headshot had a 1px purple selection outline baked into the file (fixed by trimming the edges). If a card shows a thin colored line on its edge, it's in the image, not the code.

---

## 8. Directory page

**Design source:** Figma file "Web design - Project Alpaca" (`pI4KbsmcNLeNbyQvCtJXn7`), page **Visual Design - Desktop**, frame **Directory - Home** (`1395:8563`), by Studio Haven. Michelle confirmed this is the final frame. (The file's "Wireframes" page is the older gray wireframe; don't build from it.)

- **Header** (`DirHeader`) - a "Want to hire one of our Alpacees? … Email us" banner (mails partnership@projectalpaca.org), the logo with an "Alpacee Directory" label, and "Meet the Alpacees / See Projects" links. "See Projects" points to `/flagship` until the Projects page is designed.
- **Intro** - "Alpacee *(Al · pah · key)* Directory is a showcase…", with "Project Alpaca" linking home.
- **Search by name** - not in the Figma; kept per Michelle, styled like the filter pills.
- **Category filter pills** - Software Engineering, Data, Design, Business, Marketing. Each opens a dropdown of checkboxes: "All <category>" plus sub-buckets. A pill fills with its category color once anything is picked, and its label lists the picks (e.g. "Design: UI Design, UX Research"). Picks combine with OR.
- **Category colors** - `CAT_COLORS` in `alpacees-directory-final.jsx`, from the Studio Haven palette (approved by Michelle): Software Engineering = Mellow Yellow `#564538`, Data = Grass `#2B6140`, Design = Purple `#5B2D53`, Business = Night Sky `#1E474D`, Marketing = Dirt `#1F1F1F`. The same color fills the pill and tints that category's skill tags at 60%.
- **Sub-buckets** - `SUBCATEGORIES` in the same file. **The final list is still TBD by the team.** Each entry is a label plus a keyword pattern matched against the person's major, role and skills, within their category. Edit there; options that match nobody hide automatically.
- **How people get a category** - the sheet's `Category` column if set, otherwise `inferCategory()` guesses from role, skills and major. The guess can be wrong (e.g. "network *administration*" reads as Business), which is what the `Category` column is for.
- **Clear all** - appears once a filter or search is set.
- **Cards** - 600px tall, full-bleed photo (or an initials tile in a brand color), name in GT America, "role at company" (or "Cohort N · Alpacee"), and up to a few category-colored skill tags (or the category name if no skills). Optional hover action shot (section 10).
- **Pagination** - 12 per page: "Previous · 1 2 3 … 6 · Next" in GT America caps. "…" only appears when it hides two or more pages. Changing page scrolls to the top; changing a filter resets to page 1.
- **Completers only** - anyone whose `Completion` cell is `No` is hidden entirely.
- **Get Involved** - five cards in brand colors (Support Us Financially, Become Our Partner, Become an Alpaca (Mentor), Join a Cohort, Join as a Volunteer). Photos load from `public/images/get-involved/` named `support`, `partner`, `mentor`, `cohort`, `volunteer`, as `.jpg` or `.png` (export them from the Figma frame). Until a file exists, its card shows without a photo.
- **Newsletter** (`DirNewsletter`) - per the Figma. **Not connected to an email service yet** (the team uses MailerLite; account details pending).
- **Footer** (`DirFooter`) - per the Figma, including "Designed by Studio Haven". The marketing pages keep the older shared `Footer`.
- **Removed per Michelle:** the "Open to opportunities" filter and badge. The site no longer reads that column.

---

## 8b. Homepage

**Design source:** same Figma file, frame **Home** (`669:3841`). Built in `Home.jsx`, styled in the "Homepage" block of `styles.css` (scoped to `.root-home`).

Sections: hero photo with the nav overlaid in white and "Creating tech leaders / for New York City"; partner logos; "Unlocking Potential" mission text and three stats; Flagship + Community Programs cards; Events; "From Our Community" testimonials (two rows scrolling in opposite directions; paused on hover; static and scrollable for visitors with "reduce motion" on); Get Involved, Newsletter and Footer (shared with the directory).

**Content:**
- **Testimonials come from the Google Sheet** (`Testimonial about Project Alpaca`, via `useAlpacees()`), so new ones appear automatically. Only quotes longer than ~20 characters show; long quotes are clipped to 7 lines on the card.
- **Stats** (250+, $1,000,000+, 100%) and **partners** are in `STATS` / `PARTNERS` at the top of `Home.jsx`.
- **Events** are in `EVENTS` at the top of `Home.jsx` (`date` as `YYYY-MM-DD`, `title`, `desc`, `where`, optional `image`, optional `keep`). **Past events hide automatically** unless `keep: true`; with none showing, the section says so and points to the newsletter. RSVP emails hello@projectalpaca.org with "RSVP: <title>". **Currently shows the design's two placeholder "Summer Picnic" entries** (`keep: true`, photo `images/home/events/summer-picnic.jpg`); replace with real events.

**Matched against the design render** (`Home.jpg` in the Figma export), section by section. Known remaining differences: the Medium footer icon (needs a URL: `SOCIALS` in `alpacees-directory-final.jsx`), and the "Support Us Financially" description (the design repeats the partner text; the site keeps the donation text).

Testimonial cards use the alpaca icon from the design (`images/home/icons/alpaca-<color>.png`, recolored per card).

**Images** (`public/images/home/`; each tries .jpg/.png/.svg and degrades gracefully if missing):

| File | Used for | If missing |
|---|---|---|
| `hero.jpg` | Hero photo | Dark teal background |
| `logos/goldman-sachs`, `american-express`, `google`, `justworks`, `meta` (.svg or .png) | Partner row | Company name as text |
| `illustrations/backpack`, `money`, `rainbow` (.svg or .png) | Stat blocks | Hidden |
| `illustrations/speech` (.svg or .png) | Next to "From Our Community" | Hidden |
| `flagship.jpg` (conference room, blue screen), `community.jpg` (red couch, yellow sofa; same photo as the Get Involved partner card) | Program cards | Subtle empty panel |
| `events/<image>.jpg` | Event rows (per event's `image`) | Subtle empty panel |

Export photos from Figma **as JPG** (Figma's default is PNG; a PNG renamed to .jpg won't compress). Logos and illustrations are best as SVG.

Partner logos and illustrations were cut from the Figma page export (`Home.jpg`, 1x) with their backgrounds removed. SVG exports would be sharper on high-resolution screens; drop them in with the same names (.svg wins over .png).

### Design export (for building the remaining pages)
The team's Figma export ("Web design - Project Alpaca.zip") contains full-page renders (`Home.jpg`, `Directory - Home.jpg`, `Directory - Profile.jpg`, `Directory - Projects.jpg`) and PDFs of **About, Contact, Get Involved, Programs - Flagship, Programs - Community**. The PDFs embed the original full-resolution photos (extract with `pdfimages -j file.pdf out`). Keep that zip; it's the reference for the pages still to rebuild, and lets them be built without Figma lookups.

**Footer:** includes the Candid "Platinum Transparency 2023" badge (`public/images/candid-platinum-2023.png`), as in the design.

## 8c. Programs – Flagship page

**Design source:** "Programs - Flagship" in the Figma export (PDF). Built in `Flagship.jsx`, styled in the "Programs – Flagship" block of `styles.css` (scoped to `.root-flag`). White page with a Night Sky hero and "Support Our Work" band.

**Checked against the design render:** every section starts within ~4px of the design at 1440px wide (measured with the real Merriweather and Public Sans fonts), and each section was compared side by side.

Sections: hero (nav, "Flagship Program", photo, intro, Apply button); sticky tabs (Overview / Programs / Instructing Team) that jump to their sections and highlight the one on screen; Intensive Career Prep + three facts; Holistic Approach carousel (swipe/scroll sideways); Curriculum accordion; Sample Classes; Projects; Meet the Alpacees (live from the directory data); Core Instructors; Alpacas (Mentors); partner logos; Support Our Work; Newsletter; Footer.

**Content to fill in** (all at the top of `Flagship.jsx`):
- `APPLY_URL`: where "Apply to Cohort 6" goes: the cohort application Google Form (opens in a new tab). Make sure the form is open to anyone (not restricted to projectalpaca.org accounts). Update the link and button text for each new cohort.
- `MODULES`: the design only writes out **Foundations**; **Relationship** and **Mastery** show "Module details coming soon." until their text is added.
- `FEATURED`: the three students in "Meet the Alpacees" (the design's three). Their role and tags come from the directory sheet, so they show real data rather than the design's sample text.
- "See Projects" points to this page until a Projects page exists.

**Photos** are the full-resolution originals from the design export, in `public/images/flagship/` (hero, intensive, community, programming, mentorship, networking, capstone, curriculum, classes, projects, catherine-man, zsoreign-sanchez, marissa-fleming, alpacas, support). The Zsoreign and Marissa originals are only ~500px, slightly small for their 600px-tall cards.

## 8d. Programs – Community page

**Design source:** "Programs - Community" in the Figma export (PDF). Built in `CommunityPrograms.jsx` using the Flagship page's building blocks (`fl-*` classes) recolored via `.root-comm` (Mellow Yellow `#564538` + Sky `#37E3FC`, cream page, white tab strip), plus `cm-*` classes in the "Programs – Community" block of `styles.css`.

**Checked against the design render:** every section starts at the design's exact position at 1440px (real fonts loaded); photo crops were matched to the design by search (the "Partner with Us" photo is pre-cropped to the design's 1.48x zoom).

Sections: hero ("Community Programs", photo, intro, "Become Our Partners" → Get Involved); tabs that jump to each program; one section per program (text + photo) with a row of partner organizations (logo, name, description); "Partner with Us" band (Contact → /contact); Newsletter; Footer.

**Content** lives in `PROGRAMS` at the top of `CommunityPrograms.jsx` (one entry per program: tab label, title, lead, paragraphs, photo, partners). Adding a program adds its tab automatically.
- **"Resume Review" is placeholder content in the design:** it repeats the Equitable AI text, photo and partners word for word. Replace its `paras`, `image` and `partners` with the real Resume Review content.
- Two small corrections from the design text: "strength" → "strengthen" in the intro, and the kudos names use the directory's spellings (Jericho **Faderon**, Kayla **Greene**).

**Images:** `public/images/community/` (hero, equitable-ai, partner) and `public/images/community/partners/` (atlas, harlem-childrens-zone, fedcap; transparent PNGs extracted from the design export).

## 8e. Get Involved page

**Design source:** "Get Involved" in the Figma export (PDF). Built in `GetInvolved.jsx` with the program-page building blocks (`fl-*`) recolored via `.root-gi` (Purple `#5B2D53` hero, Lime title, cream page), plus `gi-*` classes in the "Get Involved" block of `styles.css`.

**Checked against the design render:** every section starts within 1–3px of the design at 1440px (real fonts loaded); compared side by side section by section.

Sections: hero ("Be a Force for Good", group photo, intro); tabs (Alpacas / Volunteers / Partners); Alpacas (Mentors) + "Two Ways to Get Involved" (1-on-1 Mentor with its expectations list; Class Facilitator / Workshop Instructor) + "Meet our Mentors"; Volunteers + "Meet our Volunteers" + six volunteer roles; Corporate & Nonprofit Partners + "Ways to Create Impacts" (four cards); Support Our Work; Newsletter; Footer.

**Placeholders to replace** (all at the top of `GetInvolved.jsx`):
- `LINKS`: "Apply to be a Mentor" and "Become a Volunteer" email hello@ until there are forms; "Download Partnership Deck" emails partnership@ until the deck PDF is linked.
- `MENTORS` / `VOLUNTEERS`: the design shows the same three people (Catherine Man, Claire Igot, Donna Meredith) in both, with "Job at Company" job lines. The site leaves out the "Job at Company" text; add real `job` values and real mentors/volunteers.
- Photos repeat in the design (the laptop photo appears four times, the lounge photo on all four impact cards). Swap in real photos as they're chosen.
- The design's tab says "Vounteers"; the site spells it "Volunteers".

**Images:** reuses the Flagship photos (`images/flagship/`: alpacas, curriculum, community, support, catherine-man) and adds `images/people/claire-igot.jpg` (cropped to the design's framing) and `images/people/donna-meredith.jpg`.

## 8f. About page

**Design source:** "About" in the Figma export (PDF; the longer of the two About frames). Built in `About.jsx` (`ab-*` classes in the "About" block of `styles.css`), reusing the program-page buttons, person cards and Support band. The nav uses `<Nav overlay dark />`: the floating layout with dark text and the dark logo.

**Checked against the design render:** every section starts within 1–6px of the design at 1440px (real fonts loaded); photo crops matched to the design by search.

Sections: hero ("About" / "Empower public college students" / Donate); Our Mission; Why "Project Alpaca"?; Our History (clickable timeline); Meet the Team: Board of Directors + Junior Board; News; Support Our Work; Newsletter; Footer.

**Content to confirm / replace** (top of `About.jsx`):
- `HISTORY`: the design writes out **2019 – Pilot Cohort** only (its timeline has six dots). The 2020/2021/2025 entries come from the site's earlier About page and are marked `unconfirmed`; confirm, correct or remove them, and add the remaining milestones. Each can have its own photo (all use the pilot photo for now).
- `BOARD`: role lines for five members and all job lines are placeholders in the design ("Role at PA", "Job at Company"), so they're left out until real values are added.
- `JUNIOR_BOARD`: the design repeats the Board here as placeholder; replace with the graduated Alpacees who serve on it.
- `NEWS`: "Read" links to the Citizens Committee for NYC homepage; link the actual announcement when available.

**Images:** `public/images/about/` (mission, why-alpaca (cropped to the design), pilot-cohort, news-citizens-committee) and `public/images/people/` (fred-butterweck, mac-exume, jenna-scherma, courtney-leggett, plus claire-igot / donna-meredith from Get Involved).

## 8g. Contact page

**Design source:** "Contact" in the Figma export (PDF). Built in `Contact.jsx` (`ct-*` classes in the "Contact" block of `styles.css`); dark floating nav, cream page, Support band, Newsletter, Footer.

**Checked against the design render:** every form field, the Send button and the Press Kit card sit at the design's exact positions (0–2px at 1440px, real fonts loaded).

**How the form works:** there's no server, so **Send opens the visitor's email app** with a pre-filled message: subject "<Contact reason> – <name>", the message, then their details. "Partnership opportunity" goes to partnership@projectalpaca.org; every other reason to hello@. First name, Email (must be a valid address) and Message are required; the browser blocks sending until they're filled. A confirmation line appears after Send. To receive submissions directly instead (no email app needed), connect a form service such as Formspree and point the form at it.
- Contact reasons are in `REASONS` at the top of `Contact.jsx` (label + which inbox it goes to).
- **Difference from the design:** the design shows a dropdown arrow on every field (a component leftover); the site shows it only on "Contact reason", the one real dropdown.
- **Press Kit "Download"** emails hello@ asking for the kit until a press kit file exists (`PRESS_KIT_URL`).

## 9. Profile page

**Design source:** same Figma file, frame **Directory - Profile** (`1158:7075`).

Clicking a card opens that person's profile (in-app state, not a separate URL; see section 14). The page scrolls to the top when a profile opens and when going back.

- **Left:** a 600px rounded photo (cropped toward the face; `Photo Position` overrides), then **Education** (school, tidied grad year, major) and **Experience** (company + role; only shown when there's a company, so the role isn't repeated).
- **Right:** "Flagship Program • Cohort N", name, "role at company", skill tags in the category color, then:
  - **Contact** (lime button) - emails partnership@projectalpaca.org with the subject "Introduction to <name>", since Project Alpaca makes the introduction. Works for everyone, LinkedIn or not.
  - **Download Resume** - their `Resume Link`; only shown if they have one. Turns green on hover without moving.
  - **Link icons** - LinkedIn, GitHub, website, and Instagram or YouTube, whichever the person has.
- **About** - their `Bio`, or "Bio coming soon."
- **Project Showcase** - kept per Michelle; currently shows "Project write-up and gallery coming soon." The sheet's **Project Showcase** tab already has 10 projects (name, cohort, team members, description, GitHub, Loom, presentation, winner, photo). Wiring it in needs (a) the sharing fix in section 6 and (b) team-member names that match the main tab: some are misspelled or shortened ("Javier Hernadez", "Osa", "Edwin", "Amy Kaur", "MD Mujakkir", "Oscar Holgun").
- **Recommendations** - the person's own `Testimonial about Project Alpaca`; hidden if they have none. (The Figma shows a staff recommendation; that would need a new column.)
- **"Interested in hiring <first name>?"** box with the same Contact button.
- **Other Alpacees with similar skills** - three people from the same category.
- **Removed per Michelle:** the "Open to opportunities" badge.

---

## 10. Common tasks

### Add or update a student's photo
1. Save the image as `firstname-lastname.<ext>`, **lowercase with hyphens**, matching `slugify(their sheet Name)`. Keep the real extension (`.jpg`, `.png`, `.jpeg`).
2. Put it in `public/photos/`.
3. Add one line to `PHOTO_FILES` in `sheet.js`: `"firstname-lastname":"jpg",`
4. Commit and push.

### Hide a non-completer
Put `No` in their `Completion` cell. They disappear on the next load; remove the `No` and they reappear.

### Set someone's category by hand
Add a `Category` column (header exactly `Category`; column Z, see section 5). Put one of `Software Engineering`, `Data`, `Design`, `Business`, `Marketing` (case doesn't matter; `SWE` / `Software` also work). It overrides automatic sorting for that person; blank keeps automatic sorting. First use: MJ (MD Mujjakkir) -> `Software Engineering`.

### Add a hover "action shot"
Add an `Action Shot Link` column (column AA). On desktop, that photo fades in over the headshot when someone hovers the card; name, role and tags stay on top. Phones have no hover, so they always show the headshot. Blank = no change.

**Use repo files, not Drive links** (section 7): put action shots in `public/photos/action/` and type the path in the cell, e.g. `action/kurk-fisher.jpg`. Drive links are accepted but may not load in every browser. (Michelle suggested hosting these in the Drive photo folder; repo files are the reliable route.)

### Adjust a photo's crop
Put a CSS `object-position` value in their `Photo Position` cell (e.g. `center top`, `center 40%`, `right center`). It applies to the card, the profile photo, and the "Other Alpacees" thumbnails. Defaults: cards and profile `center 22%`, thumbnails `center 12%` (biased toward faces).

### Add a student
Add a row with at least a `Name` and fill in the public columns you have. Add their photo as above. They appear on the next load.

### Change the sub-buckets
Edit `SUBCATEGORIES` in `alpacees-directory-final.jsx`: each entry is `["Label", /keyword pattern/]` under its category. Commit and push.

### Change footer or header links
Edit `DirFooter` / `DirHeader` in `alpacees-directory-final.jsx`. The marketing pages use `Nav` from the same file; their `Footer` and `Newsletter` simply render `DirFooter` and `DirNewsletter`, so footer edits apply everywhere.

---

## 11. Fonts

- **GT America Compressed** (Medium 500, Black 900) - self-hosted from `public/fonts/` via `@font-face` in `styles.css` and preloaded in `index.html`. Used for names, headings, labels, buttons and nav. Only the Compressed cut is available, so it isn't used for paragraphs. It's a commercial typeface: **confirm the web license covers this domain.**
- **Merriweather** (Google Fonts) - the main text font on the directory and profiles (intro, filters, card text, body copy, quotes), per the Studio Haven design.
- **Public Sans** (Google Fonts) - small UI text (e.g. the footer's legal line) and the marketing pages.
- Set as CSS variables: `--font-display`, `--font-serif`, `--font-body`.

---

## 12. Deployment and local development

- Cloudflare Pages rebuilds the site in two situations, with no manual deploy step:
  - **a push to `main`** (code changes), and
  - **a Publish in the Sanity Studio** (content changes): Sanity calls a Cloudflare deploy hook (see "Content management").
- Cloudflare's build command is **`npm run build`**, which fetches Sanity content first. Don't change it to `vite build`, or content updates stop reaching the site.
- **SPA fallback:** `public/_redirects` contains `/*  /index.html  200`, so opening a deep link (e.g. `/directory`) directly doesn't 404.
- `html, body { margin:0 }` is set globally so full-width sections reach the screen edges.

```
npm install            # first time only
npm run dev            # local dev server (usually http://localhost:5173)
npm run content        # pull the latest published Sanity content for local dev
npm run build          # production build; run before committing
npm run preview        # preview the production build locally
```
- Files added to `public/` while `npm run dev` is running aren't picked up until you **restart the dev server**.
- **macOS dev-server fix (`vite.config.js`):** page files sit in the project root and macOS ignores capitalization, so loading `/about` directly used to make Vite serve `About.jsx`'s source. A small plugin now sends every browser page request to `index.html`. Production is unaffected. Changes to `vite.config.js` need a dev-server restart.
- The **website** and the **Studio** are separate projects with separate commands: run website commands from the repo root, Studio commands from `studio/`.
- **Contributing:** branch naming, commit style and the pull request checklist are in [CONTRIBUTING.md](CONTRIBUTING.md).
- **Run `git pull` before starting work:** a nightly GitHub Action commits content snapshots to `main` (see "Nightly content snapshot"), so your local copy may be behind.
- If `npm run dev` fails with `Cannot find module @rollup/rollup-darwin-arm64`, run `rm -rf node_modules package-lock.json && npm install`. Before pushing the regenerated lockfile, check `grep -c "rollup-linux-x64-gnu" package-lock.json` prints a number above 0 (Cloudflare builds on Linux).

---

## 13. Routing

| Path | Renders |
|---|---|
| `/directory` | The Alpacee directory and profiles (also the catch-all `*`) |
| `/` | Homepage, built to the Figma "Home" frame (section 8b) |
| `/flagship` | Programs – Flagship, built to the design (section 8c) |
| `/community-programs` | Programs – Community, built to the design (section 8d) |
| `/get-involved` | Get Involved, built to the design (section 8e) |
| `/about` | About, built to the design (section 8f) |
| `/contact` | Contact, built to the design (section 8g) |
| `/donate` | Shared brand style (no design in the export); includes the "What does your donation go towards?" breakdown |
| `/projects` | Stub ("coming soon"); Michelle is designing the Projects page |

`ScrollToTop` in `App.jsx` resets scroll on every route change.

---

## 14. Decisions and deviations from the Figma

- **Removed per Michelle:** "Open to opportunities" (filter, card badge, profile badge).
- **Added:** search by name.
- **Colors:** the Figma only defines tag colors for Design, Project management and Technical; the other categories use palette colors Michelle approved.
- **Contact** emails partnership@ (Michelle's call) instead of opening LinkedIn.
- **Button hovers:** outlined buttons fill with **Lime** `#63FFA1`; Lime (green) buttons turn **soft lilac** `#E9D5F0` (a light tint of brand Purple, chosen by the team); only colors change, with a 0.2s fade. Set via `--lime-hover` (and `--lime`) in the "Button hovers" block of `styles.css`.
- **Recommendations** shows the person's own testimonial (the only quote data available).
- **Not in the Figma, styled with its tokens:** pagination states, the search box, filter dropdown menus, empty-results message.
- **Profiles are in-app state, not URLs** - no shareable `/alpacee/:id` links yet. A clean follow-up if wanted.
- **Logo:** transparent SVGs from the Figma export: `public/logo-dark.svg` (light backgrounds) and `public/logo-white.svg` (dark backgrounds: footer, homepage hero). `LogoImage` takes a `white` prop.

---

## 15. Open items

**Waiting on the team (Michelle):**
- **Sheet sharing fix** (section 6) - the most important open item.
- **Sanity nonprofit plan:** apply (signed in as hello@) before the Growth trial ends (~Nov 11, 2026); Sanity reviews within 14 business days. Needs Project ID `9uh7bydp`. Form linked at sanity.io/docs/non-profit-plan.
- **hello@ Sanity password:** change it (it was shared in Slack), store it in 1Password, delete the Slack message.
- **Editors:** who should get Studio access (invite as **Editor**).
- **Placeholder content** to replace in the Studio: Junior Board (repeats the Board), Mentors and Volunteers (show staff), the sample Summer Picnic event, board role/job lines.
- **History timeline:** confirm the 2020/2021/2025 entries (marked `unconfirmed` in `About.jsx`) and supply the remaining milestones.
- **Donations:** which payment platform, and whether a Donate page design exists.
- **Sub-buckets** for each category.
- **MailerLite** details to connect the newsletter form.
- **Projects page** design (then point "See Projects" at it).
- **Action shots** - photos to add (section 10).

**Ready to build once unblocked:**
- **Project Showcase** on profiles from the sheet's Project Showcase tab (needs the sharing fix and name cleanup).
- **Category / Action Shot / Photo Position columns** - the code is ready; the columns need adding (section 5).

**Worth confirming:**
- **Repo is public** with real student names - confirm that's intentional.
- **GT America web license** covers the live domain.
- **Subdomain:** `alpacees.projectalpaca.org` was the original plan: add it under Cloudflare Pages → Custom domains, plus a DNS CNAME `alpacees` → `project-alpaca.pages.dev` wherever projectalpaca.org's DNS is managed. Decide whether that address should open the homepage or the directory.
- **Inboxes:** hello@, partnership@ and giving@ are live and monitored.

---

## 16. Quick reference

| I want to... | Do this |
|---|---|
| Add a photo | Drop `name-slug.ext` in `public/photos/`, add a line to `PHOTO_FILES`, commit |
| Hide a non-completer | `No` in their `Completion` cell |
| Fix someone's filter category | Their `Category` cell (column Z) |
| Add a hover action shot | File in `public/photos/action/`, path in their `Action Shot Link` cell |
| Nudge a photo's crop | CSS value in their `Photo Position` cell |
| Change the sub-buckets | `SUBCATEGORIES` in `alpacees-directory-final.jsx` |
| Change category colors | `CAT_COLORS` in `alpacees-directory-final.jsx` |
| Change directory header/footer links | `DirHeader` / `DirFooter` in `alpacees-directory-final.jsx` |
| A text value shows blank | Google's type guessing (section 4); fixed by the public-sheet formula |
| Fix a "wrong data" issue | Almost always the sheet: check the exact header and cell value |
| Edit events, news, board, mentors… | https://projectalpaca.sanity.studio → edit → **Publish** (live in ~1–2 min) |
| Give someone editing access | sanity.io/manage → Project Alpaca → Members → Invite (role: Editor) |
| See Sanity content in local dev | `npm run content`, then refresh (otherwise you see the nightly snapshot) |
| See what content changed and when | `git log -p snapshot/` or the repo's commit history |
| Refresh the snapshot now | GitHub → Actions → Sanity content snapshot → Run workflow |
| Publishing didn't update the site | See "Troubleshooting" in the Content management section |

### Donate page: donation breakdown
The "What does your donation go towards?" graphic on `/donate` is built in code (`DonationBreakdown` in `Donate.jsx`), not an image, so it stays sharp and is readable by screen readers. To update it, edit the four entries in `BREAKDOWN` (percentage, label, color); the donut and legend redraw automatically. Percentages should add up to 100. The Donate page itself has no design in the export yet, and the donation form isn't connected to a payment platform (pending the team's choice).

### Browser tab icon (favicon)
Set in `index.html`. Files in `public/`: `favicon.svg` (modern browsers), `favicon-32.png` and `favicon-192.png` (Safari and others that don't use SVG icons), `apple-touch-icon.png` (iPhone home screen). They show the alpaca from the logo (its three shapes, without the circular lettering, which is unreadable at tab size) on a rounded wool tile so it's visible on both light and dark browser tabs.

### Browser tab titles
Each page sets its tab title as "Project Alpaca - <Page>": `TITLES` in `App.jsx` (Flagship Program, Community Programs, Get Involved, About, Contact, Donate, Projects; the homepage is just "Project Alpaca"). The directory sets its own: "Project Alpaca - Alpacee Directory", or "Project Alpaca - <Name>" while a profile is open. Add new pages to `TITLES`.

## Content management (Sanity CMS)

Events, news and people are edited in **Sanity**, a hosted CMS. Everything else is still in the code.

**Where editors go:** https://projectalpaca.sanity.studio (log in, edit, click **Publish**). Edits are saved as drafts automatically; nothing reaches the website until **Publish**. Each publish rebuilds the site, live in about 1–2 minutes.

### Accounts and ownership

| What | Details |
|---|---|
| Sanity organization | **Project Alpaca** (ID `o8u21bong`) |
| Sanity project | **Project Alpaca** (ID `9uh7bydp`), dataset `production` (public read; editing requires login) |
| Owner account | hello@projectalpaca.org (password kept by Michelle / 1Password) |
| Plan | Growth trial until ~Nov 11, 2026 → apply for the free **nonprofit plan** (see Open items) |
| Studio address | https://projectalpaca.sanity.studio (app ID `pgec2kfga8hssg1k2yjj6qd3`, saved in `studio/sanity.cli.js`) |
| Members | Manage at sanity.io/manage → Project Alpaca → Members. Editors get the **Editor** role; Administrator only for people who manage settings. |

Each Sanity login method (Google, GitHub, email) is a separate account; invite the exact account a person will log in with.

### How publishing updates the site

**Publish** in the Studio → Sanity webhook **"Rebuild website"** (sanity.io/manage → Project Alpaca → API → Webhooks; dataset `production`; triggers on create/update/delete; filter `_type in ["event", "newsItem", "person", "teamLists"]`; drafts off) → calls the Cloudflare **deploy hook "Sanity publish"** (Cloudflare → project-alpaca → Settings → Builds → Deploy hooks, branch `main`) → Cloudflare runs `npm run build`, which fetches the published content → site live.

The deploy hook URL is a secret (anyone with it can trigger rebuilds). To rotate it: delete the hook in Cloudflare, create a new one, paste its URL into the Sanity webhook.

Content edits don't go through GitHub: content lives in Sanity, code lives in GitHub, and each Cloudflare build combines the latest of both.

### Nightly content snapshot

`.github/workflows/sanity-snapshot.yml` (a GitHub Action) runs daily at 07:00 UTC and on demand (GitHub → **Actions** → **Sanity content snapshot** → **Run workflow**). It fetches the published content and commits `snapshot/sanity-content.json` **only when something changed**, as `github-actions[bot]`, with `[CF-Pages-Skip]` in the message so Cloudflare doesn't rebuild for it. This gives:
- **A history of content edits** in the repo (`git log snapshot/`).
- **An up-to-date fallback:** `cms.js` uses fresh build-time content first, then this snapshot, then the pages' built-in lists. Local dev without `npm run content` also shows the snapshot.

If Sanity is unreachable, the run fails (GitHub emails the repo owner) and nothing is committed; the next night retries. Note that snapshot photos are still served from Sanity's image CDN.

> **Heads-up for developers: a bot commits to `main`.** Because the Action pushes snapshot commits on its own, your local copy can fall behind GitHub. **Run `git pull` before you start working.** If a `git push` is rejected ("Updates were rejected… fetch first"), run `git pull`, then push again. The snapshot only touches `snapshot/sanity-content.json`, so it never conflicts with code changes.

**Pushing past the branch protection:** `main` is protected by the **"Protect main"** ruleset (see "Branch protection" below), which only lets the **repository admin** push directly. So the Action pushes with **`SNAPSHOT_TOKEN`**, a fine-grained personal access token from the admin's account, stored as a repository secret:
- Create it at GitHub → your profile → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**: repository access **Only select repositories → project-alpaca**; repository permissions **Contents: Read and write** (nothing else).
- Save it in the repo at **Settings → Secrets and variables → Actions → New repository secret**, named `SNAPSHOT_TOKEN`.
- **It expires** (GitHub caps fine-grained tokens at about a year). When it does, the nightly run fails with a 403 and GitHub emails you: generate a new token and update the secret. If the admin changes, the new admin creates their own token.

Without the secret, the workflow falls back to GitHub's built-in Actions token, which is blocked by the ruleset.

### Branch protection

`main` is protected by the repository ruleset **"Protect main"** (Settings → Rules → Rulesets), applied to the default branch:
- **Pull requests required** to change `main` (1 approval), with **Copilot code review** requested automatically.
- **Restrict deletions** and **block force pushes:** `main` can't be deleted or have its history rewritten.
- **Bypass:** the **Repository admin** role, so the maintainer can still push directly; the nightly snapshot Action pushes with the admin's token (above).

Contributors without write access already work through forks and pull requests, which only the admin can merge.

**The editing dashboard ("Studio")** lives in `studio/` (its own packages; needs Node 22.12+). Locally: `cd studio && npm install && npm run dev` → http://localhost:3333. It has four sections: Events, News, People, and Team lists (Board of Directors, Junior Board, Mentors, Volunteers, Core Instructors; each a drag-to-reorder list of People, so a person is entered once and can appear in several lists). Photos have a focal-point tool ("hotspot") that the site uses to frame them.

**How the site gets the content:** `npm run build` first runs `scripts/fetch-content.mjs`, which reads the *published* content from Sanity and saves it to `content/sanity-content.json` (not committed). Pages read it through `cms.js`:
- Home: events (past events hide automatically unless "Keep showing after the date" is on; RSVP uses the event's link, or emails hello@)
- About: Board, Junior Board (hidden if empty), News (newest first)
- Get Involved: Mentors, Volunteers (hidden if empty)
- Flagship: Core Instructors

**If Sanity can't be reached**, the build prints a warning and the pages use their built-in lists (`EVENTS`, `BOARD`, `NEWS`, `MENTORS`, … at the top of each page file). The site never breaks because of Sanity. In local dev (`npm run dev`), run `npm run content` once to pull Sanity's latest content; without it you see the built-in lists.

**Importing:** `studio/scripts/import-current-content.js` copied the site's original events, news and people into Sanity (run once on Oct 16, 2026). Re-running it never overwrites existing documents.

### Changing the Studio (developers)

The Studio's forms are defined in `studio/schemaTypes/` (`event.js`, `newsItem.js`, `person.js`, `teamLists.js`) and its menu in `studio/structure.js`. After changing them:

```
cd studio
npm run dev        # check locally at http://localhost:3333
npm run deploy     # publish to projectalpaca.sanity.studio
```
Then commit. If you add a field the website should show, also add it to the query and `transform()` in `scripts/fetch-content.mjs` and use it in the page. Sanity is pinned to **6.17.0** (`studio/package.json`); update deliberately, not via `npm audit fix --force`.

### Troubleshooting

| Problem | Check |
|---|---|
| Published, but the site didn't change | Cloudflare → Deployments: did a new deployment start? If not, open the Sanity webhook and check its delivery attempts. If the deployment ran, open its build log and look for "Sanity content saved…". |
| Build log says "Couldn't fetch content from Sanity" | Sanity was unreachable; the site was built with the built-in lists. Re-run the deployment (Cloudflare → Deployments → Retry). |
| Edit visible in the Studio but not on the site | It's still a draft (orange dot in the list): click **Publish**. |
| Someone can't see the project in the Studio | They logged in with a different method than the one invited, or haven't accepted the invite. |
| A section disappeared | Empty team lists hide their section (Junior Board, Volunteers, Mentors); add people back in **Team lists**. |
| `npm run content` says "Missing script" | You're in `studio/`; run it from the repo root. |
| `git push` rejected ("fetch first") | The nightly snapshot Action committed since your last pull: `git pull`, then push again. |
| Snapshot Action fails with 403 | `SNAPSHOT_TOKEN` is missing or expired: create a new fine-grained token (see "Nightly content snapshot") and update the repository secret. |
| Snapshot Action fails with "Couldn't fetch content from Sanity" | Sanity was briefly unreachable; it retries the next night, or re-run it by hand. |

