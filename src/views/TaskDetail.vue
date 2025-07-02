<template>
  <div style="background: #f8fafc; min-height: 100vh;">
    <div style="max-width: 1200px; margin: 0 auto; padding: 40px 0;">
      <el-card shadow="always" style="border-radius: 24px; box-shadow: 0 4px 24px 0 rgba(30,41,59,0.08); padding: 40px; background: #fff;">
        <!-- 任务基础信息区 -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
          <div style="display: flex; flex-direction: column; justify-content: center; min-height: 40px;">
            <h2 style="font-size: 2.2rem; font-weight: bold; color: #1e293b; margin-bottom: 12px;">{{ task.name }}</h2>
            <div style="color: #64748b; font-size: 1.1rem; margin-bottom: 8px;">
              任务ID: <span style="font-weight: 500; color: #334155;">{{ task.id }}</span>
            </div>
            <div style="display: flex; gap: 32px; flex-wrap: wrap; font-size: 1.05rem; color: #334155;">
              <span><span style="font-weight: 500;">模型:</span> {{ task.model }}</span>
              <span><span style="font-weight: 500;">数据集:</span> {{ task.dataset }}</span>
              <span><span style="font-weight: 500;">开始时间:</span> {{ task.startTime }}</span>
              <span><span style="font-weight: 500;">预计完成时间:</span> {{ task.estimatedEndTime }}</span>
            </div>
          </div>
          <el-tag :type="getStatusType(task.status)" effect="light" size="large" style="font-size: 1.1rem; display: flex; align-items: center; height: 40px; min-width: 96px; justify-content: center; align-self: flex-start;">
            <el-icon style="margin-right: 4px;">
              <component :is="getStatusIcon(task.status)" />
            </el-icon>
            {{ getStatusText(task.status) }}
          </el-tag>
        </div>
        <!-- 指标卡片区 -->
        <el-row :gutter="20" v-if="task.status !== 'running' && task.status !== 'failed'" style="margin-bottom: 24px;">
          <el-col v-for="(metric, idx) in metricCards" :key="idx" :xs="24" :sm="12" :md="8" :lg="6">
            <el-card shadow="hover" style="border-radius: 12px; text-align: center; padding: 20px 0;">
              <div :style="'font-size: 2rem; font-weight: bold; color: ' + metric.color">{{ metric.value }}</div>
              <div style="font-size: 1rem; color: #64748b; margin-top: 6px;">{{ metric.label }}</div>
            </el-card>
          </el-col>
        </el-row>
        <!-- 进度区 -->
        <div v-if="task.status === 'running'" style="margin-bottom: 32px;">
          <div style="font-size: 1.1rem; font-weight: 600; color: #1e293b; margin-bottom: 8px;">进度</div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <el-progress :percentage="task.progress" :stroke-width="16" color="#facc15" style="flex: 1; margin-right: 16px; border-radius: 8px;" :show-text="false" />
            <span style="font-size: 1.1rem; color: #64748b; min-width: 48px; text-align: right;">{{ task.progress }}%</span>
          </div>
          <el-tag type="info" effect="plain" style="color: #64748b; background: #f3f4f6; border: none; border-radius: 8px; font-size: 1rem; padding: 4px 16px;">预计剩余用时：{{ task.remainingTime }}</el-tag>
        </div>
        <!-- 执行日志区 -->
        <div style="margin-top: 32px;">
          <div style="font-size: 1.3rem; font-weight: 700; color: #1e293b; margin-bottom: 16px;">执行日志</div>
          <el-card style="background: #0f172a; color: #e2e8f0; font-family: 'SFMono-Regular',Consolas,'Liberation Mono',Menlo,Courier,monospace; font-size: 0.95rem; border-radius: 16px; max-height: 400px; overflow-y: auto; padding: 24px;">
            <pre style="margin: 0; white-space: pre-wrap;">{{ task.logs }}</pre>
          </el-card>
        </div>
        <!-- tab分区 -->
        <el-tabs v-model="activeTab" style="margin-top: 8px;">
          <el-tab-pane label="配置详情" name="config">
            <el-descriptions :column="2" border style="margin-top: 8px;">
              <el-descriptions-item label="模型名称">{{ task.model }}</el-descriptions-item>
              <el-descriptions-item label="评估框架">{{ task.framework }}</el-descriptions-item>
              <el-descriptions-item label="数据集路径">{{ task.datasetPath }}</el-descriptions-item>
              <el-descriptions-item label="评估指标">{{ task.metrics.join(', ') }}</el-descriptions-item>
              <el-descriptions-item label="批处理大小">{{ task.batchSize }}</el-descriptions-item>
              <el-descriptions-item label="最大序列长度">{{ task.maxSeqLength }}</el-descriptions-item>
              <el-descriptions-item label="GPU 使用">{{ task.gpuUsage }}</el-descriptions-item>
              <el-descriptions-item label="随机种子">{{ task.randomSeed }}</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
          <el-tab-pane label="可视化图表" name="chart">
            <div style="color: #64748b; text-align: center; padding: 32px 0;">此处可放置模型评估相关的可视化图表。</div>
          </el-tab-pane>
        </el-tabs>
        <!-- 错误信息 -->
        <el-alert
          v-if="task.status === 'failed'"
          title="任务执行失败"
          type="error"
          show-icon
          :closable="false"
          style="margin-top: 24px;"
        >
          <template #description>
            <div style="color: #f56c6c;">{{ task.errorMessage }}</div>
            <el-button type="danger" size="small" style="margin-top: 12px;" @click="retryTask">
              <el-icon style="vertical-align: middle; margin-right: 4px;"><Refresh /></el-icon>
              重试任务
            </el-button>
          </template>
        </el-alert>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Notification, Refresh, CircleCheck, WarningFilled, Loading, CloseBold } from '@element-plus/icons-vue'
