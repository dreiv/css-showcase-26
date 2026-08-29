<script setup lang="ts">
import SupportBadge from '@/components/SupportBadge.vue'

const hasScrollTimeline =
  typeof CSS !== 'undefined' && CSS.supports('animation-timeline', 'scroll()')

// view() timelines are a separate feature from scroll() — Chromium-only for now.
const hasViewTimeline =
  typeof CSS !== 'undefined' && CSS.supports('animation-timeline', 'view()')

const paragraphs = [
  'Scroll this pane, not the page — the bar pinned to the top fills as a direct function of how far down you are, driven by animation-timeline: scroll(), not a scroll event listener.',
  'This is the pattern behind the reading-progress bar you see on long articles: pin a thin bar to the top of the scroll container, then tie its scale to the container\'s own scroll offset.',
  'Because the animation is computed from scroll position rather than time, there is nothing to keep in sync — scroll up, and the bar shrinks back exactly as far, instantly, with no debounce and no rAF loop.',
  'The compositor drives this off the main thread, so it keeps up even while JavaScript on the page is busy doing something else entirely.',
  'Before this landed, a reading-progress bar meant a scroll listener computing scrollTop / (scrollHeight - clientHeight) on every tick, usually throttled or wrapped in requestAnimationFrame to avoid jank.',
  'None of that setup exists here. The bar is a single element with a scale transform, and the timeline itself supplies the 0-to-1 progress value — the same way a time-based animation gets its progress from the clock.',
  'It composes with everything else CSS already does: prefers-reduced-motion turns it off below with a single media query, same as any other animation.',
  'Scroll-timelines aren\'t limited to progress bars either — the same primitive can drive a background color shift, a rotating icon, or a chart that draws itself in as you scroll past it.',
  'One thing to watch for: the timeline needs a scrollable ancestor to attach to. Here that is this pane itself, referenced with scroll(nearest block) rather than scroll(self), since the bar does not scroll — its container does.',
  'Keep scrolling — the last line is down here. Once the bar reaches the end, you have hit the bottom of this pane.',
]

const cards = [
  { title: 'Fade and rise', body: 'Each card fades in from opacity 0 while rising 10px into place as it enters the scroll pane.' },
  { title: 'Two properties, one timeline', body: 'opacity and translateY are the entire effect — no perspective, no blur, no scale.' },
  { title: 'Per-card timeline', body: 'animation-timeline: view() gives every card its own scroll-linked progress — no shared state, no manual class toggling.' },
  { title: 'Threshold with animation-range', body: 'entry 20% waits until 20% of the card is in the viewport before the reveal starts — the CSS equivalent of an IntersectionObserver threshold.' },
  { title: 'Reverses on scroll-up', body: 'Scroll back up and each card fades out and drops back down — the timeline just runs backward.' },
  { title: 'No observers needed', body: 'No IntersectionObserver, no scroll listener — the timeline supplies the 0-to-1 progress value directly.' },
  { title: 'Compositor-driven', body: 'The animation runs off the main thread, so it keeps up even while JavaScript is busy doing something else.' },
  { title: 'Still just CSS', body: 'animation-timeline and two keyframes are doing all of this — no JS, no library.' },
]
</script>

<template>
  <h2>Scroll-driven animations</h2>
  <p class="description">
    <code>animation-timeline: scroll()</code> ties an animation's progress to how far something is
    scrolled, instead of to wall-clock time. Scroll the pane below — vertically, the way this
    pattern actually gets used — and watch the bar pinned to the top fill up.
  </p>

  <SupportBadge :supported="hasScrollTimeline" feature="animation-timeline: scroll()" />

  <div class="reader" tabindex="0">
    <div class="progress-track">
      <div class="progress-fill"></div>
    </div>
    <div class="reader-copy">
      <p v-for="(p, i) in paragraphs" :key="i">{{ p }}</p>
    </div>
  </div>

  <pre><code>.progress-fill {
  transform-origin: left;
  animation: grow-fill linear;
  animation-timeline: scroll(nearest block);
}

@keyframes grow-fill {
  from { scale: 0 1; }
  to   { scale: 1 1; }
}</code></pre>

  <h2>Simple reveal, with <code>view()</code></h2>
  <p class="description">
    <code>animation-timeline: view()</code> ties each element's animation to its position in the
    scroll port. Here it drives a plain reveal: opacity from 0 to 1 and a 10px rise into place as
    each card enters the pane. Scroll the feed below and watch each card fade in.
  </p>

  <SupportBadge :supported="hasViewTimeline" feature="animation-timeline: view()" />

  <div class="feed" tabindex="0">
    <article v-for="c in cards" :key="c.title" class="reveal-card">
      <h3>{{ c.title }}</h3>
      <p>{{ c.body }}</p>
    </article>
  </div>

  <pre><code>.reveal-card {
  animation: fade-rise linear both;
  animation-timeline: view();
  /* Start at 20% entry (card is 20% in view) and finish at 50% —
     the CSS equivalent of an IntersectionObserver threshold. */
  animation-range: entry 20% entry 50%;
}

@keyframes fade-rise {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}</code></pre>

  <p class="support-note">
    <code>view()</code> timelines are a separate feature from <code>scroll()</code> and are
    Chromium-only for now — Firefox and Safari don't support them yet. Treat the reveal as
    progressive enhancement (<code>@supports (animation-timeline: view())</code>) rather than
    load-bearing for content.
  </p>
</template>

<style scoped>
h2:not(:first-child) {
  margin-block-start: 2rem;
}

.reader {
  position: relative;
  max-height: 260px;
  overflow-y: auto;
  overflow-x: hidden;
  border: 1px dashed var(--border-strong);
  border-radius: var(--radius);
  padding-inline: 1rem;
  margin-block-end: 1rem;
}

.progress-track {
  position: sticky;
  top: 0;
  height: 6px;
  margin-inline: -1rem;
  background: var(--surface);
  z-index: 1;
}

.progress-fill {
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 40%, canvas));
  transform-origin: left;
  animation: grow-fill linear;
  animation-timeline: scroll(nearest block);
}

@keyframes grow-fill {
  from {
    scale: 0 1;
  }

  to {
    scale: 1 1;
  }
}

.reader-copy p {
  margin: 1rem 0;
  font-size: 0.9em;
  line-height: 1.6;
  color: color-mix(in srgb, currentColor 80%, transparent);
}

.reader-copy p:first-child {
  margin-block-start: 0.9rem;
}

.feed {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 380px;
  overflow-y: auto;
  border: 1px dashed var(--border-strong);
  border-radius: var(--radius);
  padding: 1rem;
  margin-block-end: 1.5rem;
}

.reveal-card {
  flex: 0 0 auto;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  padding: 1rem;
  background: var(--surface);

  animation: fade-rise linear both;
  animation-timeline: view();
  animation-range: entry 75%;
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
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.support-note {
  color: color-mix(in srgb, currentColor 65%, transparent);
  font-size: 0.85em;
}

@media (prefers-reduced-motion: reduce) {

  .progress-fill,
  .reveal-card {
    animation: none;
  }
}
</style>
