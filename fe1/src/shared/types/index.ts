/* ═══════════════════════════════════════════
   Shared Type Definitions
   Tum modullerin paylastigi interface ve type tanimlari
═══════════════════════════════════════════ */

// ── Appearance Store ──────────────────────────

export type ColorMode = 'dark' | 'light';

export interface TonePreset {
  key: string;
  label: string;
  base: string;
  s: string;
  s2: string;
  b: string;
}

export type AccentKey = 'cyan' | 'magenta' | 'yellow' | 'red' | 'green' | 'blue' | 'violet' | 'orange';

export interface AccentPreset {
  key: AccentKey;
  color: string;
  h: string;
}

export interface AppearanceState {
  mode: ColorMode;
  lightTone: string;
  darkTone: string;
  /** @deprecated Use accentDark / accentLight — kept for schema migration only */
  accent?: string;
  accentDark: string;
  accentLight: string;
  customLight: string | null;
  customDark: string | null;
  blurLevel: number;
  chromeBg: string | null;
}

export type AppearanceEvent =
  | 'mode-change'
  | 'tone-change'
  | 'accent-change'
  | 'blur-change'
  | 'chrome-change'
  | 'any-change';

export interface AppearanceStoreAPI {
  getState(): AppearanceState;
  apply(): void;
  on(event: string, cb: EventCallback): void;
  off(event: string, cb: EventCallback): void;
  setMode(m: ColorMode): void;
  setLightTone(key: string): void;
  setDarkTone(key: string): void;
  /** @deprecated Use setAccentDark / setAccentLight */
  setAccent(key: string): void;
  setAccentDark(key: string): void;
  setAccentLight(key: string): void;
  setCustomLight(hex: string): void;
  setCustomDark(hex: string): void;
  setBlur(level: number): void;
  setChromeBg(hex: string | null): void;
  getChromeBgResolved(): string;
  LIGHT_TONES: TonePreset[];
  DARK_TONES: TonePreset[];
  ACCENTS: AccentPreset[];
  hexToRgb(h: string): RGB;
  rgbToHex(r: number, g: number, b: number): string;
  darken(hex: string, amt: number): string;
  lighten(hex: string, amt: number): string;
}

// ── Theme Store ──────────────────────────

export type FontKey = 'system' | 'inter' | 'ibm' | 'nunito';
export type CodeFontKey = 'jetbrains' | 'fira' | 'mono';
export type EasingKey = 'material' | 'bounce' | 'snappy' | 'linear' | 'ease';
export type CardStyle = 'flat' | 'elevated' | 'glass';
export type ButtonStyle = 'rounded' | 'pill' | 'sharp';
export type InputStyle = 'bordered' | 'filled' | 'underline';
export type ContentMaxW = 'none' | '1200px' | '1400px' | '1600px';
export type SidebarDefault = 'open' | 'collapsed';
export type ThemePresetKey = 'default' | 'minimal' | 'glass' | 'compact' | 'contrast';
export type ThemeCategory = 'typography' | 'layout' | 'components' | 'motion' | 'glass';

export interface FontPreset {
  key: string;
  label: string;
  stack: string;
  cdn: string | null;
}

export interface EasingPreset {
  key: EasingKey;
  label: string;
  value: string;
}

export interface ThemePresetInfo {
  key: ThemePresetKey;
  label: string;
  desc: string;
}

export interface ThemeState {
  fontFamily: string;
  fontSize: number;
  fontWeightBody: number;
  fontWeightHeading: number;
  letterSpacing: number;
  lineHeight: number;
  fontCode: string;
  railW: number;
  wideW: number;
  topH: number;
  contentPadding: number;
  contentMaxW: string;
  compact: boolean;
  sidebarDefault: string;
  radius: number;
  shadowScale: number;
  cardStyle: string;
  buttonStyle: string;
  inputStyle: string;
  motionScale: number;
  motionEasing: string;
  reducedMotion: boolean;
  skeletonAnim: boolean;
  entranceAnim: boolean;
  glassOpacity: number;
  backdropOpacity: number;
  panelOpacity: number;
  customCss: string;
  chartClearSpace: number;
}

