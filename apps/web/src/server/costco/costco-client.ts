import { setTimeout as sleep } from "node:timers/promises";
import type { Availability, WarehouseSearchResult } from "./types";

/**
 * Costco.com read-only client.
 *
 * All of these are the same reverse-engineered endpoints costco.com's own
 * frontend calls. They authenticate with static per-service `client-identifier`
 * headers (no membership login) and — critically — work from a plain server-side
 * fetch, no browser required. Verified 2026-08-16 via scripts/probe-costco*.ts.
 *
 * Endpoints that DO work headless:
 *   - geocodeservice.costco.com/Locations?q=ZIP           -> lat/lng for a ZIP
 *   - ecom-api …/warehouse-locator/v1/salesLocations.json -> warehouses near lat/lng
 *   - gdx-api …/product-api/v1/products/summary           -> product metadata by item#/whs#
 *
 * See docs/data-sources.md for the fields, the client-identifier values, and the
 * open question about bulk warehouse price/stock (which needs a browser session).
 */

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

// Per-service client-identifier values used by costco.com's frontend.
// If these rotate, re-run scripts/probe-costco.ts and update here.
const CLIENT_IDS = {
  warehouseLocator: "7c71124c-7bf1-44db-bc9d-498584cd66e5",
  productSummary: "b1be4e95-8696-4d93-8f50-5b5632922209",
  inventory: "481b1aec-aa3b-454b-b81b-48187e28f205",
};
const PRODUCT_CLIENT_ID = "4900eb1f-0c10-4bd9-99c3-c59e6c1ecebf";

function baseHeaders(clientId: string): Record<string, string> {
  return {
    accept: "*/*",
    "accept-language": "en-us",
    "client-identifier": clientId,
    origin: "https://www.costco.com",
    referer: "https://www.costco.com/",
    "user-agent": UA,
  };
}

export class CostcoError extends Error {}

let lastRequestAt = 0;
async function throttle(minInterval = 600) {
  const wait = lastRequestAt + minInterval - Date.now();
  if (wait > 0) await sleep(wait);
  lastRequestAt = Date.now();
}

async function getJson<T>(
  url: string,
  clientId: string,
  extra: Record<string, string> = {},
  throttled = true
): Promise<T> {
  if (throttled) await throttle();
  const res = await fetch(url, { headers: { ...baseHeaders(clientId), ...extra } });
  if (!res.ok) throw new CostcoError(`GET ${url} -> HTTP ${res.status}`);
  return (await res.json()) as T;
}

// ---------- Geocode: ZIP -> lat/lng ----------

interface GeocodeHit {
  postalCode: string;
  city: string;
  stateProvinceAbbreviation: string;
  latitude: number;
  longitude: number;
}

export async function geocodeZip(zip: string): Promise<{ lat: number; lng: number; state: string } | null> {
  const hits = await getJson<GeocodeHit[]>(
    `https://geocodeservice.costco.com/Locations?q=${encodeURIComponent(zip)}`,
    CLIENT_IDS.warehouseLocator
  ).catch(() => [] as GeocodeHit[]);
  const hit = hits[0];
  if (!hit) return null;
  return { lat: hit.latitude, lng: hit.longitude, state: hit.stateProvinceAbbreviation };
}

// ---------- Warehouse locator ----------

interface SalesLocation {
  salesLocationId: string;
  name: Array<{ value: string }>;
  distance?: number;
  subType?: { code?: string };
  address?: {
    line1?: string;
    city?: string;
    territory?: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;
  };
}

export async function warehousesNear(lat: number, lng: number, limit = 25): Promise<SalesLocation[]> {
  const data = await getJson<{ salesLocations?: SalesLocation[] }>(
    `https://ecom-api.costco.com/core/warehouse-locator/v1/salesLocations.json?latitude=${lat}&longitude=${lng}&limit=${limit}`,
    CLIENT_IDS.warehouseLocator
  );
  return (data.salesLocations ?? []).filter((l) => (l.subType?.code ?? "").toLowerCase() === "warehouse");
}

// ---------- Regions: enumerate every warehouse in a multi-state region ----------

export interface RegionWarehouse {
  warehouseNumber: string;
  name: string;
  state: string | null;
  address: string | null;
}

