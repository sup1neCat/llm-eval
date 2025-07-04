<template>
  <el-card :body-style="{ padding: '24px 32px' }" style="border-radius: 16px; margin-bottom: 16px;">
    <div style="display: flex; align-items: center; gap: 32px;">
      <el-icon v-if="icon" :style="{ fontSize: '2.2rem', color: iconColor, marginRight: '16px' }"><component :is="icon" /></el-icon>
      <div style="flex: 1;">
        <div style="font-size: 1.2rem; font-weight: bold; color: #1e293b; margin-bottom: 8px;">{{ title }}</div>
        <div v-if="confidence !== undefined" style="margin-bottom: 6px;">
          <span style="color: #64748b;">置信度：</span>
          <span :style="{ color: confidenceColor, fontWeight: 600, fontSize: '1.1rem' }">{{ confidence }}%</span>
        </div>
        <div v-if="attackSuccess !== undefined" style="margin-bottom: 6px;">
          <span style="color: #64748b;">攻击成功率：</span>
          <span style="color: #dc2626; font-weight: 600;">{{ attackSuccess }}%</span>
        </div>
        <div v-if="cleanAccuracy !== undefined" style="margin-bottom: 6px;">
          <span style="color: #64748b;">干净样本准确率：</span>
          <span style="color: #16a34a; font-weight: 600;">{{ cleanAccuracy }}%</span>
        </div>
        <div v-if="triggers && triggers.length" style="margin-bottom: 6px;">
          <span style="color: #64748b;">检测到的触发词：</span>
          <el-tag v-for="t in triggers" :key="t" type="danger" effect="plain" style="margin-right: 6px;">{{ t }}</el-tag>
        </div>
        <div v-else-if="triggers && triggers.length === 0">
          <span style="color: #64748b;">检测到的触发词：</span>
          <el-tag type="info" effect="plain">无</el-tag>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { computed } from 'vue'
import { WarningFilled, CircleCheck } from '@element-plus/icons-vue'
const props = defineProps({
  title: { type: String, default: '检测结果' },
  confidence: Number,
  attackSuccess: Number,
  cleanAccuracy: Number,
  triggers: { type: Array, default: () => [] },
  danger: { type: Boolean, default: false }
})
const icon = computed(() => props.danger ? WarningFilled : CircleCheck)
const iconColor = computed(() => props.danger ? '#f56c6c' : '#22c55e')
const confidenceColor = computed(() => props.danger ? '#dc2626' : '#16a34a')
</script> 