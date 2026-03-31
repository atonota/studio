"use strict";
(() => {
  // src/core/http/mock-provider.ts
  function encodeCursor(offset) {
    return btoa(JSON.stringify({ o: offset }));
  }
  function decodeCursor(cursor) {
    try {
      const data = JSON.parse(atob(cursor));
      return data.o ?? 0;
    } catch {
      return 0;
    }
  }
  function getMock() {
    return window.MOCK ?? {};
  }
  function generateData(resource, params) {
    const mock = getMock();
    const seed = String(params?.["seed"] ?? "seo");
    const count = Number(params?.["count"] ?? 100);
    switch (resource) {
      case "keywords":
        return mock.keywords?.generate(seed, count) ?? [];
      case "backlinks":
        return mock.backlinks?.generate(count) ?? [];
      case "audit":
      case "audit-issues":
        return mock.audit?.generate(count) ?? [];
      case "traffic":
        return mock.traffic?.generate(count) ?? [];
      case "competitors":
        return mock.competitors?.generate(count) ?? [];
      default:
        console.warn(`MockProvider: unknown resource "${resource}"`);
        return [];
    }
  }
  function paginateArray(data, cursor, limit = 20) {
    const offset = cursor ? decodeCursor(cursor) : 0;
    const items = data.slice(offset, offset + limit);
    const nextOffset = offset + limit;
    const hasMore = nextOffset < data.length;
    return {
      items,
      cursor: {
        next_cursor: hasMore ? encodeCursor(nextOffset) : null,
        has_more: hasMore
      }
    };
  }
  function createMockProvider() {
    return {
      async get(resource, id, config) {
        const data = generateData(resource, config?.params);
        if (id) {
          const item = data.find((d) => {
            const rec = d;
            return rec["id"] === id || rec["uid"] === id || String(rec["id"]) === id;
          });
          if (!item) {
            throw { status: 404, detail: "NOT_FOUND", isRetryable: false };
          }
          return item;
        }
        return data[0];
      },
      async list(resource, config) {
        const data = generateData(resource, config?.params);
        return paginateArray(data, config?.cursor, config?.limit ?? 20);
      },
      async post(_resource, body) {
        return { uid: crypto.randomUUID(), ...body };
      },
      async patch(_resource, _id, body) {
        return { ...body };
      },
      async remove() {
      }
    };
  }

  // src/core/http/api-provider.ts
  var MAX_RETRIES = 3;
  var RETRY_BASE_MS = 1e3;
  function buildUrl(base, resource, id, params) {
    let url = `${base}/${resource}`;
    if (id) url += `/${id}`;
    if (params) {
      const qs = Object.entries(params).filter(([, v]) => v !== void 0 && v !== null && v !== "").map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join("&");
      if (qs) url += `?${qs}`;
    }
    return url;
  }
  async function toHttpError(res) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body.detail) detail = body.detail;
    } catch {
    }
    return {
      status: res.status,
      detail,
      isRetryable: res.status === 429 || res.status >= 500
    };
  }
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async function fetchWithRetry(url, init, retries = MAX_RETRIES) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      const res = await fetch(url, init);
      if (res.ok || !res.ok && res.status !== 429 && res.status < 500) {
        return res;
      }
      if (attempt < retries) {
        const retryAfter = res.headers.get("Retry-After");
        const waitMs = retryAfter ? parseInt(retryAfter, 10) * 1e3 : RETRY_BASE_MS * Math.pow(2, attempt);
        await sleep(waitMs);
      }
    }
    return fetch(url, init);
  }
  function createApiProvider(baseUrl, tokenProvider) {
    function buildHeaders(config) {
      const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...config?.headers
      };
      const token = tokenProvider();
      if (token) headers["Authorization"] = `Bearer ${token}`;
      if (config?.tenantId) headers["X-Tenant-ID"] = config.tenantId;
      return headers;
    }
    async function request(method, url, config, body) {
      const controller = new AbortController();
      const signal = config?.signal ? combineSignals(config.signal, controller.signal) : controller.signal;
      const init = {
        method,
        headers: buildHeaders(config),
        signal
      };
      if (body !== void 0) {
        init.body = JSON.stringify(body);
      }
      const res = await fetchWithRetry(url, init);
      if (!res.ok) {
        const err = await toHttpError(res);
        if (res.status === 401) {
          window.dispatchEvent(new CustomEvent("auth:expired"));
        }
        throw err;
      }
      if (res.status === 204) return void 0;
      return res.json();
    }
    return {
      async get(resource, id, config) {
        const url = buildUrl(baseUrl, resource, id, config?.params);
        return request("GET", url, config);
      },
      async list(resource, config) {
        const params = { ...config?.params };
        if (config?.cursor) params["cursor"] = config.cursor;
        if (config?.limit) params["limit"] = config.limit;
        const url = buildUrl(baseUrl, resource, void 0, params);
        return request("GET", url, config);
      },
      async post(resource, body, config) {
        const url = buildUrl(baseUrl, resource, void 0, config?.params);
        return request("POST", url, config, body);
      },
      async patch(resource, id, body, config) {
        const url = buildUrl(baseUrl, resource, id, config?.params);
        return request("PATCH", url, config, body);
      },
      async remove(resource, id, config) {
        const url = buildUrl(baseUrl, resource, id, config?.params);
        await request("DELETE", url, config);
      }
    };
  }
  function combineSignals(a, b) {
    const controller = new AbortController();
    const onAbort = () => controller.abort();
    a.addEventListener("abort", onAbort, { once: true });
    b.addEventListener("abort", onAbort, { once: true });
    return controller.signal;
  }

  // src/core/http/client.ts
  function createDataProvider(opts) {
    if (opts.mode === "api") {
      return createApiProvider(opts.baseUrl ?? "/api/v1", opts.tokenProvider ?? (() => null));
    }
    return createMockProvider();
  }
})();
