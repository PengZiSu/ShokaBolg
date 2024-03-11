import { defineStore } from "pinia";

const useBlogStore = defineStore("useBlogStore", {
  state: () => ({
    status: 0,
    articleCount: 0,
    categoryCount: 0,
    tagCount: 0,
    viewCount: 0,
    siteConfig: {},
  }),

  actions: {
    /**
     * 设置网站基本信息
     * @param blogInfo 博客信息
     */
    setBlogInfo(blogInfo) {
      this.articleCount = blogInfo.articleCount;
      this.categoryCount = blogInfo.categoryCount;
      this.tagCount = blogInfo.tagCount;
      this.viewCount = blogInfo.viewCount;
      this.siteConfig = blogInfo.siteConfig;
    },

    /**
     * 设置数据状态
     * @param status 数据状态
     */
    setStatus(status) {
      this.status = status;
    },
  },
  getters: {},
  persist: {
    enabled: true,
    strategies: [{ storage: sessionStorage }],
  },
});

export default useBlogStore;
