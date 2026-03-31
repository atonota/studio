/**
 * logo-animation.ts
 * Responsibility: GSAP-powered AtonotA logo animation — SVG path-based
 * lettering with color sweep cycle and border draw animation.
 * GSAP is loaded via CDN; we declare its shape on window.
 */

/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */

declare const gsap: {
  to: (target: unknown, vars: Record<string, unknown>) => unknown;
  set: (target: unknown, vars: Record<string, unknown>) => unknown;
  fromTo: (target: unknown, from: Record<string, unknown>, to: Record<string, unknown>) => unknown;
};

// ── Constants ──────────────────────────

const LETTER_PATHS =
  'M 20.3 62.1 L 44.73 62.1 L 50.4 76.5 L 67.2 76.5 L 34 0 L 33.2 0 L 0 76.5 L 14.3 76.5 Z M 32.85 31.96 L 39.92 49.9 L 25.38 49.9 Z M 342.3 62.1 L 366.73 62.1 L 372.4 76.5 L 389.2 76.5 L 356 0 L 355.2 0 L 322 76.5 L 336.3 76.5 Z M 354.85 31.96 L 361.92 49.9 L 347.38 49.9 Z M 79.7 32.6 L 79.7 13.6 L 93.7 13.6 L 93.7 32.6 L 104.3 32.6 L 104.3 43.5 L 93.7 43.5 L 93.7 76.5 L 79.7 76.5 L 79.7 43.5 L 72.9 43.5 L 72.9 32.6 Z M 292.7 32.6 L 292.7 13.6 L 306.7 13.6 L 306.7 32.6 L 317.3 32.6 L 317.3 43.5 L 306.7 43.5 L 306.7 76.5 L 292.7 76.5 L 292.7 43.5 L 285.9 43.5 L 285.9 32.6 Z M 111.6 54.1 Q 111.6 47.4 114.75 42.1 Q 117.9 36.8 123.6 33.75 Q 129.3 30.7 136.7 30.7 Q 144.2 30.7 149.7 33.75 Q 155.2 36.8 158.15 42.1 Q 161.1 47.4 161.1 54.1 Q 161.1 60.8 158.15 66.15 Q 155.2 71.5 149.7 74.6 Q 144.2 77.7 136.5 77.7 Q 129.3 77.7 123.65 74.9 Q 118 72.1 114.8 66.8 Q 111.6 61.5 111.6 54.1 Z M 125.7 54.2 Q 125.7 50.7 127.1 48 Q 128.5 45.3 130.9 43.7 Q 133.3 42.1 136.3 42.1 Q 139.6 42.1 142 43.7 Q 144.4 45.3 145.7 48 Q 147 50.7 147 54.2 Q 147 57.6 145.7 60.35 Q 144.4 63.1 142 64.7 Q 139.6 66.3 136.3 66.3 Q 133.3 66.3 130.9 64.7 Q 128.5 63.1 127.1 60.35 Q 125.7 57.6 125.7 54.2 Z M 172.1 32.8 L 184.8 32.8 L 185.9 40.6 L 185.7 39.9 Q 188 35.8 192.2 33.25 Q 196.4 30.7 202.5 30.7 Q 208.7 30.7 212.85 34.35 Q 217 38 217.1 43.8 L 217.1 76.5 L 203.1 76.5 L 203.1 49 Q 203 46.1 201.55 44.35 Q 200.1 42.6 196.7 42.6 Q 193.5 42.6 191.1 44.7 Q 188.7 46.8 187.4 50.4 Q 186.1 54 186.1 58.7 L 186.1 76.5 L 172.1 76.5 Z M 228.1 54.1 Q 228.1 47.4 231.25 42.1 Q 234.4 36.8 240.1 33.75 Q 245.8 30.7 253.2 30.7 Q 260.7 30.7 266.2 33.75 Q 271.7 36.8 274.65 42.1 Q 277.6 47.4 277.6 54.1 Q 277.6 60.8 274.65 66.15 Q 271.7 71.5 266.2 74.6 Q 260.7 77.7 253 77.7 Q 245.8 77.7 240.15 74.9 Q 234.5 72.1 231.3 66.8 Q 228.1 61.5 228.1 54.1 Z M 242.2 54.2 Q 242.2 50.7 243.6 48 Q 245 45.3 247.4 43.7 Q 249.8 42.1 252.8 42.1 Q 256.1 42.1 258.5 43.7 Q 260.9 45.3 262.2 48 Q 263.5 50.7 263.5 54.2 Q 263.5 57.6 262.2 60.35 Q 260.9 63.1 258.5 64.7 Q 256.1 66.3 252.8 66.3 Q 249.8 66.3 247.4 64.7 Q 245 63.1 243.6 60.35 Q 242.2 57.6 242.2 54.2 Z';

const P = 12;
const LW = 389.2;
const LH = 77.701;
const W = LW + P * 2;
const H = LH + P * 2;
const NS = 'http://www.w3.org/2000/svg';

// ── SVG element helper ──────────────────────────

function svgEl(tag: string, attrs: Record<string, string>): SVGElement {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  return e;
}

// ── Public ──────────────────────────

