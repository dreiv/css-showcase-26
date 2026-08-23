<script setup lang="ts">
import { ref, computed } from 'vue'

// --- draggable anchor element ---
// Plain pointer events moving a position: absolute box around the demo area.
// The box itself carries `anchor-name`, so the panel just keeps following it —
// no re-anchoring logic needed on drag.
const box = ref<HTMLElement | null>(null)
const pos = ref({ x: 40, y: 40 })
const dragging = ref(false)
let offset = { x: 0, y: 0 }
let dragStart = { x: 0, y: 0 }

function startDrag(e: PointerEvent) {
  if (!box.value) return
  dragging.value = true
  dragStart = { x: e.clientX, y: e.clientY }
  const rect = box.value.getBoundingClientRect()
  offset = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  box.value.setPointerCapture(e.pointerId)
}

function onDrag(e: PointerEvent) {
  if (!dragging.value || !box.value) return
  const parent = box.value.parentElement as HTMLElement
  const parentRect = parent.getBoundingClientRect()
  const x = e.clientX - parentRect.left - offset.x
  const y = e.clientY - parentRect.top - offset.y
  const maxX = parentRect.width - box.value.offsetWidth
  const maxY = parentRect.height - box.value.offsetHeight
  pos.value = { x: Math.min(Math.max(x, 0), maxX), y: Math.min(Math.max(y, 0), maxY) }
}

function stopDrag(e: PointerEvent) {
  dragging.value = false
  // a "drag" that barely moved is a click — toggle the panel instead of
  // requiring a separate button
  const moved = Math.hypot(e.clientX - dragStart.x, e.clientY - dragStart.y)
  if (moved < 5) open.value = !open.value
}

// --- open state ---
// Not a native `popover` here on purpose: top-layer elements always position
// against the viewport, so they'd happily render outside the demo box.
// A plain absolutely-positioned element anchored inside the same
// `position: relative` box instead uses *that box* as its containing block —
// position-try-fallbacks computes its available space against the box, and
// `overflow: clip` on the box is the hard backstop, exactly like the
// tooltip demo on the position-try-fallbacks page.
const open = ref(true)

// --- preferred position select ---
type Placement = 'top' | 'right' | 'bottom' | 'left' | 'top-start' | 'bottom-end'

const placements: { value: Placement; label: string }[] = [
  { value: 'top', label: 'Top, centered' },
  { value: 'right', label: 'Right, centered' },
  { value: 'bottom', label: 'Bottom, centered' },
  { value: 'left', label: 'Left, centered' },
  { value: 'top-start', label: 'Top, start-aligned' },
  { value: 'bottom-end', label: 'Bottom, end-aligned' },
]

const placement = ref<Placement>('bottom')

const anchorStyle = computed(() => ({
  left: `${pos.value.x}px`,
  top: `${pos.value.y}px`,
}))
</script>

<template>
  <h2>Popover playground</h2>
  <p class="description">
    Drag the anchor button around the box (a quick click toggles the panel), then change its
    preferred side. Positioning is pure CSS via <code>anchor-name</code> /
    <code>position-anchor</code> — dragging only moves the anchor's <code>left</code>/<code>top</code>, the panel
    re-reads its geometry for free. The box's border is a hard limit here: this uses
    a plain anchor-positioned element inside the box's own containing block (like the tooltip demo
    on the position-try-fallbacks page) rather than the native <code>popover</code> API, which
    promotes to the top layer and would ignore the box's <code>overflow: clip</code> entirely.
    <code>position-try-fallbacks</code> flips the panel back inside the box whenever the preferred
    side would push it past an edge.
  </p>

  <div class="controls">
    <label class="field">
      Preferred position
      <span class="select-wrap">
        <select v-model="placement" class="styled-select">
          <option v-for="p in placements" :key="p.value" :value="p.value">{{ p.label }}</option>
        </select>
      </span>
    </label>
    <p class="hint">Drag the blue button, or click it to toggle the panel.</p>
  </div>

  <div class="demo-box">
    <button ref="box" type="button" class="anchor-btn" :style="anchorStyle" :aria-expanded="open"
      @pointerdown="startDrag" @pointermove="onDrag" @pointerup="stopDrag" @pointercancel="dragging = false">
      Drag me
    </button>

    <div class="playground-panel" :class="[`placement-${placement}`, { 'is-open': open }]">
      <p>I'm anchored to the button, and clipped to this box.</p>
      <p class="mini">Preferred side: <strong>{{ placement }}</strong></p>
    </div>
  </div>

  <pre><code>.demo-box {
  position: relative;
  overflow: clip; /* the hard backstop */
}

