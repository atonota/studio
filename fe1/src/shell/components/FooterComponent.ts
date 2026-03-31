/**
 * @module shell/components/FooterComponent
 * OOP Footer — system status display.
 */

import { Component } from '../../ui/base/Component';

export class FooterComponent extends Component {
  protected buildHTML(): string {
    return '<span class="fb-dot"></span><span>Sistem aktif</span><span class="fb-sep"></span>' +
      '<span><strong style="color:var(--text);font-weight:700">12</strong> tenant</span><span class="fb-sep"></span>' +
      '<span><strong style="color:var(--text);font-weight:700">47</strong> workspace</span><span class="fb-sep"></span>' +
      '<span><strong style="color:var(--text);font-weight:700">5</strong> adaptor</span>' +
      '<span style="margin-left:auto;font-size:0.625rem;letter-spacing:0.05em">v0.1.0</span>';
  }

  protected onRendered(): void {
    this.setAria('role', 'contentinfo');
    this.setAria('aria-label', 'Sistem durumu');
  }
}
