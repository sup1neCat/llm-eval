<template>
  <div class="container">
    <!-- 测试流程进度条和步骤指示 -->
    <div class="step-horizontal-bar-wrap">
      <div class="step-horizontal-bar-head">
        <div class="step-horizontal-bar-title step-progress-label">
          步骤 {{ step }}/3：{{ stepLabels[step-1] }}
        </div>
        <div class="step-horizontal-bar-status step-progress-percent">
          {{ Math.round(step * 100 / 3) }}%
        </div>
      </div>
      <div class="step-horizontal-bar">
        <div class="step-horizontal-bar-progress" :style="{width: `${step * 100 / 3}%`}" />
      </div>
    </div>
    <div class="main-content-wrap left-align">
      <!-- 步骤一：上传模型及参数配置（已精简） -->
      <div v-show="step===1" class="test-step-panel">
        <div class="step-title">上传模型</div>
        <div class="step-subtip">请输入模型名称、API中转地址和API：模型名称是为了保存预先设置而方便使用；API中转地址是指用于访问特定API的网络地址，它通常是一个URL，通过这个地址发送请求以获取或发送数据；API使用你申请的模型的API，提供该模型的使用权。</div>
        <div class="step-form">
          <div>
            <div class="form-label">模型名称</div>
            <input v-model="modelName" type="text" placeholder="请输入模型名称" class="input short" />
          </div>
          <div>
            <div class="form-label">API中转地址</div>
            <input v-model="apiProxy" type="text" placeholder="请输入API中转地址" class="input" />
          </div>
          <div>
            <div class="form-label">API</div>
            <input v-model="apiUrl" type="text" placeholder="请输入API" class="input" />
            <div class="btn-row">
              <button class="btn-check-api" @click="checkApi" :disabled="apiChecking">检查</button>
              <span class="api-check-result" :style="{color: apiCheckColor}">{{ apiCheckResult }}</span>
            </div>
            <div class="api-progress-wrap">
              <div class="api-progress-label">
                {{ apiChecking ? '检测中...' : (apiCheckProgress === 100 ? '检测完成' : '待检测') }}
              </div>
              <div class="api-progress-bar">
                <div class="api-progress-inner" :class="{ 'no-ani': progressNoAni }" :style="{width: apiCheckProgress + '%'}"></div>
              </div>
              <div class="api-progress-percent">{{ Math.round(apiCheckProgress) }}%</div>
            </div>
          </div>
        </div>
        <div class="step-btns">
          <button class="btn-next btn-primary" @click="nextStep">下一步</button>
        </div>
      </div>
      <!-- 步骤二：选择测评数据集 -->
      <div v-show="step===2" class="test-step-panel">
        <div class="step-title">选择测评数据集</div>
        <div class="step-subtip">请选择你希望用于模型测评的数据集，可多选。不同能力分区下可分别选择数据集，选中后会在下方增加tag显示，按照从左至右的顺序进行串行测评。如果选择安全下的越狱和后门检测，则需要额外设置一些参数。</div>
        <div class="selected-datasets-bar">
          <span v-for="(dsArr, ability) in selectedAbilityMap" :key="ability" class="tag">
            <b>{{ ability }}：</b>
            <span v-for="d in dsArr" :key="d" class="tag-inner">{{ d }}</span>
            <span class="tag-close" @click="removeAbility(ability)"> ×</span>
          </span>
        </div>
        <div class="dataset-select-flex">
          <div class="dataset-group-col">
            <div class="group-title">分类筛选</div>
            <div class="group-list">
              <div v-for="g in datasetGroupStructure" :key="g.key" :class="['tag', {selected: currentGroupKey===g.key}]" @click="selectGroup(g.key)">{{ g.group }}</div>
            </div>
            <div class="subgroup-list">
              <div v-for="sub in currentGroupSubs" :key="sub.key" :class="['tag', {selected: currentSubKey===sub.key}]" @click="selectSub(sub.key)">{{ sub.name }}</div>
            </div>
          </div>
          <div class="dataset-list-col">
            <div class="datasets-list">
              <div v-for="ds in currentDatasets" :key="ds.title" :class="['dataset-card', {selected: selectedDatasets.includes(ds.title)}]" @click="toggleDataset(ds.title)">
                <div class="card-top-bar" />
                <div class="dataset-title">{{ ds.title }}</div>
                <div class="dataset-desc">{{ ds.desc }}</div>
                <div class="dataset-tags">
                  <span v-for="t in getAllTags(ds.title)" :key="t" class="tag blue">{{ t }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="step-btns">
          <button class="btn-prev" @click="prevStep">上一步</button>
          <button class="btn-next btn-primary" @click="nextStep">下一步</button>
        </div>
      </div>
      <!-- 步骤三：审查页面 -->
      <div v-show="step===3" class="test-step-panel">
        <div class="step-title">审查与提交</div>
        <div class="step-subtip">请查看你填写和选择的所有内容是否有误，如果无误则点击提交开始在后台测评，测评顺序从上至下依次串行运行，请耐心等待，测评状态以及报告可在历史记录里面查看。</div>
        <div class="review-cards">
          <div class="review-card">
            <div class="review-label">模型名称</div>
            <div class="review-value">{{ modelName || '（未填写）' }}</div>
          </div>
          <div class="review-card">
            <div class="review-label">API中转地址</div>
            <div class="review-value">{{ apiProxy || '（未填写）' }}</div>
          </div>
          <div class="review-card">
            <div class="review-label">API</div>
            <div class="review-value">{{ apiUrl || '（未填写）' }}</div>
          </div>
          <div class="review-card">
            <div class="review-label">测评数据集</div>
            <div class="review-value">
              <template v-if="selectedDatasets.length">
                <div v-for="(dsArr, ability) in selectedAbilityMap" :key="ability" class="review-dataset-row">
                  <span class="tag blue ability-tag">{{ ability }}</span>
                  <span class="review-dataset-list">
                    <span v-for="d in dsArr" :key="d" class="review-dataset-item">{{ d }}</span>
                  </span>
                </div>
              </template>
              <span v-else>（未选择）</span>
            </div>
          </div>
        </div>
        <div class="step-btns">
          <button class="btn-prev" @click="prevStep">上一步</button>
          <button class="btn-next btn-primary" @click="submit">提交</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
const step = ref(1);
const stepLabels = ['上传模型', '选择测评数据集', '审查与提交'];
const modelName = ref('');
const apiProxy = ref('');
const apiUrl = ref('');
const apiCheckResult = ref('');
const apiCheckColor = ref('#888');
const selectedDatasets = ref([]);
const apiChecking = ref(false);
const apiCheckProgress = ref(0);
const progressNoAni = ref(false);
let progressTimer = null;

const datasetGroupStructure = [
  { group: '能力评估', key: 'ability', sub: [
    {name:'推理能力', key:'推理能力'},
    {name:'代码能力', key:'代码能力'},
    {name:'理解能力', key:'理解能力'},
    {name:'对话能力', key:'对话能力'},
    {name:'翻译能力', key:'翻译能力'}
  ]},
  { group: '对齐评估', key: 'alignment', sub: [
    {name:'道德性', key:'道德性'},
    {name:'公平性', key:'公平性'},
    {name:'毒性', key:'毒性'},
    {name:'幻觉', key:'幻觉'}
  ]},
  { group: '安全评估', key: 'security', sub: [
    {name:'越狱攻击', key:'越狱攻击'},
    {name:'后门攻击', key:'后门攻击'}
  ]}
];
const abilityDatasetMap = {
  '推理能力': [
    {title:'AQUA-RAT', tags:['推理能力'], desc:'AQUA-RAT：数学推理与常识推理数据集'},
    {title:'ARC', tags:['推理能力'], desc:'ARC：抽象推理挑战数据集'}
  ],
  '代码能力': [
    {title:'HumanEval', tags:['代码能力'], desc:'HumanEval：代码生成与理解评测'},
    {title:'CodeXGLUE', tags:['代码能力'], desc:'CodeXGLUE：多语言代码任务数据集'}
  ],
  '理解能力': [
    {title:'SQuAD', tags:['理解能力'], desc:'SQuAD：阅读理解与问答数据集'},
    {title:'CLUEbenchmark', tags:['理解能力'], desc:'CLUEbenchmark：中文理解评测'}
  ],
  '对话能力': [
    {title:'MT Bench', tags:['对话能力'], desc:'MT Bench：多轮对话能力评测'}
  ],
  '翻译能力': [
    {title:'STSB', tags:['翻译能力'], desc:'STSB：语义文本相似度与翻译'}
  ],
  '道德性': [
    {title:'CValues', tags:['道德性'], desc:'CValues：道德性评测'},
    {title:'Flames', tags:['道德性'], desc:'Flames：道德与价值观评测'}
  ],
  '公平性': [
    {title:'CValues', tags:['公平性'], desc:'CValues：公平性评测'},
    {title:'Flames', tags:['公平性'], desc:'Flames：公平与偏见评测'}
  ],
  '毒性': [
    {title:'CValues', tags:['毒性'], desc:'CValues：毒性内容检测'},
    {title:'Flames', tags:['毒性'], desc:'Flames：有害内容检测'}
  ],
  '幻觉': [
    {title:'MMLU', tags:['幻觉'], desc:'MMLU：多学科知识与幻觉检测'},
    {title:'TruthfulQA', tags:['幻觉'], desc:'TruthfulQA：事实性与幻觉评测'}
  ],
  '越狱攻击': [
    {title:'JailbreakEval', tags:['越狱攻击'], desc:'JailbreakEval：越狱攻击检测数据集'}
  ],
  '后门攻击': [
    {title:'BackdoorEval', tags:['后门攻击'], desc:'BackdoorEval：后门攻击检测数据集'}
  ]
};
const currentGroupKey = ref('ability');
const currentSubKey = ref('推理能力');
const currentGroupSubs = computed(() => {
  const group = datasetGroupStructure.find(g=>g.key===currentGroupKey.value);
  return group ? group.sub : [];
});
const currentDatasets = computed(() => abilityDatasetMap[currentSubKey.value] || []);
const selectedAbilityMap = computed(() => {
  // 能力名 => [数据集]
  const map = {};
  selectedDatasets.value.forEach(ds => {
    for(const [ability, arr] of Object.entries(abilityDatasetMap)){
      if(arr.some(item=>item.title===ds)){
        if(!map[ability]) map[ability] = [];
        map[ability].push(ds);
        break;
      }
    }
  });
  return map;
});
function selectGroup(key){
  currentGroupKey.value = key;
  const group = datasetGroupStructure.find(g=>g.key===key);
  currentSubKey.value = group?.sub[0]?.key || '';
}
function selectSub(key){
  currentSubKey.value = key;
}
function toggleDataset(title){
  const idx = selectedDatasets.value.indexOf(title);
  if(idx === -1){
    selectedDatasets.value.push(title);
  }else{
    selectedDatasets.value.splice(idx,1);
  }
}
function removeAbility(ability){
  const arr = abilityDatasetMap[ability] || [];
  const titles = arr.map(d=>d.title);
  selectedDatasets.value = selectedDatasets.value.filter(d=>!titles.includes(d));
}
function nextStep(){
  if(step.value===2 && selectedDatasets.value.length===0){
    window.alert('请至少选择一个数据集！');
    return;
  }
  if(step.value<3) step.value++;
}
function prevStep(){
  if(step.value>1) step.value--;
}
function submit(){
  window.alert('已提交！');
}
function checkApi() {
  if (!apiUrl.value) {
    apiCheckResult.value = '请输入API';
    apiCheckColor.value = '#f5222d';
    return;
  }
  apiCheckResult.value = '';
  apiChecking.value = true;
  // 先瞬间归零且无动画
  progressNoAni.value = true;
  apiCheckProgress.value = 0;
  // 触发一次DOM更新后再恢复动画
  setTimeout(() => {
    progressNoAni.value = false;
    if (progressTimer) clearInterval(progressTimer);
    progressTimer = setInterval(() => {
      if (apiCheckProgress.value < 100) {
        apiCheckProgress.value += 2 + Math.random() * 4;
        if (apiCheckProgress.value > 100) apiCheckProgress.value = 100;
      } else {
        clearInterval(progressTimer);
        fetch(apiUrl.value, { method: 'GET' }).then(resp => {
          if (resp.ok) {
            apiCheckResult.value = 'API可用';
            apiCheckColor.value = '#52c41a';
          } else {
            apiCheckResult.value = 'API调用失败';
            apiCheckColor.value = '#f5222d';
          }
        }).catch(() => {
          apiCheckResult.value = 'API调用失败';
          apiCheckColor.value = '#f5222d';
        }).finally(() => {
          apiChecking.value = false;
        });
      }
    }, 18);
  }, 0);
}
function getAllTags(title) {
  // 返回该数据集所有能力标签
  const tags = [];
  for(const [ability, arr] of Object.entries(abilityDatasetMap)){
    if(arr.some(item=>item.title===title)) tags.push(ability);
  }
  // 还要加上原有tags（如推理能力等）
  const ds = Object.values(abilityDatasetMap).flat().find(item=>item.title===title);
  if(ds && ds.tags) {
    ds.tags.forEach(t=>{ if(!tags.includes(t)) tags.push(t); });
  }
  return tags;
}
// 进度条初始常驻归零，点击检查时加载，结束后归零
onMounted(() => {
  apiCheckProgress.value = 0;
});
onUnmounted(() => {
  if (progressTimer) clearInterval(progressTimer);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
body, .container {
  font-family: '微软雅黑', 'Inter', Arial, sans-serif;
  background: #f7fafd;
}
.container {
  max-width: 1200px;
  margin: 30px auto 0 auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 32px 40px 40px 40px;
}
.step-horizontal-bar-wrap {
  margin-bottom: 24px;
}
.step-horizontal-bar-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.step-horizontal-bar-title {
  font-size: 15px !important;
  font-weight: 600 !important;
}
.step-horizontal-bar-status {
  color: #b3d8ef !important;
  font-size: 16px;
  font-weight: 600;
}
.step-horizontal-bar {
  width: 100%;
  height: 10px;
  background: #e5eaf3;
  border-radius: 6px;
  position: relative;
  margin-bottom: 18px;
}
.step-horizontal-bar-progress {
  height: 100%;
  background: #b3d8ef !important;
  border-radius: 6px;
  transition: width 0.5s;
}
.step-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 32px;
  text-align: left;
}
.step-subtip {
  color: #888;
  font-size: 15px;
  margin-bottom: 36px;
  margin-top: 0;
  font-weight: 400;
}
.step-form {
  padding: 0 0 48px 0;
  margin-bottom: 48px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: stretch;
}
.form-label {
  font-weight: 530;
  margin-bottom: 12px;
}
.input {
  max-width: 600px;
  width: 100%;
  padding: 17px 14px;
  border-radius: 6px;
  border: 1px solid #b5d3f3;
  font-size: 16px;
  background: #fff;
}
.input.short {
  max-width: 260px;
}
.input.long {
  max-width: 500px;
}
.param-row {
  display: flex;
  gap: 24px;
  align-items: flex-end;
  flex-wrap: wrap;
}
.param-card {
  background: #f8fafc;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(24,144,255,0.06);
  padding: 28px 32px 18px 32px;
  margin: 0;
  max-width: 400px;
}
.param-title {
  font-weight: 600;
  font-size: 17px;
  margin-bottom: 18px;
}
.param-flex {
  display: flex;
  flex-direction: row;
  gap: 24px;
  align-items: flex-end;
}
.upload-area {
  border: 2px dashed #b5d3f3;
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  color: #888;
  background: #fff;
  cursor: pointer;
}
.btn-upload {
  margin-top: 14px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 24px;
  font-size: 16px;
  cursor: pointer;
}
.file-name {
  margin-top: 10px;
  color: #1890ff;
  font-size: 15px;
}
.btn-check-api, .modern-btn-check {
  background: #b3d8ef !important;
  color: #222 !important;
  border: none;
  border-radius: 22px !important;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(24,144,255,0.06);
  padding: 8px 28px;
  transition: background 0.2s;
}
.btn-check-api:hover, .modern-btn-check:hover {
  background: #b3d8ef !important;
  color: #222 !important;
}
.btn-check-api:disabled, .modern-btn-check:disabled {
  background: #b3d8ef !important;
  color: #222 !important;
  cursor: not-allowed;
}
.api-check-result {
  margin-left: 18px;
  font-size: 15px;
  vertical-align: middle;
}
.step-btns {
  text-align: center;
  margin-top: 32px;
}
.btn-row {
  display: flex;
  align-items: center;
  gap: 28px;
  margin-top: 16px;
  margin-bottom: 0;
}
.btn-check-api {
  margin: 0;
  display: inline-block;
}
.btn-next.btn-primary {
  background: #b3d8ef !important;
  color: #222 !important;
  border: none;
  border-radius: 6px;
  padding: 12px 56px;
  font-size: 18px;
  cursor: pointer;
  margin-left: 24px;
  box-shadow: 0 2px 8px rgba(24,144,255,0.06);
  font-weight: 600;
  transition: background 0.2s;
}
.btn-next.btn-primary:hover {
  background: #b3d8ef !important;
  color: #222 !important;
}
.btn-next.btn-primary:disabled {
  background: #b3d8ef !important;
  color: #222 !important;
  cursor: not-allowed;
}
.btn-prev {
  background: #e0e6ed;
  color: #18344b;
  border: none;
  border-radius: 6px;
  padding: 12px 44px;
  font-size: 17px;
  cursor: pointer;
  margin-right: 24px;
}
.selected-datasets-bar {
  margin-bottom: 18px;
  min-height: 32px;
}
.tag {
  background: linear-gradient(90deg,#e6f0ff 0%,#f7fafd 100%);
  color: #14407a;
  border-radius: 18px;
  font-size: 16px;
  padding: 6px 18px;
  margin: 0 12px 12px 0;
  box-shadow: 0 2px 8px rgba(24,144,255,0.06);
  display: inline-flex;
  align-items: center;
  transition: box-shadow 0.2s;
}
.tag-inner {
  display: inline-block;
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 10px;
  padding: 2px 10px;
  margin: 0 4px;
  font-size: 14px;
}
.tag-close {
  margin-left: 4px;
  cursor: pointer;
  color: #faad14;
  font-size: 18px;
  transition: color 0.2s;
}
.tag-close:hover {
  color: #f5222d;
}
.dataset-select-flex {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}
.group-title {
  font-weight: bold;
  margin-bottom: 10px;
  color: #18344b;
}
.group-list {
  margin-bottom: 18px;
}
.group-list .tag, .subgroup-list .tag {
  display: block;
  margin: 0 0 8px 0;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  background: none;
  color: #18344b;
  border-radius: 12px 0 0 12px;
  padding: 10px 28px 10px 22px;
  transition: background 0.2s, color 0.2s;
}
.group-list .tag.selected {
  background: linear-gradient(90deg, #eaf6fd 0%, #b3d8ef 100%);
  color: #3a5a7a;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(179,216,239,0.10);
}
.group-list .tag:hover:not(.selected) {
  background: #eaf6fd;
  color: #4fc3ff;
}
.subgroup-list .tag {
  border-radius: 10px 0 0 10px;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 22px 8px 20px;
}
.subgroup-list .tag.selected {
  background: linear-gradient(90deg, #b3d8ef 0%, #7bbcff 100%);
  color: #fff;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(179,216,239,0.12);
}
.subgroup-list .tag:hover:not(.selected) {
  background: linear-gradient(90deg, #e3f0ff 0%, #b3d8ef 100%);
  color: #4fc3ff;
}
.datasets-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
}
.dataset-card {
  background: #fafdff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(24,64,122,0.06);
  border: 1.5px solid #e6e6e6;
  width: 260px;
  height: 120px;
  padding: 0 18px;
  margin: 0 auto;
  transition: box-shadow 0.2s, transform 0.2s, background 0.2s, border 0.2s, color 0.2s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  text-align: center;
}
.dataset-card:hover {
  box-shadow: 0 8px 24px rgba(24,144,255,0.10);
  transform: translateY(-2px) scale(1.02);
  border: 2px solid #b3d8ef;
  background: #eaf6fd;
}
.dataset-card.selected {
  background: linear-gradient(180deg,rgba(179,216,239,0.18) 0%,#fff 70%,#fff 100%);
  border: 2px solid #b3d8ef;
  color: #14407a;
  box-shadow: 0 8px 24px rgba(24,144,255,0.12);
}
.dataset-card.selected .dataset-title,
.dataset-card.selected .dataset-desc {
  color: #14407a;
}
.dataset-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 6px;
  letter-spacing: 1px;
}
.dataset-desc {
  color: #888;
  font-size: 14px;
  min-height: 32px;
  line-height: 1.5;
  margin-bottom: 8px;
}
.dataset-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  margin-bottom: 0;
}
.dataset-tags .tag.blue {
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 10px;
  font-size: 13px;
  padding: 2px 10px;
  margin: 0;
}
.card-top-bar {
  display: none;
  height: 6px;
  border-radius: 16px 16px 0 0;
  background: linear-gradient(90deg,#a18fff 0%,#6fd0ff 100%);
  position: absolute;
  left: 0; right: 0; top: 0;
  transition: opacity 0.2s;
  opacity: 0.95;
  z-index: 2;
}
.dataset-card:hover .card-top-bar,
.dataset-card.selected .card-top-bar {
  display: block;
}
.review-cards {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 32px;
}
.review-card {
  background: #f8fafc;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(24,144,255,0.06);
  padding: 22px 32px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 32px;
}
.review-label {
  font-weight: 600;
  color: #14407a;
  min-width: 120px;
}
.review-value {
  font-size: 16px;
  color: #222;
  word-break: break-all;
}
.review-dataset-row {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}
.ability-tag {
  margin-right: 10px;
  font-size: 14px;
  font-weight: 600;
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 10px;
  padding: 2px 12px;
}
.review-dataset-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.review-dataset-item {
  background: #f0f5ff;
  color: #14407a;
  border-radius: 8px;
  padding: 2px 10px;
  font-size: 13px;
  margin-right: 0;
}
@media (max-width: 900px) {
  .test-step-panel-flex { flex-direction: column; }
  .step-horizontal-bar-wrap { margin-bottom: 16px; }
  .step-horizontal-bar-head { flex-direction: column; align-items: flex-start; gap: 6px; }
  .dataset-select-flex { flex-direction: column; gap: 24px; }
  .datasets-list { grid-template-columns: 1fr; gap: 18px; }
  .dataset-card { width: 100%; min-width: 0; }
}
.step-progress-label {
  font-size: 15px;
  color: #222;
  font-weight: 500;
}
.step-progress-percent {
  font-size: 15px;
  color: #222 !important;
  font-weight: 600;
}
.api-progress-wrap {
  margin-top: 60px;
  margin-bottom: 8px;
}
.api-progress-label {
  font-size: 15px;
  color: #222;
  margin-bottom: 4px;
}
.api-progress-bar {
  width: 100%;
  height: 8px;
  background: #e5eaf3;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 4px;
}
.api-progress-inner {
  height: 100%;
  background: #b3d8ef;
  border-radius: 6px;
  transition: width 0.2s;
}
.api-progress-inner.no-ani {
  transition: none;
}
.api-progress-percent {
  font-size: 14px;
  color: #888;
  text-align: right;
}
/* 仅第一个步骤的下一步按钮上移 */
.test-step-panel:first-of-type .step-btns {
  margin-top: -30px;
}
</style> 