.anchor-btn { anchor-name: --pg-anchor; }

.playground-panel {
  position: absolute; /* NOT a native popover — stays in .demo-box's
                          containing block instead of the top layer */
  position-anchor: --pg-anchor;
  position-try-fallbacks: flip-block, flip-inline;
}

/* one declaration set swapped per &lt;select&gt; value */
.placement-bottom {
  top: anchor(bottom);
  left: anchor(center);
  translate: -50% 0.6rem;
}
.placement-top-start {
  bottom: anchor(top);
  left: anchor(start);
  translate: 0 -0.6rem;
}</code></pre>
</template>

<style scoped>
.controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-block-end: 1.25rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.9em;
  font-weight: 600;
}

.hint {
  margin: 0;
  color: color-mix(in srgb, currentColor 65%, transparent);
  font-size: 0.85em;
}

.select-wrap {
  position: relative;
  display: inline-block;
}

.select-wrap::after {
  content: '';
  position: absolute;
  right: 0.75rem;
  top: 50%;
  translate: 0 -50%;
  width: 0.6rem;
  height: 0.6rem;
  background: currentColor;
  opacity: 0.6;
  pointer-events: none;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center / contain no-repeat;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center / contain no-repeat;
}

.styled-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  font: inherit;
  color: inherit;
  background: canvas;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  padding: 0.45rem 2.1rem 0.45rem 0.75rem;
  min-width: 12rem;
  cursor: pointer;
  color-scheme: light dark;
}

.styled-select:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* position: relative + overflow: clip is what turns the box's own edges
   into the boundary for the anchor-positioned panel inside it — same
   pattern as .demo-box on the position-try-fallbacks page. */
.demo-box {
  position: relative;
  overflow: clip;
  height: 320px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  margin-block-end: 1.5rem;
  background:
    linear-gradient(90deg, var(--border) 1px, transparent 1px) 0 0 / 24px 24px,
    linear-gradient(var(--border) 1px, transparent 1px) 0 0 / 24px 24px;
}

.anchor-btn {
  position: absolute;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: var(--radius);
  padding: 0.5rem 0.9rem;
  cursor: grab;
  touch-action: none;
  user-select: none;
  box-shadow: 0 4px 14px rgb(0 0 0 / 20%);
}

.anchor-btn:active {
  cursor: grabbing;
}

/* --- the panel itself --- */
.playground-panel {
  margin: 0;
  width: max-content;
  max-width: 220px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  padding: 0.7rem 0.9rem;
  background: canvas;
  color: inherit;
  font-size: 0.85em;
  box-shadow: 0 8px 24px rgb(0 0 0 / 18%);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.18s ease;
}

.playground-panel.is-open {
  opacity: 1;
  pointer-events: auto;
}

.playground-panel p {
  margin: 0;
}

.playground-panel .mini {
  margin-block-start: 0.35rem;
  color: color-mix(in srgb, currentColor 65%, transparent);
}

/* --- anchor positioning, one variant per <select> value --- */
@supports (anchor-name: --a) {
  .anchor-btn {
    anchor-name: --pg-anchor;
  }

  .playground-panel {
    position: absolute;
    position-anchor: --pg-anchor;
    inset: auto;
  }

  .placement-top {
    bottom: calc(anchor(top) + 0.6rem);
    left: anchor(center);
    translate: -50% 0;
    position-try-fallbacks: flip-block;
  }

  .placement-bottom {
    top: calc(anchor(bottom) + 0.6rem);
    left: anchor(center);
    translate: -50% 0;
    position-try-fallbacks: flip-block;
  }

  .placement-left {
    right: calc(anchor(left) + 0.6rem);
    top: anchor(center);
    translate: 0 -50%;
    position-try-fallbacks: flip-inline;
  }

  .placement-right {
    left: calc(anchor(right) + 0.6rem);
    top: anchor(center);
    translate: 0 -50%;
    position-try-fallbacks: flip-inline;
  }

  .placement-top-start {
    bottom: calc(anchor(top) + 0.6rem);
    left: anchor(start);
    position-try-fallbacks: flip-block, flip-inline;
  }

  .placement-bottom-end {
    top: calc(anchor(bottom) + 0.6rem);
    right: calc(100% - anchor(end));
    position-try-fallbacks: flip-block, flip-inline;
  }
}
</style>
