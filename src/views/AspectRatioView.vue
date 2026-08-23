<script setup lang="ts">
const ratios = [
  { label: '1 / 1', value: '1 / 1' },
  { label: '4 / 3', value: '4 / 3' },
  { label: '16 / 9', value: '16 / 9' },
  { label: '21 / 9', value: '21 / 9' },
]
</script>

<template>
  <h2>aspect-ratio</h2>
  <p class="description">
    One declaration replaces the old "padding-top percentage hack". The box keeps its ratio at
    any width — resize your browser to see these stay locked, no wrapper element, no JS
    <code>ResizeObserver</code>.
  </p>

  <div class="ratio-grid">
    <figure v-for="r in ratios" :key="r.value" class="ratio-box" :style="{ aspectRatio: r.value }">
      <figcaption>{{ r.label }}</figcaption>
    </figure>
  </div>

  <pre><code>.ratio-box {
  aspect-ratio: 16 / 9;
  width: 100%; /* height is derived, never set directly */
}</code></pre>

  <h2>Combined with <code>object-fit</code></h2>
  <p class="description">
    The other common pairing: force an <code>&lt;img&gt;</code> into a fixed ratio without
    distorting it, by cropping with <code>object-fit: cover</code>.
  </p>

  <div class="compare">
    <figure class="media-box">
      <div class="fake-photo fake-photo--tall" role="img" aria-label="Portrait placeholder"></div>
      <figcaption>Source image (portrait)</figcaption>
    </figure>
    <figure class="media-box">
      <div class="fake-photo fake-photo--cropped" role="img" aria-label="Cropped to 16:9"></div>
      <figcaption>
        <code>aspect-ratio: 16/9; object-fit: cover</code>
      </figcaption>
    </figure>
  </div>

  <h2>Video/iframe embed, no padding-hack wrapper</h2>
  <p class="description">
    The classic use case this property was made for — a responsive 16:9 embed slot with a single
    line of CSS on the element itself.
  </p>
  <div class="embed-slot" role="img" aria-label="16:9 embed placeholder">
    <span>16 / 9 embed slot</span>
  </div>

  <pre><code>iframe.embed {
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 0;
}</code></pre>
</template>

<style scoped>
h2:not(:first-child) {
  margin-block-start: 2rem;
}

.ratio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  margin-block-end: 1.5rem;
}

.ratio-box {
  margin: 0;
  width: 100%;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  background: linear-gradient(135deg, var(--surface), var(--surface-hover));
  display: flex;
  align-items: flex-end;
  padding: 0.5rem;
}

.ratio-box figcaption {
  font-size: 0.8em;
  font-family: ui-monospace, Menlo, Consolas, monospace;
  color: color-mix(in srgb, currentColor 65%, transparent);
}

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

.media-box {
  margin: 0;
}

.media-box figcaption {
  margin-block-start: 0.4rem;
  font-size: 0.85em;
  color: color-mix(in srgb, currentColor 65%, transparent);
}

.fake-photo {
  width: 100%;
  border-radius: var(--radius);
  background:
    repeating-linear-gradient(
      45deg,
      var(--surface-hover) 0 10px,
      var(--surface) 10px 20px
    );
  border: 1px solid var(--border-strong);
}

.fake-photo--tall {
  aspect-ratio: 3 / 4;
}

.fake-photo--cropped {
  aspect-ratio: 16 / 9;
  /* pretend this is an <img style="object-fit: cover"> cropping the tall
     source photo down to a 16:9 slot without distortion */
  background-position: center 20%;
  background-size: cover;
}

.embed-slot {
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 1px dashed var(--border-strong);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface);
  color: color-mix(in srgb, currentColor 55%, transparent);
  margin-block-end: 1.5rem;
}
</style>
