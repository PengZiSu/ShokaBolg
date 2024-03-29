<!--
 * @description 顶部导航栏
 * @author sulinye
 * @date 2024/3/2 22:02
-->

<template>
  <div class="menu">
    <!-- 网站标题 -->
    <div class="menu-item title">
      <router-link class="menu-btn" to="/">
        {{
          blogStore.siteConfig.siteName === undefined
            ? "shoka-blog"
            : blogStore.siteConfig.siteName
        }}
      </router-link>
    </div>
    <div
      v-for="(menuItem, index) in menus"
      :key="index"
      class="menu-item"
      :class="{ active: route.path === menuItem.path }"
    >
      <!-- 一级菜单项 -->
      <router-link
        v-if="menuItem.children === undefined"
        :to="menuItem.path"
        class="menu-btn"
      >
        <svg-icon :icon-class="menuItem.icon" />
        {{ menuItem.title }}
      </router-link>
      <!-- 多级菜单项 -->
      <div
        v-else
        class="sub-menu"
        @mouseover="showDropdown(index)"
        @mouseleave="hideDropdown(index)"
      >
        <a class="sub-menu-title">
          <svg-icon :icon-class="menuItem.icon" />
          {{ menuItem.title }}
        </a>
        <!-- 下拉列表项 -->
        <ul
          :class="{
            'sub-menu-dropdown': true,
            hidden: isDropdownHidden[index],
          }"
        >
          <li
            v-for="(subItem, index) in menuItem.children"
            :key="index"
            :class="{ active: route.path === subItem.path }"
            class="sub-menu-item"
          >
            <router-link :to="subItem.path" class="sub-menu-link">
              <svg-icon :icon-class="subItem.icon" />
              {{ subItem.title }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <!-- 登录 -->
    <div class="menu-item sub-menu" v-if="!appStore.local">
      <a
        v-if="!userStore.id"
        class="menu-btn"
        @click="appStore.showLoginFrame()"
      >
        <svg-icon icon-class="user" />
        登录
      </a>
      <template v-else>
        <n-avatar
          round
          class="avatar"
          :src="
            userStore.avatar
              ? userStore.avatar
              : blogStore.siteConfig.touristAvatar
          "
          :size="30"
        />
        <ul class="sub-menu-dropdown">
          <li class="sub-menu-item" :class="{ active: route.path === '/user' }">
            <router-link to="/user" class="sub-menu-link">
              <svg-icon icon-class="author"></svg-icon>
              个人中心
            </router-link>
          </li>
          <li class="sub-menu-item">
            <a class="sub-menu-link" @click="logout">
              <svg-icon icon-class="logout" />
              退出
            </a>
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<script setup>
import useStore from "@/store";
import { modal } from "@/utils/modal";
import { localMenuList, menuList } from "@/config/menu";

const route = useRoute();
const { blogStore, userStore, appStore } = useStore();

const menus = appStore.local ? localMenuList : menuList;

const isDropdownHidden = ref([]);
isDropdownHidden.value = Array(menuList.length).fill(true);

/**
 * 显示下拉菜单
 */
const showDropdown = (index) => {
  isDropdownHidden.value[index] = false;
};

/**
 * 隐藏下拉菜单
 */
const hideDropdown = (index) => {
  isDropdownHidden.value[index] = true;
};

/**
 * 注销
 */
const logout = () => {
  userStore.logout();
  modal.msgSuccess("注销成功");
};
</script>
<style lang="scss" scoped>
.avatar {
  display: flex;
}

.menu {
  display: flex;
  align-items: center;
  height: 100%;
}

.menu-item {
  position: relative;
  display: inline-block;
  padding: 0 0.625rem;
  letter-spacing: 0.0625rem;
  font-size: 1.1rem;
  text-align: center;

  // 下划线
  &:not(.title) .menu-btn::before {
    content: "";
    position: absolute;
    width: 0;
    height: 0.1875rem;
    bottom: 0;
    border-radius: 0.125rem;
    left: 50%;
    transform: translateX(-50%);
    background-color: currentColor;
    transition: all 0.4s ease-in-out 0s;
  }

  &:hover .sub-menu-dropdown {
    opacity: 1;
    transform: translateY(0);

    .sub-menu-item {
      animation: showList 0.5s ease-in-out forwards;
    }
  }
}

.menu-item.active .menu-btn::before,
.menu-item:hover .menu-btn::before {
  width: 70%;
}

.sub-menu-dropdown {
  //display: none;
  position: absolute;
  width: max-content;
  margin-top: 0.5rem;
  padding: 0;
  background: var(--grey-9-a5);
  box-shadow: 0 0.3125rem 1.25rem -0.25rem var(--grey-9-a1);
  border-radius: 0.625rem 0;
  transition: opacity 0.3s ease, transform 0.3s ease;

  // 在弹出框上边加个矩形，延长hover触发区域
  &::before {
    position: absolute;
    top: -1.25rem;
    left: 0;
    width: 100%;
    height: 2.5rem;
    content: "";
  }

  &.hidden {
    opacity: 0;
    transform: translateY(-10px);
    pointer-events: none;
  }
}

// 菜单项向下位移动画
@keyframes showList {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.sub-menu-item {
  display: block;
  font-size: 1rem;

  &:first-child {
    border-radius: 0.625rem 0 0 0;
  }

  &:last-child {
    border-radius: 0 0 0.625rem 0;
  }

  .sub-menu-link {
    padding: 0.3rem 0.7rem;
    display: inline-block;
    text-shadow: none;
    transition: transform 0.2s ease-in-out;
  }

  &:hover .sub-menu-link {
    transform: translateX(0.2rem);
    color: var(--grey-0);
  }
}

.sub-menu .sub-menu-item:hover,
.sub-menu .sub-menu-item.active {
  background-image: linear-gradient(
    to right,
    var(--color-pink) 0,
    var(--color-orange) 100%
  );
}

.show .sub-menu-dropdown {
  background-color: var(--grey-1);
}

.sub-menu-title::after {
  content: "";
  display: inline-block;
  vertical-align: middle;
  border: 0.3rem solid transparent;
  border-top-color: currentColor;
  border-bottom: 0;
}

@media (max-width: 991px) {
  .menu {
    justify-content: center;
  }

  .menu .menu-item {
    display: none;
  }

  .menu .title {
    display: block;
  }
}
</style>
