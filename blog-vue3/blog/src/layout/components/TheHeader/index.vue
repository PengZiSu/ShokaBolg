<!--
 * @description 页面顶部
 * @author sulinye
 * @date 2024/3/2 19:01
-->

<template>
  <header :class="fixedClass" class="header-wrapper">
    <hamburger />
    <!-- 这里不加这一层div会报警告 -->
    <div :class="{ sub: y > 0 }">
      <navbar />
    </div>
    <day-night-toggle class="day-night-toggle" />
  </header>
</template>

<script setup>
import navbar from "@/layout/components/TheHeader/Navbar.vue";
import hamburger from "@/layout/components/TheHeader/Hamburger.vue";
import { useScroll } from "@vueuse/core";
import useStore from "@/store";

const { appStore } = useStore();
const { y } = useScroll(window);
const show = ref(false);
const up = ref(true);

const fixedClass = computed(() => ({
  show: show.value,
  up: up.value,
  down: !up.value,
}));

const maxChangeHeight = computed(() => appStore.headerChangeHeight);

// 监听滚动
watch(y, (newValue, oldValue) => {
  show.value = newValue > maxChangeHeight.value;
  up.value = newValue < oldValue;

  let rightContainer = document.getElementsByClassName("right-container")[0];
  if (newValue < oldValue && rightContainer) {
    rightContainer.style.top = "4.125rem";
  } else if (newValue > oldValue && rightContainer) {
    rightContainer.style.top = "1rem";
  }
});
</script>
<style lang="scss" scoped>
.header-wrapper {
  position: fixed;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 3.125rem;
  padding: 0 1rem;
  text-shadow: 0 0.2rem 0.3rem rgb(0 0 0 / 50%);
  color: var(--header-text-color);
  transition: all 0.2s ease-in-out 0s;
  z-index: 9;
}

.show {
  background: var(--nav-bg);
  box-shadow: 0.1rem 0.1rem 0.2rem var(--grey-9-a1);
  text-shadow: 0 0 0.625rem var(--grey-9-a1);
  color: var(--text-color);
}

.up {
  transform: translateY(0);
}

.down {
  transform: translateY(-100%);
}

.right {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.day-night-toggle {
  zoom: 0.5;
}

@media (max-width: 991px) {
  .header-wrapper {
    padding: 0;
  }

  .day-night-toggle {
    zoom: 0.35;
    margin-right: 2rem;
  }
}
</style>
