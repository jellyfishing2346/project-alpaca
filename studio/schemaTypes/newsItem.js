import { defineField, defineType } from "sanity";

export default defineType({
  name: "newsItem",
  title: "News item",
  type: "document",
  fields: [
    defineField({ name: "text", title: "Headline / summary", type: "text", rows: 3, validation: (r) => r.required().max(400) }),
    defineField({ name: "date", title: "Date", type: "date", validation: (r) => r.required(), description: "Newest items show first; the year appears on the site." }),
    defineField({
      name: "category", title: "Category", type: "string",
      options: { list: ["Grant", "Press", "Announcement", "Partnership", "Award", "Event"] },
      initialValue: "Announcement",
    }),
    defineField({
      name: "image", title: "Image or logo", type: "image", options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Describe the image (for screen readers)", type: "string" })],
    }),
    defineField({ name: "url", title: "\"Read\" link", type: "url", description: "Where the Read button goes, e.g. the article or announcement." }),
  ],
  orderings: [{ title: "Date, newest first", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
  preview: {
    select: { text: "text", date: "date", category: "category", media: "image" },
    prepare: ({ text, date, category, media }) => ({ title: text, subtitle: [date?.slice(0, 4), category].filter(Boolean).join(" • "), media }),
  },
});
