<!--
 * @description gitee地址
 * @author sulinye
 * @date 2024/2/25 20:31
-->

<template>
  <div>
    <svg-icon icon-class="gitee" size="1.2rem" @click="goto"></svg-icon>
  </div>
</template>

<script setup>
const url = import.meta.env.VITE_GITEE_URL;

const goto = () => {
  window.open(url);
};
</script>

<style lang="scss" scoped></style>
