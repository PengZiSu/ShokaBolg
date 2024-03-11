<!--
 * @description 发布文章页面
 * @author sulinye
 * @date 2024/2/29 22:12
-->

<template>
  <div class="app-container">
    <!-- 文章标题 -->
    <div class="header-container">
      <el-input
        v-model="articleForm.articleTitle"
        placeholder="请输入文章标题"
      />
      <el-upload
        :auto-upload="false"
        :on-change="uploadMd"
        :show-file-list="false"
        accept=".md, .txt"
      >
        <el-tooltip content="导入">
          <el-button icon="uploadFilled" link type="primary" />
        </el-tooltip>
      </el-upload>
      <el-tooltip content="导出">
        <el-button icon="download" link type="primary" @click="exportMd" />
      </el-tooltip>
      <el-tooltip content="重置">
        <el-button
          icon="refresh"
          link
          type="danger"
          @click="resetArticleForm(true)"
        />
      </el-tooltip>
      <el-button @click="saveDraft">保存草稿</el-button>
      <el-button type="primary" @click="openModel">发布文章</el-button>
    </div>
    <!-- 编辑器 -->
    <v-md-editor
      v-model="articleForm.articleContent"
      :disabled-menus="[]"
      :toc-nav-position-right="true"
      height="550px"
      left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code tip emoji | save"
      placeholder="请输入文章内容..."
      @upload-image="uploadImage"
    />
    <!-- 发布/修改 对话框 -->
    <el-dialog
      v-model="open"
      :append-to-body="true"
      title="发布文章"
      top="0.5vh"
      width="600px"
    >
      <el-form
        ref="articleFormRef"
        :model="articleForm"
        :rules="rules"
        label-width="80"
      >
        <!-- 文章分类 -->
        <el-form-item label="文章分类" prop="categoryName">
          <el-tag
            v-show="articleForm.categoryName"
            :closable="true"
            :disable-transitions="true"
            round
            size="large"
            @close="removeCategory"
          >
            {{ articleForm.categoryName }}
          </el-tag>
          <!-- 分类选项 -->
          <el-popover
            v-if="!articleForm.categoryName"
            placement="bottom-start"
            trigger="click"
            width="400"
          >
            <template #reference>
              <el-button icon="plus" plain round type="success">
                添加分类
              </el-button>
            </template>
            <div class="popover-title">分类</div>
            <el-autocomplete
              v-model="categoryName"
              :fetch-suggestions="searchCategory"
              :trigger-on-focus="false"
              placeholder="请输入分类名搜索,enter可添加自定义分类"
              style="width: 100%"
              value-key="categoryName"
              @select="selectCategory"
              @keyup.enter="saveCategory"
            />
            <!-- 分类 -->
            <div class="popover-container">
              <el-check-tag
                v-for="(category, index) of categoryList"
                :key="index"
                checked
                class="popover-item"
                @click="addCategory(category.categoryName)"
              >
                {{ category.categoryName }}
              </el-check-tag>
            </div>
          </el-popover>
        </el-form-item>
        <!-- 文章标签 -->
        <el-form-item label="文章标签" prop="tagNameList">
          <el-tag
            v-for="(tagName, index) of articleForm.tagNameList"
            v-show="articleForm.tagNameList"
            :key="index"
            :closable="true"
            :disable-transitions="true"
            round
            size="large"
            style="margin-right: 1rem"
            @close="removeTag(tagName)"
          >
            {{ tagName }}
          </el-tag>
          <!-- 标签选项 -->
          <el-popover
            v-if="articleForm.tagNameList.length < 3"
            placement="bottom-start"
            trigger="click"
            width="400"
          >
            <template #reference>
              <el-button icon="plus" plain round type="success"
                >添加标签
              </el-button>
            </template>
            <div class="popover-title">标签</div>
            <!-- 搜索框 -->
            <el-autocomplete
              v-model="tagName"
              :fetch-suggestions="searchTag"
              :trigger-on-focus="false"
              placeholder="请输入标签名搜索,enter可添加自定义标签"
              style="width: 100%"
              value-key="tagName"
              @select="selectTag"
              @keyup.enter="saveTag"
            />
            <!-- 标签 -->
            <div class="popover-container">
              <el-check-tag
                v-for="(tag, index) of tagList"
                :key="index"
                :class="{
                  'popover-item-selected':
                    articleForm.tagNameList.indexOf(tag.tagName) !== -1,
                }"
                checked
                class="popover-item"
                @click="addTag(tag.tagName)"
              >
                {{ tag.tagName }}
              </el-check-tag>
            </div>
          </el-popover>
        </el-form-item>
        <!-- 文章类型 -->
        <el-form-item label="文章类型" prop="articleType">
          <el-select v-model="articleForm.articleType" placeholder="请选择类型">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 缩略图 -->
        <el-form-item label="缩略图" prop="articleCover">
          <el-upload
            :before-upload="beforeUploadCover"
            :headers="authorization"
            :on-success="updateArticleCover"
            :show-file-list="false"
            accept="image/*"
            action="/api/article/upload"
            drag
          >
            <el-icon
              v-if="articleForm.articleCover === ''"
              class="el-icon--upload"
            >
              <upload-filled />
            </el-icon>
            <div v-if="articleForm.articleCover === ''" class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <img
              v-else
              :src="articleForm.articleCover"
              alt="加载失败"
              width="360"
            />
          </el-upload>
        </el-form-item>
        <!-- 置顶 -->
        <el-form-item label="置顶" prop="isTop">
          <el-switch
            v-model="articleForm.isTop"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
        <!-- 推荐 -->
        <el-form-item label="推荐" prop="isFeatured">
          <el-switch
            v-model="articleForm.isFeatured"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
        <!-- 发布形式 -->
        <el-form-item label="发布形式" prop="status">
          <el-radio-group v-model="articleForm.status">
            <el-radio :label="1">公开</el-radio>
            <el-radio :label="2">私密</el-radio>
            <el-radio :label="3">草稿</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            v-if="articleForm.status !== 3"
            type="primary"
            @click="submitForm"
          >
            发布文章
          </el-button>
          <el-button v-else type="primary" @click="submitForm"
            >保存草稿
          </el-button>
          <el-button @click="open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { useDateFormat } from "@vueuse/core";
