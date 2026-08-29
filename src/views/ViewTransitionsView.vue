<script setup lang="ts">
import { ref } from 'vue'
import SupportBadge from '@/components/SupportBadge.vue'

const hasViewTransitions = typeof document !== 'undefined' && 'startViewTransition' in document

type Layout = 'grid' | 'list'
const layout = ref<Layout>('grid')

const items = [
  { id: 1, title: 'Wireless Earbuds', color: '#3562e6' },
  { id: 2, title: 'Cast Iron Skillet', color: '#e63562' },
  { id: 3, title: 'Standing Desk', color: '#2fa84f' },
  { id: 4, title: 'Yoga Mat', color: '#e6a935' },
  { id: 5, title: 'Atomic Habits', color: '#7c3aed' },
  { id: 6, title: 'Puzzle 1000pc', color: '#0ea5a5' },
]

function setLayout(next: Layout) {
  if (layout.value === next) return

  const apply = () => {
    layout.value = next
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc = document as any
  if (hasViewTransitions) {
    doc.startViewTransition(apply)
  } else {
    apply()
  }
}

const selectedId = ref<number | null>(null)

function openDetail(id: number) {
  const apply = () => {
    selectedId.value = id
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc = document as any
  if (hasViewTransitions) {
    doc.startViewTransition(apply)
  } else {
    apply()
  }
}

function closeDetail() {
  const apply = () => {
    selectedId.value = null
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc = document as any
  if (hasViewTransitions) {
    doc.startViewTransition(apply)
  } else {
    apply()
  }
}

const selected = () => items.find((i) => i.id === selectedId.value) ?? null
</script>

<template>
  <h2>View Transitions (same-document)</h2>
  <p class="description">
    <code>document.startViewTransition(callback)</code> takes a snapshot of the DOM, runs your state
    change, then cross-fades/morphs between the two snapshots automatically — no manual FLIP
    measuring, no animation library. Toggle the layout below; the same six cards animate between
    grid and list positions.
  </p>

  <SupportBadge :supported="hasViewTransitions" feature="document.startViewTransition()" />

  <div class="demo-row">
    <button type="button" :aria-pressed="layout === 'grid'" @click="setLayout('grid')">Grid</button>
    <button type="button" :aria-pressed="layout === 'list'" @click="setLayout('list')">List</button>
  </div>

  <div class="items" :class="layout === 'list' && 'items--list'">
    <button v-for="item in items" :key="item.id" type="button" class="item" :style="{
      '--accent': item.color,
      viewTransitionName: selectedId === item.id ? undefined : `card-${item.id}`,
    }" @click="openDetail(item.id)">
      <span class="swatch" :style="{ background: item.color }"></span>
      <span class="title">{{ item.title }}</span>
    </button>
  </div>

  <pre><code>function setLayout(next) {
  const apply = () => { layout.value = next }

  if (document.startViewTransition) {
    document.startViewTransition(apply)   // animates the diff for you
  } else {
    apply()                               // instant fallback, still correct
  }
}</code></pre>

  <h2>Shared-element transition</h2>
  <p class="description">
    Click any card above — it morphs into a detail panel using the same
    <code>view-transition-name</code>, the shared-element pattern this API was built for (the kind
    of effect that used to mean hand-animating a clone element between two states).
  </p>

  <div v-if="selected()" class="detail-overlay" @click.self="closeDetail">
    <div class="detail-card" :style="{ '--accent': selected()!.color, viewTransitionName: `card-${selected()!.id}` }">
      <span class="swatch swatch--large" :style="{ background: selected()!.color }"></span>
      <h3>{{ selected()!.title }}</h3>
      <p>
        This panel and its originating card share one <code>view-transition-name</code>, so the
        browser morphs position and size between them instead of cross-fading two unrelated boxes.
      </p>
      <button type="button" @click="closeDetail">Close</button>
    </div>
  </div>

  <p class="support-note">
    Same-document View Transitions have been Baseline since 2025 — genuinely safe to use, unlike
    most of the other newer additions on this page. Cross-document transitions (animating a full
    navigation between two separate pages, no SPA router involved) are a related but separate
    feature still rolling out across engines via Interop 2026 — don't assume support for one implies
    the other.
  </p>
</template>

<style scoped>
h2:not(:first-child) {
  margin-block-start: 2rem;
}

.demo-row {
  display: flex;
  gap: 0.6rem;
  margin-block-end: 1.25rem;
}

.demo-row button[aria-pressed='true'] {
  background: var(--accent, var(--surface-hover));
  border-color: var(--accent, var(--border-strong));
  color: contrast-color(var(--accent, canvas));
}

.items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.85rem;
  margin-block-end: 1.5rem;
}

.items--list {
  grid-template-columns: 1fr;
}

.item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  padding: 0.75rem;
  background: var(--surface);
  text-align: left;
  font: inherit;
  color: inherit;
  cursor: pointer;
}

.items--list .item {
  flex-direction: row;
}

.items:not(.items--list) .item {
  flex-direction: column;
  align-items: flex-start;
}

.item:hover {
  background: var(--surface-hover);
  border-color: var(--accent);
}

.swatch {
  inline-size: 2.25rem;
  block-size: 2.25rem;
  border-radius: calc(var(--radius) - 2px);
  flex: none;
}

.swatch--large {
  inline-size: 4rem;
  block-size: 4rem;
  border-radius: var(--radius);
  margin-block-end: 0.75rem;
}

.title {
  font-size: 0.9em;
}

.detail-overlay {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 45%);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 10;
}

.detail-card {
  width: min(90vw, 380px);
  border: 1px solid var(--border-strong);
  border-radius: 1rem;
  padding: 1.5rem;
  background: canvas;
  color: inherit;
  box-shadow: 0 20px 60px rgb(0 0 0 / 25%);
}

.detail-card h3 {
  margin-block: 0 0.5rem;
}

.detail-card p {
  margin-block: 0 1rem;
  color: color-mix(in srgb, currentColor 70%, transparent);
  font-size: 0.9em;
}

.support-note {
  color: color-mix(in srgb, currentColor 65%, transparent);
  font-size: 0.85em;
}

@media (prefers-reduced-motion: reduce) {

  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none !important;
  }
}
</style>
