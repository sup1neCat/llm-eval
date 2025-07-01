<template>
  <el-card shadow="hover" style="padding: 24px;">
    <h3 style="font-size: 1.1rem; font-weight: 600; color: var(--el-text-color-primary); margin-bottom: 4px;">{{ title }}</h3>
    <p :style="valueStyle">{{ value }}</p>
    <p style="font-size: 13px; color: var(--el-text-color-secondary); margin-top: 8px;">{{ description }}</p>
  </el-card>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'default',
    validator: (value) => {
      return ['default', 'success', 'warning', 'danger', 'info'].includes(value)
    }
  }
})

const colorMap = {
  default: 'var(--el-color-primary)',
  success: 'var(--el-color-success)',
  warning: 'var(--el-color-warning)',
  danger: 'var(--el-color-error)',
  info: 'var(--el-color-info)'
}

const valueStyle = computed(() => ({
  fontSize: '2rem',
  fontWeight: 'bold',
  color: colorMap[props.type],
}))
</script> 