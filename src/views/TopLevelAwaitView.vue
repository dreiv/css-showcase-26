<script setup lang="ts">
import { ref } from 'vue'
import TopLevelAwaitDemo from '@/components/TopLevelAwaitDemo.vue'

const remountKey = ref(0)
const elapsedMs = ref(0)
const lastResolvedMs = ref<number | null>(null)
let timer: ReturnType<typeof setInterval> | undefined

function onPending() {
  elapsedMs.value = 0
  lastResolvedMs.value = null
  timer = setInterval(() => {
    elapsedMs.value += 50
  }, 50)
}

function onResolve() {
  clearInterval(timer)
  lastResolvedMs.value = elapsedMs.value
}

function replay() {
  remountKey.value++
}
</script>

<template>
  <h2>Top-level <code>await</code></h2>
  <p class="description">
    Modules can <code>await</code> directly at the top level — no wrapping IIFE, no
    <code>.then()</code> chain. The component below genuinely does this: its
    <code>&lt;script setup&gt;</code> block has an <code>await</code> sitting outside any function,
    which makes the component itself async and requires the <code>&lt;Suspense&gt;</code> boundary
    wrapping it here. There's no support badge on this page — top-level await in ESM has been safe
    for years, so if it weren't working, the component below simply wouldn't render at all.
  </p>

  <div class="demo-row">
    <button type="button" @click="replay">Reload the demo (remount + re-await)</button>
    <span v-if="lastResolvedMs !== null" class="resolved-note">
      Resolved after <code>{{ lastResolvedMs }}ms</code>
    </span>
  </div>

  <Suspense :key="remountKey" @pending="onPending" @resolve="onResolve">
    <template #default>
      <TopLevelAwaitDemo />
    </template>
    <template #fallback>
      <div class="loading-card">
        <span class="spinner" aria-hidden="true"></span>
        Awaiting config… <code>{{ elapsedMs }}ms</code>
      </div>
    </template>
  </Suspense>

  <pre><code>// TopLevelAwaitDemo.vue &lt;script setup&gt;
    function loadRemoteConfig() {
    return new Promise((resolve) =&gt;
    setTimeout(() =&gt; resolve({ theme: 'auto', region: 'eu-central' }), 900)
    );
    }

    const config = await loadRemoteConfig(); // real top-level await
    // everything below this line only runs once the promise resolves</code></pre>

  <h2>Where this shows up outside components</h2>
  <p class="description">
    The same syntax is what makes conditional, environment-based imports possible at module load
    time — this project's own <code>router/index.ts</code> uses the related
    <code>import()</code> dynamic-import form for route-level code splitting; top-level await is
    what lets you <code>await</code> that promise directly in a module instead of only inside a
    function:
  </p>

  <pre><code>// config.js — pick an implementation before anything that imports this module runs
    const client = await (
    import.meta.env.MODE === 'test'
    ? import('./mock-client.js')
    : import('./real-client.js')
    );

    export default client;</code></pre>

  <p class="support-note">
    Top-level <code>await</code> in ES modules is Baseline widely available — safe everywhere, the
    least risky feature on this whole page. The dependency worth checking isn't the browser, it's
    your build tooling and module format: it only works in real ESM (<code>type="module"</code>, or
    a bundler targeting ESM output), not in CommonJS or classic scripts.
  </p>
</template>

<style scoped>
h2:not(:first-child) {
  margin-block-start: 2rem;
}

.demo-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-block-end: 1rem;
}

.resolved-note {
  font-size: 0.85em;
  color: color-mix(in srgb, currentColor 65%, transparent);
}

.loading-card {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border: 1px dashed var(--border-strong);
  border-radius: var(--radius);
  padding: 1rem 1.2rem;
  color: color-mix(in srgb, currentColor 65%, transparent);
  font-size: 0.9em;
}

.spinner {
  inline-size: 1rem;
  block-size: 1rem;
  border-radius: 50%;
  border: 2px solid var(--border-strong);
  border-top-color: currentColor;
  flex: none;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation: none;
  }
}

.support-note {
  color: color-mix(in srgb, currentColor 65%, transparent);
  font-size: 0.85em;
}
</style>
