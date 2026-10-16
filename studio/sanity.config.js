import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes, SINGLETONS } from "./schemaTypes/index.js";
import { structure } from "./structure.js";

export default defineConfig({
  name: "default",
  title: "Project Alpaca",
  projectId: "9uh7bydp",
  dataset: "production",
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
    // "Team lists" is a single page: hide it from the "create new" menus
    templates: (templates) => templates.filter(({ schemaType }) => !SINGLETONS.includes(schemaType)),
  },
  document: {
    // Single pages can't be duplicated or deleted
    actions: (actions, { schemaType }) =>
      SINGLETONS.includes(schemaType)
        ? actions.filter(({ action }) => ["publish", "discardChanges", "restore"].includes(action))
        : actions,
  },
});
