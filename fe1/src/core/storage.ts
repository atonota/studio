/**
 * @module core/storage
 * Typed localStorage wrapper with ap_ prefix convention.
 * Replaces scattered localStorage calls across stores and init scripts.
 * All keys are auto-prefixed with 'ap_'.
 */

const PREFIX = 'ap_';

/** Read a raw string. Returns fallback if key missing. */
export function getString(key: string, fallback: string): string {
  try {
    return localStorage.getItem(PREFIX + key) ?? fallback;
  } catch {
    return fallback;
  }
}

/** Read an integer. Returns fallback if NaN or missing. */
export function getInt(key: string, fallback: number): number {
  const raw = localStorage.getItem(PREFIX + key);
  if (raw === null) return fallback;
  const v = parseInt(raw, 10);
  return isNaN(v) ? fallback : v;
}

/** Read a float. Returns fallback if NaN or missing. */
export function getFloat(key: string, fallback: number): number {
  const raw = localStorage.getItem(PREFIX + key);
  if (raw === null) return fallback;
  const v = parseFloat(raw);
  return isNaN(v) ? fallback : v;
}

/**
 * Read a boolean.
 * Normal: 'true' → true, anything else → fallback.
 * Inverted (opts.invert): 'false' → false, anything else (including missing) → fallback.
 * Used by skeleton_anim / entrance_anim which store inverted values.
 */
export function getBool(key: string, fallback: boolean, opts?: { invert?: boolean }): boolean {
  const raw = localStorage.getItem(PREFIX + key);
  if (raw === null) return fallback;
  if (opts?.invert) {
    return raw !== 'false';
  }
  return raw === 'true';
}

/** Write a value. Strings stored directly, others via String(). */
export function set(key: string, value: unknown): void {
  try {
    localStorage.setItem(PREFIX + key, String(value));
  } catch { /* quota exceeded — silently fail */ }
}

/** Remove a key. */
export function remove(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch { /* ignore */ }
}

/**
 * Subscribe to cross-tab changes for a specific key.
 * Returns an unsubscribe function.
 */
export function subscribe(key: string, cb: (newVal: string | null) => void): () => void {
  const prefixedKey = PREFIX + key;
  const handler = (e: StorageEvent): void => {
    if (e.key === prefixedKey) {
      cb(e.newValue);
    }
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}

/** Return all ap_* keys as a Record (used by ThemeStore.exportTheme). */
export function getAll(): Record<string, string> {
  const result: Record<string, string> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(PREFIX)) {
        const v = localStorage.getItem(k);
        if (v !== null) result[k] = v;
      }
    }
  } catch { /* ignore */ }
  return result;
}

/** Batch-write multiple keys (used by ThemeStore.importTheme). Keys must include ap_ prefix. */
export function setAll(data: Record<string, string | null>): void {
  try {
    Object.entries(data).forEach(([k, v]) => {
      if (k.startsWith(PREFIX)) {
        if (v !== null) localStorage.setItem(k, v);
        else localStorage.removeItem(k);
      }
    });
  } catch { /* quota exceeded */ }
}
