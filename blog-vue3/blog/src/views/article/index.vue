<!--
 * @description 文章页面
 * @author juliy
 * @date 2023/4/1 16:03
-->

<template>
  <div class="page-header">
    <div class="page-title">
      <h1 class="article-title">{{ article.articleTitle }}</h1>
      <div class="article-time" v-if="status === 1">
        <div class="first-meta">
          <span class="meta-item">
            <svg-icon icon-class="calendar" style="margin-right: 0.15rem" />
            <span class="text"
              >发表于 {{ formatDate(article.createTime) }}</span
            >
          </span>
          <span class="meta-item" v-if="article.updateTime && !appStore.local">
            <svg-icon icon-class="update" style="margin-right: 0.15rem" />
            <span class="text"
              >更新于 {{ formatDate(article.updateTime) }}</span
            >
          </span>
          <span class="meta-item" v-if="!appStore.local">
            <svg-icon icon-class="eye" style="margin-right: 0.15rem" />
            <span class="text">阅读量 {{ article.viewCount }}</span>
          </span>
        </div>
        <div class="second-meta">
          <span class="meta-item">
            <svg-icon icon-class="edit" style="margin-right: 0.15rem" />
            <span class="text">字数统计： {{ formatWordNum(wordNum) }}字</span>
          </span>
          <span class="meta-item">
            <svg-icon icon-class="clock" style="margin-right: 0.15rem" />
            <span class="text">预计阅读时长： {{ readTime }} 分钟</span>
          </span>
          <span class="meta-item">
            <svg-icon icon-class="category" style="margin-right: 0.15rem" />
            {{ article.category.categoryName }}
          </span>
        </div>
      </div>
    </div>
    <img
      class="page-cover"
      :src="setArticleCover(article.articleCover)"
      alt=""
    />
    <Waves />
  </div>
  <div class="bg">
    <load-viewer :status="status">
      <template #data>
        <div class="main-container">
          <div
            class="left-container"
            :class="!appStore.rightContainer ? 'width-100' : ''"
          >
            <div class="article-container">
              <v-md-preview
                ref="articleRef"
                v-viewer
                class="md"
                :text="article.articleContent"
              />
              <div class="tag-container">
                <router-link
                  :to="`/tag/${tag.id}`"
                  v-for="tag in article.tagList"
                  class="article-tag-category"
                  :key="tag.id"
                >
                  <n-ellipsis style="max-width: 8rem">
                    <svg-icon icon-class="tag" size="0.8rem" />
                    {{ tag.tagName }}
                  </n-ellipsis>
                </router-link>
              </div>

              <footer class="article-footer" v-if="!appStore.local">
                <div class="meta">阅读次数 {{ article.viewCount }} 次</div>
                <div class="like" v-if="!appStore.local">
                  <n-button
                    class="like-btn"
                    :class="isLike(article.id)"
                    @click="like()"
                  >
                    <svg-icon
                      icon-class="like"
                      size="0.9rem"
                      style="margin-right: 0.5rem"
                    />
                    点赞
                    {{ article.likeCount }}
                  </n-button>
                  <p>觉得本篇文章还不错的话，就点个赞叭(●'◡'●)</p>
                </div>
                <div class="copyright">
                  <ul>
                    <li class="author">
                      <svg-icon
                        icon-class="author"
                        size="0.9rem"
                        style="margin-right: 0.3rem"
                      ></svg-icon>
                      <strong>本文作者： </strong
                      >{{ blogStore.siteConfig.siteAuthor }}
                    </li>
                    <li class="link">
                      <svg-icon
                        icon-class="article_link"
                        size="0.9rem"
                        style="margin-right: 0.3rem"
                      ></svg-icon>
                      <strong>本文链接：</strong>
                      <a class="underline-a" :href="articleHref">{{
                        articleHref
                      }}</a>
                    </li>
                    <li class="license">
                      <svg-icon
                        icon-class="article_share"
                        size="0.8rem"
                        style="margin-right: 0.3rem"
                      ></svg-icon>
                      <strong>版权声明： </strong>
                      本站所有文章除特别声明外，均采用
                      <a
                        class="underline-a"
                        href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh"
                        target="_blank"
                      >
                        BY-NC-SA
                      </a>
                      许可协议。转载请注明文章出处！
                    </li>
                  </ul>
                </div>
              </footer>
              <div class="article-nav">
                <div class="nav-item">
                  <router-link
                    v-if="article.lastArticle"
                    :to="`/article/${article.lastArticle.id}`"
                    class="nav-cover"
                    :style="{
                      'background-image':
                        'url(' +
                        setArticleCover(article.lastArticle.articleCover) +
                        ')',
                    }"
                  >
                    <span class="nav-action">上一篇</span>
                    <h3 class="nav-title">
                      {{ article.lastArticle.articleTitle }}
                    </h3>
                  </router-link>
                  <div v-else class="nav-cover">
                    <span class="nav-action">上一篇</span>
                    <h3 class="nav-title">没有了</h3>
                  </div>
                </div>
                <div class="nav-item">
                  <router-link
                    v-if="article.nextArticle"
                    :to="`/article/${article.nextArticle.id}`"
                    class="nav-cover"
                    :style="{
                      'background-image':
                        'url(' +
                        setArticleCover(article.nextArticle.articleCover) +
                        ')',
                    }"
                  >
                    <span class="nav-action">下一篇</span>
                    <h3 class="nav-title">
                      {{ article.nextArticle.articleTitle }}
                    </h3>
                  </router-link>
                  <div v-else class="nav-cover">
                    <span class="nav-action">下一篇</span>
                    <h3 class="nav-title">没有了</h3>
                  </div>
                </div>
              </div>
              <Comment :comment-type="commentType" />
            </div>
          </div>
          <div
            class="right-container"
            :class="!appStore.rightContainer ? 'display-none' : ''"
          >
            <div class="side-card">
              <catalog :dom-ref="articleRef" />
            </div>
          </div>
        </div>
      </template>
      <template #loading>
        <n-space justify="start" vertical style="margin: 1rem">
          <n-skeleton round size="large" width="40%" />
          <n-skeleton text round width="100%" :repeat="10" />
        </n-space>
      </template>
      <template #fail>
        <n-space justify="center" align="center" style="height: 30vh">
          <n-gradient-text type="error" size="30" style="font-weight: bold">
            文章加载失败
          </n-gradient-text>
        </n-space>
      </template>
    </load-viewer>
  </div>
