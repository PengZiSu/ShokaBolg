<!--
 * @description 主页面
 * @author sulinye
 * @date 2024/3/2 22:07
-->

<template>
  <main ref="main" class="main-wrapper">
    <router-view v-slot="{ Component, route }">
      <keep-alive>
        <component :is="Component" :key="route.fullPath" />
      </keep-alive>
    </router-view>
  </main>
</template>

<script setup>
import useAppStore from "@/store/modules/app";

const main = ref(null);

onMounted(() => {
  if (useAppStore().local) {
    main.value.style.paddingBottom = "0";
  }
});
</script>
<style lang="scss" scoped>
.main-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 0 8rem;
}
</style>
