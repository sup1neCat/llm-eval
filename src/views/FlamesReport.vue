<template>
  <div class="flames-report-container">
    <el-card class="flames-report-card">
      <h2>Flames测评报告</h2>
      <div class="score-section">
        <div>
          <span class="score-label">综合无害率：</span>
          <span class="score-value">{{ (report.harmless_rate * 100).toFixed(2) }}%</span>
        </div>
        <div>
          <span class="score-label">综合得分：</span>
          <span class="score-value">{{ report.harmless_score.toFixed(2) }}</span>
        </div>
      </div>
      <el-table :data="dimTableData" style="width: 100%; margin-top: 24px;">
        <el-table-column prop="dim" label="维度" width="120" />
        <el-table-column prop="rate" label="无害率" />
        <el-table-column prop="score" label="得分" />
      </el-table>
    </el-card>
    <div class="flames-details-list-outer">
      <div class="flames-details-list-grid">
        <div
          v-for="dim in Object.keys(dimMap)"
          :key="dim"
          class="details-block"
          :style="{ borderLeft: '8px solid ' + dimColorMap[dim], background: '#f9fafb' }"
        >
          <div class="details-dim" :style="{ color: dimColorMap[dim] }">
            <el-icon style="vertical-align: middle; margin-right: 6px;">
              <component :is="dimIconMap[dim]" />
            </el-icon>
            {{ dimMap[dim] }}
          </div>
          <div class="details-item"><span class="details-label">场景描述：</span>{{ report.examples?.[dim]?.prompt || '——' }}</div>
          <div class="details-item"><span class="details-label">模型回复：</span>{{ report.examples?.[dim]?.response || '——' }}</div>
          <div class="details-item"><span class="details-label">注释：</span>
            <span v-if="report.examples?.[dim]?.annotation">
              <el-tag :color="scoreColor(report.examples[dim].annotation.score)" effect="dark" style="margin-right: 8px;">分数：{{ report.examples[dim].annotation.score }}</el-tag>
              <span class="details-annotation">{{ report.examples[dim].annotation.explanation }}</span>
            </span>
            <span v-else>——</span>
          </div>
        </div>
        <div class="details-block details-block-empty"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { StarFilled, WarningFilled, CircleCheckFilled, Lock, ScaleToOriginal } from '@element-plus/icons-vue'
// 假设API方法名为fetchFlamesReport，需在apis/evaluation.js中实现
import { fetchFlamesReport } from '../apis/evaluation'

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
  Fairness: StarFilled,
  Safety: WarningFilled,
  Morality: CircleCheckFilled,
  'Data protection': Lock,
  Legality: ScaleToOriginal
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
</script>

<style scoped>
.flames-report-container {
  background: #f8fafc;
  min-height: 100vh;
  padding: 40px 0;
}
.flames-report-card {
  min-width: 600px;
  max-width: 700px;
  margin: 0 auto;
  padding: 32px;
  background: #fff;
  border-radius: 18px;
}
.score-section {
  display: flex;
  gap: 32px;
  margin-bottom: 18px;
}
.score-label {
  font-weight: bold;
  color: #1e293b;
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
.flames-details-list-grid {
  width: 100%;
  max-width: 1050px;
  min-width: 700px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 32px;
  box-sizing: border-box;
}
.details-block {
  background: #f9fafb;
  border-radius: 14px;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
  padding: 20px 28px 16px 24px;
  border-left-width: 8px;
  border-left-style: solid;
  transition: box-shadow 0.2s;
  min-height: 220px;
  box-sizing: border-box;
}
.details-block:hover {
  box-shadow: 0 4px 16px 0 rgba(37,99,235,0.10);
}
.details-block-empty {
  background: transparent;
  box-shadow: none;
  border-left: none;
}
.details-dim {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}
.details-item {
  margin-bottom: 4px;
  line-height: 1.7;
}
.details-label {
  color: #1e293b;
  font-weight: 500;
}
.details-annotation {
  color: #64748b;
  font-size: 0.98em;
}
</style> 