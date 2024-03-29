<!--
 * @description 文章列表页面
 * @author sulinye
 * @date 2024/2/28 22:11
-->

<template>
  <div class="app-container">
    <!-- 文章状态 -->
    <el-row :gutter="24" class="status-container mb20">
      <el-col :span="1.5">
        <el-text size="large" tag="b">状态</el-text>
      </el-col>
      <el-col :span="1.5">
        <el-radio-group v-model="status" @change="changeType">
          <el-radio-button label="全部" />
          <el-radio-button label="公开" />
          <el-radio-button label="私密" />
          <el-radio-button label="草稿" />
          <el-radio-button label="回收站" />
        </el-radio-group>
      </el-col>
    </el-row>
    <!-- 搜索栏 -->
    <el-form v-if="showSearch" :inline="true">
      <el-form-item label="名称">
        <el-input
          v-model="articleQuery.keywords"
          clearable
          placeholder="请输入文章名称"
          style="width: 150px"
          @keyup.enter="queryArticles"
        />
      </el-form-item>
      <el-form-item label="类型">
        <el-select
          v-model="articleQuery.articleType"
          clearable
          placeholder="类型"
          style="width: 130px"
        >
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="分类">
        <el-select
          v-model="articleQuery.categoryId"
          clearable
          filterable
          placeholder="分类"
          style="width: 130px"
          @visible-change="getCategoryOption"
        >
          <el-option
            v-for="category in categoryList"
            :key="category.id"
            :label="category.categoryName"
            :value="category.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="标签">
        <el-select
          v-model="articleQuery.tagId"
          clearable
          filterable
          placeholder="标签"
          style="width: 130px"
          @visible-change="getTagOption"
        >
          <el-option
            v-for="tag in tagList"
            :key="tag.id"
            :label="tag.tagName"
            :value="tag.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="Search" type="primary" @click="queryArticles"
          >搜索
        </el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          :disabled="multiple"
          icon="delete"
          plain
          type="danger"
          @click="deleteArticle(undefined)"
        >
          删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-if="status === '回收站'"
          :disabled="multiple"
          icon="finished"
          plain
          type="success"
          @click="recoverArticle(undefined)"
        >
          恢复
        </el-button>
        <el-button
          v-else
          :disabled="multiple"
          icon="remove"
          plain
          type="danger"
          @click="recycleArticle(undefined)"
        >
          回收
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          :disabled="multiple"
          icon="download"
          plain
          type="primary"
          @click="exportMd(undefined)"
        >
          导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-upload
          multiple
          :auto-upload="false"
          :on-change="uploadMd"
          :show-file-list="false"
          accept=".md, .txt"
        >
          <el-button icon="uploadFilled" plain type="primary"> 导入 </el-button>
        </el-upload>
      </el-col>

      <!-- 右侧工具栏 -->
      <right-toolbar
        v-model:show-search="showSearch"
        @queryTable="getArticleLists"
      />
    </el-row>
    <el-table
      v-loading="loading"
      :data="articleList"
      @selection-change="changeSelectedArticleId"
    >
      <!-- 选择列 -->
      <el-table-column
        type="selection"
        width="30"
        align="center"
      ></el-table-column>
      <!-- 封面 -->
      <el-table-column
        align="center"
        label="封面"
        prop="articleCover"
        width="180"
      >
        <template #default="scope">
          <div class="cover-container">
            <el-image
              :src="
                scope.row.articleCover === ''
                  ? defCover
                  : scope.row.articleCover
              "
              class="article-cover"
              :preview-src-list="previewCoverList"
              :initial-index="scope.$index"
              :preview-teleported="true"
            />
            <el-icon v-if="scope.row.status == 1" class="article-status-icon">
              <View />
            </el-icon>
            <el-icon v-if="scope.row.status == 2" class="article-status-icon">
              <Hide />
            </el-icon>
            <el-icon v-if="scope.row.status == 3" class="article-status-icon">
              <EditPen />
            </el-icon>
          </div>
        </template>
      </el-table-column>
      <!-- 标题 -->
      <el-table-column align="center" label="标题" prop="articleTitle" />
      <!-- 文章类型 -->
      <el-table-column align="center" label="类型" prop="articleType">
        <template #default="scope">
          <el-tag v-if="scope.row.articleType == 1" size="large" type="success"
            >原创
          </el-tag>
          <el-tag v-if="scope.row.articleType == 2" size="large" type="danger"
            >转载
          </el-tag>
          <el-tag v-if="scope.row.articleType == 3" size="large" type="warning"
            >翻译
          </el-tag>
        </template>
      </el-table-column>
      <!-- 文章分类 -->
      <el-table-column
        align="center"
        label="分类"
        prop="categoryName"
        width="100"
        :show-overflow-tooltip="true"
      />
      <!-- 文章标签 -->
      <el-table-column align="center" label="标签" prop="tagList" width="120">
        <template #default="scope">
          <el-tag
            size="large"
            v-for="item of scope.row.tagList"
            :key="item.id"
            style="margin-right: 0.3rem; margin-top: 0.3rem"
          >
            {{ item.tagName }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- 文章浏览量 -->
      <el-table-column
        align="center"
        label="浏览量"
        prop="viewCount"
        width="70"
      />
      <!-- 文章点赞量 -->
      <el-table-column
        align="center"
        label="点赞量"
        prop="likeCount"
        width="70"
      />
      <!-- 是否置顶 -->
      <el-table-column align="center" label="置顶" prop="isTop" width="70">
        <template #default="scope">
          <el-switch
            v-model="scope.row.isTop"
            :active-value="1"
            :disabled="scope.row.isDelete == 1"
            :inactive-value="0"
            @change="setArticleTop(scope.row)"
          />
        </template>
      </el-table-column>
      <!-- 是否推荐 -->
      <el-table-column align="center" label="推荐" prop="isFeatured" width="70">
        <template #default="scope">
          <el-switch
            v-model="scope.row.isFeatured"
            :active-value="1"
            :disabled="scope.row.isDelete == 1"
            :inactive-value="0"
            @change="setArticleFeatured(scope.row)"
          />
        </template>
      </el-table-column>
      <!-- 创建时间 -->
      <el-table-column
        align="center"
        label="创建时间"
        prop="createTime"
        width="130"
      >
        <template #default="scope">
          <div class="create-time">
            <el-icon>
              <clock />
            </el-icon>
            <span style="margin-left: 10px">
              {{ formatDate(scope["row"]["createTime"]) }}
            </span>
          </div>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column align="center" label="操作" width="280">
        <template #default="scope">
          <el-button
            v-if="scope.row.isDelete === 0"
            icon="edit"
            link
            type="primary"
            @click="editArticle(scope.row.id)"
          >
            编辑
          </el-button>
          <el-button
            v-if="scope.row.isDelete === 0"
            icon="download"
            link
            type="primary"
            @click="exportMd(scope.row.id)"
          >
            导出
          </el-button>
          <el-button
            v-if="scope.row.isDelete === 0"
            icon="remove"
            link
            type="danger"
            @click="recycleArticle(scope.row.id)"
            >回收
          </el-button>
          <el-button
            v-else
            icon="remove"
            link
            type="success"
            @click="recoverArticle(scope.row.id)"
            >恢复
          </el-button>
          <el-button
            icon="delete"
            link
            type="danger"
            @click="deleteArticle(scope.row.id)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination
      v-if="count > 0"
      v-model:limit="articleQuery.size"
      v-model:page="articleQuery.current"
      :total="count"
      @pagination="getArticleLists"
    />
  </div>
</template>

<script setup>
import {
  getArticleList,
  getCategoryOptions,
  getTagOptions,
  updateArticleFeatured,
  updateArticleTop,
  addArticle,
  recoverArticles,
  recycleArticles,
  deleteArticles,
} from "@/api/article";
import { ref } from "vue";
import { Clock, EditPen, Hide, View } from "@element-plus/icons-vue";
import { formatDate } from "@/utils/date";
import { modal } from "@/utils/modal";
import router from "@/router";
import defCover from "@/assets/images/defaultCover.jpg";
import * as yaml from "yaml";
import { saveAs } from "file-saver";

let refreshTimeout;

const status = ref("全部");
const count = ref(0);
const showSearch = ref(true);
const loading = ref(false);
const multiple = ref(true);
const categoryList = ref([]);
const tagList = ref([]);
const articleList = ref([]);
const articleIdList = ref([]);
const previewCoverList = ref([]);
const articleQuery = ref({
  current: 1,
  size: 10,
  isDelete: 0,
});

const typeList = [
  { value: 1, label: "原创" },
  { value: 2, label: "转载" },
  { value: 3, label: "翻译" },
];

/**
 * 按文章类型搜索
 * @param type 类型
 */
const changType = (type) => {
  switch (type) {
    case "全部":
      articleQuery.value.isDelete = 0;
      articleQuery.value.status = undefined;
      break;
    case "公开":
      articleQuery.value.isDelete = 0;
      articleQuery.value.status = 1;
      break;
    case "私密":
      articleQuery.value.isDelete = 0;
      articleQuery.value.status = 2;
      break;
    case "草稿":
      articleQuery.value.isDelete = 0;
      articleQuery.value.status = 3;
      break;
    case "回收站":
      articleQuery.value.isDelete = 1;
      articleQuery.value.status = undefined;
  }
  queryArticles();
};

/**
 * 搜索文章
 */

const queryArticles = () => {
  articleQuery.value.current = 1;
  getArticleLists();
};

/**
 * 重置表单
 */
const resetQuery = () => {
  articleQuery.value.current = 1;
  articleQuery.value.keywords = undefined;
  articleQuery.value.articleType = undefined;
  articleQuery.value.categoryId = undefined;
  articleQuery.value.tagId = undefined;
  getArticleLists();
};

/**
 * 删除文章
 * @param id 文章id
 */

const deleteArticle = (id) => {
  let ids = [];
  if (id === undefined) {
    ids = articleIdList.value;
  } else {
    ids = [id];
  }
  modal.messageConfirm("确定要删除选中的文章吗?").then(() => {
    deleteArticles(ids).then(() => {
      modal.notifySuccess("删除成功");
      getArticleLists();
    });
  });
};

/**
 * 回收文章
 * @param id 文章id
 */

const recycleArticle = (id) => {
  let ids = [];
  if (id === undefined) {
    ids = articleIdList.value;
  } else {
    ids = [id];
  }
  modal.messageConfirm("确定要回收选中的文章?").then(() => {
    recycleArticles(ids).then(() => {
      modal.notifySuccess("回收成功");
      getArticleLists();
    });
  });
};

/**
 * 恢复文章
 * @param id 文章id
 */
const recoverArticle = (id) => {
  let ids = [];
  if (id === undefined) {
    ids = articleIdList.value;
  } else {
    ids = [id];
  }
  modal.messageConfirm("确定要恢复选中的文章?").then(() => {
    recoverArticles(ids).then(() => {
      modal.notifySuccess("恢复成功");
      getArticleLists();
    });
  });
};

//上传文件
const uploadMd = (file) => {
  // 判断上传文件的格式
  const typeArray = [".md", ".txt"];
  const type = file.name.substring(file.name.lastIndexOf("."));
  if (typeArray.indexOf(type) === -1) {
    modal.msgWarning("只能上传md或txt格式文件!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    if (reader.result) {
      const articleForm = {
        id: undefined,
        articleTitle: "",
        articleCover: "",
        articleContent: "",
        categoryName: "",
        tagNameList: [],
        articleType: 1,
        status: 1,
        isTop: 0,
        isFeatured: 0,
      };
      let fileContent = reader.result;
      //解析meta信息
      const { content, meta } = parseMdMeta(fileContent);
      articleForm.articleContent = content;

      //映射集合
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
          articleForm[newProp] = meta[prop];
        }
      }
      if (articleForm.articleTitle === "") {
        (articleForm.articleTitle = file.name),
          substring(0, file.name.lastIndexOf("."));
      }
      // 添加文章
      addArticle(articleForm)
        .then(() => {
          modal.notifySuccess(`'${articleForm.articleTitle}'导入成功`);
        })
        .catch(() => {
          modal.notifyError(`'${articleForm.articleTitle}'导入失败`);
        });
    }
  };
  reader.readAsText(file.raw);
  clearTimeout(refreshTimeout);
  refreshTimeout = setTimeout(() => {
    getArticleLists();
  }, 1000);
};

