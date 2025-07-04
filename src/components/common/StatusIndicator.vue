<template>
  <el-tag :type="tagType" effect="plain" size="large">
    <el-icon v-if="icon" style="margin-right: 4px;"><component :is="icon" /></el-icon>
    {{ label }}
  </el-tag>
</template>

<script setup>
import { computed } from 'vue'
import { Loading, CircleCheck, WarningFilled, CloseBold, Finished } from '@element-plus/icons-vue'
const props = defineProps({ status: { type: String, required: true } })
const statusMap = {
  pending: { label: '等待中', type: 'info', icon: Loading },
  running: { label: '测评中', type: 'warning', icon: Loading },
  completed: { label: '测评完成', type: 'success', icon: Finished },
  'completed-danger': { label: '检测完成-发现后门', type: 'danger', icon: WarningFilled },
  'completed-safe': { label: '检测完成-未发现后门', type: 'success', icon: CircleCheck },
  failed: { label: '检测失败', type: 'danger', icon: CloseBold }
}
const label = computed(() => statusMap[props.status]?.label || '未知')
const tagType = computed(() => statusMap[props.status]?.type || 'info')
const icon = computed(() => statusMap[props.status]?.icon || null)
</script> 