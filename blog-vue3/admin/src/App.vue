<template>
  <el-config-provider :locale="zhCN" :size="Cookies.get('size') || 'default'">
    <router-view />
  </el-config-provider>
</template>

<script setup>
import { handleThemeStyle } from "@/utils/theme";
import useSettingStore from "@/store/modules/setting";
import zhCN from "element-plus/es/locale/lang/zh-cn";
import Cookies from "js-cookie";

onMounted(() => {
  nextTick(() => {
    handleThemeStyle(useSettingStore().theme);
  });
});
</script>

<style scoped></style>
