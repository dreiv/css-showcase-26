<script setup lang="ts">
import { computed, ref } from 'vue'
import { products, type Product } from '../data/products'

type SortKey = 'name' | 'category' | 'price' | 'stock' | 'rating'

interface ColumnDef {
  key: SortKey
  label: string
}

const allColumns: ColumnDef[] = [
  { key: 'name', label: 'Name' },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Price' },
  { key: 'stock', label: 'Stock' },
  { key: 'rating', label: 'Rating' },
]

// Visibility/order are staged in a draft and only take effect on "Apply".
// Width is direct-manipulation (drag the column edge) and commits on pointerup.
const DEFAULT_ORDER: SortKey[] = allColumns.map((c) => c.key)
const DEFAULT_VISIBLE: Record<SortKey, boolean> = Object.fromEntries(
  allColumns.map((c) => [c.key, true]),
) as Record<SortKey, boolean>
const DEFAULT_WIDTHS: Record<SortKey, number> = {
  name: 200,
  category: 130,
  price: 110,
  stock: 150,
  rating: 90,
}
const MIN_COL_WIDTH = 72
const MAX_COL_WIDTH = 480

const SESSION_KEYS = {
  order: 'demo-table:column-order',
  visible: 'demo-table:column-visible',
  widths: 'demo-table:column-widths',
} as const

function loadSession<T>(key: string, fallback: T): T {
  if (typeof sessionStorage === 'undefined') return fallback
  try {
    const raw = sessionStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function saveSession(key: string, value: unknown) {
  if (typeof sessionStorage === 'undefined') return
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage full or unavailable — fine to no-op
  }
}

function clearSession(key: string) {
  if (typeof sessionStorage === 'undefined') return
  try {
    sessionStorage.removeItem(key)
  } catch {
    // ignore
  }
}

// Live state — what the table renders with.
const columnOrder = ref<SortKey[]>(loadSession(SESSION_KEYS.order, DEFAULT_ORDER))
const columnVisible = ref<Record<SortKey, boolean>>(loadSession(SESSION_KEYS.visible, DEFAULT_VISIBLE))
const columnWidths = ref<Record<SortKey, number>>(loadSession(SESSION_KEYS.widths, DEFAULT_WIDTHS))

// Draft state — edited in the sidepanel, committed on Apply.
const draftOrder = ref<SortKey[]>([...columnOrder.value])
const draftVisible = ref<Record<SortKey, boolean>>({ ...columnVisible.value })

const draftColumns = computed(() => draftOrder.value.map((key) => allColumns.find((c) => c.key === key)!))
const draftVisibleCount = computed(() => Object.values(draftVisible.value).filter(Boolean).length)

function onPanelToggle(event: Event) {
  const newState = (event as Event & { newState?: string }).newState
  if (newState === 'open') {
    // Re-sync the draft on open so an abandoned edit (no Apply) never leaks in.
    draftOrder.value = [...columnOrder.value]
    draftVisible.value = { ...columnVisible.value }
  }
}

function applyColumns() {
  columnOrder.value = [...draftOrder.value]
  columnVisible.value = { ...draftVisible.value }
  saveSession(SESSION_KEYS.order, columnOrder.value)
  saveSession(SESSION_KEYS.visible, columnVisible.value)
  columnPanel.value?.hidePopover()
}

function resetColumns() {
  draftOrder.value = [...DEFAULT_ORDER]
  draftVisible.value = { ...DEFAULT_VISIBLE }
  columnOrder.value = [...DEFAULT_ORDER]
  columnVisible.value = { ...DEFAULT_VISIBLE }
  columnWidths.value = { ...DEFAULT_WIDTHS }
  clearSession(SESSION_KEYS.order)
  clearSession(SESSION_KEYS.visible)
  clearSession(SESSION_KEYS.widths)
}

function moveDraft(key: SortKey, dir: -1 | 1) {
  const i = draftOrder.value.indexOf(key)
  const j = i + dir
  if (j < 0 || j >= draftOrder.value.length) return
  const copy = [...draftOrder.value]
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  draftOrder.value = copy
}

const dragKey = ref<SortKey | null>(null)
function onDragStart(key: SortKey) {
  dragKey.value = key
}
function onDrop(targetKey: SortKey) {
  if (!dragKey.value || dragKey.value === targetKey) return
  const from = draftOrder.value.indexOf(dragKey.value)
  const to = draftOrder.value.indexOf(targetKey)
  const copy = [...draftOrder.value]
  copy.splice(from, 1)
  copy.splice(to, 0, dragKey.value)
  draftOrder.value = copy
  dragKey.value = null
}

const columnPanel = ref<HTMLDivElement | null>(null)

const visibleColumns = computed(() =>
  columnOrder.value.filter((key) => columnVisible.value[key]).map((key) => allColumns.find((c) => c.key === key)!),
)

const tableWidth = computed(() => visibleColumns.value.reduce((sum, c) => sum + columnWidths.value[c.key], 0))

// Width is written straight to the <col> style during the drag (no reactivity,
// no re-render); reactive state + persistence only happen once, on pointerup.
const colEls = new Map<SortKey, HTMLTableColElement>()
function setColEl(key: SortKey, el: Element | null) {
  if (el) colEls.set(key, el as HTMLTableColElement)
}
function colRef(key: SortKey) {
  return (el: Element | null) => setColEl(key, el)
}

function startResize(event: PointerEvent, key: SortKey) {
  event.preventDefault()
  const handle = event.currentTarget as HTMLElement
  const startX = event.clientX
  const startWidth = columnWidths.value[key]
  const colEl = colEls.get(key)
  handle.setPointerCapture(event.pointerId)

  function onMove(moveEvent: PointerEvent) {
    const next = Math.min(MAX_COL_WIDTH, Math.max(MIN_COL_WIDTH, startWidth + (moveEvent.clientX - startX)))
    if (colEl) colEl.style.width = `${next}px`
  }

  function onUp() {
    handle.removeEventListener('pointermove', onMove)
    handle.removeEventListener('pointerup', onUp)
    const next = colEl ? Math.round(parseFloat(colEl.style.width)) : startWidth
    columnWidths.value = { ...columnWidths.value, [key]: next }
    saveSession(SESSION_KEYS.widths, columnWidths.value)
  }

  handle.addEventListener('pointermove', onMove)
  handle.addEventListener('pointerup', onUp, { once: true })
}

const sortKey = ref<SortKey>('name')
const sortDir = ref<'asc' | 'desc'>('asc')

const categories = [...new Set(products.map((p) => p.category))]
const selectedCategories = ref<string[]>([...categories])
const inStockOnly = ref(false)
const maxPrice = ref<number | null>(null)

function toggleSort(key: SortKey) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
}

