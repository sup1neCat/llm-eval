<template>
  <el-footer height="56px" style="background: #1e293b; color: #cfd3dc; text-align: center; padding: 0;">
    <p style="margin: 0; line-height: 56px;">
      © {{ currentYear }} 大模型安全检测平台. All rights reserved.
    </p>
  </el-footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script> 