export const REGIONS: Record<string, { label: string; states: string[]; centers: Array<[number, number]> }> = {
  northeast: {
    label: "Northeast",
    states: ["CT", "ME", "MA", "NH", "NJ", "NY", "PA", "RI", "VT", "MD", "DE", "DC"],
    // Centers spread across the region so distance-sorted results cover it all.
    centers: [
      [40.7128, -74.006], // NYC
      [42.3601, -71.0589], // Boston
      [39.9526, -75.1652], // Philadelphia
      [40.4406, -79.9959], // Pittsburgh
      [42.6526, -73.7562], // Albany
      [43.6615, -70.2553], // Portland ME
    ],
  },
};

export async function warehousesInRegion(regionKey: string): Promise<RegionWarehouse[]> {
  const region = REGIONS[regionKey];
  if (!region) throw new CostcoError(`Unknown region ${regionKey}`);
  const states = new Set(region.states);
  const byNumber = new Map<string, RegionWarehouse>();
  for (const [lat, lng] of region.centers) {
    const locs = await warehousesNear(lat, lng, 50).catch(() => [] as SalesLocation[]);
    for (const l of locs) {
      const state = l.address?.territory ?? null;
      if (!state || !states.has(state)) continue;
      if (byNumber.has(l.salesLocationId)) continue;
      byNumber.set(l.salesLocationId, {
        warehouseNumber: l.salesLocationId,
        name: l.name[0]?.value ?? `Warehouse ${l.salesLocationId}`,
        state,
        address: [l.address?.line1, l.address?.city, l.address?.territory].filter(Boolean).join(", ") || null,
      });
    }
  }
  return [...byNumber.values()];
}

export async function searchWarehousesByZip(
  zip: string
): Promise<Omit<WarehouseSearchResult, "alreadyTrackedWarehouseId">[]> {
  const geo = await geocodeZip(zip);
  if (!geo) return [];
  const locations = await warehousesNear(geo.lat, geo.lng);
  return locations.map((l) => ({
    name: l.name[0]?.value ?? `Warehouse ${l.salesLocationId}`,
    address: [l.address?.line1, l.address?.city, l.address?.territory].filter(Boolean).join(", ") || null,
    postalCode: l.address?.postalCode ?? null,
    warehouseNumber: l.salesLocationId,
  }));
}

// ---------- Product summary (metadata; batchable) ----------

/** National pricing warehouse number — display-price-lite is keyed to this. */
export const NATIONAL_WHS = "847";

interface ProductSummary {
  id: string;
  as400DeptName?: string;
  imageName?: string;
  programTypes?: string[];
  descriptions?: Array<{
    languageKey: string;
    object: { shortDescription?: string; brand?: string; longDescription?: string };
  }>;
  childCatalogData?: Array<{ id: string }>;
}

export interface ItemMeta {
  costcoItemNumber: string;
  costcoChildId: string;
  name: string;
  brand: string | null;
  imageUrl: string | null;
  category: string | null;
  model: string | null;
}

