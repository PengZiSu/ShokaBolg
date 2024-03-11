<!--
 * @description 网页全屏
 * @author sulinye
 * @date 2024/2/27 21:15
-->

<template>
  <div>
    <svg-icon
      :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
      size="1.1rem"
      @click="toggle"
    />
  </div>
</template>

<script setup>
import { useFullscreen } from "@vueuse/core";

const { isFullscreen, toggle } = useFullscreen();
</script>
<style lang="scss" scoped></style>
