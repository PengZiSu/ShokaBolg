<!--
 * @description 设置页面布局大小
 * @author sulinye
 * @date 2024/2/27 20:38
-->

<template>
  <el-dropdown trigger="click" @command="handleSetSize">
    <div class="size-select-icon">
      <svg-icon icon-class="size" size="1.1rem" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item of sizeOptions"
          :key="item.value"
          :command="item.value"
          :disabled="size === item.value"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import useStore from "@/store";
import { modal } from "@/utils/modal";
import { computed, ref } from "vue";

const { appStore } = useStore();

const size = computed(() => appStore.size);

const sizeOptions = ref([
  { label: "默认", value: "default" },
  { label: "大型", value: "large" },
  { label: "小型", value: "small" },
]);

const handleSetSize = (size) => {
  modal.loading("正在设置布局大小，请稍候...");
  appStore.setSize(size);
  setTimeout("window.location.reload()", 1000);
};
</script>
<style lang="scss" scoped>
.size-select-icon {
  line-height: 50px;
}
</style>
