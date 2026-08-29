<script setup lang="ts">
import type { NoteEntry } from './types'
import { anchorIdent } from './notes'

defineProps<{
  note: NoteEntry
}>()
</script>

<template>
  <div
    :id="`note-${note.productId}-${note.columnKey}`"
    popover
    class="note-card"
    :style="{ 'position-anchor': anchorIdent(note) }"
  >
    <p>{{ note.text }}</p>
  </div>
</template>

<style scoped>
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

/* Anchor to the trigger where supported; elsewhere popovers center by default. */
@supports (anchor-name: --a) {
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
</style>
