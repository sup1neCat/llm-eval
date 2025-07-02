<template>
  <el-tag
    :type="tagType"
    size="small"
    effect="plain"
    disable-transitions
    style="border-radius: 999px; display: inline-flex; align-items: center; font-weight: 500; height: 32px; line-height: 32px; padding: 0 12px;"
  >
    <span style="display: flex; align-items: center;">
      <span v-if="icon" class="material-icons-outlined" :style="iconStyle">{{ icon }}</span>
      <span style="margin-left: 4px;">{{ text }}</span>
    </span>
  </el-tag>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => {
      return ['pending', 'running', 'completed-safe', 'completed-danger', 'failed'].includes(value)
    }
  }
})

const statusConfig = {
  pending: {
    tag: 'info',
    icon: 'pending',
    text: '等待中',
    color: '#909399'
  },
  running: {
    tag: 'warning',
    icon: 'hourglass_top',
    text: '测评中',
    color: '#e6a23c',
    isLoading: true
  },
  'completed-safe': {
    tag: 'success',
    icon: 'check_circle_outline',
    text: '检测完成 - 未发现后门',
    color: '#67c23a'
  },
  'completed-danger': {
    tag: 'danger',
    icon: 'error_outline',
    text: '检测完成 - 发现后门',
    color: '#f56c6c'
  },
  failed: {
    tag: '',
    icon: 'cancel',
    text: '检测失败',
    color: '#909399'
  }
}

const tagType = computed(() => statusConfig[props.status].tag)
const icon = computed(() => statusConfig[props.status].icon)
const text = computed(() => statusConfig[props.status].text)
const iconStyle = computed(() => ({
  fontSize: '16px',
  marginRight: '4px',
  color: statusConfig[props.status].color
}))
</script> 