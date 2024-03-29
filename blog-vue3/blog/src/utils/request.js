import axios from "axios";
import useStore from "@/store";
import { modal } from "@/utils/modal";
import { getToken, token_prefix } from "@/utils/token";
import { errorCode } from "@/utils/errorCode";

// 创建axios实例
const requests = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // 超时
  timeout: 10000,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});

const isLocal = import.meta.env.VITE_START_MODE === "LOCAL";

// 请求拦截器
requests.interceptors.request.use(
  (config) => {
    if (isLocal) {
      return new Promise(() => {});
    }
    // 是否需要设置token
    const isToken = (config.headers || {}).isToken === false;
    if (getToken() && !isToken) {
      config.headers["Authorization"] = token_prefix + getToken();
    }
    return config;
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  }
);

// 响应拦截器
requests.interceptors.response.use(
  (response) => {
    // 未设置状态码则默认成功状态
    const code = response.data.code || 200;
    // 获取错误信息
    const message =
      response.data.msg || errorCode[code] || errorCode["default"];

    if (code === 401) {
      const { userStore } = useStore();
      userStore.forceLogout();
      modal.msgError("无效的会话，或者会话已过期，请重新登录。");
      return Promise.reject("无效的会话，或者会话已过期，请重新登录。");
    } else if (code != 200) {
      modal.msgError(message);
      return Promise.reject(message);
    } else {
      return Promise.resolve(response);
    }
  },
  (error) => {
    let { message } = error;
    if (message === "Network Error") {
      modal.msgError("后端接口连接异常");
    } else if (message.includes("timeout")) {
      modal.msgError("系统接口请求超时");
    }
    return Promise.reject(error);
  }
);

export default requests;
