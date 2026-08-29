<script setup lang="ts">
import { ref } from 'vue'
import SupportBadge from '@/components/SupportBadge.vue'

const hasRelativeColor =
  typeof CSS !== 'undefined' && CSS.supports('color', 'oklch(from red l c h)')

const base = ref('#3562e6')

interface ScaleStep {
  label: string
  mult: number | null
}

const scaleSteps: ScaleStep[] = [
  { label: '50', mult: 1.7 },
  { label: '100', mult: 1.45 },
  { label: '200', mult: 1.25 },
  { label: '300', mult: 1.1 },
  { label: '400', mult: 1.02 },
  { label: '500', mult: null },
  { label: '600', mult: 0.85 },
  { label: '700', mult: 0.7 },
  { label: '800', mult: 0.55 },
  { label: '900', mult: 0.4 },
]

interface AccentStep {
  label: string
  shift: number
}

const accentSteps: AccentStep[] = [
  { label: 'Primary', shift: 0 },
  { label: 'Secondary', shift: 120 },
  { label: 'Tertiary', shift: -120 },
  { label: 'Complementary', shift: 180 },
]
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

  <div class="demo-root" :style="{ '--base': base }">
    <h2>A full shade scale from one token</h2>
    <p class="description">
      Design systems usually hand-author a 50–900 scale per color. Here every step is the same
      base color with only its lightness multiplied — pick a new base above and the whole scale
      updates.
    </p>

    <div class="scale-grid">
      <div v-for="s in scaleSteps" :key="s.label" class="scale-step" :class="{ 'scale-step--base': s.mult === null }"
        :style="s.mult !== null ? { '--mult': s.mult } : {}">
        <span>{{ s.label }}</span>
      </div>
    </div>

    <pre><code>.scale-step {
  background: oklch(from var(--base) calc(l * var(--mult, 1)) c h);
}</code></pre>

    <h2>Theme accents from one hue</h2>
    <p class="description">
      A secondary and tertiary accent, plus a complementary color for callouts — all rotated off
      the same base hue instead of picked separately and hoped to match.
    </p>

    <div class="accent-grid">
      <div v-for="a in accentSteps" :key="a.label" class="accent-chip" :style="{ '--shift': a.shift }">
        <span>{{ a.label }}</span>
        <code>h {{ a.shift >= 0 ? '+' : '' }}{{ a.shift }}</code>
      </div>
    </div>

    <pre><code>.accent-secondary { background: oklch(from var(--base) l c calc(h + 120)); }
.accent-tertiary { background: oklch(from var(--base) l c calc(h - 120)); }</code></pre>

    <h2>Button states, derived not duplicated</h2>
    <p class="description">
      One base color, no separate <code>--button-hover</code> / <code>--button-active</code>
      tokens to keep in sync. Hover and click the button below.
    </p>

    <div class="demo-button-row">
      <button type="button" class="demo-button">Save changes</button>
      <button type="button" class="demo-button" disabled>Disabled</button>
    </div>

    <pre><code>.demo-button:hover  { background: oklch(from var(--base) calc(l * 1.15) c h); }
.demo-button:active { background: oklch(from var(--base) calc(l * 0.85) c h); }
.demo-button:disabled {
  background: oklch(from var(--base) l calc(c * 0.2) h / 0.5);
}</code></pre>
  </div>

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

.scale-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(64px, 1fr));
  gap: 0.5rem;
  margin-block-end: 1.5rem;
}

.scale-step {
  aspect-ratio: 1;
  border-radius: var(--radius);
  border: 1px solid var(--border-strong);
  display: flex;
  align-items: flex-end;
  padding: 0.4rem;
  font-size: 0.75em;
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-weight: 600;

  background: oklch(from var(--base) calc(l * var(--mult, 1)) c h);
  color: contrast-color(oklch(from var(--base) calc(l * var(--mult, 1)) c h));
}

.scale-step--base {
  border-color: currentColor;
}

.accent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
  margin-block-end: 1.5rem;
}

.accent-chip {
  aspect-ratio: 4 / 3;
  border-radius: var(--radius);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 0.15rem;
  padding: 0.6rem;
  font-size: 0.8em;
  font-family: ui-monospace, Menlo, Consolas, monospace;

  background: oklch(from var(--base) l c calc(h + var(--shift)));
  color: contrast-color(oklch(from var(--base) l c calc(h + var(--shift))));
}

.accent-chip span {
  font-family: initial;
  font-size: 0.95em;
  font-weight: 600;
}

.demo-button-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-block-end: 1.5rem;
}

.demo-button {
  border: none;
  border-radius: var(--radius);
  padding: 0.65rem 1.4rem;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease;

  background: var(--base);
  color: contrast-color(var(--base));
}

.demo-button:hover:not(:disabled) {
  background: oklch(from var(--base) calc(l * 1.15) c h);
  color: contrast-color(oklch(from var(--base) calc(l * 1.15) c h));
}

.demo-button:active:not(:disabled) {
  background: oklch(from var(--base) calc(l * 0.85) c h);
  color: contrast-color(oklch(from var(--base) calc(l * 0.85) c h));
}

.demo-button:disabled {
  background: oklch(from var(--base) l calc(c * 0.2) h / 0.5);
  color: contrast-color(var(--base));
  cursor: not-allowed;
}

.support-note {
  color: color-mix(in srgb, currentColor 65%, transparent);
  font-size: 0.85em;
}
</style>
