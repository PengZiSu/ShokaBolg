<!--
 * @description 首页侧边栏公告
 * @author sulinye
 * @date 2024/3/2 17:05
-->

<template>
  <div class="side-card">
    <div class="card-title">
      <svg-icon
        class="trumpet"
        icon-class="trumpet"
        size="1.1875rem"
        color="red"
      />
      公告
    </div>
    <load-viewer :status="blogStore.status" failed-msg="公告加载失败">
      <template #data>
        <div class="notice-content" v-html="blogStore.siteConfig.siteNotice" />
      </template>
      <template #loading>
        <n-skeleton text round :repeat="3" />
      </template>
    </load-viewer>
  </div>
</template>

<script setup>
import useStore from "@/store";

const { blogStore } = useStore();
</script>
<style lang="scss" scoped>
.notice-content {
  font-size: 0.9rem;
  line-height: 1.75rem;
}
</style>
