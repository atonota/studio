/**
 * skeleton.ts — Skeleton shimmer templates (auto-feature)
 *
 * Responsibility: On DOMContentLoaded, injects a shimmer skeleton overlay
 * into #main based on the data-skeleton attribute value. After a random
 * delay (300-600ms), fades out the skeleton and staggers in real content.
 * Respects prefers-reduced-motion and ap_skeleton_anim localStorage toggle.
 *
 * Skeleton types: dashboard | table | tool | chat | form | cards
 */

const SKELETON_DELAY_MIN = 300;
const SKELETON_DELAY_MAX = 600;
const STAGGER_MS = 50;
const FADE_MS = 300;

type SkeletonType = 'dashboard' | 'table' | 'tool' | 'chat' | 'form' | 'cards';

const SKELETON_TEMPLATES: Record<SkeletonType, string> = {
  dashboard: `
    <div style="margin-bottom:var(--sp-6)"><div class="skeleton skeleton-text" style="width:200px;height:20px;margin-bottom:var(--sp-2)"></div><div class="skeleton skeleton-text" style="width:320px;height:14px"></div></div>
    <div class="skel-grid-4" style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--sp-4);margin-bottom:var(--sp-6)"><div class="skeleton skeleton-card"></div><div class="skeleton skeleton-card"></div><div class="skeleton skeleton-card"></div><div class="skeleton skeleton-card"></div></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--sp-4);margin-bottom:var(--sp-6)"><div class="skeleton skeleton-chart"></div><div class="skeleton skeleton-chart"></div></div>
    <div class="skeleton" style="height:200px;border-radius:var(--r-lg)"></div>`,

  table: `
    <div style="margin-bottom:var(--sp-6)"><div class="skeleton skeleton-text" style="width:200px;height:20px;margin-bottom:var(--sp-2)"></div><div class="skeleton skeleton-text" style="width:320px;height:14px"></div></div>
    <div style="display:flex;gap:var(--sp-3);margin-bottom:var(--sp-6)"><div class="skeleton" style="width:80px;height:32px;border-radius:var(--r-full)"></div><div class="skeleton" style="width:80px;height:32px;border-radius:var(--r-full)"></div><div class="skeleton" style="width:80px;height:32px;border-radius:var(--r-full)"></div></div>
    <div class="skeleton" style="height:48px;margin-bottom:var(--sp-3);border-radius:var(--r-md)"></div>
    <div class="skeleton" style="height:48px;margin-bottom:var(--sp-3);border-radius:var(--r-md)"></div>
    <div class="skeleton" style="height:48px;margin-bottom:var(--sp-3);border-radius:var(--r-md)"></div>
    <div class="skeleton" style="height:48px;margin-bottom:var(--sp-3);border-radius:var(--r-md)"></div>
    <div class="skeleton" style="height:48px;border-radius:var(--r-md)"></div>`,

  tool: `
    <div style="margin-bottom:var(--sp-6)"><div class="skeleton skeleton-text" style="width:200px;height:20px;margin-bottom:var(--sp-2)"></div><div class="skeleton skeleton-text" style="width:320px;height:14px"></div></div>
    <div class="skeleton" style="width:100%;height:44px;border-radius:var(--r-md);margin-bottom:var(--sp-4)"></div>
    <div style="display:flex;gap:var(--sp-3);margin-bottom:var(--sp-4)"><div class="skeleton" style="flex:1;height:32px;border-radius:var(--r-sm)"></div><div class="skeleton" style="width:100px;height:32px;border-radius:var(--r-sm)"></div></div>
    <div class="skeleton skeleton-chart" style="margin-bottom:var(--sp-6)"></div>
    <div class="skeleton" style="height:48px;margin-bottom:var(--sp-3);border-radius:var(--r-md)"></div>
    <div class="skeleton" style="height:48px;border-radius:var(--r-md)"></div>`,

  chat: `
    <div style="margin-bottom:var(--sp-6)"><div class="skeleton skeleton-text" style="width:200px;height:20px;margin-bottom:var(--sp-2)"></div><div class="skeleton skeleton-text" style="width:320px;height:14px"></div></div>
    <div style="display:flex;gap:var(--sp-3);margin-bottom:var(--sp-6)"><div class="skeleton" style="width:180px;height:36px;border-radius:var(--r-md)"></div><div class="skeleton" style="width:180px;height:36px;border-radius:var(--r-md)"></div></div>
    <div class="skeleton" style="width:65%;height:60px;border-radius:var(--r-lg);margin-bottom:var(--sp-4)"></div>
    <div class="skeleton" style="width:70%;height:80px;border-radius:var(--r-lg);margin-bottom:var(--sp-4);margin-left:auto"></div>
    <div class="skeleton" style="width:60%;height:60px;border-radius:var(--r-lg);margin-bottom:var(--sp-6)"></div>
    <div class="skeleton" style="width:100%;height:44px;border-radius:var(--r-md)"></div>`,

  form: `
    <div style="margin-bottom:var(--sp-6)"><div class="skeleton skeleton-text" style="width:200px;height:20px;margin-bottom:var(--sp-2)"></div><div class="skeleton skeleton-text" style="width:320px;height:14px"></div></div>
    <div style="display:flex;flex-direction:column;gap:var(--sp-4);max-width:640px">
      <div class="skeleton" style="width:100%;height:44px;border-radius:var(--r-md)"></div>
      <div class="skeleton" style="width:100%;height:44px;border-radius:var(--r-md)"></div>
      <div class="skeleton" style="width:100%;height:44px;border-radius:var(--r-md)"></div>
      <div class="skeleton" style="width:100%;height:100px;border-radius:var(--r-md)"></div>
      <div class="skeleton" style="width:120px;height:40px;border-radius:var(--r-md)"></div>
    </div>`,

  cards: `
    <div style="margin-bottom:var(--sp-6)"><div class="skeleton skeleton-text" style="width:200px;height:20px;margin-bottom:var(--sp-2)"></div><div class="skeleton skeleton-text" style="width:320px;height:14px"></div></div>
    <div style="display:flex;gap:var(--sp-3);margin-bottom:var(--sp-6)"><div class="skeleton" style="width:80px;height:32px;border-radius:var(--r-full)"></div><div class="skeleton" style="width:80px;height:32px;border-radius:var(--r-full)"></div><div class="skeleton" style="width:80px;height:32px;border-radius:var(--r-full)"></div></div>
    <div class="skel-grid-3" style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--sp-4)"><div class="skeleton" style="height:200px;border-radius:var(--r-lg)"></div><div class="skeleton" style="height:200px;border-radius:var(--r-lg)"></div><div class="skeleton" style="height:200px;border-radius:var(--r-lg)"></div></div>`,
};

