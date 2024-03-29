<!--
 * @description 说说页面
 * @author sulinye
 * @date 2024/3/2 16:04   
-->

<template>
  <div class="page-header">
    <h1 class="page-title">说说</h1>
    <img class="page-cover" :src="bgImage" alt="" />
    <waves />
  </div>
  <div class="bg">
    <div class="page-container">
      <load-viewer
        :status="status"
        no-data-msg="暂时还没有发布过说说哦"
        failed-msg="说说加载失败"
      >
        <template #data>
          <router-link
            :to="`/talk/${talk.id}`"
            class="talk-item"
            v-animate="['slideUpBigIn']"
            v-for="talk in talkList"
            :key="talk.id"
          >
            <div class="talk-meta">
              <n-avatar size="large" round :src="talk.avatar" />
              <div class="talk-info">
                <span class="talk-nickname ml10">
                  {{ talk.nickname }}
                  <svg-icon icon-class="badge" class="ml5" />
                </span>
                <span class="talk-time ml10">{{
                  formatDateTime(talk.createTime)
                }}</span>
              </div>
            </div>
            <div class="talk-content" v-html="talk.talkContent" />
            <div class="talk-image">
              <n-image
                class="image"
                v-for="(img, index) in talk.imgList"
                :key="index"
                :src="img"
                object-fit="cover"
                :img-props="{ style: { height: '100%', width: '100%' } }"
                @click.prevent
              />
            </div>
            <div class="info mt5">
              <span class="talk-like info mr10">
                <svg-icon icon-class="like" size="0.8rem" class="mr5" />
                {{ talk.likeCount }}
              </span>
              <span class="talk-comment info">
                <svg-icon icon-class="comment" size="0.9rem" class="mr5" />
                {{ talk.commentCount }}
              </span>
            </div>
          </router-link>
          <div class="loading-warp" v-if="talkList && count > talkList.length">
            <n-button class="btn" color="#e9546b" @click="getList">
              加载更多...
            </n-button>
          </div>
        </template>
        <template #loading>
          <n-card
            hoverable
            class="mb30"
            v-for="index in [1, 2, 3, 4, 5]"
            :key="index"
          >
            <n-space justify="start" align="center">
              <n-skeleton circle size="large" />
              <div>
                <n-skeleton round text style="width: 4rem" />
                <n-skeleton round style="width: 6rem" />
              </div>
            </n-space>
            <n-skeleton class="mt10" text round />
            <n-skeleton round />
          </n-card>
        </template>
      </load-viewer>
    </div>
  </div>
</template>

<script setup>
import { getTalkList } from "@/api/talk";
import { ref } from "vue";
import { formatDateTime } from "@/utils/date";
import { getRandomBgImage } from "@/utils/common";

const bgImage = getRandomBgImage();
const count = ref(0);
const status = ref(0);
const talkList = ref([]);
const pageQuery = ref({
  current: 1,
  size: 5,
});

const getList = () => {
  getTalkList(pageQuery.value)
    .then(({ data }) => {
      if (pageQuery.value.current == 1) {
        talkList.value = data.data.recordList;
      } else {
        talkList.value.push(...data.data.recordList);
      }
      pageQuery.value.current++;
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
};

onMounted(() => {
  getList();
});
</script>
<style lang="scss" scoped>
.talk-item {
  display: flex;
  flex-direction: column;
  padding: 1rem 1.25rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.625rem 1.875rem -0.9375rem var(--shadow-color);
  animation-duration: 0.5s;
  transition: all 0.2s ease-in-out 0s;
  visibility: hidden;

  &:hover {
    box-shadow: 0 0 2rem var(--shadow-color);
  }

  &:not(:first-child) {
    margin-top: 1.25rem;
  }
}

.talk-meta {
  display: flex;
  align-items: center;
  width: 100%;
}

.talk-info {
  display: flex;
  flex-direction: column;
  margin-left: 0.5rem;
}

.info {
  display: flex;
  align-items: center;
}
</style>
