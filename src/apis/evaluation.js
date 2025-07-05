import axios from 'axios'

// 获取检测报告数据
export const fetchEvaluationReport = async (taskId) => {
  const { data } = await axios.get(`http://127.0.0.1:4523/m1/6574561-6279588-default/api/v1/evaluations/1/report/data`)
  return data
}

// 获取评估任务历史记录（分页/筛选参数可根据实际调整）
export const fetchEvaluationHistory = async (params = {}) => {
  const { data } = await axios.get('https://m1.apifoxmock.com/m1/6574561-6279588-default/api/v1/me/evaluations', { params })
  return data
}

// 查询特定任务状态
export const fetchEvaluationTaskStatus = async (taskId) => {
  const { data } = await axios.get(`/api/v1/evaluations/${taskId}/status`)
  return data
}

// 获取模型列表
export const getModelList = async () => {
  const { data } = await axios.get('/api/v1/models')
  return data.models || data
}

// 获取能力列表
export const getAbilityList = async () => {
  const { data } = await axios.get('/api/v1/abilities')
  return data.abilities || data
}

// 获取数据集列表
export const getDatasetList = async () => {
  const { data } = await axios.get('/api/v1/datasets')
  return data.datasets || data
}

// 按能力获取数据集
export const getDatasetListByAbility = async (abilityId) => {
  const { data } = await axios.get(`/api/v1/datasets/by-ability/${abilityId}`)
  return data.datasets || data
}

// 创建评估任务
export const createEvaluation = async (payload) => {
  const { data, status } = await axios.post('/api/v1/evaluations', payload)
  return { data, status }
}

// 下载报告PDF
export const downloadReportPDF = (taskId) => {
  window.location.href = `/api/v1/evaluations/${taskId}/report/pdf/download`
}

// 下载原始日志
export const downloadLogFile = (taskId) => {
  window.location.href = `/api/v1/evaluations/${taskId}/log/download`
}
// 获取FlamesTask报告数据
export const fetchFlamesReport = async (taskId) => {
  // 这里假设接口为 /api/v1/flames/report/:id，实际可根据后端API调整
  // const { data } = await axios.get(`/api/v1/flames/report/${taskId}`)
  const { data } = await axios.get(`http://127.0.0.1:4523/m2/6574561-6279588-default/317867156`)
  
  return data
}