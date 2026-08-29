export type SortKey = 'name' | 'category' | 'price' | 'stock' | 'rating'

export interface ColumnDef {
  key: SortKey
  label: string
}

export interface NoteEntry {
  productId: number
  columnKey: SortKey
  text: string
}

export type SortDir = 'asc' | 'desc'
