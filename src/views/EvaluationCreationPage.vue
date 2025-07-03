<template>
  <div style="background: #f8fafc; min-height: 100vh; padding: 40px 0;">
    <div style="max-width: 600px; margin: 0 auto;">
      <el-card shadow="always" style="padding: 40px 32px; border-radius: 18px; background: #fff;">
        <h2 style="font-size: 2rem; font-weight: bold; color: #1e293b; margin-bottom: 32px;">新建能力测评任务</h2>
        <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" size="large">
          <el-form-item label="模型" prop="model">
            <el-select v-model="form.model" filterable placeholder="请选择模型" style="width: 100%;">
              <el-option v-for="m in models" :key="m.id" :label="m.name" :value="m.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="能力" prop="ability">
            <el-select v-model="form.ability" filterable placeholder="请选择能力" style="width: 100%;" @change="onAbilityChange">
              <el-option v-for="a in abilities" :key="a.id" :label="a.name" :value="a.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="数据集" prop="dataset">
            <el-select v-model="form.dataset" filterable placeholder="请选择数据集" style="width: 100%;">
              <el-option v-for="d in filteredDatasets" :key="d.id" :label="d.name" :value="d.id" />
            </el-select>
            <el-button type="primary" link style="margin-left: 12px;" @click="onUploadDataset">上传自定义数据集</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="submitting" @click="onSubmit">开始检测</el-button>
            <el-button @click="goBack" style="margin-left: 16px;">返回</el-button>
          </el-form-item>
        </el-form>
        <el-alert v-if="showBackdoorTip" type="info" show-icon style="margin-top: 24px;">
          请选择包含潜在触发器的专用数据集进行后门检测。
        </el-alert>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElNotification } from 'element-plus'
import axios from 'axios'

const router = useRouter()
const formRef = ref()
const form = reactive({ model: '', ability: '', dataset: '' })
const rules = {
  model: [{ required: true, message: '请选择模型', trigger: 'change' }],
  ability: [{ required: true, message: '请选择能力', trigger: 'change' }],
  dataset: [{ required: true, message: '请选择数据集', trigger: 'change' }]
}
const models = ref([])
const abilities = ref([])
const datasets = ref([])
const filteredDatasets = computed(() => {
  if (form.ability && backdoorAbilityId.value) {
    if (form.ability === backdoorAbilityId.value) {
      return datasets.value.filter(d => d.is_backdoor)
    }
  }
  return datasets.value
})
const backdoorAbilityId = ref('')
const showBackdoorTip = computed(() => form.ability === backdoorAbilityId.value)
const submitting = ref(false)

const fetchModels = async () => {
  const { data } = await axios.get('/api/v1/models')
  models.value = data.models || data
}
const fetchAbilities = async () => {
  const { data } = await axios.get('/api/v1/abilities')
  abilities.value = data.abilities || data
  // 假设后门检测能力的 name 或 code 可识别
  const found = abilities.value.find(a => a.name.includes('后门') || a.code === 'backdoor')
  if (found) backdoorAbilityId.value = found.id
}
const fetchDatasets = async () => {
  const { data } = await axios.get('/api/v1/datasets')
  datasets.value = data.datasets || data
}
onMounted(() => {
  fetchModels()
  fetchAbilities()
  fetchDatasets()
})
const onAbilityChange = () => {
  form.dataset = ''
}
const onUploadDataset = () => {
  ElMessage.info('自定义数据集上传功能开发中...')
}
const onSubmit = () => {
  formRef.value.validate(async valid => {
    if (!valid) return
    submitting.value = true
    try {
      const payload = {
        model_id: form.model,
        ability_id: form.ability,
        dataset_id: form.dataset
      }
      const { status } = await axios.post('/api/v1/evaluations', payload)
      if (status === 202 || status === 200) {
        ElNotification.success({ message: '后门检测任务已提交！您可在历史记录中查看进度。' })
        router.push('/history')
      } else {
        ElNotification.error({ message: '任务提交失败，请重试。' })
      }
    } catch (e) {
      ElNotification.error({ message: e?.response?.data?.message || '任务提交失败' })
    } finally {
      submitting.value = false
    }
  })
}
const goBack = () => router.push('/history')
</script> 