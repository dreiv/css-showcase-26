<script setup lang="ts">
import { computed, ref } from 'vue'
import SupportBadge from '@/components/SupportBadge.vue'

const hasTemporal = typeof (globalThis as { Temporal?: unknown }).Temporal !== 'undefined'

interface City {
  label: string
  tz: string
}

const cities: City[] = [
  { label: 'Bucharest', tz: 'Europe/Bucharest' },
  { label: 'London', tz: 'Europe/London' },
  { label: 'New York', tz: 'America/New_York' },
  { label: 'Tokyo', tz: 'Asia/Tokyo' },
  { label: 'Sydney', tz: 'Australia/Sydney' },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const T = hasTemporal ? (globalThis as any).Temporal : null
const today = hasTemporal ? T.Now.plainDateISO() : null

const meetingDate = ref(today ? today.toString() : '')
const meetingTime = ref('14:00')
const organizerTz = ref('Europe/Bucharest')

const meetingZoned = computed(() => {
  if (!hasTemporal || !meetingDate.value || !meetingTime.value) return null
  return T.ZonedDateTime.from(`${meetingDate.value}T${meetingTime.value}[${organizerTz.value}]`)
})

const cityTimes = computed(() => {
  const zoned = meetingZoned.value
  if (!zoned) return []
  return cities.map((city) => {
    const converted = zoned.withTimeZone(city.tz)
    const dayShift = converted.toPlainDate().since(zoned.toPlainDate()).days
    return {
      ...city,
      time: converted.toPlainTime().toString().slice(0, 5),
      dayShift,
    }
  })
})

const durationBreakdown = computed(() => {
  if (!hasTemporal) return ''
  const dur = T.Duration.from({ hours: 51, minutes: 95 }).round({
    largestUnit: 'days',
    relativeTo: today,
  })
  return `${dur.days}d ${dur.hours}h ${dur.minutes}m`
})
</script>

<template>
  <h2>The Temporal API</h2>
  <p class="description">
    A calendar-and-timezone-aware, immutable replacement for <code>Date</code> — built into the
    language, no <code>date-fns</code>/<code>Luxon</code> import required. Every value below is
    computed live with <code>Temporal.*</code> calls, not hand-rolled date math.
  </p>

  <template v-if="hasTemporal">
    <SupportBadge :supported="true" feature="Temporal" />

    <h2>Schedule a meeting, see it land everywhere</h2>
    <p class="description">
      Pick a date, time and your zone — every city converts it with real IANA time zone rules
      (DST included), and flags whenever the meeting lands on a different calendar day there.
    </p>

    <div class="meeting-controls">
      <label>
        Date
        <input type="date" v-model="meetingDate" />
      </label>
      <label>
        Time
        <input type="time" v-model="meetingTime" />
      </label>
      <label>
        Your zone
        <select v-model="organizerTz">
          <option v-for="c in cities" :key="c.tz" :value="c.tz">{{ c.label }}</option>
        </select>
      </label>
    </div>

    <div class="city-grid">
      <div v-for="c in cityTimes" :key="c.tz" class="city" :class="{ 'city--organizer': c.tz === organizerTz }">
        <span class="city-label">{{ c.label }}</span>
        <span class="city-time">{{ c.time }}</span>
        <span v-if="c.dayShift !== 0" class="day-shift">
          {{ c.dayShift > 0 ? '+1 day' : '−1 day' }}
        </span>
      </div>
    </div>

    <pre><code>const meeting = Temporal.ZonedDateTime.from(
  `${date}T${time}[${organizerZone}]`
)

const tokyo = meeting.withTimeZone('Asia/Tokyo')
tokyo.toPlainDate().since(meeting.toPlainDate()).days // -&gt; 0 or ±1 if it crosses midnight</code></pre>

    <h2>Calendar-aware duration</h2>
    <p class="description">
      <code>51h 95m</code> doesn't roll over on its own — <code>Duration.round()</code> normalizes
      it to sensible units, DST and variable-month-length aware given a <code>relativeTo</code>
      date.
    </p>

    <div class="stat">
      <span class="label">51h 95m, rounded to largest sensible units</span>
      <code>{{ durationBreakdown }}</code>
    </div>

    <pre><code>Temporal.Duration.from({ hours: 51, minutes: 95 })
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
h2:not(:first-child) {
  margin-block-start: 2rem;
}

.meeting-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-block-end: 1.25rem;
}

.meeting-controls label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.85em;
  color: color-mix(in srgb, currentColor 70%, transparent);
}

.meeting-controls input,
.meeting-controls select {
  font: inherit;
  font-size: 0.95em;
  color: inherit;
  background: canvas;
  border: 1px solid var(--border-strong);
  border-radius: calc(var(--radius) - 2px);
  padding: 0.35rem 0.5rem;
}

.city-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;
  margin-block-end: 1.5rem;
}

.city {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  padding: 0.75rem 0.9rem;
  background: var(--surface);
}

.city--organizer {
  border-color: currentColor;
}

.city-label {
  font-size: 0.8em;
  color: color-mix(in srgb, currentColor 65%, transparent);
}

.city-time {
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 1.15em;
  font-weight: 600;
}

.day-shift {
  align-self: flex-start;
  font-size: 0.72em;
  font-weight: 600;
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  background: color-mix(in srgb, orange 25%, canvas);
  color: color-mix(in srgb, orange 70%, currentColor);
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
  margin-block-end: 1.5rem;
}

.label {
  font-size: 0.85em;
  color: color-mix(in srgb, currentColor 70%, transparent);
}

.stat code {
  font-size: 0.95em;
  white-space: nowrap;
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