import Navbar from '../components/layout/Navbar.vue'

const activeTab = ref('log')

// 模拟任务数据
const task = {
  id: 'eval-bert-sentiment-001',
  name: 'BERT情感分析评估',
  status: 'running', // running | completed | failed
  model: 'BERT-base-uncased',
  dataset: 'IMDB Movie Reviews',
  startTime: '2024-03-10 10:00:00',
  estimatedEndTime: '2024-03-10 11:40:12',
  progress: 40,
  remainingTime: '45分钟',
  framework: 'Hugging Face Transformers',
  datasetPath: '/data/imdb_reviews.jsonl',
  metrics: ['Accuracy', 'Precision', 'Recall', 'F1-score', 'AUC-ROC'],
  metricValues: [
    { label: '准确率 (Accuracy)', value: '92.5%', color: '#2563eb' },
    { label: '精确率 (Precision)', value: '90.1%', color: '#16a34a' },
    { label: '召回率 (Recall)', value: '88.7%', color: '#a21caf' },
    { label: 'F1分数 (F1-Score)', value: '89.4%', color: '#eab308' },
    { label: 'AUC-ROC', value: '0.95', color: '#db2777' }
  ],
  batchSize: 32,
  maxSeqLength: 256,
  gpuUsage: 'Tesla V100 (1x)',
  randomSeed: 42,
  errorMessage: '模型加载失败：内存不足',
  logs: `[2024-03-10 10:00:00] INFO: Evaluation task eval-bert-sentiment-001 started.\n[2024-03-10 10:00:01] INFO: Loading model: bert-base-uncased...\n[2024-03-10 10:00:15] INFO: Model loaded successfully.\n[2024-03-10 10:00:16] INFO: Loading dataset: IMDB Movie Reviews (25000 samples)...\n[2024-03-10 10:00:25] INFO: Dataset loaded and preprocessed.\n[2024-03-10 10:00:26] INFO: Starting evaluation...\n[2024-03-10 10:00:30] INFO: Batch 1/250 processed.\n[2024-03-10 10:05:00] INFO: Batch 50/250 processed.\n[2024-03-10 10:15:00] INFO: Batch 100/250 processed.`
}

const metricCards = task.metricValues

const getStatusType = (status) => {
  if (status === 'completed') return 'success'
  if (status === 'failed') return 'danger'
  if (status === 'running') return 'warning'
  return 'info'
}
const getStatusIcon = (status) => {
  if (status === 'completed') return CircleCheck
  if (status === 'failed') return CloseBold
  if (status === 'running') return Loading
  return WarningFilled
}
const getStatusText = (status) => {
  if (status === 'completed') return '已完成'
  if (status === 'failed') return '失败'
  if (status === 'running') return '进行中'
  return '未知状态'
}
const retryTask = () => {
  // TODO: 实现重试任务的逻辑
  console.log('重试任务')
}
</script> 