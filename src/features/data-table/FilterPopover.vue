<script setup lang="ts">
defineProps<{
  categories: string[]
}>()

const selectedCategories = defineModel<string[]>('selectedCategories', { required: true })
const inStockOnly = defineModel<boolean>('inStockOnly', { required: true })
const maxPrice = defineModel<number | null>('maxPrice', { required: true })

const emit = defineEmits<{
  clear: []
}>()
</script>

<template>
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

    <button type="button" class="clear-btn" @click="emit('clear')">Clear filters</button>
  </div>
</template>

<style scoped>
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

/* Anchored to the Filter button (anchor-name set on the button in the view). */
@supports (anchor-name: --a) {
  .filter-popover {
    position-anchor: --filter-btn;
    inset: auto;
    top: calc(anchor(bottom) + 0.4rem);
    left: anchor(left);
    margin: 0;
    position-try-fallbacks: flip-block, flip-inline;
  }
}
</style>
