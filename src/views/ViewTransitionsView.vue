<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue'
import SupportBadge from '@/components/SupportBadge.vue'

const hasViewTransitions = typeof document !== 'undefined' && 'startViewTransition' in document
const doc = document as any

type Layout = 'grid' | 'list'
const layout = ref<Layout>('grid')

interface Item {
  id: number
  title: string
  category: string
  price: string
  color: string
}

const items: Item[] = [
  { id: 1, title: 'Wireless Earbuds', category: 'Audio', price: '$129', color: '#3562e6' },
  { id: 2, title: 'Cast Iron Skillet', category: 'Kitchen', price: '$58', color: '#e63562' },
  { id: 3, title: 'Standing Desk', category: 'Furniture', price: '$399', color: '#2fa84f' },
  { id: 4, title: 'Yoga Mat', category: 'Fitness', price: '$32', color: '#e6a935' },
  { id: 5, title: 'Atomic Habits', category: 'Books', price: '$16', color: '#7c3aed' },
  { id: 6, title: 'Puzzle 1000pc', category: 'Toys', price: '$24', color: '#0ea5a5' },
]

function thumbBackground(color: string) {
  return `linear-gradient(160deg, ${color}, color-mix(in srgb, ${color} 55%, black))`
}

// Real DOM nodes, keyed by item id. view-transition-name must be set/removed
// imperatively, scoped to only the elements in the running transition: a name
// left on an element outside the transition still gets its own
// ::view-transition-group, which paints above the root snapshot (backdrop
// included) regardless of z-index — that's why permanently-named cards used to
// float above the dialog.
const itemEls = new Map<number, HTMLElement>()
const thumbEls = new Map<number, HTMLElement>()

function setItemEl(id: number, el: Element | null) {
  if (el) itemEls.set(id, el as HTMLElement)
}
function setThumbEl(id: number, el: Element | null) {
  if (el) thumbEls.set(id, el as HTMLElement)
}

function setLayout(next: Layout) {
  if (layout.value === next) return
  if (!hasViewTransitions) {
    layout.value = next
    return
  }
  // Name every card + thumb so both morph together instead of the thumb
  // gliding to its new spot while the label/border snap into place.
  for (const item of items) {
    itemEls.get(item.id)?.style.setProperty('view-transition-name', `item-${item.id}`)
    thumbEls.get(item.id)?.style.setProperty('view-transition-name', `card-${item.id}`)
  }
  const transition = doc.startViewTransition(() => {
    layout.value = next
  })
  // Clear the names once the animation finishes, or they'd still be set the
  // next time a modal opens and collide with 'detail-thumb' below.
  transition.finished.finally(() => {
    for (const item of items) {
      itemEls.get(item.id)?.style.removeProperty('view-transition-name')
      thumbEls.get(item.id)?.style.removeProperty('view-transition-name')
    }
  })
}

const selectedId = ref<number | null>(null)
const detailDialog = useTemplateRef<HTMLDialogElement>('detailDialog')

function openDetail(id: number) {
  if (!hasViewTransitions) {
    selectedId.value = id
    nextTick(() => detailDialog.value?.showModal())
    return
  }
  // Only the clicked thumbnail gets a name. Every other card stays unnamed,
  // so it's just ordinary content in the root cross-fade and gets dimmed by
  // the backdrop like everything else instead of floating above it.
  const sourceThumb = thumbEls.get(id)
  sourceThumb?.style.setProperty('view-transition-name', 'detail-thumb')
  doc.startViewTransition(async () => {
    selectedId.value = id
    await nextTick()
    detailDialog.value?.showModal()
    // Hand the name off to the dialog's own thumb (in the template below)
    // before this "after" snapshot is taken. Two elements sharing one
    // view-transition-name at once makes the browser drop the transition.
    sourceThumb?.style.removeProperty('view-transition-name')
  })
}