function isSkeletonType(value: string): value is SkeletonType {
  return value in SKELETON_TEMPLATES;
}

export function initSkeleton(): void {
  document.addEventListener('DOMContentLoaded', () => {
    const main = document.getElementById('main');
    if (!main) return;

    // Skip: auth pages (no shell), skeleton disabled, reduced motion
    if (!document.getElementById('rail')) return;
    if (localStorage.getItem('ap_skeleton_anim') === 'false') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const skelTypeRaw = main.dataset.skeleton || 'dashboard';
    const skelType: SkeletonType = isSkeletonType(skelTypeRaw) ? skelTypeRaw : 'dashboard';
    const template = SKELETON_TEMPLATES[skelType];

    // Create skeleton overlay
    const skel = document.createElement('div');
    skel.id = 'skeleton-overlay';
    skel.setAttribute('aria-hidden', 'true');
    skel.style.cssText =
      `position:absolute;top:0;left:0;right:0;padding:var(--sp-6) var(--sp-4);z-index:10;transition:opacity ${FADE_MS}ms ease`;
    skel.innerHTML = template;

    // Mark main as loading for assistive technology
    main.setAttribute('aria-busy', 'true');

    // Position main relative for absolute skeleton overlay
    main.style.position = 'relative';

    // Hide real content initially
    const children = Array.from(main.children) as HTMLElement[];
    children.forEach((c) => {
      c.style.opacity = '0';
      c.style.transition = `opacity ${FADE_MS}ms ease`;
    });

    // Insert skeleton as first child
    main.insertBefore(skel, main.firstChild);

    // Skeleton delay: random between MIN and MAX
    const loadTime = SKELETON_DELAY_MIN + Math.random() * (SKELETON_DELAY_MAX - SKELETON_DELAY_MIN);

    setTimeout(() => {
      // Fade out skeleton
      skel.style.opacity = '0';

      setTimeout(() => {
        try { skel.remove(); } catch (e) { console.warn('Skeleton: remove failed', e); }
        try { main.style.position = ''; } catch (e) { console.warn('Skeleton: position restore failed', e); }
        main.removeAttribute('aria-busy');

        // Fade in real content with stagger
        children.forEach((c, i) => {
          setTimeout(() => { c.style.opacity = '1'; }, i * STAGGER_MS);
        });
      }, FADE_MS);
    }, loadTime);
  });
}
