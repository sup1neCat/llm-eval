<template>
  <div class="flames-report-container">
    <div class="flames-main-card">
      <!-- 返回历史记录按钮 -->
      <div style="margin-bottom: 24px;">
        <el-button type="default" @click="goBack">返回历史记录</el-button>
      </div>
      <!-- 标题与导出报告按钮同行 -->
      <div class="flames-header-row">
        <div>
          <h1 class="flames-title">Flames测评报告</h1>
        </div>
        <el-button type="primary" class="export-btn" @click="exportReport">
          <el-icon style="vertical-align: middle; margin-right: 4px;">
            <Download />
          </el-icon>
          导出报告
        </el-button>
      </div>
      <!-- 任务信息区域 -->
      <div class="flames-info-row">
        <span>任务ID: <span class="flames-info-strong">{{ route.params.id || '--' }}</span></span>
        <span>测试时间: {{ report.testTime || '--' }}</span>
        <el-link type="primary" :underline="true" style="font-size: 1.05rem;">对齐评估</el-link>
      </div>
      <div class="flames-report-card-section">
        <div class="score-section">
          <div class="score-block">
            <div class="score-block-title">综合无害率</div>
            <el-progress
              :percentage="(report.harmless_rate * 100)"
              type="circle"
              :stroke-width="10"
              :color="harmlessRateColor(report.harmless_rate)"
              :duration="300"
              :width="120"
              :show-text="true"
              style="margin-top: 8px;"
            >
              <template #default>
                <span :style="{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontSize: '0.95rem', color: harmlessRateColor(report.harmless_rate), fontWeight: 'bold' }">{{ (report.harmless_rate * 100).toFixed(2) }}%</span>
              </template>
            </el-progress>
          </div>
          <div class="score-block">
            <div class="score-block-title">综合得分</div>
            <span class="score-value" :style="{ fontSize: '2rem', color: scoreColorByValue(report.harmless_score), fontWeight: 'bold', display: 'block', marginTop: '32px' }">{{ report.harmless_score.toFixed(2) }}</span>
          </div>
        </div>
        <el-table :data="dimTableData" style="width: 100%; margin-top: 24px;">
          <el-table-column prop="dim" label="维度" width="120" />
          <el-table-column prop="rate" label="无害率" />
          <el-table-column prop="score" label="得分" />
        </el-table>
      </div>
      <div class="dim-tabs-section">
        <el-tabs v-model="activeTab" class="dim-tabs" tab-position="top">
          <el-tab-pane
            v-for="dim in dimKeys"
            :key="dim"
            :label="''"
            :name="dim"
          >
            <template #label>
              <span class="dim-tab-label">
                <span v-html="dimIconMap[dim].template" class="dim-tab-icon"></span>
                <span class="dim-tab-title">{{ dimMap[dim] }}</span>
              </span>
            </template>
            <!-- 极简分组列表，分割线 -->
            <div class="dim-list-group">
              <div class="dim-list-item">
                <div class="dim-list-title">场景描述</div>
                <div class="dim-list-content">{{ report.examples?.[dim]?.prompt || '——' }}</div>
              </div>
              <div class="dim-list-item">
                <div class="dim-list-title">模型回复</div>
                <div class="dim-list-content" :style="{ color: scoreColor(report.examples[dim]?.annotation?.score) }">{{ report.examples?.[dim]?.response || '——' }}</div>
              </div>
              <div class="dim-list-item">
                <div class="dim-list-title">注释</div>
                <div class="dim-list-content">
                  <span v-if="report.examples?.[dim]?.annotation">
                    <el-tag :color="scoreColor(report.examples[dim].annotation.score)" effect="dark" style="margin-right: 8px;">分数：{{ report.examples[dim].annotation.score }}</el-tag>
                    <span class="details-annotation">{{ report.examples[dim].annotation.explanation }}</span>
                  </span>
                  <span v-else>——</span>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { StarFilled, WarningFilled, CircleCheckFilled, Lock, ScaleToOriginal, ArrowLeft, Download } from '@element-plus/icons-vue'
import { fetchFlamesReport, downloadReportPDF } from '../apis/evaluation'

const route = useRoute()
const report = ref({
  harmless_rate: 0,
  harmless_rate_each_dim: {},
  harmless_score: 0,
  harmless_score_each_dim: {},
  examples: {}
})
const loading = ref(false)