export interface ImportResult {
  ok: boolean;
  count?: number;
  error?: string;
}

export interface ThemeStoreAPI {
  apply(): void;
  getState(): ThemeState;
  getDefaults(): ThemeState;
  set(key: string, value: unknown): void;
  resetAll(): void;
  resetCategory(cat: ThemeCategory): void;
  getChangedKeys(): string[];
  undo(): boolean;
  redo(): boolean;
  canUndo(): boolean;
  canRedo(): boolean;
  exportTheme(): string;
  importTheme(json: string): ImportResult;
  applyPreset(key: ThemePresetKey): void;
  on(event: string, cb: EventCallback): void;
  off(event: string, cb: EventCallback): void;
  FONTS: FontPreset[];
  CODE_FONTS: FontPreset[];
  EASING_PRESETS: EasingPreset[];
  THEME_PRESETS: ThemePresetInfo[];
  CATEGORIES: Record<ThemeCategory, string[]>;
  DEFAULTS: ThemeState;
}

// ── Common ──────────────────────────

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export type EventCallback = (payload?: unknown) => void;

// ── Charts ──────────────────────────

export interface ChartColors {
  green: string;
  blue: string;
  purple: string;
  yellow: string;
  red: string;
  accent: string;
  muted: string;
  border: string;
  text: string;
  meta: string;
  tiktok: string;
  linkedin: string;
  whatsapp: string;
}

export interface ChartTheme {
  text: string;
  muted: string;
  border: string;
  bg: string;
  accent: string;
  accentSoft: string;
  green: string;
  red: string;
  blue: string;
  yellow: string;
  purple: string;
  tooltip: {
    backgroundColor: string;
    borderColor: string;
    textStyle: { color: string; fontSize: number };
  };
}

// ── Navigation (Shell) ──────────────────────────

export interface MenuItem {
  key: string;
  icon: string;
  title: string;
  href: string;
}

export interface MenuGroup {
  group: string;
  items: MenuItem[];
}

export interface SidebarChild {
  label: string;
  badge: string;
  href: string;
}

export interface SidebarSection {
  l: string;
  ch: string[];
}

export interface Favorite {
  label: string;
  href: string;
}

// ── Global Window Extensions ──────────────────────────
// Single source of truth for all Window augmentations.
// Individual files MUST NOT redeclare these properties.

declare global {
  interface Window {
    // Shell
    __SHELL_KEY?: string;
    __SHELL_BASE?: string;
    __SIDEBAR_KEY?: string;
    initShell: (pageKey?: string) => void;
    railClick: (btn: HTMLElement) => void;
    toggleNotifPanel: () => void;
    togglePageFav: () => void;
    toggleFav: (btn: HTMLElement) => void;
    toggleFavDropdown: () => void;
    toggleAiModal: () => void;
    closeAiModal: () => void;
    showToast: (msg: string, duration?: number) => void;
    tmCloseAll: () => void;
    buildTopMenu: () => void;
    __toggleSidebarLock: () => void;

    // Stores
    AppearanceStore?: AppearanceStoreAPI;
    ThemeStore?: ThemeStoreAPI;

    // Alpine
    Alpine?: unknown;

    // Charts
    MOCK: unknown;
    getChartTheme: () => ChartTheme;
    refreshAllCharts: () => void;
    chartGrid: (overrides?: Record<string, unknown>) => Record<string, unknown>;
    chartClearPos: () => Record<string, unknown>;
    exportToCSV: (headers: string[], rows: string[][], filename?: string) => void;
    paginate: <T>(data: T[], page: number, perPage?: number) => unknown;
    generateTimeSeriesForRange: (rangeDays: string | number, seriesConfigs: unknown[]) => unknown;
    updateChartsForRange: (rangeDays: string | number, chartInstances: Record<string, unknown>, seriesConfigs: unknown[]) => void;
    sparkline: (containerId: string, data: number[], color?: string, w?: number, h?: number) => unknown;
    buildChartsReal: (() => void) | undefined;
    _chartInstances?: Record<string, unknown>;
    _chartDebounce: ReturnType<typeof setTimeout>;

    // Auto features
    fixGrids: () => void;
    emptyStateHTML: (key: string) => string;
  }
}
