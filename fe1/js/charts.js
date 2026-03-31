"use strict";
(() => {
  // src/shared/charts/chart-theme.ts
  var CHART_COLORS = {
    green: "#22c55e",
    blue: "#3b82f6",
    purple: "#a855f7",
    yellow: "#eab308",
    red: "#ef4444",
    accent: "#C2410C",
    muted: "#7B7269",
    border: "#3C342C",
    text: "#F2EDE5",
    meta: "#1877f2",
    tiktok: "#ff0050",
    linkedin: "#0a66c2",
    whatsapp: "#25d366"
  };
  var CHART_DEFAULTS = {
    grid: { left: 40, right: 16, top: 10, bottom: 36 },
    axisLabel: { color: CHART_COLORS.muted, fontSize: 10 },
    axisLine: { lineStyle: { color: CHART_COLORS.border } },
    splitLine: { lineStyle: { color: CHART_COLORS.border, opacity: 0.3 } }
  };
  var _charts = [];
  function _reg(c) {
    _charts.push(c);
    return c;
  }
  window.addEventListener("resize", () => _charts.forEach((c) => c.resize()));
  function createLineChart(el, config) {
    if (!el) return null;
    const c = _reg(echarts.init(el, null, { renderer: "canvas" }));
    const series = config.series.map((s) => ({
      name: s.name,
      type: "line",
      smooth: true,
      data: s.data,
      symbol: "none",
      lineStyle: { width: 2 },
      itemStyle: { color: s.color },
      areaStyle: s.area ? { opacity: 0.15 } : void 0
    }));
    c.setOption({
      tooltip: { trigger: "axis" },
      legend: config.legend ? {
        data: config.series.map((s) => s.name),
        textStyle: { color: CHART_COLORS.muted, fontSize: 11 },
        bottom: 0
      } : void 0,
      grid: CHART_DEFAULTS.grid,
      xAxis: {
        type: "category",
        data: config.xData,
        axisLabel: CHART_DEFAULTS.axisLabel,
        axisLine: CHART_DEFAULTS.axisLine,
        splitLine: { show: false }
      },
      yAxis: {
        type: "value",
        inverse: config.inverseY || false,
        min: config.yMin,
        max: config.yMax,
        axisLabel: CHART_DEFAULTS.axisLabel,
        splitLine: CHART_DEFAULTS.splitLine
      },
      series
    });
    return c;
  }
  function createBarChart(el, config) {
    if (!el) return null;
    const c = _reg(echarts.init(el, null, { renderer: "canvas" }));
    c.setOption({
      tooltip: { trigger: "axis" },
      grid: CHART_DEFAULTS.grid,
      xAxis: {
        type: "category",
        data: config.xData,
        axisLabel: CHART_DEFAULTS.axisLabel,
        axisLine: CHART_DEFAULTS.axisLine
      },
      yAxis: {
        type: "value",
        axisLabel: CHART_DEFAULTS.axisLabel,
        splitLine: CHART_DEFAULTS.splitLine
      },
      series: [{
        type: "bar",
        data: config.data,
        itemStyle: { color: config.color || CHART_COLORS.accent, borderRadius: [4, 4, 0, 0] },
        barWidth: config.barWidth || "40%"
      }]
    });
    return c;
  }
  function createDoughnut(el, config) {
    if (!el) return null;
    const c = _reg(echarts.init(el, null, { renderer: "canvas" }));
    c.setOption({
      tooltip: { trigger: "item" },
      legend: {
        orient: "vertical",
        right: 10,
        top: "center",
        textStyle: { color: CHART_COLORS.muted, fontSize: 11 }
      },
      series: [{
        type: "pie",
        radius: ["45%", "70%"],
        center: ["35%", "50%"],
        label: { show: false },
        data: config.data.map((d) => ({
          value: d.value,
          name: d.name,
          itemStyle: { color: d.color }
        }))
      }]
    });
    return c;
  }
  function createRadar(el, config) {
    if (!el) return null;
    const c = _reg(echarts.init(el, null, { renderer: "canvas" }));
    c.setOption({
      radar: {
        indicator: config.indicators.map((i) => ({ name: i.name, max: i.max || 100 })),
        shape: "circle",
        splitArea: { areaStyle: { color: ["transparent"] } },
        splitLine: { lineStyle: { color: CHART_COLORS.border } },
        axisLine: { lineStyle: { color: CHART_COLORS.border } },
        axisName: { color: CHART_COLORS.muted, fontSize: 11 }
      },
      series: [{
        type: "radar",
        data: [{
          value: config.values,
          name: config.name || "Mevcut",
          areaStyle: { opacity: 0.15 },
          lineStyle: { color: config.color || CHART_COLORS.accent },
          itemStyle: { color: config.color || CHART_COLORS.accent }
        }]
      }]
    });
    return c;
  }
  function createTreemap(el, config) {
    if (!el) return null;
    const c = _reg(echarts.init(el, null, { renderer: "canvas" }));
    c.setOption({
      tooltip: { trigger: "item", formatter: "{b}: \u20BA{c}" },
      series: [{
        type: "treemap",
        data: config.data,
        breadcrumb: { show: false },
        label: { show: true, fontSize: 11, color: "#fff", fontWeight: 600 },
        levels: [{ itemStyle: { borderColor: "#201C18", borderWidth: 2, gapWidth: 2 } }]
      }]
    });
    return c;
  }
  function createStackedArea(el, config) {
    if (!el) return null;
    const c = _reg(echarts.init(el, null, { renderer: "canvas" }));
    const series = config.series.map((s) => ({
      name: s.name,
      type: "line",
      stack: "total",
      smooth: true,
      areaStyle: { opacity: 0.4 },
      symbol: "none",
      lineStyle: { width: 0 },
      itemStyle: { color: s.color },
      data: s.data
    }));
    c.setOption({
      tooltip: { trigger: "axis" },
      legend: {
        data: config.series.map((s) => s.name),
        textStyle: { color: CHART_COLORS.muted, fontSize: 10 },
        bottom: 0
      },
      grid: CHART_DEFAULTS.grid,
      xAxis: {
        type: "category",
        data: config.xData,
        axisLabel: CHART_DEFAULTS.axisLabel,
        axisLine: CHART_DEFAULTS.axisLine,
        splitLine: { show: false }
      },
      yAxis: {
        type: "value",
        axisLabel: CHART_DEFAULTS.axisLabel,
        splitLine: CHART_DEFAULTS.splitLine
      },
      series
    });
    return c;
  }
  function createDualYLine(el, config) {
    if (!el) return null;
    const c = _reg(echarts.init(el, null, { renderer: "canvas" }));
    c.setOption({
      tooltip: { trigger: "axis" },
      legend: {
        data: config.series.map((s) => s.name),
        textStyle: { color: CHART_COLORS.muted, fontSize: 10 },
        bottom: 0
      },
      grid: CHART_DEFAULTS.grid,
      xAxis: {
        type: "category",
        data: config.xData,
        axisLabel: CHART_DEFAULTS.axisLabel,
        axisLine: CHART_DEFAULTS.axisLine
      },
      yAxis: config.yAxes.map((y) => ({
        type: "value",
        name: y.name,
        max: y.max,
        axisLabel: CHART_DEFAULTS.axisLabel,
        splitLine: y.splitLine !== false ? CHART_DEFAULTS.splitLine : { show: false }
      })),
      series: config.series.map((s) => ({
        name: s.name,
        type: "line",
        smooth: true,
        yAxisIndex: s.yAxisIndex || 0,
        data: s.data,
        symbol: "none",
        lineStyle: { width: 2, type: s.dashed ? "dashed" : "solid" },
        itemStyle: { color: s.color }
      }))
    });
    return c;
  }
  function days30() {
    return Array.from({ length: 30 }, (_, i) => `${i + 1} Mar`);
  }
  function days7() {
    return ["Pzt", "Sal", "Car", "Per", "Cum", "Cmt", "Paz"];
  }
  function months12() {
    return ["Oca", "Sub", "Mar", "Nis", "May", "Haz", "Tem", "Agu", "Eyl", "Eki", "Kas", "Ara"];
  }
  function rand(min, max) {
    return Math.floor(min + Math.random() * (max - min));
  }
  function randF(min, max, dec) {
    return +(min + Math.random() * (max - min)).toFixed(dec);
  }
  function getChartTheme() {
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark) {
      return {
        text: "#F2EDE5",
        muted: "#7B7269",
        border: "#3C342C",
        bg: "#201C18",
        accent: "#C2410C",
        accentSoft: "rgba(194,65,12,0.15)",
        green: "#22c55e",
        red: "#ef4444",
        blue: "#3b82f6",
        yellow: "#eab308",
        purple: "#a855f7",
        tooltip: { backgroundColor: "#201C18", borderColor: "#3C342C", textStyle: { color: "#F2EDE5", fontSize: 12 } }
      };
    }
    return {
      text: "#1E1A14",
      muted: "#9B9485",
      border: "#D6D1C2",
      bg: "#F8F5EC",
      accent: "#C2410C",
      accentSoft: "rgba(194,65,12,0.1)",
      green: "#16a34a",
      red: "#dc2626",
      blue: "#2563eb",
      yellow: "#ca8a04",
      purple: "#9333ea",
      tooltip: { backgroundColor: "#FFFFFF", borderColor: "#D6D1C2", textStyle: { color: "#1E1A14", fontSize: 12 } }
    };
  }
  function refreshAllCharts() {
    const theme = getChartTheme();
    const instances = window._chartInstances;
    if (!instances) return;
    Object.values(instances).forEach((chart) => {
      if (!chart?.getOption) return;
      try {
        const opt = chart.getOption();
        if (opt.xAxis) opt.xAxis.forEach((a) => {
          if (a.axisLine) a.axisLine.lineStyle = { color: theme.border };
          if (a.axisLabel) a.axisLabel.color = theme.muted;
        });
        if (opt.yAxis) opt.yAxis.forEach((a) => {
          if (a.splitLine) a.splitLine.lineStyle = { color: theme.border };
          if (a.axisLabel) a.axisLabel.color = theme.muted;
        });
        if (opt.legend) opt.legend.forEach((l) => {
          if (l.textStyle) l.textStyle.color = theme.muted;
        });
        if (opt.tooltip) opt.tooltip.forEach((t) => {
          t.backgroundColor = theme.tooltip.backgroundColor;
          t.borderColor = theme.tooltip.borderColor;
          if (t.textStyle) t.textStyle.color = theme.tooltip.textStyle.color;
        });
        chart.setOption(opt);
      } catch {
      }
    });
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
})();