/** Costco puts the model in the description HTML as "Model #: XYZ". */
function modelFromDescription(longDescription: string | undefined): string | null {
  if (!longDescription) return null;
  const m = longDescription.match(/Model\s*#?\s*:?\s*<\/strong>\s*([A-Za-z0-9._/-]+)/i)
    ?? longDescription.match(/Model\s*#?\s*:?\s*([A-Za-z0-9._/-]{2,})/i);
  return m?.[1]?.trim() ?? null;
}

/** Batched metadata lookup. Returns name/image/category/model + the child id used for pricing. */
export async function itemMetadata(itemNumbers: string[]): Promise<ItemMeta[]> {
  if (itemNumbers.length === 0) return [];
  const data = await getJson<{ productData?: ProductSummary[] }>(
    `https://gdx-api.costco.com/catalog/product/product-api/v1/products/summary?clientId=${PRODUCT_CLIENT_ID}&items=${itemNumbers.join(",")}&whsNumber=${NATIONAL_WHS}&locales=en-US`,
    CLIENT_IDS.productSummary,
    { "costco-env": "prd" }
  );
  return (data.productData ?? []).map((p) => {
    const desc = p.descriptions?.find((d) => d.languageKey === "en-US")?.object;
    return {
      costcoItemNumber: p.id,
      costcoChildId: p.childCatalogData?.[0]?.id ?? p.id,
      name: desc?.shortDescription ?? `Item ${p.id}`,
      brand: desc?.brand ?? null,
      imageUrl: p.imageName ?? null,
      category: p.as400DeptName ?? null,
      model: modelFromDescription(desc?.longDescription),
    } satisfies ItemMeta;
  });
}

// ---------- Online / delivery availability ----------

interface AvailabilityResponse {
  availability?: string;
  availableForSale?: boolean;
}

/** Online/delivery availability for a child id (not warehouse-shelf stock). */
export async function onlineAvailability(childId: string, zip: string, state: string, throttled = true): Promise<Availability> {
  const body = await getJson<AvailabilityResponse>(
    `https://ecom-api.costco.com/ebusiness/inventory/v1/inventorylevels/availability/v2/${childId}` +
      `?destinationState=${state}&destinationPostalCode=${zip}&destinationCountryCode=US&orderItemId=0&shippingCodes=UP2&action=EDD&quantity=1`,
    CLIENT_IDS.inventory,
    { "costco.env": "ECOM", "costco.service": "restInventory" },
    throttled
  ).catch(() => ({}) as AvailabilityResponse);
  const raw = (body.availability ?? "").toUpperCase();
  if (raw.includes("INSTOCK") || body.availableForSale) return "in_stock";
  if (raw.includes("OUT") || raw.includes("NOSTOCK") || body.availableForSale === false) return "out_of_stock";
  return "unknown";
}

// ---------- TRUE per-warehouse in-warehouse stock (no login, no browser) ----------

interface PickupResponse {
  warehouseAvailability?: {
    inWarehouse?: { availability?: string; fulfillmentCenter?: string };
  };
}

function mapStock(raw: string | undefined): Availability {
  const s = (raw ?? "").toUpperCase();
  if (s.includes("LOW")) return "low_stock";
  if (s.includes("INSTOCK") || s === "IN_STOCK") return "in_stock";
  if (s.includes("NOSTOCK") || s.includes("OUT")) return "out_of_stock";
  return "unknown";
}

export interface WarehouseStockResult {
  /** in_stock / low_stock / out_of_stock, or "unknown" when the item isn't carried there. */
  availability: Availability;
  /** true when Costco returned an inWarehouse entry (the item is sold at this warehouse). */
  carried: boolean;
}

/**
 * Real in-warehouse stock for one item (child id) at one warehouse number.
 * This is the endpoint costco.com's product page uses for "in my warehouse" —
 * a plain server-side GET, no membership, no browser, no Akamai. Returns
 * INSTOCK/LOWSTOCK/NOSTOCK per warehouse; empty object = not sold there.
 */
async function fetchWarehouseStock(childId: string, warehouseNumber: string): Promise<WarehouseStockResult> {
  const res = await fetch(
    `https://ecom-api.costco.com/ebusiness/inventory/v1/inventorylevels/availability/pickup/${childId}` +
      `?quantity=1&selectedWarehouse=${warehouseNumber}-wh&shippingCodes=UP3&action=EDD`,
    { headers: { ...baseHeaders(CLIENT_IDS.inventory), "costco.env": "ECOM", "costco.service": "restInventory" } }
  );
  if (!res.ok) return { availability: "unknown", carried: false };
  const body = (await res.json()) as PickupResponse;
  const inWh = body.warehouseAvailability?.inWarehouse;
  if (!inWh) return { availability: "unknown", carried: false };
  return { availability: mapStock(inWh.availability), carried: true };
}

export async function warehouseStock(childId: string, warehouseNumber: string): Promise<WarehouseStockResult> {
  await throttle();
  return fetchWarehouseStock(childId, warehouseNumber);
}

/** Check one item across many warehouses concurrently (for regional scans). */
export async function warehouseStockBatch(
  childId: string,
  warehouseNumbers: string[],
  concurrency = 8
): Promise<Map<string, WarehouseStockResult>> {
  const out = new Map<string, WarehouseStockResult>();
  let i = 0;
  async function worker() {
    while (i < warehouseNumbers.length) {
      const idx = i++;
      const wh = warehouseNumbers[idx]!;
      out.set(wh, await fetchWarehouseStock(childId, wh).catch(() => ({ availability: "unknown" as const, carried: false })));
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, warehouseNumbers.length) }, worker));
  return out;
}

// ---------- Item universe from the product sitemap ----------

const SITEMAP_INDEX = "https://www.costco.com/sitemap_lw_index.xml";

async function fetchText(url: string): Promise<string> {
  await throttle();
  const res = await fetch(url, {
    headers: { "user-agent": UA, accept: "application/xml,text/xml,*/*" },
  });
  if (!res.ok) throw new CostcoError(`GET ${url} -> HTTP ${res.status}`);
  return res.text();
}

