<template>
  <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 0;">
    <el-icon style="font-size: 3rem; color: #409eff; margin-bottom: 12px; animation: spin 1s linear infinite;"><Loading /></el-icon>
    <div v-if="text" style="color: #64748b; font-size: 1.1rem;">{{ text }}</div>
  </div>
</template>

<script setup>
import { Loading } from '@element-plus/icons-vue'
const props = defineProps({ text: { type: String, default: '' } })
</script>

<style scoped>
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 