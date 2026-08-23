<script setup lang="ts"></script>

<template>
  <h2>Position-try fallbacks</h2>
  <p class="description">
    Each button below is anchored to a tooltip via <code>anchor-name</code> /
    <code>position-anchor</code>. The tooltip's preferred spot is "to the right of the button" —
    <code>position-try-fallbacks: flip-inline, flip-block</code> lets the browser flip it back
    on screen for the buttons near the edge, instead of letting it overflow. Hover or focus a
    button to see it.
  </p>

  <div class="demo-box">
    <button class="tip-btn corner-tl">Top-left</button>
    <span class="tooltip tip-tl" role="tooltip"
      >Prefers opening to the right — plenty of room here, so it doesn't need to flip.</span
    >

    <button class="tip-btn corner-tr">Top-right</button>
    <span class="tooltip tip-tr" role="tooltip"
      >No room to the right — <code>flip-inline</code> moves it to the left instead.</span
    >

    <button class="tip-btn corner-bl">Bottom-left</button>
    <span class="tooltip tip-bl" role="tooltip"
      >Plenty of room to the right, opens at its preferred spot.</span
    >

    <button class="tip-btn corner-br">Bottom-right</button>
    <span class="tooltip tip-br" role="tooltip"
      >Boxed in on the right — flips to the left, same as the top-right one.</span
    >
  </div>

  <pre><code>.tip-btn { anchor-name: --btn; }

.tooltip {
  position: absolute;
  position-anchor: --btn;
  top: anchor(top);
  left: anchor(right);
  margin-left: 0.6rem;
  position-try-fallbacks: flip-inline, flip-block;
}</code></pre>
</template>

<style scoped>
.demo-box {
  position: relative;
  overflow: clip;
  height: 260px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  margin-block-end: 1.5rem;
}

.tip-btn {
  position: absolute;
}

.corner-tl {
  top: 1rem;
  left: 1rem;
  anchor-name: --a-tl;
}

.corner-tr {
  top: 1rem;
  right: 1rem;
  anchor-name: --a-tr;
}

.corner-bl {
  bottom: 1rem;
  left: 1rem;
  anchor-name: --a-bl;
}

.corner-br {
  bottom: 1rem;
  right: 1rem;
  anchor-name: --a-br;
}

.tooltip {
  position: absolute;
  inset: auto;
  top: anchor(top);
  left: anchor(right);
  margin-left: 0.6rem;
  position-try-fallbacks: flip-inline, flip-block;

  width: max-content;
  max-width: 200px;
  background: #222;
  color: #fff;
  font-size: 0.8rem;
  line-height: 1.4;
  padding: 0.5rem 0.7rem;
  border-radius: 6px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
}

.tip-tl {
  position-anchor: --a-tl;
}
.tip-tr {
  position-anchor: --a-tr;
}
.tip-bl {
  position-anchor: --a-bl;
}
.tip-br {
  position-anchor: --a-br;
}

.tip-btn:hover + .tooltip,
.tip-btn:focus-visible + .tooltip {
  opacity: 1;
}
</style>
