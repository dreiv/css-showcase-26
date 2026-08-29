<script setup lang="ts">
import { computed, ref } from 'vue'
import SupportBadge from '@/components/SupportBadge.vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const IteratorCtor = (globalThis as any).Iterator
const hasIteratorHelpers =
  typeof IteratorCtor !== 'undefined' && typeof IteratorCtor.prototype?.map === 'function'

// Infinite generator — stays lazy, so this never fully evaluates.
function* naturals() {
  let n = 1
  while (true) yield n++
}

const takeCount = ref(8)

const result = computed(() => {
  if (!hasIteratorHelpers) return []
  // Cast: TS's default lib doesn't ship the esnext.iterator types yet, so the
  // Iterator.prototype.map/filter/take declarations aren't visible here.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const naturalsIter = naturals() as any
  return naturalsIter
    .map((n: number) => n * n)
    .filter((n: number) => n % 2 === 0)
    .take(takeCount.value)
    .toArray()
})

// Manual, pre-Iterator-helpers version of the same computation, for comparison.
function manualVersion(limit: number) {
  const out: number[] = []
  let n = 1
  while (out.length < limit) {
    const squared = n * n
    if (squared % 2 === 0) out.push(squared)
    n++
  }
  return out
}

const manualResult = computed(() => manualVersion(takeCount.value))
</script>

<template>
  <h2>Iterator helpers</h2>
  <p class="description">
    <code>.map()</code>, <code>.filter()</code>, <code>.take()</code>, <code>.drop()</code> and
    friends, now built directly onto <code>Iterator.prototype</code> — so they work on
    <em>any</em> iterator, including infinite generators, staying fully lazy the whole way through.
    Nothing below ever builds an intermediate array; each value is pulled through the whole chain
    one at a time, only as far as <code>.take()</code> asks for.
  </p>

  <SupportBadge :supported="hasIteratorHelpers" feature="Iterator.prototype.map" />

  <div class="controls">
    <label>
      Take
      <input type="number" v-model.number="takeCount" min="1" max="30" />
      even squares from an infinite counter
    </label>
  </div>

  <div class="result-row">
    <span class="chip" v-for="n in hasIteratorHelpers ? result : manualResult" :key="n">{{
      n
      }}</span>
  </div>

  <pre><code>function* naturals() {
  let n = 1
  while (true) yield n++          // infinite — this never finishes on its own
}

const firstEightEvenSquares = naturals()
  .map(n =&gt; n * n)
  .filter(n =&gt; n % 2 === 0)
  .take(8)
  .toArray();
// -&gt; [4, 16, 36, 64, 100, 144, 196, 256]</code></pre>

  <h2>What this replaces</h2>
  <p class="description">
    Before iterator helpers, the same lazy computation meant a hand-written loop — correct, but it
    buries the "map, then filter, then take 8" intent inside imperative bookkeeping:
  </p>

  <pre><code>function manualVersion(limit) {
  const out = [];
  let n = 1;
  while (out.length &lt; limit) {
    const squared = n * n;
    if (squared % 2 === 0) out.push(squared);
    n++;
  }
  return out;
}</code></pre>

  <p class="description">
    Both versions above compute the identical sequence — <code>{{ manualResult.join(', ') }}</code>
    — the chained version just reads as what it's doing instead of how.
  </p>

  <p class="support-note">
    Baseline newly available across Chrome, Edge, Firefox and Safari as of 2025 — one of the
    quieter, more solidly-shipped additions on this page precisely because it extends an existing
    prototype rather than introducing new syntax. Worth reaching for whenever you're chaining
    <code>Array.from(iterable).map().filter()</code> today: skip the intermediate array entirely.
  </p>
</template>

<style scoped>
h2:not(:first-child) {
  margin-block-start: 2rem;
}

.controls {
  margin-block-end: 1.25rem;
}

.controls label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  font-size: 0.9em;
}

.controls input {
  width: 4.5rem;
}

.result-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-block-end: 1.5rem;
}

.chip {
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  padding: 0.3rem 0.75rem;
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 0.85em;
  background: var(--surface);
}

.support-note {
  color: color-mix(in srgb, currentColor 65%, transparent);
  font-size: 0.85em;
}
</style>
