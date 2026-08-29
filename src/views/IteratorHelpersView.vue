<script setup lang="ts">
import { computed, ref } from 'vue'
import SupportBadge from '@/components/SupportBadge.vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const IteratorCtor = (globalThis as any).Iterator
const hasIteratorHelpers =
  typeof IteratorCtor !== 'undefined' && typeof IteratorCtor.prototype?.map === 'function'

const takeCount = ref(8)

const helperResult = computed(() => {
  if (!hasIteratorHelpers) return []
  function* naturals() {
    let n = 1
    while (true) yield n++
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const naturalsIter = naturals() as any
  return naturalsIter
    .map((n: number) => n * n)
    .filter((n: number) => n % 2 === 0)
    .take(takeCount.value)
    .toArray()
})

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

const candidatesChecked = computed(() => {
  let n = 0
  let found = 0
  while (found < takeCount.value) {
    n++
    if ((n * n) % 2 === 0) found++
  }
  return n
})
</script>

<template>
  <h2>Iterator helpers</h2>
  <p class="description">
    <code>.map()</code>, <code>.filter()</code>, <code>.take()</code>, <code>.drop()</code> and
    friends, now built directly onto <code>Iterator.prototype</code> — so they work on
    <em>any</em> iterator, including infinite generators, staying fully lazy the whole way through.
  </p>

  <SupportBadge :supported="hasIteratorHelpers" feature="Iterator.prototype.map" />

  <div class="controls">
    <label>
      Take
      <input type="number" v-model.number="takeCount" min="1" max="30" />
      even squares from an infinite counter
    </label>
  </div>

  <p class="lazy-note">
    Checked <strong>{{ candidatesChecked }}</strong> numbers from an infinite generator to find
    those <strong>{{ takeCount }}</strong> — not one more. Move the slider and watch that number
    change; neither version below ever materializes the full range.
  </p>

  <div class="comparison">
    <div class="approach">
      <span class="approach-label">Iterator helpers</span>
      <div class="result-row">
        <template v-if="hasIteratorHelpers">
          <span class="chip" v-for="n in helperResult" :key="n">{{ n }}</span>
        </template>
        <span v-else class="chip chip--muted">Unsupported in this browser — see manual version below</span>
      </div>
    </div>

    <div class="approach">
      <span class="approach-label">Manual loop (what you'd write without them)</span>
      <div class="result-row">
        <span class="chip chip--muted" v-for="n in manualResult" :key="n">{{ n }}</span>
      </div>
    </div>
  </div>

  <pre><code>function* naturals() {
    let n = 1
    while (true) yield n++ // infinite — never finishes on its own
    }

    naturals()
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
  margin-block-end: 1rem;
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

.lazy-note {
  font-size: 0.85em;
  color: color-mix(in srgb, currentColor 70%, transparent);
  margin-block-end: 1.25rem;
}

.comparison {
  display: grid;
  gap: 1rem;
  margin-block-end: 1.5rem;
}

.approach {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.approach-label {
  font-size: 0.85em;
  font-weight: 600;
  color: color-mix(in srgb, currentColor 75%, transparent);
}

.result-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chip {
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  padding: 0.3rem 0.75rem;
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 0.85em;
  background: var(--surface);
}

.chip--muted {
  opacity: 0.6;
}

.support-note {
  color: color-mix(in srgb, currentColor 65%, transparent);
  font-size: 0.85em;
}
</style>
