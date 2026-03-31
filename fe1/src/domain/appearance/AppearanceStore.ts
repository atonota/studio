/**
 * @module domain/appearance/AppearanceStore
 * OOP AppearanceStore — private state, constructor DI, event bus.
 * Replaces module-level let state + closure functions.
 * window.AppearanceStore compat layer applied externally.
 */

import type { AppearanceState, TonePreset, AppearanceStoreAPI } from '../../shared/types';
import { createEventBus } from '../../core/event-bus';
import type { EventCallback } from '../../core/event-bus';
import {
  LIGHT_TONES, DARK_TONES, ACCENTS,
  hexToRgb, rgbToHex, darken, lighten, desaturate,
} from '../../app/stores/appearance/presets';

const PREFIX = 'ap_';
const R = document.documentElement;

export class AppearanceStore {
  private state: AppearanceState;
  private bus = createEventBus();

  constructor() {
    this.state = {
      mode: 'dark', lightTone: 'milk', darkTone: 'coal-warm',
      accentDark: 'violet', accentLight: 'violet',
      customLight: null, customDark: null, blurLevel: 6, chromeBg: null,
    };
  }

  // ── Public API ──────────────────────────

  getState(): AppearanceState { return { ...this.state }; }

  apply(): void {
    this.load();
    this.applyMode(this.state.mode);
    this.applyAccentVars(this.state.mode === 'dark' ? this.state.accentDark : this.state.accentLight);
    this.applyBlur();
    this.applyChromeBg();
    this.bus.emit('any-change', { state: this.getState() });
  }

  on(event: string, cb: EventCallback): void { this.bus.on(event, cb); }
  off(event: string, cb: EventCallback): void { this.bus.off(event, cb); }

  setMode(m: 'dark' | 'light'): void {
    this.state.mode = m; this.save(); this.applyMode(m);
    this.applyAccentVars(m === 'dark' ? this.state.accentDark : this.state.accentLight);
    this.bus.emit('mode-change', { mode: m });
    this.bus.emit('any-change', { state: this.getState() });
  }

  setLightTone(key: string): void {
    this.state.lightTone = key; this.save();
    if (this.state.mode === 'light') this.applyMode('light');
    this.bus.emit('tone-change', { mode: 'light', tone: key });
    this.bus.emit('any-change', { state: this.getState() });
  }

  setDarkTone(key: string): void {
    this.state.darkTone = key; this.save();
    if (this.state.mode === 'dark') this.applyMode('dark');
    this.bus.emit('tone-change', { mode: 'dark', tone: key });
    this.bus.emit('any-change', { state: this.getState() });
  }

  /** @deprecated Use setAccentDark / setAccentLight */
  setAccent(key: string): void {
    this.state.accentDark = key; this.state.accentLight = key; this.save();
    this.applyAccentVars(key);
    this.bus.emit('accent-change', { key });
    this.bus.emit('any-change', { state: this.getState() });
  }

  setAccentDark(key: string): void {
    this.state.accentDark = key; this.save();
    if (this.state.mode === 'dark') this.applyAccentVars(key);
    this.bus.emit('accent-change', { mode: 'dark', key });
    this.bus.emit('any-change', { state: this.getState() });
  }

  setAccentLight(key: string): void {
    this.state.accentLight = key; this.save();
    if (this.state.mode === 'light') this.applyAccentVars(key);
    this.bus.emit('accent-change', { mode: 'light', key });
    this.bus.emit('any-change', { state: this.getState() });
  }

  setCustomLight(hex: string): void {
    this.state.customLight = hex; this.state.lightTone = 'custom'; this.save();
    if (this.state.mode === 'light') this.applyMode('light');
    this.bus.emit('tone-change', { mode: 'light', tone: 'custom' });
    this.bus.emit('any-change', { state: this.getState() });
  }

