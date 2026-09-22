# Project Alpaca — Alpacee Directory

A public web directory that showcases Project Alpaca's students ("Alpacees") — under-resourced NYC college students entering tech — so mentors, recruiters, and employers can browse profiles and reach out.

**Live:** https://project-alpaca.pages.dev

---

## What it does

- Shows every completed Alpacee as a photo card with their name, role, and skills.
- Clicking a card opens a full profile (education, experience, about, contact + résumé links).
- Visitors can **search by name**, **filter by category** (Software Engineering, Data, Design, Business, Marketing), and toggle **"Open to opportunities."**
- The roster is pulled **live from a Google Sheet** — update the sheet, and the site updates on the next load.

## How it's built

- **React + Vite**, deployed on **Cloudflare Pages** (auto-deploys on every push to `main`).
- Roster data comes from a Google Sheet (only public-safe columns are ever read — email and demographic data are never exposed).
- Student headshots live in `public/photos/` and are matched to people automatically by name.

## Running it locally

```
npm install     # first time only
npm run dev      # start the local dev server
npm run build    # production build
```

## Editing content

Most content lives in the **Google Sheet**, not the code:

- **Add / edit a student** → edit their row in the sheet.
- **Hide a non-completer** → put `No` in their `Completion` cell.
- **Mark someone not open to work** → put `No` in their `Open to Opportunities` cell.
- **Add a photo** → drop the image in `public/photos/` named to match their sheet Name (lowercase, hyphens), add a line to `PHOTO_FILES` in `sheet.js`, and commit.

## More detail

See **[DOCS.md](./DOCS.md)** for full technical documentation — architecture, the photo system, data flow, deployment, common tasks, and open items.

---

_Built as part of the Project Alpaca website redesign. The marketing site (Home, About, Donate, etc.) is maintained separately in Framer; this repo is the Alpacee Directory._
