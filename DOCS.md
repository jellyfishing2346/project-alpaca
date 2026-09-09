# Technical Documentation — Alpacee Directory

Technical reference for the Project Alpaca **Alpacee Directory**. The public-facing
overview lives in [`README.md`](./README.md); this file covers how the app is built, run,
and deployed, plus the data-handling rules everyone working on it must follow.

---

## 1. Overview & architecture

The directory is a **static React site**. There is no backend server and no database.

- The roster is a small set of read-only records (~75 people, plain text).
- Nothing is written back from the site — no logins, no user accounts, no forms saving data.
- Because of that, the whole thing can be served as static files from a CDN.

Data flow (target state):

```
Google Sheet (source of truth)  ──►  build/fetch  ──►  static React site  ──►  CDN (Cloudflare Pages)
   (staff edit here)                                     (this repo)
```

Staff update the Google Sheet; the site reflects those changes with no code edits.

> The public marketing site is a **separate** project (Framer). This repo is **only the
> directory**, which can live on its own subdomain (e.g. `alpacees.projectalpaca.org`)
> and be linked from the marketing site.

---

## 2. Tech stack

| Layer | Choice | Notes |
|-------|--------|-------|
| UI | React 18 | Function components + hooks |
| Build | Vite 5 | `@vitejs/plugin-react` |
| Styling | CSS (currently inline in the component) | Can move to `styles.css` / CSS modules |
| Data source | Google Sheets | Published CSV or the Sheets API (see §5) |
| Hosting | Cloudflare Pages (recommended) | Free tier; Vercel / Netlify / GitHub Pages also work |

Effective running cost is **$0/month**; the only real expense is a domain (~$10–15/yr).

---

## 3. Project structure

**Current (flat):**

```
project-alpaca/
├── index.html                    # Vite entry HTML (has <div id="root">)
├── main.jsx                      # mounts <App/> from the component below
├── alpacees-directory-final.jsx  # the whole app: data + components + styles inline
├── package.json
├── package-lock.json
├── project-alpaca-logo.png
├── dist/                         # build output (should NOT be committed — see §8)
├── .gitignore
├── README.md
└── DOCS.md
```

**Recommended (once it grows):** split the single component into a normal `src/` tree.

```
src/
├── main.jsx
├── App.jsx                       # layout + grid ↔ profile view
├── data/alpacees.js              # roster, or the Google Sheet loader
├── components/
│   ├── Nav.jsx  Sidebar.jsx  AlpaceeCard.jsx  AlpaceeProfile.jsx
└── styles.css
```

---

## 4. Data model (public-safe fields only)

Each Alpacee record uses only fields that are safe to show publicly:

| Field | Notes |
|-------|-------|
| `name` | Display name |
| `cohort` | 1–5 (2019 → present) |
| `school`, `major`, `grad` | Grad year is free-text (e.g. "Fall 2023") — display as-is, don't parse as a date |
| `role`, `company` | Current role, optional |
| `linkedin`, `portfolio` | Optional links |
| `quote` | Short testimonial / bio |
| `skills` | *Not yet in the sheet* — currently inferred from major/role as a placeholder |

---

## 5. Data source & the Google Sheet

Two ways to read the sheet:

1. **Published CSV** (simplest) — File → Share → Publish to web → CSV, then `fetch()` it.
   The catch: publishing exposes the whole tab publicly, so **only publish a tab that
   contains public-safe columns.**
2. **Google Sheets API** (better control) — read a private sheet with an API key or
   service account and select specific columns. Preferred, because it lets you enforce
   the public/private split at the source.

**Refresh options:** rebuild on a schedule (GitHub Action) or on a sheet-edit webhook for
build-time data, **or** fetch the CSV client-side for always-live data (simpler, but
exposes the CSV endpoint). Build-time is recommended for a public directory.

**Recommended setup:** keep a dedicated **"public" tab** in the sheet holding only the
safe columns, and point the site at that tab.

---

## 6. ⚠️ Data & privacy rules (required reading)

The source spreadsheet contains fields that must **never** reach the site or the repo:

- **Personal email addresses**
- **Demographic data:** race, Hispanic origin, immigrant status, first-generation status

These are internal reporting fields for grants/metrics — not website content.

**Rules:**

1. **Never commit the real full roster.** Only public-safe columns belong anywhere in
   this repo or on the site.
2. Pull data through a **public-only tab or column selection** — never `SELECT *` the
   whole sheet.
3. Keep the full sheet (with the sensitive columns) **private/locked down**.
4. **Repo visibility:** this repo is currently **public**, and it contains the real
   names/schools. Until the "public vs. gated directory" question is decided, consider
   keeping the repo **private**, or confirm with the team that publishing the roster is
   intended.

---

## 7. Local development

```bash
npm install       # install deps
npm run dev        # start the dev server (http://localhost:5173)
npm run build      # production build → dist/
npm run preview    # preview the production build locally
```

Entry point: `index.html` → `main.jsx` → the `App` component.

---

## 8. Deployment (Cloudflare Pages)

1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** →
   pick this repo.
2. Build settings:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
3. Every push to `main` auto-deploys; pull requests get preview URLs.
4. Add the custom domain/subdomain in the Pages project settings.

Because Cloudflare builds `dist` for you, **`dist/` should be git-ignored, not committed.**
Add it to `.gitignore` and remove the committed copy:

```gitignore
node_modules/
dist/
# local data — never commit
*.local.csv
/data/private/
```

---

## 9. Known cleanup / TODO

- [ ] Add `dist/` to `.gitignore` and remove the committed build output
- [ ] Add a `vite.config.js` with `@vitejs/plugin-react` (enables Fast Refresh)
- [ ] Move source into `src/`; rename `alpacees-directory-final.jsx` → `App.jsx`
- [ ] Add a repo description + topics on GitHub
- [ ] Decide repo visibility (public vs private) per §6
- [ ] Wire the live Google Sheet data source (public columns only)
- [ ] Add sheet columns the design needs: **Skills**, **Open-to-opportunities status**,
      **project** (name + images), **photos**
- [ ] Final visual-design pass (see Figma `Visual Design – Desktop`)
- [ ] Reconcile duplicate/incomplete roster rows (e.g. "Fahim" vs "Fahim Sarker")

---

*This doc could also be named `CONTRIBUTING.md` if you want GitHub to surface it on pull
requests. Keep it updated as the structure and data source evolve.*