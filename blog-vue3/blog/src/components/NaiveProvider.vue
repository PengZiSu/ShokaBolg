<!--
 * @description naive provider
 * @author sulinye
 * @date 2024/3/2 11:14
-->

<template>
  <n-config-provider
    inline-theme-disabled
    :theme="setTheme"
    :theme-overrides="themeOverrides"
  >
    <n-dialog-provider>
      <n-notification-provider>
        <n-message-provider>
          <slot></slot>
          <naive-provider-content />
        </n-message-provider>
      </n-notification-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script setup>
import { darkTheme, useDialog, useMessage, useNotification } from "naive-ui";
import { useDark } from "@vueuse/core";

const isDark = useDark();

const setTheme = computed(() => (isDark.value ? darkTheme : null));

const themeOverrides = {
  common: {
    primaryColorHover: "var(--primary-color)",
    primaryColorPressed: "var(--primary-color-darker)",
  },
  Button: {
    textColorText: "var(--text-color)",
    rippleColor: "var(--primary-color)",
  },
};

/**
 * 注册弹窗等组件
 */
const registerNaiveTools = () => {
  window.$dialog = useDialog();
  window.$message = useMessage();
  window.$notification = useNotification();
};

const NaiveProviderContent = defineComponent({
  name: "NaiveProviderContent",
  setup() {
    registerNaiveTools();
  },
  render() {
    return null;
  },
});
</script>
<style lang="scss" scoped></style>
