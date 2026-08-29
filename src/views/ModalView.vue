<script setup lang="ts">
import { useTemplateRef } from 'vue'
import SupportBadge from '@/components/SupportBadge.vue'

const hasInvokerCommands =
  typeof HTMLButtonElement !== 'undefined' && 'command' in HTMLButtonElement.prototype

// Everything below is native <dialog> + CSS; the ref only lets something outside a click
// (a script, an API response, another component) open it too.
const refDialogEl = useTemplateRef<HTMLDialogElement>('refDialog')

function openRefDialog() {
  refDialogEl.value?.showModal()
}

function closeRefDialog() {
  refDialogEl.value?.close()
}
</script>

<template>
  <h2>Triggering a modal, the 2026 way</h2>
  <p class="description">
    No <code>@click</code>, no <code>showModal()</code> call, no ref. A button with
    <code>command="show-modal"</code> and <code>commandfor="the-dialog-id"</code> opens a
    <code>&lt;dialog&gt;</code> declaratively — the
    <a href="https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API" target="_blank"
      rel="noopener">Invoker Commands API</a>. The dialog closes itself the same way, plus light-dismiss via
    <code>closedby="any"</code>
    (click the backdrop or hit Esc) — all wired up in HTML, none of it in this file's
    <code>&lt;script&gt;</code> block.
  </p>

  <SupportBadge :supported="hasInvokerCommands" feature="command / commandfor" />

  <div class="demo-row">
    <button type="button" command="show-modal" commandfor="confirm-dialog">Delete project…</button>

    <button type="button" command="show-modal" commandfor="info-dialog">Show details</button>

    <button type="button" @click="openRefDialog">Open via Vue ref</button>
  </div>

  <dialog id="confirm-dialog" closedby="any" class="modal modal--danger">
    <button type="button" class="modal-close" command="close" commandfor="confirm-dialog" aria-label="Close">
      ×
    </button>
    <form method="dialog">
      <h3>Delete "css-showcase-26"?</h3>
      <p>This can't be undone. The repo and its history will be permanently removed.</p>
      <div class="modal-actions">
        <button type="submit" command="close" commandfor="confirm-dialog">Cancel</button>
        <button type="submit" class="danger" command="close" commandfor="confirm-dialog">
          Delete
        </button>
      </div>
    </form>
  </dialog>

  <dialog id="info-dialog" closedby="any" class="modal">
    <button type="button" class="modal-close" command="close" commandfor="info-dialog" aria-label="Close">
      ×
    </button>
    <form method="dialog">
      <h3>Why <code>command</code>/<code>commandfor</code>?</h3>
      <p>
        Before this API, a "modern" modal still needed a click handler that called
        <code>dialog.showModal()</code> — the markup and the behavior lived in two places. Now the
        trigger declares its own intent, the same way a plain link declares where it goes.
      </p>
      <p class="mini">
        Built-in commands cover <code>show-modal</code>, <code>close</code>,
        <code>request-close</code>, plus popovers' <code>toggle-popover</code>,
        <code>show-popover</code> and <code>hide-popover</code>. Custom commands
        (<code>--my-command</code>) fire a <code>command</code> event you can still listen for in
        JS, for anything beyond open/close.
      </p>
      <div class="modal-actions">
        <button type="button" command="show-modal" commandfor="nested-dialog">
          Show advanced settings…
        </button>
        <button type="submit" command="close" commandfor="info-dialog">Got it</button>
      </div>
    </form>
  </dialog>

  <!-- Nested modal: opened from inside info-dialog, stacked above it in the top layer. -->
  <dialog id="nested-dialog" closedby="any" class="modal modal--nested">
    <button type="button" class="modal-close" command="close" commandfor="nested-dialog" aria-label="Close">
      ×
    </button>
    <form method="dialog">
      <h3>Advanced settings</h3>
      <p>
        A second <code>&lt;dialog&gt;</code>, opened on top of the first with its own
        <code>command="show-modal"</code> trigger. Both live in the browser's top layer, so
        stacking, backdrop and focus trapping all come free — no z-index juggling.
      </p>
      <div class="modal-actions">
        <button type="submit" command="close" commandfor="nested-dialog">Done</button>
      </div>
    </form>
  </dialog>

  <!-- Vue-controlled: opened imperatively via a ref, for triggers that aren't a nearby
       click (route change, validation failure, API response). -->
  <dialog id="ref-dialog" ref="refDialog" closedby="any" class="modal">
    <button type="button" class="modal-close" command="close" commandfor="ref-dialog" aria-label="Close">
      ×
    </button>
    <form method="dialog">
      <h3>Controlled via template ref</h3>
      <p>
        Opened by calling <code>refDialogEl.value.showModal()</code> from
        <code>&lt;script setup&gt;</code>. Notice the close button above still uses
        <code>command="close" commandfor="ref-dialog"</code> — declarative close works fine
        regardless of how the dialog was opened, since it's the same native element either way.
      </p>
      <div class="modal-actions">
        <button type="button" @click="closeRefDialog">Close via ref</button>
      </div>
    </form>
  </dialog>

  <pre><code>&lt;button command="show-modal" commandfor="confirm-dialog"&gt;
  Delete project…
