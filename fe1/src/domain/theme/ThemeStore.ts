/**
 * @module domain/theme/ThemeStore
 * OOP ThemeStore — private state, HistoryManager, event bus.
 * Replaces module-level let state + implicit undo/redo.
 */

import type { ThemeState, ThemeStoreAPI, ThemeCategory, ThemePresetKey, ImportResult } from '../../shared/types';
import { createEventBus } from '../../core/event-bus';
import type { EventCallback } from '../../core/event-bus';
import { HistoryManager } from './HistoryManager';
import {
  FONTS, CODE_FONTS, EASING_PRESETS, THEME_PRESETS,
  DEFAULTS, CATEGORIES, VALID_ENUMS,
} from '../../app/stores/theme/presets';
import { loadFont, validateCss } from '../../app/stores/theme/apply';

const PREFIX = 'ap_';
const R = document.documentElement;

export class ThemeStore {
  private state: ThemeState;
  private bus = createEventBus();
  private history = new HistoryManager<ThemeState>();

  constructor() {
    this.state = JSON.parse(JSON.stringify(DEFAULTS));
  }

  // ── Public API ──────────────────────────

  apply(): void {
    this.load();
    this.applyAll();
    this.history.push(this.state);
    this.bus.emit('any-change', { state: this.getState() });
  }

  getState(): ThemeState { return JSON.parse(JSON.stringify(this.state)); }
  getDefaults(): ThemeState { return JSON.parse(JSON.stringify(DEFAULTS)); }

  set(key: string, value: unknown): void {
    if (!(key in this.state)) return;
    if (VALID_ENUMS[key] && VALID_ENUMS[key]!.indexOf(String(value)) === -1) return;
    this.history.push(this.state);
    (this.state as unknown as Record<string, unknown>)[key] = value;
    this.save(); this.applyAll();
    this.bus.emit(key + '-change', { key, value });
    this.bus.emit('any-change', { state: this.getState() });
  }

  resetAll(): void {
    this.history.push(this.state);
    this.state = JSON.parse(JSON.stringify(DEFAULTS));
    this.save(); this.applyAll();
    this.bus.emit('reset', {});
    this.bus.emit('any-change', { state: this.getState() });
  }

  resetCategory(cat: ThemeCategory): void {
    const keys = CATEGORIES[cat];
    if (!keys) return;
    this.history.push(this.state);
    keys.forEach(k => {
      (this.state as unknown as Record<string, unknown>)[k] = (DEFAULTS as unknown as Record<string, unknown>)[k];
    });
    this.save(); this.applyAll();
    this.bus.emit('category-reset', { category: cat });
    this.bus.emit('any-change', { state: this.getState() });
  }

  getChangedKeys(): string[] {
    return Object.keys(DEFAULTS).filter(k =>
      JSON.stringify((this.state as unknown as Record<string, unknown>)[k]) !==
      JSON.stringify((DEFAULTS as unknown as Record<string, unknown>)[k])
    );
  }

  undo(): boolean {
    const prev = this.history.undo();
    if (!prev) return false;
    this.history.lock();
    this.state = prev;
    this.save(); this.applyAll();
    this.history.unlock();
    this.bus.emit('undo', { index: this.history.currentIndex });
    this.bus.emit('any-change', { state: this.getState() });
    return true;
  }

  redo(): boolean {
    const next = this.history.redo();
    if (!next) return false;
    this.history.lock();
    this.state = next;
    this.save(); this.applyAll();
    this.history.unlock();
    this.bus.emit('redo', { index: this.history.currentIndex });
    this.bus.emit('any-change', { state: this.getState() });
    return true;
  }

  canUndo(): boolean { return this.history.canUndo; }
  canRedo(): boolean { return this.history.canRedo; }

  on(event: string, cb: EventCallback): void { this.bus.on(event, cb); }
  off(event: string, cb: EventCallback): void { this.bus.off(event, cb); }

