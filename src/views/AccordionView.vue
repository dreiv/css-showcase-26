<script setup lang="ts">
import SupportBadge from '@/components/SupportBadge.vue'

const hasDetailsContent = typeof CSS !== 'undefined' && CSS.supports('selector(::details-content)')

const hasExclusiveDetails =
  typeof HTMLDetailsElement !== 'undefined' && 'name' in HTMLDetailsElement.prototype

interface FaqItem {
  q: string
  a: string[]
  list?: string[]
}

const items: FaqItem[] = [
  {
    q: 'Does this need any JavaScript?',
    a: [
      'No. The open/close state, the arrow rotation and the height animation are all handled by the browser — this component has an empty <script> block.',
    ],
  },
  {
    q: 'How does the height animation work?',
    a: [
      'The collapsible region (::details-content) is set to display: grid with grid-template-rows: 0fr, which animates to 1fr when open.',
      'Animating a grid track is what lets "height: auto" content transition smoothly — no JS measuring of scrollHeight, no ResizeObserver, and no fixed max-height guessed ahead of time.',
    ],
  },
  {
    q: 'What happens in a browser without support?',
    a: [
      '::details-content is Baseline newly-available: current Chrome and Firefox have it, Safari is still catching up. Elsewhere it just falls back to the plain native <details> snap open/close — you lose the animation, not the functionality.',
    ],
  },
  {
    q: 'Why not just animate max-height instead?',
    a: [
      'The old trick — transition: max-height 0.3s and toggling max-height: 0 to max-height: 500px — only works because you pick a number bigger than the content will ever be. That number is a guess, and guesses break.',
      'Too small, and tall content gets clipped even while "open". Too big, and the timing goes wrong — a one-line answer suddenly takes exactly as long to open as a ten-paragraph one, because the browser is animating through empty space up to your guessed ceiling regardless of how much content is actually there.',
      'It also can not be trusted with anything whose height changes later: a web font finishing its download, a responsive image loading in, text reflowing at a different viewport width, or content injected after the fact. All of those can push real content past a hardcoded max-height and get it clipped again, silently, well after the accordion opened.',
      'grid-template-rows: 0fr → 1fr sidesteps the whole problem. 1fr always means "the track\'s intrinsic size", computed by the grid algorithm at animation time — not a number anyone typed in ahead of time. That is also why this one answer, deliberately padded out to be the longest of the four, still opens and closes exactly as cleanly as the one-liner at the top.',
    ],
    list: [
      'No magic number to pick, and nothing to re-measure',
      'Works for text, images, lists, nested accordions — anything',
      'Content that changes size later (a loaded image, a font swap) just works',
    ],
  },
]

const faqItems: FaqItem[] = [
  {
    q: 'What does name= actually do here?',
    a: [
      'Give a group of <details> elements the same name attribute and the browser links them: opening one closes whichever of its siblings was open, with zero JS and no shared state for you to manage.',
    ],
  },
  {
    q: 'Do I need different markup for this?',
    a: [
      'No — it is the exact same <details>/<summary> structure as the comparison above, plus one repeated attribute: name="faq-exclusive" on every member of the group.',
    ],
  },
  {
    q: 'Is an exclusive accordion always the right call?',
    a: [
      'Not automatically. Auto-closing a section someone has already opened and is reading can be disorienting — especially for screen-reader users who lose their place — so treat exclusivity as a real UX trade-off, not a free upgrade. Plain, independent <details> elements (the first demo on this page) are the safer default for most content; reach for name= when sections genuinely compete for the same space, like a FAQ list or a settings panel.',
    ],
  },
]
</script>

<template>
  <h2>Pure CSS accordion</h2>
  <p class="description">
    Built entirely from <code>&lt;details&gt;</code> / <code>&lt;summary&gt;</code>. The animated
    expand/collapse comes from <code>::details-content { grid-template-rows: 0fr → 1fr }</code> — no
    JS.
  </p>

  <SupportBadge :supported="hasDetailsContent" feature="::details-content" />

  <div class="compare">
    <div class="col">
      <h3>With <code>::details-content</code></h3>
      <div class="accordion">
        <details v-for="(item, i) in items" :key="item.q" class="accordion-item enhanced" :open="i === 0">
          <summary class="summary">
            <span class="nr">{{ String(i + 1).padStart(2, '0') }}</span>
            {{ item.q }}
          </summary>
          <div class="clip">
            <p v-for="(para, pi) in item.a" :key="pi">{{ para }}</p>
            <ul v-if="item.list" class="a-list">
              <li v-for="(li, li2) in item.list" :key="li2">{{ li }}</li>
            </ul>
          </div>
        </details>
      </div>
    </div>

    <div class="col">
      <h3>Default details</h3>
      <div class="accordion">
        <details v-for="(item, i) in items" :key="item.q" class="accordion-item" :open="i === 0">
          <summary class="summary">
            <span class="nr">{{ String(i + 1).padStart(2, '0') }}</span>
            {{ item.q }}
          </summary>
          <div class="clip">
            <p v-for="(para, pi) in item.a" :key="pi">{{ para }}</p>
            <ul v-if="item.list" class="a-list">
              <li v-for="(li, li2) in item.list" :key="li2">{{ li }}</li>
            </ul>
          </div>
        </details>
      </div>
    </div>
  </div>

  <pre><code>.enhanced::details-content {
  display: grid;
  grid-template-rows: 0fr;
  content-visibility: hidden;
  transition:
    grid-template-rows 0.35s ease,
    content-visibility 0.35s allow-discrete;
}