&lt;/button&gt;

&lt;dialog id="confirm-dialog" closedby="any"&gt;
  &lt;button class="modal-close" command="close" commandfor="confirm-dialog"&gt;×&lt;/button&gt;
  &lt;form method="dialog"&gt;
    …
    &lt;button command="close" commandfor="confirm-dialog"&gt;Cancel&lt;/button&gt;
  &lt;/form&gt;
&lt;/dialog&gt;

&lt;!-- nested: a trigger living inside another dialog --&gt;
&lt;button command="show-modal" commandfor="nested-dialog"&gt;Show advanced settings…&lt;/button&gt;
&lt;dialog id="nested-dialog" closedby="any"&gt;…&lt;/dialog&gt;

&lt;!-- Vue-controlled --&gt;
&lt;script setup&gt;
const refDialogEl = useTemplateRef('refDialog')
function open() { refDialogEl.value?.showModal() }
&lt;/script&gt;

&lt;dialog ref="refDialog" id="ref-dialog"&gt;…&lt;/dialog&gt;</code></pre>

  <p class="support-note">
    <code>command</code>/<code>commandfor</code> shipped in Chromium first, so the badge above may
    read differently depending on which browser opened this page — if it's unsupported, the buttons
    above are inert no-ops. Pair with a tiny progressive-enhancement JS fallback (feature-detect
    <code>"command" in HTMLButtonElement.prototype</code>, same check the badge uses) if you need
    this working everywhere today. The ref-controlled dialog's <code>showModal()</code>/
    <code>close()</code> calls are plain DOM methods and work regardless of that support.
  </p>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-block-end: 1.5rem;
}

.modal {
  position: relative;
  border: 1px solid var(--border-strong);
  border-radius: 1rem;
  padding: 1.4rem 1.6rem;
  width: min(90vw, 420px);
  background: canvas;
  color: inherit;
  box-shadow: 0 20px 60px rgb(0 0 0 / 25%);

  /* overlay/display need allow-discrete to animate the top-layer element in/out. */
  opacity: 0;
  scale: 0.96;
  transition:
    opacity 0.2s ease,
    scale 0.2s ease,
    overlay 0.2s allow-discrete,
    display 0.2s allow-discrete;
}

.modal[open] {
  opacity: 1;
  scale: 1;
}

@starting-style {
  .modal[open] {
    opacity: 0;
    scale: 0.96;
  }
}

.modal::backdrop {
  background: rgb(0 0 0 / 45%);
  backdrop-filter: blur(2px);
  opacity: 0;
  transition:
    opacity 0.2s ease,
    overlay 0.2s allow-discrete,
    display 0.2s allow-discrete;
}

.modal[open]::backdrop {
  opacity: 1;
}

@starting-style {
  .modal[open]::backdrop {
    opacity: 0;
  }
}

.modal--nested::backdrop {
  background: rgb(0 0 0 / 55%);
}

.modal h3 {
  margin-block: 0 0.6rem;
  padding-right: 1.5rem;
}

.modal p {
  margin-block: 0 0.5rem;
  color: color-mix(in srgb, currentColor 75%, transparent);
}

.modal .mini {
  font-size: 0.85em;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-block-start: 1.1rem;
}

/* Drawn as two crossed lines, not an "×" glyph — glyph metrics vary by font and rarely center. */
.modal-close {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  width: 1.75rem;
  height: 1.75rem;
  padding: 0;
  border: 1px solid var(--border-strong);
  border-radius: 0.35rem;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: 0;
  /* hide the × fallback char, kept in markup for a11y */
}

.modal-close::before,
.modal-close::after {
  content: '';
  position: absolute;
  inset: 0;
  margin: auto;
  width: 0.8rem;
  height: 1.5px;
  background: currentColor;
}

.modal-close::before {
  rotate: 45deg;
}

.modal-close::after {
  rotate: -45deg;
}

.modal-close:hover {
  background: var(--surface-hover);
}

.modal-close:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.danger {
  background: color-mix(in srgb, crimson 15%, canvas);
  border-color: color-mix(in srgb, crimson 45%, var(--border-strong));
  color: color-mix(in srgb, crimson 70%, currentColor);
}

.danger:hover {
  background: color-mix(in srgb, crimson 25%, canvas);
}

.support-note {
  margin-block-start: 1.25rem;
  color: color-mix(in srgb, currentColor 65%, transparent);
  font-size: 0.85em;
}
</style>
