<template>
  <div class="leaderboard-bg">
    <div class="leaderboard-container">
      <div class="leaderboard-title">排行榜</div>
      <div class="leaderboard-desc">展示各类模型在不同安全测试维度下的综合评分，支持多维度筛选。</div>
      <div class="leaderboard-main">
        <div class="leaderboard-radar-card">
          <div class="radar-title">模型综合能力雷达图</div>
          <canvas id="modelRadar" width="520" height="420"></canvas>
        </div>
        <div class="leaderboard-table-wrap">
          <div class="leaderboard-filter-bar">
            <el-select v-model="filter.modelType" placeholder="模型类型" size="small" style="width:120px">
              <el-option label="全部" value="全部" />
              <el-option label="分类模型" value="分类模型" />
              <el-option label="检测模型" value="检测模型" />
            </el-select>
            <el-select v-model="filter.dimension" placeholder="测试维度" size="small" style="width:120px">
              <el-option label="综合评分" value="综合评分" />
              <el-option label="鲁棒性" value="鲁棒性" />
              <el-option label="攻击成功率" value="攻击成功率" />
            </el-select>
            <el-select v-model="filter.timeRange" placeholder="时间范围" size="small" style="width:120px">
              <el-option label="近一周" value="近一周" />
              <el-option label="近一月" value="近一月" />
              <el-option label="全部" value="全部" />
            </el-select>
            <el-input v-model="filter.search" placeholder="搜索模型名称..." size="small" style="width:160px" clearable />
          </div>
          <el-table :data="filteredData" class="leaderboard-table" style="width:100%;margin-top:10px;" border stripe>
            <el-table-column prop="rank" label="排名" width="60" align="left">
              <template #default="scope">
                <span class="rank-index">{{ scope.row.rank }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="模型名称" min-width="120" />
            <el-table-column prop="score" label="分数" min-width="80">
              <template #default="scope">
                <span class="score-value">{{ scope.row.score }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="dimension" label="测试维度" min-width="100" />
            <el-table-column prop="uploader" label="上传者" min-width="80" />
            <el-table-column prop="date" label="测试时间" min-width="100" />
            <el-table-column label="操作" min-width="80">
              <template #default>
                <el-link type="primary" :underline="false">详情</el-link>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
let Chart = null
const filter = ref({
  modelType: '全部',
  dimension: '综合评分',
  timeRange: '近一周',
  search: ''
})
const tableData = ref([
  { rank: 1, name: 'ResNet-50', score: 98.2, dimension: '综合能力', uploader: '张三', date: '2024-06-01' },
  { rank: 2, name: 'YOLOv5', score: 95.7, dimension: '综合能力', uploader: '李四', date: '2024-05-28' },
  { rank: 3, name: 'BERT', score: 93.4, dimension: '综合能力', uploader: '王五', date: '2024-05-20' }
])
const filteredData = computed(() => {
  let data = tableData.value
  if (filter.value.modelType !== '全部') {
    data = data.filter(d => d.name.includes(filter.value.modelType))
  }
  if (filter.value.dimension !== '综合评分') {
    data = data.filter(d => d.dimension === filter.value.dimension)
  }
  if (filter.value.timeRange !== '全部') {
    // 简单模拟，实际应按时间过滤
    data = data.filter((d, i) => i < 2)
  }
  if (filter.value.search) {
    data = data.filter(d => d.name.includes(filter.value.search))
  }
  return data
})
onMounted(async () => {
  if (!window.Chart) {
    Chart = (await import('chart.js/auto')).default
  } else {
    Chart = window.Chart
  }
  const radarData = {
    labels: ['推理能力', '代码能力', '理解能力', '对话能力', '翻译能力', '道德性', '公平性', '毒性', '幻觉'],
    datasets: [
      {
        label: 'ResNet-50',
        data: [95, 80, 92, 70, 60, 85, 90, 95, 80],
        fill: true,
        backgroundColor: 'rgba(24,144,255,0.2)',
        borderColor: 'rgba(24,144,255,1)',
        pointBackgroundColor: 'rgba(24,144,255,1)',
      },
      {
        label: 'YOLOv5',
        data: [90, 85, 88, 65, 55, 80, 85, 90, 75],
        fill: true,
        backgroundColor: 'rgba(250,173,20,0.15)',
        borderColor: 'rgba(250,173,20,1)',
        pointBackgroundColor: 'rgba(250,173,20,1)',
      },
      {
        label: 'BERT',
        data: [80, 95, 98, 90, 85, 88, 92, 85, 90],
        fill: true,
        backgroundColor: 'rgba(82,196,26,0.15)',
        borderColor: 'rgba(82,196,26,1)',
        pointBackgroundColor: 'rgba(82,196,26,1)',
      }
    ]
  }
  const radarConfig = {
    type: 'radar',
    data: radarData,
    options: {
      responsive: false,
      plugins: {
        legend: { position: 'top' },
        title: { display: false }
      },
      scales: {
        r: {
          angleLines: { display: true },
          suggestedMin: 0,
          suggestedMax: 100,
          pointLabels: { font: { size: 14 } }
        }
      }
    }
  }
  setTimeout(() => {
    const ctx = document.getElementById('modelRadar').getContext('2d')
    window.modelRadarChart = new Chart(ctx, radarConfig)
  }, 100)
})
</script>

<style scoped>
.leaderboard-bg {
  background: #f8fafc;
  min-height: 100vh;
  padding: 0;
}
.leaderboard-container {
  max-width: 1600px;
  margin: 30px auto 0 auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(24,64,122,0.06);
  padding: 32px 40px 40px 40px;
}
.leaderboard-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: #18344b;
}
.leaderboard-desc {
  color: #666;
  font-size: 15px;
  margin-bottom: 30px;
}
.leaderboard-main {
  display: flex;
  gap: 32px;
  align-items: flex-start;
  flex-wrap: wrap;
}
.leaderboard-radar-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(24,64,122,0.06);
  padding: 28px 32px;
  min-width: 600px;
  max-width: 700px;
  min-height: 540px;
}
.radar-title {
  font-weight: bold;
  margin-bottom: 38px;
  font-size: 1.7rem;
}
.leaderboard-table-wrap {
  flex: 1;
  min-width: 420px;
}
.leaderboard-filter-bar {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}
.leaderboard-table {
  background: transparent;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(24,64,122,0.04);
  font-size: 17px;
}
.rank-index {
  font-weight: bold;
  color: #14407a;
}
.score-value {
  color: #1890ff;
  font-weight: bold;
  font-size: 18px;
}
</style> 