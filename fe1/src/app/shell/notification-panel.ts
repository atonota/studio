/**
 * notification-panel.ts
 * Responsibility: Off-canvas notification panel — renders notification items
 * across categories, handles tab filtering, read/dismiss actions,
 * badge syncing (topbar + bottom-nav), and panel open/close toggle.
 * Uses NotificationStore (OOP) for data management.
 */

import { NotificationStore } from '../../domain/notification/NotificationStore';
import type { NotifItem } from '../../domain/notification/NotificationStore';

declare const Alpine: { store: (name: string) => { show: (msg: string, type: string, dur: number) => void } };

// ── Store instance (OOP — replaces module-level let NP_DATA) ──────────────────────────

const NP_CATS = NotificationStore.CATEGORIES;

const npStore = new NotificationStore([
  { id:1,cat:'seo',icon:'ph-chart-line-up',ic:'#22c55e',ib:'rgba(34,197,94,0.1)',t:"Anahtar kelime 'flutter developer' 3. siraya yukseldi",d:'Google SERP pozisyon takibi guncel sonuclari.',time:'5 dk once',read:false },
  { id:2,cat:'seo',icon:'ph-link-simple',ic:'#3b82f6',ib:'rgba(59,130,246,0.1)',t:'Backlink profili %12 buyudu',d:'Son 7 gunde 34 yeni kaliteli backlink kazanildi.',time:'23 dk once',read:false },
  { id:3,cat:'seo',icon:'ph-bug',ic:'#a855f7',ib:'rgba(168,85,247,0.1)',t:"Teknik SEO skoru 92'ye cikti",d:'Site denetimi tamamlandi. 3 uyari giderildi.',time:'1 saat once',read:false },
  { id:4,cat:'seo',icon:'ph-globe-hemisphere-west',ic:'#22c55e',ib:'rgba(34,197,94,0.1)',t:"GEO: AI gorunurluk %78'e ulasti",d:"ChatGPT ve Perplexity'de brand mention artti.",time:'2 saat once',read:true },
  { id:5,cat:'seo',icon:'ph-ranking',ic:'#eab308',ib:'rgba(234,179,8,0.1)',t:'5 anahtar kelime ilk sayfadan dustu',d:'Haftalik rank takibi uyarisi.',time:'4 saat once',read:true },
  { id:6,cat:'icerik',icon:'ph-article',ic:'#3b82f6',ib:'rgba(59,130,246,0.1)',t:"Blog yazisi 'AI Trendleri 2026' 2.4K goruntulenme aldi",d:'Gecen haftaya gore %340 artis.',time:'12 dk once',read:false },
  { id:7,cat:'icerik',icon:'ph-file-text',ic:'#22c55e',ib:'rgba(34,197,94,0.1)',t:'Icerik skoru %85 uzerinde 3 yeni sayfa',d:'Content decay analizi tamamlandi.',time:'45 dk once',read:false },
  { id:8,cat:'icerik',icon:'ph-pencil-simple',ic:'#eab308',ib:'rgba(234,179,8,0.1)',t:'Icerik takvimi: 2 yazi son tarihi yaklasti',d:'Bu haftaki planlanan icerikler icin hatirlatma.',time:'3 saat once',read:true },
  { id:9,cat:'icerik',icon:'ph-tree-structure',ic:'#a855f7',ib:'rgba(168,85,247,0.1)',t:'Semantik harita: 5 orphan sayfa tespit edildi',d:'Bu sayfalar hicbir internal linkle baglanmiyor.',time:'5 saat once',read:true },
  { id:10,cat:'reklamlar',icon:'ph-megaphone',ic:'#22c55e',ib:'rgba(34,197,94,0.1)',t:"Meta kampanya ROAS 4.2x'e ulasti",d:'Bahar kampanyasi hedef ROAS\'i %40 asti.',time:'8 dk once',read:false },
  { id:11,cat:'reklamlar',icon:'ph-warning',ic:'#eab308',ib:'rgba(234,179,8,0.1)',t:'Google Ads butcesi %90 harcandi',d:'Gunluk butce limiti 2 saat icinde dolacak.',time:'30 dk once',read:false },
  { id:12,cat:'reklamlar',icon:'ph-tiktok-logo',ic:'#3b82f6',ib:'rgba(59,130,246,0.1)',t:'TikTok Ads: Yeni hedef kitle onerisi',d:'AI analizi yeni bir lookalike segment onerdi.',time:'1 saat once',read:false },
  { id:13,cat:'reklamlar',icon:'ph-chart-bar',ic:'#a855f7',ib:'rgba(168,85,247,0.1)',t:'Cross-channel attribution raporu hazir',d:'Son 30 gunluk performans ozeti.',time:'6 saat once',read:true },
  { id:14,cat:'sistem',icon:'ph-database',ic:'#22c55e',ib:'rgba(34,197,94,0.1)',t:'PostgreSQL replikasyon gecikmesi <50ms',d:'Veritabani sagligi normal seviyelerde.',time:'15 dk once',read:true },
  { id:15,cat:'sistem',icon:'ph-shield-warning',ic:'#ef4444',ib:'rgba(239,68,68,0.1)',t:'SSL sertifikasi 14 gun icinde dolacak',d:"acme.com icin Let's Encrypt yenileme gerekli.",time:'1 saat once',read:false },
  { id:16,cat:'sistem',icon:'ph-plugs-connected',ic:'#eab308',ib:'rgba(234,179,8,0.1)',t:'Drupal adaptoru: baglanti yeniden kuruldu',d:'3 basarisiz health check sonrasi otomatik yeniden baglandi.',time:'2 saat once',read:false },
  { id:17,cat:'sistem',icon:'ph-arrow-clockwise',ic:'#3b82f6',ib:'rgba(59,130,246,0.1)',t:'Otomatik yedekleme tamamlandi',d:'Gunluk PostgreSQL snapshot alindi. Boyut: 2.4 GB.',time:'4 saat once',read:true },
  { id:18,cat:'ai',icon:'ph-robot',ic:'#a855f7',ib:'rgba(168,85,247,0.1)',t:'Haftalik SEO ozeti hazirlandi',d:'AI tarafindan olusturulan 7 gunluk performans raporu.',time:'10 dk once',read:false },
  { id:19,cat:'ai',icon:'ph-flag',ic:'#ef4444',ib:'rgba(239,68,68,0.1)',t:'Rakip analiz raporu guncellendi',d:'3 rakibin SERP pozisyonlari ve icerik stratejisi analizi.',time:'25 dk once',read:false },
  { id:20,cat:'ai',icon:'ph-trend-down',ic:'#ef4444',ib:'rgba(239,68,68,0.1)',t:'Anomali: organik trafikte %18 dusus',d:'Son 72 saatlik trafik verisi normal bandinin altinda.',time:'40 dk once',read:false },
  { id:21,cat:'ai',icon:'ph-lightning',ic:'#eab308',ib:'rgba(234,179,8,0.1)',t:'AI Digest: Haftalik insight ozeti',d:'12 insight, 3 oncelikli aksiyon onerisi iceriyor.',time:'2 saat once',read:true },
  { id:22,cat:'ai',icon:'ph-brain',ic:'#22c55e',ib:'rgba(34,197,94,0.1)',t:'Brand Radar: 8 yeni bahsetme tespit edildi',d:'Reddit, Twitter ve blog platformlarinda marka bahsetmeleri.',time:'3 saat once',read:true },
]);

