import { setTimeout as sleep } from 'node:timers/promises'

/**
 * Costco catalog search — POST to gdx-api search (Google Retail Search backed).
 * This is the FULL catalog (unlike the partial sitemap): it returns items,
 * with metadata inline, that the sitemaps omit entirely (e.g. watches/jewelry).
 *
 * Reverse-engineered 2026-08-16. Gotchas that cost time, so they're written down:
 *   - It's a POST with a JSON body (GET → 403).
 *   - Requires headers `locale: en-US` and `searchresultprovider: GRS` in
 *     addition to `client-identifier` + `client_id: USBC`.
 *   - The body needs the full shape below (query/offset/shipTo are the only
 *     bits worth varying); a trimmed body → 400.
 *   - Search does NOT include price — price stays lazy (display-price-lite).
 */

const URL = 'https://gdx-api.costco.com/catalog/search/api/v1/search'
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'

const HEADERS: Record<string, string> = {
  accept: '*/*',
  'accept-language': 'en-US',
  'content-type': 'application/json',
  'client-identifier': '168287ea-1201-45f6-9b45-5bbea49f8ee7',
  client_id: 'USBC',
  locale: 'en-US',
  searchresultprovider: 'GRS',
  origin: 'https://www.costco.com',
  referer: 'https://www.costco.com/',
  'user-agent': UA,
}

// Fixed delivery-location template (does not need to match the shopper's ZIP;
// verified a WA shipTo with these NY-region locations still returns results).
const DELIVERY_LOCATIONS = [
  '729-bd',
  '243-wh',
  '1260-3pl',
  '1321-wm',
  '1477-3pl',
  '283-wm',
  '561-wm',
  '725-wm',
  '731-wm',
  '758-wm',
  '759-wm',
  '847_0-cor',
  '847_0-cwt',
  '847_0-edi',
  '847_0-ehs',
  '847_0-membership',
  '847_0-mpt',
  '847_0-spc',
  '847_0-wm',
  '951-wm',
  '952-wm',
  '9847-wcs',
]

export interface SearchResultItem {
  costcoItemNumber: string
  costcoChildId: string | null
  name: string
  brand: string | null
  category: string | null
  imageUrl: string | null
  model: string | null
  inWarehouse: boolean
  uri: string | null
}

export interface SearchPage {
  items: SearchResultItem[]
  total: number
  offset: number
  pageSize: number
}

let lastAt = 0
async function throttle(minInterval = 400) {
  const wait = lastAt + minInterval - Date.now()
  if (wait > 0) await sleep(wait)
  lastAt = Date.now()
}

interface RawResult {
  id: string
  product: {
    title?: string
    brands?: string[]
    categories?: string[]
    uri?: string
    variants?: Array<{ id: string }>
    attributes?: Record<string, { text?: string[]; numbers?: number[] }>
  }
}

function textAttr(r: RawResult, key: string): string | null {
  return r.product.attributes?.[key]?.text?.[0] ?? null
}

export async function searchCatalog(
  query: string,
  opts: {
    offset?: number
    pageSize?: number
    zip?: string
    state?: string
    includeOutOfStock?: boolean
  } = {},
): Promise<SearchPage> {
  const offset = opts.offset ?? 0
  const pageSize = opts.pageSize ?? 24
  const body = {
    visitorId: '00000000000000000000000000000000',
    query,
    pageSize,
    offset,
    orderBy: null,
    searchMode: 'page',
    personalizationEnabled: false,
    warehouseId: '243-wh',
    shipToPostal: opts.zip ?? '98101',
    shipToState: opts.state ?? 'WA',
    deliveryLocations: DELIVERY_LOCATIONS,
    filterBy: opts.includeOutOfStock ? [] : ['HIDE_OUT_OF_STOCK'],
    pageCategories: [],
  }

  await throttle()
  const res = await fetch(URL, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Costco search "${query}" -> HTTP ${res.status}`)
  const data = (await res.json()) as {
    searchResult?: { results?: RawResult[]; totalSize?: number }
  }
  const results = data.searchResult?.results ?? []
  const items: SearchResultItem[] = results.map((r) => ({
    costcoItemNumber: r.id,
    costcoChildId: r.product.variants?.[0]?.id ?? null,
    name: r.product.title ?? `Item ${r.id}`,
    brand: r.product.brands?.[0] ?? null,
    category:
      r.product.categories?.[0] ?? textAttr(r, 'category_names') ?? null,
    imageUrl: textAttr(r, 'primary_image'),
    model: textAttr(r, 'model'),
    inWarehouse: (r.product.attributes?.program_types?.text ?? []).includes(
      'InWarehouse',
    ),
    uri: r.product.uri ?? null,
  }))
  return {
    items,
    total: data.searchResult?.totalSize ?? items.length,
    offset,
    pageSize,
  }
}
