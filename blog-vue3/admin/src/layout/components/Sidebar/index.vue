<!--
 * @description 侧边栏
 * @author sulinye
 * @date 2024-02-23 12:07
-->

<template>
  <div
    :class="{ 'has-logo': showLogo }"
    :style="{
      backgroundColor:
        sideTheme === 'theme-dark'
          ? variables.menuBackground
          : variables.menuBackgroundLightBackgtound,
    }"
  >
    <!-- 网站Logo -->
    <logo v-if="showLogo" :collapse="isCollapse" />
    <!-- 侧边栏 -->
    <el-scrollbar :class="sideTheme" wrap-class="scrollbar-wrapper">
      <el-menu
        :active-text-color="theme"
        :background-color="
          sideTheme === 'theme-dark'
            ? variables.menuBackground
            : variables.menuLightBackground
        "
        :collapse="isCollapse"
        :collapse-transition="false"
        :default-active="activePath"
        :text-color="
          sideTheme === 'theme-dark'
            ? variables.menuColor
            : variables.menuLightColor
        "
        :unique-opened="true"
        mode="vertical"
      >
        <sidebar-item
          v-for="(route, index) in sidebarRouters"
          :key="route.path + index"
          :base-path="route.path"
          :item="route"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import useStore from "@/store";
import variables from "@/assets/styles/variables.module.scss";
import logo from "@/layout/components/Sidebar/Logo.vue";
import SidebarItem from "@/layout/components/Sidebar/SidebarItem.vue";
import { computed } from "vue";

const { appStore, settingStore, permissionStore } = useStore();
const route = useRoute();
const sideTheme = computed(() => settingStore.sideTheme);
const theme = computed(() => settingStore.theme);
const isCollapse = computed(() => !appStore.sidebar.opened);
const showLogo = computed(() => settingStore.sidebarLogo);
const sidebarRouters = computed(() => permissionStore.sidebarRouters);
const activePath = computed(() => route.path);
</script>
<style lang="scss" scoped></style>
