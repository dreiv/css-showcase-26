import { computed, ref, type ComponentPublicInstance } from "vue";
import type { SortKey } from "./types";
import {
  ALL_COLUMNS,
  DEFAULT_ORDER,
  DEFAULT_VISIBLE,
  DEFAULT_WIDTHS,
  MIN_COL_WIDTH,
  MAX_COL_WIDTH,
  SESSION_KEYS,
} from "./constants";

function loadSession<T>(key: string, fallback: T): T {
  if (typeof sessionStorage === "undefined") return fallback;
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveSession(key: string, value: unknown) {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable — fine to no-op
  }
}

function clearSession(key: string) {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function useColumnConfig() {
  // Live state — what the table renders with.
  const columnOrder = ref<SortKey[]>(loadSession(SESSION_KEYS.order, DEFAULT_ORDER));
  const columnVisible = ref<Record<SortKey, boolean>>(
    loadSession(SESSION_KEYS.visible, DEFAULT_VISIBLE),
  );
  const columnWidths = ref<Record<SortKey, number>>(
    loadSession(SESSION_KEYS.widths, DEFAULT_WIDTHS),
  );

  // Draft state — edited in the panel, committed on Apply.
  const draftOrder = ref<SortKey[]>([...columnOrder.value]);
  const draftVisible = ref<Record<SortKey, boolean>>({ ...columnVisible.value });

  const draftColumns = computed(() =>
    draftOrder.value.map((key) => ALL_COLUMNS.find((c) => c.key === key)!),
  );
  const draftVisibleCount = computed(
    () => Object.values(draftVisible.value).filter(Boolean).length,
  );

  const visibleColumns = computed(() =>
    columnOrder.value
      .filter((key) => columnVisible.value[key])
      .map((key) => ALL_COLUMNS.find((c) => c.key === key)!),
  );

  const tableWidth = computed(() =>
    visibleColumns.value.reduce((sum, c) => sum + columnWidths.value[c.key], 0),
  );

  function syncDraft() {
    draftOrder.value = [...columnOrder.value];
    draftVisible.value = { ...columnVisible.value };
  }

  function applyColumns() {
    columnOrder.value = [...draftOrder.value];
    columnVisible.value = { ...draftVisible.value };
    saveSession(SESSION_KEYS.order, columnOrder.value);
    saveSession(SESSION_KEYS.visible, columnVisible.value);
  }

  function resetColumns() {
    draftOrder.value = [...DEFAULT_ORDER];
    draftVisible.value = { ...DEFAULT_VISIBLE };
    columnOrder.value = [...DEFAULT_ORDER];
    columnVisible.value = { ...DEFAULT_VISIBLE };
    columnWidths.value = { ...DEFAULT_WIDTHS };
    clearSession(SESSION_KEYS.order);
    clearSession(SESSION_KEYS.visible);
    clearSession(SESSION_KEYS.widths);
  }

  function moveDraft(key: SortKey, dir: -1 | 1) {
    const i = draftOrder.value.indexOf(key);
    const j = i + dir;
    if (j < 0 || j >= draftOrder.value.length) return;
    const copy = [...draftOrder.value];
    const tmp = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = tmp;
    draftOrder.value = copy;
  }

  const dragKey = ref<SortKey | null>(null);
  function onDragStart(key: SortKey) {
    dragKey.value = key;
  }
  function onDrop(targetKey: SortKey) {
    if (!dragKey.value || dragKey.value === targetKey) return;
    const from = draftOrder.value.indexOf(dragKey.value);
    const to = draftOrder.value.indexOf(targetKey);
    const copy = [...draftOrder.value];
    copy.splice(from, 1);
    copy.splice(to, 0, dragKey.value);
    draftOrder.value = copy;
    dragKey.value = null;
  }

  // Width is written straight to the <col> style during the drag (no reactivity,
  // no re-render); reactive state + persistence only happen once, on pointerup.
  const colEls = new Map<SortKey, HTMLTableColElement>();
  function setColEl(key: SortKey, el: Element | null) {
    if (el) colEls.set(key, el as HTMLTableColElement);
  }
  function colRef(key: SortKey) {
    return (el: Element | ComponentPublicInstance | null) => {
      if (el instanceof Element) setColEl(key, el);
    };
  }

  function startResize(event: PointerEvent, key: SortKey) {
    event.preventDefault();
    const handle = event.currentTarget as HTMLElement;
    const startX = event.clientX;
    const startWidth = columnWidths.value[key];
    const colEl = colEls.get(key);
    handle.setPointerCapture(event.pointerId);

    function onMove(moveEvent: PointerEvent) {
      const next = Math.min(
        MAX_COL_WIDTH,
        Math.max(MIN_COL_WIDTH, startWidth + (moveEvent.clientX - startX)),
      );
      if (colEl) colEl.style.width = `${next}px`;
    }

    function onUp() {
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onUp);
      const next = colEl ? Math.round(parseFloat(colEl.style.width)) : startWidth;
      columnWidths.value = { ...columnWidths.value, [key]: next };
      saveSession(SESSION_KEYS.widths, columnWidths.value);
    }

    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onUp, { once: true });
  }

  function resizeBy(key: SortKey, delta: number) {
    const next = Math.min(MAX_COL_WIDTH, Math.max(MIN_COL_WIDTH, columnWidths.value[key] + delta));
    columnWidths.value = { ...columnWidths.value, [key]: next };
    saveSession(SESSION_KEYS.widths, columnWidths.value);
  }

  return {
    columnOrder,
    columnVisible,
    columnWidths,
    draftOrder,
    draftVisible,
    draftColumns,
    draftVisibleCount,
    visibleColumns,
    tableWidth,
    syncDraft,
    applyColumns,
    resetColumns,
    moveDraft,
    onDragStart,
    onDrop,
    colRef,
    startResize,
    resizeBy,
  };
}
