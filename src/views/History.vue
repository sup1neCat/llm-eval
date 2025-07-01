<template>
  <el-row justify="center" style="background: #f8fafc; min-height: 100vh; margin: 0;">
    <el-col :span="20">
      <el-card class="mb-4" shadow="always" style="padding: 40px 40px 32px 40px; background: #fff; border-radius: 18px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 18px;">
          <h2 style="font-size: 2.4rem; font-weight: bold; color: #1e293b; margin-bottom: 0;">历史记录</h2>
        </div>
        <p style="color: #64748b; margin-bottom: 36px; font-size: 1.1rem;">查看和管理您的测评任务与结果。</p>
        <div style="margin-bottom: 36px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="font-size: 1.6rem; font-weight: 600; color: #334155;">测评结果历史</h3>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 24px; gap: 20px;">
            <el-input
              v-model="searchQuery"
              placeholder="搜索任务ID或模型名称"
              prefix-icon="el-icon-search"
              size="large"
              clearable
              style="width: 320px; border-radius: 12px;"
            />
            <el-select v-model="statusFilter" placeholder="全部状态" size="large" style="width: 220px; border-radius: 12px;">
              <el-option label="全部状态" value="" />
              <el-option label="等待中" value="pending" />
              <el-option label="测评中" value="running" />
              <el-option label="检测完成 - 发现后门" value="completed-danger" />
              <el-option label="检测完成 - 未发现后门" value="completed-safe" />
              <el-option label="检测失败" value="failed" />
            </el-select>
            <el-button type="primary" size="large" round style="background: #38bdf8; border: none;" @click="createNewTask">
              <span class="material-icons" style="vertical-align: middle; margin-right: 4px;">add</span>
              创建新任务
            </el-button>
          </div>
          <el-table
            :data="pagedTasks"
            border
            style="width: 100%; border-radius: 14px; overflow: hidden;"
            :header-cell-style="{ background: '#f1f5f9', color: '#64748b', fontWeight: 600, fontSize: '14px' }"
            :cell-style="{ fontSize: '15px' }"
          >
            <el-table-column prop="id" label="任务ID" width="140" />
            <el-table-column prop="modelName" label="模型名称" width="160" />
            <el-table-column prop="type" label="测评类型" width="120" />
            <el-table-column prop="submitTime" label="提交时间" width="160" />
            <el-table-column label="状态" width="180" align="center">
              <template #default="scope">
                <StatusBadge :status="scope.row.status" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <router-link :to="getTaskLink(scope.row)" style="color: #38bdf8; display: flex; align-items: center; font-weight: 500;">
                  <span class="material-icons-outlined" style="font-size: 18px; margin-right: 4px;">{{ getTaskIcon(scope.row) }}</span>
                  {{ getTaskActionText(scope.row) }}
                </router-link>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 32px; display: flex; justify-content: flex-end;">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="filteredTasks.length"
              :page-size="itemsPerPage"
              :current-page.sync="currentPage"
              @current-change="handlePageChange"
            />
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, computed } from 'vue'
import StatusBadge from '../components/common/StatusBadge.vue'

// 模拟数据
const tasks = [
  {
    id: 'eval-task-67890',
    modelName: 'Model-X v1.0',
    type: '后门检测',
    submitTime: '2023-10-27 15:30',
    status: 'completed-danger'
  },
  {
    id: 'eval-task-67891',
    modelName: 'SecureLLM-Alpha',
    type: '后门检测',
    submitTime: '2023-10-28 10:15',
    status: 'completed-safe'
  },
  {
    id: 'eval-task-67892',
    modelName: 'CodeGuardian',
    type: '代码能力',
    submitTime: '2023-10-29 09:00',
    status: 'running'
  },
  {
    id: 'eval-task-67893',
    modelName: 'ChatBot-Plus',
    type: '对话能力',
    submitTime: '2023-10-29 11:30',
    status: 'pending'
  },
  {
    id: 'eval-task-67894',
    modelName: 'TranslatePro',
    type: '翻译能力',
    submitTime: '2023-10-29 14:00',
    status: 'failed'
  }
]

const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

const filteredTasks = computed(() => {
  return tasks.filter(task => {
    const matchesSearch = searchQuery.value === '' ||
      task.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      task.modelName.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = statusFilter.value === '' || task.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

const pagedTasks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredTasks.value.slice(start, start + itemsPerPage)
})

const handlePageChange = (page) => {
  currentPage.value = page
}

const getTaskLink = (task) => {
  if (task.status === 'completed-danger' || task.status === 'completed-safe') {
    return `/report/${task.id}`
  }
  return `/task/${task.id}`
}

const getTaskIcon = (task) => {
  if (task.status === 'completed-danger' || task.status === 'completed-safe') {
    return 'visibility'
  } else if (task.status === 'failed') {
    return 'report_problem'
  } else if (task.status === 'running') {
    return 'hourglass_empty'
  } else {
    return 'play_arrow'
  }
}

const getTaskActionText = (task) => {
  if (task.status === 'completed-danger' || task.status === 'completed-safe') {
    return '查看报告'
  } else if (task.status === 'failed') {
    return '查看详情'
  } else if (task.status === 'running') {
    return '查看进度'
  } else {
    return '开始测评'
  }
}

const createNewTask = () => {
  // TODO: 实现创建新任务逻辑
  alert('创建新任务功能开发中...')
}
</script> 