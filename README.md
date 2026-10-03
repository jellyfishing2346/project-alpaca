# Project Alpaca — Alpacee Directory

A public web directory that showcases Project Alpaca's students ("Alpacees") — under-resourced NYC college students entering tech — so mentors, recruiters, and employers can browse profiles and reach out.

**Live:** https://project-alpaca.pages.dev

---

## What it does

- Shows every completed Alpacee as a photo card with their name, role, and skills.
- Clicking a card opens a full profile (education, experience, about, project showcase, contact + résumé).
- Visitors can **search by name** and **filter by category** (Software Engineering, Data, Design, Business, Marketing) using color-coded dropdowns.
- The design follows Studio Haven's Figma ("Web design - Project Alpaca").
- The roster is pulled **live from a Google Sheet** — update the sheet, and the site updates on the next load.

## How it's built

- **React + Vite**, deployed on **Cloudflare Pages** (auto-deploys on every push to `main`).
- Roster data comes from a Google Sheet. The site only reads and displays public columns, but the browser downloads the whole tab it points to, so that tab must contain **only public data**. See DOCS.md section 6 before changing the sheet setup.
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
- **Add a photo** → drop the image in `public/photos/` named to match their sheet Name (lowercase, hyphens), add a line to `PHOTO_FILES` in `sheet.js`, and commit.
- **Fix someone's category** → their `Category` cell (once that column is added; see DOCS.md).

## More detail

See **[DOCS.md](./DOCS.md)** for full technical documentation — architecture, the photo system, data flow, deployment, common tasks, and open items.

---

_Built as part of the Project Alpaca website redesign. The marketing site (Home, About, Donate, etc.) is maintained separately in Framer; this repo is the Alpacee Directory._
