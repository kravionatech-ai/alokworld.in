/**
 * YouTube Utility Helper for alokworld.in
 * Parses and formats YouTube URLs, Embeds, and Thumbnails
 */

export function extractYouTubeId(url) {
  if (!url || typeof url !== "string") return "";
  const clean = url.trim();

  // Pattern matches watch?v=, youtu.be/, embed/, shorts/, and v/
  const match = clean.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i
  );
  if (match && match[1]) {
    return match[1];
  }

  // If user just pasted the 11-character video ID directly
  if (/^[\w-]{11}$/.test(clean)) {
    return clean;
  }

  return "";
}

export function getYouTubeEmbedUrl(videoId, options = {}) {
  const id = extractYouTubeId(videoId) || videoId;
  if (!id) return "";
  const autoplay = options.autoplay ? 1 : 0;
  return `https://www.youtube.com/embed/${id}?autoplay=${autoplay}&rel=0`;
}

export function getYouTubeThumbnail(videoId, quality = "hqdefault") {
  const id = extractYouTubeId(videoId) || videoId;
  if (!id) return "/asset/alokadhivationposter2026/poster1.jpeg";
  return `https://img.youtube.com/vi/${id}/${quality}.jpg`;
}
