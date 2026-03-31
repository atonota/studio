/* ═══════════════════════════════════════════
   ECharts Factory — Chart tema, renk paleti, ortak grafik olusturma
   Yan etki: ECharts instance olusturma + resize listener
   Build output: js/charts.js
═══════════════════════════════════════════ */

import type { ChartColors, ChartTheme } from '../types';

declare const echarts: {
  init(el: HTMLElement, theme?: string | null, opts?: Record<string, unknown>): EChartsInstance;
};

interface EChartsInstance {
  setOption(opt: Record<string, unknown>): void;
  getOption(): Record<string, unknown>;
  resize(): void;
  dispose(): void;
}

interface SeriesConfig {
  name: string;
  data: number[];
  color: string;
  area?: boolean;
}

interface LineChartConfig {
  xData: string[];
  series: SeriesConfig[];
  legend?: boolean;
  inverseY?: boolean;
  yMin?: number;
  yMax?: number;
}

interface BarChartConfig {
  xData: string[];
  data: number[];
  color?: string;
  barWidth?: string;
}

interface DoughnutItem {
  value: number;
  name: string;
  color: string;
}

interface DoughnutConfig {
  data: DoughnutItem[];
}

interface RadarIndicator {
  name: string;
  max?: number;
}

interface RadarConfig {
  indicators: RadarIndicator[];
  values: number[];
  name?: string;
  color?: string;
}

interface TreemapConfig {
  data: Array<{ name: string; value: number; itemStyle?: { color: string } }>;
}

interface StackedSeriesConfig {
  name: string;
  data: number[];
  color: string;
}

interface StackedAreaConfig {
  xData: string[];
  series: StackedSeriesConfig[];
}

interface DualYAxis {
  name: string;
  max?: number;
  splitLine?: boolean;
}

interface DualYSeriesConfig {
  name: string;
  data: number[];
  color: string;
  yAxisIndex?: number;
  dashed?: boolean;
}

interface DualYLineConfig {
  xData: string[];
  series: DualYSeriesConfig[];
  yAxes: DualYAxis[];
}

// ── Constants ──────────────────────────

const CHART_COLORS: ChartColors = {
  green: '#22c55e', blue: '#3b82f6', purple: '#a855f7',
  yellow: '#eab308', red: '#ef4444', accent: '#C2410C',
  muted: '#7B7269', border: '#3C342C', text: '#F2EDE5',
  meta: '#1877f2', tiktok: '#ff0050', linkedin: '#0a66c2',
  whatsapp: '#25d366',
};

const CHART_DEFAULTS = {
  grid: { left: 40, right: 16, top: 10, bottom: 36 },
  axisLabel: { color: CHART_COLORS.muted, fontSize: 10 },
  axisLine: { lineStyle: { color: CHART_COLORS.border } },
  splitLine: { lineStyle: { color: CHART_COLORS.border, opacity: 0.3 } },
};

// ── Chart Registry ──────────────────────────

const _charts: EChartsInstance[] = [];

function _reg(c: EChartsInstance): EChartsInstance {
  _charts.push(c);
  return c;
}

window.addEventListener('resize', () => _charts.forEach(c => c.resize()));

// ── Chart Creators ──────────────────────────

export function createLineChart(el: HTMLElement | null, config: LineChartConfig): EChartsInstance | null {
  if (!el) return null;
  const c = _reg(echarts.init(el, null, { renderer: 'canvas' }));
  const series = config.series.map(s => ({
    name: s.name, type: 'line' as const, smooth: true, data: s.data,
    symbol: 'none', lineStyle: { width: 2 },
    itemStyle: { color: s.color },
    areaStyle: s.area ? { opacity: 0.15 } : undefined,
  }));
  c.setOption({
    tooltip: { trigger: 'axis' },
    legend: config.legend ? {
      data: config.series.map(s => s.name),
      textStyle: { color: CHART_COLORS.muted, fontSize: 11 },
      bottom: 0,
    } : undefined,
    grid: CHART_DEFAULTS.grid,
    xAxis: {
      type: 'category', data: config.xData,
      axisLabel: CHART_DEFAULTS.axisLabel,
      axisLine: CHART_DEFAULTS.axisLine,
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      inverse: config.inverseY || false,
      min: config.yMin, max: config.yMax,
      axisLabel: CHART_DEFAULTS.axisLabel,
      splitLine: CHART_DEFAULTS.splitLine,
    },
    series,
  });
  return c;
}

