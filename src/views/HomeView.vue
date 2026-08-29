<script setup lang="ts">
interface Demo {
  name: string
  route: string
  technique: string
  description: string
  supported: boolean
}

function detect(check: () => boolean): boolean {
  try {
    return check()
  } catch {
    return false
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const IteratorCtor = (globalThis as any).Iterator

const demos: Demo[] = [
  {
    name: 'Accordion',
    route: '/accordion',
    technique: '::details-content + interpolate-size',
    description: 'Native <details>/<summary> with an animated open/close height, no JS.',
    supported: detect(
      () => typeof CSS !== 'undefined' && CSS.supports('selector(::details-content)'),
    ),
  },
  {
    name: 'Data table',
    route: '/data-table',
    technique: 'Popover API + anchor positioning',
    description: 'Sortable, filterable table. Filtering opens a popover anchored to the button.',
    supported: detect(() => typeof CSS !== 'undefined' && CSS.supports('anchor-name', '--a')),
  },
  {
    name: 'Auto-grow textarea',
    route: '/auto-grow-textarea',
    technique: 'field-sizing: content',
    description: 'A <textarea> that grows with its content — one CSS declaration.',
    supported: detect(() => typeof CSS !== 'undefined' && CSS.supports('field-sizing', 'content')),
  },
  {
    name: 'Position-try fallbacks',
    route: '/position-try-fallbacks',
    technique: 'anchor-name + position-try-fallbacks',
    description: 'Anchored tooltips that flip themselves back into the viewport.',
    supported: detect(
      () => typeof CSS !== 'undefined' && CSS.supports('position-try-fallbacks', 'flip-block'),
    ),
  },
  {
    name: 'Styled select',
    route: '/styled-select',
    technique: 'appearance: none',
    description: 'A restyled native <select>, using only the widely-supported technique.',
    supported: detect(() => typeof CSS !== 'undefined' && CSS.supports('appearance', 'none')),
  },
  {
    name: 'Popover playground',
    route: '/popover-playground',
    technique: 'Popover API + anchor positioning',
    description: 'Drag the anchor, pick a preferred side — the popover follows and self-flips.',
    supported: detect(
      () => typeof HTMLElement !== 'undefined' && 'popover' in HTMLElement.prototype,
    ),
  },
  {
    name: 'Modal',
    route: '/modal',
    technique: 'command / commandfor',
    description: 'Declarative dialog triggering with the Invoker Commands API — no JS handlers.',
    supported: detect(
      () => typeof HTMLButtonElement !== 'undefined' && 'command' in HTMLButtonElement.prototype,
    ),
  },
  {
    name: 'aspect-ratio',
    route: '/aspect-ratio',
    technique: 'aspect-ratio',
    description: 'Locked-ratio boxes, media embeds and object-fit cropping, no padding hack.',
    supported: detect(() => typeof CSS !== 'undefined' && CSS.supports('aspect-ratio', '16 / 9')),
  },
  {
    name: 'Container queries',
    route: '/container-queries',
    technique: 'container-type + @container',
    description: "A card that reflows based on its own container's width, not the viewport.",
    supported: detect(
      () => typeof CSS !== 'undefined' && CSS.supports('container-type', 'inline-size'),
    ),
  },
  {
    name: ':has() selector',
    route: '/has-selector',
    technique: ':has()',
    description: 'Five patterns: rating stars, live validation, cards, quantity queries, content.',
    supported: detect(() => typeof CSS !== 'undefined' && CSS.supports('selector(:has(a))')),
  },
  {
    name: 'Scroll-driven animations',
    route: '/scroll-animations',
    technique: 'animation-timeline: scroll() / view()',
    description: 'A progress bar and reveal-on-scroll cards, tied to scroll position, no listener.',
    supported: detect(
      () => typeof CSS !== 'undefined' && CSS.supports('animation-timeline', 'scroll()'),
    ),
  },
  {
    name: 'contrast-color()',
    route: '/contrast-color',
    technique: 'contrast-color()',
    description: 'Auto-picks readable black/white text for any background, no luminance math.',
    supported: detect(
      () => typeof CSS !== 'undefined' && CSS.supports('color', 'contrast-color(white)'),
    ),
  },
  {
    name: 'View Transitions',
    route: '/view-transitions',
    technique: 'document.startViewTransition()',
    description: 'Grid/list layout swaps and a shared-element card-to-detail morph.',
    supported: detect(() => typeof document !== 'undefined' && 'startViewTransition' in document),
  },
  {
    name: 'Relative color syntax',
    route: '/relative-color',
    technique: 'oklch(from ...)',
    description: 'Derive tints, shades and alpha variants from one base color, live.',
    supported: detect(
      () => typeof CSS !== 'undefined' && CSS.supports('color', 'oklch(from red l c h)'),
    ),
  },
  {
    name: 'Temporal',
    route: '/temporal',
    technique: 'Temporal.*',
    description: 'The JS example: calendar/timezone-aware date math, live, replacing Date.',
    supported: detect(() => typeof (globalThis as { Temporal?: unknown }).Temporal !== 'undefined'),
  },
  {
    name: 'Iterator helpers',
    route: '/iterator-helpers',
    technique: 'Iterator.prototype.map/.filter/.take',
    description: 'A lazy, chained transform over an infinite generator — no intermediate arrays.',
    supported: detect(
      () =>
        typeof IteratorCtor !== 'undefined' && typeof IteratorCtor.prototype?.map === 'function',
    ),
  },
  {
    name: 'Top-level await',
    route: '/top-level-await',
    technique: 'await (module scope) + <Suspense>',
    description: 'A component that awaits real async config before it ever renders.',
    supported: true,
  },
]
</script>

<template>
  <p class="index-note">
    The dot in front of each row shows whether that page's headline technique is supported in
    <strong>the browser viewing this page right now</strong> — live-detected, not a claim from a
    table someone forgot to update.
  </p>

  <table>
    <thead>
      <tr>
        <th scope="col"><span class="sr-only">Support in this browser</span></th>
        <th scope="col">Demo</th>
        <th scope="col">Technique</th>
        <th scope="col">What it shows</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="demo in demos" :key="demo.route">
        <td class="support-cell">
          <span
            class="dot"
            :class="demo.supported ? 'is-yes' : 'is-no'"
            :title="demo.supported ? 'Supported in this browser' : 'Not supported in this browser'"
          ></span>
        </td>
        <td>
          <RouterLink :to="demo.route">{{ demo.name }}</RouterLink>
        </td>
        <td>
          <code>{{ demo.technique }}</code>
        </td>
        <td>{{ demo.description }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.index-note {
  font-size: 0.85em;
  color: color-mix(in srgb, currentColor 65%, transparent);
  margin-block-end: 1rem;
  max-width: 60ch;
}

.support-cell {
  width: 1.5rem;
}

.dot {
  display: inline-block;
  inline-size: 0.6rem;
  block-size: 0.6rem;
  border-radius: 50%;
}

.is-yes {
  background: #2fa84f;
}

.is-no {
  background: #e6a935;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
</style>
