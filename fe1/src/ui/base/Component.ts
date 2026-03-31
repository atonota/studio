/**
 * @module ui/base/Component
 * Abstract base class for all shell UI components.
 * Enforces render/destroy lifecycle and event cleanup.
 */

import type { EventBus, EventCallback } from '../../core/event-bus';

/** Abstract UI component with lifecycle management. */
export abstract class Component {
  protected el: HTMLElement | null = null;
  private boundListeners: Array<{ target: EventTarget; event: string; handler: EventListener }> = [];
  private busListeners: Array<{ event: string; cb: EventCallback }> = [];

  constructor(
    protected readonly containerId: string,
    protected readonly bus: EventBus,
  ) {}

  /** Build the component's HTML string. Subclasses must implement. */
  protected abstract buildHTML(): string;

  /** Render into container element. */
  render(): void {
    this.el = document.getElementById(this.containerId);
    if (!this.el) return;
    this.el.innerHTML = this.buildHTML();
    this.onRendered();
  }

  /** Called after render — subclasses bind events here. */
  protected onRendered(): void {}

  /** Safely add a DOM event listener (auto-cleaned on destroy). */
  protected listen(target: EventTarget, event: string, handler: EventListener): void {
    target.addEventListener(event, handler);
    this.boundListeners.push({ target, event, handler });
  }

  /** Safely subscribe to event bus (auto-cleaned on destroy). */
  protected on(event: string, cb: EventCallback): void {
    this.bus.on(event, cb);
    this.busListeners.push({ event, cb });
  }

  /** Query within this component's container. */
  protected query<T extends HTMLElement = HTMLElement>(selector: string): T | null {
    return this.el?.querySelector<T>(selector) ?? null;
  }

  /** Query all within this component's container. */
  protected queryAll<T extends HTMLElement = HTMLElement>(selector: string): T[] {
    return this.el ? Array.from(this.el.querySelectorAll<T>(selector)) : [];
  }

  /** Set ARIA attribute on the container element. */
  protected setAria(attr: string, value: string): void {
    this.el?.setAttribute(attr, value);
  }

  /** Cleanup — remove all listeners, nullify references. */
  destroy(): void {
    for (const { target, event, handler } of this.boundListeners) {
      target.removeEventListener(event, handler);
    }
    this.boundListeners = [];
    for (const { event, cb } of this.busListeners) {
      this.bus.off(event, cb);
    }
    this.busListeners = [];
    this.el = null;
  }
}
