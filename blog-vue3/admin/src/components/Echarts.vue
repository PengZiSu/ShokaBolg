<!--
 * @description Echarts组件
 * @author sulinye
 * @date 11:44
-->

<template>
  <div ref="chartDom" :style="{ width: width, height: height }" />
</template>

<script setup>
import { ref } from "vue";
import { useResizeObserver } from "@vueuse/core";
import echarts from "@/utils/echarts";

//获取dom和父组件数据 并定义"myChart" 用于初始化图表
const chartDom = ref();
const myChart = ref();
const props = defineProps({
  options: {
    type: Object,
    default: {},
    required: true,
  },
  width: {
    type: String,
    default: "100%",
  },
  height: {
    type: String,
    default: "400px",
  },
});

//页面成功渲染，开始绘制图表
onMounted(() => {
  //配置为 svg 形式，预防页面缩放而出现模糊问题；图表过于复杂时建议使用 Canvas
  myChart.value = markRaw(
    echarts.init(chartDom.value, undefined, { renderer: "svg" })
  );
  myChart.value.setOption(props.options, true);

  //自适应不同屏幕时改变图表尺寸
  useResizeObserver(chartDom.value, () => {
    myChart.value ? myChart.value.resize() : undefined;
  });
});

//监听图表数据时候变化，重新渲染图表
watch(
  () => props.options,
  (newOptions) => {
    myChart.value ? myChart.value.setOption(newOptions) : undefined;
  },
  { deep: true }
);
</script>
<style lang="scss" scoped></style>
