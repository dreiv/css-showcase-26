<script setup lang="ts">
import SupportBadge from '@/components/SupportBadge.vue'

const hasScrollTimeline =
  typeof CSS !== 'undefined' && CSS.supports('animation-timeline', 'scroll()')

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
  { title: 'Hurtling in from depth', body: 'Each card starts small, blurred and dim, as if it just arrived from far down the z-axis — not just faded in from the side.' },
  { title: 'No canvas, no particles', body: "The usual way to fake this is a JS starfield: a canvas loop projecting points outward from a vanishing point. Here it's three CSS properties." },
  { title: 'perspective does the trick', body: '.feed sets perspective: 900px, so a child\'s translateZ() actually reads as motion through space instead of a flat scale.' },
  { title: 'translateZ + scale + blur', body: 'Cards animate translateZ from -500px to 0 while scaling up and losing blur — depth, size and focus arrive together.' },
  { title: 'Per-card timeline', body: 'animation-timeline: view() gives every card its own scroll-linked progress — no shared state, no manual class toggling.' },
  { title: 'animation-range: entry', body: 'Just the entry phase, not "cover" — cover needs scroll room after the card too, which the last ones in a short list don\'t have.' },
  { title: 'Reverses on scroll-up', body: 'Scroll back up and each card recedes back into the distance — the timeline just runs backward.' },
  { title: 'Still just CSS', body: 'animation-timeline and perspective are doing all of this — the JS hyperspace-button demos need a render loop instead.' },
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

  <h2>Hyperspace-jump reveal, with <code>view()</code></h2>
  <p class="description">
    The "flat fade and rise" is the safe default, but <code>animation-timeline: view()</code> can drive
    any keyframes — including the classic sci-fi "jump to warp speed" entrance normally built with a
    JS/canvas starfield or a library like GSAP's ScrollTrigger. This version fakes the depth with
    plain CSS: a <code>perspective</code>d container plus <code>translateZ()</code>, <code>scale</code>
    and <code>blur()</code> on each card. Scroll the feed below and watch each card rush in from the
    distance.
  </p>

  <div class="feed" tabindex="0">
    <article v-for="c in cards" :key="c.title" class="reveal-card">
      <h3>{{ c.title }}</h3>
      <p>{{ c.body }}</p>
    </article>
  </div>

  <pre><code>.feed {
  perspective: 900px;
}

.reveal-card {
  animation: warp-jump linear both;
  animation-timeline: view();
  /* "entry" only — no "cover" tail. Cover needs scroll room
     *after* the element too, which the last few cards in a
     short container don't have, so they'd get stuck mid-animation. */
  animation-range: entry;
}

@keyframes warp-jump {
  from {
    opacity: 0;
    transform: translateZ(-500px) scale(0.4);
    filter: blur(14px);
  }
  60%  { opacity: 1; }
  to   {
    opacity: 1;
    transform: translateZ(0) scale(1);
    filter: blur(0);
  }
}</code></pre>

  <p class="support-note">
    <code>animation-timeline: view()</code> follows the same support story as the badge above —
    treat the effect as progressive enhancement (<code>@supports (animation-timeline: scroll())</code>) rather than
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
  perspective: 900px;
}

.reveal-card {
  flex: 0 0 auto;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  padding: 1rem;
  background: var(--surface);

  animation: warp-jump linear both;
  animation-timeline: view();
  animation-range: entry;
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

@keyframes warp-jump {
  from {
    opacity: 0;
    transform: translateZ(-500px) scale(0.4);
    filter: blur(14px);
  }

  60% {
    opacity: 1;
  }

  to {
    opacity: 1;
    transform: translateZ(0) scale(1);
    filter: blur(0);
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
