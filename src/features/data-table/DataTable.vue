<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import type { Product } from '../../data/products'
import type { ColumnDef, NoteEntry, SortDir, SortKey } from './types'
import { formatCell } from './format'
import { noteFor, anchorIdent } from './notes'
import CellNote from './CellNote.vue'

const props = defineProps<{
  rows: Product[]
  visibleColumns: ColumnDef[]
  columnWidths: Record<SortKey, number>
  tableWidth: number
  sortKey: SortKey
  sortDir: SortDir
  colRef: (key: SortKey) => (el: Element | ComponentPublicInstance | null) => void
  startResize: (event: PointerEvent, key: SortKey) => void
  resizeBy: (key: SortKey, delta: number) => void
  notes: NoteEntry[]
}>()

const emit = defineEmits<{
  sort: [key: SortKey]
}>()

function ariaSort(key: SortKey) {
  if (props.sortKey !== key) return 'none'
  return props.sortDir === 'asc' ? 'ascending' : 'descending'
}

function onResizeKeydown(event: KeyboardEvent, key: SortKey) {
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    props.resizeBy(key, -10)
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    props.resizeBy(key, 10)
  }
}
</script>

<template>
  <div class="table-scroll">
    <table class="data-table" :style="{ minWidth: `${tableWidth}px` }">
      <colgroup>
        <col v-for="col in visibleColumns" :key="col.key" :ref="colRef(col.key)"
          :style="{ width: `${columnWidths[col.key]}px` }" />
        <col class="filler-col" />
      </colgroup>
      <thead>
        <tr>
          <th v-for="(col, i) in visibleColumns" :key="col.key" :class="{ pin: i === 0 }"
            :aria-sort="ariaSort(col.key)">
            <button type="button" class="sort-btn" @click="emit('sort', col.key)">
              {{ col.label }}
              <span v-if="sortKey === col.key" class="arrow">
                {{ sortDir === 'asc' ? '↑' : '↓' }}
              </span>
            </button>
            <button type="button" class="col-resizer" :aria-label="`Resize ${col.label} column`"
              :aria-valuenow="columnWidths[col.key]" @pointerdown="startResize($event, col.key)"
              @keydown="onResizeKeydown($event, col.key)"></button>
          </th>
          <th class="filler" aria-hidden="true"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in rows" :key="p.id">
          <td v-for="(col, i) in visibleColumns" :key="col.key" :class="{ pin: i === 0 }">
            <span v-if="col.key === 'stock' && p.stock === 0" class="stock-badge">
              <span class="stock-dot" aria-hidden="true"></span>
              Out of stock
            </span>
            <template v-else>{{ formatCell(p, col.key) }}</template>
            <button v-if="noteFor(p.id, col.key)" type="button" class="note-btn"
              :style="{ 'anchor-name': anchorIdent(noteFor(p.id, col.key)!) }"
              :popovertarget="`note-${p.id}-${col.key}`" :aria-label="`Note about ${p.name} ${col.label}`">
              i
            </button>
          </td>
          <td class="filler" aria-hidden="true"></td>
        </tr>
        <tr v-if="!rows.length">
          <td :colspan="visibleColumns.length + 1">No products match these filters.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <CellNote v-for="note in notes" :key="`${note.productId}-${note.columnKey}`" :note="note" />
</template>

<style scoped>
.table-scroll {
  overflow: auto;
  max-height: 22rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
}

.data-table {
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 0;
}

.data-table th,
.data-table td {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0.5rem 0.7rem;
}

.data-table thead th {
  position: sticky;
  top: 0;
  background: canvas;
  z-index: 1;
}

.data-table .pin {
  position: sticky;
  left: 0;
  background: canvas;
  z-index: 1;
  border-inline-end: 1px solid var(--border);
}

.data-table thead .pin {
  z-index: 2;
}

.data-table tbody tr:hover>* {
  background: var(--surface);
}

.data-table th {
  position: relative;
}

.col-resizer {
  all: unset;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 8px;
  cursor: col-resize;
  touch-action: none;
}

.col-resizer:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: -2px;
}


th:hover .col-resizer,
.col-resizer:hover {
  background: color-mix(in srgb, var(--accent) 25%, transparent);
}

.col-resizer:focus,
.col-resizer:active {
  background: color-mix(in srgb, var(--accent) 45%, transparent);
}

@supports (animation-timeline: scroll()) {
  .data-table .pin {
    animation: reveal-pin-shadow linear both;
    animation-timeline: scroll(inline nearest);
    animation-range: 0 24px;
  }
}

@keyframes reveal-pin-shadow {
  from {
    box-shadow: 6px 0 8px -6px transparent;
  }

  to {
    box-shadow: 6px 0 8px -6px rgb(0 0 0 / 25%);
  }
}

.sort-btn {
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  max-width: 100%;
  font-weight: 600;
  border-radius: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sort-btn:hover {
  text-decoration: underline;
}

.sort-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.arrow {
  font-size: 0.85em;
}

/* A badge, not tinted text — reads at a glance on small screens and doesn't
   rely on hue alone to carry the meaning. */
.stock-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.55rem;
  border: 1px solid color-mix(in srgb, crimson 45%, var(--border-strong));
  border-radius: 1rem;
  background: color-mix(in srgb, crimson 16%, canvas);
  color: color-mix(in srgb, crimson 75%, currentColor);
  font-size: 0.78em;
  font-weight: 600;
  white-space: nowrap;
}

.stock-dot {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  background: crimson;
  flex: none;
}

.note-btn {
  appearance: none;
  width: 1.1rem;
  height: 1.1rem;
  margin-inline-start: 0.35rem;
  padding: 0;
  border: 1px solid var(--border-strong);
  border-radius: 50%;
  background: canvas;
  color: inherit;
  font: inherit;
  font-size: 0.7em;
  line-height: 1;
  cursor: pointer;
}

.note-btn:hover,
.note-btn:focus-visible {
  background: var(--surface-hover);
}

.note-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
</style>
