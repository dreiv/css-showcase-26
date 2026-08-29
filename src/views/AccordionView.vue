<script setup lang="ts">
import SupportBadge from '@/components/SupportBadge.vue'

const hasDetailsContent = typeof CSS !== 'undefined' && CSS.supports('selector(::details-content)')

const items = [
  {
    q: 'Does this need any JavaScript?',
    a: 'No. The open/close state, the arrow rotation and the height animation are all handled by the browser — this component has an empty <script> block.',
  },
  {
    q: 'How does the height animation work?',
    a: 'The collapsible region (::details-content) is set to display: grid with grid-template-rows: 0fr, which animates to 1fr when open. Animating a grid track is what lets "height: auto" content transition smoothly — no JS measuring of scrollHeight involved.',
  },
  {
    q: 'What happens in a browser without support?',
    a: '::details-content is Chromium-only right now. Elsewhere it just falls back to the plain native <details> snap open/close — you lose the animation, not the functionality.',
  },
]
</script>

<template>
  <h2>Pure CSS accordion</h2>
  <p class="description">
    Built entirely from <code>&lt;details&gt;</code> / <code>&lt;summary&gt;</code>. The animated
    expand/collapse comes from <code>::details-content { grid-template-rows: 0fr → 1fr }</code> — no
    JS.
  </p>

  <SupportBadge :supported="hasDetailsContent" feature="::details-content" />

  <div class="accordion">
    <details v-for="(item, i) in items" :key="item.q" class="accordion-item" :open="i === 0">
      <summary class="summary">
        <span class="nr">{{ String(i + 1).padStart(2, '0') }}</span>
        {{ item.q }}
      </summary>
      <div class="clip">
        <p>{{ item.a }}</p>
      </div>
    </details>
  </div>
</template>

<style scoped>
.accordion {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.accordion-item {
  border: 1px solid var(--border-strong);
  border-radius: 1rem;
  padding: 1.1rem 1.4rem;
}

.summary {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  cursor: pointer;
  font-weight: 600;
  list-style: none;
}

.summary::-webkit-details-marker {
  display: none;
}

.summary::after {
  content: '⌄';
  margin-inline-start: auto;
  font-size: 1.1em;
  transition: rotate 0.25s ease;
}

.accordion-item[open] .summary::after {
  rotate: 180deg;
}

.nr {
  color: var(--accent);
}

/* the collapsible region fades and slides in as it opens */
.clip {
  overflow: hidden;
  min-height: 0;
  opacity: 0;
  translate: 0 0.6rem;
  transition:
    opacity 0.35s 0.05s ease,
    translate 0.35s 0.05s ease;
}

.clip > p {
  margin: 0;
  padding-block-start: 0.85rem;
  color: color-mix(in srgb, currentColor 70%, transparent);
}

.accordion-item[open] .clip {
  opacity: 1;
  translate: none;
}

/* --- the actual trick: animate a grid track instead of height --- */
.accordion-item::details-content {
  display: grid;
  grid-template-rows: 0fr;
  content-visibility: hidden;
  transition:
    grid-template-rows 0.35s ease,
    content-visibility 0.35s allow-discrete;
}

.accordion-item[open]::details-content {
  grid-template-rows: 1fr;
  content-visibility: visible;
}
</style>