function ariaSort(key: SortKey) {
  if (sortKey.value !== key) return 'none'
  return sortDir.value === 'asc' ? 'ascending' : 'descending'
}

function clearFilters() {
  selectedCategories.value = [...categories]
  inStockOnly.value = false
  maxPrice.value = null
}

const activeFilterCount = computed(() => {
  let n = 0
  if (selectedCategories.value.length !== categories.length) n++
  if (inStockOnly.value) n++
  if (maxPrice.value) n++
  return n
})

const rows = computed(() => {
  const filtered = products.filter((p) => {
    if (!selectedCategories.value.includes(p.category)) return false
    if (inStockOnly.value && p.stock === 0) return false
    if (maxPrice.value && p.price > maxPrice.value) return false
    return true
  })

  return [...filtered].sort((a: Product, b: Product) => {
    const dir = sortDir.value === 'asc' ? 1 : -1
    const av = a[sortKey.value]
    const bv = b[sortKey.value]
    if (typeof av === 'string' && typeof bv === 'string') return av.localeCompare(bv) * dir
    return ((av as number) - (bv as number)) * dir
  })
})

function formatCell(p: Product, key: SortKey): string {
  switch (key) {
    case 'price':
      return `$${p.price.toFixed(2)}`
    case 'rating':
      return p.rating.toFixed(1)
    case 'stock':
      return p.stock === 0 ? 'Out of stock' : String(p.stock)
    default:
      return p[key] as string
  }
}

// Keyed by product + column (not position) so notes track their cell through reorders.
interface NoteEntry {
  productId: number
  columnKey: SortKey
  text: string
}

const notes: NoteEntry[] = [
  { productId: 2, columnKey: 'stock', text: 'Backordered — restocking on the 30th, existing orders ship first.' },
  { productId: 3, columnKey: 'price', text: 'Price includes a launch discount that ends this weekend.' },
  { productId: 25, columnKey: 'stock', text: 'Discontinued — these were the final units, no restock planned.' },
  { productId: 44, columnKey: 'price', text: 'Bundle discount applied when bought with 2+ other titles this week.' },
]

function noteFor(productId: number, columnKey: SortKey) {
  return notes.find((n) => n.productId === productId && n.columnKey === columnKey)
}

function anchorIdent(note: NoteEntry) {
  return `--note-${note.productId}-${note.columnKey}`
}
</script>

