<!--
 * @description 关于页面
 * @author sulinye
 * @date 2024/3/3 16:04
-->

<template>
  <div class="page-header">
    <h1 class="page-title">关于</h1>
    <img class="page-cover" :src="bgImage" alt="" />
    <waves />
  </div>
  <div class="bg">
    <div class="page-container">
      <div class="author-info">
        <n-avatar
          class="author-avatar"
          round
          :size="150"
          :src="blogStore.siteConfig.authorAvatar"
        />
        <p class="author-name">{{ blogStore.siteConfig.siteAuthor }}</p>
      </div>
      <v-md-preview class="md" :text="blogStore.siteConfig.aboutMe" />
    </div>
  </div>
</template>

<script setup>
import useStore from "@/store";
import { getRandomBgImage } from "@/utils/common";

const bgImage = getRandomBgImage();

const { blogStore } = useStore();
</script>
<style lang="scss" scoped></style>
