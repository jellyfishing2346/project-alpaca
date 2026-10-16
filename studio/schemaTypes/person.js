import { defineField, defineType } from "sanity";

export default defineType({
  name: "person",
  title: "Person",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Full name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "photo", title: "Photo", type: "image", options: { hotspot: true }, validation: (r) => r.required(),
      description: "A portrait works best. Click the crop icon and mark the face so it stays in frame on the cards.",
    }),
    defineField({ name: "role", title: "Role at Project Alpaca", type: "string", description: "Small line above the name, e.g. Co-Founder • Executive Director" }),
    defineField({ name: "job", title: "Job and company", type: "string", description: "Line below the name, e.g. Product Manager at Kodely" }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "photo" } },
});
