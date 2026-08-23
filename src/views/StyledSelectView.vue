<script setup lang="ts">
import { ref } from 'vue'

const size = ref('medium')
const country = ref('')
</script>

<template>
  <h2>Styled select</h2>
  <p class="description">
    A native <code>&lt;select&gt;</code>, restyled with <code>appearance: none</code> and a
    wrapper for the arrow. This is the old, boring, and very widely supported way to do it — it
    works in effectively every browser still in use, unlike the newer "Customizable Select" API
    (<code>appearance: base-select</code>) which lets you style the open dropdown too, but is
    currently Chromium-only.
  </p>

  <div class="demo-row">
    <label class="field">
      Size
      <span class="select-wrap">
        <select v-model="size" class="styled-select">
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </span>
    </label>

    <label class="field">
      Country
      <span class="select-wrap">
        <select v-model="country" class="styled-select">
          <option value="" disabled>Choose one</option>
          <option value="ro">Romania</option>
          <option value="de">Germany</option>
          <option value="fr">France</option>
          <option value="jp">Japan</option>
        </select>
      </span>
    </label>
  </div>

  <p class="note">
    Selected: <strong>{{ size }}</strong>{{ country ? `, ${country}` : '' }}
  </p>

  <pre><code>.select-wrap {
  position: relative;
  display: inline-block;
}

/* the arrow: a masked triangle, colored with currentColor so it
   follows text color automatically (dark mode, etc.) */
.select-wrap::after {
  content: '';
  position: absolute;
  right: 0.75rem;
  top: 50%;
  translate: 0 -50%;
  width: 0.6rem;
  height: 0.6rem;
  background: currentColor;
  opacity: 0.6;
  pointer-events: none;
  mask: url('data:image/svg+xml,...chevron...') center / contain no-repeat;
}

.styled-select {
  appearance: none;
  padding-right: 2rem; /* room for the arrow */
}</code></pre>
</template>

<style scoped>
.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-block-end: 1.25rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.9em;
  font-weight: 600;
}

.select-wrap {
  position: relative;
  display: inline-block;
}

.select-wrap::after {
  content: '';
  position: absolute;
  right: 0.75rem;
  top: 50%;
  translate: 0 -50%;
  width: 0.6rem;
  height: 0.6rem;
  background: currentColor;
  opacity: 0.6;
  pointer-events: none;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center / contain no-repeat;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center / contain no-repeat;
}

.styled-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  font: inherit;
  font-weight: 400;
  color: inherit;
  background: canvas;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  padding: 0.45rem 2.1rem 0.45rem 0.75rem;
  min-width: 10rem;
  cursor: pointer;
  color-scheme: light dark;
}

.styled-select option {
  color: CanvasText;
  background-color: Canvas;
}

.styled-select:hover {
  background: var(--surface-hover);
}

.styled-select:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* Firefox draws its own focus dotted-line inside the option list — this hides it
   without touching focus-visible above */
.styled-select:-moz-focusring {
  color: transparent;
  text-shadow: 0 0 0 currentColor;
}

.note {
  color: color-mix(in srgb, currentColor 65%, transparent);
  font-size: 0.9em;
}
</style>
