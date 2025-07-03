<template>
  <div style="background: #f8fafc; min-height: 100vh; padding: 40px 0;">
    <div style="max-width: 1200px; margin: 0 auto;">
      <h2 style="font-size: 2.2rem; font-weight: bold; color: #1e293b; text-align: center; margin-bottom: 32px;">测试平台</h2>
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :md="8" :lg="8">
          <el-card style="border-radius: 16px; min-height: 320px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start;">
            <el-icon style="font-size: 48px; color: #409EFF; margin-bottom: 16px;"><Aim /></el-icon>
            <div style="font-size: 1.2rem; font-weight: 600; margin-bottom: 12px; text-align: center;">聚焦能力，精准评测</div>
            <div style="color: #475569; text-align: center;">
              覆盖推理、代码等多元能力，依托权威基准，精准挖掘大模型潜力边界。
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8" :lg="8">
          <el-card style="border-radius: 16px; min-height: 320px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start;">
            <el-icon style="font-size: 48px; color: #67C23A; margin-bottom: 16px;"><Connection /></el-icon>
            <div style="font-size: 1.2rem; font-weight: 600; margin-bottom: 12px; text-align: center;">锚定对齐，守护价值</div>
            <div style="color: #475569; text-align: center;">
              从道德、公平等维度把关，借标准体系，确保内容契合公序良俗。
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8" :lg="8">
          <el-card style="border-radius: 16px; min-height: 320px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start;">
            <el-icon style="font-size: 48px; color: #E6A23C; margin-bottom: 16px;"><Lock /></el-icon>
            <div style="font-size: 1.2rem; font-weight: 600; margin-bottom: 12px; text-align: center;">筑牢安全，护航应用</div>
            <div style="color: #475569; text-align: center;">
              聚焦幻觉、隐私等安全点，以专业测试，筑牢大模型可靠应用防线。
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div style="display: flex; justify-content: center; margin-top: 48px;">
        <el-button type="primary" @click="goToCreateTask" style="border-radius: 24px; height: 48px; font-size: 18px; padding: 0 36px; font-weight: 600; box-shadow: 0 4px 16px 0 rgba(64,158,255,0.08);">
          开始测试
          <el-icon style="margin-left: 8px;"><ArrowRight /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
  <router-view />
</template>

<script setup>
import { Aim, Connection, Lock, ArrowRight } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function goToCreateTask() {
  router.push('/test-platform/createTask')
}
</script>
