<script setup lang="ts">
import { computed, ref } from 'vue'
import { products, type Product } from '../../data/products'
import DataTable from './DataTable.vue'
import FilterPopover from './FilterPopover.vue'
import ColumnPanel from './ColumnPanel.vue'
import { NOTES } from './notes'
import { useColumnConfig } from './useColumnConfig'
import { useTableFilters } from './useTableFilters'
import { useSort } from './useSort'
import type { SortKey } from './types'

const {
  columnWidths,
  visibleColumns,
  tableWidth,
  draftColumns,
  draftOrder,
  draftVisible,
  draftVisibleCount,
  syncDraft,
  applyColumns,
  resetColumns,
  moveDraft,
  onDragStart,
  onDrop,
  colRef,
  startResize,
} = useColumnConfig()

const {
  categories,
  selectedCategories,
  inStockOnly,
  maxPrice,
  clearFilters,
  activeFilterCount,
} = useTableFilters()

const { sortKey, sortDir, toggleSort } = useSort()

const columnPanelRef = ref<InstanceType<typeof ColumnPanel> | null>(null)

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

function onPanelOpen() {
  // Re-sync the draft on open so an abandoned edit (no Apply) never leaks in.
  syncDraft()
}

function onApply() {
  applyColumns()
  columnPanelRef.value?.close()
}

function onToggleVisible(key: SortKey, value: boolean) {
  draftVisible.value[key] = value
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
    out of view. Columns are drag-to-resize, and the config dialog on the right lets you show,
    hide and reorder them.
  </p>

  <div class="toolbar">
    <button class="filter-btn" popovertarget="filter-popover" popovertargetaction="toggle">
      Filter{{ activeFilterCount ? ` (${activeFilterCount})` : '' }}
    </button>
    <p class="count">{{ rows.length }} of {{ products.length }} products</p>
    <button type="button" class="config-btn" @click="columnPanelRef?.open()">
      <span class="gear" aria-hidden="true">⚙</span>
      Columns
    </button>
  </div>

  <FilterPopover :categories="categories" v-model:selected-categories="selectedCategories"
    v-model:in-stock-only="inStockOnly" v-model:max-price="maxPrice" @clear="clearFilters" />

  <ColumnPanel ref="columnPanelRef" :draft-columns="draftColumns" :draft-order="draftOrder"
    :draft-visible="draftVisible" :draft-visible-count="draftVisibleCount" @open="onPanelOpen" @apply="onApply"
    @reset="resetColumns" @move="moveDraft" @dragstart="onDragStart" @drop="onDrop" @toggle-visible="onToggleVisible" />

  <DataTable :rows="rows" :visible-columns="visibleColumns" :column-widths="columnWidths" :table-width="tableWidth"
    :sort-key="sortKey" :sort-dir="sortDir" :col-ref="colRef" :start-resize="startResize" :notes="NOTES"
    @sort="toggleSort" />

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

.support-note {
  margin-block-start: 1.25rem;
  color: color-mix(in srgb, currentColor 65%, transparent);
  font-size: 0.85em;
}

/* Anchor the filter popover to this button where supported. */
@supports (anchor-name: --a) {
  .filter-btn {
    anchor-name: --filter-btn;
  }
}
</style>
