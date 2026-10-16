// The left-hand menu editors see in the Studio.
export const structure = (S) =>
  S.list()
    .title("Website content")
    .items([
      S.documentTypeListItem("event").title("Events"),
      S.documentTypeListItem("newsItem").title("News"),
      S.divider(),
      S.documentTypeListItem("person").title("People"),
      S.listItem()
        .title("Team lists (Board, Mentors, …)")
        .id("teamLists")
        .child(S.document().schemaType("teamLists").documentId("teamLists").title("Team lists")),
    ]);