</template>

<script setup>
import { ref } from "vue";
import useStore from "@/store";
import { likeArticle, getArticle } from "@/api/article";
import { formatDate } from "@/utils/date";
import { modal } from "@/utils/modal";

const status = ref(0);
const articleHref = window.location.href;
const route = useRoute();
const { userStore, blogStore, appStore } = useStore();
const articleRef = ref();
const wordNum = ref(0);
const readTime = ref(0);
const commentType = 1;
const article = ref({
  id: 0,
  articleCover: "",
  articleTitle: "",
  articleContent: "",
  articleType: 0,
  viewCount: 0,
  likeCount: 0,
  category: {},
  tagList: [],
  createTime: "",
  lastArticle: {},
  nextArticle: {},
  updateTime: "",
});

const isLike = computed(
  () => (id) => userStore.articleLikeSet.indexOf(id) === -1 ? "" : "active"
);

const setArticleCover = (coverSrc) => {
  return coverSrc === "" ? blogStore.siteConfig.articleCover : coverSrc;
};

/**
 * 格式化总字数
 * @param value 字数
 */
const formatWordNum = (value) => {
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + "k";
  } else {
    return value;
  }
};

/**
 * 删除html标签
 * @param content 内容
 */
const deleteHTMLTag = (content) => {
  return content
    .replace(/<\/?[^>]*>/g, "")
    .replace(/[|]*\n/, "")
    .replace(/&npsp;/gi, "");
};

