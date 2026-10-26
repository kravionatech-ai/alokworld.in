// =========================================================================
// ADMIN CONTROL CENTER ROUTING & NAVIGATION ENGINE
// Maps clean paths (/admin/pages, /admin/gallery) to internal tabs & vice versa
// =========================================================================

export const ADMIN_STATIC_PATHS = [
  "overview",
  "members",
  "add-member",
  "pages",
  "gallery",
  "messages",
  "events",
  "hero",
  "settings",
  "maintenance",
  "seo",
  "health",
];

export function tabToPath(tabId) {
  switch (tabId) {
    case "overview":
      return "/admin/overview";
    case "members":
      return "/admin/members";
    case "add_member":
      return "/admin/add-member";
    case "pages":
      return "/admin/pages";
    case "gallery":
      return "/admin/gallery";
    case "messages":
      return "/admin/messages";
    case "events":
      return "/admin/events";
    case "hero_widgets":
      return "/admin/hero";
    case "site_settings":
      return "/admin/settings";
    case "maintenance":
      return "/admin/maintenance";
    case "seo_settings":
      return "/admin/seo";
    case "system_health":
      return "/admin/health";
    default:
      return `/admin/${tabId}`;
  }
}

export function pathToTab(pathOrTab) {
  if (!pathOrTab) return "members";
  const clean = String(pathOrTab)
    .replace(/^\/admin\/?/, "")
    .replace(/[?#].*$/, "")
    .toLowerCase()
    .trim();

  switch (clean) {
    case "":
    case "admin":
      return "members";
    case "overview":
    case "dashboard":
    case "analytics":
      return "overview";
    case "members":
    case "member":
    case "directory":
      return "members";
    case "add-member":
    case "add_member":
    case "new-member":
    case "new":
      return "add_member";
    case "pages":
    case "page":
    case "cms":
      return "pages";
    case "gallery":
    case "photos":
    case "photo":
      return "gallery";
    case "messages":
    case "message":
    case "emails":
    case "email":
    case "inquiries":
    case "inbox":
    case "contact":
      return "messages";
    case "events":
    case "event":
    case "countdown":
      return "events";
    case "hero":
    case "hero-widgets":
    case "hero_widgets":
    case "widgets":
    case "banners":
    case "banner":
      return "hero_widgets";
    case "settings":
    case "site-settings":
    case "site_settings":
    case "site":
      return "site_settings";
    case "maintenance":
      return "maintenance";
    case "seo":
    case "seo-settings":
    case "seo_settings":
      return "seo_settings";
    case "health":
    case "system-health":
    case "system_health":
    case "server":
      return "system_health";
    default:
      return "members";
  }
}
