/**
 * @module stores/theme/apply
 * CSS custom property application — typography, layout, components, motion, glass, custom CSS.
 */

import type { FontPreset } from '../../../shared/types';
import { FONTS, CODE_FONTS, EASING_PRESETS } from './presets';
import { state } from './state';

const R = document.documentElement;

export function loadFont(key: string, presets: FontPreset[]): string {
  const p = presets.find(f => f.key === key) ?? presets[0];
  if (!p) return '';
  if (p.cdn && !document.getElementById('font-' + key)) {
    const link = document.createElement('link');
    link.id = 'font-' + key; link.rel = 'stylesheet'; link.href = p.cdn;
    document.head.appendChild(link);
  }
  return p.stack;
}

export function validateCss(css: string): string {
  const dangerous = /@import|url\s*\(|expression\s*\(|javascript:|behavior\s*:|data\s*:|vbscript\s*:/gi;
  return css.replace(dangerous, '/* blocked */');
}

export function applyAll(): void {
  const s = state;

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
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'ap-custom-css';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = safeCss;
  } else if (styleEl) {
    styleEl.remove();
  }
}
