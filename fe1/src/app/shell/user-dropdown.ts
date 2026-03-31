/**
 * user-dropdown.ts
 * Responsibility: Render the user card dropdown (#ud-backdrop) with profile,
 * settings, and logout links. Bind open/close events from user-trigger click
 * and backdrop click.
 */

export function renderUserDropdown(base: string): void {
  const udBd = document.getElementById('ud-backdrop');
  if (!udBd) return;

  udBd.innerHTML =
    `<div id="user-dropdown">` +
    `<a class="ud-item" href="${base}pages/settings-profile.html"><i class="ph ph-user-circle"></i>Profil</a>` +
    `<a class="ud-item" href="${base}pages/settings.html"><i class="ph ph-gear"></i>Ayarlar</a>` +
    `<div class="ud-divider"></div>` +
    `<button class="ud-item" style="color:var(--accent);font-weight:600"><i class="ph ph-sign-out" style="color:var(--accent)"></i>Cikis Yap</button>` +
    `</div>`;
}

export function bindUserDropdownEvents(): void {
  const udBd = document.getElementById('ud-backdrop');
  if (!udBd) return;

  const trigger = document.getElementById('user-trigger');
  if (trigger) {
    trigger.onclick = () => udBd.classList.toggle('show');
  }

  udBd.onclick = (e: MouseEvent) => {
    if (e.target === udBd) udBd.classList.remove('show');
  };
}
