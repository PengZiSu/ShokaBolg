import useAppStore from "./modules/app";
import useBlogStore from "@/store/modules/blog";
import useUserStore from "@/store/modules/user";
import useLocalStore from "@/store/modules/local";

const useStore = () => ({
  appStore: useAppStore(),
  blogStore: useBlogStore(),
  userStore: useUserStore(),
  localStore: useLocalStore(),
});

export default useStore;
