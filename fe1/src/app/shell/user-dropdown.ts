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

  // Track trigger intent — prevents same-tick close
  let justOpened = false;

  // Event delegation — works even after sidebar re-renders #user-trigger
  // Uses capture phase to fire before other document listeners
  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const trigger = target.closest('#user-trigger');

    if (trigger) {
      e.preventDefault();
      justOpened = true;
      udBd.classList.toggle('show');
      // Reset flag after event loop completes
      requestAnimationFrame(() => { justOpened = false; });
      return;
    }

    // Click outside dropdown → close (skip if just opened)
    if (udBd.classList.contains('show') && !justOpened) {
      const dropdown = target.closest('#user-dropdown');
      if (!dropdown) {
        udBd.classList.remove('show');
      }
    }
  }, true); // ← capture phase
}
