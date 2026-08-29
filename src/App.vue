<script setup lang="ts"></script>

<template>
  <header>
    <h1>CSS Showcase 26</h1>
    <p class="description">
      Modern cross-browser CSS techniques, plus a few JS ones worth knowing.
    </p>
    <nav class="site-nav">
      <RouterLink to="/">Index</RouterLink>
      <span class="nav-group-label">CSS</span>
      <RouterLink to="/accordion">Accordion</RouterLink>
      <RouterLink to="/data-table">Data table</RouterLink>
      <RouterLink to="/auto-grow-textarea">Auto-grow textarea</RouterLink>
      <RouterLink to="/position-try-fallbacks">Position-try fallbacks</RouterLink>
      <RouterLink to="/styled-select">Styled select</RouterLink>
      <RouterLink to="/popover-playground">Popover playground</RouterLink>
      <RouterLink to="/modal">Modal</RouterLink>
      <RouterLink to="/aspect-ratio">aspect-ratio</RouterLink>
      <RouterLink to="/container-queries">Container queries</RouterLink>
      <RouterLink to="/has-selector">:has()</RouterLink>
      <RouterLink to="/scroll-animations">Scroll-driven animations</RouterLink>
      <RouterLink to="/contrast-color">contrast-color()</RouterLink>
      <RouterLink to="/view-transitions">View Transitions</RouterLink>
      <RouterLink to="/relative-color">Relative color syntax</RouterLink>
      <span class="nav-group-label">JS</span>
      <RouterLink to="/temporal">Temporal</RouterLink>
      <RouterLink to="/iterator-helpers">Iterator helpers</RouterLink>
      <RouterLink to="/top-level-await">Top-level await</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
.nav-group-label {
  display: inline-block;
  font-size: 0.7em;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: color-mix(in srgb, currentColor 55%, transparent);
  margin-inline-start: 0.5rem;
  padding-inline-end: 0.25rem;
  align-self: center;
}
</style>
