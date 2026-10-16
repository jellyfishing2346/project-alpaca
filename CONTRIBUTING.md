<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/logo-white.svg">
  <img src="public/logo-dark.svg" alt="Project Alpaca logo" width="110">
</picture>

# Contributing to Project Alpaca

**No one navigates the path alone, and that goes for this website too.** 🦙

This site is built and maintained by volunteers. Whether you're fixing a typo, polishing a page or adding a feature, thank you for helping Project Alpaca's students get seen.

[![Open issues](https://img.shields.io/badge/Issues-report_or_pick_one-63FFA1?style=for-the-badge&logo=github&logoColor=1F1F1F)](https://github.com/jellyfishing2346/project-alpaca/issues)
[![Docs](https://img.shields.io/badge/Read-DOCS.md-37E3FC?style=for-the-badge&logo=readthedocs&logoColor=1F1F1F)](DOCS.md)

</div>

---

## 🧭 Start here: what are you trying to change?

Most changes **don't need code**. Pick the right place first:

| I want to… | Where it happens | Needs GitHub? |
|---|---|---|
| Update events, news, board, mentors, volunteers, instructors | **[Sanity Studio](https://projectalpaca.sanity.studio)** → edit → *Publish* | ❌ |
| Add, edit or hide a student in the directory | The program's **Google Sheet** | ❌ |
| Report something broken or suggest an idea | **[GitHub Issues](https://github.com/jellyfishing2346/project-alpaca/issues)** | ✅ (an account) |
| Change page text, layout, styling or behavior | **This repo**: keep reading | ✅ |
| Change what editors can edit in the Studio | `studio/` in **this repo** ([details](DOCS.md#changing-the-studio-developers)) | ✅ |
| Propose a design change | Talk to the team first: pages follow Studio Haven's Figma designs | ❌ |

> [!NOTE]
> Don't have Studio access? Ask the project lead or email **hello@projectalpaca.org**. Editors are invited with the **Editor** role.

## 🛠️ Set up your machine

**You'll need:** [Node.js 22.12+](https://nodejs.org), Git, and a code editor.

```bash
git clone https://github.com/jellyfishing2346/project-alpaca.git
cd project-alpaca
npm install
npm run content   # optional: latest published content (otherwise you see the nightly snapshot)
npm run dev       # http://localhost:5173
```

The **Studio** is a separate project with its own packages:

```bash
cd studio
npm install
npx sanity login  # use the login method you were invited with
npm run dev       # http://localhost:3333
```

> [!TIP]
> Run website commands from the **repo root** and Studio commands from **`studio/`**. `npm run content` in the wrong folder says "Missing script".

## 🔁 Workflow

**1. Pull first.** A nightly GitHub Action commits content snapshots to `main`, so your copy may be behind:
```bash
git pull
```

**2. Make a branch** with a short, descriptive name:

| Prefix | For | Example |
|---|---|---|
| `fix/` | Something broken | `fix/donate-button-mobile` |
| `feat/` | New behavior or a new page | `feat/projects-page` |
| `design/` | Matching or updating a design | `design/about-history-timeline` |
| `docs/` | Documentation only | `docs/editor-guide` |

**3. Commit** in the repo's style, **"Area: what changed"**, short and in plain English:
```
About: add the 2022 milestone to the history timeline
Directory: fix filter pills wrapping on small phones
Docs: explain the nightly snapshot
```

**4. Open a pull request** into `main`, using the checklist below. Every push to `main` deploys the live site, so changes land there through reviewed pull requests.

> [!TIP]
> If Cloudflare preview deployments are enabled, each branch gets its own preview link: a great way to show your change before it goes live.

## ✅ Pull request checklist

Copy this into your pull request description:

```markdown
- [ ] `npm run build` succeeds
- [ ] Checked at phone (390px), tablet (768px) and desktop (1440px) widths, with no sideways scrolling
- [ ] No errors in the browser console
- [ ] Visual changes: before/after screenshots attached
- [ ] Design changes: compared side by side with the Figma design
- [ ] Images optimized (JPEG ~80% quality, ideally under 400 KB)
- [ ] DOCS.md updated if behavior, setup or content rules changed
```

## 🎨 Code guidelines

**Match what's there.** The codebase is intentionally simple:

- **One stylesheet:** all CSS lives in `styles.css`, **scoped per page** (`.root-home`, `.root-flag`, `.root-about`, …) so a change to one page can't break another. Add new rules inside the right block.
- **Design first:** pages are built to Studio Haven's Figma designs and checked side by side, down to the spacing. If you must deviate, note it in [DOCS.md → Decisions and deviations](DOCS.md#14-decisions-and-deviations-from-the-figma).
- **Accessible by default:** real `alt` text for meaningful images (`alt=""` for decorative ones), visible focus states, buttons for actions and links for navigation.
- **Content belongs in the CMS:** if editors will want to change it regularly, it should come from Sanity, not be hard-coded. Each page keeps a built-in fallback list for when Sanity is unreachable.
- **Dependencies are pinned on purpose:** update them deliberately and test. Never run `npm audit fix --force`, which upgrades past tested versions.

## 🔒 Privacy and safety rules

> [!IMPORTANT]
> **This repository is public.** Anything committed here can be seen by anyone, forever, even if you delete it later.

- **Never commit private student data:** emails, phone numbers, demographics, or a copy of the master Google Sheet. The directory may only read a sheet containing **public columns**. See [DOCS.md → Data, privacy and sharing](DOCS.md#6-data-privacy-and-sharing-important).
- **Never commit secrets:** passwords, API tokens, or the Cloudflare deploy hook URL. If one slips in, tell the project lead right away so it can be replaced; removing the commit isn't enough.
- **Don't edit generated files:** `content/` is created at build time (and ignored by git), and `snapshot/` is written by the nightly Action.

## 🐛 Reporting a bug

Open an **[issue](https://github.com/jellyfishing2346/project-alpaca/issues/new)** and include:

1. **Where:** the page address, e.g. `/about`
2. **What happened** vs. **what you expected**
3. **Device and browser:** e.g. iPhone 15, Safari
4. **A screenshot,** if it's visual

Content mistakes (a wrong name, an outdated event) are faster to fix in the **Studio** than through an issue.

## 💬 Getting help

- **Technical questions:** open an issue, or start with **[DOCS.md](DOCS.md)**, especially [Troubleshooting](DOCS.md#troubleshooting).
- **Everything else:** **hello@projectalpaca.org**

## 💛 Be kind

Project Alpaca is built on collaboration over competition. Be welcoming to first-time contributors, assume good intent, give feedback on the work (not the person), and remember that everyone here is volunteering their time for students.

<div align="center">
<br>
<sub>By contributing, you agree that your contributions are licensed under the <a href="LICENSE">Apache License 2.0</a>, like the rest of the project.</sub>
</div>
