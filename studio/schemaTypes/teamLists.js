import { defineField, defineType } from "sanity";

const list = (name, title, description) =>
  defineField({
    name, title, description, type: "array",
    of: [{ type: "reference", to: [{ type: "person" }] }],
    validation: (r) => r.unique(),
  });

export default defineType({
  name: "teamLists",
  title: "Team lists",
  type: "document",
  description: "Who appears in each section of the site. Add people from the People list, and drag to change the order.",
  fields: [
    list("board", "Board of Directors", "About page"),
    list("juniorBoard", "Junior Board", "About page: graduated Alpacees"),
    list("mentors", "Mentors", "Get Involved page: \"Meet our Mentors\""),
    list("volunteers", "Volunteers", "Get Involved page: \"Meet our Volunteers\""),
    list("instructors", "Core Instructors", "Flagship page"),
  ],
  preview: { prepare: () => ({ title: "Team lists" }) },
});