<template>
  <h2>Data table</h2>
  <p class="description">
    Click a column header to sort, or hit filter for a popover with checkboxes. The
    <strong>i</strong> markers open a note anchored to that cell, and stay pinned to it even as
    you scroll the table — both use native <code>popover</code> + CSS anchor positioning, with
    <code>position-try-fallbacks</code> flipping them back on screen near an edge and
    <code>position-visibility: anchors-visible</code> hiding a note the moment its trigger scrolls
    out of view. Columns are drag-to-resize, and the config panel on the right lets you show, hide
    and reorder them.
  </p>

  <div class="toolbar">
    <button class="filter-btn" popovertarget="filter-popover" popovertargetaction="toggle">
      Filter{{ activeFilterCount ? ` (${activeFilterCount})` : '' }}
    </button>
    <p class="count">{{ rows.length }} of {{ products.length }} products</p>
    <button type="button" class="config-btn" popovertarget="column-panel">
      <span class="gear" aria-hidden="true">⚙</span>
      Columns
    </button>
  </div>

  <div id="filter-popover" popover class="filter-popover">
    <fieldset>
      <legend>Category</legend>
      <label v-for="c in categories" :key="c">
        <input type="checkbox" :value="c" v-model="selectedCategories" />
        {{ c }}
      </label>
    </fieldset>

    <label class="row-field">
      <input type="checkbox" v-model="inStockOnly" />
      In stock only
    </label>

    <label class="row-field">
      Max price
      <input type="number" v-model.number="maxPrice" min="0" placeholder="Any" />
    </label>

    <button type="button" class="clear-btn" @click="clearFilters">Clear filters</button>
  </div>

  <!-- Column config sidepanel: draft show/hide + order, applied on demand. -->
  <div id="column-panel" ref="columnPanel" popover class="column-panel" @beforetoggle="onPanelToggle">
    <h3>Columns</h3>
    <p class="panel-hint">Drag, or use the arrows, to reorder. Widths are resized on the table itself.</p>
    <ul class="column-list">
      <li v-for="col in draftColumns" :key="col.key" class="column-row" draggable="true"
        @dragstart="onDragStart(col.key)" @dragover.prevent @drop="onDrop(col.key)">
        <span class="drag-handle" aria-hidden="true">⠿</span>
        <label class="column-check">
          <input type="checkbox" v-model="draftVisible[col.key]"
            :disabled="draftVisible[col.key] && draftVisibleCount === 1" />
          {{ col.label }}
        </label>
        <span class="reorder-btns">
          <button type="button" aria-label="Move up" :disabled="draftOrder.indexOf(col.key) === 0"
            @click="moveDraft(col.key, -1)">▲</button>
          <button type="button" aria-label="Move down" :disabled="draftOrder.indexOf(col.key) === draftOrder.length - 1"
            @click="moveDraft(col.key, 1)">▼</button>
        </span>
      </li>
    </ul>
    <div class="panel-actions">
      <button type="button" class="reset-btn" @click="resetColumns">Reset</button>
      <button type="button" class="apply-btn" @click="applyColumns">Apply</button>
    </div>
  </div>

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
            <button type="button" class="sort-btn" @click="toggleSort(col.key)">
              {{ col.label }}
              <span v-if="sortKey === col.key" class="arrow"> {{ sortDir === 'asc' ? '↑' : '↓' }}</span>
            </button>
            <span class="col-resizer" role="presentation" @pointerdown="startResize($event, col.key)"></span>
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

  <div v-for="note in notes" :key="`${note.productId}-${note.columnKey}`"
    :id="`note-${note.productId}-${note.columnKey}`" popover class="note-card"
    :style="{ 'position-anchor': anchorIdent(note) }">
    <p>{{ note.text }}</p>
  </div>

  <p class="support-note">
    <code>position-visibility: anchors-visible</code> and drag-to-resize columns rely on CSS anchor
    positioning and Pointer Events, both broadly supported in Chromium/Blink-based browsers today;
    elsewhere the popovers fall back to centered positioning and column widths just won't be
    user-resizable.
  </p>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-block-end: 1rem;
}

.count {
  margin: 0;
  color: color-mix(in srgb, currentColor 65%, transparent);
  font-size: 0.9em;
}

