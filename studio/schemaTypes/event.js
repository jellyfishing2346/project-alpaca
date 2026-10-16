import { defineField, defineType } from "sanity";

export default defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Event name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "date", title: "Date", type: "date", validation: (r) => r.required(),
      description: "Events disappear from the homepage automatically once this date has passed.",
    }),
    defineField({ name: "location", title: "Location", type: "string", description: "e.g. Central Park, or Online" }),
    defineField({ name: "description", title: "Short description", type: "text", rows: 3, validation: (r) => r.max(300) }),
    defineField({
      name: "image", title: "Photo", type: "image", options: { hotspot: true },
      description: "Click the crop icon on the photo to mark the most important part, so it crops well.",
      fields: [defineField({ name: "alt", title: "Describe the photo (for screen readers)", type: "string" })],
    }),
    defineField({
      name: "rsvpUrl", title: "RSVP link (optional)", type: "url",
      description: "A sign-up form or event page. Leave empty and the RSVP button will email hello@projectalpaca.org.",
    }),
    defineField({
      name: "keepVisible", title: "Keep showing after the date", type: "boolean", initialValue: false,
      description: "Normally leave this off: events disappear automatically once their date has passed. Turn it on only for sample or evergreen events.",
    }),
  ],
  orderings: [{ title: "Date, newest first", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
  preview: {
    select: { title: "title", date: "date", location: "location", media: "image" },
    prepare: ({ title, date, location, media }) => ({ title, subtitle: [date, location].filter(Boolean).join(" • "), media }),
  },
});
