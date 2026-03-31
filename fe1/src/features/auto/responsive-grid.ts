/**
 * responsive-grid.ts — Responsive grid fix (auto-feature, self-executing)
 *
 * Responsibility: Inline style grid-template-columns cannot be overridden
 * by CSS media queries. This module forces 1-column on small screens
 * (<500px) and 2-column on medium screens (<800px), restoring the
 * original value on wider viewports.
 *
 * Side effects on import:
 *   - Runs fixGrids on DOMContentLoaded (100ms delay)
 *   - Listens to window resize
 *   - MutationObserver on body class changes (sidebar toggle)
 *   - Assigns window.fixGrids for external callers (sidebar toggle)
 */

const MEDIUM_BREAKPOINT = 800;
const SMALL_BREAKPOINT = 500;
const SIDEBAR_TOGGLE_DELAY_MS = 350;
const INITIAL_DELAY_MS = 100;
const MAX_REPEAT_COLS = 2;

interface GridElement extends HTMLElement {
  dataset: DOMStringMap & { origGrid?: string };
}

// Window type extensions are declared in shared/types/index.ts

function fixGrids(): void {
  const main = document.getElementById('main');
  const w = main ? main.clientWidth : window.innerWidth;

  const grids = document.querySelectorAll<GridElement>(
    '#main [style*="grid-template-columns"]'
  );

  grids.forEach((el) => {
    const orig = el.dataset.origGrid || el.style.gridTemplateColumns;
    if (!el.dataset.origGrid) el.dataset.origGrid = orig;

    if (w < SMALL_BREAKPOINT) {
      el.style.gridTemplateColumns = '1fr';
      return;
    }

    if (w < MEDIUM_BREAKPOINT) {
      const match = orig.match(/repeat\((\d+)/);
      const cols = match ? parseInt(match[1] ?? '0', 10) : 0;
      el.style.gridTemplateColumns = cols > MAX_REPEAT_COLS ? 'repeat(2,1fr)' : orig;
      return;
    }

    el.style.gridTemplateColumns = orig;
  });
}

// Assign globally so sidebar toggle can call it
window.fixGrids = fixGrids;

// Run on DOMContentLoaded with slight delay for layout settle
window.addEventListener('DOMContentLoaded', () => setTimeout(fixGrids, INITIAL_DELAY_MS));
let _resizeTimer: ReturnType<typeof setTimeout>;
window.addEventListener('resize', () => {
  clearTimeout(_resizeTimer);
  _resizeTimer = setTimeout(fixGrids, 100);
});

// MutationObserver: body class change (wide-open toggle) triggers re-fix
new MutationObserver(() => setTimeout(fixGrids, SIDEBAR_TOGGLE_DELAY_MS))
  .observe(document.body, { attributes: true, attributeFilter: ['class'] });

export { fixGrids };
