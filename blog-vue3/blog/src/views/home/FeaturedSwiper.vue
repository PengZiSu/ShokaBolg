<!--
 * @description 推荐文章
 * @author sulinye
 * @date 2024/3/2 23:27
-->

<template>
  <load-viewer
    :status="status"
    :display-when-empty="false"
    :display-when-failed="false"
  >
    <template #data>
      <swiper
        :autoplay="{ delay: 5000, disableOnInteraction: false }"
        :loop="true"
        :modules="modules"
        :pagination="{ clickable: true }"
        :slides-per-view="1"
        class="swiper-container"
        mousewheel
        navigation
      >
        <swiper-slide v-for="article in featuredList" :key="article.id">
          <div
            :style="articleCover(article.articleCover)"
            class="slide-content"
          >
            <router-link :to="`/article/${article.id}`" class="slide-title">
              {{ article.articleTitle }}
            </router-link>
            <span class="slide-time"
              >发布时间:{{ formatDate(article.createTime) }}</span
            >
          </div>
        </swiper-slide>
      </swiper>
    </template>
    <template #loading>
      <div class="swiper-container bg-gray">
        <div class="slide-content">
          <n-skeleton round class="slide-title" width="200px" />
          <n-skeleton round class="slide-time" width="200px" />
        </div>
      </div>
    </template>
  </load-viewer>
</template>

<script setup>
import { Autoplay, Mousewheel, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
import { ref } from "vue";
import { getArticleFeatured } from "@/api/article";
import { formatDate } from "@/utils/date";
import useStore from "@/store";

const { blogStore } = useStore();
const modules = [Pagination, Navigation, Mousewheel, Autoplay];
const featuredList = re([]);
const status = ref(0);

const articleCover = computed(() => (cover) => {
  if (cover === "") {
    cover = blogStore.siteConfig.articleCover;
  }
  return "background:url(" + cover + ")";
});

onMounted(() => {
  getArticleFeatured()
    .then(({ data }) => {
      featuredList.value = data.data;
      if (featuredList.value.length > 0) {
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

.swiper-container {
  height: 14rem;
  margin: 0.5rem;
  border-radius: 0.75rem;

  // 左上角推荐标记
  &::before {
    content: "推荐";
    position: absolute;
    left: 0.625rem;
    top: -2rem;
    z-index: 2;
    color: var(--grey-0);
    background: linear-gradient(
      90deg,
      var(--color-yellow),
      var(--color-orange)
    );
    letter-spacing: 0.2rem;
    font-size: 1rem;
    width: 4rem;
    text-align: center;
    display: flex;
    justify-content: center;
    border-radius: 0 0 0.75rem 0.75rem;
    transition: transform 0.3s ease-in-out;
  }

  &:hover::before {
    transform: translateY(2rem);
  }
}

.slide-content {
  @include mixin.flex;
  flex-direction: column;
  //width: 100%;
  height: 100%;
  padding: 0 3rem 1rem;
  background-position: center !important;
  background-size: cover !important;

  .slide-title {
    font-size: 2.5rem;
    font-weight: 800;
  }

  .slide-title,
  .slide-time {
    text-align: center;
    line-height: 1.5;
    margin: 0.125rem 0;
    color: #fff;
    z-index: 1;
  }
}

.swiper-slide .slide-content::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  left: 0;
  top: 0;
}

// 底部分页效果
:deep(.swiper-pagination) {
  .swiper-pagination-bullet {
    display: inline-block;
    width: 0.6875rem;
    height: 0.6875rem;
    margin: 0 0.25rem;
    border-radius: 6.1875rem;
    background: var(--grey-0);
    opacity: 0.8;
    transition: all 0.3s;

    &.swiper-pagination-bullet-active {
      opacity: 1;
      background-color: var(--primary-color);
      width: 1.875rem;
    }
  }
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  width: 2.75rem;
  color: var(--primary-color);
  transition: all 0.3s ease-in-out;

  &:after {
    font-size: 1.5rem !important;
  }

  &:hover {
    //background: rgba(255, 255, 255, .4);
    background: var(--grey-3);
    border-radius: 100%;
  }
}
</style>