export function createBarChart(el: HTMLElement | null, config: BarChartConfig): EChartsInstance | null {
  if (!el) return null;
  const c = _reg(echarts.init(el, null, { renderer: 'canvas' }));
  c.setOption({
    tooltip: { trigger: 'axis' },
    grid: CHART_DEFAULTS.grid,
    xAxis: {
      type: 'category', data: config.xData,
      axisLabel: CHART_DEFAULTS.axisLabel,
      axisLine: CHART_DEFAULTS.axisLine,
    },
    yAxis: {
      type: 'value',
      axisLabel: CHART_DEFAULTS.axisLabel,
      splitLine: CHART_DEFAULTS.splitLine,
    },
    series: [{
      type: 'bar', data: config.data,
      itemStyle: { color: config.color || CHART_COLORS.accent, borderRadius: [4, 4, 0, 0] },
      barWidth: config.barWidth || '40%',
    }],
  });
  return c;
}

export function createDoughnut(el: HTMLElement | null, config: DoughnutConfig): EChartsInstance | null {
  if (!el) return null;
  const c = _reg(echarts.init(el, null, { renderer: 'canvas' }));
  c.setOption({
    tooltip: { trigger: 'item' },
    legend: {
      orient: 'vertical', right: 10, top: 'center',
      textStyle: { color: CHART_COLORS.muted, fontSize: 11 },
    },
    series: [{
      type: 'pie', radius: ['45%', '70%'], center: ['35%', '50%'],
      label: { show: false },
      data: config.data.map(d => ({
        value: d.value, name: d.name,
        itemStyle: { color: d.color },
      })),
    }],
  });
  return c;
}

export function createRadar(el: HTMLElement | null, config: RadarConfig): EChartsInstance | null {
  if (!el) return null;
  const c = _reg(echarts.init(el, null, { renderer: 'canvas' }));
  c.setOption({
    radar: {
      indicator: config.indicators.map(i => ({ name: i.name, max: i.max || 100 })),
      shape: 'circle',
      splitArea: { areaStyle: { color: ['transparent'] } },
      splitLine: { lineStyle: { color: CHART_COLORS.border } },
      axisLine: { lineStyle: { color: CHART_COLORS.border } },
      axisName: { color: CHART_COLORS.muted, fontSize: 11 },
    },
    series: [{
      type: 'radar',
      data: [{
        value: config.values, name: config.name || 'Mevcut',
        areaStyle: { opacity: 0.15 },
        lineStyle: { color: config.color || CHART_COLORS.accent },
        itemStyle: { color: config.color || CHART_COLORS.accent },
      }],
    }],
  });
  return c;
}

export function createTreemap(el: HTMLElement | null, config: TreemapConfig): EChartsInstance | null {
  if (!el) return null;
  const c = _reg(echarts.init(el, null, { renderer: 'canvas' }));
  c.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: ₺{c}' },
    series: [{
      type: 'treemap',
      data: config.data,
      breadcrumb: { show: false },
      label: { show: true, fontSize: 11, color: '#fff', fontWeight: 600 },
      levels: [{ itemStyle: { borderColor: '#201C18', borderWidth: 2, gapWidth: 2 } }],
    }],
  });
  return c;
}

