# Costco data sources — reverse-engineering notes

Captured 2026-08-16 via `scripts/probe-costco*.ts`. Costco has **no official public
API**; everything below is the same endpoint set costco.com's own frontend calls.
All of these work from a **plain server-side fetch (no browser, no membership
login)** unless noted. They authenticate with static per-service `client-identifier`
headers plus `accept: */*` (using `accept: application/json` gets a spurious 400).

> ⚠️ These are undocumented and will drift. When one breaks, re-run the probes
> and update `apps/server/src/sources/costco.ts` + the ids below.

## The pipeline

```
ZIP ──geocode──▶ lat/lng ──locator──▶ warehouses (id, name, address)
                                       │
product sitemap ──▶ item numbers ──────┤
                                       ▼   (per item, per warehouse)
                        display-price-lite ─▶ price + promotions/discounts
                        inventorylevels     ─▶ buyable / delivery availability
                        products/summary    ─▶ name, image, brand, category
```

## Endpoints

### 1. Geocode ZIP → lat/lng  ✅ headless
```
GET https://geocodeservice.costco.com/Locations?q=98105
```
Returns `[{ postalCode, city, stateProvinceAbbreviation, latitude, longitude }]`.

### 2. Warehouse locator (buildings near a point)  ✅ headless
```
GET https://ecom-api.costco.com/core/warehouse-locator/v1/salesLocations.json
      ?latitude=47.6614&longitude=-122.2929&limit=25
header client-identifier: 7c71124c-7bf1-44db-bc9d-498584cd66e5
```
`salesLocations[]` → `salesLocationId` (the **warehouse number**), `name[0].value`,
`address{line1,city,territory,postalCode}`, `distance`, `subType.code` (filter to
`"Warehouse"`). Seattle 98105 → e.g. Kirkland (id 8), … The point's own store maps
to `whsNumber` (98105 resolved to 847 in testing).

### 3. Product universe via sitemap  ✅ headless, allowed by robots.txt
```
GET https://www.costco.com/sitemap_lw_index.xml     → child sitemaps
GET https://www.costco.com/sitemap_lw_p_001.xml      → 8,041 product URLs
```
Item number is embedded: `…/<slug>.product.<ITEM>.html`. Multiple product
sitemaps (`_p_001`, `_p_mod_001`, …). **This is the seed list** — there is no
"list every item in warehouse N" endpoint; you enumerate the catalog here and
enrich each item per warehouse.

