<!--
 * @description 页脚
 * @author sulinye
 * @date 2024/3/2 22:17
-->
<template>
  <footer class="footer-wrapper" v-if="!isMessage && !useAppStore().local">
    <p>
      copyright ©
      {{ formatDate(blogStore.siteConfig.createSiteTime, "YYYY") }}
      -
      {{ new Date().getFullYear() }}
      by
      <b>
        {{ blogStore.siteConfig.siteAuthor?.toUpperCase() }}
      </b>
    </p>

    <a class="underline-a" href="https://beian.miit.gov.cn/" target="_blank">
      {{ blogStore.siteConfig.recordNumber }}
    </a>
  </footer>
</template>

<script setup>
import useStore from "@/store";
import { formatDate } from "@/utils/date";
import useAppStore from "@/store/modules/app";
import { useRoute } from "vue-router";

const route = useRoute();

const { blogStore } = useStore();
const isMessage = computed(() => route.name === "message");
</script>
<style lang="scss" scoped>
.footer-wrapper {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 8rem;
  padding: 2.5rem 0;
  font-size: 0.875rem;
  text-align: center;
  box-shadow: 0 0 10px var(--shadow-color), 0 0 10px var(--shadow-color);
  border-radius: 10px 10px 0 0;
  color: var(--grey-0);
  background: var(--footer-bg);
  background-size: 300% 300%;
  animation: gradientBG 10s ease infinite;
  -webkit-animation: gradientBG 10s ease infinite;
}

// 背景渐变动画
@keyframes gradientBG {
  0% {
    background-position: 0 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0 50%;
  }
}
</style>
