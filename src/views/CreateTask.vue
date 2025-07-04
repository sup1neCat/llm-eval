<template>
  <el-dialog v-model="dialogVisible" title="创建新任务" width="700px" :close-on-click-modal="false" @close="handleClose">
    <el-steps :active="step" finish-status="success" align-center style="margin-bottom: 32px;">
      <el-step title="模型API配置" />
      <el-step title="参数选择" />
      <el-step title="启动测试" />
    </el-steps>
    <div v-if="step === 1">
      <div style="margin-bottom: 32px;">
        <div style="font-weight:600;margin-bottom:12px;font-size:16px;text-align:left;">1、任务名称</div>
        <div style="display:flex;align-items:center;max-width:600px;width:100%;margin:0 auto 18px auto;">
          <el-input v-model="taskName" placeholder="请输入任务名称" style="flex:1;" />
        </div>
      </div>
      <div style="margin-bottom: 32px;">
        <div style="font-weight:600;margin-bottom:12px;font-size:16px;text-align:left;">2、模型API</div>
        <div style="display:flex;align-items:center;gap:10px;max-width:600px;width:100%;margin:0 auto;">
          <el-input v-model="apiUrl" placeholder="请输入模型API" style="flex:1;" />
          <el-button type="primary" @click="checkApi" style="background:#4fc3ff;border-radius:8px;height:40px;">校验</el-button>
        </div>
        <div style="margin-top:10px;min-height:22px;text-align:center;">
          <span :style="{color: apiCheckColor, fontSize:'15px'}">{{ apiCheckResult }}</span>
        </div>
      </div>
      <div style="margin-bottom: 32px;">
        <div style="font-weight:600;margin-bottom:12px;font-size:16px;text-align:left;">3、评估任务</div>
        <div style="display:flex;gap:18px;justify-content:center;">
          <el-button :type="selectedType==='qa-open'?'primary':'default'" @click="selectedType='qa-open'" style="min-width:110px;font-size:15px;border-radius:14px;height:38px;">开放问答</el-button>
          <el-button :type="selectedType==='qa-close'?'primary':'default'" @click="selectedType='qa-close'" style="min-width:110px;font-size:15px;border-radius:14px;height:38px;">非开放问答</el-button>
          <el-button :type="selectedType==='backdoor'?'primary':'default'" @click="selectedType='backdoor'" style="min-width:110px;font-size:15px;border-radius:14px;height:38px;">后门攻击</el-button>
          <el-button :type="selectedType==='jailbreak'?'primary':'default'" @click="selectedType='jailbreak'" style="min-width:110px;font-size:15px;border-radius:14px;height:38px;">越狱攻击</el-button>
        </div>
      </div>
    </div>
    <div v-else-if="step === 2 && (selectedType === 'qa-open' || selectedType === 'qa-close')">
      <div class="selected-tags-bar" v-if="selectedDatasets.length">
        <span v-for="tag in selectedTags" :key="tag.key" class="selected-tag">
          <span class="tag-type">{{ tag.abilityType }}：</span>
          <span class="tag-ds">{{ tag.name }}</span>
          <span class="tag-remove" @click="removeSelected(tag.key)">×</span>
        </span>
      </div>
      <div class="dataset-flex-wrap">
        <div class="dataset-nav">
          <div class="nav-title">分类筛选</div>
          <div class="nav-section-title">能力评估</div>
          <div v-for="cat in abilityTypes.slice(0,5)" :key="cat.key" :class="['nav-sub', cat.key === selectedAbilityType ? 'active' : '']" @click="selectAbilityType(cat.key)">
            {{ cat.name }}
          </div>
          <div class="nav-section-title">对齐评估</div>
          <div v-for="cat in abilityTypes.slice(5)" :key="cat.key" :class="['nav-sub', cat.key === selectedAbilityType ? 'active' : '']" @click="selectAbilityType(cat.key)">
            {{ cat.name }}
          </div>
        </div>
        <div class="dataset-card-list">
          <div v-for="ds in filteredDatasets" :key="ds.key" :class="['dataset-card', selectedDatasets.includes(ds.key) ? 'selected' : '']" @click="toggleDataset(ds.key)">
            <div class="card-title">{{ ds.name }}</div>
            <div class="card-desc">{{ ds.desc }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="step === 3">
      <div style="text-align:center;padding:48px 0;color:#888;">启动测试（占位内容）</div>
    </div>
    <template #footer>
      <el-button v-if="step > 1" @click="step--">上一步</el-button>
      <el-button v-if="step < 3" type="primary" @click="nextStep">下一步</el-button>
      <el-button v-if="step === 3" type="success" @click="submitTask">提交</el-button>
    </template>
    <el-dialog v-model="successDialog" title="提示" width="320px" :show-close="false" append-to-body>
      <div style="text-align:center;font-size:18px;padding:32px 0;">提交成功</div>
      <template #footer>
        <el-button type="primary" @click="closeSuccessDialog">确定</el-button>
      </template>
    </el-dialog>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const dialogVisible = ref(true)
const step = ref(1)
const taskName = ref('')
const apiUrl = ref('')
const apiCheckResult = ref('')
const apiCheckColor = ref('#f5222d')
const selectedType = ref('qa-open')
const selectedDatasets = ref([])
const successDialog = ref(false)
const router = useRouter()

// 能力类型定义
const abilityTypes = [
  { key: 'reasoning', name: '推理能力' },
  { key: 'coding', name: '代码能力' },
  { key: 'understanding', name: '理解能力' },
  { key: 'dialogue', name: '对话能力' },
  { key: 'translation', name: '翻译能力' },
  { key: 'morality', name: '道德性' },
  { key: 'fairness', name: '公平性' },
  { key: 'toxicity', name: '毒性' },
  { key: 'hallucination', name: '幻觉' }
]
// 绿色数据集（开放问答）
const greenDatasets = [
  { key: 'AQUA-RAT', name: 'AQUA-RAT', abilityType: '推理能力', desc: 'AQUA-RAT：数学推理与常识问题数据集', type: 'reasoning' },
  { key: 'HumanEval', name: 'HumanEval', abilityType: '代码能力', desc: 'HumanEval：代码生成与理解评测', type: 'coding' },
  { key: 'SQuAD', name: 'SQuAD', abilityType: '理解能力', desc: 'SQuAD：阅读理解与问答数据集', type: 'understanding' },
  { key: 'MT Bench', name: 'MT Bench', abilityType: '对话能力', desc: 'MT Bench：多轮对话能力评测', type: 'dialogue' },
  { key: 'STSB', name: 'STSB', abilityType: '翻译能力', desc: 'STSB：语义文本相似度与翻译', type: 'translation' },
  { key: 'Flames-morality', name: 'Flames', abilityType: '道德性', desc: 'Flames：道德与价值观评测', type: 'morality' },
  { key: 'Flames-fairness', name: 'Flames', abilityType: '公平性', desc: 'Flames：公平与偏见评测', type: 'fairness' },
  { key: 'Flames-toxicity', name: 'Flames', abilityType: '毒性', desc: 'Flames：有害内容检测', type: 'toxicity' },
  { key: 'TruthfulQA', name: 'TruthfulQA', abilityType: '幻觉', desc: 'TruthfulQA：事实性与幻觉评测', type: 'hallucination' }
]
// 黄色数据集（非开放问答）
const yellowDatasets = [
  { key: 'ARC', name: 'ARC', abilityType: '推理能力', desc: 'ARC：抽象推理挑战数据集', type: 'reasoning' },
  { key: 'Hellaswag', name: 'Hellaswag', abilityType: '推理能力', desc: 'Hellaswag：常识推理数据集', type: 'reasoning' },
  { key: 'MiroGrande', name: 'MiroGrande', abilityType: '推理能力', desc: 'MiroGrande：常识推理数据集', type: 'reasoning' },
  { key: 'DROP', name: 'DROP', abilityType: '推理能力', desc: 'DROP：阅读理解与推理数据集', type: 'reasoning' },
  { key: 'GSM8K', name: 'GSM8K', abilityType: '推理能力', desc: 'GSM8K：数学推理数据集', type: 'reasoning' },
  { key: 'HumanEval', name: 'HumanEval', abilityType: '代码能力', desc: 'HumanEval：代码生成与理解评测', type: 'coding' },
  { key: 'CodeXGLUE', name: 'CodeXGLUE', abilityType: '代码能力', desc: 'CodeXGLUE：多语言代码任务数据集', type: 'coding' },
  { key: 'CLUEbenchmark', name: 'CLUEbenchmark', abilityType: '理解能力', desc: 'CLUEbenchmark：中文理解评测', type: 'understanding' },
  { key: 'CValues-morality', name: 'CValues', abilityType: '道德性', desc: 'CValues：道德性评测', type: 'morality' },
  { key: 'CValues-fairness', name: 'CValues', abilityType: '公平性', desc: 'CValues：公平性评测', type: 'fairness' },
  { key: 'CValues-toxicity', name: 'CValues', abilityType: '毒性', desc: 'CValues：毒性内容检测', type: 'toxicity' },
  { key: 'MMLU', name: 'MMLU', abilityType: '幻觉', desc: 'MMLU：多学科知识与幻觉检测', type: 'hallucination' }
]
const selectedAbilityType = ref('reasoning')

const datasetSource = computed(() => selectedType.value === 'qa-open' ? greenDatasets : yellowDatasets)
const filteredDatasets = computed(() => datasetSource.value.filter(ds => ds.type === selectedAbilityType.value))
const selectedTags = computed(() => {
  return selectedDatasets.value.map(key => {
    const ds = datasetSource.value.find(d => d.key === key)
    return ds ? { key, name: ds.name, abilityType: ds.abilityType } : { key, name: key, abilityType: '' }
  })
})

function selectAbilityType(key) {
  selectedAbilityType.value = key
}
function toggleDataset(key) {
  const idx = selectedDatasets.value.indexOf(key)
  if (idx === -1) {
    selectedDatasets.value.push(key)
  } else {
    selectedDatasets.value.splice(idx, 1)
  }
}
function removeSelected(key) {
  const idx = selectedDatasets.value.indexOf(key)
  if (idx !== -1) {
    selectedDatasets.value.splice(idx, 1)
  }
}

function handleClose() {
  dialogVisible.value = false
  setTimeout(() => {
    router.back()
  }, 300)
}

async function checkApi() {
  if (!apiUrl.value) {
    apiCheckResult.value = '请输入API';
    apiCheckColor.value = '#f5222d';
    return;
  }
  apiCheckResult.value = '正在检查...';
  apiCheckColor.value = '#888';
  try {
    const resp = await fetch(apiUrl.value, { method: 'GET' });
    if (resp.ok) {
      apiCheckResult.value = 'API可用';
      apiCheckColor.value = '#52c41a';
    } else {
      apiCheckResult.value = 'API调用失败';
      apiCheckColor.value = '#f5222d';
    }
  } catch (e) {
    apiCheckResult.value = 'API调用失败';
    apiCheckColor.value = '#f5222d';
  }
}

function nextStep() {
  if (step.value === 1 && !apiUrl.value) {
    apiCheckResult.value = '请输入API';
    apiCheckColor.value = '#f5222d';
    return;
  }
  step.value++
}

function submitTask() {
  successDialog.value = true
}

function closeSuccessDialog() {
  successDialog.value = false
  handleClose()
}
</script>

<style scoped>
.selected-tags-bar {
  margin-bottom: 14px;
  padding-left: 8px;
}
.selected-tag {
  display: inline-flex;
  align-items: center;
  background: #f7fafd;
  border-radius: 14px;
  font-size: 13px;
  color: #14407a;
  margin-right: 8px;
  padding: 3px 10px 3px 7px;
  box-shadow: 0 1px 3px rgba(24,144,255,0.04);
  margin-bottom: 4px;
}
.selected-tag .tag-type {
  color: #888;
  margin-right: 2px;
}
.selected-tag .tag-ds {
  font-weight: bold;
  margin-right: 3px;
}
.selected-tag .tag-remove {
  color: #f5222d;
  font-size: 15px;
  cursor: pointer;
  margin-left: 2px;
  transition: color 0.2s;
}
.selected-tag .tag-remove:hover {
  color: #d4380d;
}
.dataset-flex-wrap {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 24px;
  min-height: 220px;
}
.dataset-nav {
  width: 150px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 6px rgba(24,64,122,0.04);
  padding: 12px 0 6px 0;
  margin-bottom: 12px;
}
.nav-title {
  font-size: 14px;
  font-weight: bold;
  color: #18344b;
  margin-bottom: 8px;
  padding-left: 16px;
}
.nav-section-title {
  font-size: 13px;
  font-weight: bold;
  color: #888;
  margin: 10px 0 4px 16px;
}
.nav-sub {
  border-radius: 8px 0 0 8px;
  margin: 0 0 5px 0;
  padding: 7px 16px 7px 14px;
  font-size: 14px;
  font-weight: 500;
  background: none;
  color: #18344b;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.nav-sub.active {
  background: linear-gradient(90deg, #e3f0ff 0%, #cbeaff 100%);
  color: #4fc3ff;
  font-weight: 600;
}
.dataset-card-list {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  /* justify-items: center; */
}
.dataset-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 6px rgba(24,64,122,0.04);
  border: 1px solid #e6e6e6;
  padding: 14px 14px 10px 14px;
  transition: box-shadow 0.18s, transform 0.18s, background 0.18s, border 0.18s, color 0.18s;
  cursor: pointer;
  min-height: 60px;
  max-width: 220px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* align-items: center; */
  align-items: flex-start;
  position: relative;
}
.dataset-card.selected {
  background: linear-gradient(180deg,rgba(111,208,255,0.13) 0%,#fff 70%,#fff 100%);
  border: 1.5px solid #a18fff;
  color: #14407a;
}
.card-title {
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}
.card-desc {
  color: #555;
  font-size: 12px;
  min-height: 18px;
  line-height: 1.5;
}
</style>
  