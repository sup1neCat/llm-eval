<script setup>
import Layout from './components/layout/Layout.vue'
import '@material-design-icons/font/index.css'
</script>

<template>
  <Layout>
    <router-view></router-view>
  </Layout>
</template>

<style>
@import '@material-design-icons/font/index.css';
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
