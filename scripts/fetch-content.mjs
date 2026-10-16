/**
 * Fetches published content from Sanity and saves it to content/sanity-content.json,
 * which the site reads at build time (see cms.js). Runs automatically before `npm run build`;
 * run it by hand with `npm run content` to see Sanity's latest content in local dev.
 *
 * If Sanity can't be reached, this prints a warning and exits normally: the build continues
 * and the pages fall back to the committed snapshot (or their built-in content).
 * The site never breaks because of Sanity.
 *
 * Options (environment variables), used by the nightly snapshot workflow:
 *   CONTENT_OUT=path     write somewhere else (default content/sanity-content.json)
 *   CONTENT_STRICT=1     exit with an error if Sanity can't be reached
 */
import fs from "node:fs";
import path from "node:path";

const PROJECT_ID = "9uh7bydp";
const DATASET = "production";
const API = `https://${PROJECT_ID}.apicdn.sanity.io/v2025-02-19/data/query/${DATASET}`;
const OUT = path.resolve(process.env.CONTENT_OUT || "content/sanity-content.json");

const IMG = `{ alt, hotspot, "url": asset->url }`;
const PERSON = `{ name, role, job, "photo": photo${IMG} }`;
const QUERY = `{
  "events": *[_type == "event" && !(_id in path("drafts.**"))] | order(date asc) { title, date, location, description, keepVisible, rsvpUrl, "image": image${IMG} },
  "news": *[_type == "newsItem" && !(_id in path("drafts.**"))] | order(date desc) { text, date, category, url, "image": image${IMG} },
  "team": *[_id == "teamLists"][0] {
    "board": board[]->${PERSON}, "juniorBoard": juniorBoard[]->${PERSON}, "mentors": mentors[]->${PERSON},
    "volunteers": volunteers[]->${PERSON}, "instructors": instructors[]->${PERSON}
  }
}`;

// Sanity image URL, resized and served in a modern format; hotspot -> CSS object-position.
const imageUrl = (img, width = 1000) => (img?.url ? `${img.url}?w=${width}&fit=max&auto=format&q=80` : "");
const imagePos = (img) => (img?.hotspot ? `${Math.round(img.hotspot.x * 100)}% ${Math.round(img.hotspot.y * 100)}%` : "");
const person = (p) => p && p.name ? { name: p.name, eyebrow: p.role || "", job: p.job || "", photo: imageUrl(p.photo, 900), pos: imagePos(p.photo) } : null;
const people = (list) => (list || []).map(person).filter(Boolean);

export function transform(raw) {
  // No timestamp in the output: identical content must produce an identical file,
  // so the nightly snapshot only commits when something really changed.
  return {
    events: (raw.events || []).filter((e) => e.title && e.date).map((e) => ({
      date: e.date, title: e.title, desc: e.description || "", where: e.location || "",
      imageUrl: imageUrl(e.image), imagePos: imagePos(e.image), alt: e.image?.alt || "",
      keep: !!e.keepVisible, rsvp: e.rsvpUrl || "",
    })),
    news: (raw.news || []).filter((n) => n.text).map((n) => ({
      meta: [n.date?.slice(0, 4), n.category].filter(Boolean).join(" • "), text: n.text,
      image: imageUrl(n.image), alt: n.image?.alt || "", url: n.url || "",
    })),
    team: raw.team ? {
      board: people(raw.team.board), juniorBoard: people(raw.team.juniorBoard), mentors: people(raw.team.mentors),
      volunteers: people(raw.team.volunteers), instructors: people(raw.team.instructors),
    } : null,
  };
}

async function main() {
  try {
    const res = process.env.SANITY_MOCK_FILE
      ? { ok: true, json: async () => JSON.parse(fs.readFileSync(process.env.SANITY_MOCK_FILE, "utf8")) } // for testing
      : await fetch(`${API}?query=${encodeURIComponent(QUERY)}`, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`Sanity responded ${res.status}`);
    const { result } = await res.json();
    if (!result) throw new Error("empty response");
    const content = transform(result);
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, JSON.stringify(content, null, 2) + "\n");
    const t = content.team;
    console.log(`Sanity content saved: ${content.events.length} events, ${content.news.length} news, ` +
      (t ? `team lists (board ${t.board.length}, junior ${t.juniorBoard.length}, mentors ${t.mentors.length}, volunteers ${t.volunteers.length}, instructors ${t.instructors.length})` : "no team lists"));
  } catch (err) {
    console.warn(`\n⚠ Couldn't fetch content from Sanity (${err.message}).`);
    console.warn(fs.existsSync(OUT) ? "  Using the previously saved content." : "  The site will use the committed snapshot or its built-in content.\n");
    if (process.env.CONTENT_STRICT) process.exitCode = 1;
  }
}
main();
