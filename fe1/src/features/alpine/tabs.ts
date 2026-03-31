/**
 * tabs.ts — Tab navigation Alpine.js data component
 *
 * Responsibility: Manages tab selection state with full keyboard navigation
 * (ArrowRight/Left/Up/Down, Home, End). Supports ARIA tab pattern with
 * dynamic tab registration and panel focus management.
 *
 * Usage: x-data="tabs('genel')"
 * Methods: select(id, focusPanel?), isActive(id), registerTab(id), handleTabKey(e, id)
 */

declare const Alpine: {
  store(name: string, definition?: Record<string, unknown>): Record<string, unknown>;
  data(name: string, factory: (...args: unknown[]) => Record<string, unknown>): void;
};

/* Alpine injects $nextTick on the component instance at runtime */
interface AlpineThis {
  active: string;
  _tabKeys: string[];
  $nextTick(fn: () => void): void;
}

export function registerTabs(): void {
  Alpine.data('tabs', (defaultTab: unknown = '') => {
    const initial = typeof defaultTab === 'string' ? defaultTab : '';

    return {
      active: initial,
      _tabKeys: [] as string[],

      select(this: AlpineThis, id: string, focusPanel?: boolean) {
        this.active = id;
        if (!focusPanel) return;

        this.$nextTick(() => {
          const panel = document.getElementById('tabpanel-' + id);
          if (panel) panel.focus();
        });
      },

      isActive(this: AlpineThis, id: string): boolean {
        return this.active === id;
      },

      registerTab(this: AlpineThis, id: string) {
        if (this._tabKeys.indexOf(id) === -1) this._tabKeys.push(id);
      },

      handleTabKey(this: AlpineThis, e: KeyboardEvent, id: string) {
        const keys = this._tabKeys;
        if (!keys.length) return;

        const idx = keys.indexOf(id);
        let next = -1;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          next = (idx + 1) % keys.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          next = (idx - 1 + keys.length) % keys.length;
        } else if (e.key === 'Home') {
          e.preventDefault();
          next = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          next = keys.length - 1;
        }

        if (next < 0) return;

        this.active = keys[next] ?? '';
        this.$nextTick(() => {
          const btn = document.getElementById('tab-' + (keys[next] ?? ''));
          if (btn) btn.focus();
        });
      },
    };
  });
}
