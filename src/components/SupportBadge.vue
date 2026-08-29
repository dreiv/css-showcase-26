<script setup lang="ts">
defineProps<{
  /** Whether the feature was detected as supported in the current browser. */
  supported: boolean
  /** Short name of the feature, e.g. "animation-timeline: scroll()". */
  feature: string
}>()
</script>

<template>
  <p class="support-badge" :class="supported ? 'is-yes' : 'is-no'">
    <span class="dot" aria-hidden="true"></span>
    <span v-if="supported">
      <strong>Supported in this browser</strong> — <code>{{ feature }}</code> is live below, not
      simulated.
    </span>
    <span v-else>
      <strong>Not supported in this browser</strong> — <code>{{ feature }}</code> was
      feature-detected as missing, so the demo below shows its fallback behavior instead.
    </span>
  </p>
</template>

<style scoped>
.support-badge {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  border-radius: var(--radius);
  padding: 0.6rem 0.9rem;
  margin-block-end: 1.25rem;
  font-size: 0.85em;
  border: 1px solid var(--border-strong);
}

.dot {
  flex: none;
  inline-size: 0.6rem;
  block-size: 0.6rem;
  border-radius: 50%;
  margin-block-start: 0.35em;
}

.is-yes {
  background: color-mix(in srgb, #2fa84f 12%, var(--surface));
  border-color: color-mix(in srgb, #2fa84f 45%, var(--border-strong));
}

.is-yes .dot {
  background: #2fa84f;
}

.is-no {
  background: color-mix(in srgb, #e6a935 12%, var(--surface));
  border-color: color-mix(in srgb, #e6a935 45%, var(--border-strong));
}

.is-no .dot {
  background: #e6a935;
}

.support-badge code {
  font-size: 0.95em;
}
</style>