import {
  editArticle,
  updateArticle,
  uploadImages,
  getTagOptions,
  getCategoryOptions,
} from "@/api/article";
import { computed, reactive, ref } from "vue";
import { UploadFilled } from "@element-plus/icons-vue";
import * as imageConversion from "image-conversion";
import { getToken, token_prefix } from "@/utils/token";
import { modal } from "@/utils/modal";
import useStore from "@/store";
import router from "@/router";
import * as yaml from "yaml";
import { saveAs } from "file-saver";

let meta;

const articleFormRef = ref();
const rules = reactive({
  categoryName: [
    {
      required: true,
      message: "文章分类不能为空",
      trigger: "blur",
    },
  ],
  tagNameList: [
    {
      required: true,
      message: "文章标签不能为空",
      trigger: "blur",
    },
  ],
});

const upload = ref(null);
const { tagStore } = useStore();
const route = useRoute();
const articleId = route.params.articleId;
const articleTitle = ref(useDateFormat(new Date(), "YYYY-MM-DD"));
const open = ref(false);
const categoryList = ref([]);
const tagName = ref("");
const articleForm = ref({
  id: undefined,
  articleCover: "",
  articleTitle: articleTitle.value,
  articleContent: "",
  categoryName: "",
  tagNameList: [],
  articleType: 1,
  isTop: 0,
  isFeatured: 0,
  status: 1,
});

const typeList = reactive([
  { value: 1, label: "原创" },
  { value: 2, label: "转载" },
  { value: 3, label: "翻译" },
]);

//el-upload 请求头
const authorization = computed(() => {
  return {
    authorization: token_prefix + getToken(),
  };
});

/**
 * 打开发布页面
 */
const openModel = () => {
  if (articleForm.value.articleTitle.trim() === "") {
    modal.msgError("文章标题不能为空");
    return;
  }
  if (articleForm.value.articleContent.trim() === "") {
    modal.msgError("文章内容不能为空");
    return;
  }
  // 避免再次打开弹窗后显示分类、标签不能为空
  articleFormRef.value ? articleFormRef.value.clearValidate() : undefined;
  getCategoryOptions().then(({ data }) => {
    categoryList.value = data.data;
  });
  getTagOptions().then(({ data }) => {
    tagList.value = data.data;
  });
  open.value = true;
};

/**
 * 移除分类选项
 */

const removeCategory = () => {
  articleForm.value.categoryName = "";
};

/**
 * 搜索分类选项
 * @param keywords 关键词
 * @param cb 回调函数
 */

const searchCategory = (keywords, cb) => {
  const results = keywords
    ? categoryList.value.filter(
        (category) => category.categoryName.indexOf(keywords) !== -1
      )
    : categoryList.value;
  cb(results);
};

/**
 * 回车保存标签
 */
const saveTag = () => {
  if (tagName.value.trim() != "") {
    addTag(tagName.value);
    tagName.value = "";
  }
};

/**
 * 搜索框选择标签
 * @param tag 标签
 */
const selectTag = (tag) => {
  addTag(tag.tagName);
};

/**
 * 添加标签
 * @param tagName 标签名称
 */
const addTag = (tagName) => {
  if (articleForm.value.tagNameList.indexOf(tagName) === -1) {
    articleForm.value.tagNameList.push(tagName);
  }
};

/**
 * md编辑器内上传图片
 * @param event 未知
 * @param insertImage 图片回显
 * @param files 文件
 */
const uploadImage = (event, insertImage, files) => {
  const form = new FormData();
  form.append("file", files[0]);
  uploadImages(form).then(({ data }) => {
    // 上传成功则调用insertImage回显图片
    insertImage({
      url: data.data,
    });
  });
};

/**
 * 文章封面上传前处理
 * @param rawFile 图片
 */
const beforeUploadCover = (rawFile) => {
  return new Promise((resolve) => {
    if (rawFile.size / 1024 < 200) {
      resolve(rawFile);
    } else {
      // 若图片超过200KB，则将其压缩至200KB
      imageConversion.compressAccurately(rawFile, 200).then((res) => {
        resolve(res);
      });
    }
  });
};

