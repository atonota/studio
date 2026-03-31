import { describe, it, expect } from 'vitest';
import { fmtNum, fmtTRY } from '../../../shared/formatting/number-format';

describe('fmtNum', () => {
  it('formats zero', () => {
    expect(fmtNum(0)).toBe('0');
  });

  it('no separator below 1000', () => {
    expect(fmtNum(999)).toBe('999');
  });

  it('adds dot separator at 1000', () => {
    expect(fmtNum(1000)).toBe('1.000');
  });

  it('handles large numbers', () => {
    expect(fmtNum(1234567)).toBe('1.234.567');
  });

  it('handles millions', () => {
    expect(fmtNum(10000000)).toBe('10.000.000');
  });
});

describe('fmtTRY', () => {
  it('adds lira symbol', () => {
    expect(fmtTRY(0)).toBe('₺0');
  });

  it('formats with separator', () => {
    expect(fmtTRY(1500)).toBe('₺1.500');
  });

  it('handles large amounts', () => {
    expect(fmtTRY(250000)).toBe('₺250.000');
  });
});
