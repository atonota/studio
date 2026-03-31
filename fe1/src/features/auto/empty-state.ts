/**
 * empty-state.ts — Auto-inject empty state for tables with zero rows (auto-feature)
 *
 * Responsibility: On DOMContentLoaded, scans all tables for empty <tbody>.
 * Injects a contextual empty-state message based on window.__SHELL_KEY.
 * Also exposes window.emptyStateHTML(key) helper for Alpine.js pages.
 *
 * Usage: Automatic for static tables. Manual via window.emptyStateHTML('seo')
 */

interface EmptyMessage {
  icon: string;
  title: string;
  desc: string;
  action?: string;
  href?: string;
}

// Window type extensions are declared in shared/types/index.ts

const EMPTY_MESSAGES: Record<string, EmptyMessage> = {
  seo: {
    icon: 'ph-chart-line-up',
    title: 'Henuz SEO verisi yok',
    desc: 'Bir workspace ekleyin ve ilk site denetimini baslatin.',
    action: 'Workspace Ekle',
    href: 'workspace-create.html',
  },
  content: {
    icon: 'ph-article',
    title: 'Henuz icerik analiz edilmedi',
    desc: 'Bir workspace ekleyerek icerik analizi baslatin.',
    action: 'Workspace Ekle',
    href: 'workspace-create.html',
  },
  ads: {
    icon: 'ph-megaphone',
    title: 'Henuz reklam hesabi bagli degil',
    desc: 'Bir reklam platformu baglayarak kampanya yonetimine baslayin.',
    action: 'Hesap Bagla',
    href: 'ads-accounts.html',
  },
  analytics: {
    icon: 'ph-chart-bar',
    title: 'Henuz analitik verisi yok',
    desc: 'Google Analytics veya atonota pixel entegrasyonunu yapin.',
    action: 'Entegrasyon',
    href: 'adapters.html',
  },
  competitors: {
    icon: 'ph-binoculars',
    title: 'Henuz rakip eklenmedi',
    desc: 'Rakip domain ekleyerek rekabet analizine baslayin.',
    action: 'Rakip Ekle',
    href: 'competitors.html',
  },
  security: {
    icon: 'ph-shield-check',
    title: 'Henuz guvenlik taramasi yapilmadi',
    desc: 'Ilk guvenlik taramasini baslatin.',
    action: 'Tarama Baslat',
    href: 'security-vulnerabilities.html',
  },
  adapters: {
    icon: 'ph-plugs-connected',
    title: 'Henuz platform bagli degil',
    desc: '83+ platformdan birini baglayarak baslayin.',
    action: 'Platform Bagla',
    href: 'adapter-connect.html',
  },
  reports: {
    icon: 'ph-file-text',
    title: 'Henuz rapor olusturulmadi',
    desc: 'Ilk raporunuzu AI ile olusturun.',
    action: 'Rapor Olustur',
    href: 'report-create.html',
  },
  audit: {
    icon: 'ph-clock-counter-clockwise',
    title: 'Henuz audit kaydi yok',
    desc: 'Sistem kullanildikca olaylar burada listelenir.',
  },
  default: {
    icon: 'ph-database',
    title: 'Veri bulunamadi',
    desc: 'Filtreleri degistirin veya yeni veri ekleyin.',
  },
};

function getMessage(key: string): EmptyMessage {
  return EMPTY_MESSAGES[key] ?? EMPTY_MESSAGES['default']!;
}

function buildEmptyHTML(msg: EmptyMessage, actionHref: string): string {
  const actionBtn = msg.action
    ? `<a href="${actionHref}" class="btn-primary" style="font-size:0.8125rem;padding:8px 16px">${msg.action}</a>`
    : '';

  return `<div class="empty-state"><i class="ph ${msg.icon}"></i><h3>${msg.title}</h3><p>${msg.desc}</p>${actionBtn}</div>`;
}

function resolveHref(href: string | undefined): string {
  if (!href) return '';
  const inPages = window.location.pathname.includes('/pages/');
  return inPages ? href : 'pages/' + href;
}

export function initEmptyState(): void {
  // Auto-inject into empty static tables
  document.addEventListener('DOMContentLoaded', () => {
    const tables = document.querySelectorAll<HTMLTableElement>('table.r-table, table');

    tables.forEach((table) => {
      const tbody = table.querySelector('tbody');
      if (!tbody) return;
      if (tbody.querySelectorAll('tr').length > 0) return;

      const cols = table.querySelectorAll('thead th').length || 3;
      const key = window.__SHELL_KEY || 'default';
      const msg = getMessage(key);
      const actionHref = resolveHref(msg.href);

      tbody.innerHTML =
        `<tr><td colspan="${cols}" style="padding:0">${buildEmptyHTML(msg, actionHref)}</td></tr>`;
    });
  });

  // Global helper function for Alpine.js pages
  window.emptyStateHTML = function (key: string): string {
    const msg = getMessage(key);
    return `<div class="empty-state"><i class="ph ${msg.icon}"></i><h3>${msg.title}</h3><p>${msg.desc}</p></div>`;
  };
}
