import axios from 'axios'

// 获取检测报告（web展示用）
export const fetchEvaluationReport = async (taskId) => {
  const { data } = await axios.get(`/api/v1/evaluations/${taskId}/report/web`)
  return data
}

// 获取评估任务历史记录（分页/筛选参数可根据实际调整）
export const fetchEvaluationHistory = async (params = {}) => {
  const { data } = await axios.get('/api/v1/evaluations/history', { params })
  return data
}

// 查询特定任务状态
export const fetchEvaluationTaskStatus = async (taskId) => {
  const { data } = await axios.get(`/api/v1/evaluations/${taskId}/status`)
  return data
}