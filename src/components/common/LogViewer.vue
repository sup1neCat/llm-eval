<template>
  <el-card shadow="never" style="background: #23272e; color: #e2e8f0; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 0.95rem; line-height: 1.5; padding: 16px; border-radius: 8px; max-height: 400px; overflow-y: auto; border: 1px solid var(--el-border-color);">
    <pre style="margin: 0; background: transparent; color: inherit;">{{ logs }}</pre>
  </el-card>
</template>

<script setup>
defineProps({
  logs: {
    type: String,
    required: true
  }
})
</script> 