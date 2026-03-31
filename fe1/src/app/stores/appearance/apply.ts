/**
 * @module stores/appearance/apply
 * CSS custom property application — tone, accent, blur, chrome bg.
 */

import type { TonePreset } from '../../../shared/types';
import { LIGHT_TONES, DARK_TONES, ACCENTS, hexToRgb, darken, lighten, desaturate } from './presets';
import { state } from './state';

const R = document.documentElement;

export function applyToneVars(t: TonePreset): void {
  R.style.setProperty('--color-bg-base', t.base);
  R.style.setProperty('--color-bg-elevated', t.s);
  R.style.setProperty('--color-bg-sunken', t.s2);
  R.style.setProperty('--color-border-default', t.b);
  R.style.setProperty('--base', t.base);
  R.style.setProperty('--surface', t.s);
  R.style.setProperty('--surface-2', t.s2);
  R.style.setProperty('--border', t.b);

  const isDark = R.classList.contains('dark');
  const railBg = isDark ? darken(desaturate(t.s, 0.35), 0.06) : lighten(desaturate(t.s, 0.35), 0.04);
  R.style.setProperty('--rail-bg', railBg);
  R.style.setProperty('--wide-bg', t.s);

  if (isDark) {
    const autoChrome = darken(t.base, 0.15);
    R.style.setProperty('--chrome-bg-auto', autoChrome);
    R.style.setProperty('--chrome-bg', autoChrome);
  } else {
    const chromeFallback = state.chromeBg || '#171a1d';
    R.style.setProperty('--chrome-bg-auto', '#171a1d');
    R.style.setProperty('--chrome-bg', chromeFallback);
  }
}

export function applyAccentVars(key: string): void {
  const a = ACCENTS.find(x => x.key === key) ?? ACCENTS[6];
  if (!a) return;
  const { r, g, b } = hexToRgb(a.color);
  const isDark = R.classList.contains('dark');

  R.style.setProperty('--color-primary', a.color);
  R.style.setProperty('--color-primary-hover', a.h);
  R.style.setProperty('--_primary-rgb', `${r}, ${g}, ${b}`);
  R.style.setProperty('--color-primary-soft', `rgba(${r},${g},${b},${isDark ? 0.10 : 0.15})`);
  R.style.setProperty('--color-primary-muted', `rgba(${r},${g},${b},${isDark ? 0.20 : 0.25})`);
  R.style.setProperty('--accent', a.color);
  R.style.setProperty('--accent-h', a.h);
  R.style.setProperty('--accent-soft', `rgba(${r},${g},${b},${isDark ? 0.08 : 0.12})`);
  R.style.setProperty('--accent-muted', `rgba(${r},${g},${b},${isDark ? 0.16 : 0.22})`);

  const railAccent = desaturate(a.color, 0.45);
  const railRgb = hexToRgb(railAccent);
  R.style.setProperty('--rail-accent', railAccent);
  R.style.setProperty('--rail-accent-soft', `rgba(${railRgb.r},${railRgb.g},${railRgb.b},0.12)`);
  R.style.setProperty('--wide-accent', a.color);
  R.style.setProperty('--wide-accent-soft', `rgba(${r},${g},${b},0.12)`);
}

export function applyMode(m: string): void {
  const isDark = m === 'dark';
  R.classList.toggle('dark', isDark);
  const presets = isDark ? DARK_TONES : LIGHT_TONES;
  const key = isDark ? state.darkTone : state.lightTone;
  const customHex = isDark ? state.customDark : state.customLight;

  if (key === 'custom' && customHex) {
    if (isDark) {
      applyToneVars({ key: 'custom', label: 'Custom', base: customHex, s: lighten(customHex, 0.04), s2: lighten(customHex, 0.1), b: lighten(customHex, 0.2) });
    } else {
      applyToneVars({ key: 'custom', label: 'Custom', base: customHex, s: darken(customHex, 0.04), s2: darken(customHex, 0.09), b: darken(customHex, 0.17) });
    }
    return;
  }
  const tone = presets.find(p => p.key === key) ?? presets[0];
  if (tone) applyToneVars(tone);
}

export function applyBlur(): void {
  R.style.setProperty('--blur-level', state.blurLevel + 'px');
}

export function applyChromeBg(): void {
  if (state.mode === 'light' && state.chromeBg) {
    R.style.setProperty('--chrome-bg', state.chromeBg);
  }
}

export function getChromeBgResolved(): string {
  if (state.mode === 'dark') {
    return R.style.getPropertyValue('--chrome-bg-auto').trim() || '#131110';
  }
  return state.chromeBg || '#171a1d';
}