export function initLogoAnimation(): void {
  if (typeof gsap === 'undefined') return;
  const logoContainer = document.querySelector('.tb-logo');
  if (!logoContainer) return;

  const y1 = P;
  const y2 = P + LH;
  const mx = W / 2;
  const s = 0.6;
  const isDark = document.documentElement.classList.contains('dark');

  const DC: readonly string[] = isDark
    ? ['#C94B1A', '#00FFFF', '#FFF030', '#FF00FF', '#E02020', '#00BB00', '#1040FF', '#9500FF']
    : ['#C94B1A', '#00CCCC', '#D4C000', '#CC00CC', '#CC1010', '#009900', '#0033CC', '#8800EE'];
  const UC = isDark ? '#ffffff' : '#000000';

  // Remove old SVG
  const oldSvg = logoContainer.querySelector('svg');
  if (oldSvg) oldSvg.remove();

  const svg = svgEl('svg', {
    viewBox: `0 0 ${W} ${H}`,
    xmlns: NS,
    overflow: 'visible',
    style: 'height:44px;width:auto',
  });

  // Clip paths
  const defs = svgEl('defs', {});
  const rt = svgEl('rect', { id: 'logo-rt', x: '0', y: '0', width: String(W), height: String(y1) });
  const rb = svgEl('rect', { id: 'logo-rb', x: '0', y: String(y1), width: String(W), height: String(H - y1) });
  const clipTop = svgEl('clipPath', { id: 'logo-ct' });
  clipTop.appendChild(rt);
  const clipBot = svgEl('clipPath', { id: 'logo-cb' });
  clipBot.appendChild(rb);
  defs.appendChild(clipTop);
  defs.appendChild(clipBot);
  svg.appendChild(defs);

  const sw = '0.25mm';

  // Top group (colored)
  const ga = svgEl('g', {
    id: 'logo-ga', 'clip-path': 'url(#logo-ct)', 'stroke-linecap': 'round',
    'fill-rule': 'evenodd', stroke: '#C94B1A', 'stroke-width': sw, fill: 'none',
    transform: `translate(${P},${P})`,
  });
  ga.appendChild(svgEl('path', { 'vector-effect': 'non-scaling-stroke', d: LETTER_PATHS }));

  // Bottom group (base color)
  const gb = svgEl('g', {
    id: 'logo-gb', 'clip-path': 'url(#logo-cb)', 'stroke-linecap': 'round',
    'fill-rule': 'evenodd', stroke: UC, 'stroke-width': sw, fill: 'none',
    transform: `translate(${P},${P})`,
  });
  gb.appendChild(svgEl('path', { 'vector-effect': 'non-scaling-stroke', d: LETTER_PATHS }));

  // Sweep line
  const sl = svgEl('line', {
    id: 'logo-sl', x1: '0', x2: String(W), y1: String(y1), y2: String(y1),
    stroke: '#C94B1A', 'stroke-width': '1.5',
  });

  // Border paths
  const ol = svgEl('path', {
    id: 'logo-ol',
    d: `M${mx},${s} L${s},${s} L${s},${H - s} L${mx},${H - s}`,
    fill: 'none', stroke: '#C94B1A', 'stroke-width': '1.2',
    'stroke-linejoin': 'miter', 'stroke-linecap': 'square',
  });
  const orr = svgEl('path', {
    id: 'logo-or',
    d: `M${mx},${s} L${W - s},${s} L${W - s},${H - s} L${mx},${H - s}`,
    fill: 'none', stroke: '#C94B1A', 'stroke-width': '1.2',
    'stroke-linejoin': 'miter', 'stroke-linecap': 'square',
  });

  svg.appendChild(ga);
  svg.appendChild(gb);
  svg.appendChild(sl);
  svg.appendChild(ol);
  svg.appendChild(orr);
  logoContainer.appendChild(svg);

  // Border draw animation
  const lL = (ol as SVGPathElement).getTotalLength();
  gsap.set([ol, orr], { strokeDasharray: lL, strokeDashoffset: lL });
  gsap.to([ol, orr], {
    strokeDashoffset: 0, duration: 6, repeat: -1, yoyo: true, ease: 'power1.inOut',
  });

  // Color sweep cycle
  const st = { y: y1 };
  let ci = 0;

  function upd(): void {
    const cy = Math.max(y1, Math.min(y2, st.y));
    rt.setAttribute('height', String(cy));
    rb.setAttribute('y', String(cy));
    rb.setAttribute('height', String(H - cy));
    sl.setAttribute('y1', String(cy));
    sl.setAttribute('y2', String(cy));
  }

  function sweepDown(): void {
    const c = DC[ci % DC.length] ?? '#C94B1A';
    ga.setAttribute('stroke', c);
    sl.setAttribute('stroke', c);
    ol.setAttribute('stroke', c);
    orr.setAttribute('stroke', c);
    gsap.to(st, { y: y2, duration: 5, ease: 'power1.inOut', onUpdate: upd, onComplete: sweepUp });
  }

  function sweepUp(): void {
    ci++;
    gb.setAttribute('stroke', UC);
    sl.setAttribute('stroke', UC);
    gsap.to(st, { y: y1, duration: 5, ease: 'power1.inOut', onUpdate: upd, onComplete: sweepDown });
  }

  sweepDown();
}

/**
 * Load GSAP from CDN if not already loaded, then run initLogoAnimation.
 */
export function loadAndInitLogo(): void {
  if (!document.querySelector('script[src*="gsap"]')) {
    const gsapScript = document.createElement('script');
    gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
    gsapScript.onload = () => initLogoAnimation();
    document.head.appendChild(gsapScript);
    return;
  }
  initLogoAnimation();
}
