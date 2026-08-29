<script setup lang="ts">
import { ref } from 'vue'

const compareValue = ref('medium')

const size = ref('medium')
const status = ref('in-progress')
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

  <div class="compare">
    <div class="col">
      <h3>Default select</h3>
      <select v-model="compareValue">
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
      </select>
    </div>

    <div class="col">
      <h3>Styled select</h3>
      <span class="select-wrap">
        <select v-model="compareValue" class="styled-select">
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </span>
    </div>
  </div>

  <p class="note">Same <code>v-model</code>, same options — only the CSS differs.</p>

  <h3 class="examples-heading">More examples</h3>

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
      Status
      <span class="select-wrap status-wrap" :class="`status-${status}`">
        <select v-model="status" class="styled-select status-select">
          <option value="todo">To do</option>
          <option value="in-progress">In progress</option>
          <option value="blocked">Blocked</option>
          <option value="done">Done</option>
        </select>
      </span>
    </label>

    <label class="field">
      Country
      <span class="select-wrap">
        <select v-model="country" class="styled-select">
          <option value="" disabled>Choose one</option>
          <optgroup label="Europe">
            <option value="ro">Romania</option>
            <option value="de">Germany</option>
            <option value="fr">France</option>
          </optgroup>
          <optgroup label="Asia">
            <option value="jp">Japan</option>
            <option value="kr">South Korea</option>
          </optgroup>
          <optgroup label="Americas">
            <option value="us">United States</option>
            <option value="br">Brazil</option>
          </optgroup>
        </select>
      </span>
    </label>
  </div>

  <p class="note">
    Selected: <strong>{{ size }}</strong>, <strong>{{ status }}</strong>{{ country ? `, ${country}` : '' }}
  </p>

  <p class="explainer">
    The status select shows a common real-world pattern: a colored dot baked into the wrapper
    that reflects the current value, so the field communicates state at a glance without
    needing custom-drawn options. The country select uses native <code>&lt;optgroup&gt;</code>
    to bucket a long list — still just a plain <code>&lt;select&gt;</code>, no JS required.
  </p>

  <p class="explainer">
    Note the ceiling of this technique: once the dropdown is open, that popup is rendered by the
    browser, not by your CSS. You can set <code>option</code> and <code>optgroup</code> colors,
    but the hover/selected-row highlight is UA-controlled — in Chromium it stays a plain gray, no
    matter what you set. Restyling that highlight is exactly what
    <code>appearance: base-select</code> is for.
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
}

/* status dot: a colored circle layered in alongside the arrow */
.status-wrap::before {
  content: '';
  position: absolute;
  left: 0.65rem;
  top: 50%;
  translate: 0 -50%;
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background: var(--status-color);
  pointer-events: none;
}</code></pre>
</template>

<style scoped>
.compare {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-block-end: 1rem;
}

@media (max-width: 640px) {
  .compare {
    grid-template-columns: 1fr;
  }
}

.col h3 {
  font-size: 0.95rem;
  margin-block: 0 0.5rem;
}

.col select {
  width: 100%;
}

.examples-heading {
  font-size: 0.95rem;
  margin-block: 1.5rem 0.75rem;
}

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

.styled-select option,
.styled-select optgroup {
  color: CanvasText;
  background-color: Canvas;
}

.styled-select optgroup {
  font-style: normal;
  font-weight: 600;
}

.styled-select:hover {
  background: var(--surface-hover);
}

.styled-select:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* Hide Firefox's internal focus dotted-line in the option list. */
.styled-select:-moz-focusring {
  color: transparent;
  text-shadow: 0 0 0 currentColor;
}

.status-wrap {
  --status-color: var(--border-strong);
}

.status-wrap.status-todo {
  --status-color: #9ca3af;
}

.status-wrap.status-in-progress {
  --status-color: #3b82f6;
}

.status-wrap.status-blocked {
  --status-color: #ef4444;
}

.status-wrap.status-done {
  --status-color: #22c55e;
}

.status-wrap::before {
  content: '';
  position: absolute;
  left: 0.65rem;
  top: 50%;
  translate: 0 -50%;
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background: var(--status-color);
  pointer-events: none;
}

.status-select {
  padding-left: 1.65rem;
}

.note {
  color: color-mix(in srgb, currentColor 65%, transparent);
  font-size: 0.9em;
}

.explainer {
  font-size: 0.9em;
  margin-block-end: 1.25rem;
}
</style>