/**
 * 文章封面上传成功后更新
 * @param response 响应数据
 */
const updateArticleCover = (response) => {
  articleForm.value.articleCover = response.data;
};

const uploadMd = (file) => {
  // 判断上传文件的格式
  const typeArray = [".md", ".txt"];
  const type = file.name.substring(file.name.lastIndexOf("."));
  if (typeArray.indexOf(type) === -1) {
    modal.msgWarning("只能上传md或txt格式文件!");
    return;
  }
  resetArticleForm();
  const reader = new FileReader();
  reader.onload = function () {
    if (reader.result) {
      let fileContent = reader.result;
      // 解析meta信息
      parseMdMeta(fileContent);

      // 映射集合
      const map = {
        title: "articleTitle",
        cover: "articleCover",
        category: "categoryName",
        tags: "tagNameList",
        type: "articleType",
      };
      // 将meta信息转换为articleInfo
      for (const prop in meta) {
        if (meta.hasOwnProperty(prop) && typeof meta[prop] !== "undefined") {
          let newProp = prop;
          if (prop in map) {
            newProp = map[prop];
          }
          articleForm.value[newProp] = meta[prop];
        }
      }
    }
  };
  reader.readAsText(file.raw);
};

/**
 * 解析md文件中的meta信息
 * @param mdContent md文件内容
 * @return  md文件内容和meta信息
 */
const parseMdMeta = (mdContent) => {
  const regex = /^---([\s\S]+?)---/;
  const match = mdContent.match(regex);
  if (match) {
    const yamlStr = match[1];
    meta = yaml.parse(yamlStr);
    articleForm.value.articleContent = mdContent.replace(match[0], "").trim();
  } else {
    articleForm.value.articleContent = mdContent;
  }
};

/**
 * 导出md文件
 */
const exportMd = () => {
  modal
    .messageConfirm(
      `确定将文章 '${articleForm.value.articleTitle}' 导出为md文档吗?`
    )
    .then(() => {
      const file = new Blob([addMdMeta(articleForm.value.articleContent)], {
        type: "text/plain;charset=utf-8",
      });
      saveAs(file, `${articleForm.value.articleTitle}.md`);
    });
};

/**
 * 添加meta信息
 * @param content md文件内容
 */
function addMdMeta(content) {
  meta = {
    title: articleForm.value.articleTitle,
    cover: articleForm.value.articleCover,
    category: articleForm.value.categoryName,
    tags: articleForm.value.tagNameList,
    id: articleForm.value.id,
    type: articleForm.value.articleType,
    status: articleForm.value.status,
    isTop: articleForm.value.isTop,
    isFeatured: articleForm.value.isFeatured,
  };
  const metaStr = yaml.stringify(meta);
  return `---\n${metaStr}---\n\n${content.trim()}\n`;
}

/**
 * 提交表单
 */
const submitForm = () => {
  articleFormRef.value.validate((valid) => {
    if (valid) {
      updateArticle(articleForm.value).then(() => {
        // 若是编辑文章，则编辑完成后返回
        if (articleForm.value.id !== undefined) {
          modal.notifySuccess("文章修改成功");
          router.push({ path: "/article/list" });
          tagStore.delView({ path: `/article/write/${articleForm.value.id}` });
        } else {
          modal.notifySuccess("文章发布成功");
        }
        open.value = false;
      });
    }
  });
};

/**
 * 保存草稿
 */
const saveDraft = () => {
  if (articleForm.value.articleContent === "") {
    modal.msgError("文章内容不能为空");
    return;
  }

  articleForm.value.status = 3;
  articleApi.addArticle(articleForm.value).then(() => {
    modal.notifySuccess("文章保存成功");
    open.value = false;
  });
};

/**
 * 重置表单
 */
const resetArticleForm = (showConfirm = false) => {
  if (showConfirm) {
    modal
      .messageConfirm("确定要重置数据吗?<br />该操作将清空页面上所有内容")
      .then(() => {
        articleForm.value = {
          id: undefined,
          articleCover: "",
          articleTitle: articleTitle.value,
          articleContent: "",
          categoryName: "",
          tagNameList: [],
          articleType: 1,
          isTop: 0,
          isFeatured: 0,
          status: 1,
        };
      });
  } else {
    articleForm.value = {
      id: undefined,
      articleCover: "",
      articleTitle: articleTitle.value,
      articleContent: "",
      categoryName: "",
      tagNameList: [],
      articleType: 1,
      isTop: 0,
      isFeatured: 0,
      status: 1,
    };
  }
};

onMounted(() => {
  if (articleId) {
    if (isNaN(Number(articleId))) {
      modal.notifyError(`文章id格式有误:${articleId}`);
      return;
    }
    editArticle(Number(articleId))
      .then(({ data }) => {
        articleForm.value = data.data;
      })
      .catch(() => {
        tagStore.delView({ path: `/article/write/${articleId}` });
        router.push({ path: "/article/list" });
      });
  }
});
</script>
<style lang="scss" scoped></style>