/**
 * 解析md文件中的meta信息
 * @param mdContent md文件内容
 * @return  md文件内容和meta信息
 */
const parseMdMeta = (mdContent) => {
  const rege = /^---([\s\S]+?)---/;
  const match = mdContent.match(regex);
  if (match) {
    const yamlStr = match[1];
    const meta = yaml.parse(yamlStr);
    const content = mdContent.replace(match[0], "").trim();
    return { content, meta };
  } else {
    return { content: mdContent, meta: null };
  }
};

const exportMd = (id) => {
  let ids = [];
  if (id === undefined) {
    ids = articleIdList.value;
  } else {
    ids = [id];
  }
  modal.messageConfirm("确定要导出选中的文章?").then(() => {
    ids.forEach((id) => {
      getArticleInfo(id).then(({ data }) => {
        const articleInfo = data.data;
        const content = articleInfo.articleContent;
        const meta = {
          title: articleInfo.articleTitle,
          cover: articleInfo.articleCover,
          category: articleInfo.categoryName,
          tags: articleInfo.tagNameList,
          id: articleInfo.id,
          type: articleInfo.articleType,
          status: articleInfo.status,
          isTop: articleInfo.isTop,
          isFeatured: articleInfo.isFeatured,
        };
        const metaStr = yaml.stringify(meta);
        const fileContent = `---\n${metaStr}---\n\n${content.trim()}\n`;

        const file = new Blob([fileContent], {
          type: "text/plain;charset=utf-8",
        });
        saveAs(file, `${articleInfo.articleTitle}.md`);
      });
    });
    modal.notifySuccess("导入成功");
  });
};

