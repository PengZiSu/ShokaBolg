<!--
 * @description 固钉工具
 * @author sulinye
 * @date 2024/3/2 11:59
-->

<template>
  <div class="tool" :style="y > 0 ? show : ''">
    <div class="item" v-if="route.name == 'article'" @click="handleSide">
      <svg-icon
        :icon-class="appStore.rightContainer ? 'narrow' : 'expand'"
        size="1.5rem"
      ></svg-icon>
    </div>
    <div class="item" v-if="commentShow(route.name)" @click="handleToComment">
      <svg-icon icon-class="comment" size="1.2rem" />
    </div>
    <div
      class="item back-to-top"
      @click="handleBackToTop"
      style="margin-top: 0.2rem"
    >
      <svg-icon icon-class="up" size="0.9rem" />
      <span class="count">{{ process }}%</span>
    </div>
  </div>
</template>

<script setup>
import useStore from "@/store";
import { useEventListener, useScroll } from "@vueuse/core";

const route = useRoute();
const process = ref(0);
const show = reactive({
  transform: "translateX(-45px)",
});
const { y } = useScroll(window);
const { appStore } = useStore();
const commentList = ["article", "friend", "talkInfo"];
const commentShow = computed(() => (value) => commentList.includes(value));

// 监听滚动，记录当前页面浏览进度
useEventListener(document, "scroll", () => {
  process.value = Number(
    (
      (window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight)) *
      100
    ).toFixed(0)
  );
});

const handleSide = () => {
  appStore.rightContainer = !appStore.rightContainer;
};
const handleToComment = () => {
  document.getElementById("comment-container")?.scrollIntoView({
    block: "start",
    inline: "nearest",
    behavior: "smooth",
  });
};
const handleBackToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
</script>
<style lang="scss" scoped>
@use "@/assets/styles/mixin";

.tool {
  position: fixed;
  right: -40px;
  bottom: 1rem;
  z-index: 9;
  color: var(--primary-color);
  box-shadow: 0 0 0.5rem rgb(0 0 0 / 10%);
  background: var(--grey-1-a3);
  transition: all 0.5s;

  .item {
    @include mixin.flex;
    flex-direction: column;
    width: 1.9rem;
    padding: 0.3125rem 0 0;
    opacity: 0.6;
    cursor: pointer;
    transition: all 0.2s ease-in-out 0s;

    .count {
      font-size: 0.75em;
    }

    &:hover {
      opacity: 0.9;
    }
  }
}
</style>
