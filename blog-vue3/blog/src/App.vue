<template>
  <layout />
</template>

<script setup>
import layout from "@/layout/index.vue";
import useStore from "@/store";
import { getBlogInfo, report } from "@/api/blog";

const { blogStore, appStore } = useStore();

const isLocal = import.meta.env.VITE_START_MODE === "LOCAL";

if (isLocal) {
  appStore.setLocalMode();
} else {
  getBlogInfo()
    .then(({ data }) => {
      blogStore.setBlogInfo(data.data);
      blogStore.setStatus(1);
    })
    .catch(() => {
      blogStore.setStatus(-1);
    });
}

onMounted(() => {
  console.log(
    `%c Shoka-Blog${isLocal ? " : LOCAL MODE" : ""} %c By sulinye %c`,
    "background:#e9546b ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff; padding:5px 0;",
    "background:#ec8c69 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #000; padding:5px 0;",
    "background:transparent"
  );

  report().catch(() => {});
});
</script>

<style scoped></style>