const like = () => {
  if (!userStore.id) {
    modal.msgError("请先登录！");
    return;
  }
  let articleId = article.value.id;
  likeArticle(articleId)
    .then(() => {
      if (userStore.articleLikeSet.indexOf(articleId) !== -1) {
        article.value.likeCount -= 1;
      } else {
        article.value.likeCount += 1;
      }
      userStore.articleLike(articleId);
    })
    .catch(() => {});
};

onMounted(() => {
  getArticle(Number(route.params.id))
    .then(({ data }) => {
      article.value = data.data;
      document.title = article.value.articleTitle;
      wordNum.value = deleteHTMLTag(article.value.articleContent).length;
      readTime.value = Math.round(wordNum.value / 400);
      status.value = 1;
    })
    .catch(() => {
      status.value = -1;
      article.value.createTime = "2023-1-1";
      article.value.articleTitle = "文章";
      article.value.category = {
        id: 0,
        categoryName: "分类",
      };
      wordNum.value = 0;
      readTime.value = 0;
    });
});
</script>
<style lang="scss" scoped>
@use "@/assets/styles/mixin";

.article-title {
  font-weight: 500;
  font-size: 2.5rem;
  letter-spacing: 0.125rem;
  text-align: center;
  color: var(--header-text-color);
}

.article-time {
  @include mixin.flex;

  flex-direction: column;
  font-size: 0.875rem;

  .svg-icon {
    vertical-align: -0.2rem;
  }

  .meta-item:not(:first-child) {
    margin-left: 0.8rem;
  }
}

.article-container {
  @include mixin.can-select;
}

.article-nav {
  margin: 0 2rem;
}

.extra {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0.625rem 0 0.625rem;
  width: 100%;
}

.tag-container {
  @include mixin.none-select;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 0 2.5rem 0 2.5rem;
}

.article-footer {
  @include mixin.none-select;
  margin: 0 2.5rem 0 2.5rem;

  &::before {
    content: "";
    width: 100%;
    height: 0.0625rem;
    background: var(--grey-3);
    display: block;
    margin: 1rem auto 0;
  }

  .meta {
    color: var(--grey-5);
    font-size: 0.75em;
    text-align: right;
  }

  .like {
    margin: 1.25rem auto;
    padding: 0.625rem 0;
    text-align: center;

    button {
      background: #999;
      border-radius: 0.5rem;
      color: var(--grey-0);
    }

    p {
      font-size: 0.8125em;
      color: var(--grey-5);
      margin: 0;
    }

    .active {
      background-color: var(--primary-color);
    }
  }

  .copyright {
    background: var(--grey-2);
    padding: 1rem 2rem;
    position: relative;
    font-size: 0.75em;
    border-radius: 0.625rem;
    color: var(--grey-6);
  }
}

.article-nav {
  @include mixin.none-select;
  display: flex;
  border-radius: 0.625rem;
  overflow: hidden;
  margin: 2.5rem;

  .nav-item {
    width: 50%;
  }

  .nav-cover {
    display: flex;
    flex-direction: column;
    color: var(--header-text-color);
    padding: 1.25rem 2.5rem;
    background-size: cover;
    animation: blur 0.8s ease-in-out forwards;

    &:before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #434343, #000);
      opacity: 0.5;
      transition: all 0.2s ease-in-out 0s;
      z-index: -1;
      top: 0;
      left: 0;
    }
  }

  .nav-action {
    font-size: 0.8125rem;
  }
}

.nav-cover:hover::before {
  opacity: 0.3;
}

@media (max-width: 767px) {
  .tag-container,
  .article-footer,
  .article-nav,
  .comment-container {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }

  .article-nav {
    flex-direction: column;

    .nav-item {
      width: 100%;
    }
  }
}
</style>
