export function slugify(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word characters except dashes and spaces
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
}

export async function generateUniqueMemberSlug(MemberModel, name, currentId = null) {
  const baseSlug = slugify(name) || "member";
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await MemberModel.findOne({
      slug,
      ...(currentId ? { _id: { $ne: currentId } } : {}),
    }).lean();

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}
