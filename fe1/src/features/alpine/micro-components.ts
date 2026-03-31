/**
 * micro-components.ts — Small Alpine.js data components bundled together
 *
 * Responsibility: Registers lightweight Alpine data components that are
 * too small for individual files. Includes:
 *   - toggle(initial)     — boolean on/off state
 *   - modal()             — open/close with focus trap and body scroll lock
 *   - dropdown()          — open/close with value selection
 *   - multiSelect(initial) — multi-item selection with toggle
 *   - counter(target, duration) — animated number counter
 *   - filterPills(default, options) — pill-based single filter
 *   - accordion(openIndex) — single-open accordion
 *   - $copyText magic     — clipboard write + toast notification
 *
 * Status: Ready but not yet used in pages (except counter).
 */

declare const Alpine: {
  store(name: string, definition?: Record<string, unknown>): Record<string, unknown>;
  data(name: string, factory: (...args: unknown[]) => Record<string, unknown>): void;
  magic(name: string, callback: () => unknown): void;
};

/* Alpine injects $el and $nextTick on the component instance at runtime */
interface AlpineModalThis {
  isOpen: boolean;
  _trigger: HTMLElement | null;
  $el: HTMLElement;
  $nextTick(fn: () => void): void;
}

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

// ── Toggle ──────────────────────────────────────

function registerToggle(): void {
  Alpine.data('toggle', (initial: unknown = false) => ({
    on: initial === true,
    flip() { this.on = !this.on; },
  }));
}

// ── Modal ───────────────────────────────────────

function registerModal(): void {
  Alpine.data('modal', () => ({
    isOpen: false,
    _trigger: null as HTMLElement | null,

    open(this: AlpineModalThis) {
      this._trigger = document.activeElement as HTMLElement | null;
      this.isOpen = true;
      document.body.style.overflow = 'hidden';

      this.$nextTick(() => {
        const el = this.$el.querySelector<HTMLElement>(
          `[autofocus], ${FOCUSABLE_SELECTOR}`
        );
        if (el) el.focus();
      });
    },

    close(this: AlpineModalThis) {
      this.isOpen = false;
      document.body.style.overflow = '';
      if (!this._trigger) return;
      this._trigger.focus();
      this._trigger = null;
    },

    trapFocus(this: AlpineModalThis, e: KeyboardEvent) {
      if (!this.isOpen || e.key !== 'Tab') return;

      const focusable = this.$el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
        return;
      }

      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
  }));
}

// ── Dropdown ────────────────────────────────────

function registerDropdown(): void {
  Alpine.data('dropdown', () => ({
    open: false,
    value: '',
    label: '',
    toggle() { this.open = !this.open; },
    select(val: string, lbl: string) {
      this.value = val;
      this.label = lbl;
      this.open = false;
    },
    close() { this.open = false; },
  }));
}

// ── Multi Select ────────────────────────────────

interface MultiSelectComponent {
  selected: string[];
  toggle(id: string): void;
  isSelected(id: string): boolean;
  readonly count: number;
}

function registerMultiSelect(): void {
  Alpine.data('multiSelect', (initial: unknown = []) => {
    const list: string[] = Array.isArray(initial) ? (initial as string[]) : [];

    const component: MultiSelectComponent = {
      selected: [...list],

      toggle(id: string) {
        const i = this.selected.indexOf(id);
        if (i >= 0) {
          this.selected.splice(i, 1);
        } else {
          this.selected.push(id);
        }
      },

      isSelected(id: string): boolean {
        return this.selected.includes(id);
      },

      get count(): number {
        return this.selected.length;
      },
    };
    return component as unknown as Record<string, unknown>;
  });
}

// ── Counter Animation ───────────────────────────

interface CounterComponent {
  current: number;
  target: number;
  display: string;
  init(): void;
}

function registerCounter(): void {
  Alpine.data('counter', (target: unknown = 0, duration: unknown = 800) => {
    const targetNum = typeof target === 'number' ? target : 0;
    const durationMs = typeof duration === 'number' ? duration : 800;

    const component: CounterComponent = {
      current: 0,
      target: targetNum,
      display: '0',

      init() {
        const self = this;
        const start = performance.now();

        const step = (now: number) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / durationMs, 1);
          self.current = Math.floor(progress * self.target);
          self.display = self.current.toLocaleString('tr-TR');

          if (progress < 1) {
            requestAnimationFrame(step);
            return;
          }

          self.display = self.target.toLocaleString('tr-TR');
        };

        requestAnimationFrame(step);
      },
    };
    return component as unknown as Record<string, unknown>;
  });
}

// ── Filter Pills ────────────────────────────────

interface FilterPillsComponent {
  active: string;
  options: string[];
  select(val: string): void;
  isActive(val: string): boolean;
}

function registerFilterPills(): void {
  Alpine.data('filterPills', (defaultVal: unknown = '', options: unknown = []) => {
    const defaultStr = typeof defaultVal === 'string' ? defaultVal : '';
    const optList: string[] = Array.isArray(options) ? (options as string[]) : [];

    const component: FilterPillsComponent = {
      active: defaultStr,
      options: optList,
      select(val: string) { this.active = val; },
      isActive(val: string): boolean { return this.active === val; },
    };
    return component as unknown as Record<string, unknown>;
  });
}

// ── Accordion ───────────────────────────────────

interface AccordionComponent {
  openIdx: number;
  toggle(i: number): void;
  isOpen(i: number): boolean;
}

function registerAccordion(): void {
  Alpine.data('accordion', (openIndex: unknown = -1) => {
    const idx = typeof openIndex === 'number' ? openIndex : -1;

    const component: AccordionComponent = {
      openIdx: idx,
      toggle(i: number) { this.openIdx = this.openIdx === i ? -1 : i; },
      isOpen(i: number): boolean { return this.openIdx === i; },
    };
    return component as unknown as Record<string, unknown>;
  });
}

// ── Copy to Clipboard Magic ─────────────────────

function registerCopyText(): void {
  Alpine.magic('copyText', () => {
    return (text: string): void => {
      navigator.clipboard.writeText(text).then(() => {
        const store = Alpine.store('toast') as { show(msg: string, type: string, duration: number): void };
        store.show('Kopyalandi!', 'success', 2000);
      });
    };
  });
}

// ── Public registration ─────────────────────────

export function registerMicroComponents(): void {
  registerToggle();
  registerModal();
  registerDropdown();
  registerMultiSelect();
  registerCounter();
  registerFilterPills();
  registerAccordion();
  registerCopyText();
}
