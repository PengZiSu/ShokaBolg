<!--
 * @description 数据显示组件，分为加载中、加载失败、加载成功、加载成功但没数据四种状态
 * @author sulinye
 * @date 19:54
-->

<template>
  <div v-if="status === 1">
    <slot name="data" />
  </div>
  <div v-else-if="status === 2">
    <slot name="no-data">
      <n-space justify="center" align="center" v-if="displayWhenEmpty">
        <n-gradient-text type="error" style="font-weight: bold">
          {{ noDataMsg }}
        </n-gradient-text>
      </n-space>
    </slot>
  </div>
  <div v-else-if="status === 0">
    <slot name="loading" />
  </div>
  <div v-else>
    <slot name="fail">
      <n-space justify="center" align="center" v-if="displayWhenFailed">
        <n-gradient-text type="error" style="font-weight: bold">
          {{ failedMsg }}
        </n-gradient-text>
      </n-space>
    </slot>
  </div>
</template>

<script setup>
defineProps({
  // 只能为-1、0、1、2；
  // -1表示加载失败，0表示加载中，1表示加载成功，2表示加载成功但没数据
  status: {
    type: Number,
    default: 0,
    required: true,
    validator: (value) => {
      return [-1, 0, 1, 2].indexOf(value) !== -1;
    },
  },

  // 没有数据时的提示信息
  noDataMsg: {
    type: String,
    default: "目前还没有数据哦~",
  },

  // 加载失败时的提示信息
  failedMsg: {
    type: String,
    default: "加载失败",
  },

  // 加载成功但没数据时是否显示
  displayWhenEmpty: {
    type: Boolean,
    default: true,
  },

  // 加载失败时是否显示
  displayWhenFailed: {
    type: Boolean,
    default: true,
  },
});
</script>
<style lang="scss" scoped></style>
