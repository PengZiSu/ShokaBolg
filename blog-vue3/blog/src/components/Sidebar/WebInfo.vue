<!--
 * @description 首页侧边栏网页信息
 * @author sulinye
 * @date 2024/3/2 17:06
-->

<template>
  <div class="side-card" v-if="!useAppStore().local">
    <div class="card-title">
      <svg-icon icon-class="web" size="1.1875rem" />
      网站信息
    </div>
    <load-viewer :status="blogStore.status" failed-msg="网站信息加载失败">
      <template #data>
        <div class="web-item">
          <div class="web-name">运行时长</div>
          <div class="web-count">{{ runTime }}</div>
        </div>
        <div class="web-item">
          <div class="web-name">总访问量</div>
          <div class="web-count">{{ blogStore.viewCount }}</div>
        </div>
      </template>
      <template #loading>
        <n-skeleton round text :repeat="2" />
      </template>
    </load-viewer>
  </div>
</template>

<script setup>
import useStore from "@/store";
import dayjs from "dayjs";
import useAppStore from "@/store/modules/app";

const { blogStore } = useStore();
const runTime = ref("");

setInterval(() => {
  const days = dayjs().diff(blogStore.siteConfig.createSiteTime, "days");
  const now = new Date();
  let str = "";
  str += days + "天";
  str += now.getHours() + "时";
  str += now.getMinutes() + "分";
  str += now.getSeconds() + "秒";
  runTime.value = str;
}, 1000);
</script>
<style lang="scss" scoped>
.web-item {
  display: flex;
  justify-content: space-between;
}
</style>
