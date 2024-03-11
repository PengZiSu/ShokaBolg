import { removeToken, setToken } from "@/utils/token";
import { defineStore } from "pinia";
import { modal } from "@/utils/modal";
import { login, getUserInfo, logout } from "@/api/login";

const useUserStore = defineStore("useUserStore", {
  state: () => ({
    id: undefined,
    avatar: "",
    nickname: "",
    email: "",
    username: "",
    webSite: "",
    intro: "",
    loginType: undefined,
    path: "",
    articleLikeSet: [],
    commentLikeSet: [],
    talkLikeSet: [],
  }),

  actions: {
    /**
     * 登录
     */
    login(loginForm) {
      return new Promise((resolve, reject) => {
        login(loginForm)
          .then(({ data }) => {
            setToken(data.data);
            this.getUserInfo().then(() => {
              modal.msgSuccess("登录成功");
            });
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    /**
     * 获取用户信息
     */
    getUserInfo() {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then(({ data }) => {
            this.id = data.data.id;
            this.avatar = data.data.avatar;
            this.nickname = data.data.nickname;
            this.email = data.data.email;
            this.username = data.data.username;
            this.webSite = data.data.webSite;
            this.intro = data.data.intro;
            this.loginType = data.data.loginType;
            this.articleLikeSet = data.data.articleLikeSet;
            this.commentLikeSet = data.data.commentLikeSet;
            this.talkLikeSet = data.data.talkLikeSet;
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    /**
     * 更新用户信息
     * @param userInfo 用户信息
     */
    updateUserInfo(userInfo) {
      this.nickname = userInfo.nickname;
      this.webSite = userInfo.webSite;
      this.intro = userInfo.intro;
    },

    /**
     * 注销登录
     */
    logout() {
      return new Promise((resolve, reject) => {
        logout()
          .then(() => {
            this.$reset();
            removeToken();
            resolve(null);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    /**
     * 强制注销登录
     */
    forceLogout() {
      this.$reset();
      removeToken();
    },

    /**
     * 点赞文章
     * @param articleId 文章id
     */
    articleLike(articleId) {
      let index = this.articleLikeSet.indexOf(articleId);
      if (index != -1) {
        this.articleLikeSet.splice(index, 1);
      } else {
        this.articleLikeSet.push(articleId);
      }
    },

    /**
     * 点赞评论
     * @param commentId 评论id
     */
    commentLike(commentId) {
      let index = this.commentLikeSet.indexOf(commentId);
      if (index != -1) {
        this.commentLikeSet.splice(index, 1);
      } else {
        this.commentLikeSet.push(commentId);
      }
    },

    /**
     * 点赞说说
     * @param talkId 说说id
     */
    talkLike(talkId) {
      let index = this.talkLikeSet.indexOf(talkId);
      if (index != -1) {
        this.talkLikeSet.splice(index, 1);
      } else {
        this.talkLikeSet.push(talkId);
      }
    },
  },
  getters: {},
  persist: {
    enabled: true,
    strategies: [{ storage: localStorage }],
  },
});

export default useUserStore;
