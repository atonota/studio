/**
 * @module shell/components/RailComponent
 * OOP Rail navigation — replaces procedural renderRail() + railClick().
 */

import { Component } from '../../ui/base/Component';
import { h, icon, separator } from '../../ui/base/DOMHelper';
import type { EventBus } from '../../core/event-bus';
import type { MenuGroup } from '../../shared/types';

export class RailComponent extends Component {
  private activeKey = '';

  constructor(
    containerId: string,
    bus: EventBus,
    private readonly menu: readonly MenuGroup[],
    private readonly base: string,
  ) {
    super(containerId, bus);
  }

  setActiveKey(key: string): void {
    this.activeKey = key;
  }

  protected buildHTML(): string {
    let html = '';
    this.menu.forEach((group, gi) => {
      if (gi > 0) html += separator();
      group.items.forEach(item => {
        const active = item.key === this.activeKey ? ' active' : '';
        const ariaCurrent = item.key === this.activeKey ? 'section' : undefined;
        html += h('button', {
          class: `ni${active}`,
          'data-key': item.key,
          'data-href': `${this.base}${item.href}`,
          'aria-label': item.title,
          'aria-current': ariaCurrent,
        },
          icon(item.icon),
          h('span', { class: 'ni-label' }, item.title),
        );
      });
    });
    return html;
  }

  protected onRendered(): void {
    this.setAria('role', 'navigation');
    this.setAria('aria-label', 'Ana navigasyon');

    this.queryAll<HTMLButtonElement>('.ni').forEach(btn => {
      this.listen(btn, 'click', () => this.handleClick(btn));
    });
  }

  private handleClick(btn: HTMLElement): void {
    const clickedKey = btn.dataset['key'] ?? '';
    this.bus.emit('rail:click', { key: clickedKey, base: this.base });

    // Update active indicator
    this.queryAll('.ni').forEach(ni => ni.classList.remove('active'));
    btn.classList.add('active');
  }
}
