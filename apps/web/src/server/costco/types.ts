/** Shared Warehouse Watch types (plain TS — no runtime dep). */

export type Availability = 'in_stock' | 'low_stock' | 'out_of_stock' | 'unknown'

export interface Deal {
  shortText: string | null
  longText: string | null
  discountCents: number
  endsAt: string | null
}

export interface WarehouseAvailability {
  warehouseId: number
  warehouseName: string
  availability: Availability
  checkedAt: string | null
}

export interface InventoryRow {
  itemId: number
  name: string
  brand: string | null
  imageUrl: string | null
  category: string | null
  size: string | null
  model: string | null
  costcoItemNumber: string | null
  costcoChildId: string | null
  priceCents: number | null
  onlinePriceCents: number | null
  discountCents: number
  onlineAvailability: Availability
  deal: Deal | null
  warehouseAvailability: Array<WarehouseAvailability>
}

export type InventorySort =
  | 'name'
  | 'price_asc'
  | 'price_desc'
  | 'newest'
  | 'biggest_savings'

export interface InventoryResponse {
  rows: Array<InventoryRow>
  total: number
  page: number
  pageSize: number
  categories: Array<string>
}

export interface WarehouseInfo {
  id: number
  name: string
  address: string | null
  postalCode: string | null
  costcoWarehouseNumber: string | null
  tracked: boolean
  itemCount: number
}

export interface WarehouseSearchResult {
  name: string
  address: string | null
  postalCode: string | null
  warehouseNumber: string
  alreadyTrackedWarehouseId: number | null
}

export interface CrossWarehouseHit {
  warehouseName: string
  address: string | null
  stockStatus: string
}

export type WatchScope = 'online' | 'warehouses'

export interface Watch {
  id: number
  itemId: number
  itemName: string
  imageUrl: string | null
  costcoItemNumber: string | null
  scope: WatchScope
  inStock: boolean
  detail: string | null
  createdAt: string
  lastCheckedAt: string | null
  lastNotifiedAt: string | null
}

export interface CatalogStats {
  itemCount: number
  pricedCount: number
  dealCount: number
}