  setCustomDark(hex: string): void {
    this.state.customDark = hex; this.state.darkTone = 'custom'; this.save();
    if (this.state.mode === 'dark') this.applyMode('dark');
    this.bus.emit('tone-change', { mode: 'dark', tone: 'custom' });
    this.bus.emit('any-change', { state: this.getState() });
  }

  setBlur(level: number): void {
    this.state.blurLevel = Math.max(0, Math.min(20, parseInt(String(level), 10) || 0));
    this.save(); this.applyBlur();
    this.bus.emit('blur-change', { level: this.state.blurLevel });
    this.bus.emit('any-change', { state: this.getState() });
  }

  setChromeBg(hex: string | null): void {
    this.state.chromeBg = hex || null; this.save();
    if (this.state.chromeBg) this.applyChromeBg(); else this.applyMode(this.state.mode);
    this.bus.emit('chrome-change', { color: this.getChromeBgResolved() });
    this.bus.emit('any-change', { state: this.getState() });
  }

  getChromeBgResolved(): string {
    if (this.state.mode === 'dark') return R.style.getPropertyValue('--chrome-bg-auto').trim() || '#131110';
    return this.state.chromeBg || '#171a1d';
  }

  // ── Persistence (private) ──────────────────────────

  private load(): void {
    try {
      const storedMode = localStorage.getItem(PREFIX + 'mode');
      if (storedMode) {
        this.state.mode = storedMode as 'dark' | 'light';
      } else {
        const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true;
        this.state.mode = prefersDark ? 'dark' : 'light';
      }
      this.state.lightTone = localStorage.getItem(PREFIX + 'light_tone') || 'milk';
      this.state.darkTone = localStorage.getItem(PREFIX + 'dark_tone') || 'coal-warm';
      const legacy = localStorage.getItem(PREFIX + 'accent') || null;
      this.state.accentDark = localStorage.getItem(PREFIX + 'accent_dark') || legacy || 'violet';
      this.state.accentLight = localStorage.getItem(PREFIX + 'accent_light') || legacy || 'violet';
      if (legacy) {
        localStorage.setItem(PREFIX + 'accent_dark', this.state.accentDark);
        localStorage.setItem(PREFIX + 'accent_light', this.state.accentLight);
        localStorage.removeItem(PREFIX + 'accent');
      }
      this.state.customLight = localStorage.getItem(PREFIX + 'custom_light') || null;
      this.state.customDark = localStorage.getItem(PREFIX + 'custom_dark') || null;
      const bl = localStorage.getItem(PREFIX + 'blur');
      this.state.blurLevel = bl !== null ? parseInt(bl, 10) : 6;
      this.state.chromeBg = localStorage.getItem(PREFIX + 'chrome_bg') || null;
    } catch { /* defaults */ }
  }

  private save(): void {
    try {
      localStorage.setItem(PREFIX + 'schema_v', '2');
      localStorage.setItem(PREFIX + 'mode', this.state.mode);
      localStorage.setItem(PREFIX + 'light_tone', this.state.lightTone);
      localStorage.setItem(PREFIX + 'dark_tone', this.state.darkTone);
      localStorage.setItem(PREFIX + 'accent_dark', this.state.accentDark);
      localStorage.setItem(PREFIX + 'accent_light', this.state.accentLight);
      if (this.state.customLight) localStorage.setItem(PREFIX + 'custom_light', this.state.customLight);
      else localStorage.removeItem(PREFIX + 'custom_light');
      if (this.state.customDark) localStorage.setItem(PREFIX + 'custom_dark', this.state.customDark);
      else localStorage.removeItem(PREFIX + 'custom_dark');
      localStorage.setItem(PREFIX + 'blur', String(this.state.blurLevel));
      if (this.state.chromeBg) localStorage.setItem(PREFIX + 'chrome_bg', this.state.chromeBg);
      else localStorage.removeItem(PREFIX + 'chrome_bg');
    } catch { /* ignore */ }
  }

  // ── CSS Application (private) ──────────────────────────

