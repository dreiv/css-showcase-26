<script setup lang="ts"></script>

<template>
  <h2>Container queries</h2>
  <p class="description">
    Drag the bottom-right corner of the box below. The card inside reflows from a stacked to a
    side-by-side layout based on <strong>its own container's width</strong>, not the viewport —
    the same card component looks right whether it's dropped into a narrow sidebar or a wide main
    column.
  </p>

  <div class="resize-wrap">
    <div class="container-demo">
      <article class="card">
        <div class="thumb" aria-hidden="true"></div>
        <div class="body">
          <h3>Container-aware card</h3>
          <p>
            This layout switches at <code>400px</code> of container width, not window width —
            resize just the box above, not your browser.
          </p>
          <button type="button">Read more</button>
        </div>
      </article>
    </div>
  </div>

  <pre><code>.container-demo {
  container-type: inline-size;
  container-name: card-container;
}

.card { display: grid; }

@container card-container (min-width: 400px) {
  .card {
    grid-template-columns: 140px 1fr;
  }
}</code></pre>

  <h2>Container query units</h2>
  <p class="description">
    <code>cqi</code>/<code>cqw</code> scale with the container's inline size the way
    <code>vw</code> scales with the viewport. Useful for a heading that should shrink inside a
    narrow card without a media query at all.
  </p>

  <div class="resize-wrap resize-wrap--unit">
    <div class="unit-demo">
      <h3 class="cq-heading">Scales with me</h3>
    </div>
  </div>

  <pre><code>.cq-heading {
  font-size: clamp(1rem, 8cqi, 2rem);
}</code></pre>
</template>

<style scoped>
h2:not(:first-child) {
  margin-block-start: 2rem;
}

/* The drag handle is just the browser's native `resize` — no JS pointer tracking. */
.resize-wrap {
  resize: horizontal;
  overflow: auto;
  width: 100%;
  max-width: 100%;
  min-width: 220px;
  border: 1px dashed var(--border-strong);
  border-radius: var(--radius);
  padding: 0.75rem;
  margin-block-end: 1.5rem;
}

.container-demo {
  container-type: inline-size;
  container-name: card-container;
}

.card {
  display: grid;
  gap: 0.9rem;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  padding: 1rem;
  background: var(--surface);
}

.thumb {
  aspect-ratio: 1;
  width: 100%;
  border-radius: calc(var(--radius) - 2px);
  background: linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 40%, canvas));
}

.body h3 {
  margin-block: 0 0.4rem;
  font-size: 1rem;
}

.body p {
  margin-block: 0 0.7rem;
  font-size: 0.9em;
  color: color-mix(in srgb, currentColor 70%, transparent);
}

@container card-container (min-width: 400px) {
  .card {
    grid-template-columns: 140px 1fr;
    align-items: center;
  }
}

.unit-demo {
  container-type: inline-size;
  padding: 1rem;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  background: var(--surface);
}

.cq-heading {
  margin: 0;
  font-size: clamp(1rem, 8cqi, 2rem);
  white-space: nowrap;
}
</style>