.enhanced[open]::details-content {
  grid-template-rows: 1fr;
  content-visibility: visible;
}</code></pre>

  <h2>Exclusive accordion, with <code>name</code></h2>
  <p class="description">
    Give a group of <code>&lt;details&gt;</code> elements the same <code>name</code> attribute and
    the browser makes them mutually exclusive — opening one closes whichever sibling was open, no
    JS event listeners and no shared "which one is open" state to track yourself.
  </p>

  <div class="accordion">
    <details v-for="(item, i) in faqItems" :key="item.q" class="accordion-item enhanced" name="faq-exclusive"
      :open="i === 0">
      <summary class="summary">
        <span class="nr">{{ String(i + 1).padStart(2, '0') }}</span>
        {{ item.q }}
      </summary>
      <div class="clip">
        <p v-for="(para, pi) in item.a" :key="pi">{{ para }}</p>
      </div>
    </details>
  </div>

  <pre><code>&lt;details name="faq"&gt;...&lt;/details&gt;
&lt;details name="faq"&gt;...&lt;/details&gt;
&lt;details name="faq"&gt;...&lt;/details&gt;
&lt;!-- same name = only one open at a time, enforced by the browser --&gt;</code></pre>

  <p class="support-note">
    <code>details[name]</code> has been supported in every major browser since late 2024 — no
    <code>@supports</code> fallback needed here,
    {{ hasExclusiveDetails ? 'and this browser has it.' : 'though this browser is an exception.' }}
    The trade-off is accessibility, not support: auto-closing a section someone is mid-way through
    reading can be disorienting, so treat exclusivity as a deliberate choice for FAQ-style or
    tab-like content, not a default upgrade for every accordion.
  </p>
</template>

<style scoped>
h2:not(:first-child) {
  margin-block-start: 2rem;
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

h3 {
  font-size: 0.95rem;
  margin-block: 0 0.5rem;
}

.accordion {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.accordion-item {
  border: 1px solid var(--border-strong);
  border-radius: 1rem;
  padding: 1.1rem 1.4rem;
}

.summary {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  cursor: pointer;
  font-weight: 600;
  list-style: none;
}

.summary::-webkit-details-marker {
  display: none;
}

.summary::after {
  content: '';
  margin-inline-start: auto;
  width: 0.55em;
  height: 0.55em;
  flex-shrink: 0;
  border-inline-end: 2px solid currentColor;
  border-block-end: 2px solid currentColor;
  rotate: 45deg;
  translate: 0 -15%;
  transition: rotate 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.accordion-item[open] .summary::after {
  rotate: -135deg;
  translate: 0 15%;
}

.nr {
  color: var(--accent);
}

.clip {
  overflow: hidden;
  min-height: 0;
  opacity: 0;
  translate: 0 0.6rem;
  transition:
    opacity 0.35s 0.05s ease,
    translate 0.35s 0.05s ease;
}

.clip>p {
  margin: 0;
  padding-block-start: 0.85rem;
  color: color-mix(in srgb, currentColor 70%, transparent);
}

.clip>p+p {
  padding-block-start: 0;
  margin-block-start: 0.6rem;
}

.a-list {
  margin: 0.7rem 0 0;
  padding-inline-start: 1.1rem;
  color: color-mix(in srgb, currentColor 70%, transparent);
  font-size: 0.95em;
}

.a-list li+li {
  margin-block-start: 0.3rem;
}

.a-list li::marker {
  color: var(--accent);
}

.accordion-item[open] .clip {
  opacity: 1;
  translate: none;
}

.enhanced::details-content {
  display: grid;
  grid-template-rows: 0fr;
  content-visibility: hidden;
  transition:
    grid-template-rows 0.35s ease,
    content-visibility 0.35s allow-discrete;
}

.enhanced[open]::details-content {
  grid-template-rows: 1fr;
  content-visibility: visible;
}

.support-note {
  color: color-mix(in srgb, currentColor 65%, transparent);
  font-size: 0.85em;
}
</style>
