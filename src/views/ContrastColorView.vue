<script setup lang="ts">
import { ref } from 'vue'
import SupportBadge from '@/components/SupportBadge.vue'

const hasContrastColor =
  typeof CSS !== 'undefined' && CSS.supports('color', 'contrast-color(white)')

const swatches = [
  '#3562e6',
  '#e63562',
  '#2fa84f',
  '#e6a935',
  '#111111',
  '#f5f5f0',
  '#7c3aed',
  '#0ea5a5',
]

const custom = ref('#3562e6')
</script>

<template>
  <h2><code>contrast-color()</code></h2>
  <p class="description">
    Pass any color in, get back whichever of black or white is more readable on top of it. No more
    maintaining a parallel "is this swatch dark or light" lookup table just to decide label color —
    the browser already knows.
  </p>

  <SupportBadge :supported="hasContrastColor" feature="contrast-color()" />

  <div class="swatch-grid">
    <div v-for="c in swatches" :key="c" class="swatch" :style="{ background: c, '--bg': c }">
      <span>{{ c }}</span>
    </div>
  </div>

  <pre><code>.swatch {
  background: var(--bg);
  color: contrast-color(var(--bg));
}</code></pre>

  <h2>Try your own color</h2>
  <p class="description">
    The label below is never explicitly styled dark or light — it's always
    <code>contrast-color()</code> of whatever the picker is set to.
  </p>

  <div class="picker-row">
    <input type="color" v-model="custom" aria-label="Pick a background color" />
    <div class="live-swatch" :style="{ background: custom, '--bg': custom }">
      <span>{{ custom }}</span>
    </div>
  </div>

  <p class="support-note">
    Correction to how this was originally described here: <code>contrast-color()</code> is not yet
    Baseline — it has "limited availability" per MDN, not universal support across all four
    browsers. The badge above reflects live detection in whatever browser opened this page, which is
    the accurate way to know, rather than trusting a written claim that goes stale. Feature- detect
    with <code>CSS.supports('color', 'contrast-color(white)')</code> and provide a static fallback
    color (as this page's own CSS does, via the plain-color swatch background) until it's universal.
  </p>
</template>

<style scoped>
h2:not(:first-child) {
  margin-block-start: 2rem;
}

.swatch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
  margin-block-end: 1.5rem;
}

.swatch {
  aspect-ratio: 4 / 3;
  border-radius: var(--radius);
  display: flex;
  align-items: flex-end;
  padding: 0.6rem;
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 0.8em;

  background: var(--bg);
  /* fallback for browsers without contrast-color(): a mid-brightness default that
     reads reasonably on both light and dark swatches. The line below overrides it
     wherever contrast-color() is valid — an invalid declaration is ignored, not applied,
     so unsupported browsers simply never see it and keep this fallback. */
  color: #fff;
  text-shadow: 0 1px 2px rgb(0 0 0 / 35%);
  /* the actual trick: derive readable text color from the background itself */
  color: contrast-color(var(--bg));
}

.picker-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-block-end: 1.5rem;
}

input[type='color'] {
  inline-size: 3rem;
  block-size: 2.4rem;
  padding: 0.2rem;
}

.live-swatch {
  flex: 1;
  min-width: 160px;
  border-radius: var(--radius);
  padding: 1rem 1.2rem;
  font-family: ui-monospace, Menlo, Consolas, monospace;

  background: var(--bg);
  color: #fff;
  text-shadow: 0 1px 2px rgb(0 0 0 / 35%);
  color: contrast-color(var(--bg));
}

.support-note {
  color: color-mix(in srgb, currentColor 65%, transparent);
  font-size: 0.85em;
}
</style>
