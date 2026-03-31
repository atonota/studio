/**
 * @module stores/appearance/state
 * Appearance state object, localStorage persistence, event bus.
 */

import type { AppearanceState } from '../../../shared/types';
import { createEventBus } from '../../../core/event-bus';
import type { EventCallback } from '../../../core/event-bus';

export const bus = createEventBus();
export const on = bus.on;
export const off = bus.off;
export const emit = bus.emit;

const PREFIX = 'ap_';

export let state: AppearanceState = {
  mode: 'dark',
  lightTone: 'milk',
  darkTone: 'coal-warm',
  accentDark: 'violet',
  accentLight: 'violet',
  customLight: null,
  customDark: null,
  blurLevel: 6,
  chromeBg: null,
};

export function load(): void {
  try {
    // Respect OS color scheme on first visit (no stored preference)
    const storedMode = localStorage.getItem(PREFIX + 'mode');
    if (storedMode) {
      state.mode = storedMode as 'dark' | 'light';
    } else {
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true;
      state.mode = prefersDark ? 'dark' : 'light';
    }
    state.lightTone = localStorage.getItem(PREFIX + 'light_tone') || 'milk';
    state.darkTone = localStorage.getItem(PREFIX + 'dark_tone') || 'coal-warm';
    // Schema migration: ap_accent (v1) → ap_accent_dark + ap_accent_light (v2)
    const legacyAccent = localStorage.getItem(PREFIX + 'accent') || null;
    state.accentDark = localStorage.getItem(PREFIX + 'accent_dark') || legacyAccent || 'violet';
    state.accentLight = localStorage.getItem(PREFIX + 'accent_light') || legacyAccent || 'violet';
    if (legacyAccent) {
      localStorage.setItem(PREFIX + 'accent_dark', state.accentDark);
      localStorage.setItem(PREFIX + 'accent_light', state.accentLight);
      localStorage.removeItem(PREFIX + 'accent');
    }
    state.customLight = localStorage.getItem(PREFIX + 'custom_light') || null;
    state.customDark = localStorage.getItem(PREFIX + 'custom_dark') || null;
    const bl = localStorage.getItem(PREFIX + 'blur');
    state.blurLevel = bl !== null ? parseInt(bl, 10) : 6;
    state.chromeBg = localStorage.getItem(PREFIX + 'chrome_bg') || null;
  } catch {
    console.warn('AppearanceStore: localStorage read failed, using defaults');
  }
}

export function save(): void {
  try {
    localStorage.setItem(PREFIX + 'schema_v', '2');
    localStorage.setItem(PREFIX + 'mode', state.mode);
    localStorage.setItem(PREFIX + 'light_tone', state.lightTone);
    localStorage.setItem(PREFIX + 'dark_tone', state.darkTone);
    localStorage.setItem(PREFIX + 'accent_dark', state.accentDark);
    localStorage.setItem(PREFIX + 'accent_light', state.accentLight);
    if (state.customLight) localStorage.setItem(PREFIX + 'custom_light', state.customLight);
    else localStorage.removeItem(PREFIX + 'custom_light');
    if (state.customDark) localStorage.setItem(PREFIX + 'custom_dark', state.customDark);
    else localStorage.removeItem(PREFIX + 'custom_dark');
    localStorage.setItem(PREFIX + 'blur', String(state.blurLevel));
    if (state.chromeBg) localStorage.setItem(PREFIX + 'chrome_bg', state.chromeBg);
    else localStorage.removeItem(PREFIX + 'chrome_bg');
  } catch { /* ignore */ }
}

export function getState(): AppearanceState {
  return { ...state };
}

// Re-export EventCallback for consumers
export type { EventCallback };