  private applyToneVars(t: TonePreset): void {
    R.style.setProperty('--color-bg-base', t.base);
    R.style.setProperty('--color-bg-elevated', t.s);
    R.style.setProperty('--color-bg-sunken', t.s2);
    R.style.setProperty('--color-border-default', t.b);
    R.style.setProperty('--base', t.base);
    R.style.setProperty('--surface', t.s);
    R.style.setProperty('--surface-2', t.s2);
    R.style.setProperty('--border', t.b);

    const isDark = R.classList.contains('dark');
    R.style.setProperty('--rail-bg', isDark ? darken(desaturate(t.s, 0.35), 0.06) : lighten(desaturate(t.s, 0.35), 0.04));
    R.style.setProperty('--wide-bg', t.s);

    if (isDark) {
      const auto = darken(t.base, 0.15);
      R.style.setProperty('--chrome-bg-auto', auto);
      R.style.setProperty('--chrome-bg', auto);
    } else {
      R.style.setProperty('--chrome-bg-auto', '#171a1d');
      R.style.setProperty('--chrome-bg', this.state.chromeBg || '#171a1d');
    }
  }

  private applyAccentVars(key: string): void {
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

    const rail = desaturate(a.color, 0.45);
    const rr = hexToRgb(rail);
    R.style.setProperty('--rail-accent', rail);
    R.style.setProperty('--rail-accent-soft', `rgba(${rr.r},${rr.g},${rr.b},0.12)`);
    R.style.setProperty('--wide-accent', a.color);
    R.style.setProperty('--wide-accent-soft', `rgba(${r},${g},${b},0.12)`);
  }

  private applyMode(m: string): void {
    const isDark = m === 'dark';
    R.classList.toggle('dark', isDark);
    const presets = isDark ? DARK_TONES : LIGHT_TONES;
    const key = isDark ? this.state.darkTone : this.state.lightTone;
    const custom = isDark ? this.state.customDark : this.state.customLight;

    if (key === 'custom' && custom) {
      const tone: TonePreset = isDark
        ? { key: 'custom', label: 'Custom', base: custom, s: lighten(custom, 0.04), s2: lighten(custom, 0.1), b: lighten(custom, 0.2) }
        : { key: 'custom', label: 'Custom', base: custom, s: darken(custom, 0.04), s2: darken(custom, 0.09), b: darken(custom, 0.17) };
      this.applyToneVars(tone);
      return;
    }
    const tone = presets.find(p => p.key === key) ?? presets[0];
    if (tone) this.applyToneVars(tone);
  }

  private applyBlur(): void {
    R.style.setProperty('--blur-level', this.state.blurLevel + 'px');
  }

  private applyChromeBg(): void {
    if (this.state.mode === 'light' && this.state.chromeBg) {
      R.style.setProperty('--chrome-bg', this.state.chromeBg);
    }
  }

  // ── Compat API (for window.AppearanceStore) ──────────────────────────

  toAPI(): AppearanceStoreAPI {
    return {
      getState: () => this.getState(),
      apply: () => this.apply(),
      on: (e, cb) => this.on(e, cb),
      off: (e, cb) => this.off(e, cb),
      setMode: m => this.setMode(m),
      setLightTone: k => this.setLightTone(k),
      setDarkTone: k => this.setDarkTone(k),
      setAccent: k => this.setAccent(k),
      setAccentDark: k => this.setAccentDark(k),
      setAccentLight: k => this.setAccentLight(k),
      setCustomLight: h => this.setCustomLight(h),
      setCustomDark: h => this.setCustomDark(h),
      setBlur: l => this.setBlur(l),
      setChromeBg: h => this.setChromeBg(h),
      getChromeBgResolved: () => this.getChromeBgResolved(),
      LIGHT_TONES, DARK_TONES, ACCENTS,
      hexToRgb, rgbToHex, darken, lighten,
    };
  }
}
