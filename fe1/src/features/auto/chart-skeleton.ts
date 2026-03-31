/**
 * chart-skeleton.ts — Chart skeleton auto-detection (auto-feature)
 *
 * Responsibility: Auto-detects [id^="chart-"] elements and applies
 * skeleton shimmer classes until ECharts renders a <canvas> inside.
 * Uses MutationObserver per chart element with a safety timeout
 * to force-remove skeleton after CHART_TIMEOUT_MS.
 *
 * Respects ap_skeleton_anim localStorage toggle.
 */

const CHART_TIMEOUT_MS = 5000;

export function initChartSkeleton(): void {
  document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('ap_skeleton_anim') === 'false') return;

    const charts = document.querySelectorAll<HTMLElement>('[id^="chart-"]');

    charts.forEach((el) => {
      if (el.offsetHeight <= 0) return;
      if (el.querySelector('canvas')) return;

      el.classList.add('skeleton', 'skeleton-chart');

      const obs = new MutationObserver(() => {
        if (!el.querySelector('canvas')) return;

        el.classList.remove('skeleton', 'skeleton-chart');
        obs.disconnect();
        clearTimeout(timeout);
      });

      const timeout = setTimeout(() => {
        el.classList.remove('skeleton', 'skeleton-chart');
        obs.disconnect();
      }, CHART_TIMEOUT_MS);

      obs.observe(el, { childList: true, subtree: true });
    });
  });
}