function closeDetail() {
  const id = selectedId.value
  if (!hasViewTransitions) {
    detailDialog.value?.close()
    selectedId.value = null
    return
  }
  const transition = doc.startViewTransition(async () => {
    detailDialog.value?.close()
    selectedId.value = null
    await nextTick()
    // Hand the name back to the grid thumbnail so it morphs into place.
    if (id !== null) thumbEls.get(id)?.style.setProperty('view-transition-name', 'detail-thumb')
  })
  transition.finished.finally(() => {
    if (id !== null) thumbEls.get(id)?.style.removeProperty('view-transition-name')
  })
}

function onCancel(event: Event) {
  event.preventDefault()
  closeDetail()
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
    <button v-for="item in items" :key="item.id" type="button" class="item" :ref="(el) => setItemEl(item.id, el)"
      :style="{ '--accent': item.color }" @click="openDetail(item.id)">
      <span class="thumb" :ref="(el) => setThumbEl(item.id, el)"
        :style="{ background: thumbBackground(item.color) }"></span>
      <span class="body">
        <span class="category">{{ item.category }}</span>
        <span class="title">{{ item.title }}</span>
        <span class="price">{{ item.price }}</span>
      </span>
    </button>
  </div>

  <pre><code>function setLayout(next) {
  const apply = () => { layout.value = next }

  if (document.startViewTransition) {
    document.startViewTransition(apply)
  } else {
    apply()
  }
}</code></pre>

  <p class="description">
    Only naming the thumbnail was the bug: it glides smoothly to its new spot while the border,
    category, title and price around it — never named — just snap into place, so the two pieces
    visibly fall out of step. Fix: give <em>every</em> card its own <code>view-transition-name</code>
    too, then use <code>view-transition-class</code> to give the card group and the thumb group the
    same duration and easing with one rule, instead of one selector per card id.
  </p>

  <pre><code>.item  { view-transition-class: showcase-morph; } /* whole card */
.thumb { view-transition-class: showcase-morph; } /* its image  */

html::view-transition-group(.showcase-morph) {
  animation-duration: 0.4s;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}</code></pre>

  <h2>Shared-element transition into a native dialog</h2>
  <p class="description">
    Click any card above — its thumbnail morphs straight into a native <code>&lt;dialog&gt;</code>.
    The clicked thumbnail gets <code>view-transition-name: detail-thumb</code> right before
    <code>startViewTransition()</code> is called, and the name is handed off to the dialog's own
    thumb — never held by both at once — before each snapshot is taken.
  </p>
  <p class="description">
    Earlier this demo bound <code>view-transition-name</code> reactively, permanently, to every
    card. That's harmless during the grid/list layout transition above, since every card actually
    moves. But during the dialog transition, only one thumbnail is meant to be involved — and a
    named element that isn't part of the transition still gets its own
    <code>::view-transition-group</code>, which paints above the root snapshot regardless of
    z-index. The other five thumbnails floated above the dimmed backdrop, uninvolved but still
    "in" the transition, and the dialog's own text — genuinely part of the root cross-fade — looked
    like it was popping in early because those stray images were animating in front of it. Fix:
    assign <code>view-transition-name</code> imperatively, only to the element(s) actually moving,
    and remove it once <code>transition.finished</code> resolves so it can't collide with the next
    transition.
  </p>

  <pre><code>function openDetail(id) {
  const sourceThumb = thumbEls.get(id)
  sourceThumb.style.setProperty('view-transition-name', 'detail-thumb')

  document.startViewTransition(async () => {
    selectedId.value = id
    await nextTick()
    dialog.showModal()
    // only one element may hold the name when this snapshot is taken
    sourceThumb.style.removeProperty('view-transition-name')
  })
}</code></pre>

  <dialog ref="detailDialog" class="detail-dialog" @click.self="closeDetail" @cancel="onCancel">
    <template v-if="selected()">
      <div class="thumb-wrap">
        <span class="thumb thumb--large" :style="{
          background: thumbBackground(selected()!.color),
          viewTransitionName: 'detail-thumb',
        }"></span>
        <button type="button" class="modal-close" @click="closeDetail" aria-label="Close">×</button>
      </div>
      <div class="detail-body">
        <span class="category">{{ selected()!.category }}</span>
        <h3>{{ selected()!.title }}</h3>
        <p class="price">{{ selected()!.price }}</p>
        <p>
          The thumbnail above and its originating card share one <code>view-transition-name</code>
          at a time, so the browser morphs position, size and aspect ratio between them instead of
          cross-fading two unrelated boxes. Closing works the same way whether you use the × button,
          click the backdrop, or press Escape — all three route through the same animated
          <code>closeDetail()</code>.
        </p>
        <button type="button" @click="closeDetail">Close</button>
      </div>
    </template>
  </dialog>

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
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.85rem;
  margin-block-end: 1.5rem;
}

