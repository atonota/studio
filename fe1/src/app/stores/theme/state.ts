/**
 * @module stores/theme/state
 * Theme state, localStorage persistence, undo/redo history, event bus.
 */

import type { ThemeState } from '../../../shared/types';
import { createEventBus } from '../../../core/event-bus';
import type { EventCallback } from '../../../core/event-bus';
import { DEFAULTS } from './presets';

export const bus = createEventBus();
export const on = bus.on;
export const off = bus.off;
export const emit = bus.emit;

const PREFIX = 'ap_';

export let state: ThemeState = JSON.parse(JSON.stringify(DEFAULTS));

export function resetState(): void {
  state = JSON.parse(JSON.stringify(DEFAULTS));
}

// ── Undo/Redo ──────────────────────────

let _history: string[] = [];
let _historyIdx = -1;
const _maxHistory = 20;
let _historyLock = false;

export function pushHistory(): void {
  if (_historyLock) return;
  if (_historyIdx < _history.length - 1) {
    _history = _history.slice(0, _historyIdx + 1);
  }
  _history.push(JSON.stringify(state));
  if (_history.length > _maxHistory) _history.shift();
  _historyIdx = _history.length - 1;
}

export function undo(applyAll: () => void): boolean {
  if (_historyIdx <= 0) return false;
  _historyIdx--;
  _historyLock = true;
  state = JSON.parse(_history[_historyIdx]!);
  save(); applyAll();
  _historyLock = false;
  emit('undo', { index: _historyIdx });
  emit('any-change', { state: getState() });
  return true;
}

export function redo(applyAll: () => void): boolean {
  if (_historyIdx >= _history.length - 1) return false;
  _historyIdx++;
  _historyLock = true;
  state = JSON.parse(_history[_historyIdx]!);
  save(); applyAll();
  _historyLock = false;
  emit('redo', { index: _historyIdx });
  emit('any-change', { state: getState() });
  return true;
}

export function canUndo(): boolean { return _historyIdx > 0; }
export function canRedo(): boolean { return _historyIdx < _history.length - 1; }

// ── Persistence ──────────────────────────

export function load(): void {
  try {
    const g = (k: string, d: string): string => localStorage.getItem(PREFIX + k) || d;
    const gi = (k: string, d: number): number => { const v = parseInt(localStorage.getItem(PREFIX + k) || '', 10); return isNaN(v) ? d : v; };
    const gf = (k: string, d: number): number => { const v = parseFloat(localStorage.getItem(PREFIX + k) || ''); return isNaN(v) ? d : v; };
    const gb = (k: string, d: boolean, invert = false): boolean => {
      const raw = localStorage.getItem(PREFIX + k);
      if (raw === null) return d;
      return invert ? raw !== 'false' : raw === 'true';
    };

    state.fontFamily = g('font_family', DEFAULTS.fontFamily);
    state.fontSize = gi('font_size', DEFAULTS.fontSize);
    state.fontWeightBody = gi('font_weight_body', DEFAULTS.fontWeightBody);
    state.fontWeightHeading = gi('font_weight_heading', DEFAULTS.fontWeightHeading);
    state.letterSpacing = gf('letter_spacing', DEFAULTS.letterSpacing);
    state.lineHeight = gf('line_height', DEFAULTS.lineHeight);
    state.fontCode = g('font_code', DEFAULTS.fontCode);
    state.railW = gi('rail_w', DEFAULTS.railW);
    state.wideW = gi('wide_w', DEFAULTS.wideW);
    state.topH = gi('top_h', DEFAULTS.topH);
    state.contentPadding = gf('content_padding', DEFAULTS.contentPadding);
    state.contentMaxW = g('content_max_w', DEFAULTS.contentMaxW);
    state.compact = gb('compact', DEFAULTS.compact);
    state.sidebarDefault = g('sidebar_default', DEFAULTS.sidebarDefault);
    state.radius = gi('radius', DEFAULTS.radius);
    state.shadowScale = gf('shadow_scale', DEFAULTS.shadowScale);
    state.cardStyle = g('card_style', DEFAULTS.cardStyle);
    state.buttonStyle = g('button_style', DEFAULTS.buttonStyle);
    state.inputStyle = g('input_style', DEFAULTS.inputStyle);
    state.motionScale = gf('motion_scale', DEFAULTS.motionScale);
    state.motionEasing = g('motion_easing', DEFAULTS.motionEasing);
    state.reducedMotion = gb('reduced_motion', DEFAULTS.reducedMotion);
    state.skeletonAnim = gb('skeleton_anim', DEFAULTS.skeletonAnim, true);
    state.entranceAnim = gb('entrance_anim', DEFAULTS.entranceAnim, true);
    state.glassOpacity = gf('glass_opacity', DEFAULTS.glassOpacity);
    state.backdropOpacity = gf('backdrop_opacity', DEFAULTS.backdropOpacity);
    state.panelOpacity = gf('panel_opacity', DEFAULTS.panelOpacity);
    state.customCss = g('custom_css', '');
  } catch {
    console.warn('ThemeStore: localStorage read failed');
  }
}

