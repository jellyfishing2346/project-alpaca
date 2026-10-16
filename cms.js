// Content managed in Sanity (events, news, team lists), fetched at build time by
// scripts/fetch-content.mjs into content/sanity-content.json.
// If that file doesn't exist (Sanity unreachable, or local dev without `npm run content`),
// `cms` is null and each page falls back to its built-in lists.
const files = import.meta.glob("./content/sanity-content.json", { eager: true, import: "default" });
export const cms = Object.values(files)[0] || null;