.config-btn {
  margin-inline-start: auto;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.gear {
  font-size: 0.95em;
}

/* display/opacity must stay scoped to :popover-open — an unconditional display
   rule would beat the browser's default [popover] hiding and never close. */
.filter-popover {
  display: none;
  flex-direction: column;
  gap: 0.75rem;
  width: max-content;
  max-width: min(90vw, 260px);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  padding: 0.9rem;
  background: canvas;
  color: inherit;
  box-shadow: 0 8px 24px rgb(0 0 0 / 18%);
  opacity: 0;
  translate: 0 4px;
  transition:
    opacity 0.18s ease,
    translate 0.18s ease,
    overlay 0.18s allow-discrete,
    display 0.18s allow-discrete;
}

.filter-popover:popover-open {
  display: flex;
  opacity: 1;
  translate: 0 0;
}

@starting-style {
  .filter-popover:popover-open {
    opacity: 0;
    translate: 0 4px;
  }
}

.filter-popover fieldset {
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.filter-popover legend {
  padding: 0;
  font-weight: 600;
  margin-block-end: 0.2rem;
}

.filter-popover label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9em;
}

.filter-popover input[type='checkbox'] {
  accent-color: var(--accent);
}

.row-field input[type='number'] {
  width: 6rem;
  margin-inline-start: auto;
  accent-color: var(--accent);
}

.clear-btn {
  align-self: flex-start;
  font-size: 0.85em;
}

/* Same popover + allow-discrete pattern, pinned to the right edge, sliding in. */
.column-panel {
  display: none;
  flex-direction: column;
  position: fixed;
  inset: 0 0 0 auto;
  margin: 0;
  width: min(90vw, 320px);
  height: 100dvh;
  border: none;
  border-inline-start: 1px solid var(--border-strong);
  border-radius: 0;
  padding: 1.1rem 1.2rem;
  background: canvas;
  color: inherit;
  box-shadow: -8px 0 24px rgb(0 0 0 / 18%);
  opacity: 0;
  translate: 100% 0;
  transition:
    opacity 0.22s ease,
    translate 0.22s ease,
    overlay 0.22s allow-discrete,
    display 0.22s allow-discrete;
}

.column-panel:popover-open {
  display: flex;
  opacity: 1;
  translate: 0 0;
}

@starting-style {
  .column-panel:popover-open {
    opacity: 0;
    translate: 100% 0;
  }
}

.column-panel::backdrop {
  background: rgb(0 0 0 / 35%);
  opacity: 0;
  transition:
    opacity 0.22s ease,
    overlay 0.22s allow-discrete,
    display 0.22s allow-discrete;
}

.column-panel:popover-open::backdrop {
  opacity: 1;
}

@starting-style {
  .column-panel:popover-open::backdrop {
    opacity: 0;
  }
}

.column-panel h3 {
  margin: 0 0 0.15rem;
}

.panel-hint {
  margin: 0 0 0.9rem;
  color: color-mix(in srgb, currentColor 65%, transparent);
  font-size: 0.85em;
}

.column-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  overflow-y: auto;
}

.column-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0.45rem 0.6rem;
  background: var(--surface);
  cursor: grab;
}

.column-row:active {
  cursor: grabbing;
}

.drag-handle {
  color: color-mix(in srgb, currentColor 55%, transparent);
  font-size: 1.1em;
  line-height: 1;
}

.column-check {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  flex: 1;
  font-size: 0.92em;
}

.column-check input {
  accent-color: var(--accent);
}

.reorder-btns {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.reorder-btns button {
  all: unset;
  cursor: pointer;
  font-size: 0.65em;
  line-height: 1;
  padding: 0.15rem 0.3rem;
  border-radius: 0.2rem;
  color: color-mix(in srgb, currentColor 70%, transparent);
}

.reorder-btns button:hover:not(:disabled) {
  background: var(--surface-hover);
  color: inherit;
}

.reorder-btns button:disabled {
  opacity: 0.3;
  cursor: default;
}

.panel-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  margin-block-start: 1rem;
  padding-block-start: 1rem;
  border-block-start: 1px solid var(--border);
}

.note-card {
  display: none;
  width: max-content;
  max-width: min(90vw, 220px);
  margin: 0;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  padding: 0.65rem 0.8rem;
  background: canvas;
  color: inherit;
  font-size: 0.85em;
  box-shadow: 0 8px 24px rgb(0 0 0 / 18%);
  opacity: 0;
  translate: 0 4px;
  transition:
    opacity 0.18s ease,
    translate 0.18s ease,
    overlay 0.18s allow-discrete,
    display 0.18s allow-discrete;
}

.note-card:popover-open {
  display: block;
  opacity: 1;
  translate: 0 0;
}

@starting-style {
  .note-card:popover-open {
    opacity: 0;
    translate: 0 4px;
  }
}

.note-card p {
  margin: 0;
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

/* Anchor to the trigger where supported; elsewhere popovers center by default. */
@supports (anchor-name: --a) {
  .filter-btn {
    anchor-name: --filter-btn;
  }

  .filter-popover {
    position-anchor: --filter-btn;
    inset: auto;
    top: calc(anchor(bottom) + 0.4rem);
    left: anchor(left);
    margin: 0;
    position-try-fallbacks: flip-block, flip-inline;
  }

  .note-card {
    inset: auto;
    top: anchor(bottom);
    left: anchor(center);
    translate: -50% 0;
    margin: 0.4rem 0 0;
    position-try-fallbacks: flip-block, flip-inline;
    /* The table scrolls, so the trigger can leave view while open — without this
       the popover keeps tracking the anchor and floats over unrelated content. */
    position-visibility: anchors-visible;
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

th {
  position: relative;
}

.col-resizer {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 8px;
  cursor: col-resize;
  touch-action: none;
}

.col-resizer:hover,
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
</style>
