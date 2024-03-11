import useAppStore from "@/store/modules/app";
import useUserStore from "./modules/user";
import usePermissionStore from "@/store/modules/permission";
import useSettingStore from "@/store/modules/setting";
import useTagStore from "@/store/modules/tag";

const useStore = () => ({
  appStore: useAppStore(),
  userStore: useUserStore(),
  permissionStore: usePermissionStore(),
  settingStore: useSettingStore(),
  tagStore: useTagStore(),
});

export default useStore;
