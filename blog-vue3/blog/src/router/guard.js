import router from "@/router";
import useStore from "@/store";

router.beforeEach(async (to, from, next) => {
  const { appStore } = useStore();
  if (to.name === "home") {
    appStore.headerChangeHeight = 700;
    document.title = "baby-su";
  } else {
    appStore.headerChangeHeight = 480;
  }
  appStore.startLoading();
  next();
});

router.afterEach(() => {
  const { appStore } = useStore();
  appStore.endLoading();
});