const dimMap = {
  Fairness: '公平性',
  Safety: '安全性',
  Morality: '道德性',
  'Data protection': '数据保护',
  Legality: '合法性'
}

// 新增activeTab，默认第一个维度
const dimKeys = Object.keys(dimMap)
const activeTab = ref(dimKeys[0])

const dimTableData = computed(() => {
  const rateDims = report.value.harmless_rate_each_dim || {}
  const scoreDims = report.value.harmless_score_each_dim || {}
  return Object.keys(dimMap).map(key => ({
    dim: dimMap[key],
    rate: (rateDims[key] * 100).toFixed(2) + '%',
    score: scoreDims[key] !== undefined ? scoreDims[key].toFixed(2) : '--'
  }))
})

const dimColorMap = {
  Fairness: '#2563eb', // 蓝
  Safety: '#f59e42',   // 橙
  Morality: '#ef4444', // 红
  'Data protection': '#10b981', // 绿
  Legality: '#7c3aed'  // 紫
}
const dimIconMap = {
  Fairness: {
    template: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8" stroke="#8CA6DB" stroke-width="2"/><path d="M10 5V15" stroke="#8CA6DB" stroke-width="2" stroke-linecap="round"/><path d="M5 10H15" stroke="#8CA6DB" stroke-width="2" stroke-linecap="round"/></svg>`
  },
  Safety: {
    template: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="12" height="12" rx="4" stroke="#8CA6DB" stroke-width="2"/><path d="M10 7V11" stroke="#8CA6DB" stroke-width="2" stroke-linecap="round"/><circle cx="10" cy="14" r="1" fill="#8CA6DB"/></svg>`
  },
  Morality: {
    template: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="10" cy="10" rx="8" ry="6" stroke="#8CA6DB" stroke-width="2"/><path d="M6 10C6 12 14 12 14 10" stroke="#8CA6DB" stroke-width="2" stroke-linecap="round"/></svg>`
  },
  'Data protection': {
    template: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="8" width="10" height="7" rx="2" stroke="#8CA6DB" stroke-width="2"/><path d="M10 5V8" stroke="#8CA6DB" stroke-width="2" stroke-linecap="round"/></svg>`
  },
  Legality: {
    template: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="12" height="12" rx="6" stroke="#8CA6DB" stroke-width="2"/><path d="M10 8V12" stroke="#8CA6DB" stroke-width="2" stroke-linecap="round"/></svg>`
  }
}

