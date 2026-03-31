/**
 * @module core/http/types
 * API response types matching FastAPI Pydantic schemas.
 * These types define the contract between frontend and backend.
 */

/** Cursor-based paginated response — matches FastAPI list endpoints. */
export interface PaginatedResponse<T> {
  items: T[];
  cursor: {
    next_cursor: string | null;
    has_more: boolean;
  };
}

/** FastAPI error response body. */
export interface ApiErrorResponse {
  detail: string;
}

/** HTTP error with structured metadata. */
export interface HttpError {
  status: number;
  detail: string;
  isRetryable: boolean;
}

/** Per-request configuration. */
export interface RequestConfig {
  signal?: AbortSignal;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  tenantId?: string;
}

/** Pagination options for list endpoints. */
export interface PaginationConfig {
  cursor?: string;
  limit?: number;
}

/** Provides JWT token for authenticated requests. */
export type TokenProvider = () => string | null;

/** DataProvider mode. */
export type ProviderMode = 'mock' | 'api';

/** Factory options for createDataProvider. */
export interface DataProviderOptions {
  mode: ProviderMode;
  baseUrl?: string;
  tokenProvider?: TokenProvider;
}
