/**
 * display-fix.ts — Alpine x-show display restoration (auto-feature, self-executing)
 *
 * Responsibility: Alpine.js x-show directive sets display to '' (empty string)
 * when making elements visible, which kills display:grid/flex layouts.
 * This MutationObserver detects style changes on [x-show] elements that have
 * a known display mode (grid/flex/inline-flex) and restores the correct value.
 *
 * Side effects on import:
 *   - Scans [x-show] elements on DOMContentLoaded
 *   - Attaches MutationObserver to elements with grid/flex display
 */

const OBSERVED_DISPLAY_VALUES = new Set(['grid', 'flex', 'inline-flex']);

interface DisplayElement extends HTMLElement {
  dataset: DOMStringMap & { display?: string };
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.attributeName !== 'style') continue;

    const el = mutation.target as DisplayElement;
    if (!el.dataset.display) continue;
    if (el.style.display === 'none') continue;
    if (el.style.display === el.dataset.display) continue;

    el.style.display = el.dataset.display;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll<DisplayElement>('[x-show]');

  elements.forEach((el) => {
    const computed = getComputedStyle(el);
    const display = el.style.display || computed.display;

    if (!OBSERVED_DISPLAY_VALUES.has(display)) return;

    el.dataset.display = display;
    observer.observe(el, { attributes: true, attributeFilter: ['style'] });
  });
});