  exportTheme(): string {
    const data: Record<string, string | null> = { _schema: '2', _exported: new Date().toISOString(), _platform: 'atonota-studio' };
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(PREFIX)) data[k] = localStorage.getItem(k);
    }
    return JSON.stringify(data, null, 2);
  }

  importTheme(json: string): ImportResult {
    try {
      const data = JSON.parse(json) as Record<string, string>;
      this.history.push(this.state);
      let count = 0;
      Object.keys(data).forEach(k => {
        if (k.startsWith(PREFIX)) { localStorage.setItem(k, data[k] ?? ''); count++; }
      });
      this.load(); this.applyAll();
      if (window.AppearanceStore) window.AppearanceStore.apply();
      this.bus.emit('import', { count });
      this.bus.emit('any-change', { state: this.getState() });
      return { ok: true, count };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : String(e) };
    }
  }

  applyPreset(key: ThemePresetKey): void {
    const presets: Record<string, Partial<ThemeState>> = {
      'default': {},
      'minimal': { radius: 2, shadowScale: 0, glassOpacity: 0, motionScale: 0.5, cardStyle: 'flat', buttonStyle: 'sharp', inputStyle: 'underline' },
      'glass': { radius: 16, shadowScale: 0.5, glassOpacity: 0.08, backdropOpacity: 0.6, cardStyle: 'glass', buttonStyle: 'rounded', inputStyle: 'filled' },
      'compact': { fontSize: 13, railW: 72, wideW: 200, topH: 64, compact: true, contentPadding: 0.75, buttonStyle: 'sharp', inputStyle: 'filled' },
      'contrast': { radius: 4, shadowScale: 1.5, fontSize: 16, fontWeightBody: 400, cardStyle: 'elevated', buttonStyle: 'sharp', inputStyle: 'bordered' },
    };
    const p = presets[key];
    if (!p) return;
    this.history.push(this.state);
    this.state = JSON.parse(JSON.stringify(DEFAULTS));
    Object.entries(p).forEach(([k, v]) => { (this.state as unknown as Record<string, unknown>)[k] = v; });
    this.save(); this.applyAll();
    this.bus.emit('preset-change', { key });
    this.bus.emit('any-change', { state: this.getState() });
  }

  // ── Private ──────────────────────────

  private load(): void {
    try {
      const g = (k: string, d: string): string => localStorage.getItem(PREFIX + k) || d;
      const gi = (k: string, d: number): number => { const v = parseInt(localStorage.getItem(PREFIX + k) || '', 10); return isNaN(v) ? d : v; };
      const gf = (k: string, d: number): number => { const v = parseFloat(localStorage.getItem(PREFIX + k) || ''); return isNaN(v) ? d : v; };
      const gb = (k: string, d: boolean, inv = false): boolean => {
        const raw = localStorage.getItem(PREFIX + k);
        if (raw === null) return d;
        return inv ? raw !== 'false' : raw === 'true';
      };
      const s = this.state;
      s.fontFamily = g('font_family', DEFAULTS.fontFamily);
      s.fontSize = gi('font_size', DEFAULTS.fontSize);
      s.fontWeightBody = gi('font_weight_body', DEFAULTS.fontWeightBody);
      s.fontWeightHeading = gi('font_weight_heading', DEFAULTS.fontWeightHeading);
      s.letterSpacing = gf('letter_spacing', DEFAULTS.letterSpacing);
      s.lineHeight = gf('line_height', DEFAULTS.lineHeight);
      s.fontCode = g('font_code', DEFAULTS.fontCode);
      s.railW = gi('rail_w', DEFAULTS.railW); s.wideW = gi('wide_w', DEFAULTS.wideW);
      s.topH = gi('top_h', DEFAULTS.topH);
      s.contentPadding = gf('content_padding', DEFAULTS.contentPadding);
      s.contentMaxW = g('content_max_w', DEFAULTS.contentMaxW);
      s.compact = gb('compact', DEFAULTS.compact);
      s.sidebarDefault = g('sidebar_default', DEFAULTS.sidebarDefault);
      s.radius = gi('radius', DEFAULTS.radius);
      s.shadowScale = gf('shadow_scale', DEFAULTS.shadowScale);
      s.cardStyle = g('card_style', DEFAULTS.cardStyle);
      s.buttonStyle = g('button_style', DEFAULTS.buttonStyle);
      s.inputStyle = g('input_style', DEFAULTS.inputStyle);
      s.motionScale = gf('motion_scale', DEFAULTS.motionScale);
      s.motionEasing = g('motion_easing', DEFAULTS.motionEasing);
      s.reducedMotion = gb('reduced_motion', DEFAULTS.reducedMotion);
      s.skeletonAnim = gb('skeleton_anim', DEFAULTS.skeletonAnim, true);
      s.entranceAnim = gb('entrance_anim', DEFAULTS.entranceAnim, true);
      s.glassOpacity = gf('glass_opacity', DEFAULTS.glassOpacity);
      s.backdropOpacity = gf('backdrop_opacity', DEFAULTS.backdropOpacity);
      s.panelOpacity = gf('panel_opacity', DEFAULTS.panelOpacity);
      s.customCss = g('custom_css', '');
    } catch { /* defaults */ }
  }

  private save(): void {
    try {
      const s = this.state;
      const entries: [string, string][] = [
        ['font_family', s.fontFamily], ['font_size', String(s.fontSize)],
        ['font_weight_body', String(s.fontWeightBody)], ['font_weight_heading', String(s.fontWeightHeading)],
        ['letter_spacing', String(s.letterSpacing)], ['line_height', String(s.lineHeight)],
        ['font_code', s.fontCode], ['rail_w', String(s.railW)], ['wide_w', String(s.wideW)],
        ['top_h', String(s.topH)], ['content_padding', String(s.contentPadding)],
        ['content_max_w', s.contentMaxW], ['compact', String(s.compact)],
        ['sidebar_default', s.sidebarDefault], ['radius', String(s.radius)],
        ['shadow_scale', String(s.shadowScale)], ['card_style', s.cardStyle],
        ['button_style', s.buttonStyle], ['input_style', s.inputStyle],
        ['motion_scale', String(s.motionScale)], ['motion_easing', s.motionEasing],
        ['reduced_motion', String(s.reducedMotion)], ['skeleton_anim', String(s.skeletonAnim)],
        ['entrance_anim', String(s.entranceAnim)], ['glass_opacity', String(s.glassOpacity)],
        ['backdrop_opacity', String(s.backdropOpacity)], ['panel_opacity', String(s.panelOpacity)],
      ];
      entries.forEach(([k, v]) => localStorage.setItem(PREFIX + k, v));
      if (s.customCss) localStorage.setItem(PREFIX + 'custom_css', s.customCss);
      else localStorage.removeItem(PREFIX + 'custom_css');
    } catch { /* ignore */ }
  }

  private applyAll(): void {
    const s = this.state;

    // Typography
    R.style.setProperty('--font-family-body', loadFont(s.fontFamily, FONTS));
    R.style.setProperty('--font-family-code', loadFont(s.fontCode, CODE_FONTS));
    R.style.setProperty('--font-size-base', s.fontSize + 'px');
    R.style.setProperty('--font-scale', String(s.fontSize / 15));
    R.style.setProperty('--font-weight-body', String(s.fontWeightBody));
    R.style.setProperty('--font-weight-heading', String(s.fontWeightHeading));
    R.style.setProperty('--letter-spacing-base', s.letterSpacing + 'em');
    R.style.setProperty('--line-height-base', String(s.lineHeight));

    // Layout
    R.style.setProperty('--rail-w', s.railW + 'px');
    R.style.setProperty('--wide-w', s.wideW + 'px');
    R.style.setProperty('--top-h', s.topH + 'px');
    R.style.setProperty('--content-padding-scale', String(s.contentPadding));
    R.style.setProperty('--content-max-w', s.contentMaxW);
    R.style.setProperty('--spacing-scale', s.compact ? '0.8' : '1');

    // Components
    R.style.setProperty('--radius-base', s.radius + 'px');
    R.style.setProperty('--radius-sm', Math.round(s.radius * 0.6) + 'px');
    R.style.setProperty('--radius-lg', Math.round(s.radius * 1.4) + 'px');
    R.style.setProperty('--radius-xl', Math.round(s.radius * 1.6) + 'px');
    R.style.setProperty('--shadow-scale', String(s.shadowScale));
    R.setAttribute('data-card-style', s.cardStyle);
    R.setAttribute('data-button-style', s.buttonStyle);
    R.setAttribute('data-input-style', s.inputStyle);

    // Motion
    R.style.setProperty('--motion-scale', String(s.motionScale));
    const easing = EASING_PRESETS.find(e => e.key === s.motionEasing) ?? EASING_PRESETS[0];
    R.style.setProperty('--motion-easing', easing?.value ?? 'cubic-bezier(0.4, 0, 0.2, 1)');

    // Glass
    R.style.setProperty('--glass-opacity', String(s.glassOpacity));
    R.style.setProperty('--backdrop-opacity', String(s.backdropOpacity));
    const isDark = R.classList.contains('dark');
    R.style.setProperty('--color-glass-panel', isDark
      ? `rgba(30,26,20,${s.panelOpacity.toFixed(2)})`
      : `rgba(255,255,255,${s.panelOpacity.toFixed(2)})`);

    // Custom CSS
    let styleEl = document.getElementById('ap-custom-css');
    if (s.customCss) {
      const safeCss = validateCss(s.customCss);
      if (!styleEl) { styleEl = document.createElement('style'); styleEl.id = 'ap-custom-css'; document.head.appendChild(styleEl); }
      styleEl.textContent = safeCss;
    } else if (styleEl) { styleEl.remove(); }
  }

  // ── Compat ──────────────────────────

  toAPI(): ThemeStoreAPI {
    return {
      apply: () => this.apply(),
      getState: () => this.getState(),
      getDefaults: () => this.getDefaults(),
      set: (k, v) => this.set(k, v),
      resetAll: () => this.resetAll(),
      resetCategory: c => this.resetCategory(c),
      getChangedKeys: () => this.getChangedKeys(),
      undo: () => this.undo(),
      redo: () => this.redo(),
      canUndo: () => this.canUndo(),
      canRedo: () => this.canRedo(),
      exportTheme: () => this.exportTheme(),
      importTheme: j => this.importTheme(j),
      applyPreset: k => this.applyPreset(k),
      on: (e, cb) => this.on(e, cb),
      off: (e, cb) => this.off(e, cb),
      FONTS, CODE_FONTS, EASING_PRESETS, THEME_PRESETS, CATEGORIES, DEFAULTS,
    };
  }
}
