<!--
 * @description 代码预览
 * @author sulinye
 * @date 23:22
-->

<template>
  <pre :class="lineNumbers">
     <code :class="'language-'+type" v-html="Prism.highlight(code,Prism.languages[type],type)"></code>
  </pre>
</template>

<script setup>
import Prism from "prismjs";
import { computed, onMounted } from "vue";

const props = defineProps({
  code: {
    type: String,
    default: "",
  },
  type: {
    tyep: String,
    default: "html",
  },
  showLineNumbers: {
    type: Boolean,
    default: false,
  },
});

const lineNumbers = computed(() => {
  return props.showLineNumbers ? "line-numbers" : "";
});

onMounted(() => {
  Prism.highlightAll(); //切换菜单重新渲染
});
</script>
<style lang="scss" scoped></style>
