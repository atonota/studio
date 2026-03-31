/**
 * @module core/http/client
 * DataProvider interface + factory.
 * Abstracts data access — mock provider now, API provider when backend is ready.
 * Switch with one line: createDataProvider({ mode: 'api', baseUrl: '...' })
 */

import type {
  PaginatedResponse, RequestConfig, PaginationConfig,
  DataProviderOptions,
} from './types';
import { createMockProvider } from './mock-provider';
import { createApiProvider } from './api-provider';

/** Unified data access interface — works with both mock and real API. */
export interface DataProvider {
  /** GET single resource: /api/v1/{resource}/{id} */
  get<T>(resource: string, id?: string, config?: RequestConfig): Promise<T>;

  /** GET list with cursor pagination: /api/v1/{resource}?cursor=...&limit=... */
  list<T>(resource: string, config?: RequestConfig & PaginationConfig): Promise<PaginatedResponse<T>>;

  /** POST create: /api/v1/{resource} */
  post<T>(resource: string, body: unknown, config?: RequestConfig): Promise<T>;

  /** PATCH partial update: /api/v1/{resource}/{id} */
  patch<T>(resource: string, id: string, body: unknown, config?: RequestConfig): Promise<T>;

  /** DELETE soft delete: /api/v1/{resource}/{id} */
  remove(resource: string, id: string, config?: RequestConfig): Promise<void>;
}

/**
 * Create a DataProvider instance.
 * @param opts.mode - 'mock' uses window.MOCK generators, 'api' uses real fetch()
 * @param opts.baseUrl - API base URL (required for 'api' mode)
 * @param opts.tokenProvider - JWT token getter (for 'api' mode auth)
 */
export function createDataProvider(opts: DataProviderOptions): DataProvider {
  if (opts.mode === 'api') {
    return createApiProvider(opts.baseUrl ?? '/api/v1', opts.tokenProvider ?? (() => null));
  }
  return createMockProvider();
}

// Export types for consumer convenience
export type { PaginatedResponse, RequestConfig, PaginationConfig, HttpError } from './types';
