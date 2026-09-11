// sheet.js — loads the Alpacee roster from a published Google Sheet (CSV).
//
// PRIVACY: only the public-safe columns in COLUMN_MAP are ever read. Email and the
// demographic columns (race, immigrant, first_gen_college) are intentionally NOT mapped,
// so even if they appear in the CSV they never reach the app.

// 1) Publish a PUBLIC-COLUMNS-ONLY tab of the sheet:
//    File → Share → Publish to web → choose the tab → "Comma-separated values (.csv)".
//    Paste that URL here (looks like:
//    https://docs.google.com/spreadsheets/d/e/XXXX/pub?gid=0&single=true&output=csv )
export const SHEET_CSV_URL = "PASTE_PUBLISHED_CSV_URL_HERE";

// 2) Map app fields → the EXACT column-header text in your sheet's first row.
//    Tweak the right-hand strings if your headers differ.
const COLUMN_MAP = {
  name:      "Name",
  cohort:    "Cohort",
  school:    "School",
  major:     "Major",
  grad:      "Graduation Year",
  role:      "Current Job / Role",
  company:   "Current Company",
  linkedin:  "LinkedIn Profile",
  portfolio: "Website / Portfolio",
  quote:     "Testimonial about Project Alpaca",
  skills:    "Skills",
  photo:     "Photo link",
  bio:       "Bio",
};
// NOTE: "Email", "race", "immigrant", "first_gen_college" are deliberately absent above.

// --- minimal RFC-4180 CSV parser (handles quotes, commas + newlines inside fields) ---
function parseCSV(text) {
  const rows = [];
  let row = [], field = "", i = 0, inQuotes = false;
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 2; continue; } // escaped quote
        inQuotes = false; i++; continue;
      }
      field += c; i++; continue;
    }
    if (c === '"') { inQuotes = true; i++; continue; }
    if (c === ",") { row.push(field); field = ""; i++; continue; }
    if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
    field += c; i++;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const cohortNumber = (v) => {
  const m = String(v || "").match(/cohort\s*(\d+)/i);
  return m ? Number(m[1]) : null;
};

const clean = (v) => {
  const s = (v || "").trim();
  return s && s.toUpperCase() !== "N/A" ? s : "";
};

// Google Drive share links don't embed in <img>. Convert to a direct-image URL.
const toDirectImage = (url) => {
  if (!url) return "";
  const m = url.match(/\/file\/d\/([-\w]+)/) || url.match(/[?&]id=([-\w]+)/);
  return m ? `https://lh3.googleusercontent.com/d/${m[1]}` : url;
};

// Skills cells are often free-written ("Programming Languages: Python, Java; AI: PyTorch").
// Normalize into clean short tags.
const splitList = (v) => {
  if (!v) return [];
  return v
    // treat newlines, bullets, slashes-between-words and "Category:" prefixes as separators
    .replace(/[•\n]+/g, ",")
    .split(/[,;|]| and /i)
    .map((s) =>
      s
        .replace(/^[^:]*:\s*/, "") // drop a leading "Category:" label
        .replace(/\([^)]*\)/g, "") // drop parenthetical asides
        .replace(/[()]/g, "")      // drop orphaned parens
        .trim()
    )
    .filter((s) => s && s.length <= 32) // skip empties and run-on fragments
    .filter((s, i, a) => a.indexOf(s) === i); // dedupe
};

// Returns an array of public-safe Alpacee records, or [] if no URL is set / sheet is empty.
export async function loadAlpacees() {
  if (!SHEET_CSV_URL || SHEET_CSV_URL.startsWith("PASTE_")) return [];

  const res = await fetch(SHEET_CSV_URL);
  if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`);
  const rows = parseCSV(await res.text());
  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => h.trim());
  const idx = {};
  for (const [field, header] of Object.entries(COLUMN_MAP)) {
    idx[field] = headers.indexOf(header);
  }

  const out = [];
  for (let r = 1; r < rows.length; r++) {
    const cells = rows[r];
    const get = (f) => (idx[f] >= 0 ? clean(cells[idx[f]]) : "");
    const name = get("name");
    if (!name) continue; // skip blank rows

    out.push({
      id: r,
      name,
      c: cohortNumber(get("cohort")),
      school: get("school"),
      major: get("major"),
      grad: get("grad"),
      role: get("role"),
      company: get("company"),
      linkedin: get("linkedin"),
      portfolio: get("portfolio"),
      bio: get("bio"),
      quote: get("quote"),
      skills: splitList(get("skills")),
      photo: toDirectImage(get("photo")),
    });
  }
  return out;
}