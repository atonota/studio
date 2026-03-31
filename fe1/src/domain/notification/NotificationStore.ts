/**
 * @module domain/notification/NotificationStore
 * OOP notification data store — private items, CRUD, event bus.
 * Replaces module-level let NP_DATA mutation in notification-panel.ts.
 */

import { createEventBus } from '../../core/event-bus';
import type { EventCallback } from '../../core/event-bus';

export interface NotifItem {
  id: number;
  cat: string;
  icon: string;
  ic: string;
  ib: string;
  t: string;
  d: string;
  time: string;
  read: boolean;
}

export interface NotifCategory {
  key: string;
  label: string;
}

export class NotificationStore {
  private items: NotifItem[];
  private bus = createEventBus();

  static readonly CATEGORIES: readonly NotifCategory[] = [
    { key: 'tumu', label: 'Tumu' },
    { key: 'seo', label: 'SEO' },
    { key: 'icerik', label: 'Icerik' },
    { key: 'reklamlar', label: 'Reklamlar' },
    { key: 'sistem', label: 'Sistem' },
    { key: 'ai', label: 'AI Raporlar' },
  ];

  constructor(initialItems: NotifItem[]) {
    this.items = [...initialItems];
  }

  /** Get items filtered by category. 'tumu' returns all. */
  getFiltered(cat: string): readonly NotifItem[] {
    return cat === 'tumu' ? this.items : this.items.filter(n => n.cat === cat);
  }

  /** Get unread count. */
  get unreadCount(): number {
    return this.items.filter(n => !n.read).length;
  }

  /** Mark a single item as read. */
  markAsRead(id: number): void {
    const item = this.items.find(n => n.id === id);
    if (item) {
      item.read = true;
      this.bus.emit('change', {});
    }
  }

  /** Remove an item. */
  dismiss(id: number): void {
    this.items = this.items.filter(n => n.id !== id);
    this.bus.emit('change', {});
  }

  /** Mark all as read. */
  markAllAsRead(): void {
    this.items.forEach(n => { n.read = true; });
    this.bus.emit('change', {});
  }

  on(event: string, cb: EventCallback): void { this.bus.on(event, cb); }
  off(event: string, cb: EventCallback): void { this.bus.off(event, cb); }
}
