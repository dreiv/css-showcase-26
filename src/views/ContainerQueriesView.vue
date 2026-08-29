<script setup lang="ts"></script>

<template>
  <h2>Container queries</h2>
  <p class="description">
    Drag the bottom-right corner of the box below. The card inside reflows from a stacked to a
    side-by-side layout based on <strong>its own container's width</strong>, not the viewport —
    the same card component looks right whether it's dropped into a narrow sidebar or a wide main
    column.
  </p>

  <div class="resize-demo">
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
    <p class="resize-hint" aria-hidden="true">⤡ drag the corner below to resize</p>
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

  <h2>Same component, different containers</h2>
  <p class="description">
    The most common real use of this: drop the <em>exact same</em> card into a narrow sidebar and
    a wide main column and let each reflow on its own — no <code>.card--compact</code> override
    class, no JS measuring the parent's <code>offsetWidth</code>. Both cards below share one
    <code>.card</code> rule; only their container's width differs.
  </p>

  <div class="layout-demo">
    <aside class="pane pane--narrow">
      <p class="pane-label">Sidebar · 200px</p>
      <article class="card">
        <div class="thumb" aria-hidden="true"></div>
        <div class="body">
          <h3>Container-aware card</h3>
          <p>Same markup, same CSS, stacked because there's no room.</p>
          <button type="button">Read more</button>
        </div>
      </article>
    </aside>

    <div class="pane pane--wide">
      <p class="pane-label">Main column · 480px</p>
      <article class="card">
        <div class="thumb" aria-hidden="true"></div>
        <div class="body">
          <h3>Container-aware card</h3>
          <p>Same markup, same CSS — it switches to side-by-side once there's room.</p>
          <button type="button">Read more</button>
        </div>
      </article>
    </div>
  </div>

  <pre><code>.pane { container-type: inline-size; container-name: card-container; }
/* both panes reuse the same named container and the same @container rule above */</code></pre>

  <h2>Container query units</h2>
  <p class="description">
    <code>cqi</code>/<code>cqw</code> scale with the container's inline size the way
    <code>vw</code> scales with the viewport. Useful for a heading that should shrink inside a
    narrow card without a media query at all.
  </p>

  <div class="resize-demo">
    <div class="resize-wrap">
      <div class="unit-demo">
        <h3 class="cq-heading">Scales with me</h3>
      </div>
    </div>
    <p class="resize-hint" aria-hidden="true">⤡ drag the corner below to resize</p>
  </div>

  <pre><code>.cq-heading {
  font-size: clamp(1rem, 8cqi, 2rem);
}</code></pre>
</template>

<style scoped>
h2:not(:first-child) {
  margin-block-start: 2rem;
}

/* The drag handle is the browser's native `resize` — no JS. */
.resize-demo {
  margin-block-end: 1.5rem;
}

.resize-wrap {
  position: relative;
  resize: horizontal;
  overflow: auto;
  width: 100%;
  max-width: 100%;
  min-width: 220px;
  border: 1px dashed var(--border-strong);
  border-radius: var(--radius);
  padding: 0.75rem;
}

/* The native grip can't be styled, so this decorative corner adds visual weight. */
.resize-wrap::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  width: 14px;
  height: 14px;
  background: linear-gradient(135deg,
      transparent 50%,
      color-mix(in srgb, var(--accent) 45%, transparent) 50%);
  border-bottom-right-radius: calc(var(--radius) - 1px);
  pointer-events: none;
}

.resize-hint {
  margin: 0.4rem 0 0;
  text-align: right;
  font-size: 0.75rem;
  color: color-mix(in srgb, currentColor 55%, transparent);
  user-select: none;
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

.layout-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-block-end: 1.5rem;
}

.pane {
  container-type: inline-size;
  container-name: card-container;
  border: 1px dashed var(--border-strong);
  border-radius: var(--radius);
  padding: 0.75rem;
}

.pane--narrow {
  width: 200px;
}

.pane--wide {
  width: 480px;
  max-width: 100%;
  flex: 1 1 480px;
}

.pane-label {
  margin: 0 0 0.5rem;
  font-size: 0.75em;
  font-weight: 600;
  color: color-mix(in srgb, currentColor 60%, transparent);
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