export function save(): void {
  try {
    const s = state;
    localStorage.setItem(PREFIX + 'font_family', s.fontFamily);
    localStorage.setItem(PREFIX + 'font_size', String(s.fontSize));
    localStorage.setItem(PREFIX + 'font_weight_body', String(s.fontWeightBody));
    localStorage.setItem(PREFIX + 'font_weight_heading', String(s.fontWeightHeading));
    localStorage.setItem(PREFIX + 'letter_spacing', String(s.letterSpacing));
    localStorage.setItem(PREFIX + 'line_height', String(s.lineHeight));
    localStorage.setItem(PREFIX + 'font_code', s.fontCode);
    localStorage.setItem(PREFIX + 'rail_w', String(s.railW));
    localStorage.setItem(PREFIX + 'wide_w', String(s.wideW));
    localStorage.setItem(PREFIX + 'top_h', String(s.topH));
    localStorage.setItem(PREFIX + 'content_padding', String(s.contentPadding));
    localStorage.setItem(PREFIX + 'content_max_w', s.contentMaxW);
    localStorage.setItem(PREFIX + 'compact', String(s.compact));
    localStorage.setItem(PREFIX + 'sidebar_default', s.sidebarDefault);
    localStorage.setItem(PREFIX + 'radius', String(s.radius));
    localStorage.setItem(PREFIX + 'shadow_scale', String(s.shadowScale));
    localStorage.setItem(PREFIX + 'card_style', s.cardStyle);
    localStorage.setItem(PREFIX + 'button_style', s.buttonStyle);
    localStorage.setItem(PREFIX + 'input_style', s.inputStyle);
    localStorage.setItem(PREFIX + 'motion_scale', String(s.motionScale));
    localStorage.setItem(PREFIX + 'motion_easing', s.motionEasing);
    localStorage.setItem(PREFIX + 'reduced_motion', String(s.reducedMotion));
    localStorage.setItem(PREFIX + 'skeleton_anim', String(s.skeletonAnim));
    localStorage.setItem(PREFIX + 'entrance_anim', String(s.entranceAnim));
    localStorage.setItem(PREFIX + 'glass_opacity', String(s.glassOpacity));
    localStorage.setItem(PREFIX + 'backdrop_opacity', String(s.backdropOpacity));
    localStorage.setItem(PREFIX + 'panel_opacity', String(s.panelOpacity));
    if (s.customCss) localStorage.setItem(PREFIX + 'custom_css', s.customCss);
    else localStorage.removeItem(PREFIX + 'custom_css');
  } catch { /* ignore */ }
}

export function getState(): ThemeState { return JSON.parse(JSON.stringify(state)); }
export function getDefaults(): ThemeState { return JSON.parse(JSON.stringify(DEFAULTS)); }

export type { EventCallback };