.items--list {
  grid-template-columns: 1fr;
}

.item {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--surface);
  text-align: left;
  font: inherit;
  color: inherit;
  cursor: pointer;
  padding: 0;
  view-transition-class: showcase-morph;
}

.item:hover {
  border-color: var(--accent);
}

.thumb {
  display: block;
  inline-size: 100%;
  aspect-ratio: 16 / 10;
  view-transition-class: showcase-morph;
}

.body {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.65rem 0.8rem;
}

.items--list .item {
  flex-direction: row;
  align-items: center;
}

.items--list .thumb {
  inline-size: 4rem;
  aspect-ratio: 1;
  flex: none;
}

.items--list .body {
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.category {
  font-size: 0.72em;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: color-mix(in srgb, currentColor 60%, transparent);
}

.title {
  font-size: 0.9em;
}

.items--list .title {
  flex: 1;
}

.price {
  font-size: 0.85em;
  font-weight: 600;
}

.items--list .price {
  margin-inline-start: auto;
}

.detail-dialog {
  border: 1px solid var(--border-strong);
  border-radius: 1rem;
  padding: 0 1.6rem 1.4rem;
  width: min(90vw, 380px);
  background: canvas;
  color: inherit;
  box-shadow: 0 20px 60px rgb(0 0 0 / 25%);
}

.detail-dialog::backdrop {
  background: rgb(0 0 0 / 45%);
  backdrop-filter: blur(2px);
}

.thumb-wrap {
  position: relative;
  margin-inline: -1.6rem;
  margin-block-end: 0.9rem;
}

.thumb--large {
  inline-size: 100%;
  aspect-ratio: 16 / 9;
  border-start-start-radius: calc(1rem - 1px);
  border-start-end-radius: calc(1rem - 1px);
}

.modal-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 1;
  inline-size: 1.9rem;
  block-size: 1.9rem;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: color-mix(in srgb, canvas 70%, transparent);
  backdrop-filter: blur(4px);
  color: inherit;
  cursor: pointer;
  font-size: 0;
}

.modal-close::before,
.modal-close::after {
  content: '';
  position: absolute;
  inset: 0;
  margin: auto;
  width: 0.8rem;
  height: 1.5px;
  background: currentColor;
}

.modal-close::before {
  rotate: 45deg;
}

.modal-close::after {
  rotate: -45deg;
}

.modal-close:hover {
  background: color-mix(in srgb, canvas 90%, transparent);
}

.detail-body h3 {
  margin-block: 0 0.25rem;
}

.detail-body p {
  margin-block: 0 1rem;
  color: color-mix(in srgb, currentColor 70%, transparent);
  font-size: 0.9em;
}

.detail-body .price {
  color: inherit;
  font-size: 1em;
  margin-block-end: 0.5rem;
}

.support-note {
  color: color-mix(in srgb, currentColor 65%, transparent);
  font-size: 0.85em;
}

::view-transition-group(root),
html::view-transition-group(.showcase-morph),
html::view-transition-group(detail-thumb) {
  animation-duration: 0.4s;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

@media (prefers-reduced-motion: reduce) {

  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none !important;
  }
}
</style>
