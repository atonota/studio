/**
 * stores.ts — Alpine.js global stores (toast + confirm)
 *
 * Responsibility: Registers Alpine.store('toast') and Alpine.store('confirm'),
 * and injects the associated Toast/Confirm HTML into the DOM so Alpine can
 * bind to them.
 *
 * Toast usage:  $store.toast.show('Basarili!', 'success')
 * Confirm usage: $store.confirm.ask('Emin misiniz?', () => doSomething())
 */

declare const Alpine: {
  store(name: string, definition?: Record<string, unknown>): Record<string, unknown>;
  data(name: string, factory: (...args: unknown[]) => Record<string, unknown>): void;
};

type ToastType = 'success' | 'error' | 'warning' | 'info';

const DEFAULT_TOAST_DURATION = 4000;

const TOAST_ICONS: Record<ToastType, string> = {
  success: 'ph-check-circle',
  error: 'ph-x-circle',
  warning: 'ph-warning',
  info: 'ph-info',
};

const TOAST_COLORS: Record<ToastType, string> = {
  success: '#22c55e',
  error: '#ef4444',
  warning: '#eab308',
  info: '#3b82f6',
};

// ── Toast Store ─────────────────────────────────

function registerToastStore(): void {
  Alpine.store('toast', {
    visible: false,
    message: '',
    type: 'info' as ToastType,
    timeout: null as ReturnType<typeof setTimeout> | null,
    ariaLive: 'assertive',

    show(msg: string, type: string = 'info', duration: number = DEFAULT_TOAST_DURATION) {
      this.message = msg;
      this.type = type;
      this.visible = true;

      ensureAriaLiveRegion(msg);

      if (this.timeout) clearTimeout(this.timeout as ReturnType<typeof setTimeout>);
      this.timeout = setTimeout(() => { this.visible = false; }, duration);
    },

    hide() {
      this.visible = false;
    },

    get icon(): string {
      return TOAST_ICONS[(this as { type: ToastType }).type] || TOAST_ICONS.info;
    },

    get color(): string {
      return TOAST_COLORS[(this as { type: ToastType }).type] || TOAST_COLORS.info;
    },
  });
}

function ensureAriaLiveRegion(msg: string): void {
  let region = document.getElementById('ap-toast-live');

  if (!region) {
    region = document.createElement('div');
    region.id = 'ap-toast-live';
    region.setAttribute('aria-live', 'assertive');
    region.setAttribute('aria-atomic', 'true');
    region.setAttribute('role', 'status');
    region.style.cssText =
      'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)';
    document.body.appendChild(region);
  }

  region.textContent = msg;
}

// ── Confirm Store ───────────────────────────────

function registerConfirmStore(): void {
  Alpine.store('confirm', {
    visible: false,
    message: '',
    onConfirm: null as (() => void) | null,

    ask(msg: string, callback: () => void) {
      this.message = msg;
      this.onConfirm = callback;
      this.visible = true;
    },

    yes() {
      if (this.onConfirm) (this.onConfirm as () => void)();
      this.visible = false;
    },

    no() {
      this.visible = false;
    },
  });
}

// ── DOM Injection ───────────────────────────────

function injectStoreHTML(): void {
  const html = `
    <div x-data x-show="$store.toast.visible" x-cloak
         x-transition:enter="transition ease-out duration-200"
         x-transition:enter-start="opacity-0 translate-y-2"
         x-transition:enter-end="opacity-100 translate-y-0"
         x-transition:leave="transition ease-in duration-150"
         x-transition:leave-start="opacity-100"
         x-transition:leave-end="opacity-0"
         class="ap-toast"
         @click="$store.toast.hide()">
      <i class="ph" :class="$store.toast.icon" :style="'color:'+$store.toast.color+';font-size:1.25rem;flex-shrink:0'"></i>
      <span style="font-size:0.8125rem;color:var(--text)" x-text="$store.toast.message"></span>
    </div>
    <div x-data x-show="$store.confirm.visible" x-cloak
         class="ap-confirm-backdrop"
         @click.self="$store.confirm.no()"
         x-transition:enter="transition ease-out duration-200"
         x-transition:leave="transition ease-in duration-150">
      <div style="background:var(--color-glass-panel);backdrop-filter:blur(var(--blur-level)) saturate(1.4);-webkit-backdrop-filter:blur(var(--blur-level)) saturate(1.4);border:1px solid var(--glass-border);border-radius:16px;padding:24px;max-width:400px;width:90%;box-shadow:0 24px 64px rgba(0,0,0,0.4)">
        <div style="font-size:0.9375rem;color:var(--text);margin-bottom:20px;line-height:1.5" x-text="$store.confirm.message"></div>
        <div style="display:flex;gap:8px;justify-content:flex-end">
          <button @click="$store.confirm.no()" class="btn-secondary" style="padding:8px 16px">Iptal</button>
          <button @click="$store.confirm.yes()" class="btn-primary" style="padding:8px 16px">Onayla</button>
        </div>
      </div>
    </div>`;

  document.body.insertAdjacentHTML('beforeend', html);
}

// ── Public registration ─────────────────────────

export function registerStores(): void {
  registerToastStore();
  registerConfirmStore();
  injectStoreHTML();
}
