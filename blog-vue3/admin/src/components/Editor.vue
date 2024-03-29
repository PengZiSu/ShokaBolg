<!--
 * @description 编辑器
 * @author sulinye
 * @date 17:28
-->

<template>
  <div
    ref="editorRef"
    class="edit-container"
    v-html="content"
    contenteditable
    :placeholder="placeholder"
    @focus="onFocus"
    @blur="onBlur"
    @input="onInput"
  />
</template>

<script setup>
import { getCurrentInstance, reactive, toRefs, watch } from "vue";

const { proxy } = getCurrentInstance();

const emit = defineEmits(["update:text"]);

const editorRef = ref();

const props = defineProps({
  text: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
});

const data = reactive({
  content: props.text,
  focusIn: false,
  range: null,
});

const { content, focusIn, range } = toRefs(data);

watch(
  () => props.text,
  (value) => {
    if (!focusIn.value) {
      content.value = value;
    }
  }
);

const onInput = (e) => {
  emit("update:text", e.target.innerHTML);
};

const onFocus = () => {
  focusIn.value = true;
};

const onBlur = () => {
  //记录光标
  if (window.getSelection) {
    let selection = window.getSelection();
    range.value = selection.getRangeAt(0);
  }
  focusIn.value = false;
};

const clear = () => {
  content.value = "";
  proxy.$el.innerHTML = "";
};

const addText = (emoji) => {
  //还原光标
  if (window.getSelection) {
    let selection = window.getSelection();
    selection.removeAllRanges();
    //为空初始化光标
    if (range.value == null) {
      editorRef.value.focus();
      range.value = selection.getRangeAt(0);
    }
    //删除选中内容
    range.value.deleteContents();
    //添加内容
    range.value.insertNode(range.value.createContextualFragment(emoji));
    range.value.collapse(false);
    selection.addRange(range.value);
    emit("update:text", props.$el.innerHTML);
  }
};

defineExpose({ addText, clear });
</script>
<style lang="scss" scoped>
.edit-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 150px;
  border-radius: 8px;
  background: var(--talkBg);
  font-size: 14px;
  line-height: 1.5;
  padding: 6px 12px;
  box-sizing: border-box;
  overflow: auto;
  word-break: break-all;
  outline: none;
  user-select: text;
  white-space: pre-wrap;
  text-align: left;
}

.edit-container:empty::before {
  cursor: text;
  content: attr(placeholder);
  color: #999;
}
</style>
