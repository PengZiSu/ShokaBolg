<!--
 * @description 表格分页工具
 * @author sulinye
 * @date 2024/2/27 13:58
-->

<template>
  <div class="pagination-container">
    <el-pagination
      :background="background"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :layout="layout"
      :page-size="pageSizes"
      :pager-count="pagerCount"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  total: {
    required: true,
    type: Number,
    default: 0,
  },
  page: {
    type: Number,
    default: 1,
  },
  limit: {
    type: Number,
    default: 10,
  },
  pageSizes: {
    type: Array,
    default() {
      return [10, 20];
    },
  },
  // 移动端页码按钮的数量端默认值5
  pagerCount: {
    type: Number,
    default: document.body.clientWidth < 992 ? 5 : 7,
  },
  layout: {
    type: String,
    default: "total,sizes,prev,pager,next,jumper",
  },
  background: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:page", "update:limit", "pagination"]);

const currentPage = computed({
  get: () => props.page,
  set: (value) => {
    emit("update:page", value);
  },
});

const pageSize = computed({
  get: () => props.limit,
  set: (value) => {
    emit("update:limit", value);
  },
});

const handleSizeChange = (value) => {
  emit("pagination", { page: currentPage, limit: value });
};

const handleCurrentChange = (value) => {
  currentPage.value = value;
  emit("pagination", { page: value, limit: props.limit });
};
</script>
<style lang="scss" scoped></style>
