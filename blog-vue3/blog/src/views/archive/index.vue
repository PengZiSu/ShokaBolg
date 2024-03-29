<!--
 * @description 文章归档
 * @author sulinye
 * @date 2024/3/2 16:24
-->

<template>
  <div class="page-header">
    <h1 class="page-title">归档</h1>
    <img class="page-cover" :src="bgImage" alt="" />
    <waves />
  </div>
  <div class="bg">
    <div class="page-container">
      <load-viewer
        :status="status"
        no-data-msg="暂时还没有发布过文章哦~"
        failed-msg="文章加载失败"
      >
        <template #data>
          <div class="archive-title">文章总览 - {{ count }}</div>
          <div class="archive-list">
            <div
              class="archive-item"
              v-for="archive in archivesList"
              :key="archive.id"
            >
              <router-link
                id="image"
                class="article-cover"
                :to="`/article/${archive.id}`"
              >
                <n-image
                  class="cover"
                  lazy
                  :intersection-observer-options="{ root: '#footer-wrapper' }"
                  :src="archive.articleCover"
                  preview-disabled
                />
              </router-link>
              <div class="article-info">
                <div class="article-time">
                  <svg-icon icon-class="calendar" class="mr5" />
                  <time>{{ formatDate(archive.createTime) }}</time>
                </div>
                <router-link
                  class="article-title"
                  :to="`/article/${archive.id}`"
                >
                  {{ archive.articleTitle }}
                </router-link>
              </div>
            </div>
          </div>
          <pagination
            v-if="count > 0"
            v-model:current="queryParams.current"
            :total="Math.ceil(count / 5)"
          />
        </template>
        <template #loading> </template>
      </load-viewer>
    </div>
  </div>
</template>

<script setup>
import { getArchiveList } from "@/api/archives";
import { formatDate } from "@/utils/date";
import { ref } from "vue";
import { getRandomBgImage } from "@/utils/common";

const bgImage = getRandomBgImage();
const count = ref(0);
const status = ref(0);
const queryParams = ref({
  current: 1,
  size: 5,
});
const archivesList = ref([]);

watch(
  () => queryParams.value.current,
  () => {
    getArchiveList(queryParams.value).then(({ data }) => {
      archivesList.value = data.data.recordList;
      count.value = data.data.count;
    });
  }
);

onMounted(() => {
  getArchiveList(queryParams.value)
    .then(({ data }) => {
      archivesList.value = data.data.recordList;
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
.archive-title {
  position: relative;
  margin-left: 0.625rem;
  padding-bottom: 1.25rem;
  padding-left: 1.25rem;
  font-size: 1.5rem;

  &::before {
    position: absolute;
    top: 1rem;
    left: -0.5rem;
    z-index: 1;
    width: 1.125rem;
    height: 1.125rem;
    border: 0.3125rem solid var(--color-blue);
    border-radius: 0.625rem;
    content: "";
    line-height: 0.625rem;
    transition: all 0.2s ease-in-out 0s;
  }

  &::after {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 0;
    width: 0.125rem;
    height: 1.5em;
    background: #aadafa;
    content: "";
  }

  &:hover::before {
    border-color: var(--color-orange);
  }
}

.archive-list {
  margin-left: 0.625rem;
  padding-left: 1.25rem;
  border-left: 0.125rem solid #aadafa;
}

.archive-item {
  position: relative;
  display: flex;
  align-items: center;
  margin: 0 0 1.25rem 0.625rem;

  // 前边的圆圈
  &::before {
    position: absolute;
    left: -2.25rem;
    width: 0.625rem;
    height: 0.625rem;
    border: 0.1875rem solid var(--color-blue);
    border-radius: 0.375rem;
    background: var(--grey-0);
    content: "";
    transition: all 0.2s ease-in-out 0s;
  }

  &:hover::before {
    border-color: var(--color-orange);
  }
}

.article-cover {
  width: 7.5rem;
  height: 120px;
  overflow: hidden;
  border-radius: 0.75rem;

  .cover {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s;

    &:hover {
      transform: scale(1.1);
    }
  }
}

.article-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 0 1rem;

  .article-time {
    font-size: 0.875rem;
  }

  .article-title {
    font-size: 0.9rem;
    margin: 0.125rem 0;
    transition: transform 0.2s ease-in-out 0s;

    &:hover {
      color: var(--primary-color);
      transform: translateX(0.625rem);
    }
  }
}
</style>
