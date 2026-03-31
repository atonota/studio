/* ═══════════════════════════════════════════
   Mock Data Generators — Turkce SEO/reklam/analitik mock veri uretimi
   Yan etki: YOK — tum fonksiyonlar saf (pure)
   Build output: js/mock-data.js
═══════════════════════════════════════════ */

import type { ChartTheme } from '../types';

declare const echarts: {
  init(el: HTMLElement | null, theme?: string | null, opts?: Record<string, unknown>): EChartsInstance;
};

interface EChartsInstance {
  setOption(opt: Record<string, unknown>): void;
  getOption(): Record<string, unknown>;
  resize(): void;
}

// ── Keyword Types ──────────────────────────

type Intent = 'Bilgi' | 'Ticari' | 'Nav' | 'Islem';

interface KeywordResult {
  keyword: string;
  intent: Intent;
  volume: number;
  cpc: number;
  kd: number;
  position: number;
  change: number;
  clicks: number;
  trafficValue: number;
  trafficPotential: number;
  trend: number[];
  serpFeatures: string[];
}

interface BacklinkResult {
  domain: string;
  dr: number;
  ur: number;
  backlinks: number;
  type: 'Dofollow' | 'Nofollow';
  anchor: string;
  firstSeen: string;
  toxic: boolean;
  status: 'Aktif' | 'Kayip';
}

interface AuditIssue {
  title: string;
  cat: string;
  sev: string;
  fix: string;
  id: number;
  affected: number;
  url: string;
}

interface TrafficDay {
  date: string;
  organic: number;
  paid: number;
  referral: number;
  direct: number;
}

interface CompetitorData {
  domain: string;
  dr: number;
  traffic: number;
  keywords: number;
  backlinks: number;
  overlap: number;
  trend: 'up' | 'down';
  techStack: string[];
}

interface PaginationResult<T> {
  items: T[];
  page: number;
  perPage: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
  showing: string;
}

interface TimeSeriesConfig {
  key: string;
  base?: number;
  variance?: number;
}

interface TimeSeriesResult {
  labels: string[];
  series: Record<string, number[]>;
}

// ── Keyword Seeds ──────────────────────────

const KEYWORD_SEEDS: Record<string, string[]> = {
  'dijital pazarlama': ['dijital pazarlama ajansi','dijital pazarlama kursu','dijital pazarlama nedir','dijital pazarlama stratejileri','dijital pazarlama egitimi','dijital pazarlama uzmani','dijital pazarlama firmalari','online pazarlama','internet pazarlama','sosyal medya pazarlama'],
  'seo': ['seo nedir','seo uzmani','seo ajansi','seo analizi','seo araci','seo egitimi','seo danismanligi','seo optimizasyonu','seo fiyatlari','teknik seo','yerel seo','seo stratejisi','seo ipuclari','seo raporu'],
  'e-ticaret': ['e-ticaret sitesi','e-ticaret platformu','e-ticaret danismanligi','online magaza','e-ticaret paketleri','e-ticaret yazilimi','e-ticaret seo','e-ticaret trendleri','e-ticaret entegrasyonu'],
  'web tasarim': ['web tasarim fiyatlari','web sitesi tasarimi','web tasarim ajansi','responsive tasarim','ui ux tasarim','web gelistirme','wordpress tasarim','kurumsal web sitesi'],
  'reklam': ['google ads','facebook reklam','instagram reklam','tiktok reklam','dijital reklam','reklam ajansi','reklam butcesi','reklam yonetimi','ppc reklam','sosyal medya reklam'],
};

const INTENTS: Intent[] = ['Bilgi', 'Ticari', 'Nav', 'Islem'];
const INTENT_COLORS: Record<Intent, string> = { Bilgi: '#3b82f6', Ticari: '#a855f7', Nav: '#22c55e', Islem: '#ef4444' };

const BACKLINK_DOMAINS = ['medium.com','forbes.com','techcrunch.com','webrazzi.com','shiftdelete.net','donanimhaber.com','chip.com.tr','log.com.tr','pazarlamasyon.com','sosyalmedya.co','dijitalajanslar.com','startupturk.com','girisimsepeti.com','egitimsepeti.com','kariyer.net'];

