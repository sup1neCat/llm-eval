<template>
  <el-table :data="tasks" border style="width: 100%;" table-layout="fixed">
    <el-table-column prop="taskId" label="任务ID" width="160" />
    <el-table-column prop="modelName" label="模型名称" width="200" />
    <el-table-column prop="abilityName" label="测评类型" width="160" />
    <el-table-column prop="submitTime" label="提交时间" width="200" />
    <el-table-column label="状态" align="center" :min-width="180">
      <template #default="scope">
        <StatusIndicator :status="scope.row.status" />
      </template>
    </el-table-column>
    <el-table-column label="操作" width="140">
      <template #default="scope">
        <slot name="action" :task="scope.row">
          <el-button type="primary" @click="$emit('action', scope.row)">操作</el-button>
        </slot>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    v-if="showPagination"
    :current-page="currentPage"
    :page-size="pageSize"
    :total="total"
    layout="prev, pager, next"
    @current-change="$emit('page-change', $event)"
    style="margin-top: 24px; text-align: right;"
  />
</template>

<script setup>
import StatusIndicator from './StatusIndicator.vue'
import { computed } from 'vue'
const props = defineProps({
  tasks: { type: Array, default: () => [] },
  currentPage: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 },
  total: { type: Number, default: 0 },
  showPagination: { type: Boolean, default: true }
})
</script> 