/**
 * @module ui/base/DOMHelper
 * Safe DOM utilities — escaping, element building, selector helpers.
 * Replaces raw innerHTML string concat with type-safe builders.
 */

const ENTITY_MAP: Readonly<Record<string, string>> = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
};

/** Escape HTML special characters in user-provided strings. */
export function esc(str: string): string {
  return str.replace(/[&<>"']/g, ch => ENTITY_MAP[ch] ?? ch);
}

/** Self-closing tags. */
const VOID = new Set(['br', 'hr', 'img', 'input', 'meta', 'link']);

/**
 * Build an HTML element string.
 * Attributes are escaped. Children are concatenated as-is (pre-escape user data with esc()).
 */
export function h(
  tag: string,
  attrs?: Record<string, string | boolean | number | undefined>,
  ...children: string[]
): string {
  let a = '';
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v === false || v === undefined || v === null) continue;
      a += v === true ? ` ${k}` : ` ${k}="${esc(String(v))}"`;
    }
  }
  if (VOID.has(tag)) return `<${tag}${a}>`;
  return `<${tag}${a}>${children.join('')}</${tag}>`;
}

/** Create an icon element (Phosphor pattern). Always aria-hidden. */
export function icon(name: string, style?: string): string {
  return h('i', { class: `ph ${name}`, 'aria-hidden': 'true', style });
}

/** Create a decorative separator. */
export function separator(): string {
  return h('div', { role: 'separator', class: 'ni-div' });
}

/** Safely get element by ID with type assertion. */
export function byId<T extends HTMLElement = HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}
