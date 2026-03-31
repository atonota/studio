/**
 * Turkce binlik ayirici ile sayi formatla
 * @pure — yan etki yok
 */
export function fmtNum(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * TRY para birimi formatla
 * @pure — yan etki yok
 */
export function fmtTRY(n: number): string {
  return '₺' + fmtNum(n);
}
