<!--
* @description 侧边栏菜单项
* @author sulinye
* @date 2024/02/25 11:09
!-->
<template>
  <!-- 若item没有meta(如登录页)/没有hidden/hidden为true，则不渲染 -->
  <div v-if="!(item.meta ? item.meta.hidden : undefined)">
    <!-- 若没有子路由，则渲染为一级菜单 -->
    <template
      v-if="
        hasOneShowingChild(item, item.children) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren)
      "
    >
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item
          :class="{ 'sub-menu_title-noDropdown': !isNest }"
          :index="resolvePath(onlyOneChild.path)"
        >
          <el-icon>
            <svg-icon
              :icon-class="
                onlyOneChild.meta.icon || (item.meta && item.meta.icon)
              "
            />
          </el-icon>
          <template #title>
            <span :title="hasTitle(onlyOneChild.meta.title)" class="menu-title">
              {{ onlyOneChild.meta.title }}
            </span>
          </template>
        </el-menu-item>
      </app-link>
    </template>
    <!-- 若有子路由则渲染为多级菜单 -->
    <el-sub-menu v-else :index="resolvePath(item.path)">
      <template v-if="item.meta" #title>
        <el-icon>
          <svg-icon
            v-if="item.meta && item.meta.icon"
            :icon-class="item.meta ? item.meta.icon : undefined"
          />
        </el-icon>
        <span
          :title="hasTitle(item.meta ? item.meta.title : undefined)"
          class="menu-title"
        >
          {{ item.meta ? item.meta.title : undefined }}
        </span>
      </template>
      <!-- 添加子菜单 -->
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :base-path="resolvePath(child.path)"
        :is-nest="true"
        :item="child"
        class="nest-menu"
      >
      </sidebar-item>
    </el-sub-menu>
  </div>
</template>

<script setup>
import AppLink from "./Link.vue";
import { ref } from "vue";
import { isExternal } from "@/utils/validate";

const onlyOneChild = ref();
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  basePath: {
    type: String,
    required: true,
  },
  isNest: {
    type: Boolean,
    required: true,
  },
});

/**
 * @description 判断是否只有一个子菜单
 * @param parent
 * @param children
 * @return {*}
 */

const hasOneShowingChild = (parent, children) => {
  if (!children) {
    children = [];
  }
  const showingChildren = children.filter((item) => {
    if (item.meta && item.meta.hidden) {
      return false;
    } else {
      //暂设，只有一个子路由的情况下就不用再设置了
      onlyOneChild.value = item;
      return true;
    }
  });
  // 只有一个子路由时，直接显示子路由
  if (showingChildren.length === 1) {
    return true;
  }
  // 若没有子路由则显示父路由本身
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: "", noShowingChildren: true };
    return true;
  }
  return false;
};

/**
 * 处理路径
 * @param routePath 路径
 */

const resolvePath = (routePath) => {
  if (isExternal(routePath)) {
    return routePath.substring(1);
  }
  if (isExternal(props.basePath)) {
    return props.basePath.substring(1);
  }
  return getNormalPath(props.basePath + "/" + routePath);
};

/**
 * 获取项目路径
 * @param p 路径
 */

const getNormalPath = (p) => {
  if (p.length === 0 || !p || p === "undefined") {
    return p;
  }
  let res = p.replace("//", "/");
  if (res[res.length - 1] === "/") {
    return res.slice(0, res.length - 1);
  }
  return res;
};

/**
 * 当菜单名称过长时设置title
 * @param title 菜单名称
 */

const hasTitle = (title) => {
  if (title && title.length > 5) {
    return title;
  } else {
    return "";
  }
};
</script>
<style lang="scss" scoped></style>
