<!--
 * @description 分类管理页面
 * @author sulinye
 * @date 2024/2/28 22:10
-->

<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-form v-show="showSearch" :inline="true">
      <el-form-item label="分类名称">
        <el-input
          v-model="categoryQuery.keywords"
          clearable
          placeholder="请输入分类名称"
          style="width: 200px"
          @keyup.enter="queryCategories"
        />
      </el-form-item>
      <el-form-item>
        <el-button icon="Search" type="primary" @click="queryCategories"
          >搜索
        </el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button icon="Plus" plain type="primary" @click="addCategorys">
          新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          :disabled="multiple"
          icon="Delete"
          plain
          type="danger"
          @click="deleteCategorie(undefined)"
        >
          删除
        </el-button>
      </el-col>
      <!-- 右侧工具栏 -->
      <right-toolbar
        v-model:show-search="showSearch"
        @queryTable="getCategoryList"
      />
    </el-row>
    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="categoryList"
      @selection-change="changeSelectedId"
    >
      <el-table-column align="center" type="selection" />
      <el-table-column
        align="center"
        label="分类名"
        min-width="150"
        prop="categoryName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        align="center"
        label="文章数量"
        min-width="100"
        prop="articleCount"
      />
      <el-table-column
        align="center"
        label="创建时间"
        min-width="150"
        prop="createTime"
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
      <el-table-column align="center" label="操作" min-width="150">
        <template #default="scope">
          <el-button
            icon="Edit"
            link
            type="primary"
            @click="updateCategorys(scope.row)"
          >
            修改
          </el-button>
          <el-button
            icon="Delete"
            link
            type="danger"
            @click="deleteCategorie(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页工具 -->
    <pagination
      v-if="count > 0"
      v-model:limit="categoryQuery.size"
      v-model:page="categoryQuery.current"
      :total="count"
      @pagination="getCategoryList"
    />
    <!-- 添加或修改对话框 -->
    <el-dialog v-model="open" :title="title" append-to-body width="500px">
      <el-form
        ref="categoryFormRef"
        :model="categoryForm"
        :rules="rules"
        label-width="100px"
        @submit.prevent
      >
        <el-form-item label="分类名称" prop="categoryName">
          <el-input
            v-model="categoryForm.categoryName"
            placeholder="请输入分类名称"
            style="width: 250px"
            @keyup.enter="submitForm"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, toRefs } from "vue";
import { Clock } from "@element-plus/icons-vue";
import { formatDate } from "@/utils/date";
import {
  getCategoryList,
  deleteCategories,
  addCategory,
  updateCategory,
} from "@/api/category";
import { modal } from "@/utils/modal";

const categoryFormRef = ref();
const rules = reactive({
  categoryName: [
    {
      required: true,
      message: "请输入分类名称",
      trigger: "blur",
    },
  ],
});

const count = ref(0);
const showSearch = ref(true);
const loading = ref(false);
const title = ref("");
const multiple = ref(true);
const open = ref(false);
const categoryIdList = ref([]);
const categoryList = ref([]);
const data = reactive({
  categoryQuery: {
    current: 1,
    size: 10,
  },
  categoryForm: {
    id: undefined,
    categoryName: "",
  },
});

const { categoryQuery, categoryForm } = toRefs(data);

/**
 * 添加分类
 */
const addCategorys = () => {
  categoryFormRef.value ? categoryFormRef.value.clearValidate() : undefined;
  title.value = "添加分类";
  categoryForm.value = {
    id: undefined,
    categoryName: "",
  };
  open.value = true;
};

/**
 * 修改分类
 * @param category
 */
const updateCategorys = (category) => {
  categoryFormRef.value ? categoryFormRef.value.clearValidate() : undefined;
  title.value = "修改分类";
  categoryForm.value = {
    id: category.id,
    categoryName: category.categoryName,
  };
  open.value = true;
};

/**
 * 提交表单
 */
//  categoryFormRef.value? : undefined
const submitForm = () => {
  categoryFormRef.value.validate((valid) => {
    if (valid) {
      // 有id表示修改
      if (categoryForm.value.id !== undefined) {
        updateCategory(categoryForm.value).then(() => {
          modal.notifySuccess("修改成功");
          getCategoryLists();
          open.value = false;
        });
      } else {
        // 无id表示新增
        addCategory(categoryForm.value).then(() => {
          modal.notifySuccess("添加成功");
          getCategoryLists();
          open.value = false;
        });
      }
    }
  });
};

/**
 * 多选处理
 * @param selection 选择项
 */
const changeSelectedId = (selection) => {
  categoryIdList.value = selection.map((item) => item.id);
  multiple.value = !selection.length;
};

/**
 * 删除分类 无id参数代表批量删除
 * @param id 分类id
 */
const deleteCategorie = (id) => {
  let idList = [];
  if (id == undefined) {
    idList = categoryIdList.value;
  } else {
    idList.push(id);
  }
  modal
    .messageConfirm("确认删除已选中的数据项?")
    .then(() => {
      deleteCategories(idList).then(() => {
        modal.notifySuccess("删除成功");
        getCategoryLists();
      });
    })
    .catch(() => {});
};

/**
 * 获取分类数据
 */

const getCategoryLists = () => {
  loading.value = true;
  getCategoryList(categoryQuery.value).then(({ data }) => {
    categoryList.C = data.data.recordList;
    count.value = data.data.count;
    loading.value = false;
  });
};

/**
 * 搜索分类
 */
const queryCategories = () => {
  categoryQuery.value.current = 1;
  getCategoryLists();
};

/**
 * 重置搜索
 */
const resetQuery = () => {
  categoryQuery.value.keywords = "";
  categoryQuery.value.current = 1;
  getCategoryLists();
};

//初始化时加载数据
onMounted(() => {
  getCategoryLists();
});
</script>
<style lang="scss" scoped></style>
