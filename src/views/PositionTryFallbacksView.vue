<script setup lang="ts"></script>

<template>
  <h2>Position-try fallbacks</h2>
  <p class="description">
    Each button below is anchored to a tooltip via <code>anchor-name</code> /
    <code>position-anchor</code>. The tooltip's preferred spot is "to the right of the button."
    When there isn't room, <code>position-try-fallbacks</code> tells the browser what to try
    instead. Rather than a generic keyword like <code>flip-inline</code> — which flips things
    for you, but hides <em>how</em> — this version points at a named
    <code>@position-try</code> rule that just says, in plain CSS, "put it on the left
    instead." Hover or focus a button to see it.
  </p>

  <div class="demo-box">
    <button class="tip-btn corner-tl">Top-left</button>
    <span class="tooltip tip-tl" role="tooltip">Plenty of room to the right — opens at its preferred spot, no fallback
      needed.</span>

    <button class="tip-btn corner-tr">Top-right</button>
    <span class="tooltip tip-tr" role="tooltip">No room to the right — the browser reaches for <code>--open-left</code>
      instead.</span>

    <button class="tip-btn corner-bl">Bottom-left</button>
    <span class="tooltip tip-bl" role="tooltip">Plenty of room to the right, opens at its preferred spot.</span>

    <button class="tip-btn corner-br">Bottom-right</button>
    <span class="tooltip tip-br" role="tooltip">Boxed in on the right — falls back to <code>--open-left</code>, same as
      top-right.</span>
  </div>

  <pre><code>.tip-btn { anchor-name: --btn; }

/* The fallback, spelled out — read it like a recipe: "if the preferred
   spot doesn't fit, open to the LEFT of the anchor instead." No flipping
   magic: every property here is one you'd also write by hand. */
@position-try --open-left {
  left: auto;
  right: anchor(left);    /* sit just left of the anchor's left edge */
  margin-left: 0;
  margin-right: 0.6rem;
}

.tooltip {
  position: absolute;
  position-anchor: --btn;
  top: anchor(top);
  left: anchor(right);              /* preferred: open to the right */
  margin-left: 0.6rem;
  position-try-fallbacks: --open-left;
}</code></pre>
  <p class="note">
    <code>position-try-fallbacks</code> takes a comma-separated list of things to try, in order —
    each item can be a named rule like this one, or a built-in tactic like
    <code>flip-inline</code>. The browser tries each in turn and uses the first one that actually
    fits; if none fit, it falls back to whichever leaves the most space visible. Naming your own
    rule just makes that first attempt readable instead of implicit.
  </p>
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

/* Named fallback: open to the left of the anchor instead of the right. */
@position-try --open-left {
  left: auto;
  right: anchor(left);
  margin-left: 0;
  margin-right: 0.6rem;
}

.tooltip {
  position: absolute;
  inset: auto;
  top: anchor(top);
  left: anchor(right);
  margin-left: 0.6rem;
  position-try-fallbacks: --open-left;

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

.tip-btn:hover+.tooltip,
.tip-btn:focus-visible+.tooltip {
  opacity: 1;
}

.note {
  color: color-mix(in srgb, currentColor 65%, transparent);
  font-size: 0.85em;
}
</style>