// ── Rendering ──────────────────────────

function renderNpList(activeTab: string): void {
  const listEl = document.getElementById('np-list');
  if (!listEl) return;

  const items = npStore.getFiltered(activeTab);

  if (!items.length) {
    listEl.innerHTML =
      '<div class="np-empty"><i class="ph ph-bell-slash"></i><span>Bu kategoride bildirim yok</span></div>';
    return;
  }

  listEl.innerHTML = items
    .map(
      (n) =>
        '<div class="np-item' + (n.read ? ' np-item--read' : '') + '">' +
        '<div class="np-icon" style="background:' + n.ib + '"><i class="ph ' + n.icon + '" style="color:' + n.ic + '"></i></div>' +
        '<div class="np-body"><div class="np-item-title">' + n.t + '</div><div class="np-item-desc">' + n.d + '</div><div class="np-meta">' + n.time + '</div></div>' +
        '<div class="np-actions">' +
        (!n.read ? '<button title="Okundu" data-np-read="' + n.id + '"><i class="ph ph-check"></i></button>' : '') +
        '<button title="Kaldir" data-np-dismiss="' + n.id + '"><i class="ph ph-x"></i></button></div></div>',
    )
    .join('');
}

function syncBadges(): void {
  const unread = npStore.unreadCount;
  const el = document.getElementById('np-count');
  if (el) el.textContent = String(unread);

  const tb = document.getElementById('notif-badge');
  if (tb) {
    tb.textContent = unread > 0 ? (unread > 99 ? '99+' : String(unread)) : '';
    tb.style.display = unread > 0 ? 'flex' : 'none';
  }

  const bn = document.getElementById('bn-notif-badge');
  if (bn) {
    bn.textContent = unread > 0 ? String(unread) : '';
    bn.style.display = unread > 0 ? 'flex' : 'none';
  }
}

