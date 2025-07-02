<template>
  <div style="background: #f8fafc; min-height: 100vh; padding: 40px 0;">
    <div style="min-width: 1000px; max-width: 1200px; margin: 0 auto;">
      <el-card shadow="always" style="padding: 32px; background: #fff; border-radius: 18px;">
        <h2 style="font-size: 2.2rem; font-weight: bold; color: #1e293b; margin-bottom: 24px;">历史记录</h2>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; gap: 16px;">
          <div style="display: flex; align-items: center; gap: 16px; flex: 1;">
            <el-input
              v-model="searchQuery"
              placeholder="搜索任务ID或模型名称"
              clearable
              style="width: 320px;"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select
              v-model="statusFilter"
              placeholder="全部状态"
              clearable
              style="width: 220px;"
            >
              <el-option label="全部状态" value="" />
              <el-option label="等待中" value="pending" />
              <el-option label="测评中" value="running" />
              <el-option label="检测完成-发现后门" value="completed-danger" />
              <el-option label="检测完成-未发现后门" value="completed-safe" />
              <el-option label="检测失败" value="failed" />
            </el-select>
          </div>
          <el-button type="primary" @click="createNewTask" style="font-weight: 500;" >
            <el-icon style="margin-right: 4px;"><Plus /></el-icon>
            创建新任务
          </el-button>
        </div>
        <el-table :data="pagedTasks" border style="width: 100%;" table-layout="fixed">
          <el-table-column prop="id" label="任务ID" width="160" />
          <el-table-column prop="modelName" label="模型名称" width="200" />
          <el-table-column prop="type" label="测评类型" width="160" />
          <el-table-column prop="submitTime" label="提交时间" width="200" />
          <el-table-column label="状态" width="180" align="center">
            <template #default="scope">
              <StatusBadge :status="scope.row.status" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140">
            <template #default="scope">
              <router-link :to="getTaskLink(scope.row)" style="display: flex; align-items: center; text-decoration: none;">
                <el-link
                  :type="getActionType(scope.row)"
                  :underline="false"
                  style="display: flex; align-items: center; font-weight: 500; padding: 0;"
                >
                  <el-icon style="margin-right: 4px;">
                    <component :is="getActionIcon(scope.row)" />
                  </el-icon>
                  {{ getTaskActionText(scope.row) }}
                </el-link>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import StatusBadge from '../components/common/StatusBadge.vue'
import { View, Document, Warning, Loading, Promotion, Search, Plus } from '@element-plus/icons-vue'

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
    const matchesStatus = statusFilter.value === '' || statusFilter.value == null || task.status === statusFilter.value
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

const getActionType = (task) => {
  if (task.status === 'completed-danger' || task.status === 'completed-safe') {
    return 'primary'
  } else if (task.status === 'failed') {
    return 'danger'
  } else if (task.status === 'running') {
    return 'warning'
  } else {
    return 'success'
  }
}

const getActionIcon = (task) => {
  if (task.status === 'completed-danger' || task.status === 'completed-safe') {
    return View
  } else if (task.status === 'failed') {
    return Warning
  } else if (task.status === 'running') {
    return Loading
  } else {
    return Promotion
  }
}
</script> 