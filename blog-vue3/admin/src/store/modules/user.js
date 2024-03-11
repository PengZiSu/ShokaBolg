import { login, getAdminUserInfo, logout } from "@/api/login";
import { defineStore } from "pinia";
import { getToken, removeToken, setToken } from "@/utils/token";
import defAva from "@/assets/images/defaultAvatar.jpg";

const useUserStore = defineStore("useUserStore", {
  state: () => ({
    token: getToken(),
    id: null,
    avatar: "",
    roles: [],
    permissions: [],
  }),

  actions: {
    /** 登录 */
    login(loginForm) {
      return new Promise((resolve, reject) => {
        login(loginForm)
          .then(({ data }) => {
            setToken(data.data);
            this.token = data.data;
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    /** 获取后台用户信息 */
    getAdminUserInfo() {
      return new Promise((resolve, reject) => {
        getAdminUserInfo()
          .then(({ data }) => {
            const userInfo = data.data;
            this.id = userInfo.id;
            this.avatar =
              userInfo.avatar === "" || userInfo.avatar === null
                ? defAva
                : userInfo.avatar;
            this.roles = userInfo.roleList;
            this.permissions = userInfo.permissionList;
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    /** 注销登录 */
    logout() {
      return new Promise((resolve, reject) => {
        logout()
          .then(() => {
            this.id = null;
            this.token = "";
            this.avatar = "";
            this.roles = [];
            this.permissions = [];
            removeToken();
            resolve(null);
          })
          .catch((error) => {
            this.id = null;
            this.token = "";
            this.avatar = "";
            this.roles = [];
            this.permissions = [];
            removeToken();
            reject(error);
          });
      });
    },
  },
  getters: {},
});

export default useUserStore;
