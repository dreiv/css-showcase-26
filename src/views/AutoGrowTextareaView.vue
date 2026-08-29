<script setup lang="ts">
import { ref } from 'vue'
import SupportBadge from '@/components/SupportBadge.vue'

const hasFieldSizing = typeof CSS !== 'undefined' && CSS.supports('field-sizing', 'content')

const text = ref('Type here — the box grows with the content.\nTry pasting a few paragraphs in.')
</script>

<template>
  <h2>Auto-grow textarea</h2>
  <p class="description">
    The one-line solution: <code>field-sizing: content</code>. No JS resize listener, no hidden
    mirror &lt;div&gt; measuring scrollHeight — where it's supported.
  </p>

  <SupportBadge :supported="hasFieldSizing" feature="field-sizing: content" />

  <div class="compare">
    <div class="col">
      <h3>With <code>field-sizing: content</code></h3>
      <textarea v-model="text" class="auto-grow"></textarea>
    </div>

    <div class="col">
      <h3>Default textarea</h3>
      <textarea v-model="text" class="fixed"></textarea>
    </div>
  </div>

  <pre><code>textarea.auto-grow {
  field-sizing: content;
  min-height: 2.5lh;
  max-height: 12lh;
}</code></pre>

  <p class="support-note">
    <code>field-sizing</code> has "limited availability" per MDN — it is <strong>not</strong>
    Baseline. Chromium shipped it first; Firefox and Safari support is still catching up. The left
    column above only shows the effect if the badge reads "supported" — otherwise it's silently
    behaving like the plain textarea on the right, which is the safe, non-breaking way this feature
    fails: no error, no layout shift, just no auto-grow.
  </p>
</template>

<style scoped>
.compare {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-block-end: 1.5rem;
}

@media (max-width: 640px) {
  .compare {
    grid-template-columns: 1fr;
  }
}

h3 {
  font-size: 0.95rem;
  margin-block: 0 0.5rem;
}

textarea {
  width: 100%;
}

.auto-grow {
  field-sizing: content;
  min-height: 2.5lh;
  max-height: 12lh;
}

.fixed {
  height: 5lh;
  resize: vertical;
}

.support-note {
  color: color-mix(in srgb, currentColor 65%, transparent);
  font-size: 0.85em;
}
</style>
