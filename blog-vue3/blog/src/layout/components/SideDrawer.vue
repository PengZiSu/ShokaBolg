<!--
 * @description 侧边栏
 * @author sulinye
 * @date 2024/3/2 19:58
-->

<template>
  <n-drawer
    v-model:show="drawerVisible"
    :width="240"
    :block-scroll="false"
    placement="right"
  >
    <n-drawer-content style="padding-top: 0.5rem">
      <author class="side-author" :card="false" />
      <ul class="side-menu">
        <template v-for="menu of sideMenus" :key="menu.name">
          <li class="item" :class="{ active: route.path === menu.path }">
            <router-link :to="menu.path">
              <svg-icon :icon-class="menu.icon" />
              {{ menu.name }}
            </router-link>
          </li>
        </template>
        <li class="item" v-if="!userStore.id">
          <a @click="appStore.showLoginFrame()">
            <svg-icon icon-class="user" />
            登录
          </a>
        </li>
        <template v-else>
          <li class="item" :class="{ active: route.path === '/user' }">
            <router-link to="/user">
              <svg-icon icon-class="author"></svg-icon>
              个人中心
            </router-link>
          </li>
          <li class="item">
            <a @click="logout">
              <svg-icon icon-class="logout" />
              注销登录
            </a>
          </li>
        </template>
      </ul>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
import useStore from "@/store";
import { useWindowSize } from "@vueuse/core";
import { modal } from "@/utils/modal";
import { localSideMenuList, sideMenuList } from "@/config/menu";

const route = useRoute();
const router = useRouter();
const { appStore, userStore } = useStore();
const { width } = useWindowSize();
const sideMenus = appStore.local ? localSideMenuList : sideMenuList;

const drawerVisible = computed({
  get: () => appStore.sideDrawer,
  set: (value) => (appStore.sideDrawer = value),
});

// 监听屏幕宽度，侧边栏收缩
watchEffect(() => {
  if (width.value > 991) {
    appStore.sideDrawer = false;
  }
});

const logout = () => {
  if (route.path == "/user") {
    router.go(-1);
  }
  userStore.logout();
  modal.msgSuccess("注销成功");
};
</script>
<style lang="scss" scoped>
.side-author {
  animation: fadeInRight 0.4s;
}

.side-menu {
  text-align: center;
  line-height: 3;
  padding: 1rem 1rem 1.25rem;
  background-color: transparent;
  animation: fadeInRight 0.4s;

  .item {
    color: var(--grey-5);
    border-radius: 0.9375rem;
    margin-bottom: 0.625rem;
    transition: all 0.2s ease-in-out 0s;
    cursor: pointer;

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
      color: inherit;
    }
  }
}

.item.active {
  color: var(--grey-0);
  background-image: linear-gradient(
    to right,
    var(--color-pink) 0,
    var(--color-orange) 100%
  );
  box-shadow: 0 0 0.75rem var(--color-pink-a3);

  &:hover {
    color: var(--grey-0);
    box-shadow: 0 0 0.75rem var(--color-pink);
  }
}
</style>
