<script setup lang="ts">
import { ref } from 'vue'
import SupportBadge from '@/components/SupportBadge.vue'

const hasRelativeColor =
  typeof CSS !== 'undefined' && CSS.supports('color', 'oklch(from red l c h)')

const base = ref('#3562e6')
</script>

<template>
  <h2>Relative color syntax</h2>
  <p class="description">
    <code>oklch(from var(--base) ...)</code> reads a color's own channels and derives a new one from
    them — a tint, a shade, a desaturated variant — without a preprocessor, a JS color library, or
    hand-maintaining five extra custom properties per color token.
  </p>

  <SupportBadge :supported="hasRelativeColor" feature="oklch(from ...)" />

  <div class="picker-row">
    <label>
      Base color
      <input type="color" v-model="base" aria-label="Pick a base color" />
    </label>
  </div>

  <div class="ramp" :style="{ '--base': base }">
    <div class="chip chip--l20">
      <span>lighter</span>
      <code>l + 0.2</code>
    </div>
    <div class="chip chip--base">
      <span>base</span>
      <code>{{ base }}</code>
    </div>
    <div class="chip chip--l-20">
      <span>darker</span>
      <code>l − 0.2</code>
    </div>
    <div class="chip chip--desat">
      <span>desaturated</span>
      <code>c × 0.25</code>
    </div>
    <div class="chip chip--alpha">
      <span>50% alpha</span>
      <code>alpha 0.5</code>
    </div>
  </div>

  <pre><code>.chip--l20 {
  background: oklch(from var(--base) calc(l + 0.2) c h);
}
.chip--l-20 {
  background: oklch(from var(--base) calc(l - 0.2) c h);
}
.chip--desat {
  background: oklch(from var(--base) l calc(c * 0.25) h);
}
.chip--alpha {
  background: oklch(from var(--base) l c h / 0.5);
}</code></pre>

  <h2>Why this beats <code>color-mix()</code> for tints/shades</h2>
  <p class="description">
    <code>color-mix()</code> (used throughout this project's own UI, see <code>--surface</code> and
    <code>--border</code> in <code>main.css</code>) blends two colors together — great for "20% of
    this color over the current background." Relative color syntax instead reaches <em>inside</em> a
    single color's own lightness/chroma/hue channels, which is the right tool when you want "this
    exact hue, just lighter" rather than "this color mixed with something else."
  </p>

  <p class="support-note">
    Relative color syntax is Baseline newly available — solidly supported in Chrome, Edge and
    Safari; Firefox shipped it behind version gating and has since caught up in current stable
    releases. The badge above still checks live rather than trusting that summary, since exact
    per-browser rollout timing is easy to get wrong (as the Temporal and contrast-color() pages
    elsewhere in this project found out the hard way).
  </p>
</template>

<style scoped>
h2:not(:first-child) {
  margin-block-start: 2rem;
}

.picker-row {
  margin-block-end: 1.25rem;
}

.picker-row label {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.9em;
}

input[type='color'] {
  inline-size: 3rem;
  block-size: 2.4rem;
  padding: 0.2rem;
}

.ramp {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 0.75rem;
  margin-block-end: 1.5rem;
}

.chip {
  aspect-ratio: 1;
  border-radius: var(--radius);
  border: 1px solid var(--border-strong);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 0.15rem;
  padding: 0.6rem;
  font-size: 0.75em;
  font-family: ui-monospace, Menlo, Consolas, monospace;
}

.chip span {
  font-family: initial;
  font-size: 0.9em;
  font-weight: 600;
}

.chip--l20 {
  background: oklch(from var(--base) calc(l + 0.2) c h);
  color: contrast-color(oklch(from var(--base) calc(l + 0.2) c h));
}

.chip--base {
  background: var(--base);
  color: contrast-color(var(--base));
}

.chip--l-20 {
  background: oklch(from var(--base) calc(l - 0.2) c h);
  color: contrast-color(oklch(from var(--base) calc(l - 0.2) c h));
}

.chip--desat {
  background: oklch(from var(--base) l calc(c * 0.25) h);
  color: contrast-color(oklch(from var(--base) l calc(c * 0.25) h));
}

.chip--alpha {
  background: oklch(from var(--base) l c h / 0.5);
  color: contrast-color(var(--base));
}

.support-note {
  color: color-mix(in srgb, currentColor 65%, transparent);
  font-size: 0.85em;
}
</style>
