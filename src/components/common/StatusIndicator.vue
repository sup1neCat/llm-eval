<template>
  <el-tag :type="tagType" effect="plain" size="large">
    <el-icon v-if="icon" style="margin-right: 4px;"><component :is="icon" /></el-icon>
    {{ label }}
  </el-tag>
</template>

<script setup>
import { computed } from 'vue'
import { Loading, CircleCheck, WarningFilled, CloseBold, Finished, AlarmClock, Opportunity } from '@element-plus/icons-vue'

const props = defineProps({ 
  status: { type: String, required: true },
  abilityName: { type: String, default: '' }
})

// 标准及后门检测状态映射
const standardStatusMap = {
  pending: { label: '等待中', type: 'info', icon: AlarmClock },
  running: { label: '测评中', type: 'warning', icon: Loading },
  completed: { label: '测评完成', type: 'success', icon: Finished },
  'completed-danger': { label: '检测完成-发现后门', type: 'danger', icon: WarningFilled },
  'completed-safe': { label: '检测完成-未发现后门', type: 'success', icon: CircleCheck },
  failed: { label: '检测失败', type: 'danger', icon: CloseBold }
}

// 红队测试状态映射
const redTeamStatusMap = {
  pending: { label: '等待测试', type: 'info', icon: AlarmClock },
  running: { label: '测试中', type: 'warning', icon: Loading },
  completed: { label: '测试完成', type: 'success', icon: Finished },
  'completed-danger': { label: '测试完成-发现漏洞', type: 'danger', icon: WarningFilled },
  'completed-safe': { label: '测试完成-未发现漏洞', type: 'success', icon: CircleCheck },
  failed: { label: '测试失败', type: 'danger', icon: CloseBold }
}

const isRedTeam = computed(() => {
  const ability = props.abilityName || '';
  return ability.includes('红队') || ability.includes('越狱');
})

const statusInfo = computed(() => {
  // 根据是否为红队测试选择不同的状态映射
  const statusMap = isRedTeam.value ? redTeamStatusMap : standardStatusMap;
  return statusMap[props.status] || { label: '未知', type: 'info', icon: null };
})

const label = computed(() => statusInfo.value.label)
const tagType = computed(() => statusInfo.value.type)
const icon = computed(() => statusInfo.value.icon)
</script> 