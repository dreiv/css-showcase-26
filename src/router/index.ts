import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/accordion',
      name: 'accordion',
      component: () => import('../views/AccordionView.vue'),
    },
    {
      path: '/data-table',
      name: 'data-table',
      component: () => import('../views/DataTableView.vue'),
    },
    {
      path: '/auto-grow-textarea',
      name: 'auto-grow-textarea',
      component: () => import('../views/AutoGrowTextareaView.vue'),
    },
    {
      path: '/position-try-fallbacks',
      name: 'position-try-fallbacks',
      component: () => import('../views/PositionTryFallbacksView.vue'),
    },
    {
      path: '/styled-select',
      name: 'styled-select',
      component: () => import('../views/StyledSelectView.vue'),
    },
    {
      path: '/popover-playground',
      name: 'popover-playground',
      component: () => import('../views/PopoverPlaygroundView.vue'),
    },
    {
      path: '/modal',
      name: 'modal',
      component: () => import('../views/ModalView.vue'),
    },
    {
      path: '/aspect-ratio',
      name: 'aspect-ratio',
      component: () => import('../views/AspectRatioView.vue'),
    },
    {
      path: '/container-queries',
      name: 'container-queries',
      component: () => import('../views/ContainerQueriesView.vue'),
    },
    {
      path: '/has-selector',
      name: 'has-selector',
      component: () => import('../views/HasSelectorView.vue'),
    },
  ],
})

export default router
