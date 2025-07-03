import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/test-platform'
  },
  {
    path: '/datasets',
    name: 'Datasets',
    component: () => import('../views/Datasets.vue')
  },
  {
    path: '/test-platform',
    name: 'TestPlatform',
    component: () => import('../views/TestPlatform.vue'),
    children: [
      {
        path: 'createTask',
        name: 'TestPlatformCreateTask',
        component: () => import('../views/CreateTask.vue')
      }
    ]
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: () => import('../views/Leaderboard.vue')
  },
  {
    path: '/data-mutation',
    name: 'DataMutation',
    component: () => import('../views/DataMutation.vue')
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('../views/History.vue'),
    children: [
      {
        path: 'createTask',
        name: 'HistoryCreateTask',
        component: () => import('../views/CreateTask.vue')
      }
    ]
  },
  {
    path: '/task/:id',
    name: 'TaskDetail',
    component: () => import('../views/TaskDetail.vue')
  },
  {
    path: '/report/:id',
    name: 'BackdoorReport',
    component: () => import('../views/BackdoorReport.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 