export function createStackedArea(el: HTMLElement | null, config: StackedAreaConfig): EChartsInstance | null {
  if (!el) return null;
  const c = _reg(echarts.init(el, null, { renderer: 'canvas' }));
  const series = config.series.map(s => ({
    name: s.name, type: 'line' as const, stack: 'total', smooth: true,
    areaStyle: { opacity: 0.4 }, symbol: 'none', lineStyle: { width: 0 },
    itemStyle: { color: s.color }, data: s.data,
  }));
  c.setOption({
    tooltip: { trigger: 'axis' },
    legend: {
      data: config.series.map(s => s.name),
      textStyle: { color: CHART_COLORS.muted, fontSize: 10 },
      bottom: 0,
    },
    grid: CHART_DEFAULTS.grid,
    xAxis: {
      type: 'category', data: config.xData,
      axisLabel: CHART_DEFAULTS.axisLabel,
      axisLine: CHART_DEFAULTS.axisLine,
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: CHART_DEFAULTS.axisLabel,
      splitLine: CHART_DEFAULTS.splitLine,
    },
    series,
  });
  return c;
}

export function createDualYLine(el: HTMLElement | null, config: DualYLineConfig): EChartsInstance | null {
  if (!el) return null;
  const c = _reg(echarts.init(el, null, { renderer: 'canvas' }));
  c.setOption({
    tooltip: { trigger: 'axis' },
    legend: {
      data: config.series.map(s => s.name),
      textStyle: { color: CHART_COLORS.muted, fontSize: 10 },
      bottom: 0,
    },
    grid: CHART_DEFAULTS.grid,
    xAxis: {
      type: 'category', data: config.xData,
      axisLabel: CHART_DEFAULTS.axisLabel,
      axisLine: CHART_DEFAULTS.axisLine,
    },
    yAxis: config.yAxes.map(y => ({
      type: 'value', name: y.name, max: y.max,
      axisLabel: CHART_DEFAULTS.axisLabel,
      splitLine: y.splitLine !== false ? CHART_DEFAULTS.splitLine : { show: false },
    })),
    series: config.series.map(s => ({
      name: s.name, type: 'line' as const, smooth: true,
      yAxisIndex: s.yAxisIndex || 0,
      data: s.data, symbol: 'none',
      lineStyle: { width: 2, type: (s.dashed ? 'dashed' : 'solid') as 'dashed' | 'solid' },
      itemStyle: { color: s.color },
    })),
  });
  return c;
}

// ── Helpers ──────────────────────────

export function days30(): string[] { return Array.from({ length: 30 }, (_, i) => `${i + 1} Mar`); }
export function days7(): string[] { return ['Pzt', 'Sal', 'Car', 'Per', 'Cum', 'Cmt', 'Paz']; }
export function months12(): string[] { return ['Oca', 'Sub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Agu', 'Eyl', 'Eki', 'Kas', 'Ara']; }
export function rand(min: number, max: number): number { return Math.floor(min + Math.random() * (max - min)); }
export function randF(min: number, max: number, dec: number): number { return +(min + Math.random() * (max - min)).toFixed(dec); }

// ── Theme ──────────────────────────

