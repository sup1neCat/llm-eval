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
    component: () => import('../views/HistoryPage.vue'),
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
    component: () => import('../views/BackdoorDetailPage.vue')
  },
  {
    path: '/red-team-report/:id',
    name: 'RedTeamReport',
    component: () => import('../views/RedTeamReportPage.vue')
  },
  {
    path: '/red-team-progress/:id',
    name: 'RedTeamProgress',
    component: () => import('../views/RedTeamProgressPage.vue')
  },
  {
    path: '/evaluation/create',
    name: 'EvaluationCreation',
    component: () => import('../views/EvaluationCreationPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 