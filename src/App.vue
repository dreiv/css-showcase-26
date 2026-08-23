<script setup lang="ts"></script>

<template>
  <header>
    <h1>CSS Showcase 26</h1>
    <p class="description">Modern, (mostly) JS-free CSS techniques.</p>
    <nav class="site-nav">
      <RouterLink to="/">Index</RouterLink>
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
    </nav>
  </header>

  <RouterView />
</template>

<style scoped></style>