export function getChartTheme(): ChartTheme {
  const R = document.documentElement;
  const isDark = R.classList.contains('dark');

  // Read runtime CSS vars for tone-awareness (set by AppearanceStore)
  const cs = getComputedStyle(R);
  const text = cs.getPropertyValue('--color-text-primary').trim() || (isDark ? '#F2EDE5' : '#1E1A14');
  const muted = cs.getPropertyValue('--color-text-tertiary').trim() || (isDark ? '#9E958A' : '#635B4F');
  const border = cs.getPropertyValue('--color-border-default').trim() || (isDark ? '#3C342C' : '#D6D1C2');
  const bg = cs.getPropertyValue('--color-bg-elevated').trim() || (isDark ? '#201C18' : '#F0EDE3');
  const accent = cs.getPropertyValue('--color-primary').trim() || '#C2410C';
  const accentSoft = cs.getPropertyValue('--color-primary-soft').trim() || (isDark ? 'rgba(194,65,12,0.10)' : 'rgba(194,65,12,0.15)');

  if (isDark) {
    return {
      text, muted, border, bg, accent, accentSoft,
      green: '#22c55e', red: '#ef4444', blue: '#3b82f6', yellow: '#eab308', purple: '#a855f7',
      tooltip: { backgroundColor: bg, borderColor: border, textStyle: { color: text, fontSize: 12 } },
    };
  }
  return {
    text, muted, border, bg, accent, accentSoft,
    green: '#16a34a', red: '#dc2626', blue: '#2563eb', yellow: '#ca8a04', purple: '#9333ea',
    tooltip: { backgroundColor: bg, borderColor: border, textStyle: { color: text, fontSize: 12 } },
  };
}

export function refreshAllCharts(): void {
  const theme = getChartTheme();
  const instances = (window as unknown as Record<string, unknown>)._chartInstances as Record<string, EChartsInstance> | undefined;
  if (!instances) return;

  Object.values(instances).forEach(chart => {
    if (!chart?.getOption) return;
    try {
      const opt = chart.getOption() as Record<string, Array<Record<string, unknown>>>;
      if (opt.xAxis) opt.xAxis.forEach((a: Record<string, unknown>) => {
        if (a.axisLine) (a.axisLine as Record<string, unknown>).lineStyle = { color: theme.border };
        if (a.axisLabel) (a.axisLabel as Record<string, unknown>).color = theme.muted;
      });
      if (opt.yAxis) opt.yAxis.forEach((a: Record<string, unknown>) => {
        if (a.splitLine) (a.splitLine as Record<string, unknown>).lineStyle = { color: theme.border };
        if (a.axisLabel) (a.axisLabel as Record<string, unknown>).color = theme.muted;
      });
      if (opt.legend) opt.legend.forEach((l: Record<string, unknown>) => {
        if (l.textStyle) (l.textStyle as Record<string, unknown>).color = theme.muted;
      });
      if (opt.tooltip) opt.tooltip.forEach((t: Record<string, unknown>) => {
        t.backgroundColor = theme.tooltip.backgroundColor;
        t.borderColor = theme.tooltip.borderColor;
        if (t.textStyle) (t.textStyle as Record<string, unknown>).color = theme.tooltip.textStyle.color;
      });
      chart.setOption(opt as Record<string, unknown>);
    } catch { /* ignore charts that can't be updated */ }
  });
}

// ── Window Exports ──────────────────────────

declare global {
  interface Window {
    getChartTheme: typeof getChartTheme;
    refreshAllCharts: typeof refreshAllCharts;
    createLineChart: typeof createLineChart;
    createBarChart: typeof createBarChart;
    createDoughnut: typeof createDoughnut;
    createRadar: typeof createRadar;
    createTreemap: typeof createTreemap;
    createStackedArea: typeof createStackedArea;
    createDualYLine: typeof createDualYLine;
    days30: typeof days30;
    days7: typeof days7;
    months12: typeof months12;
    rand: typeof rand;
    randF: typeof randF;
    CHART_COLORS: ChartColors;
    CHART_DEFAULTS: typeof CHART_DEFAULTS;
  }
}

window.getChartTheme = getChartTheme;
window.refreshAllCharts = refreshAllCharts;
window.createLineChart = createLineChart;
window.createBarChart = createBarChart;
window.createDoughnut = createDoughnut;
window.createRadar = createRadar;
window.createTreemap = createTreemap;
window.createStackedArea = createStackedArea;
window.createDualYLine = createDualYLine;
window.days30 = days30;
window.days7 = days7;
window.months12 = months12;
window.rand = rand;
window.randF = randF;
window.CHART_COLORS = CHART_COLORS;
window.CHART_DEFAULTS = CHART_DEFAULTS;
