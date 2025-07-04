<template>
  <div class="mutation-bg">
    <div class="mutation-container">
      <div class="mutation-title">数据异变</div>
      <div class="mutation-desc">支持对原始数据集进行多种异变操作（如扰动、攻击、增强等），用于测试模型的鲁棒性和安全性。</div>
      <div class="mutation-main">
        <!-- 左侧 数据集选择 -->
        <div class="mutation-card mutation-dataset-select">
          <div class="mutation-card-title">数据集选择</div>
          <el-select v-model="selectedDataset" class="mutation-select" size="large" style="width:100%;margin-bottom:8px;">
            <el-option v-for="item in datasets" :key="item" :label="item" :value="item" />
          </el-select>
          <div class="mutation-upload" @click="onUpload">+ 上传新数据集</div>
        </div>
        <!-- 中间 异变类型与参数 -->
        <div class="mutation-card mutation-type-config">
          <div class="mutation-card-title">异变类型</div>
          <el-select v-model="selectedType" class="mutation-select" size="large" style="width:100%;margin-bottom:12px;">
            <el-option v-for="item in types" :key="item" :label="item" :value="item" />
          </el-select>
          <div class="mutation-param-label">参数配置</div>
          <el-input-number v-model="noiseLevel" :min="0" :max="1" :step="0.01" size="large" style="width:100%;margin-bottom:18px;" placeholder="噪声强度" />
          <el-button type="primary" size="large" style="width:100%;" @click="onGenerate">生成异变数据</el-button>
        </div>
        <!-- 右侧 对比预览 -->
        <div class="mutation-card mutation-preview">
          <div class="mutation-card-title">数据对比预览</div>
          <div class="mutation-preview-row">
            <div class="mutation-preview-block">
              <div class="mutation-preview-label">原始数据</div>
              <div class="mutation-preview-content">[图片/文本]</div>
            </div>
            <div class="mutation-preview-block">
              <div class="mutation-preview-label">异变后</div>
              <div class="mutation-preview-content">[图片/文本]</div>
            </div>
          </div>
          <div class="mutation-history-title">异变历史</div>
          <ul class="mutation-history-list">
            <li v-for="item in history" :key="item">{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const datasets = ref(['COCO', 'PASCAL VOC'])
const types = ref(['高斯噪声', '遮挡', '对抗样本'])
const selectedDataset = ref('COCO')
const selectedType = ref('高斯噪声')
const noiseLevel = ref(0.5)
const history = ref([
  '2024-06-01 高斯噪声',
  '2024-05-28 遮挡'
])
function onUpload() {
  // 上传新数据集逻辑
}
function onGenerate() {
  // 生成异变数据逻辑
}
</script>

<style scoped>
.mutation-bg {
  background: #f7fafd;
  min-height: 100vh;
  padding: 0;
}
.mutation-container {
  max-width: 1200px;
  margin: 32px auto 0 auto;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(24,64,122,0.06);
  padding: 36px 40px 40px 40px;
}
.mutation-title {
  font-size: 2rem;
  font-weight: bold;
  color: #18344b;
  margin-bottom: 8px;
}
.mutation-desc {
  color: #666;
  font-size: 15px;
  margin-bottom: 30px;
}
.mutation-main {
  display: flex;
  gap: 32px;
  align-items: flex-start;
  flex-wrap: wrap;
}
.mutation-card {
  background: #f8fafc;
  border-radius: 10px;
  box-shadow: 0 1px 6px rgba(24,64,122,0.04);
  padding: 24px 22px 18px 22px;
  min-width: 220px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.mutation-dataset-select {
  max-width: 260px;
}
.mutation-type-config {
  max-width: 340px;
}
.mutation-preview {
  max-width: 340px;
}
.mutation-card-title {
  font-weight: bold;
  margin-bottom: 12px;
  font-size: 1.08rem;
  color: #18344b;
}
.mutation-upload {
  color: #1890ff;
  cursor: pointer;
  margin-top: 6px;
  font-size: 15px;
  transition: color 0.18s;
}
.mutation-upload:hover {
  color: #14407a;
  text-decoration: underline;
}
.mutation-param-label {
  margin-bottom: 8px;
  color: #888;
  font-size: 14px;
}
.mutation-preview-row {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}
.mutation-preview-block {
  flex: 1;
  text-align: center;
}
.mutation-preview-label {
  color: #888;
  font-size: 13px;
  margin-bottom: 4px;
}
.mutation-preview-content {
  background: #f5f5f5;
  height: 80px;
  border-radius: 6px;
  margin: 6px 0;
  line-height: 80px;
  color: #888;
  font-size: 15px;
}
.mutation-history-title {
  margin-top: 10px;
  font-size: 14px;
  color: #888;
}
.mutation-history-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 60px;
  overflow: auto;
}
.mutation-history-list li {
  margin-bottom: 6px;
  color: #444;
  font-size: 14px;
}
@media (max-width: 900px) {
  .mutation-main {
    flex-direction: column;
    gap: 18px;
  }
  .mutation-card {
    min-width: 0;
    width: 100%;
    padding: 16px 8px 12px 8px;
  }
}
</style> 