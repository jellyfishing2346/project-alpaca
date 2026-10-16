import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: { projectId: "9uh7bydp", dataset: "production" },
  // The Studio is published at https://projectalpaca.sanity.studio
  studioHost: "projectalpaca",
});