const AUDIT_ISSUES_DB = [
  { title: 'Broken internal links (404)', cat: 'Crawlability', sev: 'Kritik', fix: '404 sayfalar icin redirect olusturun' },
  { title: 'Missing H1 tag', cat: 'Meta Tag', sev: 'Uyari', fix: 'Her sayfada tek H1 etiketi kullanin' },
  { title: 'Duplicate title tags', cat: 'Meta Tag', sev: 'Uyari', fix: 'Her sayfa icin benzersiz title yazin' },
  { title: 'Missing alt attributes', cat: 'Resim', sev: 'Bilgi', fix: 'Tum gorsellere alt text ekleyin' },
  { title: 'Slow page load (>3s)', cat: 'Hiz', sev: 'Kritik', fix: 'Gorsel boyutlarini optimize edin' },
  { title: 'Missing meta description', cat: 'Meta Tag', sev: 'Uyari', fix: 'Her sayfa icin 150-160 karakter meta description yazin' },
  { title: 'Mixed content (HTTP on HTTPS)', cat: 'HTTPS', sev: 'Kritik', fix: 'Tum kaynaklari HTTPS uzerinden yukleyin' },
  { title: 'Orphan pages (no internal links)', cat: 'Dahili Link', sev: 'Uyari', fix: 'Dahili link yapisi olusturun' },
  { title: 'Thin content (<300 words)', cat: 'Icerik', sev: 'Bilgi', fix: 'Icerik derinligini artirin' },
  { title: 'Missing schema markup', cat: 'Schema', sev: 'Bilgi', fix: 'JSON-LD schema ekleyin' },
  { title: 'Redirect chains', cat: 'Crawlability', sev: 'Uyari', fix: 'Redirect zincirlerini tekil redirect ile degistirin' },
  { title: 'Missing viewport meta', cat: 'Mobile', sev: 'Kritik', fix: 'Viewport meta tag ekleyin' },
  { title: 'Low contrast text', cat: 'Erisilebilirlik', sev: 'Bilgi', fix: 'Metin kontrastini 4.5:1 oranina cikarin' },
  { title: 'Broken external links', cat: 'Crawlability', sev: 'Bilgi', fix: 'Kisa linklerini guncelleyin veya kaldirin' },
  { title: 'Missing canonical tag', cat: 'Meta Tag', sev: 'Uyari', fix: 'Canonical URL tanimlayarak duplicate icerigi onleyin' },
];

// ── MOCK Object ──────────────────────────

