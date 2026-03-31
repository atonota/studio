/**
 * helpers.ts
 * Responsibility: Pure utility functions used across shell modules —
 * path resolution, current page key detection, toast notifications,
 * and legacy stubs (tmCloseAll, buildTopMenu).
 */

// ── Path utilities ──────────────────────────

export function getBasePath(): string {
  const p = window.location.pathname;
  return p.includes('/pages/') ? '../' : '';
}

export function getCurrentKey(): string {
  const p = window.location.pathname;
  if (p.endsWith('index.html') || p.endsWith('/') || p === '') return 'dashboard';
  const m = p.match(/\/([^/]+)\.html$/);
  return m ? m[1] ?? 'dashboard' : 'dashboard';
}

export function getCurrentFile(): string {
  return window.location.pathname.split('/').pop() ?? '';
}

export function isInPages(): boolean {
  return window.location.pathname.includes('/pages/');
}

/**
 * Resolve an href relative to the current page location.
 * Handles the index.html special case and pages/ prefix.
 */
export function tmResolveHref(href: string): string {
  if (!href) return '#';
  const inPages = isInPages();
  if (href === 'index.html') {
    return inPages ? '../index.html' : 'index.html';
  }
  return inPages ? href : 'pages/' + href;
}

// ── Toast ──────────────────────────

export function showToast(msg: string, duration?: number): void {
  const dur = duration ?? 2500;
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText =
      'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none;';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.style.cssText =
    'padding:10px 20px;background:var(--surface-2);color:var(--text);border:1px solid var(--border);border-radius:10px;font-size:0.8125rem;font-weight:500;box-shadow:0 4px 24px rgba(0,0,0,0.25);pointer-events:auto;opacity:0;transform:translateY(8px);transition:opacity 0.2s,transform 0.2s;';
  toast.textContent = msg;
  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    setTimeout(() => toast.remove(), 200);
  }, dur);
}

// ── Legacy stubs ──────────────────────────

/** Legacy stub — ESC handler references this */
export function tmCloseAll(): void {}

/** Legacy stub — initShell references this */
export function buildTopMenu(): void {}
