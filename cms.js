// Content managed in Sanity (events, news, team lists).
// 1. content/sanity-content.json  - fetched fresh at build time by scripts/fetch-content.mjs (not committed)
// 2. snapshot/sanity-content.json - committed nightly by .github/workflows/sanity-snapshot.yml
// If neither exists, `cms` is null and each page falls back to its built-in lists.
const fresh = import.meta.glob("./content/sanity-content.json", { eager: true, import: "default" });
const snapshot = import.meta.glob("./snapshot/sanity-content.json", { eager: true, import: "default" });
export const cms = Object.values(fresh)[0] || Object.values(snapshot)[0] || null;