/**
 * 编辑文章
 * @param id 文章id
 */
const editArticle = (id) => {
  router.push({ path: `/article/write/${id}` });
};

/**
 * 设置文章置顶状态
 * @param article 文章
 */

const setArticleTop = (article) => {
  const text = article.isTop === 0 ? "取消置顶" : "置顶";
  modal
    .messageConfirm(`确定要${text}该文章吗?`)
    .then(() => {
      const topInfo = {
        id: article.id,
        isTop: article.isTop,
      };
      updateArticleTop(topInfo)
        .then(() => {
          modal.notifySuccess(`${text}成功`);
        })
        .catch(() => {
          article.isTop = article.isTop === 0 ? 1 : 0;
        });
    })
    .catch(() => (article.isTop = article.isTop === 0 ? 1 : 0));
};

/**
 * 设置文章推荐状态
 * @param article 文章
 */
const setArticleFeatured = (article) => {
  const text = article.isFeatured === 0 ? "取消推荐" : "推荐";
  modal
    .messageConfirm(`确定要${text}该文章吗?`)
    .then(() => {
      const featuredInfo = {
        id: article.id,
        isFeatured: article.isFeatured,
      };
      updateArticleFeatured(featuredInfo)
        .then(() => {
          modal.notifySuccess(`${text}成功`);
        })
        .catch(() => {
          article.isFeatured = article.isFeatured === 0 ? 1 : 0;
        });
    })
    .catch(() => (article.isFeatured = article.isFeatured === 0 ? 1 : 0));
};

