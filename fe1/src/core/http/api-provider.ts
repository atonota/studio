/**
 * @module core/http/api-provider
 * Real fetch()-based DataProvider for FastAPI backend.
 * Handles JWT auth, cursor pagination, AbortController, 429 retry.
 * Not active until backend is connected — mode: 'api' in createDataProvider.
 */

import type { DataProvider } from './client';
import type {
  PaginatedResponse, RequestConfig, PaginationConfig,
  TokenProvider, HttpError,
} from './types';

const MAX_RETRIES = 3;
const RETRY_BASE_MS = 1000;

/** Build URL with query params. */
function buildUrl(base: string, resource: string, id?: string, params?: Record<string, string | number | boolean>): string {
  let url = `${base}/${resource}`;
  if (id) url += `/${id}`;
  if (params) {
    const qs = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&');
    if (qs) url += `?${qs}`;
  }
  return url;
}

/** Create an HttpError from a failed response. */
async function toHttpError(res: Response): Promise<HttpError> {
  let detail = `HTTP ${res.status}`;
  try {
    const body = await res.json() as { detail?: string };
    if (body.detail) detail = body.detail;
  } catch { /* no json body */ }
  return {
    status: res.status,
    detail,
    isRetryable: res.status === 429 || res.status >= 500,
  };
}

/** Sleep utility for retry backoff. */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Fetch with retry for 429 and 5xx. */
async function fetchWithRetry(
  url: string,
  init: RequestInit,
  retries: number = MAX_RETRIES,
): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url, init);

    if (res.ok || (!res.ok && res.status !== 429 && res.status < 500)) {
      return res;
    }

    // Retryable: 429 or 5xx
    if (attempt < retries) {
      const retryAfter = res.headers.get('Retry-After');
      const waitMs = retryAfter
        ? parseInt(retryAfter, 10) * 1000
        : RETRY_BASE_MS * Math.pow(2, attempt);
      await sleep(waitMs);
    }
  }
  // Final attempt failed — return last response
  return fetch(url, init);
}

/** Create an ApiProvider that calls the real FastAPI backend. */
export function createApiProvider(baseUrl: string, tokenProvider: TokenProvider): DataProvider {
  function buildHeaders(config?: RequestConfig): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...config?.headers,
    };
    const token = tokenProvider();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (config?.tenantId) headers['X-Tenant-ID'] = config.tenantId;
    return headers;
  }

  async function request<T>(method: string, url: string, config?: RequestConfig, body?: unknown): Promise<T> {
    const controller = new AbortController();
    const signal = config?.signal
      ? combineSignals(config.signal, controller.signal)
      : controller.signal;

    const init: RequestInit = {
      method,
      headers: buildHeaders(config),
      signal,
    };
    if (body !== undefined) {
      init.body = JSON.stringify(body);
    }

    const res = await fetchWithRetry(url, init);

    if (!res.ok) {
      const err = await toHttpError(res);
      // Emit auth expired event for 401
      if (res.status === 401) {
        window.dispatchEvent(new CustomEvent('auth:expired'));
      }
      throw err;
    }

    // 204 No Content (DELETE)
    if (res.status === 204) return undefined as T;

    return res.json() as Promise<T>;
  }

  return {
    async get<T>(resource: string, id?: string, config?: RequestConfig): Promise<T> {
      const url = buildUrl(baseUrl, resource, id, config?.params);
      return request<T>('GET', url, config);
    },

    async list<T>(resource: string, config?: RequestConfig & PaginationConfig): Promise<PaginatedResponse<T>> {
      const params: Record<string, string | number | boolean> = { ...config?.params };
      if (config?.cursor) params['cursor'] = config.cursor;
      if (config?.limit) params['limit'] = config.limit;
      const url = buildUrl(baseUrl, resource, undefined, params);
      return request<PaginatedResponse<T>>('GET', url, config);
    },

    async post<T>(resource: string, body: unknown, config?: RequestConfig): Promise<T> {
      const url = buildUrl(baseUrl, resource, undefined, config?.params);
      return request<T>('POST', url, config, body);
    },

    async patch<T>(resource: string, id: string, body: unknown, config?: RequestConfig): Promise<T> {
      const url = buildUrl(baseUrl, resource, id, config?.params);
      return request<T>('PATCH', url, config, body);
    },

    async remove(resource: string, id: string, config?: RequestConfig): Promise<void> {
      const url = buildUrl(baseUrl, resource, id, config?.params);
      await request<void>('DELETE', url, config);
    },
  };
}

/** Combine two AbortSignals — abort when either fires. */
function combineSignals(a: AbortSignal, b: AbortSignal): AbortSignal {
  const controller = new AbortController();
  const onAbort = (): void => controller.abort();
  a.addEventListener('abort', onAbort, { once: true });
  b.addEventListener('abort', onAbort, { once: true });
  return controller.signal;
}
