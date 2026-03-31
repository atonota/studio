/**
 * @module shell/components/KeyboardShortcutManager
 * OOP keyboard shortcuts — handler registry pattern.
 * Replaces procedural initKeyboardShortcuts().
 */

import type { EventBus } from '../../core/event-bus';
import { h, icon } from '../../ui/base/DOMHelper';

interface KeyCombo {
  key: string;
  mod?: boolean;
  notInInput?: boolean;
}

type ShortcutHandler = (e: KeyboardEvent) => void;

export class KeyboardShortcutManager {
  private handlers: Array<{ combo: KeyCombo; handler: ShortcutHandler }> = [];
  private keydownHandler: ((e: KeyboardEvent) => void) | null = null;

  constructor(private readonly bus: EventBus) {}

  /** Register a keyboard shortcut. */
  register(combo: KeyCombo, handler: ShortcutHandler): void {
    this.handlers.push({ combo, handler });
  }

  /** Start listening for keyboard events. */
  init(): void {
    this.keydownHandler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      const activeTag = (document.activeElement as HTMLElement | null)?.tagName ?? '';
      const inInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag);

      for (const { combo, handler } of this.handlers) {
        if (combo.mod && !mod) continue;
        if (!combo.mod && mod && combo.key !== 'Escape') continue;
        if (combo.notInInput && inInput) continue;
        if (e.key === combo.key || e.key.toLowerCase() === combo.key.toLowerCase()) {
          e.preventDefault();
          handler(e);
          return;
        }
      }
    };
    window.addEventListener('keydown', this.keydownHandler);
  }

  /** Show shortcuts help modal. */
  showHelp(): void {
    if (document.getElementById('shortcuts-help-modal')) return;
    const mac = /mac/i.test(navigator.platform);
    const modLabel = mac ? '\u2318' : 'Ctrl+';

    const shortcuts: Array<[string, string]> = [
      [modLabel + 'K', 'Spotlight Arama'],
      [modLabel + 'N', 'Yeni Olustur'],
      ['?', 'Kisayol Yardimi'],
      ['ESC', 'Kapat'],
    ];

    const rows = shortcuts.map(([k, v]) =>
      h('div', { style: 'display:flex;align-items:center;justify-content:space-between', role: 'listitem' },
        h('span', { style: 'font-size:0.8125rem;color:var(--text)' }, v),
        h('kbd', { style: 'font-size:0.75rem;font-weight:600;color:var(--muted);background:var(--surface-2);border:1px solid var(--border);padding:3px 10px;border-radius:6px;font-family:monospace;min-width:48px;text-align:center' }, k),
      )
    ).join('');

    const overlay = document.createElement('div');
    overlay.id = 'shortcuts-help-modal';
    overlay.className = 'ap-confirm-backdrop';
    overlay.style.cssText = 'z-index:9999;';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Klavye kisayollari');
    overlay.innerHTML =
      h('div', { style: 'background:var(--color-glass-panel);backdrop-filter:blur(var(--blur-level)) saturate(1.4);-webkit-backdrop-filter:blur(var(--blur-level)) saturate(1.4);border:1px solid var(--glass-border);border-radius:16px;padding:28px 32px;min-width:340px;max-width:420px;box-shadow:0 24px 48px rgba(0,0,0,0.4)' },
        h('div', { style: 'display:flex;align-items:center;justify-content:space-between;margin-bottom:20px' },
          h('h3', { style: 'font-size:1rem;font-weight:700;color:var(--text);margin:0' }, 'Klavye Kisayollari'),
          h('button', { id: 'shortcuts-close', style: 'background:none;border:none;cursor:pointer;color:var(--muted);font-size:1.25rem;padding:4px', 'aria-label': 'Kapat' }, icon('ph-x')),
        ),
        h('div', { style: 'display:flex;flex-direction:column;gap:12px', role: 'list' }, rows),
      );

    document.body.appendChild(overlay);

    const closeBtn = document.getElementById('shortcuts-close');
    if (closeBtn) {
      closeBtn.focus();
      closeBtn.onclick = () => overlay.remove();
    }
    overlay.onclick = (ev: MouseEvent) => { if (ev.target === overlay) overlay.remove(); };

    // Focus trap
    overlay.addEventListener('keydown', (ev: KeyboardEvent) => {
      if (ev.key === 'Tab') {
        const focusable = overlay.querySelectorAll<HTMLElement>('button, [tabindex]:not([tabindex="-1"])');
        if (focusable.length === 0) return;
        const first = focusable[0]!;
        const last = focusable[focusable.length - 1]!;
        if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
        else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
      }
    });
  }

  /** Stop listening. */
  destroy(): void {
    if (this.keydownHandler) {
      window.removeEventListener('keydown', this.keydownHandler);
      this.keydownHandler = null;
    }
    this.handlers = [];
  }
}