const loadReport = async () => {
  loading.value = true
  try {
    const res = await fetchFlamesReport(route.params.id)
    report.value = res || {}
  } catch (e) {
    ElMessage.error('获取Flames测评报告失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadReport()
})

const scoreColor = (score) => {
  if (score === 3) return '#22c55e'; // 绿色
  if (score === 2) return '#f59e42'; // 橙色
  if (score === 1) return '#ef4444'; // 红色
  return '#64748b';
}

// 综合无害率颜色函数
const harmlessRateColor = (rate) => {
  if (rate < 0.4) return '#ef4444'; // 红色
  if (rate < 0.7) return '#f59e42'; // 黄色
  return '#22c55e'; // 绿色
}

// 综合得分颜色函数
const scoreColorByValue = (score) => {
  if (score == null || isNaN(score)) return '#64748b';
  if (score < 40) return '#ef4444';
  if (score < 70) return '#f59e42';
  return '#22c55e';
}

const router = useRoute().router || useRoute();

const goBack = () => {
  // 跳转到历史记录
  if (typeof router.push === 'function') {
    router.push('/history')
  } else {
    window.location.href = '/history'
  }
}

const exportReport = () => {
  if (route.params.id) {
    downloadReportPDF(route.params.id)
  } else {
    ElMessage.error('任务ID缺失，无法导出报告')
  }
}
</script>

<style scoped>
.flames-report-container {
  background: #F4F6FA;
  min-height: 100vh;
  padding: 40px 0;
}
.flames-main-card {
  background: #fff;
  min-width: 1000px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px;
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(140,166,219,0.06);
}
.flames-report-card-section {
  margin-bottom: 32px;
}
.dim-tabs-section {
  margin-bottom: 0;
}
.flames-report-card, .dim-tabs-outer {
  background: none !important;
  box-shadow: none !important;
  border-radius: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
  max-width: unset !important;
  width: 100% !important;
}
.el-table {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #E3E8EF;
  box-shadow: none;
}
.el-table th {
  background: #F6F8FB;
  color: #6B7A90;
  border-bottom: 1.5px solid #E3E8EF;
}
.el-table td {
  background: #fff;
  color: #3A4454;
}
.el-table__row:nth-child(even) td {
  background: #F6F8FB;
}
.score-section {
  display: flex;
  gap: 96px;
  margin-bottom: 18px;
  justify-content: center;
}
@media (max-width: 600px) {
  .score-section {
    gap: 24px;
  }
}
.score-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 160px;
}
.score-block-title {
  font-weight: bold;
  color: #1e293b;
  font-size: 1.13rem;
  margin-bottom: 4px;
  letter-spacing: 0.5px;
}
.score-value {
  color: #2563eb;
  font-size: 1.2rem;
  margin-left: 8px;
}
.flames-details-list-outer {
  width: 100%;
  max-width: 1200px;
  margin: 40px auto 0 auto;
  background: #f3f6fa;
  border-radius: 24px;
  box-shadow: 0 4px 24px 0 rgba(37,99,235,0.06);
  padding: 40px 32px 32px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.dim-tabs-outer {
  background: #F6F8FB;
  max-width: 1000px;
  width: 90vw;
  margin: 40px auto 0 auto;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 4px 24px 0 rgba(140,166,219,0.06);
}
.dim-tabs {
  --el-tabs-header-height: 62px;
  --el-tabs-header-bg-color: #F6F8FB;
  --el-tabs-active-color: #8CA6DB;
  --el-tabs-border-radius: 18px;
  font-size: 1.13rem;
  margin-bottom: 32px;
}
.dim-tab-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 1.13rem;
  color: #3A4454;
}
.dim-tab-icon {
  display: flex;
  align-items: center;
  margin-right: 6px;
  font-size: 1.25em;
}
.dim-tab-title {
  margin-right: 2px;
}
.dim-list-group {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 32px 0 0 0;
  font-size: 1.08rem;
}
.dim-list-item {
  padding: 0 0 18px 0;
  margin-bottom: 0;
  border-bottom: 1px solid #E3E8EF;
}
.dim-list-item:last-child {
  border-bottom: none;
}
.dim-list-title {
  font-weight: bold;
  color: #8CA6DB;
  font-size: 1.13rem;
  margin-bottom: 2px;
}
.dim-list-content {
  color: #3A4454;
  font-size: 1.05rem;
  margin-bottom: 8px;
  word-break: break-all;
}
@media (max-width: 900px) {
  .flames-main-card {
    max-width: 98vw;
    width: 98vw;
    padding: 18px;
    margin: 24px auto 0 auto;
  }
  .dim-tabs-outer {
    max-width: 98vw;
    width: 98vw;
    padding: 18px;
    margin: 24px auto 0 auto;
  }
  .dim-tabs {
    --el-tabs-header-height: 44px;
    font-size: 0.98rem;
  }
  .dim-list-group {
    padding: 8px 0 0 0;
    font-size: 0.98rem;
  }
  .dim-list-title {
    font-size: 1.01rem;
  }
  .dim-list-content {
    font-size: 0.98rem;
  }
  .flames-report-card, .dim-tabs-outer {
    background: none !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
    max-width: unset !important;
    width: 100% !important;
  }
}
.flames-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}
.flames-title {
  font-size: 2.2rem;
  font-weight: bold;
  color: #1e293b;
  margin-bottom: 6px;
  margin-top: 0;
}
.export-btn {
  font-weight: 500;
  font-size: 1rem;
  border-radius: 8px;
  padding: 10px 24px;
}
.flames-info-row {
  display: flex;
  gap: 24px;
  align-items: center;
  font-size: 1.05rem;
  color: #64748b;
  margin-bottom: 18px;
  margin-top: 0;
}
.flames-info-strong {
  color: #334155;
  font-weight: 500;
}
@media (max-width: 600px) {
  .flames-header-row {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  .export-btn {
    width: 100%;
    margin-top: 8px;
  }
  .flames-info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style> 