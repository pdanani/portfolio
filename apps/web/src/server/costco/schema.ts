import {
  boolean,
  index,
  integer,
  pgTable,
  real,
  serial,
  text,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

/**
 * Warehouse Watch schema, ported from the standalone SQLite app to Postgres
 * (Neon). Same tables/columns; timestamps stay ISO-8601 text to keep the
 * ported query layer identical.
 */

export const warehouses = pgTable(
  'ww_warehouses',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    address: text('address'),
    postalCode: text('postal_code'),
    latitude: real('latitude'),
    longitude: real('longitude'),
    costcoWarehouseNumber: text('costco_warehouse_number'),
    tracked: boolean('tracked').notNull().default(false),
    createdAt: text('created_at').notNull(),
  },
  (t) => [uniqueIndex('ww_warehouses_number_idx').on(t.costcoWarehouseNumber)],
)

export const items = pgTable(
  'ww_items',
  {
    id: serial('id').primaryKey(),
    costcoItemNumber: text('costco_item_number'),
    costcoChildId: text('costco_child_id'),
    name: text('name').notNull(),
    brand: text('brand'),
    imageUrl: text('image_url'),
    category: text('category'),
    size: text('size'),
    model: text('model'),
    inWarehouse: boolean('in_warehouse').notNull().default(false),
    uri: text('uri'),
    priceCents: integer('price_cents'),
    onlinePriceCents: integer('online_price_cents'),
    discountCents: integer('discount_cents').notNull().default(0),
    onlineAvailability: text('online_availability').notNull().default('unknown'),
    dealShortText: text('deal_short_text'),
    dealLongText: text('deal_long_text'),
    dealEndsAt: text('deal_ends_at'),
    firstSeenAt: text('first_seen_at').notNull(),
    lastPricedAt: text('last_priced_at'),
    createdAt: text('created_at').notNull(),
  },
  (t) => [
    uniqueIndex('ww_items_number_idx').on(t.costcoItemNumber),
    index('ww_items_name_idx').on(t.name),
    index('ww_items_category_idx').on(t.category),
    index('ww_items_discount_idx').on(t.discountCents),
  ],
)

export const warehouseItems = pgTable(
  'ww_warehouse_items',
  {
    id: serial('id').primaryKey(),
    warehouseId: integer('warehouse_id')
      .notNull()
      .references(() => warehouses.id),
    itemId: integer('item_id')
      .notNull()
      .references(() => items.id),
    availability: text('availability').notNull().default('unknown'),
    checkedAt: text('checked_at'),
  },
  (t) => [
    uniqueIndex('ww_warehouse_items_pair_idx').on(t.warehouseId, t.itemId),
    index('ww_warehouse_items_item_idx').on(t.itemId),
  ],
)

export const priceSnapshots = pgTable(
  'ww_price_snapshots',
  {
    id: serial('id').primaryKey(),
    warehouseId: integer('warehouse_id').references(() => warehouses.id),
    itemId: integer('item_id')
      .notNull()
      .references(() => items.id),
    priceCents: integer('price_cents'),
    availability: text('availability').notNull().default('unknown'),
    source: text('source').notNull().default('costco'),
    capturedAt: text('captured_at').notNull(),
  },
  (t) => [index('ww_price_snapshots_item_idx').on(t.itemId, t.capturedAt)],
)

export const watches = pgTable(
  'ww_watches',
  {
    id: serial('id').primaryKey(),
    itemId: integer('item_id')
      .notNull()
      .references(() => items.id),
    scope: text('scope').notNull(), // 'online' | 'warehouses'
    wasInStock: boolean('was_in_stock').notNull().default(false),
    detail: text('detail'),
    createdAt: text('created_at').notNull(),
    lastCheckedAt: text('last_checked_at'),
    lastNotifiedAt: text('last_notified_at'),
  },
  (t) => [uniqueIndex('ww_watches_item_scope_idx').on(t.itemId, t.scope)],
)
