<template>
  <el-header height="64px" style="background:rgb(29, 61, 87); color: #fff; box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04); padding: 0;">
    <div style="max-width: 1650px; margin: 0 auto; display: flex; align-items: center; height: 100%; justify-content: space-between; padding: 0 14px;">
      <div style="display: flex; align-items: center; width: 100%;">
        <router-link to="/" style="font-size: 1.3rem; font-weight: bold; color: #fff; text-decoration: none; margin-right: 24px;">
          大模型安全检测平台
        </router-link>
        <div style="flex: 1; min-width: 0; overflow-x: auto;">
          <el-menu mode="horizontal" :default-active="activePath" background-color="rgb(29, 61, 87)" text-color="#fff" active-text-color="#38bdf8" style="margin-left: 0; border-bottom: none; flex-wrap: nowrap; white-space: nowrap; min-width: 700px;">
            <el-menu-item v-for="item in navItems" :key="item.path" :index="item.path">
              <router-link :to="item.path" style="color: inherit; text-decoration: none; display: flex; align-items: center;">
                <span v-if="item.path === '/history'" class="material-icons" style="font-size: 20px; margin-right: 4px;">history</span>
                {{ item.name }}
              </router-link>
            </el-menu-item>
          </el-menu>
        </div>
      </div>
      <div style="display: flex; align-items: center; margin-right: 16px;">
        <el-button circle size="large" style="background: transparent; color: #fff; border: none; margin-right: 14px;">
          <span class="material-icons">notifications</span>
        </el-button>
        <el-avatar size="medium" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsvTqTh8m_w349kBvPZdi6MjJBMex5ZQ862zE8XRA7nrnCCuctC5c6VOfitsjj5yImyfLFdz3VtTzqiopr-lGY7ksgGP7VD4ymMoZ-TTk9JkZN4gjL5s5Oh7l6lmpbS-MET_6u8flRKgI_7MgZHCMoI3mN128MJy6crYDMDZxPbPPuMsAzdUlYBaZ15CIlTfcuYKtiO3EpmWjPNUq5Ev0iROEG7ioobPwIUw-hnedbrmq_lGk8GT25UNdbQPKWK-eGqS-kwYlCRXs" />
      </div>
    </div>
  </el-header>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const navItems = [
  { name: '首页', path: '/test-platform' },
  { name: '数据集', path: '/datasets' },
  { name: '排行榜', path: '/leaderboard' },
  { name: '数据异变', path: '/data-mutation' },
  { name: '历史记录', path: '/history' }
]

const activePath = computed(() => route.path)
</script> 