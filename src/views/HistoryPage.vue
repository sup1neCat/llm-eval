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
              <el-option v-for="opt in statusOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
            </el-select>
          </div>
          <el-button type="primary" @click="createNewTask" style="font-weight: 500;" >
            <el-icon style="margin-right: 4px;"><Plus /></el-icon>
            创建新任务
          </el-button>
        </div>
        <template v-if="loading">
          <LoadingSpinner text="正在加载任务列表..." />
        </template>
        <template v-else>
          <TaskList
            :tasks="pagedTasks"
            :current-page="currentPage"
            :page-size="itemsPerPage"
            :total="filteredTasks.length"
            @page-change="handlePageChange"
          >
            <template #action="{ task }">
              <router-link :to="getTaskLink(task)" style="display: flex; align-items: center; text-decoration: none;">
                <el-link
                  :type="getActionType(task)"
                  :underline="false"
                  style="display: flex; align-items: center; font-weight: 500; padding: 0;"
                >
                  <el-icon style="margin-right: 4px;">
                    <component :is="getActionIcon(task)" />
                  </el-icon>
                  {{ getTaskActionText(task) }}
                </el-link>
              </router-link>
            </template>
          </TaskList>
        </template>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { View, Document, Warning, Loading, AlarmClock, Search, Plus } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
import TaskList from '../components/common/TaskList.vue'
import { fetchEvaluationHistory } from '../apis/evaluation'

const router = useRouter()

const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const totalItems = ref(0)
const tasks = ref([])
const loading = ref(false)
const pollingTimer = ref(null)

const STATUS_MAP = {
  pending: '等待中',
  running: '测评中',
  completed: '评估完成',
  'completed-danger': '评估完成',
  'completed-safe': '评估完成',
  failed: '评估失败'
}

const statusOptions = [
  { label: '全部状态', value: '' },
  { label: '等待中', value: 'pending' },
  { label: '测评中', value: 'running' },
  { label: '评估完成', value: 'completed' },
  { label: '评估失败', value: 'failed' }
]

const loadTasks = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: itemsPerPage,
      search: searchQuery.value,
      status: statusFilter.value
    }
    const res = await fetchEvaluationHistory(params)
    tasks.value = res.data || res.tasks || []
    totalItems.value = res.total || res.totalCount || 0
  } catch (e) {
    ElMessage.error('获取任务列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTasks()
  pollingTimer.value = setInterval(() => {
    // 只在有进行中/等待中任务时轮询
    if (tasks.value.some(t => t.status === 'pending' || t.status === 'running')) {
      loadTasks()
    }
  }, 8000)
})
onUnmounted(() => {
  if (pollingTimer.value) clearInterval(pollingTimer.value)
})

const handlePageChange = (page) => {
  currentPage.value = page
  loadTasks()
}

const filteredTasks = computed(() => {
  return tasks.value.filter(task => {
    const id = task.taskId || task.id || task.task_id || ''
    const modelName = task.modelName || task.model_name || ''
    // 支持任务ID和模型名称的模糊搜索
    const matchesSearch = !searchQuery.value ||
      id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      modelName.toLowerCase().includes(searchQuery.value.toLowerCase())
    // 统一completed相关状态
    let normalizedStatus = task.status
    if (["completed", "completed-danger", "completed-safe"].includes(task.status)) {
      normalizedStatus = "completed"
    }
    const matchesStatus = !statusFilter.value || normalizedStatus === statusFilter.value
    return matchesSearch && matchesStatus
  })
})
const pagedTasks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredTasks.value.slice(start, start + itemsPerPage)
})

const getTaskLink = (task) => {
  // 检查是否为FlamesTask类型
  const abilityName = task.abilityName || task.ability_name || '';
  const type = task.type || '';
  const isFlames = abilityName.toLowerCase().includes('flames') || type.toLowerCase().includes('flames');
  if (isFlames && (task.status === 'completed-danger' || task.status === 'completed-safe')) {
    return `/flames-report/${task.id || task.taskId || task.task_id}`;
  }
  // 检查测评类型是否包含红队或越狱关键词
  const isRedTeam = abilityName.includes('红队') || abilityName.includes('越狱');

  if (isBackdoor && task.status === 'running') {
    return `/backdoor-progress/${task.id}`;
  }
  if (isBackdoor) {
    return `/backdoor-report/${task.id}`;
  }
  if (isRedTeam && task.status === 'running') {
    return `/red-team-progress/${task.id}`;
  }
  if (isRedTeam) {
    return `/red-team-report/${task.id}`;
  }
  if (task.status === 'completed') {
    return `/task/${task.id}`;
  }
  return `/task/${task.id}`;
}

const getTaskActionText = (task) => {
  if (task.status === 'completed' || task.status === 'completed-danger' || task.status === 'completed-safe') {
    return '查看报告'
  } else if (task.status === 'failed' ) {
    return '查看详情'
  } else if (task.status === 'running') {
    return '查看进度'
  } else { // 等待中
    return '查看排队进度'
  }
}

const createNewTask = () => {
  router.push('/history/createTask')
}

const getActionType = (task) => {
  if (task.status === 'completed' || task.status === 'completed-danger' || task.status === 'completed-safe') {
    return 'primary'
  } else if (task.status === 'failed') {
    return 'danger'
  } else if (task.status === 'running') {
    return 'warning'
  } else { // 等待中
    return 'info'
  }
}

const getActionIcon = (task) => {
  if (task.status === 'completed' || task.status === 'completed-danger' || task.status === 'completed-safe') {
    return View
  } else if (task.status === 'failed') {
    return Warning
  } else if (task.status === 'running') {
    return Loading
  } else { // 等待中
    return AlarmClock
  }
}
</script> 