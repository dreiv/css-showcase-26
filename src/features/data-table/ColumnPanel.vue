<script setup lang="ts">
import { ref } from 'vue'
import BaseModal from '../../components/BaseModal.vue'
import type { ColumnDef, SortKey } from './types'

defineProps<{
  draftColumns: ColumnDef[]
  draftOrder: SortKey[]
  draftVisible: Record<SortKey, boolean>
  draftVisibleCount: number
}>()

const emit = defineEmits<{
  open: []
  apply: []
  reset: []
  move: [key: SortKey, dir: -1 | 1]
  dragstart: [key: SortKey]
  drop: [key: SortKey]
  'toggle-visible': [key: SortKey, value: boolean]
}>()

const modalRef = ref<InstanceType<typeof BaseModal> | null>(null)

function open() {
  modalRef.value?.open()
}
function close() {
  modalRef.value?.close()
}
defineExpose({ open, close })

function onToggleVisible(key: SortKey, event: Event) {
  emit('toggle-visible', key, (event.target as HTMLInputElement).checked)
}
</script>

<template>
  <BaseModal ref="modalRef" id="column-panel-modal" title="Columns" @open="emit('open')">
    <p class="panel-hint">
      Drag, or use the arrows, to reorder. Widths are resized on the table itself.
    </p>
    <ul class="column-list">
      <li v-for="col in draftColumns" :key="col.key" class="column-row" draggable="true"
        @dragstart="emit('dragstart', col.key)" @dragover.prevent @drop="emit('drop', col.key)">
        <span class="drag-handle" aria-hidden="true">⠿</span>
        <label class="column-check">
          <input type="checkbox" :checked="draftVisible[col.key]"
            :disabled="draftVisible[col.key] && draftVisibleCount === 1" @change="onToggleVisible(col.key, $event)" />
          {{ col.label }}
        </label>
        <span class="reorder-btns">
          <button type="button" aria-label="Move up" :disabled="draftOrder.indexOf(col.key) === 0"
            @click="emit('move', col.key, -1)">▲</button>
          <button type="button" aria-label="Move down" :disabled="draftOrder.indexOf(col.key) === draftOrder.length - 1"
            @click="emit('move', col.key, 1)">▼</button>
        </span>
      </li>
    </ul>
    <div class="panel-actions">
      <button type="button" class="reset-btn" @click="emit('reset')">Reset</button>
      <button type="button" class="apply-btn" @click="emit('apply')">Apply</button>
    </div>
  </BaseModal>
</template>

<style scoped>
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
</style>
