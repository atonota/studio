/**
 * @module core/event-bus
 * Generic typed event bus — replaces duplicated on/off/emit pattern in stores.
 */

/** Callback for event listeners. */
export type EventCallback = (payload?: unknown) => void;

/** Event bus interface. */
export interface EventBus {
  on(event: string, cb: EventCallback): void;
  off(event: string, cb: EventCallback): void;
  emit(event: string, payload?: unknown): void;
}

/** Create a new event bus instance. */
export function createEventBus(): EventBus {
  const listeners: Record<string, EventCallback[]> = {};

  return {
    on(event: string, cb: EventCallback): void {
      (listeners[event] = listeners[event] || []).push(cb);
    },

    off(event: string, cb: EventCallback): void {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter(f => f !== cb);
      }
    },

    emit(event: string, payload?: unknown): void {
      (listeners[event] || []).forEach(cb => {
        try { cb(payload); } catch (e) { console.error(`EventBus[${event}]:`, e); }
      });
    },
  };
}
