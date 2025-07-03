import axios from 'axios'

// 本地静态指标定义映射表
export const METRIC_LABELS = {
  is_backdoor_detected: '是否检测到后门',
  confidence_score: '置信度',
  detected_trigger_words: '检测到的触发词',
  attack_success_rate: '攻击成功率',
  clean_accuracy: '模型正常表现',
  raw_output_log_path: '原始日志路径',
  // ...如有新指标可补充
}

// 启动后门检测任务
export const startBackdoorDetection = async ({ task_id, model_identifier, dataset_path, callback_url }) => {
  const { data, status } = await axios.post('/api/v1/detect/backdoor', {
    task_id,
    model_identifier,
    dataset_path,
    callback_url
  })
  return { data, status }
} 