<script setup lang="ts">
import { ref } from 'vue'
import SupportBadge from '@/components/SupportBadge.vue'

const hasContrastColor =
  typeof CSS !== 'undefined' && CSS.supports('color', 'contrast-color(white)')

interface Badge {
  label: string
  bg: string
}

const badges: Badge[] = [
  { label: 'Success', bg: '#16a34a' },
  { label: 'Warning', bg: '#d97706' },
  { label: 'Danger', bg: '#dc2626' },
  { label: 'Info', bg: '#2563eb' },
  { label: 'Brand', bg: '#7c3aed' },
  { label: 'Neutral', bg: '#475569' },
  { label: 'Highlight', bg: '#facc15' },
  { label: 'Pale', bg: '#f1f5f9' },
]

interface Avatar {
  name: string
  bg: string
}

const avatars: Avatar[] = [
  { name: 'Ana Pop', bg: '#f97316' },
  { name: 'Bogdan Ionescu', bg: '#0891b2' },
  { name: 'Corina Marin', bg: '#a3e635' },
  { name: 'David Stan', bg: '#1e293b' },
  { name: 'Elena Radu', bg: '#f472b6' },
  { name: 'Filip Ursu', bg: '#fde047' },
]

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

const custom = ref('#3562e6')
</script>

<template>
  <h2><code>contrast-color()</code></h2>
  <p class="description">
    Pass any color in, get back whichever of black or white is more readable on top of it. No more
    maintaining a parallel "is this swatch dark or light" lookup table just to decide label color —
    the browser already knows.
  </p>

  <SupportBadge :supported="hasContrastColor" feature="contrast-color()" />

  <h2>Status badges from any brand color</h2>
  <p class="description">
    Badges are usually themed per status (success, warning, danger…) with a hand-picked text color
    for each one. Here every badge shares one rule — <code>color: contrast-color(var(--bg))</code> —
    and still reads correctly against yellow, slate, or a near-white "Pale" tone.
  </p>

  <div class="badge-row">
    <span v-for="b in badges" :key="b.label" class="badge" :style="{ '--bg': b.bg }">
      {{ b.label }}
    </span>
  </div>

  <h2>Avatar initials on generated colors</h2>
  <p class="description">
    User avatar colors are typically hashed from a name or id, so you can't know them ahead of
    time. <code>contrast-color()</code> means the initials stay legible no matter which color the
    hash lands on.
  </p>

  <div class="avatar-row">
    <div v-for="a in avatars" :key="a.name" class="avatar" :style="{ '--bg': a.bg }" :title="a.name">
      {{ initials(a.name) }}
    </div>
  </div>

  <pre><code>.badge, .avatar {
  background: var(--bg);
  color: contrast-color(var(--bg));
}</code></pre>

  <h2>Try your own color</h2>
  <p class="description">
    The label below is never explicitly styled dark or light — it's always
    <code>contrast-color()</code> of whatever the picker is set to.
  </p>

  <div class="picker-row">
    <input type="color" v-model="custom" aria-label="Pick a background color" />
    <div class="live-swatch" :style="{ background: custom, '--bg': custom }">
      <span>{{ custom }}</span>
    </div>
  </div>

  <p class="support-note">
    Correction to how this was originally described here: <code>contrast-color()</code> is not yet
    Baseline — it has "limited availability" per MDN, not universal support across all four
    browsers. The badge above reflects live detection in whatever browser opened this page, which is
    the accurate way to know, rather than trusting a written claim that goes stale. Feature- detect
    with <code>CSS.supports('color', 'contrast-color(white)')</code> and provide a static fallback
    color (as this page's own CSS does, via the plain-color swatch background) until it's universal.
  </p>
</template>

<style scoped>
h2:not(:first-child) {
  margin-block-start: 2rem;
}

.badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-block-end: 1.5rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.4rem 0.9rem;
  font-size: 0.85em;
  font-weight: 600;

  background: var(--bg);
  color: #000;
  color: contrast-color(var(--bg));
}

.avatar-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-block-end: 1.5rem;
}

.avatar {
  inline-size: 3rem;
  block-size: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9em;
  cursor: default;

  background: var(--bg);
  color: #000;
  color: contrast-color(var(--bg));
}

.picker-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-block-end: 1.5rem;
}

input[type='color'] {
  inline-size: 3rem;
  block-size: 2.4rem;
  padding: 0.2rem;
}

.live-swatch {
  flex: 1;
  min-width: 160px;
  border-radius: var(--radius);
  padding: 1rem 1.2rem;
  font-family: ui-monospace, Menlo, Consolas, monospace;

  background: var(--bg);
  color: #fff;
  text-shadow: 0 1px 2px rgb(0 0 0 / 35%);
  color: contrast-color(var(--bg));
}

.support-note {
  color: color-mix(in srgb, currentColor 65%, transparent);
  font-size: 0.85em;
}
</style>
