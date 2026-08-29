<script setup lang="ts">
import { ref } from 'vue'

const items = ref([1, 2, 3])

function addItem() {
  items.value.push(items.value.length + 1)
}
function removeItem() {
  if (items.value.length > 0) items.value.pop()
}
</script>

<template>
  <h2>:has() — the "parent selector"</h2>
  <p class="description">
    <code>:has()</code> matches an element if a selector inside it matches something —
    effectively letting CSS reach "upward" or "sideways" for the first time. Six different jobs
    below, all the same primitive.
  </p>

  <h3>1. Star rating (sibling state, no JS)</h3>
  <p class="mini">
    Hovering a star highlights it <em>and every star before it</em> — normally impossible with
    plain CSS, since sibling combinators only reach forward. <code>:has(~ .star:hover)</code>
    lets each star check its later siblings and light up if any of them are hovered.
  </p>
  <fieldset class="rating" aria-label="Rate this demo">
    <template v-for="n in [1, 2, 3, 4, 5]" :key="n">
      <input type="radio" name="rating" :id="`star-${n}`" :value="n" class="star-input" />
      <label :for="`star-${n}`" class="star" :aria-label="`${n} star${n > 1 ? 's' : ''}`">★</label>
    </template>
  </fieldset>
  <pre><code>/* light up this star if it's hovered, or if any star after it in the
    DOM (i.e. to its right) is hovered */
    .star:has(~ .star:hover),
    .star:hover {
    color: var(--accent);
    }</code></pre>

  <h3>2. Live validation (style the wrapper from the input's state)</h3>
  <p class="mini">
    The field's border/icon react to <code>:invalid</code> deep inside it — previously this needed
    a JS class toggle on blur/input.
  </p>
  <form class="validation-demo" @submit.prevent>
    <label class="field-wrap">
      <span>Email</span>
      <input type="email" required placeholder="you@example.com" />
    </label>
    <label class="field-wrap">
      <span>Age (18+)</span>
      <input type="number" min="18" required placeholder="18" />
    </label>
  </form>
  <pre><code>.field-wrap:has(:invalid:not(:placeholder-shown)) {
    border-color: crimson;
    }
    .field-wrap:has(:valid:not(:placeholder-shown)) {
    border-color: seagreen;
    }</code></pre>

  <h3>3. Selectable cards (custom radio group)</h3>
  <p class="mini">
    Each card is a <code>&lt;label&gt;</code> wrapping a hidden radio;
    <code>label:has(:checked)</code> styles the whole card as "selected".
  </p>
  <div class="plan-grid">
    <label class="plan" v-for="plan in ['Basic', 'Pro', 'Team']" :key="plan">
      <input type="radio" name="plan" :value="plan" :checked="plan === 'Pro'" />
      <span class="plan-name">{{ plan }}</span>
    </label>
  </div>
  <pre><code>.plan:has(:checked) {
    border-color: var(--accent);
    background: color-mix(in srgb, var(--accent) 8%, transparent);
    }</code></pre>

  <h3>4. Quantity query (layout depends on child count)</h3>
  <p class="mini">
    <code>:has(:nth-child(4))</code> flips the grid to a denser layout once there are 4+ items —
    no JS counting <code>children.length</code>.
  </p>
  <div class="qty-controls">
    <button type="button" @click="removeItem">− Remove</button>
    <button type="button" @click="addItem">+ Add</button>
  </div>
  <ul class="qty-grid" :class="{ empty: items.length === 0 }">
    <li v-for="i in items" :key="i">Item {{ i }}</li>
    <li v-if="items.length === 0" class="empty-note">No items — add one above.</li>
  </ul>
  <pre><code>.qty-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    }
    /* once a 4th item shows up, go denser */
    .qty-grid:has(> :nth-child(4)) {
    grid-template-columns: repeat(4, 1fr);
    }
    /* style the list itself when it has *no* real items */
    .qty-grid:not(:has(li:not(.empty-note))) {
    display: block;
    }</code></pre>

  <h3>5. Content-aware layout (style based on what's inside)</h3>
  <p class="mini">
    An article with a leading image gets a hero treatment; a text-only one gets a plain layout —
    same component, no modifier class needed.
  </p>
  <div class="content-grid">
    <article class="post">
      <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=240&q=60" alt="" loading="lazy" />
      <div>
        <h4>With a cover image</h4>
        <p>The <code>:has(img)</code> match switches this to a two-column layout.</p>
      </div>
    </article>
    <article class="post">
      <div>
        <h4>Text-only post</h4>
        <p>No image inside, so it falls back to the plain single-column layout.</p>
      </div>
    </article>
  </div>
  <pre><code>.post:has(img) {
    grid-template-columns: 96px 1fr;
    }</code></pre>

</template>

<style scoped>
h2 {
  margin-block-end: 0.5rem;
}

h3 {
  font-size: 1rem;
  margin-block: 1.75rem 0.35rem;
}

.mini {
  margin-block: 0 0.75rem;
  font-size: 0.88em;
  color: color-mix(in srgb, currentColor 65%, transparent);
}

pre {
  margin-block-end: 0.25rem;
}

.rating {
  display: inline-flex;
  gap: 0.15rem;
  border: none;
  padding: 0;
  margin: 0 0 1rem;
  width: max-content;
  font-size: 1.6rem;
}

.star-input {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}

.star {
  cursor: pointer;
  color: color-mix(in srgb, currentColor 25%, transparent);
  transition: color 0.1s ease;
}

.star:hover,
.star:has(~ .star:hover) {
  color: var(--accent);
}

.star:has(~ .star-input:checked),
.star-input:checked+.star {
  color: var(--accent);
}

.validation-demo {
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
  margin-block-end: 0.75rem;
}

.field-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.9em;
  font-weight: 600;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  padding: 0.6rem 0.75rem;
  transition: border-color 0.15s ease;
}

.field-wrap input {
  border: none;
  padding: 0;
  background: transparent;
}

.field-wrap:has(:invalid:not(:placeholder-shown)) {
  border-color: color-mix(in srgb, crimson 60%, var(--border-strong));
}

.field-wrap:has(:valid:not(:placeholder-shown)) {
  border-color: color-mix(in srgb, seagreen 60%, var(--border-strong));
}

.plan-grid {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-block-end: 0.75rem;
}

.plan {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  padding: 0.6rem 1rem;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background 0.15s ease;
}

.plan:has(:checked) {
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 8%, transparent);
}

.plan-name {
  font-weight: 600;
  font-size: 0.9em;
}

.qty-controls {
  display: flex;
  gap: 0.6rem;
  margin-block-end: 0.75rem;
}

.qty-grid {
  list-style: none;
  margin: 0 0 0.75rem;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.6rem;
}

.qty-grid>li:not(.empty-note) {
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  padding: 0.6rem 0.8rem;
  font-size: 0.9em;
  text-align: center;
  background: var(--surface);
}

.qty-grid:has(> :nth-child(4)) {
  grid-template-columns: repeat(4, 1fr);
}

.empty-note {
  color: color-mix(in srgb, currentColor 55%, transparent);
  font-size: 0.9em;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-block-end: 0.75rem;
}

@media (max-width: 640px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

.post {
  display: grid;
  gap: 0.75rem;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  padding: 0.9rem;
}

.post:has(img) {
  grid-template-columns: 96px 1fr;
  align-items: center;
}

.post img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: calc(var(--radius) - 2px);
}

.post h4 {
  margin: 0 0 0.3rem;
  font-size: 0.95em;
}

.post p {
  margin: 0;
  font-size: 0.85em;
  color: color-mix(in srgb, currentColor 70%, transparent);
}
</style>
