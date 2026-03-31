/**
 * @module core/i18n
 * Lightweight string catalogue — no external library.
 * Default locale: Turkish (tr). First target: English (en).
 * Usage: t('nav.seo') → 'SEO', t('time.minutesAgo', { n: 5 }) → '5 dk once'
 */

import { tr } from './locales/tr';
import { en } from './locales/en';

type LocaleCode = 'tr' | 'en';

const LOCALES: Record<LocaleCode, Record<string, string>> = { tr, en };
let currentLocale: LocaleCode = 'tr';
let currentMap: Record<string, string> = tr;

/**
 * Translate a key with optional interpolation.
 * @param key - Dot-notation key (e.g., 'nav.seo', 'time.minutesAgo')
 * @param params - Interpolation values (e.g., { n: 5 })
 * @returns Translated string, or the key itself if not found
 */
export function t(key: string, params?: Record<string, string | number>): string {
  let result: string = currentMap[key] ?? tr[key] ?? key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      result = result.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v));
    });
  }
  return result;
}

/** Switch to a different locale. */
export function loadLocale(code: LocaleCode): void {
  if (LOCALES[code]) {
    currentLocale = code;
    currentMap = LOCALES[code];
    // Persist preference
    try { localStorage.setItem('ap_locale', code); } catch { /* ignore */ }
  }
}

/** Get the current locale code. */
export function getLocale(): LocaleCode {
  return currentLocale;
}

/** Initialize locale from localStorage (called at import time). */
function initLocale(): void {
  try {
    const stored = localStorage.getItem('ap_locale') as LocaleCode | null;
    if (stored && LOCALES[stored]) {
      currentLocale = stored;
      currentMap = LOCALES[stored];
    }
  } catch { /* ignore */ }
}

// Auto-init on module load
initLocale();
