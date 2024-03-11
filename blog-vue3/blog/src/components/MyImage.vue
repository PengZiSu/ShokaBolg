<!--
 * @description 图片组件
 * @author sulinye
 * @date 18:19
-->

<template>
  <n-image
    class="cover"
    lazy
    :src="src"
    :preview-disabled="!preview"
    object-fit="cover"
    :imgProps="{ style: { width: '100%', height: '100%' } }"
  >
    <template #placeholder>
      <n-image
        class="cover"
        :src="loadingImg"
        object-fit="cover"
        :imgProps="{ style: { width: '100%', height: '100%' } }"
      />
    </template>
  </n-image>
</template>

<script setup>
import loadingImg from "@/assets/images/loading.gif";

defineProps({
  src: {
    type: String,
    required: true,
  },
  preview: {
    type: Boolean,
    default: false,
  },
});
</script>
<style lang="scss" scoped>
.cover {
  width: 100%;
  height: 100%;
  transition: all 0.2s ease-in-out 0s;
}
</style>
