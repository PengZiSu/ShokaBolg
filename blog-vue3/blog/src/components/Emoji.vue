<!--
 * @description emoji组件
 * @author sulinye
 * @date 2024/3/2 9:02
-->

<template>
  <n-popover
    trigger="click"
    placement="bottom-start"
    style="max-height: 200px"
    content-style="padding: 0.5rem;"
    :width="250"
    scrollable
  >
    <template #trigger>
      <span><svg-icon icon-class="emoji" size="1.2rem"></svg-icon></span>
    </template>
    <div class="emoji-content">
      <span
        class="emoji-item"
        v-for="(value, key, index) of emojiList"
        :key="index"
        @click="addEmoji(key)"
      >
        <img
          :src="value"
          :title="key"
          class="emoji"
          width="24"
          height="24"
          alt=""
        />
      </span>
    </div>
  </n-popover>
</template>

<script setup>
import emojiList from "@/utils/emoji";

const emit = defineEmits(["addEmoji"]);
const addEmoji = (key) => {
  emit("addEmoji", key);
};
</script>
<style lang="scss" scoped>
.emoji-item {
  cursor: pointer;
  display: inline-block;

  .emoji {
    user-select: none;
    margin: 0.25rem;
    display: inline-block;
    vertical-align: middle;
  }

  &:hover {
    transition: all 0.2s;
    border-radius: 0.25rem;
    background: #dddddd;
  }
}
</style>
