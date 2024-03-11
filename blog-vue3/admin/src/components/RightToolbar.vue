<!--
 * @description 右侧工具栏
 * @author sulinye
 * @date 2024/2/27 15:32
-->

<template>
  <div class="top-right-btn" style="margin-right: 5px">
    <el-row>
      <el-tooltip
        v-if="search"
        class="item"
        placement="top"
        :content="showSearch ? '隐藏搜索' : '显示搜索'"
      >
        <el-button circle icon="Search" @click="toggleSearch" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="刷新" placement="top">
        <el-button circle icon="Refresh" @click="refresh()" />
      </el-tooltip>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  showSearch: {
    type: Boolean,
    default: true,
  },
  search: {
    type: Boolean,
    default: true,
  },
});

const emits = defineEmits(["update:showSearch", "queryTable"]);

//显隐数据
const value = ref([]);

const toggleSearch = () => {
  emits("update:showSearch", props.showSearch);
};
const refresh = () => {
  emits("queryTable");
};
</script>
<style lang="scss" scoped></style>