const MOCK = {
  keywords: {
    seeds: KEYWORD_SEEDS,
    intents: INTENTS,
    intentColors: INTENT_COLORS,

    generate(seed: string, count = 50): KeywordResult[] {
      const base = KEYWORD_SEEDS[seed] ?? KEYWORD_SEEDS['seo'] ?? [];
      const result: KeywordResult[] = [];
      for (let i = 0; i < Math.min(count, 100); i++) {
        const kw = i < base.length ? (base[i] ?? '') : (base[i % base.length] ?? '') + ' ' + (2024 + Math.floor(i / 10));
        const intent = INTENTS[Math.floor(Math.random() * 4)] ?? 'Bilgi';
        result.push({
          keyword: kw, intent,
          volume: Math.floor(Math.random() * 30000) + 100,
          cpc: +(Math.random() * 8 + 0.2).toFixed(2),
          kd: Math.floor(Math.random() * 100),
          position: Math.floor(Math.random() * 50) + 1,
          change: Math.floor(Math.random() * 10) - 5,
          clicks: Math.floor(Math.random() * 5000),
          trafficValue: Math.floor(Math.random() * 15000),
          trafficPotential: Math.floor(Math.random() * 20000) + 500,
          trend: Array.from({ length: 12 }, () => Math.floor(Math.random() * 1000) + 100),
          serpFeatures: ['Featured Snippet', 'PAA', 'AIO', 'Video', 'Image', 'Sitelink'].filter(() => Math.random() > 0.7),
        });
      }
      return result.sort((a, b) => b.volume - a.volume);
    },
  },

  backlinks: {
    domains: BACKLINK_DOMAINS,

    generate(count = 50): BacklinkResult[] {
      const result: BacklinkResult[] = [];
      for (let i = 0; i < count; i++) {
        const domain = BACKLINK_DOMAINS[i % BACKLINK_DOMAINS.length] ?? `site${i}.com`;
        result.push({
          domain,
          dr: Math.floor(Math.random() * 80) + 10,
          ur: Math.floor(Math.random() * 70) + 5,
          backlinks: Math.floor(Math.random() * 500) + 1,
          type: Math.random() > 0.2 ? 'Dofollow' : 'Nofollow',
          anchor: ['brand', 'exact', 'partial', 'generic', 'naked'][Math.floor(Math.random() * 5)] ?? 'brand',
          firstSeen: `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
          toxic: Math.random() > 0.85,
          status: Math.random() > 0.1 ? 'Aktif' : 'Kayip',
        });
      }
      return result.sort((a, b) => b.dr - a.dr);
    },
  },

  audit: {
    categories: ['Crawlability', 'HTTPS', 'Hiz', 'Dahili Link', 'Meta Tag', 'Icerik', 'Resim', 'Schema', 'Mobile', 'Erisilebilirlik'],
    severities: ['Kritik', 'Uyari', 'Bilgi'],
    issues: AUDIT_ISSUES_DB,

    generate(count = 50): AuditIssue[] {
      const result: AuditIssue[] = [];
      for (let i = 0; i < count; i++) {
        const issue = AUDIT_ISSUES_DB[i % AUDIT_ISSUES_DB.length];
        if (!issue) continue;
        result.push({
          title: issue.title,
          cat: issue.cat,
          sev: issue.sev,
          fix: issue.fix,
          id: i + 1,
          affected: Math.floor(Math.random() * 50) + 1,
          url: `/sayfa-${Math.floor(Math.random() * 200) + 1}`,
        });
      }
      return result;
    },
  },

  traffic: {
    generate(days = 30): TrafficDay[] {
      const result: TrafficDay[] = [];
      const now = Date.now();
      for (let i = days; i >= 0; i--) {
        const d = new Date(now - i * 86400000);
        const dow = d.getDay();
        const weekendFactor = (dow === 0 || dow === 6) ? 0.6 : 1;
        const trendFactor = 1 + (days - i) * 0.005;
        result.push({
          date: d.toISOString().slice(0, 10),
          organic: Math.floor((800 + Math.random() * 400) * weekendFactor * trendFactor),
          paid: Math.floor((200 + Math.random() * 150) * weekendFactor),
          referral: Math.floor((150 + Math.random() * 100) * weekendFactor),
          direct: Math.floor((100 + Math.random() * 80) * weekendFactor),
        });
      }
      return result;
    },
  },

  competitors: {
    generate(count = 5): CompetitorData[] {
      const names = ['rakip1.com', 'rakip2.com', 'rakip3.com', 'rakip4.com', 'rakip5.com'];
      return names.slice(0, count).map(name => ({
        domain: name,
        dr: 40 + Math.floor(Math.random() * 40),
        traffic: Math.floor(Math.random() * 80000) + 5000,
        keywords: Math.floor(Math.random() * 5000) + 200,
        backlinks: Math.floor(Math.random() * 20000) + 500,
        overlap: Math.floor(Math.random() * 500) + 50,
        trend: (Math.random() > 0.5 ? 'up' : 'down') as 'up' | 'down',
        techStack: ['WordPress', 'Cloudflare', 'GA4', 'Yoast SEO', 'GTM'].slice(0, 3 + Math.floor(Math.random() * 3)),
      }));
    },
  },
};

// ── Utility Functions ──────────────────────────

function getChartTheme(): ChartTheme {
  const isDark = document.documentElement.classList.contains('dark');
  if (isDark) {
    return {
      text: '#F2EDE5', muted: '#7B7269', border: '#3C342C', bg: '#201C18',
      accent: '#C2410C', accentSoft: 'rgba(194,65,12,0.15)',
      green: '#22c55e', red: '#ef4444', blue: '#3b82f6', yellow: '#eab308', purple: '#a855f7',
      tooltip: { backgroundColor: '#201C18', borderColor: '#3C342C', textStyle: { color: '#F2EDE5', fontSize: 12 } },
    };
  }
  return {
    text: '#1E1A14', muted: '#9B9485', border: '#D6D1C2', bg: '#F8F5EC',
    accent: '#C2410C', accentSoft: 'rgba(194,65,12,0.1)',
    green: '#16a34a', red: '#dc2626', blue: '#2563eb', yellow: '#ca8a04', purple: '#9333ea',
    tooltip: { backgroundColor: '#FFFFFF', borderColor: '#D6D1C2', textStyle: { color: '#1E1A14', fontSize: 12 } },
  };
}

function refreshAllCharts(): void {
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
    } catch { /* ignore */ }
  });
}

function exportToCSV(headers: string[], rows: string[][], filename = 'export.csv'): void {
  const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

function paginate<T>(data: T[], page: number, perPage = 20): PaginationResult<T> {
  const total = data.length;
  const pages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  return {
    items: data.slice(start, start + perPage),
    page, perPage, total, pages,
    hasNext: page < pages,
    hasPrev: page > 1,
    showing: `${start + 1}-${Math.min(start + perPage, total)} / ${total}`,
  };
}

function generateTimeSeriesForRange(rangeDays: string | number, seriesConfigs: TimeSeriesConfig[]): TimeSeriesResult {
  const days = parseInt(String(rangeDays)) || 30;
  const now = Date.now();
  const labels: string[] = [];
  const series: Record<string, number[]> = {};
  seriesConfigs.forEach(s => { series[s.key] = []; });

  for (let i = days; i >= 0; i--) {
    const d = new Date(now - i * 86400000);
    const dow = d.getDay();
    const weekendFactor = (dow === 0 || dow === 6) ? 0.6 : 1;
    const trendFactor = 1 + (days - i) * 0.003;

    if (days <= 7) {
      labels.push(d.toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric' }));
    } else {
      labels.push(d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }));
    }

    seriesConfigs.forEach(s => {
      const base = s.base || 500;
      const variance = s.variance || 200;
      const arr = series[s.key];
      if (arr) arr.push(Math.floor((base + Math.random() * variance) * weekendFactor * trendFactor));
    });
  }
  return { labels, series };
}

function updateChartsForRange(rangeDays: string | number, chartInstances: Record<string, EChartsInstance>, seriesConfigs: TimeSeriesConfig[]): void {
  const data = generateTimeSeriesForRange(rangeDays, seriesConfigs);
  Object.keys(chartInstances).forEach(chartId => {
    const chart = chartInstances[chartId];
    if (!chart) return;
    const opt = chart.getOption() as Record<string, Array<Record<string, unknown>>>;
    if (opt.xAxis?.[0]) {
      opt.xAxis[0].data = data.labels as unknown as unknown;
    }
    if (opt.series) {
      opt.series.forEach((s: Record<string, unknown>, i: number) => {
        const configKey = seriesConfigs[i]?.key;
        if (configKey && data.series[configKey]) {
          s.data = data.series[configKey] as unknown;
        }
      });
    }
    chart.setOption(opt as Record<string, unknown>);
  });
}

function sparkline(containerId: string, data: number[], color = '#C2410C', w = 80, h = 28): EChartsInstance {
  const el = document.getElementById(containerId);
  const c = echarts.init(el, null, { width: w, height: h });
  c.setOption({
    grid: { left: 0, right: 0, top: 0, bottom: 0 },
    xAxis: { show: false, type: 'category', data: data.map((_, i) => i) },
    yAxis: { show: false, type: 'value' },
    series: [{
      type: 'line', data, symbol: 'none',
      lineStyle: { color, width: 1.5 },
      areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: color + '33' }, { offset: 1, color: 'transparent' }] } },
    }],
  });
  return c;
}

// ── Window Exports ──────────────────────────
// Window type extensions are declared in shared/types/index.ts

window.MOCK = MOCK;
window.getChartTheme = getChartTheme;
window.refreshAllCharts = refreshAllCharts;
window.exportToCSV = exportToCSV;
window.paginate = paginate;
window.generateTimeSeriesForRange = generateTimeSeriesForRange as typeof window.generateTimeSeriesForRange;
window.updateChartsForRange = updateChartsForRange as typeof window.updateChartsForRange;
window.sparkline = sparkline;