// ── Init ──────────────────────────

export function initNotificationPanel(base: string): void {
  let activeTab = 'tumu';

  document.body.insertAdjacentHTML(
    'beforeend',
    '<div id="np-backdrop"></div><div id="np-panel" role="dialog" aria-modal="true" aria-label="Bildirimler">' +
    '<div class="np-header"><span class="np-title" id="np-title">Bildirimler</span><span class="np-badge" id="np-count" aria-live="polite">0</span>' +
    '<button class="np-close" id="np-close-btn" title="Kapat" aria-label="Bildirimleri kapat"><i class="ph ph-x" aria-hidden="true"></i></button></div>' +
    '<div class="np-tabs" id="np-tabs" role="tablist" aria-label="Bildirim kategorileri"></div><div class="np-list" id="np-list" role="log" aria-live="polite" aria-label="Bildirim listesi"></div>' +
    '<div class="np-footer"><button class="np-footer-btn" id="np-mark-all">Tumunu okundu isaretle</button>' +
    '<a class="np-footer-link" id="np-view-all" href="' + base + 'pages/notifications.html">Tumunu Gor <i class="ph ph-arrow-right" aria-hidden="true"></i></a></div></div>',
  );

  const tabsEl = document.getElementById('np-tabs');
  if (tabsEl) {
    NP_CATS.forEach((c) => {
      const btn = document.createElement('button');
      btn.className = 'np-tab' + (c.key === activeTab ? ' active' : '');
      btn.textContent = c.label;
      btn.dataset.cat = c.key;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', c.key === activeTab ? 'true' : 'false');
      btn.onclick = () => {
        activeTab = c.key;
        tabsEl.querySelectorAll('.np-tab').forEach((t) => {
          const isActive = (t as HTMLElement).dataset.cat === activeTab;
          t.classList.toggle('active', isActive);
          t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        renderNpList(activeTab);
      };
      tabsEl.appendChild(btn);
    });
  }

  const listEl = document.getElementById('np-list');
  if (listEl) {
    listEl.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const readBtn = target.closest<HTMLElement>('[data-np-read]');
      const dismissBtn = target.closest<HTMLElement>('[data-np-dismiss]');
      if (readBtn) {
        npStore.markAsRead(parseInt(readBtn.dataset.npRead ?? '', 10));
        renderNpList(activeTab); syncBadges();
      }
      if (dismissBtn) {
        npStore.dismiss(parseInt(dismissBtn.dataset.npDismiss ?? '', 10));
        renderNpList(activeTab); syncBadges();
      }
    });
  }

  const backdrop = document.getElementById('np-backdrop');
  if (backdrop) backdrop.onclick = () => { toggleNotifPanel(); };

  const closeBtn = document.getElementById('np-close-btn');
  if (closeBtn) closeBtn.onclick = () => { toggleNotifPanel(); };

  const markAll = document.getElementById('np-mark-all');
  if (markAll) {
    markAll.onclick = () => {
      npStore.markAllAsRead();
      renderNpList(activeTab);
      syncBadges();
      if (window.Alpine && Alpine.store('toast')) {
        Alpine.store('toast').show('Tum bildirimler okundu', 'success', 2500);
      }
    };
  }

  syncBadges();
  renderNpList(activeTab);
}

// ── Toggle ──────────────────────────

export function toggleNotifPanel(): void {
  const p = document.getElementById('np-panel');
  const b = document.getElementById('np-backdrop');
  if (!p || !b) return;

  const isOpen = p.classList.toggle('open');
  b.classList.toggle('open', isOpen);
}
