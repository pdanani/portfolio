import type {
  CatalogStats,
  CrossWarehouseHit,
  InventoryResponse,
  InventoryRow,
  InventorySort,
  Watch,
  WatchScope,
  WarehouseInfo,
  WarehouseSearchResult,
} from '#/server/costco/types'

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: init?.body ? { 'content-type': 'application/json', ...init?.headers } : init?.headers,
  })
  if (!res.ok) {
    let message = res.statusText
    try {
      const body = (await res.json()) as { error?: string }
      if (body.error) message = body.error
    } catch {
      /* non-JSON body */
    }
    throw new ApiError(res.status, message)
  }
  return res.json() as Promise<T>
}

export interface InventoryParams {
  warehouse?: number | 'all'
  q?: string
  category?: string
  sort?: InventorySort
  dealsOnly?: boolean
  page?: number
  pageSize?: number
}

export const costcoApi = {
  me: () => request<{ ok: true }>('/api/costco/auth'),
  login: (password: string) =>
    request<{ ok: true }>('/api/costco/auth', { method: 'POST', body: JSON.stringify({ password }) }),
  logout: () => request<{ ok: true }>('/api/costco/auth', { method: 'DELETE' }),

  inventory: (params: InventoryParams) => {
    const p = new URLSearchParams()
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '' && v !== false) p.set(k, String(v))
    }
    return request<InventoryResponse>(`/api/costco/inventory?${p}`)
  },

  lookup: (query: string) =>
    request<{ itemId: number; name: string }>('/api/costco/lookup', {
      method: 'POST',
      body: JSON.stringify({ query }),
    }),
  getItem: (id: number) => request<{ row: InventoryRow }>(`/api/costco/items/${id}`),
  priceItem: (id: number, force = false) =>
    request<{ row: InventoryRow }>(`/api/costco/items/${id}`, {
      method: 'POST',
      body: JSON.stringify({ action: 'price', force }),
    }),
  checkStock: (id: number) =>
    request<{ hits: Array<CrossWarehouseHit>; status: 'checked' | 'not_sold' | 'no_warehouses' }>(
      `/api/costco/items/${id}`,
      { method: 'POST', body: JSON.stringify({ action: 'stock' }) },
    ),
  scanRegion: (id: number, region = 'northeast') =>
    request<{ region: string; scanned: number; inStockCount: number; hits: Array<CrossWarehouseHit> }>(
      `/api/costco/items/${id}`,
      { method: 'POST', body: JSON.stringify({ action: 'scan', region }) },
    ),

  warehouses: () => request<{ warehouses: Array<WarehouseInfo> }>('/api/costco/warehouses'),
  searchWarehouses: (zip: string) =>
    request<{ results: Array<WarehouseSearchResult> }>(`/api/costco/warehouses?zip=${zip}`),
  trackWarehouse: (w: Pick<WarehouseSearchResult, 'name' | 'address' | 'postalCode' | 'warehouseNumber'>) =>
    request<{ id: number }>('/api/costco/warehouses', { method: 'POST', body: JSON.stringify(w) }),
  untrackWarehouse: (id: number) =>
    request<{ ok: true }>(`/api/costco/warehouses?id=${id}`, { method: 'DELETE' }),

  watches: () => request<{ watches: Array<Watch>; alertsConfigured: boolean }>('/api/costco/watches'),
  addWatch: (itemId: number, scope: WatchScope) =>
    request<{ id: number }>('/api/costco/watches', {
      method: 'POST',
      body: JSON.stringify({ itemId, scope }),
    }),
  removeWatch: (id: number) => request<{ ok: true }>(`/api/costco/watches?id=${id}`, { method: 'DELETE' }),
  testAlert: () =>
    request<{ ok: true }>('/api/costco/watches', { method: 'POST', body: JSON.stringify({ test: true }) }),

  catalogStats: () => request<CatalogStats>('/api/costco/catalog'),
  seedCatalog: () =>
    request<{ itemCount: number }>('/api/costco/catalog', {
      method: 'POST',
      body: JSON.stringify({ action: 'seed' }),
    }),
  dealScan: (limit?: number) =>
    request<{ priced: number; deals: number }>('/api/costco/catalog', {
      method: 'POST',
      body: JSON.stringify({ action: 'deal-scan', limit }),
    }),
}

export function centsToDollars(cents: number | null | undefined): string {
  if (cents == null) return '—'
  return `$${(cents / 100).toFixed(2)}`
}

export type { InventoryRow, InventorySort, Watch, WatchScope, WarehouseInfo, WarehouseSearchResult }
