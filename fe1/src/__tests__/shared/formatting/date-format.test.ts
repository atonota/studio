import { describe, it, expect } from 'vitest';
import { timeAgo } from '../../../shared/formatting/date-format';

describe('timeAgo', () => {
  it('formats minutes', () => {
    expect(timeAgo(5)).toBe('5 dk once');
    expect(timeAgo(30)).toBe('30 dk once');
    expect(timeAgo(59)).toBe('59 dk once');
  });

  it('formats hours', () => {
    expect(timeAgo(60)).toBe('1 saat once');
    expect(timeAgo(120)).toBe('2 saat once');
    expect(timeAgo(1439)).toBe('23 saat once');
  });

  it('formats days', () => {
    expect(timeAgo(1440)).toBe('1 gun once');
    expect(timeAgo(2880)).toBe('2 gun once');
    expect(timeAgo(14400)).toBe('10 gun once');
  });

  it('handles zero', () => {
    expect(timeAgo(0)).toBe('0 dk once');
  });

  it('handles single minute', () => {
    expect(timeAgo(1)).toBe('1 dk once');
  });
});
