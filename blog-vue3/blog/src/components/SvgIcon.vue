<template>
  <svg
    :style="'width:' + size + ';height:' + size"
    aria-hidden="true"
    class="svg-icon"
  >
    <use :fill="color" :href="symbolId" />
  </svg>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  prefix: {
    type: String,
    default: "icon",
  },
  iconClass: {
    type: String,
    required: false,
  },
  color: {
    type: String,
  },
  size: {
    type: String,
    default: "1rem",
  },
});

const symbolId = computed(() => `#${props.prefix}-${props.iconClass}`);
</script>
<style lang="scss" scoped>
.svg-icon {
  vertical-align: -0.15em;
  overflow: hidden;
  fill: currentColor;
}
</style>