function extractLocs(xml: string): string[] {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!.trim());
}

/** All child sitemap URLs that list products (…/sitemap_lw_p*…). */
export async function productSitemapUrls(): Promise<string[]> {
  const index = await fetchText(SITEMAP_INDEX);
  return extractLocs(index).filter((u) => /sitemap_lw_p/.test(u));
}

export interface SeedItem {
  costcoItemNumber: string;
  name: string;
}

/** Turn a product URL slug into a readable name (real name arrives on hydrate). */
function nameFromSlug(loc: string): string {
  const slug = loc.split("/").pop()?.split(".product.")[0] ?? "";
  const decoded = decodeURIComponent(slug).replace(/%2c/gi, ",");
  return decoded
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * The Costco item universe from the product sitemaps: item number + a
 * name derived from the URL slug. One request per sitemap file — this is the
 * whole browsable/searchable index, no per-item API calls. ~8k per file.
 */
export async function seedItems(): Promise<SeedItem[]> {
  const sitemaps = await productSitemapUrls();
  const byNumber = new Map<string, string>();
  for (const url of sitemaps) {
    const xml = await fetchText(url).catch(() => "");
    for (const loc of extractLocs(xml)) {
      const m = loc.match(/\.product\.(\d+)\.html/);
      if (m && !byNumber.has(m[1]!)) byNumber.set(m[1]!, nameFromSlug(loc));
    }
  }
  return [...byNumber].map(([costcoItemNumber, name]) => ({ costcoItemNumber, name }));
}

// ---------- Per-warehouse price + promotions (display-price-lite) ----------

const PRICE_CLIENT_ID = "6b262714-2ed4-4dcb-a39d-39a4b0357309";

export interface PriceResult {
  onlinePriceCents: number | null;
  warehousePriceCents: number | null; // deliveredPrice — the member/after-discount price
  discountCents: number;
  currency: string;
  promotions: Array<{
    shortText: string | null;
    longText: string | null;
    discountCents: number;
    startDate: string | null;
    endDate: string | null;
  }>;
  /** true when the item is carried/priced at this (regional) warehouse. */
  carried: boolean;
}

interface PriceLiteResponse {
  priceData?: {
    warehouseNumber?: string;
    displayPrice?: { onlinePrice?: number; deliveredPrice?: number; aggregatedDiscountAmt?: number; currency?: string };
    discounts?: {
      promotions?: Array<{
        calculatedDiscountAmount?: number;
        promotionStartDate?: string;
        promotionEndDate?: string;
        promotionStatement?: { shortText?: { text?: string }; longText?: { text?: string } };
      }>;
    };
  };
}

const toCents = (n: number | null | undefined) => (n == null ? null : Math.round(n * 100));

/** display-price-lite for one child id at one warehouse number. 404 = not carried. */
export async function priceAndPromos(childId: string, whsNumber: string, throttled = true): Promise<PriceResult | null> {
  if (throttled) await throttle();
  const res = await fetch(
    `https://gdx-api.costco.com/catalog/product/dispprice-api/v2/display-price-lite?whsNumber=${whsNumber}&clientId=${PRODUCT_CLIENT_ID}&item=${childId}&locale=en-us`,
    { headers: baseHeaders(PRICE_CLIENT_ID) }
  );
  if (res.status === 404) return null; // not carried at this warehouse
  if (!res.ok) throw new CostcoError(`display-price-lite ${childId}@${whsNumber} -> HTTP ${res.status}`);
  const body = (await res.json()) as PriceLiteResponse;
  const dp = body.priceData?.displayPrice;
  if (!dp) return null;
  const promos = (body.priceData?.discounts?.promotions ?? []).map((p) => ({
    shortText: p.promotionStatement?.shortText?.text ?? null,
    longText: p.promotionStatement?.longText?.text ?? null,
    discountCents: toCents(p.calculatedDiscountAmount) ?? 0,
    startDate: p.promotionStartDate ?? null,
    endDate: p.promotionEndDate ?? null,
  }));
  return {
    onlinePriceCents: toCents(dp.onlinePrice),
    warehousePriceCents: toCents(dp.deliveredPrice),
    discountCents: toCents(dp.aggregatedDiscountAmt) ?? 0,
    currency: dp.currency ?? "USD",
    promotions: promos,
    carried: true,
  };
}
