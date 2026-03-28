/* ═══════════════════════════════════════════
   atonota Studio — ECharts Factory
   Ortak grafik olusturma fonksiyonlari
═══════════════════════════════════════════ */

const CHART_COLORS = {
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

// Registry for resize
const _charts = [];
function _reg(c) { _charts.push(c); return c; }
window.addEventListener('resize', () => _charts.forEach(c => c.resize()));

/* ── Line Chart ── */
function createLineChart(el, config) {
  if (!el) return null;
  const c = _reg(echarts.init(el, null, { renderer: 'canvas' }));
  const series = config.series.map(s => ({
    name: s.name, type: 'line', smooth: true, data: s.data,
    symbol: 'none', lineStyle: { width: 2 },
    itemStyle: { color: s.color },
    areaStyle: s.area ? { opacity: 0.15 } : undefined,
  }));
  c.setOption({
    tooltip: { trigger: 'axis' },
    legend: config.legend ? {
      data: config.series.map(s => s.name),
      textStyle: { color: CHART_COLORS.muted, fontSize: 11 },
      bottom: 0
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

/* ── Bar Chart ── */
function createBarChart(el, config) {
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

/* ── Doughnut Chart ── */
function createDoughnut(el, config) {
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

/* ── Radar Chart ── */
function createRadar(el, config) {
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

/* ── Treemap Chart ── */
function createTreemap(el, config) {
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

/* ── Stacked Area Chart ── */
function createStackedArea(el, config) {
  if (!el) return null;
  const c = _reg(echarts.init(el, null, { renderer: 'canvas' }));
  const series = config.series.map(s => ({
    name: s.name, type: 'line', stack: 'total', smooth: true,
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

/* ── Dual-Y Line Chart (for CWV) ── */
function createDualYLine(el, config) {
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
      name: s.name, type: 'line', smooth: true,
      yAxisIndex: s.yAxisIndex || 0,
      data: s.data, symbol: 'none',
      lineStyle: { width: 2, type: s.dashed ? 'dashed' : 'solid' },
      itemStyle: { color: s.color },
    })),
  });
  return c;
}

/* ── Helper: Generate 30 days labels ── */
function days30() { return Array.from({ length: 30 }, (_, i) => `${i + 1} Mar`); }
function days7() { return ['Pzt', 'Sal', 'Car', 'Per', 'Cum', 'Cmt', 'Paz']; }
function months12() { return ['Oca', 'Sub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Agu', 'Eyl', 'Eki', 'Kas', 'Ara']; }
function rand(min, max) { return Math.floor(min + Math.random() * (max - min)); }
function randF(min, max, dec) { return +(min + Math.random() * (max - min)).toFixed(dec); }
