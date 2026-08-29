<script setup lang="ts">
import { computed, ref } from 'vue'
import SupportBadge from '@/components/SupportBadge.vue'

// Feature-detect rather than assume — Temporal is newer and less universally shipped.
const hasTemporal = typeof (globalThis as { Temporal?: unknown }).Temporal !== 'undefined'

const zones = ['UTC', 'America/New_York', 'Europe/Bucharest', 'Asia/Tokyo']
const selectedZone = ref('Europe/Bucharest')

const now = ref<string>('')
const nowInZone = ref<string>('')
const monthFromNow = ref<string>('')
const daysUntilNewYear = ref<number | null>(null)
const durationBreakdown = ref<string>('')

function refresh() {
  if (!hasTemporal) return

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const T = (globalThis as any).Temporal

  const instant = T.Now.instant()
  now.value = instant.toString()

  const zoned = T.Now.zonedDateTimeISO(selectedZone.value)
  nowInZone.value = zoned.toPlainDateTime().toString().slice(0, 19).replace('T', ' ')

  // "a month from now, end of day" — DST-safe, calendar-aware
  monthFromNow.value = zoned
    .add({ months: 1 })
    .with({ hour: 23, minute: 59, second: 0 })
    .toPlainDate()
    .toString()

  const today = T.Now.plainDateISO()
  const newYear = T.PlainDate.from({ year: today.year + 1, month: 1, day: 1 })
  const untilNewYear = today.until(newYear, { largestUnit: 'days' })
  daysUntilNewYear.value = untilNewYear.days

  // Calendar-aware duration — hard to get right with plain millisecond math
  // (variable month/DST length).
  const dur = T.Duration.from({ hours: 51, minutes: 95 }).round({
    largestUnit: 'days',
    relativeTo: today,
  })
  durationBreakdown.value = `${dur.days}d ${dur.hours}h ${dur.minutes}m`
}

refresh()

const zoneOffset = computed(() => {
  if (!hasTemporal) return ''
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const T = (globalThis as any).Temporal
  return T.Now.zonedDateTimeISO(selectedZone.value).offset
})
</script>

<template>
  <h2>The Temporal API</h2>
  <p class="description">
    A calendar-and-timezone-aware, immutable replacement for <code>Date</code> — built into the
    language, no <code>date-fns</code>/<code>Luxon</code> import required. Unlike the rest of this
    showcase, this page is <strong>all JavaScript</strong>: every value below is computed live in
    your browser with <code>Temporal.*</code> calls, not hand-rolled date math.
  </p>

  <template v-if="hasTemporal">
    <SupportBadge :supported="true" feature="Temporal" />

    <div class="demo-grid">
      <div class="stat">
        <span class="label">Exact instant (UTC)</span>
        <code>{{ now }}</code>
      </div>

      <div class="stat">
        <span class="label">
          Local wall-clock time in
          <select v-model="selectedZone" @change="refresh">
            <option v-for="z in zones" :key="z" :value="z">{{ z }}</option>
          </select>
        </span>
        <code>{{ nowInZone }} <small>(UTC{{ zoneOffset }})</small></code>
      </div>

      <div class="stat">
        <span class="label">One calendar month from now, end of day, in that zone</span>
        <code>{{ monthFromNow }}</code>
      </div>

      <div class="stat">
        <span class="label">Days until Jan 1 next year</span>
        <code>{{ daysUntilNewYear }} days</code>
      </div>

      <div class="stat">
        <span class="label">51h 95m, rounded to largest sensible units</span>
        <code>{{ durationBreakdown }}</code>
      </div>
    </div>

    <pre><code>const zoned = Temporal.Now.zonedDateTimeISO('Europe/Bucharest')

// DST-safe, calendar-aware arithmetic — chainable, immutable
const later = zoned
  .add({ months: 1 })
  .with({ hour: 23, minute: 59, second: 0 })

const today = Temporal.Now.plainDateISO()
const newYear = Temporal.PlainDate.from({ year: today.year + 1, month: 1, day: 1 })
today.until(newYear, { largestUnit: 'days' }).days // -&gt; e.g. 127

Temporal.Duration.from({ hours: 51, minutes: 95 })
  .round({ largestUnit: 'days', relativeTo: today }) // -&gt; 2d 3h 35m</code></pre>
  </template>

  <template v-else>
    <SupportBadge :supported="false" feature="Temporal" />

    <div class="unsupported">
      <p>
        This browser feature-detects with <code>typeof Temporal !== 'undefined'</code> rather than
        assuming support, exactly the way you'd gate it in production — and here that check fails.
        That's the accurate, unglamorous reality of a Stage-4 feature mid-rollout: it isn't a binary
        "modern browsers have it" yet, even among evergreen browsers on the same engine family.
      </p>
    </div>
  </template>

  <p class="support-note">
    Reached TC39 Stage 4 (part of the ES2026 spec) in March 2026. Firefox shipped it first, in
    version 139 (2025); Chrome followed in Chrome 144 (January 2026).
    <strong>Edge, despite sharing Chrome's engine, has not enabled it in its stable channel as of this
      writing</strong>
    — it's a good reminder that "same rendering engine" doesn't mean "same feature flags," and that
    Baseline status (not just "which engine") is the thing to check before relying on something.
    Safari is further behind, with support landing incrementally in Technology Preview. Feature-
    detect (<code>typeof Temporal !== 'undefined'</code>) rather than sniffing the browser, and
    reach for the
    <a href="https://tc39.es/proposal-temporal/docs/" target="_blank" rel="noopener">official TC39 polyfill</a>
    to cover the gap in the meantime.
  </p>
</template>

<style scoped>
.demo-grid {
  display: grid;
  gap: 0.85rem;
  margin-block-end: 1.5rem;
}

.stat {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 1rem;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  padding: 0.75rem 1rem;
  background: var(--surface);
}

.label {
  font-size: 0.85em;
  color: color-mix(in srgb, currentColor 70%, transparent);
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.stat code {
  font-size: 0.95em;
  white-space: nowrap;
}

.stat code small {
  color: color-mix(in srgb, currentColor 55%, transparent);
}

select {
  font: inherit;
  font-size: 0.95em;
  color: inherit;
  background: canvas;
  border: 1px solid var(--border-strong);
  border-radius: calc(var(--radius) - 2px);
  padding: 0.15rem 0.4rem;
}

.unsupported {
  border: 1px dashed var(--border-strong);
  border-radius: var(--radius);
  padding: 1rem 1.2rem;
  margin-block-end: 1.5rem;
  color: color-mix(in srgb, currentColor 75%, transparent);
}

.support-note {
  color: color-mix(in srgb, currentColor 65%, transparent);
  font-size: 0.85em;
}
</style>
