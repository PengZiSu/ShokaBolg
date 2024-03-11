<template>
  <div>
    <svg-icon icon-class="github" size="1.2rem" @click="goto"></svg-icon>
  </div>
</template>

<script setup>
const url = import.meta.env.VITE_GITHUB_URL;
const goto = () => {
  window.open(url);
};
</script>
<style lang="scss" scoped></style>
