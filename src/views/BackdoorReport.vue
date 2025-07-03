<template>
  <div style="background: #f8fafc; min-height: 100vh;">
    <div style="max-width: 1200px; margin: 0 auto; padding: 40px 0;">
      <el-card shadow="always" style="border-radius: 24px; box-shadow: 0 4px 24px 0 rgba(30,41,59,0.08); padding: 40px; background: #fff;">
        <template v-if="loading">
          <div style="text-align: center; padding: 80px 0; color: #64748b; font-size: 1.2rem;">
            <el-icon style="font-size: 2.5rem; margin-bottom: 12px;"><Loading /></el-icon>
            正在加载检测报告...
            <div style="margin-top: 24px;">
              <el-button type="default" @click="$router.push('/history')">返回历史记录</el-button>
            </div>
          </div>
        </template>
        <template v-else-if="error">
          <div style="text-align: center; padding: 80px 0; color: #dc2626; font-size: 1.2rem;">
            <el-icon style="font-size: 2.5rem; margin-bottom: 12px;"><WarningFilled /></el-icon>
            {{ error }}
            <div style="margin-top: 24px;">
              <el-button type="default" @click="$router.push('/history')">返回历史记录</el-button>
            </div>
          </div>
        </template>
        <template v-else>
          <!-- 返回历史记录按钮 -->
          <div style="margin-bottom: 24px;">
            <el-button type="default" @click="$router.push('/history')">返回历史记录</el-button>
          </div>
          <!-- 顶部信息区 -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
            <div>
              <h1 style="font-size: 2.2rem; font-weight: bold; color: #1e293b; margin-bottom: 12px;">{{ report.modelName }} 的后门检测报告</h1>
              <div style="display: flex; gap: 24px; align-items: center; font-size: 1.05rem; color: #64748b;">
                <span>任务ID: <span style="color: #334155; font-weight: 500;">{{ report.taskId }}</span></span>
                <span>检测时间: {{ report.detectionTime }}</span>
                <el-link type="primary" :underline="true" style="font-size: 1.05rem;">{{ report.datasetName }}</el-link>
              </div>
            </div>
            <el-button type="primary" @click="exportReport" style="font-weight: 500; font-size: 1rem; border-radius: 8px; padding: 10px 24px;">
              <el-icon style="vertical-align: middle; margin-right: 4px;"><Download /></el-icon>
              导出报告
            </el-button>
          </div>
          <!-- 检测结论区 -->
          <el-card v-if="report.hasBackdoor" style="background: #fef2f2; border-radius: 16px; box-shadow: none; margin-bottom: 32px; border: 1px solid #f56c6c;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center;">
                <el-icon style="font-size: 2.4rem; color: #f56c6c; margin-right: 12px;"><WarningFilled /></el-icon>
                <span style="font-size: 1.5rem; font-weight: bold; color: #dc2626;">检测到后门 (High Confidence)</span>
              </div>
              <div style="display: flex; gap: 48px; align-items: flex-end;">
                <div>
                  <div style="font-weight: 500; color: #1e293b;">置信度 (Confidence Score):</div>
                  <el-progress :percentage="report.confidenceScore" :stroke-width="10" color="#f56c6c" style="margin: 8px 0; width: 160px;" :show-text="false" />
                  <div style="color: #dc2626; font-size: 1.2rem; font-weight: bold;">{{ report.confidenceScore }}%</div>
                </div>
                <div>
                  <div style="font-weight: 500; color: #1e293b;">攻击成功率 (Attack Success Rate):</div>
                  <div style="color: #dc2626; font-size: 1.2rem; font-weight: bold;">{{ report.attackSuccessRate }}%</div>
                </div>
                <div>
                  <div style="font-weight: 500; color: #1e293b;">模型正常表现 (Clean Accuracy):</div>
                  <div style="color: #16a34a; font-size: 1.2rem; font-weight: bold;">{{ report.cleanAccuracy }}%</div>
                </div>
              </div>
            </div>
          </el-card>
          <el-card v-else style="background: #f0fdf4; border-radius: 16px; box-shadow: none; margin-bottom: 32px; border: 1px solid #22c55e;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center;">
                <el-icon style="font-size: 2.4rem; color: #22c55e; margin-right: 12px;"><CircleCheck /></el-icon>
                <span style="font-size: 1.5rem; font-weight: bold; color: #16a34a;">未检测到后门 (High Confidence)</span>
              </div>
              <div style="display: flex; gap: 48px; align-items: flex-end;">
                <div>
                  <div style="font-weight: 500; color: #1e293b;">置信度 (Confidence Score):</div>
                  <el-progress :percentage="report.confidenceScore" :stroke-width="10" color="#22c55e" style="margin: 8px 0; width: 160px;" :show-text="false" />
                  <div style="color: #16a34a; font-size: 1.2rem; font-weight: bold;">{{ report.confidenceScore }}%</div>
                </div>
                <div>
                  <div style="font-weight: 500; color: #1e293b;">攻击成功率 (Attack Success Rate):</div>
                  <div style="color: #16a34a; font-size: 1.2rem; font-weight: bold;">{{ report.attackSuccessRate }}%</div>
                </div>
                <div>
                  <div style="font-weight: 500; color: #1e293b;">模型正常表现 (Clean Accuracy):</div>
                  <div style="color: #16a34a; font-size: 1.2rem; font-weight: bold;">{{ report.cleanAccuracy }}%</div>
                </div>
              </div>
            </div>
          </el-card>
          <!-- 详细分析标签页 -->
          <el-tabs v-model="currentTab" style="margin-bottom: 0; margin-top: 24px;">
            <el-tab-pane label="触发器分析" name="trigger-analysis">
              <h4 style="font-size: 1.1rem; font-weight: 500; color: #1e293b; margin-bottom: 16px;">详细分析</h4>
              <template v-if="!report.hasBackdoor">
                <el-card style="background: #f0fdf4; border: 1px solid #22c55e; border-radius: 12px; display: flex; align-items: center; padding: 32px 24px;">
                  <el-icon style="font-size: 2.2rem; color: #22c55e; margin-right: 16px;"><CircleCheck /></el-icon>
                  <div>
                    <div style="font-size: 1.15rem; font-weight: 600; color: #16a34a; margin-bottom: 6px;">本次检测未发现任何明确的后门触发词或可疑模式。模型在各项指标上均表现稳健。</div>
                    <div style="font-size: 0.98rem; color: #64748b;">这表明模型在当前配置和数据集下是安全的。建议定期复检以确保模型持续的安全性。</div>
                  </div>
                </el-card>
              </template>
              <template v-else>
                <el-table :data="report.triggers" border style="width: 100%; border-radius: 12px; overflow: hidden;">
                  <el-table-column label="排名" width="80">
                    <template #default="scope">{{ scope.$index + 1 }}</template>
                  </el-table-column>
                  <el-table-column prop="word" label="触发词/短语" width="180" />
                  <el-table-column prop="score" label="触发效果评分" width="120" />
                  <el-table-column prop="exampleInput" label="示例输入" />
                  <el-table-column prop="output" label="触发后的模型输出">
                    <template #default="scope">
                      <span style="color: #dc2626; font-family: monospace;">{{ scope.row.output }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-tab-pane>
            <el-tab-pane label="性能对比" name="performance-comparison">
              <h4 style="font-size: 1.1rem; font-weight: 500; color: #1e293b; margin-bottom: 16px;">模型在干净数据与触发数据上的表现对比</h4>
              <el-row :gutter="24">
                <el-col :xs="24" :sm="12">
                  <el-card style="background: #f5f7fa; border-radius: 12px;">
                    <h5 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 8px;">干净样本表现</h5>
                    <p style="font-size: 13px; color: #64748b;">
                      准确率/困惑度: <span style="font-weight: 500; color: #16a34a;">{{ report.cleanAccuracy }}% / {{ report.cleanPerplexity }}</span>
                    </p>
                    <p style="font-size: 13px; color: #64748b; margin-top: 8px;">输出示例:</p>
                    <ul style="font-size: 12px; color: #64748b; margin-top: 4px; padding-left: 16px;">
                      <li v-for="(example, index) in report.cleanExamples" :key="index">
                        输入: "{{ example.input }}" 输出: "{{ example.output }}"
                      </li>
                    </ul>
                  </el-card>
                </el-col>
                <el-col :xs="24" :sm="12">
                  <el-card style="background: #fef2f2; border: 1px solid #f56c6c; border-radius: 12px;">
                    <h5 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-bottom: 8px;">触发样本表现</h5>
                    <p style="font-size: 13px; color: #64748b;">
                      攻击成功率: <span style="font-weight: 500; color: #dc2626;">{{ report.attackSuccessRate }}%</span>
                    </p>
                    <p style="font-size: 13px; color: #64748b; margin-top: 8px;">输出示例:</p>
                    <ul style="font-size: 12px; color: #dc2626; margin-top: 4px; padding-left: 16px;">
                      <li v-for="(example, index) in report.triggeredExamples" :key="index">
                        输入: "{{ example.input }}" 输出: "{{ example.output }}"
                      </li>
                    </ul>
                  </el-card>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="原始日志" name="raw-logs">
              <h4 style="font-size: 1.1rem; font-weight: 500; color: #1e293b; margin-bottom: 16px;">原始检测日志</h4>
              <el-button @click="downloadLogs" style="margin-bottom: 12px;">
                <el-icon style="vertical-align: middle; margin-right: 4px;"><Download /></el-icon>
                下载完整日志
              </el-button>
              <el-card style="background: #0f172a; color: #e2e8f0; font-family: 'SFMono-Regular',Consolas,'Liberation Mono',Menlo,Courier,monospace; font-size: 0.95rem; border-radius: 16px; max-height: 400px; overflow-y: auto; padding: 24px;">
                <pre style="margin: 0; white-space: pre-wrap;">
                  {{ report.logs && report.logs.trim() ? report.logs : '暂无日志数据' }}
                </pre>
              </el-card>
            </el-tab-pane>
            <el-tab-pane label="全部检测指标" name="all-metrics">
              <h4 style="font-size: 1.1rem; font-weight: 500; color: #1e293b; margin-bottom: 16px;">全部检测指标</h4>
              <el-table :data="Object.entries(metricResults)" border style="width: 100%; border-radius: 12px; overflow: hidden;">
                <el-table-column label="指标" width="220">
                  <template #default="scope">{{ METRIC_LABELS[scope.row[0]] || scope.row[0] }}</template>
                </el-table-column>
                <el-table-column label="值">
                  <template #default="scope">
                    <span v-if="Array.isArray(scope.row[1])">{{ scope.row[1].join(', ') }}</span>
                    <span v-else>{{ scope.row[1] }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Download, WarningFilled, CircleCheck, Loading } from '@element-plus/icons-vue'
import { METRIC_LABELS, fetchBackdoorReport, startBackdoorDetection } from '../apis/backdoor'

const route = useRoute()
const currentTab = ref('trigger-analysis')

const loading = ref(true)
const error = ref(null)
const report = ref(null)
const metrics = ref([]) // 不再请求后端定义，仅用于遍历
const metricResults = ref({}) // 动态指标结果

const fetchReport = async () => {
  loading.value = true
  error.value = null
  try {
    // metrics.value = await fetchMetricDefinitions() // 移除
    const data = await fetchBackdoorReport(route.params.id)
    if (data.status !== 'completed' || !data.results) {
      if (data.status === 'failed') {
        throw new Error('检测失败，请联系管理员')
      } else {
        throw new Error('检测任务尚未完成，请稍后刷新')
      }
    }
    // 直接遍历results对象
    metricResults.value = data.results || {}
    report.value = {
      taskId: data.task_id,
      modelName: data.results.model_name || '',
      detectionTime: data.results.detection_time || '',
      datasetName: data.results.dataset_name || '',
      hasBackdoor: !!data.results.is_backdoor_detected,
      confidenceScore: Math.round((data.results.confidence_score ?? 0) * 100),
      attackSuccessRate: Math.round((data.results.attack_success_rate ?? 0) * 100),
      cleanAccuracy: Math.round((data.results.clean_accuracy ?? 0) * 100),
      cleanPerplexity: data.results.clean_perplexity ?? '',
      triggers: Array.isArray(data.results.detected_trigger_words)
        ? data.results.detected_trigger_words.map((word, i) => ({
            word,
            score: data.results.trigger_scores ? data.results.trigger_scores[i] : '',
            exampleInput: data.results.trigger_examples ? data.results.trigger_examples[i]?.input : '',
            output: data.results.trigger_examples ? data.results.trigger_examples[i]?.output : ''
          }))
        : [],
      cleanExamples: Array.isArray(data.results.clean_examples) ? data.results.clean_examples : [],
      triggeredExamples: Array.isArray(data.results.triggered_examples) ? data.results.triggered_examples : [],
      logs: data.results.raw_output_log ?? '',
      rawOutputPath: data.results.raw_output_log_path || '',
      reportPath: data.results.report_path || ''
    }
  } catch (e) {
    error.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(fetchReport)

const exportReport = () => {
  // TODO: 实现导出报告逻辑
}
const downloadLogs = () => {
  // TODO: 实现下载日志逻辑
}
</script>

<style scoped>
.tab-active {
  border-bottom-width: 2px;
  border-color: var(--primary-color);
  color: var(--primary-color);
  font-weight: 600;
}
</style> 