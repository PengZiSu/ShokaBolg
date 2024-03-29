<!--
 * @description 首页文章列表
 * @author sulinye
 * @date 2024/3/2 17:01
-->

<template>
  <load-viewer
    :status="status"
    no-data-msg="暂时还没有发布过文章哦~"
    failed-msg="文章加载失败"
  >
    <template #data>
      <div
        v-animate="['fadeInUpBig']"
        class="article-item"
        v-for="article in articleList"
        :key="article.id"
      >
        <router-link :to="`/article/${article.id}`" class="article-cover">
          <my-image :src="setArticleCover(article.articleCover)" />
        </router-link>
        <div class="article-info">
          <div class="article-time">
            <!-- 置顶 -->
            <span class="top" v-if="article.isTop === 1">
              <svg-icon
                icon-class="top"
                size="0.85rem"
                style="margin-right: 0.15rem"
              />
              置顶
            </span>
            <!-- 文章标签 -->
            <router-link
              class="article-tag-category"
              v-for="tag in article.tagList"
              :key="tag.id"
              :to="`/tag/${tag.id}`"
            >
              <svg-icon
                icon-class="tag"
                size="0.9rem"
                style="margin-right: 0.15rem"
              />
              <n-ellipsis style="max-width: 4rem">{{ tag.tagName }}</n-ellipsis>
            </router-link>
          </div>
          <!-- 文章标题 -->
          <h3 class="article-title">
            <router-link :to="`/article/${article.id}`">
              {{ article.articleTitle }}
            </router-link>
          </h3>
          <!-- 文章内容 -->
          <div class="article-content">{{ article.articleContent }}</div>
          <div class="article-footer">
            <!-- 发表时间 -->
            <div class="create-time">
              <svg-icon icon-class="calendar" size="0.9rem" />
              <span>{{ formatDate(article.createTime) }} </span>
            </div>
            <!-- 文章分类 -->
            <router-link
              class="article-category"
              :to="`/category/${article.category.id}`"
            >
              <svg-icon icon-class="flag" size="0.85rem" />
              <n-ellipsis style="max-width: 6rem">{{
                article.category.categoryName
              }}</n-ellipsis>
            </router-link>
          </div>
          <!-- 阅读按钮 -->
          <router-link class="article-btn" :to="`/article/${article.id}`"
            >more...</router-link
          >
        </div>
      </div>
      <pagination
        v-model:current="pageQuery.current"
        :total="Math.ceil(count / 5)"
      />
    </template>
    <template #loading>
      <div
        v-animate="['fadeInUpBig']"
        class="article-item"
        v-for="item in [1, 2, 3, 4, 5]"
        :key="item"
      >
        <n-skeleton class="article-cover" />
        <div class="article-info">
          <n-skeleton class="article-title" width="12rem" height="2rem" round />
          <n-skeleton
            class="article-content"
            width="100%"
            round
            text
            :repeat="4"
          />
        </div>
      </div>
    </template>
  </load-viewer>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getArticleList } from "@/api/article";
import { formatDate } from "@/utils/date";
import pagination from "@/components/Pagination.vue";
import useStore from "@/store";

const { blogStore } = useStore();
const articleList = ref([]);
const pageQuery = ref({ current: 1, size: 5 });
const count = ref(0);
const status = ref(0);

const setArticleCover = (coverSrc) => {
  return coverSrc === "" ? blogStore.siteConfig.articleCover : coverSrc;
};

watch(
  () => pageQuery.value.current,
  () => {
    getArticleList(pageQuery.value)
      .then(({ data }) => {
        articleList.value = data.data.recordList;
        count.value = data.data.count;
      })
      .catch(() => {
        articleList.value = [];
      });
  }
);

onMounted(async () => {
  await getArticleList(pageQuery.value)
    .then(({ data }) => {
      articleList.value = data.data.recordList;
      count.value = data.data.count;
      if (count.value > 0) {
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

.article-item {
  @include mixin.hover-card;
  display: flex;
  height: 14rem;
  margin: 0.625rem 0.5rem;
  border-radius: 0.625rem;
  animation-duration: 0.5s;
  transition: all 0.2s ease-in-out 0s;
  overflow: hidden;

  &:hover .cover {
    transform: scale(1.05) rotate(1deg);
  }

  // 双数样式
  &:nth-child(even) {
    flex-direction: row-reverse;

    .article-cover {
      height: 100%;
      margin-right: auto;
      margin-left: 1.5rem;
      clip-path: polygon(0 0, 100% 0, 100% 100%, 8% 100%);
      border-radius: 0 0.625rem 0.625rem 0;
    }

    .article-info {
      padding: 1rem 0 3rem 1.5rem;

      .article-time {
        justify-content: flex-start;
      }
    }

    .article-footer {
      right: 0;
      flex-direction: row-reverse;
    }

    .article-btn {
      left: 0;
      right: auto;
      border-radius: 0 1rem 0 0.625rem;
      background-image: linear-gradient(
        to right,
        var(--color-orange) 0,
        var(--color-pink) 100%
      );
    }
  }
}

.article-cover {
  width: 50%;
  height: 100%;
  margin-right: 1.5rem;
  clip-path: polygon(0 0, 92% 0, 100% 100%, 0 100%);
  border-radius: 0.625rem 0 0 0.625rem;
}

.article-info {
  position: relative;
  width: 50%;
  overflow: hidden;
  padding: 1rem 1.5rem 3rem 0;

  .article-time {
    display: flex;
    justify-content: flex-end;
    font-size: 0.8rem;
    color: var(--grey-5);

    .top {
      color: var(--color-orange);
      min-width: 3.5rem;
      margin-right: 0.5rem;
    }

    .article-tag-category {
      display: flex;
      align-items: center;
    }
  }

  .article-title {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    margin: 0.625rem 0;
    color: var(--primary-color);
  }

  .article-content {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    max-height: 5rem;
    font-size: 0.875em;
    overflow: hidden;
  }
}

.article-footer {
  position: absolute;
  bottom: 0.5rem;
  font-size: 0.8125em;
  display: flex;
  color: var(--grey-5);

  .create-time,
  .article-category {
    margin: 0 0.5rem;
  }

  .svg-icon {
    margin-right: 0.15rem;
  }
}

.article-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 0.3rem 1rem;
  border-radius: 1rem 0 0.625rem 0;
  color: var(--grey-0);
  background-image: linear-gradient(
    to right,
    var(--color-pink) 0,
    var(--color-orange) 100%
  );
  transition: scale 0.2s ease-in-out;

  &:hover {
    scale: 1.15 1.15;
    color: var(--grey-4);
  }
}

a {
  transition: color 0.2s ease-in-out;

  &:hover {
    color: var(--primary-color-darker);
  }
}

@media (max-width: 767px) {
  .article-item {
    flex-direction: column;
    height: fit-content;

    .article-cover {
      width: 100%;
      height: 10rem;
      margin: auto;
      clip-path: polygon(0 0, 100% 0, 100% 92%, 0 100%);
      border-radius: 0.625rem 0.625rem 0 0;
    }

    .article-info {
      width: 100%;
      height: 14rem;
      padding: 0 1rem 3rem;
    }

    &:nth-child(even) {
      flex-direction: column;

      .article-cover {
        width: 100%;
        height: 10rem;
        margin: auto;
        clip-path: polygon(0 0, 100% 0, 100% 100%, 0 92%);
        border-radius: 0.625rem 0.625rem 0 0;
      }

      .article-info {
        padding: 0 1rem 3rem;
      }
    }
  }
}
</style>
