/**
 * One-time import: copies the website's current events, news and people (with photos)
 * into Sanity, so nobody has to retype them.
 *
 * Run from the studio/ folder:
 *   npx sanity exec scripts/import-current-content.js --with-user-token            (import)
 *   npx sanity exec scripts/import-current-content.js --with-user-token -- --dry-run  (preview only)
 *
 * Safe to run again: documents that already exist in Sanity are left untouched
 * (so edits made in the Studio are never overwritten), and identical photos aren't duplicated.
 */
import fs from "node:fs";
import path from "node:path";
import { getCliClient } from "sanity/cli";

const DRY_RUN = process.argv.includes("--dry-run");
const PUBLIC = path.resolve(process.cwd(), "..", "public");

// ---- The site's current content (from Home.jsx, About.jsx, GetInvolved.jsx, Flagship.jsx) ----
const PEOPLE = [
  { id: "catherine-man", name: "Catherine Man", role: "Co-Founder • Executive Director", photo: "images/flagship/catherine-man.jpg" },
  { id: "claire-igot", name: "Claire Igot", role: "Co-Founder • Board Chair", photo: "images/people/claire-igot.jpg" },
  { id: "donna-meredith", name: "Donna Meredith", role: "", photo: "images/people/donna-meredith.jpg" },
  { id: "fred-butterweck", name: "Fred Butterweck", role: "", photo: "images/people/fred-butterweck.jpg" },
  { id: "mac-exume", name: "Mac Exume", role: "", photo: "images/people/mac-exume.jpg" },
  { id: "jenna-scherma", name: "Jenna Scherma", role: "", photo: "images/people/jenna-scherma.jpg" },
  { id: "courtney-leggett", name: "Courtney Leggett", role: "", photo: "images/people/courtney-leggett.jpg" },
  { id: "zsoreign-sanchez", name: "Zsoreign Sanchez", role: "Teaching Team", photo: "images/flagship/zsoreign-sanchez.jpg" },
  { id: "marissa-fleming", name: "Marissa Fleming", role: "Teaching Team", photo: "images/flagship/marissa-fleming.jpg" },
];
const BOARD = ["catherine-man", "claire-igot", "donna-meredith", "fred-butterweck", "mac-exume", "jenna-scherma", "courtney-leggett"];
const TEAM_LISTS = {
  board: BOARD,
  juniorBoard: BOARD, // placeholder in the design (repeats the Board) — replace with the graduated Alpacees
  mentors: ["catherine-man", "claire-igot", "donna-meredith"], // placeholder in the design
  volunteers: ["catherine-man", "claire-igot", "donna-meredith"], // placeholder in the design
  instructors: ["catherine-man", "zsoreign-sanchez", "marissa-fleming"],
};
const EVENTS = [
  { id: "summer-picnic", title: "Summer Picnic", date: "2026-07-20", location: "Central Park",
    description: "Our fun gathering that brings together our entire community for food.",
    image: "images/home/events/summer-picnic.jpg", alt: "Alpacees smiling at a picnic in Central Park, one holding an alpaca plush",
    keepVisible: true }, // sample event from the design; date has passed
];
const NEWS = [
  { id: "citizens-committee-grant-2025", text: "Project Alpaca received Community Leaders Grant from Citizens Committee for New York City.",
    date: "2025-01-01", // only the year is known; set the real date in the Studio
    category: "Grant", image: "images/about/news-citizens-committee.png", alt: "Citizens Committee for New York City logo",
    url: "https://www.citizensnyc.org" },
];

// ---- Import ------------------------------------------------------------------------------
const client = getCliClient({ apiVersion: "2025-02-19" });
const uploaded = new Map();

async function image(relPath, alt) {
  const file = path.join(PUBLIC, relPath);
  if (!fs.existsSync(file)) throw new Error(`Missing photo: public/${relPath}. Run this from the studio/ folder of the repo.`);
  if (!uploaded.has(relPath)) {
    if (DRY_RUN) uploaded.set(relPath, `image-DRYRUN-${path.basename(relPath)}`);
    else {
      const asset = await client.assets.upload("image", fs.createReadStream(file), { filename: path.basename(relPath) });
      uploaded.set(relPath, asset._id);
    }
    console.log(`  photo  ${DRY_RUN ? "(would upload)" : "uploaded"}  ${relPath}`);
  }
  const img = { _type: "image", asset: { _type: "reference", _ref: uploaded.get(relPath) } };
  if (alt) img.alt = alt;
  return img;
}

const docs = [];
console.log(`\n${DRY_RUN ? "DRY RUN (nothing is written)" : "Importing"} into project ${client.config().projectId}, dataset ${client.config().dataset}\n`);

for (const p of PEOPLE) {
  const d = { _id: `person-${p.id}`, _type: "person", name: p.name, photo: await image(p.photo) };
  if (p.role) d.role = p.role;
  docs.push(d);
}
for (const e of EVENTS) {
  docs.push({ _id: `event-${e.id}`, _type: "event", title: e.title, date: e.date, location: e.location,
    description: e.description, image: await image(e.image, e.alt), keepVisible: e.keepVisible });
}
for (const n of NEWS) {
  docs.push({ _id: `news-${n.id}`, _type: "newsItem", text: n.text, date: n.date, category: n.category,
    image: await image(n.image, n.alt), url: n.url });
}
const refs = (ids) => ids.map((id, i) => ({ _key: `${id}-${i}`, _type: "reference", _ref: `person-${id}` }));
docs.push({ _id: "teamLists", _type: "teamLists", ...Object.fromEntries(Object.entries(TEAM_LISTS).map(([k, ids]) => [k, refs(ids)])) });

if (DRY_RUN) {
  console.log(`\nWould create ${docs.length} documents (existing ones are skipped):`);
  for (const d of docs) console.log(`  ${d._type.padEnd(9)} ${d._id}`);
  if (process.env.SHOW_JSON) console.log(JSON.stringify(docs, null, 2));
} else {
  const existing = new Set(await client.fetch("*[_id in $ids]._id", { ids: docs.map((d) => d._id) }));
  const tx = client.transaction();
  for (const d of docs) tx.createIfNotExists(d);
  await tx.commit();
  console.log(`\nDone: ${docs.length - existing.size} documents created, ${existing.size} already existed and were left as they are.`);
  console.log("Open the Studio to see them: Events, News, People, Team lists.");
}
