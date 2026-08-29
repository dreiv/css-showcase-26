<script setup lang="ts">
// Top-level await makes this component async — it needs a <Suspense>
// boundary (provided by TopLevelAwaitView.vue).

function loadRemoteConfig(): Promise<{ theme: string; region: string; loadedAt: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        theme: 'auto',
        region: 'eu-central',
        loadedAt: new Date().toLocaleTimeString(),
      })
    }, 900)
  })
}

const config = await loadRemoteConfig()
</script>

<template>
  <div class="config-card">
    <p>
      Resolved at <strong>{{ config.loadedAt }}</strong> — this whole component didn't render until
      the <code>await</code> above finished.
    </p>
    <dl>
      <dt>theme</dt>
      <dd>{{ config.theme }}</dd>
      <dt>region</dt>
      <dd>{{ config.region }}</dd>
    </dl>
  </div>
</template>

<style scoped>
.config-card {
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  padding: 1rem 1.2rem;
  background: var(--surface);
}

.config-card p {
  margin-block: 0 0.75rem;
  font-size: 0.9em;
}

dl {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.3rem 0.75rem;
  margin: 0;
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 0.85em;
}

dt {
  color: color-mix(in srgb, currentColor 60%, transparent);
}

dd {
  margin: 0;
}
</style>
