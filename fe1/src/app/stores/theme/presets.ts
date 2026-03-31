/**
 * @module stores/theme/presets
 * Static preset data — fonts, easings, theme presets, defaults, categories.
 */

import type { ThemeState, FontPreset, EasingPreset, ThemePresetInfo, ThemeCategory } from '../../../shared/types';

export const FONTS: FontPreset[] = [
  { key: 'system',  label: 'System UI',     stack: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", cdn: null },
  { key: 'inter',   label: 'Inter',         stack: "'Inter', sans-serif", cdn: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' },
  { key: 'ibm',     label: 'IBM Plex Sans', stack: "'IBM Plex Sans', sans-serif", cdn: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap' },
  { key: 'nunito',  label: 'Nunito',         stack: "'Nunito', sans-serif", cdn: 'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&display=swap' },
];

export const CODE_FONTS: FontPreset[] = [
  { key: 'jetbrains', label: 'JetBrains Mono', stack: "'JetBrains Mono', ui-monospace, monospace", cdn: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap' },
  { key: 'fira',      label: 'Fira Code',      stack: "'Fira Code', ui-monospace, monospace", cdn: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&display=swap' },
  { key: 'mono',      label: 'System Mono',    stack: "ui-monospace, 'SF Mono', monospace", cdn: null },
];

export const EASING_PRESETS: EasingPreset[] = [
  { key: 'material', label: 'Material', value: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  { key: 'bounce',   label: 'Bounce',   value: 'cubic-bezier(0.34, 1.08, 0.64, 1)' },
  { key: 'snappy',   label: 'Snappy',   value: 'cubic-bezier(0.16, 1, 0.3, 1)' },
  { key: 'linear',   label: 'Linear',   value: 'linear' },
  { key: 'ease',     label: 'Ease',     value: 'ease' },
];

export const THEME_PRESETS: ThemePresetInfo[] = [
  { key: 'default',  label: 'Varsayilan',      desc: 'Standart atonota gorunumu' },
  { key: 'minimal',  label: 'Sade',            desc: 'Duz yuzeyler, az golge, keskin kenarlar' },
  { key: 'glass',    label: 'Cam',             desc: 'Yumusak kenarlar, yuksek blur, cam efekti' },
  { key: 'compact',  label: 'Kompakt',         desc: 'Kucuk font, dar bosluk, yogun bilgi' },
  { key: 'contrast', label: 'Yuksek Kontrast', desc: 'Koyu tonlar, keskin kenarlar, belirgin golgeler' },
];

export const DEFAULTS: ThemeState = {
  fontFamily: 'system', fontSize: 15, fontWeightBody: 300, fontWeightHeading: 600,
  letterSpacing: 0.01, lineHeight: 1.5, fontCode: 'jetbrains',
  railW: 96, wideW: 260, topH: 96, contentPadding: 1, contentMaxW: 'none',
  compact: false, sidebarDefault: 'collapsed',
  radius: 10, shadowScale: 1, cardStyle: 'elevated', buttonStyle: 'rounded', inputStyle: 'bordered',
  motionScale: 1, motionEasing: 'material', reducedMotion: false, skeletonAnim: true, entranceAnim: true,
  glassOpacity: 0.04, backdropOpacity: 0.5, panelOpacity: 0.55, customCss: '',
};

export const CATEGORIES: Record<ThemeCategory, string[]> = {
  typography: ['fontFamily', 'fontSize', 'fontWeightBody', 'fontWeightHeading', 'letterSpacing', 'lineHeight', 'fontCode'],
  layout: ['railW', 'wideW', 'topH', 'contentPadding', 'contentMaxW', 'compact', 'sidebarDefault'],
  components: ['radius', 'shadowScale', 'cardStyle', 'buttonStyle', 'inputStyle'],
  motion: ['motionScale', 'motionEasing', 'reducedMotion', 'skeletonAnim', 'entranceAnim'],
  glass: ['glassOpacity', 'backdropOpacity', 'panelOpacity'],
};

export const VALID_ENUMS: Record<string, string[]> = {
  cardStyle: ['flat', 'elevated', 'glass'],
  buttonStyle: ['rounded', 'pill', 'sharp'],
  inputStyle: ['bordered', 'filled', 'underline'],
  motionEasing: ['material', 'bounce', 'snappy', 'linear', 'ease'],
  contentMaxW: ['none', '1200px', '1400px', '1600px'],
  sidebarDefault: ['open', 'collapsed'],
};
