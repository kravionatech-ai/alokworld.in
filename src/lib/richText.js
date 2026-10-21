import sanitizeHtml from "sanitize-html";
import { marked } from "marked";

/**
 * Robust server and client-safe rich text sanitizer.
 * Permissively allows valid typography, headings, tables, links, Cloudinary images,
 * and text alignments, while stripping dangerous tags (script, iframe, object, etc.)
 * and malicious event handler attributes (onload, onerror, onclick, etc.).
 */
export function sanitizeRichText(html) {
  if (!html || typeof html !== "string") return "";

  return sanitizeHtml(html, {
    allowedTags: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "br",
      "hr",
      "blockquote",
      "b",
      "strong",
      "i",
      "em",
      "u",
      "s",
      "strike",
      "del",
      "sub",
      "sup",
      "ul",
      "ol",
      "li",
      "a",
      "img",
      "table",
      "thead",
      "tbody",
      "tfoot",
      "tr",
      "th",
      "td",
      "span",
      "code",
      "pre",
    ],
    allowedAttributes: {
      "*": ["class", "style", "id", "dir", "lang"],
      a: ["href", "name", "target", "rel", "title", "download"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      th: ["colspan", "rowspan", "colwidth", "scope"],
      td: ["colspan", "rowspan", "colwidth"],
    },
    allowedStyles: {
      "*": {
        "text-align": [/^(left|right|center|justify)$/i],
        color: [/^#[0-9a-fA-F]{3,8}$/, /^rgb\(/i, /^rgba\(/i],
        "background-color": [/^#[0-9a-fA-F]{3,8}$/, /^rgb\(/i, /^rgba\(/i],
        "font-weight": [/^(bold|normal|[1-9]00)$/i],
        "text-decoration": [/^(underline|line-through|none)$/i],
        width: [/^\d+(%|px|rem|em)$/],
        "max-width": [/^\d+(%|px|rem|em)$/],
      },
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: {
      img: ["http", "https", "data"],
    },
    transformTags: {
      a: (tagName, attribs) => {
        // Enforce secure rel for blank targets
        if (attribs.target === "_blank") {
          attribs.rel = "noopener noreferrer";
        }
        return {
          tagName,
          attribs,
        };
      },
    },
  });
}

/**
 * Normalizes legacy content (Markdown or unformatted text) into valid, clean HTML.
 * If the string contains markdown syntax and does not appear to start with HTML,
 * it runs marked.parse to convert it into HTML, then sanitizes.
 */
export function normalizeRichContent(content) {
  if (!content || typeof content !== "string") return "";

  const trimmed = content.trim();
  if (!trimmed) return "";

  // Check if content appears to be already HTML
  const hasHtmlTag = /<([a-z1-6]+)(?:\s+[^>]*>|>)/i.test(trimmed);

  // Check if content has Markdown cues (headings, lists, bold, links, tables)
  const hasMarkdownCues =
    /^#{1,6}\s+/m.test(trimmed) ||
    /(\*\*|__)[^\s].*?\1/.test(trimmed) ||
    /^\s*[-*+]\s+/m.test(trimmed) ||
    /^\s*\d+\.\s+/m.test(trimmed) ||
    /\[.*?\]\(.*?\)/.test(trimmed) ||
    /\|.*?\|.*?\|/.test(trimmed);

  let htmlToSanitize = trimmed;

  if (hasMarkdownCues && (!hasHtmlTag || trimmed.startsWith("#") || trimmed.startsWith("*") || trimmed.startsWith("-"))) {
    try {
      htmlToSanitize = marked.parse(trimmed, { gfm: true, breaks: true });
    } catch {
      htmlToSanitize = trimmed;
    }
  }

  return sanitizeRichText(htmlToSanitize);
}
