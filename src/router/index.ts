import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/accordion",
      name: "accordion",
      component: () => import("../views/AccordionView.vue"),
    },
    {
      path: "/data-table",
      name: "data-table",
      component: () => import("../features/data-table/DataTableView.vue"),
    },
    {
      path: "/auto-grow-textarea",
      name: "auto-grow-textarea",
      component: () => import("../views/AutoGrowTextareaView.vue"),
    },
    {
      path: "/position-try-fallbacks",
      name: "position-try-fallbacks",
      component: () => import("../views/PositionTryFallbacksView.vue"),
    },
    {
      path: "/styled-select",
      name: "styled-select",
      component: () => import("../views/StyledSelectView.vue"),
    },
    {
      path: "/modal",
      name: "modal",
      component: () => import("../views/ModalView.vue"),
    },
    {
      path: "/aspect-ratio",
      name: "aspect-ratio",
      component: () => import("../views/AspectRatioView.vue"),
    },
    {
      path: "/container-queries",
      name: "container-queries",
      component: () => import("../views/ContainerQueriesView.vue"),
    },
    {
      path: "/has-selector",
      name: "has-selector",
      component: () => import("../views/HasSelectorView.vue"),
    },
    {
      path: "/scroll-animations",
      name: "scroll-animations",
      component: () => import("../views/ScrollAnimationsView.vue"),
    },
    {
      path: "/contrast-color",
      name: "contrast-color",
      component: () => import("../views/ContrastColorView.vue"),
    },
    {
      path: "/temporal",
      name: "temporal",
      component: () => import("../views/TemporalView.vue"),
    },
    {
      path: "/view-transitions",
      name: "view-transitions",
      component: () => import("../views/ViewTransitionsView.vue"),
    },
    {
      path: "/relative-color",
      name: "relative-color",
      component: () => import("../views/RelativeColorView.vue"),
    },
    {
      path: "/iterator-helpers",
      name: "iterator-helpers",
      component: () => import("../views/IteratorHelpersView.vue"),
    },
    {
      path: "/top-level-await",
      name: "top-level-await",
      component: () => import("../views/TopLevelAwaitView.vue"),
    },
  ],
});

export default router;
