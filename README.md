# Alpacee Directory

Searchable directory of Project Alpaca alumni ("Alpacees"). Part of the Project Alpaca
website redesign.

> 🚧 **Rough draft / work in progress** — prototyping the directory experience from the
> team's Figma (`Web design – Project Alpaca`).

## About Project Alpaca

Project Alpaca is a career-prep nonprofit offering multi-layered support to
under-resourced NYC college students entering the tech industry.

## What this is

- A React app that renders a searchable, filterable directory of Alpacees by cohort,
  school, and (eventually) skills.
- Roster data is intended to load from a **Google Sheet**, so non-technical staff can
  update it without touching code.
- The public marketing site is separate (Framer). **This repo is only the directory.**

## ⚠️ Data & privacy — read before committing anything

The source spreadsheet contains personal and sensitive fields that must **never** be
published to the site or committed to this repo:

- Personal email addresses
- Demographic data: race, Hispanic origin, immigrant status, first-generation status

These are internal reporting fields for grants/metrics — not website content.

**Rules:**

1. **Never commit the real roster.** Local dev uses `sample-data.json` with fake entries.
2. The site reads **only public-safe fields**: name, cohort, school, major, grad year,
   role/company, LinkedIn, portfolio, testimonial, skills.
3. Keep real data in a **private** source (a locked-down sheet tab or a gated store), and
   pull only the safe columns.

`.gitignore` already excludes local data files — keep it that way.

```gitignore
# Real data — never commit
sample-data.json
*.local.csv
/data/private/
```

## Tech stack

_(Adjust to what you actually build with.)_

- React + Vite
- Plain CSS (or Tailwind)
- Data: Google Sheets — published CSV or the Sheets API
- Hosting: Cloudflare Pages / Vercel / Netlify (static, free tier — nonprofit-friendly)

## Getting started

```bash
npm install
cp sample-data.example.json sample-data.json   # placeholder data for local dev
npm run dev
```

## Status / roadmap

- [x] Directory home — search, cohort filter, cards
- [x] Profile page layout
- [ ] Live Google Sheet data source (public columns only)
- [ ] Real **Skills** field + **Open to opportunities** status (need new sheet columns)
- [ ] Project write-ups + images
- [ ] Alpacee photos
- [ ] Final visual-design pass (see Figma `Visual Design – Desktop`)

## Design

Built from the team's Figma. Visual styling is still being finalized with the design lead —
open a discussion before large visual changes.

---

Maintained by the Project Alpaca web team.
