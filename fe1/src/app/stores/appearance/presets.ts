/**
 * @module stores/appearance/presets
 * Static preset data (tones, accents) + color math helpers.
 * Extracted from appearance.store.ts for modularity.
 */

import type { TonePreset, AccentPreset, RGB, HSL } from '../../../shared/types';

// ── Light Tone Presets (16) ──────────────────────────

export const LIGHT_TONES: TonePreset[] = [
  { key: 'pure',      label: 'White',     base: '#FFFFFF', s: '#F7F7F7', s2: '#EEEEEE', b: '#DCDCDC' },
  { key: 'snow',      label: 'Snow',      base: '#FDFDFB', s: '#F6F6F3', s2: '#EEEDE9', b: '#DDDBD5' },
  { key: 'pearl',     label: 'Pearl',     base: '#FAFAF6', s: '#F3F3EE', s2: '#EAEAE3', b: '#D5D4CC' },
  { key: 'milk',      label: 'Milk',      base: '#F8F5EC', s: '#F0EDE3', s2: '#E8E4D8', b: '#D6D1C2' },
  { key: 'cream',     label: 'Cream',     base: '#F5F0E3', s: '#EDE7D5', s2: '#E3DCC9', b: '#CEC9B4' },
  { key: 'ecru',      label: 'Ecru',      base: '#F0EBD8', s: '#E8E2CD', s2: '#DDDBBF', b: '#C8BEA5' },
  { key: 'linen',     label: 'Linen',     base: '#EDE8D5', s: '#E3DDC8', s2: '#D8D2BA', b: '#C0B89F' },
  { key: 'parchment', label: 'Parchment', base: '#EAE4CE', s: '#E0DAC2', s2: '#D5CEB4', b: '#BCB49A' },
  { key: 'cyan-l',    label: 'Cyan',      base: '#EEF8F8', s: '#E5F0F0', s2: '#D9EAEA', b: '#C4D8D8' },
  { key: 'mag-l',     label: 'Magenta',   base: '#F8EEF6', s: '#F0E5EE', s2: '#E9DAE7', b: '#D6C8D4' },
  { key: 'yel-l',     label: 'Lemon',     base: '#F8F8EE', s: '#F0F0E5', s2: '#E9E9DA', b: '#D6D6C4' },
  { key: 'red-l',     label: 'Red',       base: '#F8EEEE', s: '#F0E5E5', s2: '#E9DADA', b: '#D6C4C4' },
  { key: 'grn-l',     label: 'Green',     base: '#EEF8EE', s: '#E5F0E5', s2: '#DAE9DA', b: '#C4D6C4' },
  { key: 'blu-l',     label: 'Blue',      base: '#EEF0F8', s: '#E5E8F0', s2: '#DAE0E9', b: '#C4CCD6' },
  { key: 'vio-l',     label: 'Violet',    base: '#F2EEF8', s: '#EAE5F0', s2: '#E2DAE9', b: '#CFC8D6' },
  { key: 'org-l',     label: 'Orange',    base: '#F8F2EE', s: '#F0EAE5', s2: '#E9E0DA', b: '#D6CCC4' },
];

// ── Dark Tone Presets (16) ──────────────────────────

export const DARK_TONES: TonePreset[] = [
  { key: 'coal-warm', label: 'Warm',      base: '#161412', s: '#201C18', s2: '#2A2420', b: '#3C342C' },
  { key: 'coal-cool', label: 'Cool',      base: '#141618', s: '#1E2024', s2: '#282C30', b: '#383E44' },
  { key: 'obsidian',  label: 'Obsidian',  base: '#121212', s: '#1C1C1C', s2: '#262626', b: '#363636' },
  { key: 'raven',     label: 'Raven',     base: '#0F0E0D', s: '#191714', s2: '#231F1C', b: '#302C28' },
  { key: 'void',      label: 'Void',      base: '#0D0D0E', s: '#171718', s2: '#212122', b: '#2E2E30' },
  { key: 'graphite',  label: 'Graphite',  base: '#111213', s: '#1B1C1D', s2: '#252627', b: '#343536' },
  { key: 'onyx',      label: 'Onyx',      base: '#0E0E10', s: '#181819', s2: '#222224', b: '#30303A' },
  { key: 'jet',       label: 'Jet',       base: '#0C0C0C', s: '#161616', s2: '#202020', b: '#2C2C2C' },
  { key: 'cyan-d',    label: 'Cyan',      base: '#0A1214', s: '#141C1E', s2: '#1E2628', b: '#2C3638' },
  { key: 'mag-d',     label: 'Magenta',   base: '#140A12', s: '#1E141C', s2: '#281E26', b: '#382C36' },
  { key: 'yel-d',     label: 'Lemon',     base: '#13120A', s: '#1D1C14', s2: '#27261E', b: '#38362C' },
  { key: 'red-d',     label: 'Red',       base: '#14080A', s: '#1E1214', s2: '#281C1E', b: '#382C2C' },
  { key: 'grn-d',     label: 'Green',     base: '#081408', s: '#121E12', s2: '#1C281C', b: '#2C382C' },
  { key: 'blu-d',     label: 'Blue',      base: '#080A14', s: '#12141E', s2: '#1C1E28', b: '#2C2C38' },
  { key: 'vio-d',     label: 'Violet',    base: '#0E0814', s: '#18121E', s2: '#221C28', b: '#302838' },
  { key: 'org-d',     label: 'Orange',    base: '#140E08', s: '#1E1812', s2: '#28221C', b: '#38302A' },
];

// ── Accent Presets (8) ──────────────────────────

export const ACCENTS: AccentPreset[] = [
  { key: 'cyan',    color: '#67C4D4', h: '#4AABBD' },
  { key: 'magenta', color: '#D966A8', h: '#C2498E' },
  { key: 'yellow',  color: '#D4C84A', h: '#BCB02C' },
  { key: 'red',     color: '#E07070', h: '#C85555' },
  { key: 'green',   color: '#6DC26D', h: '#52A852' },
  { key: 'blue',    color: '#6A99D4', h: '#4D80BE' },
  { key: 'violet',  color: '#9B7ECC', h: '#8264B8' },
  { key: 'orange',  color: '#E0A05A', h: '#C98740' },
];

// ── Color Math Helpers ──────────────────────────

export function hexToRgb(hex: string): RGB {
  return { r: parseInt(hex.slice(1, 3), 16), g: parseInt(hex.slice(3, 5), 16), b: parseInt(hex.slice(5, 7), 16) };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(c => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0')).join('');
}

export function darken(hex: string, amt: number): string {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r * (1 - amt), g * (1 - amt), b * (1 - amt));
}

export function lighten(hex: string, amt: number): string {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r + (255 - r) * amt, g + (255 - g) * amt, b + (255 - b) * amt);
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = 0, s = 0;
  const l = (mx + mn) / 2;
  if (d > 0) {
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    if (mx === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (mx === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  h /= 360; s /= 100; l /= 100;
  if (s === 0) { const v = Math.round(l * 255); return { r: v, g: v, b: v }; }
  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}

export function desaturate(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  const hsl = rgbToHsl(r, g, b);
  hsl.s = Math.max(0, hsl.s * (1 - amount));
  const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}
