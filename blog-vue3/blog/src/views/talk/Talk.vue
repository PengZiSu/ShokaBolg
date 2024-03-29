<!--
 * @description 说说详情
 * @author sulinye
 * @date 2024/3/3 10:43
-->

<template>
  <div class="page-header">
    <h1 class="page-title">说说</h1>
    <img class="page-cover" :src="bgImage" alt="" />
    <waves />
  </div>
  <div class="bg">
    <div class="page-container">
      <load-viewer :status="status" failed-msg="说说加载失败">
        <template #data>
          <div class="talk-item">
            <div class="talk-meta">
              <n-avatar circle size="large" :src="talk.avatar" />
            </div>
            <div class="talk-content-wrap">
              <div class="talk-info">
                <span class="talk-user-name">
                  {{ talk.nickname }}
                  <svg-icon icon-class="badge" class="ml5" />
                </span>
                <span class="talk-time">{{
                  formatDateTime(talk.createTime)
                }}</span>
              </div>
              <div class="talk-content" v-html="talk.talkContent"></div>
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
              <div class="info mt10">
                <span class="talk-like info" @click="like">
                  <svg-icon
                    icon-class="like"
                    size="0.8rem"
                    class="mr5"
                    :class="isLike(talk.id)"
                  />
                  {{ talk.likeCount }}
                </span>
                <span class="talk-comment info" @click="toComment">
                  <svg-icon icon-class="comment" size="0.9rem" class="mr5" />
                  {{ commentCount == null ? 0 : commentCount }}
                </span>
              </div>
            </div>
          </div>
          <comment
            :comment-type="commentType"
            @get-comment-count="getCommentCount"
          />
        </template>
        <template #loading>
          <n-space justify="start" align="center">
            <n-skeleton circle size="large" />
            <div>
              <n-skeleton round text style="width: 8rem" />
              <n-skeleton round style="width: 12rem" />
            </div>
          </n-space>
          <n-skeleton class="mt30" text round />
          <n-skeleton round text :repeat="2" />
        </template>
      </load-viewer>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { likeTalk, getTalk } from "@/api/talk";
import useStore from "@/store";
import { formatDateTime } from "@/utils/date";
import { modal } from "@/utils/modal";
import { getRandomBgImage } from "@/utils/common";

const bgImage = getRandomBgImage();
const route = useRoute();
const { userStore } = useStore();
const status = ref(0);
const commentCount = ref(0);
const commentType = ref(3);
const talk = ref({
  id: 0,
  nickname: "",
  avatar: "",
  talkContent: "",
  imgList: [],
  isTop: 0,
  likeCount: 0,
  commentCount: 0,
  createTime: "",
});

const isLike = computed(
  () => (id) => userStore.talkLikeSet.indexOf(id) != -1 ? "active" : ""
);

const getCommentCount = (count) => {
  commentCount.value = count;
};

const like = () => {
  if (!userStore.id) {
    modal.msgError("请先登录");
    return;
  }
  let id = talk.value.id;

  likeTalk(id)
    .then(() => {
      if (userStore.talkLikeSet.indexOf(id) != -1) {
        talk.value.likeCount -= 1;
      } else {
        talk.value.likeCount += 1;
      }
      userStore.talkLike(id);
    })
    .catch(() => {});
};

const toComment = () => {
  document.getElementById("comment-container")?.scrollIntoView({
    block: "start",
    inline: "nearest",
    behavior: "smooth",
  });
};

onMounted(() => {
  getTalk(Number(route.params.id))
    .then(({ data }) => {
      talk.value = data.data;
      status.value = 1;
    })
    .catch(() => {
      status.value = -1;
    });
});
</script>
<style lang="scss" scoped>
@import "@/assets/styles/mixin.scss";

.talk-item {
  display: flex;
}

.talk-meta {
  @include flex;
  width: 3rem;
  height: 3.125rem;
}

.talk-content-wrap {
  flex: auto;
  margin-left: 0.5rem;
}

.talk-info {
  display: flex;
  flex-direction: column;
}

.user-avatar {
  width: 100%;
  height: 3rem;
  border-radius: 50%;
}

.info {
  display: flex;
  align-items: center;
}

.talk-like,
.talk-comment {
  cursor: pointer;
}

.talk-like .active {
  color: var(--primary-color);
}
</style>
