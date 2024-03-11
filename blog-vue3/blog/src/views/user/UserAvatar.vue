<!--
 * @description 用户头像
 * @author juliy
 * @date 21:34
-->

<template>
  <div>
    <n-avatar
      :size="150"
      circle
      :src="userStore.avatar"
      @click="dialogVisible = true"
    />
    <n-modal
      class="bg"
      v-model:show="dialogVisible"
      preset="dialog"
      :show-icon="false"
      transform-origin="center"
      :block-scroll="false"
      :closable="false"
      @after-leave="handleClose"
    >
      <div style="width: 100%; height: 300px">
        <vue-cropper
          ref="cropperRef"
          :img="options.img"
          :info="true"
          :autoCrop="options.autoCrop"
          :autoCropWidth="options.autoCropWidth"
          :autoCropHeight="options.autoCropHeight"
          :fixedBox="options.fixedBox"
          :outputType="options.outputType"
        />
      </div>
      <n-upload
        class="mt30"
        action="#"
        accept="image/*"
        :show-file-list="false"
        :custom-request="customUpload"
      >
        <n-button>点击上传</n-button>
      </n-upload>
      <template #action>
        <n-button color="#3e999f" @click="dialogVisible = false">
          取消
        </n-button>
        <n-button color="#e9546b" @click="uploadAvatar"> 提交 </n-button>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { updateAvatar } from "@/api/user";
import useStore from "@/store";
import { VueCropper } from "vue-cropper";
import "vue-cropper/dist/index.css";

const { userStore } = useStore();
const dialogVisible = ref(false);
const cropperRef = ref();
const options = reactive({
  img: userStore.avatar, // 裁剪图片的地址
  autoCrop: true, // 是否默认生成截图框
  autoCropWidth: 200, // 默认生成截图框宽度
  autoCropHeight: 200, // 默认生成截图框高度
  fixedBox: true, // 固定截图框大小 不允许改变
  outputType: "png", // 默认生成截图为PNG格式
});

const customUpload = ({ file }) => {
  const reader = new FileReader();
  reader.readAsDataURL(file.file);
  reader.onload = () => {
    options.img = reader.result;
  };
};

const handleClose = () => {
  options.img = userStore.avatar;
};

const uploadAvatar = () => {
  cropperRef.value.getCropBlob((data) => {
    let formData = new FormData();
    formData.append("file", data);

    updateAvatar(formData)
      .then(({ data }) => {
        options.img = data.data;
        userStore.avatar = options.img;
        dialogVisible.value = false;
      })
      .catch(() => {});
  });
};
</script>
<style lang="scss" scoped></style>
