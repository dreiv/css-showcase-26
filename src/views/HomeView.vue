<script setup lang="ts">
interface Demo {
  name: string
  route: string
  technique: string
  description: string
}

const demos: Demo[] = [
  {
    name: 'Accordion',
    route: '/accordion',
    technique: '::details-content + interpolate-size',
    description: 'Native <details>/<summary> with an animated open/close height, no JS.',
  },
  {
    name: 'Data table',
    route: '/data-table',
    technique: 'Popover API + anchor positioning',
    description: 'Sortable, filterable table. Filtering opens a popover anchored to the button.',
  },
  {
    name: 'Auto-grow textarea',
    route: '/auto-grow-textarea',
    technique: 'field-sizing: content',
    description: 'A <textarea> that grows with its content — one CSS declaration.',
  },
  {
    name: 'Position-try fallbacks',
    route: '/position-try-fallbacks',
    technique: 'anchor-name + position-try-fallbacks',
    description: 'Anchored tooltips that flip themselves back into the viewport.',
  },
  {
    name: 'Styled select',
    route: '/styled-select',
    technique: 'appearance: none',
    description: 'A restyled native <select>, using only the widely-supported technique.',
  },
  {
    name: 'Popover playground',
    route: '/popover-playground',
    technique: 'Popover API + anchor positioning',
    description: 'Drag the anchor, pick a preferred side — the popover follows and self-flips.',
  },
  {
    name: 'Modal',
    route: '/modal',
    technique: 'command / commandfor',
    description: 'Declarative dialog triggering with the Invoker Commands API — no JS handlers.',
  },
  {
    name: 'aspect-ratio',
    route: '/aspect-ratio',
    technique: 'aspect-ratio',
    description: 'Locked-ratio boxes, media embeds and object-fit cropping, no padding hack.',
  },
  {
    name: 'Container queries',
    route: '/container-queries',
    technique: 'container-type + @container',
    description: "A card that reflows based on its own container's width, not the viewport.",
  },
  {
    name: ':has() selector',
    route: '/has-selector',
    technique: ':has()',
    description: 'Five patterns: rating stars, live validation, cards, quantity queries, content.',
  },
]
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>Demo</th>
        <th>Technique</th>
        <th>What it shows</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="demo in demos" :key="demo.route">
        <td><RouterLink :to="demo.route">{{ demo.name }}</RouterLink></td>
        <td><code>{{ demo.technique }}</code></td>
        <td>{{ demo.description }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped></style>
