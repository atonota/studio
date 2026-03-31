/**
 * Goreceli zaman metni uret (Turkce)
 * @pure — yan etki yok
 */
export function timeAgo(minutes: number): string {
  if (minutes < 60) return minutes + ' dk once';
  if (minutes < 1440) return Math.floor(minutes / 60) + ' saat once';
  return Math.floor(minutes / 1440) + ' gun once';
}
