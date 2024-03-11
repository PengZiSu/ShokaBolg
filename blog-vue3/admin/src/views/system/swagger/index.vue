<!--
 * @description 系统接口页面
 * @author sulinye
 * @date 2024/3/1 15:38
-->

<template>
  <my-iframe v-model:src="url" />
</template>

<script setup>
const url = ref(import.meta.env.VITE_APP_BASE_API + "/doc.html");
</script>
<style lang="scss" scoped></style>
