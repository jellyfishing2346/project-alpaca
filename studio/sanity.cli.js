import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: { projectId: "9uh7bydp", dataset: "production" },
  // The Studio is published at https://projectalpaca.sanity.studio
  studioHost: "projectalpaca",
  // Keeps `npm run deploy` updating the same Studio (ID from the first deploy, Oct 16, 2026)
  deployment: { appId: "pgec2kfga8hssg1k2yjj6qd3" },
});
