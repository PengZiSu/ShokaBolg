<!--
 * @description 首页侧边栏最近评论
 * @author sulinye
 * @date 2024/3/2 17:05
-->
<template>
  <div class="side-card" v-if="!useAppStore().local">
    <div class="card-title">
      <svg-icon icon-class="comment" size="1.1875rem" />
      最新评论
    </div>
    <load-viewer
      :status="status"
      no-data-msg="暂时还没有评论哦~"
      failed-msg="评论加载失败"
    >
      <template #data>
        <div
          class="comment-item"
          v-for="comment in commentList"
          :key="comment.id"
        >
          <n-avatar
            class="comment-avatar"
            circle
            :size="55"
            :src="comment.avatar"
            alt=""
          />
          <div class="comment-content">
            <div class="info">
              <div class="nickname">{{ comment.nickname }}</div>
              <div>{{ formatDate(comment.createTime) }}</div>
            </div>
            <n-ellipsis class="content" :line-clamp="2">
              <span v-html="comment.commentContent" />
            </n-ellipsis>
          </div>
        </div>
      </template>
      <template #loading>
        <div v-for="item in [1, 2, 3, 4, 5]" :key="item">
          <div class="comment-item">
            <n-skeleton circle width="55px" />
            <div class="comment-content">
              <div class="info">
                <n-skeleton class="mb5" text width="5rem" height="0.8rem" />
                <n-skeleton class="mb8" width="2rem" />
              </div>
              <n-skeleton class="content" />
            </div>
          </div>
        </div>
      </template>
    </load-viewer>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getRecentComments } from "@/api/comment";
import { formatDate } from "@/utils/date";
import useAppStore from "@/store/modules/app";

const commentList = ref([]);
const status = ref(0);

onMounted(() => {
  getRecentComments()
    .then(({ data }) => {
      commentList.value = data.data;
      if (commentList.value.length > 0) {
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
.comment-item {
  display: flex;
  align-items: center;
  padding: 0.375rem 0 0.375rem 0.25rem;

  .comment-avatar {
    transition: transform 0.3s ease-in-out;
  }

  &:hover {
    .nickname {
      color: var(--primary-color);
    }

    .comment-avatar {
      transform: scale(1.05) rotate(5deg);
    }
  }
}

.comment-content {
  width: calc(100% - 4.2rem);
  padding-left: 0.625rem;
  display: flex;
  flex-direction: column;

  .nickname {
    font-size: 0.9rem;
    transition: color 0.3s ease-in-out;
  }

  .info {
    font-size: 0.5rem;
    line-height: 1rem;
    color: var(--grey-6);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :deep(.content) {
    line-height: 1.5;
  }
}
</style>
