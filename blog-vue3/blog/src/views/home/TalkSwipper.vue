<!--
 * @description 首页说说轮播
 * @author sulinye
 * @date 2024/3/2 21:04
-->

<template>
  <load-viewer
    :status="status"
    :display-when-failed="false"
    :display-when-empty="false"
  >
    <template #data>
      <div class="talk-swiper flex-space-between">
        <svg-icon icon-class="horn" size="1.25rem" />
        <swiper
          class="swiper-container"
          direction="vertical"
          :modules="modules"
          :speed="2000"
          :loop="true"
          :slides-per-view="1"
          :autoplay="{ delay: 3000, disableOnInteraction: false }"
        >
          <swiper-slide v-for="(talk, index) in talkList" :key="index">
            <n-button text @click="toTalk(talk.id)">
              <div class="slide-content" v-html="talk.talkContent" />
            </n-button>
          </swiper-slide>
        </swiper>
        <n-popover trigger="hover">
          <template #trigger>
            <n-button text @click="toTalk(undefined)">
              <svg-icon icon-class="right-arrow" class="arrow" />
            </n-button>
          </template>
          前往说说页面
        </n-popover>
      </div>
    </template>
    <template #loading>
      <div class="talk-swiper flex-space-between">
        <n-skeleton circle width="20px" />
        <n-skeleton round width="90%" />
        <n-skeleton circle width="20px" />
      </div>
    </template>
  </load-viewer>
</template>

<script setup>
import { ref } from "vue";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
import router from "@/router";
import { getTalkHomeList } from "@/api/talk";

// 自动播放
const modules = [Autoplay];
const status = ref(0);
const talkList = ref([]);

const toTalk = (id) => {
  let path = "/talk";
  if (typeof id === "number") {
    path += `/${id}`;
  }
  router.push({ path: path });
};

onMounted(() => {
  getTalkHomeList()
    .then(({ data }) => {
      talkList.value = data.data;
      if (talkList.value.length > 0) {
        status.value = 1;
      } else {
        status.value = 2;
      }
    })
    .catch(() => {
      status.value = -1;
    });
});
</script>
<style lang="scss" scoped>
@use "@/assets/styles/mixin";

.talk-swiper {
  @include mixin.hover-card;

  margin: 0.5rem;
  padding: 0.6rem 1rem;
  font-size: 0.9375rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out 0s;

  .swiper-container {
    height: 1.5625rem;
    line-height: 1.5625rem;
  }
}

.slide-content {
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.arrow {
  animation: 1.5s passing infinite;
}

@keyframes passing {
  0% {
    transform: translateX(-50%);
    opacity: 0;
  }

  50% {
    transform: translateX(0);
    opacity: 1;
  }

  100% {
    transform: translateX(50%);
    opacity: 0;
  }
}
</style>
