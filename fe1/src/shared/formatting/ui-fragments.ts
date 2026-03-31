/**
 * Stat card HTML fragment olustur
 * @pure — yan etki yok, HTML string dondurur
 */
export function statCard(
  label: string,
  value: string,
  change: string,
  color: string,
  delay?: number
): string {
  const cls = delay ? ` fade-in-d${delay}` : '';
  const changeColor =
    change.startsWith('+') || change.startsWith('↑') ? 'stat-change--up' :
    change.startsWith('-') || change.startsWith('↓') ? 'stat-change--down' : 'stat-change--flat';
  return `<div class="stat-card stat-card--${color}${cls}"><div class="stat-label">${label}</div><div class="stat-value">${value}</div><div class="stat-change ${changeColor}">${change}</div></div>`;
}

/**
 * Badge HTML fragment olustur
 * @pure
 */
export function badge(text: string, color: string): string {
  return `<span class="badge badge--${color}">${text}</span>`;
}

/**
 * Icon circle HTML fragment olustur
 * @pure
 */
export function iconCircle(icon: string, color: string): string {
  return `<div class="icon-circle icon-circle--${color}"><i class="ph ${icon}"></i></div>`;
}
