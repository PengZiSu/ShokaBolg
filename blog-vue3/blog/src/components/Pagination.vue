<!--
 * @description 分页组件
 * @author sulinye
 * @date 2024/3/2 15:02
-->

<template>
  <n-pagination
    class="pagination"
    v-model:page="currentPage"
    :page-count="total"
    :page-slot="5"
  >
    <template #prev>
      <svg-icon icon-class="angle-left" />
    </template>
    <template #next>
      <svg-icon icon-class="angle-right" />
    </template>
  </n-pagination>
</template>

<script setup>
const emit = defineEmits(["update:current"]);
const props = defineProps({
  current: {
    type: Number,
    default: 1,
  },
  total: {
    type: Number,
    default: 0,
  },
});

const currentPage = computed({
  get: () => props.current,
  set: (value) => {
    emit("update:current", value);
  },
});
</script>
<style lang="scss" scoped></style>
