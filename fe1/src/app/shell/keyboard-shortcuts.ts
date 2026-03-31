/**
 * keyboard-shortcuts.ts
 * Responsibility: Global keyboard event handlers — Cmd/Ctrl+K (spotlight),
 * ESC (close all overlays), Cmd/Ctrl+N (navigate to create page),
 * and ? (show shortcuts help modal).
 */

import { tmCloseAll } from './helpers';
import { toggleNotifPanel } from './notification-panel';

// ── Create page mapping per section ──────────────────────────

const CREATE_PAGES: Readonly<Record<string, string>> = {
  yonetim: 'tenant-create.html',
  seo: 'seo-keyword-magic.html',
  content: 'content-writing-assistant.html',
  ads: 'ads-campaign-create.html',
};

// ── Shortcuts help modal ──────────────────────────

function showShortcutsHelp(): void {
  if (document.getElementById('shortcuts-help-modal')) return;
  const mac = /mac/i.test(navigator.platform);
  const modLabel = mac ? '\u2318' : 'Ctrl+';

  const shortcuts: ReadonlyArray<readonly [string, string]> = [
    [modLabel + 'K', 'Spotlight Arama'],
    [modLabel + 'N', 'Yeni Olustur'],
    ['?', 'Kisayol Yardimi'],
    ['ESC', 'Kapat'],
  ];

  const rows = shortcuts
    .map(
      ([k, v]) =>
        `<div style="display:flex;align-items:center;justify-content:space-between">` +
        `<span style="font-size:0.8125rem;color:var(--text)">${v}</span>` +
        `<kbd style="font-size:0.75rem;font-weight:600;color:var(--muted);background:var(--surface-2);border:1px solid var(--border);padding:3px 10px;border-radius:6px;font-family:monospace;min-width:48px;text-align:center">${k}</kbd></div>`,
    )
    .join('');

  const overlay = document.createElement('div');
  overlay.id = 'shortcuts-help-modal';
  overlay.className = 'ap-confirm-backdrop';
  overlay.style.cssText = 'z-index:9999;';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Klavye kisayollari');
  overlay.innerHTML =
    `<div style="background:var(--color-glass-panel);backdrop-filter:blur(var(--blur-level)) saturate(1.4);-webkit-backdrop-filter:blur(var(--blur-level)) saturate(1.4);border:1px solid var(--glass-border);border-radius:16px;padding:28px 32px;min-width:340px;max-width:420px;box-shadow:0 24px 48px rgba(0,0,0,0.4);">` +
    `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">` +
    `<h3 style="font-size:1rem;font-weight:700;color:var(--text);margin:0" id="shortcuts-title">Klavye Kisayollari</h3>` +
    `<button id="shortcuts-close" style="background:none;border:none;cursor:pointer;color:var(--muted);font-size:1.25rem;padding:4px" aria-label="Kapat"><i class="ph ph-x" aria-hidden="true"></i></button></div>` +
    `<div style="display:flex;flex-direction:column;gap:12px" role="list">${rows}</div></div>`;

  document.body.appendChild(overlay);

  // Focus trap for modal dialog
  const closeBtn = document.getElementById('shortcuts-close');
  if (closeBtn) {
    closeBtn.focus();
    closeBtn.onclick = () => overlay.remove();
  }
  overlay.onclick = (ev: MouseEvent) => {
    if (ev.target === overlay) overlay.remove();
  };
  overlay.addEventListener('keydown', (ev: KeyboardEvent) => {
    if (ev.key === 'Tab') {
      // Trap focus within the modal
      const focusable = overlay.querySelectorAll<HTMLElement>('button, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (ev.shiftKey && document.activeElement === first) {
        ev.preventDefault();
        last.focus();
      } else if (!ev.shiftKey && document.activeElement === last) {
        ev.preventDefault();
        first.focus();
      }
    }
  });
}

// ── Bind global keydown ──────────────────────────

export function initKeyboardShortcuts(base: string): void {
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    const mod = e.metaKey || e.ctrlKey;

    // Cmd/Ctrl+K -> Spotlight
    if (mod && e.key === 'k') {
      e.preventDefault();
      const spotBd = document.getElementById('spotlight-backdrop');
      if (spotBd) {
        spotBd.classList.add('open');
        (document.getElementById('sp-input') as HTMLInputElement | null)?.focus();
      }
      return;
    }

    // ESC -> close all overlays
    if (e.key === 'Escape') {
      const spotBd = document.getElementById('spotlight-backdrop');
      if (spotBd) spotBd.classList.remove('open');

      const udBd = document.getElementById('ud-backdrop');
      if (udBd) udBd.classList.remove('show');

      tmCloseAll();

      const np = document.getElementById('np-panel');
      if (np && np.classList.contains('open')) toggleNotifPanel();

      const tb = document.getElementById('tenant-backdrop');
      if (tb) tb.classList.remove('show');

      const hm = document.getElementById('shortcuts-help-modal');
      if (hm) hm.remove();
      return;
    }

    // Cmd/Ctrl+N -> create page
    if (mod && e.key === 'n') {
      e.preventDefault();
      const skey = (window as unknown as Record<string, unknown>).__SHELL_KEY as string | undefined;
      if (skey && CREATE_PAGES[skey]) {
        window.location.href = base + 'pages/' + CREATE_PAGES[skey];
      }
      return;
    }

    // ? -> shortcuts help
    if (
      e.key === '?' &&
      !e.ctrlKey &&
      !e.metaKey &&
      !['INPUT', 'TEXTAREA', 'SELECT'].includes((document.activeElement as HTMLElement | null)?.tagName ?? '')
    ) {
      e.preventDefault();
      showShortcutsHelp();
    }
  });
}
