<template>
  <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
    <div style="font-size: 1.1rem; color: #64748b; margin-bottom: 8px;">{{ title }}</div>
    <el-progress
      type="circle"
      :percentage="value"
      :color="color"
      :width="size"
      :stroke-width="strokeWidth"
      :show-text="false"
    />
    <div :style="{ color: color, fontWeight: 600, fontSize: '1.6rem', marginTop: '8px' }">{{ value }}%</div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: '' },
  value: { type: Number, required: true },
  color: { type: String, default: '#409eff' },
  size: { type: Number, default: 120 },
  strokeWidth: { type: Number, default: 10 }
})
</script> 