<template>
  <el-container style="min-height: 100vh; flex-direction: column; background: #f8fafc;">
    <Navbar />
    <el-main style="flex: 1; max-width: 1800px; margin: 0 auto; padding: 32px 24px 24px 24px; width: 100%; background: #f8fafc;">
      <slot></slot>
    </el-main>
    <Footer />
  </el-container>
</template>

<script setup>
import Navbar from './Navbar.vue'
import Footer from './Footer.vue'
</script>

<style>
.el-main {
  overflow: visible !important;
}
</style> 