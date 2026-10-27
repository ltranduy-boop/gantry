export const toEntryDto = (entry) => ({
  id: entry._id.toString(),
  favorite: entry.favorite,
  title: entry.title,
  body: entry.body,
});
