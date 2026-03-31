import { describe, it, expect, beforeEach } from 'vitest';
import { getString, getInt, getFloat, getBool, set, remove, getAll, setAll } from '../../core/storage';

beforeEach(() => {
  localStorage.clear();
});

describe('storage', () => {
  describe('getString', () => {
    it('returns fallback when key missing', () => {
      expect(getString('missing', 'default')).toBe('default');
    });

    it('returns stored value', () => {
      localStorage.setItem('ap_mode', 'light');
      expect(getString('mode', 'dark')).toBe('light');
    });
  });

  describe('getInt', () => {
    it('returns fallback for missing key', () => {
      expect(getInt('font_size', 15)).toBe(15);
    });

    it('parses integer correctly', () => {
      localStorage.setItem('ap_font_size', '18');
      expect(getInt('font_size', 15)).toBe(18);
    });

    it('returns fallback for NaN', () => {
      localStorage.setItem('ap_font_size', 'abc');
      expect(getInt('font_size', 15)).toBe(15);
    });
  });

  describe('getFloat', () => {
    it('parses float correctly', () => {
      localStorage.setItem('ap_line_height', '1.8');
      expect(getFloat('line_height', 1.5)).toBe(1.8);
    });

    it('returns fallback for NaN', () => {
      localStorage.setItem('ap_line_height', '');
      expect(getFloat('line_height', 1.5)).toBe(1.5);
    });
  });

  describe('getBool', () => {
    it('returns true for "true"', () => {
      localStorage.setItem('ap_compact', 'true');
      expect(getBool('compact', false)).toBe(true);
    });

    it('returns false for "false"', () => {
      localStorage.setItem('ap_compact', 'false');
      expect(getBool('compact', true)).toBe(false);
    });

    it('returns fallback when missing', () => {
      expect(getBool('compact', true)).toBe(true);
    });

    it('inverted mode: "false" returns false', () => {
      localStorage.setItem('ap_skeleton_anim', 'false');
      expect(getBool('skeleton_anim', true, { invert: true })).toBe(false);
    });

    it('inverted mode: "true" returns true', () => {
      localStorage.setItem('ap_skeleton_anim', 'true');
      expect(getBool('skeleton_anim', true, { invert: true })).toBe(true);
    });

    it('inverted mode: missing returns fallback', () => {
      expect(getBool('skeleton_anim', true, { invert: true })).toBe(true);
    });
  });

  describe('set / remove', () => {
    it('roundtrip string', () => {
      set('mode', 'dark');
      expect(getString('mode', '')).toBe('dark');
    });

    it('roundtrip number', () => {
      set('font_size', 18);
      expect(getInt('font_size', 15)).toBe(18);
    });

    it('remove clears key', () => {
      set('mode', 'dark');
      remove('mode');
      expect(getString('mode', 'light')).toBe('light');
    });
  });

  describe('getAll / setAll', () => {
    it('getAll returns only ap_ keys', () => {
      localStorage.setItem('ap_mode', 'dark');
      localStorage.setItem('ap_font_size', '15');
      localStorage.setItem('other_key', 'value');
      const all = getAll();
      expect(all).toHaveProperty('ap_mode', 'dark');
      expect(all).toHaveProperty('ap_font_size', '15');
      expect(all).not.toHaveProperty('other_key');
    });

    it('setAll writes multiple keys', () => {
      setAll({ 'ap_mode': 'light', 'ap_radius': '12' });
      expect(localStorage.getItem('ap_mode')).toBe('light');
      expect(localStorage.getItem('ap_radius')).toBe('12');
    });

    it('setAll with null removes key', () => {
      localStorage.setItem('ap_mode', 'dark');
      setAll({ 'ap_mode': null });
      expect(localStorage.getItem('ap_mode')).toBeNull();
    });

    it('setAll ignores non-ap_ keys', () => {
      setAll({ 'other_key': 'value' });
      expect(localStorage.getItem('other_key')).toBeNull();
    });
  });
});
