import type { ColumnDef, SortKey } from './types'

export const ALL_COLUMNS: ColumnDef[] = [
  { key: 'name', label: 'Name' },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Price' },
  { key: 'stock', label: 'Stock' },
  { key: 'rating', label: 'Rating' },
]

export const DEFAULT_ORDER: SortKey[] = ALL_COLUMNS.map((c) => c.key)

export const DEFAULT_VISIBLE: Record<SortKey, boolean> = Object.fromEntries(
  ALL_COLUMNS.map((c) => [c.key, true]),
) as Record<SortKey, boolean>

export const DEFAULT_WIDTHS: Record<SortKey, number> = {
  name: 200,
  category: 130,
  price: 110,
  stock: 150,
  rating: 90,
}

export const MIN_COL_WIDTH = 72
export const MAX_COL_WIDTH = 480

export const SESSION_KEYS = {
  order: 'demo-table:column-order',
  visible: 'demo-table:column-visible',
  widths: 'demo-table:column-widths',
} as const
