<script setup lang="ts">
import SupportBadge from '@/components/SupportBadge.vue'

const hasScrollTimeline =
  typeof CSS !== 'undefined' && CSS.supports('animation-timeline', 'scroll()')

const cards = [
  { title: 'Scroll timeline', body: 'Tied to the scroll position of the strip below.' },
  { title: 'No JS listener', body: 'No scroll event, no rAF loop, no IntersectionObserver.' },
  {
    title: 'Runs off-thread',
    body: 'The animation is driven by the compositor, not the main thread.',
  },
  { title: 'view() timeline', body: 'Each card also fades/rises in based on its own visibility.' },
  { title: 'Still just CSS', body: 'animation-timeline is the only thing doing any of this.' },
]
</script>

<template>
  <h2>Scroll-driven animations</h2>
  <p class="description">
    <code>animation-timeline: scroll()</code> ties an animation's progress to how far something is
    scrolled, instead of to wall-clock time. Scroll the strip below — the progress bar fills as a
    direct function of scroll position, no <code>scroll</code> event listener involved.
  </p>

  <SupportBadge :supported="hasScrollTimeline" feature="animation-timeline: scroll()" />

  <div class="scroller" tabindex="0">
    <div class="progress-track">
      <div class="progress-fill"></div>
    </div>
  </div>

  <pre><code>.progress-fill {
  transform-origin: left;
  animation: grow-fill linear;
  animation-timeline: scroll(self);
}

@keyframes grow-fill {
  from { scale: 0 1; }
  to   { scale: 1 1; }
}</code></pre>

  <h2>Reveal-on-view, with <code>view()</code></h2>
  <p class="description">
    <code>animation-timeline: view()</code> ties progress to a element's position inside its nearest
    scrollable ancestor — the classic "fade and rise in as it enters the viewport" effect, with zero
    JS. Scroll the card strip to see each one animate in on its own.
  </p>

  <div class="card-scroller">
    <article v-for="c in cards" :key="c.title" class="reveal-card">
      <h3>{{ c.title }}</h3>
      <p>{{ c.body }}</p>
    </article>
  </div>

  <pre><code>.reveal-card {
  animation: fade-rise linear both;
  animation-timeline: view();
  animation-range: entry 0% cover 40%;
}

@keyframes fade-rise {
  from { opacity: 0; translate: 0 24px; }
  to   { opacity: 1; translate: 0 0; }
}</code></pre>

  <p class="support-note">
    <code>animation-timeline: view()</code> follows the same support story as the badge above —
    treat the effect as progressive enhancement (<code
      >@supports (animation-timeline: scroll())</code
    >) rather than load-bearing for content.
  </p>
</template>

<style scoped>
h2:not(:first-child) {
  margin-block-start: 2rem;
}

.scroller {
  overflow-x: auto;
  overflow-y: hidden;
  border: 1px dashed var(--border-strong);
  border-radius: var(--radius);
  padding: 0.75rem;
  margin-block-end: 1rem;
  /* just something wide enough to make horizontal scroll meaningful */
  white-space: nowrap;
}

.scroller::after {
  content: '';
  display: inline-block;
  width: 220%;
  height: 1px;
}

.progress-track {
  position: sticky;
  inset-inline-start: 0;
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: var(--surface);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  width: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 40%, canvas));
  transform-origin: left;
  animation: grow-fill linear;
  animation-timeline: scroll(self);
}

@keyframes grow-fill {
  from {
    scale: 0 1;
  }
  to {
    scale: 1 1;
  }
}

.card-scroller {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 0.5rem 0.25rem 1.5rem;
  margin-block-end: 1.5rem;
}

.reveal-card {
  flex: 0 0 200px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  padding: 1rem;
  background: var(--surface);

  animation: fade-rise linear both;
  animation-timeline: view();
  animation-range: entry 0% cover 40%;
}

.reveal-card h3 {
  margin-block: 0 0.4rem;
  font-size: 1rem;
}

.reveal-card p {
  margin: 0;
  font-size: 0.85em;
  color: color-mix(in srgb, currentColor 70%, transparent);
}

@keyframes fade-rise {
  from {
    opacity: 0;
    translate: 0 24px;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}

.support-note {
  color: color-mix(in srgb, currentColor 65%, transparent);
  font-size: 0.85em;
}

/* respect reduced motion regardless of scroll position */
@media (prefers-reduced-motion: reduce) {
  .progress-fill,
  .reveal-card {
    animation: none;
  }
}
</style>