### 4. Display price (per warehouse) + promotions  ✅ headless — the important one
```
GET https://gdx-api.costco.com/catalog/product/dispprice-api/v2/display-price-lite
      ?whsNumber=847&clientId=4900eb1f-0c10-4bd9-99c3-c59e6c1ecebf&item=2048748&locale=en-us
header client-identifier: 6b262714-2ed4-4dcb-a39d-39a4b0357309
```
`item` is the **child/variant id** from `products/summary.childCatalogData[].id`
(not the parent item number on the URL). One item per call (batch → 400).
Response `priceData`:
- `displayPrice.onlinePrice` / `deliveredPrice` / `aggregatedDiscountAmt`
- `discounts.promotions[]` → `calculatedDiscountAmount`, `promotionStartDate/EndDate`,
  `shortText` ("$6 OFF"), `longText` ("$6 manufacturer's savings … while supplies
  last. Limit 2 per member."), `redemptionLimit`.

**This single endpoint powers Phase 2** (on sale = promotions present; biggest
savings = sort by `aggregatedDiscountAmt`; clearance ≈ price endings + `.97`/`.00`).

### 5. Inventory availability  ✅ headless — but note what it means
```
GET https://ecom-api.costco.com/ebusiness/inventory/v1/inventorylevels/availability/v2/2048748
      ?destinationState=WA&destinationPostalCode=98105&destinationCountryCode=US
      &orderItemId=0&shippingCodes=UP2&action=EDD&quantity=1
headers client-identifier: 481b1aec-…  costco.env: ECOM  costco.service: restInventory
```
Returns `availability` (`INSTOCK`/…), `availableForSale`, `distributionCenter`,
estimated delivery date. **This is online/delivery fulfillment availability, not a
guarantee the item is on the shelf in a specific building.** See limitation below.

### 6. Product summary (metadata)  ✅ headless
```
GET https://gdx-api.costco.com/catalog/product/product-api/v1/products/summary
      ?clientId=4900eb1f-…&items=<comma,list>&whsNumber=847&locales=en-US
header client-identifier: b1be4e95-…   (costco-env: prd)
```
Batchable (many `items=`). Gives `descriptions[].object.shortDescription`,
`imageName`, `as400DeptName` (category), `childCatalogData[].id` (the child id you
feed to price/inventory). `displayPrice` here is **null** — price comes from #4.

### 7. Catalog search  ✅ headless — the FULL catalog (POST, not GET)
```
POST https://gdx-api.costco.com/catalog/search/api/v1/search
headers  client-identifier: 168287ea-1201-45f6-9b45-5bbea49f8ee7
         client_id: USBC   locale: en-US   searchresultprovider: GRS
         content-type: application/json
body     { visitorId, query, pageSize, offset, orderBy:null, searchMode:"page",
           personalizationEnabled:false, warehouseId:"243-wh",
           shipToPostal, shipToState, deliveryLocations:[…], 
           filterBy:["HIDE_OUT_OF_STOCK"], pageCategories:[] }
```
Google-Retail-Search backed (`searchResultProvider: GRS`). **This is the full
catalog** — it returns items the sitemaps omit entirely (e.g. all watches/
jewelry). A trimmed body → 400; keep the full shape, vary only query/offset/
shipTo (deliveryLocations can stay as a fixed template). Each
`searchResult.results[]` gives: `id` (item number), `product.title`, `brands`,
`categories`, `uri` (new `/p/-/slug/number` format), `variants[0].id` (the child
id for pricing), and `attributes` incl. `primary_image`, `model`, and
`program_types` — which contains **`InWarehouse`** (a real per-item flag for
whether it's warehouse-stocked). Search does NOT include price → price stays
lazy (endpoint #4). GET on this path → 403; must be POST.

> A specific item may be absent from search (discontinued/sold-out) yet still
> resolvable by direct item-number lookup via products/summary (#6). So the app
> uses search for browse/find and #6 for "paste this exact item".

## What does NOT work headless
- `gdx-api …/catalog/search/api/v1/search` via **GET** → 403 (use POST, #7).
- Autocomplete `…/search/completeQuery` (GET) works but only returns suggestions.
- Category browse HTML (`/grocery-household.html`) and product-page HTML →
  **Akamai "Access Denied"** for automated navigation. A stealth browser
  (`--disable-blink-features=AutomationControlled` + `navigator.webdriver`
  masking, warm the homepage first) gets through, but we don't need PDP HTML —
  the JSON endpoints above cover everything.

### 8. TRUE per-warehouse in-warehouse stock  ✅ headless — the WR-killer
```
GET https://ecom-api.costco.com/ebusiness/inventory/v1/inventorylevels/availability/pickup/{childId}
      ?quantity=1&selectedWarehouse={warehouseNumber}-wh&shippingCodes=UP3&action=EDD
headers client-identifier: 481b1aec-…  costco.env: ECOM  costco.service: restInventory
```
`{childId}` = the pricing child id (products/summary variant). `{warehouseNumber}`
= salesLocationId from the locator (#2). Response:
`warehouseAvailability.inWarehouse.availability` ∈ **INSTOCK / LOWSTOCK / NOSTOCK**;
an empty `warehouseAvailability {}` means the item isn't sold at that warehouse.
This is what costco.com's product page uses for "in my warehouse" — a plain
server-side GET, **no membership, no browser, no Akamai**. Call it per warehouse to
build a per-warehouse grid; do it concurrently across a region for an
"all warehouses" scan. This supersedes the earlier Find-in-Warehouse browser hack
(now deleted).

## Note on "warehouse stock"
Endpoint #8 gives real per-warehouse in-warehouse stock (INSTOCK/LOWSTOCK/NOSTOCK)
for the items Costco stocks in warehouses. Items that are online-only or
discontinued return an empty `warehouseAvailability` at every warehouse (correctly
"not sold here") — e.g. a discontinued watch shows empty everywhere even though a
crowd app might still list stale stock for it. Price + promotions (#4) are national;
online/delivery availability (#5) is separate from shelf stock (#8).

## client-identifier values (rotate → re-probe)
| service | value |
|---|---|
| warehouse-locator / geocode | `7c71124c-7bf1-44db-bc9d-498584cd66e5` |
| products/summary | `b1be4e95-8696-4d93-8f50-5b5632922209` |
| display-price-lite | `6b262714-2ed4-4dcb-a39d-39a4b0357309` |
| inventorylevels | `481b1aec-aa3b-454b-b81b-48187e28f205` |
| product clientId (query param) | `4900eb1f-0c10-4bd9-99c3-c59e6c1ecebf` |
