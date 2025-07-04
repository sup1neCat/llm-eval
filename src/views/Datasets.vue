<template>
  <div class="datasets-page-flex">
    <!-- 左侧分组/标签筛选（按e.html分类） -->
    <aside class="datasets-sidebar">
      <div class="sidebar-section">
        <div class="sidebar-title">能力评估</div>
        <div class="sidebar-tags">
          <el-tag
            v-for="tag in abilityTags"
            :key="tag"
            :type="selectedAbility === tag ? 'primary' : 'info'"
            @click="selectAbilityTag(tag)"
            class="sidebar-tag"
            effect="plain"
            round
          >{{ tag }}</el-tag>
        </div>
      </div>
      <div class="sidebar-section">
        <div class="sidebar-title">对齐评估</div>
        <div class="sidebar-tags">
          <el-tag
            v-for="tag in alignTags"
            :key="tag"
            :type="selectedAlign === tag ? 'primary' : 'info'"
            @click="selectAlignTag(tag)"
            class="sidebar-tag"
            effect="plain"
            round
          >{{ tag }}</el-tag>
        </div>
      </div>
      <div class="sidebar-section">
        <div class="sidebar-title">安全评估</div>
        <div class="sidebar-tags">
          <el-tag
            v-for="tag in securityTags"
            :key="tag"
            :type="selectedSecurity === tag ? 'primary' : 'info'"
            @click="selectSecurityTag(tag)"
            class="sidebar-tag"
            effect="plain"
            round
          >{{ tag }}</el-tag>
        </div>
      </div>
    </aside>
    <!-- 右侧内容区 -->
    <section class="datasets-main">
      <div class="task-list-title-large">任务列表</div>
      <div class="datasets-main-header">
        <el-input v-model="search" placeholder="请输入关键词搜索" class="datasets-search" clearable />
        <el-button type="primary" class="datasets-create-btn">创建数据集</el-button>
        <el-select v-model="sort" class="datasets-sort" placeholder="综合排序" size="small">
          <el-option label="综合排序" value="default" />
          <el-option label="最新创建" value="new" />
          <el-option label="最早创建" value="old" />
        </el-select>
      </div>
      <div class="datasets-list new-ui">
        <div class="dataset-card new-ui" v-for="(ds, idx) in filteredDatasets" :key="ds.title + idx">
          <div class="dataset-title-row">
            <span class="dataset-title">{{ ds.title }}</span>
            <span class="dataset-author">{{ ds.author }}</span>
          </div>
          <div class="dataset-desc">{{ ds.desc }}</div>
          <div class="dataset-tags-row">
            <el-tag
              v-for="tag in ds.tags"
              :key="tag"
              class="dataset-tag"
              effect="plain"
              round
            >{{ tag }}</el-tag>
          </div>
          <div class="dataset-meta-row">
            <span class="dataset-meta-time">{{ ds.time }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// e.html分类
const abilityTags = ['推理能力', '代码能力', '理解能力', '对话能力', '翻译能力'];
const alignTags = ['道德性', '公平性', '毒性', '幻觉'];
const securityTags = ['越狱攻击', '后门攻击'];

const selectedAbility = ref('');
const selectedAlign = ref('');
const selectedSecurity = ref('');
const search = ref('');
const sort = ref('default');

const allDatasets = [
  { title: 'AQUA-RAT', tags: ['推理能力'], desc: 'AQUA-RAT：数学推理与常识推理数据集', author: 'xxx', time: '2024-06-30' },
  { title: 'ARC', tags: ['推理能力'], desc: 'ARC：抽象推理挑战数据集', author: 'xxx', time: '2024-06-30' },
  { title: 'HumanEval', tags: ['代码能力'], desc: 'HumanEval：代码生成与理解评测', author: 'xxx', time: '2024-06-30' },
  { title: 'CodeXGLUE', tags: ['代码能力'], desc: 'CodeXGLUE：多语言代码任务数据集', author: 'xxx', time: '2024-06-30' },
  { title: 'SQuAD', tags: ['理解能力'], desc: 'SQuAD：阅读理解与问答数据集', author: 'xxx', time: '2024-06-30' },
  { title: 'CLUEbenchmark', tags: ['理解能力'], desc: 'CLUEbenchmark：中文理解评测', author: 'xxx', time: '2024-06-30' },
  { title: 'MT Bench', tags: ['对话能力'], desc: 'MT Bench：多轮对话能力评测', author: 'xxx', time: '2024-06-30' },
  { title: 'STSB', tags: ['翻译能力'], desc: 'STSB：语义文本相似度与翻译', author: 'xxx', time: '2024-06-30' },
  { title: 'CValues', tags: ['道德性', '公平性', '毒性'], desc: 'CValues：道德性、公平性、毒性评测', author: 'xxx', time: '2024-06-30' },
  { title: 'Flames', tags: ['道德性', '公平性', '毒性'], desc: 'Flames：道德与价值观评测', author: 'xxx', time: '2024-06-30' },
  { title: 'MMLU', tags: ['幻觉'], desc: 'MMLU：多学科知识与幻觉检测', author: 'xxx', time: '2024-06-30' },
  { title: 'TruthfulQA', tags: ['幻觉'], desc: 'TruthfulQA：事实性与幻觉评测', author: 'xxx', time: '2024-06-30' },
];

function selectAbilityTag(tag) {
  selectedAbility.value = selectedAbility.value === tag ? '' : tag;
  selectedAlign.value = '';
  selectedSecurity.value = '';
}
function selectAlignTag(tag) {
  selectedAlign.value = selectedAlign.value === tag ? '' : tag;
  selectedAbility.value = '';
  selectedSecurity.value = '';
}
function selectSecurityTag(tag) {
  selectedSecurity.value = selectedSecurity.value === tag ? '' : tag;
  selectedAbility.value = '';
  selectedAlign.value = '';
}

const filteredDatasets = computed(() => {
  let list = allDatasets;
  if (selectedAbility.value) list = list.filter(ds => ds.tags.includes(selectedAbility.value));
  if (selectedAlign.value) list = list.filter(ds => ds.tags.includes(selectedAlign.value));
  if (selectedSecurity.value) list = [];
  if (search.value) list = list.filter(ds => ds.title.includes(search.value) || ds.desc.includes(search.value));
  if (sort.value === 'new') list = [...list].sort((a, b) => b.time.localeCompare(a.time));
  if (sort.value === 'old') list = [...list].sort((a, b) => a.time.localeCompare(b.time));
  return list;
});
</script>

<style scoped>
.datasets-page-flex {
  display: flex;
  gap: 32px;
  align-items: flex-start;
  width: 100%;
}
.datasets-sidebar {
  width: 240px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(24,64,122,0.06);
  padding: 32px 18px 24px 18px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  position: sticky;
  top: 32px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
}
.sidebar-section {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: 1.5px solid #f0f2f5;
  padding-top: 0;
  padding-left: 2px;
  padding-right: 2px;
  padding-bottom: 18px;
}
.sidebar-section:last-child {
  border-bottom: none;
}
.sidebar-title {
  font-size: 1.08rem;
  font-weight: 700;
  color: #18344b;
  margin-bottom: 14px;
  letter-spacing: 0.5px;
  padding-left: 2px;
  position: relative;
}
.sidebar-title::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 18px;
  background: linear-gradient(180deg,#1890ff 0%,#a18fff 100%);
  border-radius: 4px;
  margin-right: 10px;
  vertical-align: middle;
}
.sidebar-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 8px;
  padding-left: 2px;
}
.sidebar-tag {
  cursor: pointer;
  font-size: 15px;
  padding: 6px 20px;
  border-radius: 18px;
  margin-bottom: 4px;
  font-weight: 500;
  background: #f7fafd;
  color: #18344b;
  border: 1.5px solid #e6e6e6;
  transition: background 0.18s, color 0.18s, border 0.18s, box-shadow 0.18s;
  box-shadow: 0 1px 4px rgba(24,144,255,0.04);
}
.sidebar-tag:hover {
  background: #e6f7ff;
  color: #1890ff;
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24,144,255,0.10);
}
.el-tag.sidebar-tag.is-plain.is-info {
  background: #f7fafd;
  color: #18344b;
  border: 1.5px solid #e6e6e6;
}
.el-tag.sidebar-tag.is-plain.is-primary {
  background: linear-gradient(90deg,#1890ff 0%,#a18fff 100%);
  color: #fff;
  border: 1.5px solid #1890ff;
  box-shadow: 0 2px 8px rgba(24,144,255,0.10);
}
.datasets-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.datasets-main-header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 24px;
}
.datasets-search {
  width: 320px;
}
.datasets-create-btn {
  margin-left: auto;
  font-size: 15px;
  border-radius: 8px;
  padding: 8px 28px;
}
.datasets-sort {
  width: 120px;
}
.datasets-list.new-ui {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.dataset-card,
.dataset-card.new-ui {
  font-size: 0.95rem;
}
.dataset-card.new-ui {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(24,64,122,0.06);
  border: 1.5px solid #e6e6e6;
  padding: 32px 32px 22px 32px;
  transition: box-shadow 0.2s, transform 0.2s, background 0.2s, border 0.2s, color 0.2s;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}
.dataset-card.new-ui:hover {
  box-shadow: 0 8px 24px rgba(24,144,255,0.10);
  transform: translateY(-2px) scale(1.02);
}
.dataset-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.dataset-title {
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 1px;
  color: #18344b;
}
.dataset-author {
  font-size: 14px;
  color: #888;
  margin-left: 12px;
}
.dataset-desc {
  color: #555;
  font-size: 15px;
  min-height: 36px;
  line-height: 1.6;
  margin-bottom: 12px;
}
.dataset-tags-row {
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.dataset-tag {
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 10px;
  font-size: 14px;
  padding: 2px 12px;
  margin-right: 8px;
}
.dataset-meta-row {
  display: flex;
  align-items: center;
  gap: 18px;
  color: #888;
  font-size: 13px;
  margin-top: 8px;
}
.dataset-meta-time {
  color: #888;
}
.task-list-title-large {
  font-size: 2.1rem;
  font-weight: 800;
  color: #222;
  margin-bottom: 18px;
  letter-spacing: 1px;
  line-height: 1.2;
}
</style> 