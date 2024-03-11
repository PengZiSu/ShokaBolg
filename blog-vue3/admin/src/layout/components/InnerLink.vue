<!--
 * @description 内链组件
 * @author sulinye
 * @date 2024/2/23 9:52
-->

<template>
  <div :style="'height:' + heigth">
    <iframe
      :id="props.iframeId"
      :src="props.src"
      style="width: 100%; height: 100%; border: none"
    >
    </iframe>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  src: {
    type: String,
    default: "/",
  },
  iframeId: {
    type: String,
  },
});

const heigth = ref(document.documentElement.clientHeight - 94.5 + "px");
</script>
<style lang="scss" scoped></style>
