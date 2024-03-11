<!--
 * @description IframeToggle
 * @author sulinye
 * @date 2024/2/23 15:03
-->

<template>
  <transition-group name="fade-transform">
    <inner-link
      v-for="(item, index) in tagStore.iframeViews"
      :key="item.path"
      :iframeId="'iframe' + index"
      v-show="route.path === item.path"
      :src="item.meta ? item.meta.link : undefined"
    >
    </inner-link>
  </transition-group>
</template>

<script setup>
import InnerLink from "@/layout/components/InnerLink.vue";
import useStore from "@/store";

const route = useRoute();
const { tagStore } = useStore();
</script>
<style lang="scss" scoped></style>
