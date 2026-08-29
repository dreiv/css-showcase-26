<script setup lang="ts">
import { useTemplateRef } from 'vue'

defineProps<{
  id: string
  title?: string
}>()

const emit = defineEmits<{
  open: []
  close: []
}>()

const dialogEl = useTemplateRef<HTMLDialogElement>('modalDialog')

function open() {
  dialogEl.value?.showModal()
}

function close() {
  dialogEl.value?.close()
}

defineExpose({ open, close })
</script>

<template>
  <dialog :id="id" ref="modalDialog" closedby="any" class="modal" @open="emit('open')" @close="emit('close')">
    <button type="button" class="modal-close" command="close" :commandfor="id" aria-label="Close">
      ×
    </button>
    <div class="modal-body">
      <h3 v-if="title" class="modal-title">{{ title }}</h3>
      <slot />
    </div>
  </dialog>
</template>

<style scoped>
.modal {
  position: relative;
  border: 1px solid var(--border-strong);
  border-radius: 1rem;
  padding: 1.4rem 1.6rem;
  width: min(90vw, 420px);
  background: canvas;
  color: inherit;
  box-shadow: 0 20px 60px rgb(0 0 0 / 25%);
  opacity: 0;
  scale: 0.96;
  transition:
    opacity 0.2s ease,
    scale 0.2s ease,
    overlay 0.2s allow-discrete,
    display 0.2s allow-discrete;
}

.modal[open] {
  opacity: 1;
  scale: 1;
}

@starting-style {
  .modal[open] {
    opacity: 0;
    scale: 0.96;
  }
}

.modal::backdrop {
  background: rgb(0 0 0 / 45%);
  backdrop-filter: blur(2px);
  opacity: 0;
  transition:
    opacity 0.2s ease,
    overlay 0.2s allow-discrete,
    display 0.2s allow-discrete;
}

.modal[open]::backdrop {
  opacity: 1;
}

@starting-style {
  .modal[open]::backdrop {
    opacity: 0;
  }
}

.modal-title {
  margin: 0 0 0.6rem;
  padding-right: 1.5rem;
}

/* Drawn as two crossed lines, not an "×" glyph — glyph metrics vary by font. */
.modal-close {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  width: 1.75rem;
  height: 1.75rem;
  padding: 0;
  border: 1px solid var(--border-strong);
  border-radius: 0.35rem;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: 0;
}

.modal-close::before,
.modal-close::after {
  content: '';
  position: absolute;
  inset: 0;
  margin: auto;
  width: 0.8rem;
  height: 1.5px;
  background: currentColor;
}

.modal-close::before {
  rotate: 45deg;
}

.modal-close::after {
  rotate: -45deg;
}

.modal-close:hover {
  background: var(--surface-hover);
}

.modal-close:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
</style>
