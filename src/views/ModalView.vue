<script setup lang="ts">
import SupportBadge from '@/components/SupportBadge.vue'

const hasInvokerCommands =
  typeof HTMLButtonElement !== 'undefined' && 'command' in HTMLButtonElement.prototype
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
  </div>

  <dialog id="confirm-dialog" closedby="any" class="modal modal--danger">
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
        <button type="submit" command="close" commandfor="info-dialog">Got it</button>
      </div>
    </form>
  </dialog>

  <pre><code>&lt;button command="show-modal" commandfor="confirm-dialog"&gt;
  Delete project…
&lt;/button&gt;

&lt;dialog id="confirm-dialog" closedby="any"&gt;
  &lt;form method="dialog"&gt;
    …
    &lt;button command="close" commandfor="confirm-dialog"&gt;Cancel&lt;/button&gt;
  &lt;/form&gt;
&lt;/dialog&gt;</code></pre>

  <p class="support-note">
    <code>command</code>/<code>commandfor</code> shipped in Chromium first, so the badge above may
    read differently depending on which browser opened this page — if it's unsupported, the buttons
    above are inert no-ops. Pair with a tiny progressive-enhancement JS fallback (feature-detect
    <code>"command" in HTMLButtonElement.prototype</code>, same check the badge uses) if you need
    this working everywhere today.
  </p>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-block-end: 1.5rem;
}

/* --- the dialog itself --- */
.modal {
  border: 1px solid var(--border-strong);
  border-radius: 1rem;
  padding: 1.4rem 1.6rem;
  width: min(90vw, 420px);
  background: canvas;
  color: inherit;
  box-shadow: 0 20px 60px rgb(0 0 0 / 25%);

  /* Entry/exit animation: transition overlay/display (allow-discrete) alongside
     opacity/scale so the top-layer element animates in and out. */
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

.modal h3 {
  margin-block: 0 0.6rem;
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
  gap: 0.6rem;
  margin-block-start: 1.1rem;
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
