import {
  ElLoading,
  ElMessage,
  ElMessageBox,
  ElNotification,
} from "element-plus";

let loadingInstance;

export const modal = {
  msgInfo: (message) => {
    ElMessage.info(message);
  },

  msgError: (message) => {
    ElMessage.error(message);
  },

  msgSuccess: (message) => {
    ElMessage.success(message);
  },

  msgWarning: (message) => {
    ElMessage.warning(message);
  },

  notifyInfo: (message) => {
    ElNotification({
      title: "提示",
      type: "info",
      message,
    });
  },

  notifyError: (message) => {
    ElNotification({
      title: "错误",
      type: "error",
      message,
    });
  },

  notifySuccess: (message) => {
    ElNotification({
      title: "成功",
      type: "success",
      message,
    });
  },

  notifyWarning: (message) => {
    ElNotification({
      title: "警告",
      type: "warning",
      message,
    });
  },

  messageConfirm: (message) => {
    return ElMessageBox.confirm(message, "系统提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      center: true,
      type: "warning",
      dangerouslyUseHTMLString: true,
    });
  },

  loading: (message) => {
    loadingInstance = ElLoading.service({
      lock: true,
      text: message,
      background: "rgba(0, 0, 0, 0.7)",
    });
  },

  closeLoading: () => {
    loadingInstance.close();
  },
};
