/**
 * @module core/http/mock-provider
 * Wraps window.MOCK generators in DataProvider interface.
 * Synthesizes cursor pagination from in-memory arrays.
 * Active until FastAPI backend is connected.
 */

import type { DataProvider } from './client';
import type { PaginatedResponse, RequestConfig, PaginationConfig } from './types';

interface MockGenerators {
  keywords?: { generate: (seed: string, count?: number) => unknown[] };
  backlinks?: { generate: (count?: number) => unknown[] };
  audit?: { generate: (count?: number) => unknown[] };
  traffic?: { generate: (days?: number) => unknown[] };
  competitors?: { generate: (count?: number) => unknown[] };
}

/** Encode offset as base64 cursor (matches FastAPI cursor pattern). */
function encodeCursor(offset: number): string {
  return btoa(JSON.stringify({ o: offset }));
}

/** Decode cursor back to offset. */
function decodeCursor(cursor: string): number {
  try {
    const data = JSON.parse(atob(cursor)) as { o?: number };
    return data.o ?? 0;
  } catch {
    return 0;
  }
}

/** Get mock generators from window.MOCK (loaded by mock-data.js). */
function getMock(): MockGenerators {
  return (window as unknown as { MOCK?: MockGenerators }).MOCK ?? {};
}

/**
 * Route resource name to MOCK generator.
 * @param resource - API resource name (e.g., 'keywords', 'backlinks')
 * @param params - Optional query params (e.g., seed, count)
 */
function generateData(resource: string, params?: Record<string, string | number | boolean>): unknown[] {
  const mock = getMock();
  const seed = String(params?.['seed'] ?? 'seo');
  const count = Number(params?.['count'] ?? 100);

  switch (resource) {
    case 'keywords':
      return mock.keywords?.generate(seed, count) ?? [];
    case 'backlinks':
      return mock.backlinks?.generate(count) ?? [];
    case 'audit':
    case 'audit-issues':
      return mock.audit?.generate(count) ?? [];
    case 'traffic':
      return mock.traffic?.generate(count) ?? [];
    case 'competitors':
      return mock.competitors?.generate(count) ?? [];
    default:
      console.warn(`MockProvider: unknown resource "${resource}"`);
      return [];
  }
}

/** Paginate an array with cursor-based pagination. */
function paginateArray<T>(data: T[], cursor?: string, limit: number = 20): PaginatedResponse<T> {
  const offset = cursor ? decodeCursor(cursor) : 0;
  const items = data.slice(offset, offset + limit) as T[];
  const nextOffset = offset + limit;
  const hasMore = nextOffset < data.length;

  return {
    items,
    cursor: {
      next_cursor: hasMore ? encodeCursor(nextOffset) : null,
      has_more: hasMore,
    },
  };
}

/** Create a MockProvider that wraps window.MOCK in the DataProvider interface. */
export function createMockProvider(): DataProvider {
  return {
    async get<T>(resource: string, id?: string, config?: RequestConfig): Promise<T> {
      const data = generateData(resource, config?.params);
      if (id) {
        const item = data.find((d) => {
          const rec = d as Record<string, unknown>;
          return rec['id'] === id || rec['uid'] === id || String(rec['id']) === id;
        });
        if (!item) {
          throw { status: 404, detail: 'NOT_FOUND', isRetryable: false };
        }
        return item as T;
      }
      return data[0] as T;
    },

    async list<T>(resource: string, config?: RequestConfig & PaginationConfig): Promise<PaginatedResponse<T>> {
      const data = generateData(resource, config?.params);
      return paginateArray<T>(data as T[], config?.cursor, config?.limit ?? 20);
    },

    async post<T>(_resource: string, body: unknown): Promise<T> {
      // Mock: return the body as-is with a generated uid
      return { uid: crypto.randomUUID(), ...body as Record<string, unknown> } as T;
    },

    async patch<T>(_resource: string, _id: string, body: unknown): Promise<T> {
      return { ...body as Record<string, unknown> } as T;
    },

    async remove(): Promise<void> {
      // Mock: no-op
    },
  };
}
