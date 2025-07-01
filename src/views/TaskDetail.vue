<template>
  <el-row justify="center" gutter="20" style="background: #f8fafc; min-height: 100vh; margin: 0;">
    <el-col :span="18">
      <el-card class="mb-4" shadow="always" style="background: #fff; padding: 40px 40px 32px 40px; border-radius: 18px;">
        <el-row type="flex" align="middle" justify="space-between" style="margin-bottom: 24px;">
          <el-col>
            <h2 style="font-size: 2.2rem; font-weight: bold; color: #1e293b;">{{ task.name }}</h2>
            <p style="font-size: 1.1rem; color: #64748b; margin-top: 6px;">任务ID: <span style="font-weight: 500; color: #334155;">{{ task.id }}</span></p>
          </el-col>
          <el-col>
            <StatusBadge :status="task.status" />
          </el-col>
        </el-row>
        <el-row :gutter="24" style="margin-bottom: 18px;">
          <el-col :xs="24" :sm="12" :md="6">
            <span style="font-weight: 500;">模型:</span> {{ task.model }}
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <span style="font-weight: 500;">数据集:</span> {{ task.dataset }}
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <span style="font-weight: 500;">开始时间:</span> {{ task.startTime }}
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <span style="font-weight: 500;">预计完成时间:</span> {{ task.estimatedEndTime }}
          </el-col>
        </el-row>
      </el-card>
      <!-- 进度条 -->
      <el-card v-if="task.status === 'running'" class="mb-4" shadow="always" style="background: #fff; padding: 32px 32px 24px 32px; border-radius: 16px;">
        <div style="margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 1.1rem; color: #334155; font-weight: 500;">进度</span>
          <span style="font-size: 1.1rem; color: #64748b;">{{ task.progress }}%</span>
        </div>
        <el-progress :percentage="task.progress" :stroke-width="16" color="#F7B500" style="margin-bottom: 12px;" />
        <div style="font-size: 1.1rem; color: #64748b; margin-bottom: 24px;">预计剩余用时：{{ task.remainingTime }}</div>
        <h3 style="font-size: 1.3rem; font-weight: 600; color: #1e293b; margin-bottom: 16px;">执行日志</h3>
        <LogViewer :logs="task.logs" />
      </el-card>
      <!-- 配置详情 -->
      <el-card v-if="task.status !== 'running'" class="mb-4" shadow="always" style="background: #fff; padding: 32px 32px 24px 32px; border-radius: 16px;">
        <h3 style="font-size: 1.3rem; font-weight: 600; color: #1e293b; margin-bottom: 18px;">配置详情</h3>
        <el-row :gutter="32">
          <el-col :xs="24" :sm="12" :md="12">
            <span style="font-weight: 500; color: #334155;">模型名称:</span>
            <p style="color: #64748b;">{{ task.model }}</p>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12">
            <span style="font-weight: 500; color: #334155;">评估框架:</span>
            <p style="color: #64748b;">{{ task.framework }}</p>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12">
            <span style="font-weight: 500; color: #334155;">数据集路径:</span>
            <p style="color: #64748b;">{{ task.datasetPath }}</p>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12">
            <span style="font-weight: 500; color: #334155;">评估指标:</span>
            <p style="color: #64748b;">{{ task.metrics.join(', ') }}</p>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12">
            <span style="font-weight: 500; color: #334155;">批处理大小 (Batch Size):</span>
            <p style="color: #64748b;">{{ task.batchSize }}</p>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12">
            <span style="font-weight: 500; color: #334155;">最大序列长度:</span>
            <p style="color: #64748b;">{{ task.maxSeqLength }}</p>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12">
            <span style="font-weight: 500; color: #334155;">GPU 使用:</span>
            <p style="color: #64748b;">{{ task.gpuUsage }}</p>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12">
            <span style="font-weight: 500; color: #334155;">随机种子:</span>
            <p style="color: #64748b;">{{ task.randomSeed }}</p>
          </el-col>
        </el-row>
      </el-card>
      <!-- 错误信息 -->
      <el-alert
        v-if="task.status === 'failed'"
        title="任务执行失败"
        type="error"
        show-icon
        :closable="false"
        style="margin-bottom: 16px;"
      >
        <template #description>
          <div style="color: #f56c6c;">{{ task.errorMessage }}</div>
          <el-button type="danger" size="small" style="margin-top: 12px;" @click="retryTask">
            <span class="material-icons" style="vertical-align: middle; margin-right: 4px;">refresh</span>
            重试任务
          </el-button>
        </template>
      </el-alert>
    </el-col>
  </el-row>
</template>

<script setup>
import { useRoute } from 'vue-router'
import StatusBadge from '../components/common/StatusBadge.vue'
import LogViewer from '../components/common/LogViewer.vue'

const route = useRoute()

// 模拟任务数据
const task = {
  id: route.params.id,
  name: 'BERT情感分析评估',
  status: 'running',
  model: 'BERT-base-uncased',
  dataset: 'IMDB Movie Reviews',
  startTime: '2024-03-10 10:00:00',
  estimatedEndTime: '2024-03-10 11:40:12',
  progress: 40,
  remainingTime: '45分钟',
  framework: 'Hugging Face Transformers',
  datasetPath: '/data/imdb_reviews.jsonl',
  metrics: ['Accuracy', 'Precision', 'Recall', 'F1-score', 'AUC-ROC'],
  batchSize: 32,
  maxSeqLength: 256,
  gpuUsage: 'Tesla V100 (1x)',
  randomSeed: 42,
  errorMessage: '模型加载失败：内存不足',
  logs: `[2024-03-10 10:00:00] INFO: Evaluation task eval-bert-sentiment-001 started.\n[2024-03-10 10:00:01] INFO: Loading model: bert-base-uncased...\n[2024-03-10 10:00:15] INFO: Model loaded successfully.\n[2024-03-10 10:00:16] INFO: Loading dataset: IMDB Movie Reviews (25000 samples)...\n[2024-03-10 10:00:25] INFO: Dataset loaded and preprocessed.\n[2024-03-10 10:00:26] INFO: Starting evaluation...\n[2024-03-10 10:00:30] INFO: Batch 1/250 processed.\n[2024-03-10 10:05:00] INFO: Batch 50/250 processed.\n[2024-03-10 10:15:00] INFO: Batch 100/250 processed.`
}

const retryTask = () => {
  // TODO: 实现重试任务的逻辑
  console.log('重试任务')
}
</script> 