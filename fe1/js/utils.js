/* ═══════════════════════════════════════════
   atonota Studio — Utility Functions
═══════════════════════════════════════════ */

/* Format number with Turkish thousands separator */
function fmtNum(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/* Format currency TRY */
function fmtTRY(n) {
  return '₺' + fmtNum(n);
}

/* Relative time */
function timeAgo(minutes) {
  if (minutes < 60) return minutes + ' dk once';
  if (minutes < 1440) return Math.floor(minutes / 60) + ' saat once';
  return Math.floor(minutes / 1440) + ' gun once';
}

/* Create stat card HTML */
function statCard(label, value, change, color, delay) {
  const cls = delay ? ` fade-in-d${delay}` : '';
  const changeColor = change.startsWith('+') || change.startsWith('↑') ? 'stat-change--up' :
                      change.startsWith('-') || change.startsWith('↓') ? 'stat-change--down' : 'stat-change--flat';
  return `<div class="stat-card stat-card--${color}${cls}"><div class="stat-label">${label}</div><div class="stat-value">${value}</div><div class="stat-change ${changeColor}">${change}</div></div>`;
}

/* Create badge HTML */
function badge(text, color) {
  return `<span class="badge badge--${color}">${text}</span>`;
}

/* Create icon circle HTML */
function iconCircle(icon, color) {
  return `<div class="icon-circle icon-circle--${color}"><i class="ph ${icon}"></i></div>`;
}
