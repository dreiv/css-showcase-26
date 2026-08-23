<script setup lang="ts">
import { computed, ref } from 'vue'
import { products, type Product } from '../data/products'

type SortKey = 'name' | 'category' | 'price' | 'stock' | 'rating'

const columns: { key: SortKey; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Price' },
  { key: 'stock', label: 'Stock' },
  { key: 'rating', label: 'Rating' },
]

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

// a couple of rows get a small note popover, to show the anchored-note pattern
// without wiring every single cell up for it
const notedProductIds = new Set([2, 3])
</script>

<template>
  <h2>Data table</h2>
  <p class="description">
    Click a column header to sort, or hit filter for a popover with checkboxes. The
    <strong>i</strong> markers open a note anchored to that cell — both popovers use the same
    pattern: native <code>popover</code> + CSS anchor positioning, with
    <code>position-try-fallbacks</code> flipping them back on screen near an edge.
  </p>

  <div class="toolbar">
    <button class="filter-btn" popovertarget="filter-popover" popovertargetaction="toggle">
      Filter{{ activeFilterCount ? ` (${activeFilterCount})` : '' }}
    </button>
    <p class="count">{{ rows.length }} of {{ products.length }} products</p>
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

  <div class="table-scroll">
    <table class="data-table">
      <thead>
        <tr>
          <th
            v-for="(col, i) in columns"
            :key="col.key"
            :class="{ pin: i === 0 }"
            :aria-sort="ariaSort(col.key)"
          >
            <button type="button" class="sort-btn" @click="toggleSort(col.key)">
              {{ col.label }}
              <span v-if="sortKey === col.key" class="arrow">{{
                sortDir === 'asc' ? '↑' : '↓'
              }}</span>
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in rows" :key="p.id">
          <td class="pin">{{ p.name }}</td>
          <td>{{ p.category }}</td>
          <td>
            ${{ p.price.toFixed(2) }}
            <button
              v-if="p.id === 3"
              type="button"
              class="note-btn note-btn--monitor"
              popovertarget="note-monitor"
              aria-label="Note about 4K Monitor price"
            >
              i
            </button>
          </td>
          <td :class="{ 'out-of-stock': p.stock === 0 }">
            {{ p.stock === 0 ? 'Out of stock' : p.stock }}
            <button
              v-if="p.id === 2"
              type="button"
              class="note-btn note-btn--keyboard"
              popovertarget="note-keyboard"
              aria-label="Note about Mechanical Keyboard stock"
            >
              i
            </button>
          </td>
          <td>{{ p.rating.toFixed(1) }}</td>
        </tr>
        <tr v-if="!rows.length">
          <td colspan="5">No products match these filters.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div id="note-keyboard" popover class="note-card note-card--keyboard">
    <p>Backordered — restocking on the 30th, existing orders ship first.</p>
  </div>
  <div id="note-monitor" popover class="note-card note-card--monitor">
    <p>Price includes a launch discount that ends this weekend.</p>
  </div>
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

/* --- the filter popover ---
   IMPORTANT: display/opacity only get set under :popover-open. The browser's own
   stylesheet hides a [popover] by default via `:not(:popover-open) { display: none }` —
   setting `display: flex` unconditionally (as an earlier version of this did) is an
   author rule of equal-or-higher specificity, so it silently wins over the browser's
   "hidden" rule and the panel never actually closes. Keeping `display` scoped to
   :popover-open is what makes the toggle button work at all. */
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

.row-field input[type='number'] {
  width: 6rem;
  margin-inline-start: auto;
}

.clear-btn {
  align-self: flex-start;
  font-size: 0.85em;
}

/* --- the note popovers, same shape/rules as the filter popover --- */
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

/* Anchor everything to its trigger, but only where anchor positioning is actually
   supported — everywhere else the popovers just fall back to the browser's default
   centered position, which still opens/closes correctly on its own. */
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

  .note-btn--keyboard {
    anchor-name: --note-keyboard;
  }
  .note-btn--monitor {
    anchor-name: --note-monitor;
  }
  .note-card--keyboard {
    position-anchor: --note-keyboard;
  }
  .note-card--monitor {
    position-anchor: --note-monitor;
  }
  .note-card {
    inset: auto;
    top: anchor(bottom);
    left: anchor(center);
    translate: -50% 0;
    margin: 0.4rem 0 0;
    position-try-fallbacks: flip-block, flip-inline;
  }
}

/* --- sortable headers --- */
.sort-btn {
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 600;
}

.sort-btn:hover {
  text-decoration: underline;
}

.arrow {
  font-size: 0.85em;
}

.out-of-stock {
  color: color-mix(in srgb, crimson 70%, currentColor);
}

/* --- sticky header + sticky first column --- */
.table-scroll {
  overflow: auto;
  max-height: 22rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.data-table {
  border-collapse: separate;
  border-spacing: 0;
  min-width: 640px;
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
}

.data-table thead .pin {
  z-index: 2;
}

.data-table tbody tr:hover > * {
  background: var(--surface);
}
</style>
