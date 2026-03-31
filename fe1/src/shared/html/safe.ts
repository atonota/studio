/**
 * @module shared/html/safe
 * Safe HTML builder — escapes user input, builds elements without raw string concat.
 * Use instead of innerHTML with untrusted data (API responses, user input).
 */

const ENTITY_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const ENTITY_RE = /[&<>"']/g;

/** Escape HTML special characters. Always use on user-provided strings. */
export function escapeHtml(str: string): string {
  return str.replace(ENTITY_RE, (ch) => ENTITY_MAP[ch] ?? ch);
}

/** Self-closing tags that don't need a closing tag. */
const VOID_TAGS = new Set(['br', 'hr', 'img', 'input', 'meta', 'link']);

/**
 * Build an HTML element string with escaped attributes.
 * Children are concatenated as-is (caller must pre-escape user data via escapeHtml).
 * @param tag - HTML tag name
 * @param attrs - Attribute map (boolean true renders attribute-only, false omits)
 * @param children - Inner HTML strings (pre-escaped)
 */
export function h(tag: string, attrs?: Record<string, string | boolean | number>, ...children: string[]): string {
  let attrStr = '';
  if (attrs) {
    for (const [key, val] of Object.entries(attrs)) {
      if (val === false || val === undefined || val === null) continue;
      if (val === true) {
        attrStr += ` ${escapeHtml(key)}`;
      } else {
        attrStr += ` ${escapeHtml(key)}="${escapeHtml(String(val))}"`;
      }
    }
  }

  if (VOID_TAGS.has(tag)) {
    return `<${tag}${attrStr}>`;
  }

  return `<${tag}${attrStr}>${children.join('')}</${tag}>`;
}

/** Allowed tags for sanitize(). */
const ALLOWED_TAGS = new Set([
  'div', 'span', 'a', 'i', 'strong', 'em', 'p', 'br', 'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'button', 'label', 'nav', 'section',
  'kbd', 'code', 'pre', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
]);

/** Allowed attribute prefixes for sanitize(). */
const ALLOWED_ATTR_PREFIXES = ['class', 'style', 'href', 'role', 'aria-', 'data-', 'title', 'id', 'tabindex'];

/**
 * Strip disallowed tags and attributes from HTML string.
 * Allowlist approach — only known-safe tags and attributes pass through.
 * For untrusted HTML from API responses.
 */
export function sanitize(html: string): string {
  // Remove script/style/iframe tags entirely (including content)
  let clean = html.replace(/<(script|style|iframe|object|embed|form)[^>]*>[\s\S]*?<\/\1>/gi, '');
  // Remove self-closing dangerous tags
  clean = clean.replace(/<(script|style|iframe|object|embed|form)[^>]*\/?>/gi, '');
  // Remove event handlers (onclick, onerror, etc.)
  clean = clean.replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]*)/gi, '');
  // Remove javascript: and data: URLs from href/src
  clean = clean.replace(/(href|src)\s*=\s*["']?\s*(javascript|data|vbscript)\s*:/gi, '$1="blocked:"');

  // Strip disallowed tags (keep content)
  clean = clean.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (match, tag: string) => {
    const lower = tag.toLowerCase();
    if (!ALLOWED_TAGS.has(lower)) return '';
    // Strip disallowed attributes from allowed tags
    return match.replace(/\s+([a-z][a-z0-9-]*)\s*=\s*("[^"]*"|'[^']*'|[^\s>]*)/gi, (attrMatch, attrName: string) => {
      const lowerAttr = attrName.toLowerCase();
      if (ALLOWED_ATTR_PREFIXES.some(prefix => lowerAttr === prefix || lowerAttr.startsWith(prefix))) {
        return attrMatch;
      }
      return '';
    });
  });

  return clean;
}
