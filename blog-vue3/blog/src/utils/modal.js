export const modal = {
  msgInfo: (message) => {
    window.$message?.info(message);
  },

  msgError: (message) => {
    window.$message?.error(message);
  },

  msgSuccess: (message) => {
    window.$message?.success(message);
  },

  msgWarning: (message) => {
    window.$message?.warning(message);
  },

  notifyInfo: (message) => {
    window.$notification?.info({
      title: "提示",
      content: message,
    });
  },

  notifyError: (message) => {
    window.$notification?.error({
      title: "错误",
      content: message,
    });
  },

  notifySuccess: (message) => {
    window.$notification?.success({
      title: "成功",
      content: message,
    });
  },

  notifyWarning: (message) => {
    window.$notification?.warning({
      title: "警告",
      content: message,
    });
  },
};
