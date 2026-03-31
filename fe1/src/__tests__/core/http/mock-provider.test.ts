import { describe, it, expect, beforeEach } from 'vitest';
import { createMockProvider } from '../../../core/http/mock-provider';
import type { DataProvider } from '../../../core/http/client';

// Mock window.MOCK for testing
const MOCK_KEYWORDS = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  keyword: `keyword-${i + 1}`,
  volume: Math.floor(Math.random() * 10000),
  position: i + 1,
}));

beforeEach(() => {
  (window as unknown as Record<string, unknown>).MOCK = {
    keywords: {
      generate: (_seed: string, count: number = 50) =>
        MOCK_KEYWORDS.slice(0, count),
    },
    backlinks: {
      generate: (count: number = 20) =>
        Array.from({ length: count }, (_, i) => ({ id: i, domain: `site-${i}.com` })),
    },
  };
});

describe('MockProvider', () => {
  let provider: DataProvider;

  beforeEach(() => {
    provider = createMockProvider();
  });

  describe('list()', () => {
    it('returns PaginatedResponse envelope', async () => {
      const res = await provider.list('keywords', { limit: 10 });
      expect(res).toHaveProperty('items');
      expect(res).toHaveProperty('cursor');
      expect(res.cursor).toHaveProperty('next_cursor');
      expect(res.cursor).toHaveProperty('has_more');
    });

    it('respects limit', async () => {
      const res = await provider.list('keywords', { limit: 5 });
      expect(res.items).toHaveLength(5);
      expect(res.cursor.has_more).toBe(true);
    });

    it('paginates with cursor', async () => {
      const page1 = await provider.list('keywords', { limit: 10 });
      expect(page1.items).toHaveLength(10);
      expect(page1.cursor.next_cursor).not.toBeNull();

      const page2 = await provider.list('keywords', {
        limit: 10,
        cursor: page1.cursor.next_cursor!,
      });
      expect(page2.items).toHaveLength(10);

      // Items should be different
      const ids1 = page1.items.map((i) => (i as Record<string, unknown>)['id']);
      const ids2 = page2.items.map((i) => (i as Record<string, unknown>)['id']);
      expect(ids1).not.toEqual(ids2);
    });

    it('returns has_more: false on last page', async () => {
      const res = await provider.list('keywords', { limit: 100 });
      expect(res.cursor.has_more).toBe(false);
      expect(res.cursor.next_cursor).toBeNull();
    });

    it('defaults to 20 items per page', async () => {
      const res = await provider.list('keywords');
      expect(res.items).toHaveLength(20);
    });
  });

  describe('get()', () => {
    it('returns first item when no id', async () => {
      const res = await provider.get('keywords');
      expect(res).toBeDefined();
    });

    it('finds item by id', async () => {
      const res = await provider.get<Record<string, unknown>>('keywords', '1');
      expect(res['id']).toBe(1);
    });

    it('throws 404 for missing id', async () => {
      await expect(provider.get('keywords', '99999'))
        .rejects.toMatchObject({ status: 404 });
    });
  });

  describe('unknown resource', () => {
    it('returns empty array for unknown resource', async () => {
      const res = await provider.list('unknown-resource', { limit: 10 });
      expect(res.items).toHaveLength(0);
      expect(res.cursor.has_more).toBe(false);
    });
  });
});
