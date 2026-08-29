import type { NoteEntry, SortKey } from './types'

export const NOTES: NoteEntry[] = [
  {
    productId: 2,
    columnKey: 'stock',
    text: 'Backordered — restocking on the 30th, existing orders ship first.',
  },
  {
    productId: 3,
    columnKey: 'price',
    text: 'Price includes a launch discount that ends this weekend.',
  },
  {
    productId: 25,
    columnKey: 'stock',
    text: 'Discontinued — these were the final units, no restock planned.',
  },
  {
    productId: 44,
    columnKey: 'price',
    text: 'Bundle discount applied when bought with 2+ other titles this week.',
  },
]

export function noteFor(productId: number, columnKey: SortKey): NoteEntry | undefined {
  return NOTES.find((n) => n.productId === productId && n.columnKey === columnKey)
}

export function anchorIdent(note: NoteEntry): string {
  return `--note-${note.productId}-${note.columnKey}`
}