/**
 * 多选处理
 * @param selection 选择项
 */
const changeSelectedArticleId = (selection) => {
  articleIdList.value = selection.map((article) => article.id);
  multiple.value = !selection.length;
};

/**
 * 获取标签
 * @param open 是否为打开状态
 */
const getTagOption = (open) => {
  if (open) {
    getTagOptions().then(({ data }) => {
      tagList.value = data.data;
    });
  }
};

/**
 * 获取分类
 * @param open 是否为打开状态
 */
const getCategoryOption = (open) => {
  if (open) {
    getCategoryOptions().then(({ data }) => {
      categoryList.value = data.data;
    });
  }
};

/**
 * 获取文章列表
 */

const getArticleLists = () => {
  loading.value = true;
  getArticleList(articleQuery.value).then(({ data }) => {
    articleList.value = data.data.recordList;
    count.value = data.data.count;
    previewCoverList.value = articleList.value.map((article) =>
      article.articleCover === "" ? defCover : article.articleCover
    );
    loading.value = false;
  });
};
</script>
<style lang="scss" scoped>
.status-container {
  display: flex;
  align-items: center;
}

.cover-container {
  position: relative;
  height: 90px;

  .article-cover {
    position: relative;
    width: 100%;
    height: 90px;
    border-radius: 4px;

    &::after {
      content: "";
      background: rgba(0, 0, 0, 0.5);
      width: 30px;
      height: 30px;
      position: absolute;
      bottom: 0;
      right: 0;
      border-radius: 20px 10px 0 10px;
    }
  }

  .article-status-icon {
    color: #fff;
    font-size: 1.5rem;
    position: absolute;
    right: 2px;
    bottom: 2px;
    pointer-events: none;
  }
}
</style>
