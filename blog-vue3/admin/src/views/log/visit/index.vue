<!--
 * @description 访问日志
 * @author sulinye
 * @date 23:39
-->

<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-form
      @submit.native.prevent
      :model="logQuery"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="访问页面">
        <el-input
          @keyup.enter="queryVisitLogs"
          v-model="logQuery.keywords"
          style="width: 200px"
          placeholder="请输入访问页面"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="queryVisitLogs"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          :disabled="logIdList.length === 0"
          icon="Delete"
          @click="handleDelete(undefined)"
          >批量删除
        </el-button>
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getVisitLogLists"
      ></right-toolbar>
    </el-row>
    <!-- 表格展示 -->
    <el-table
      border
      :data="logList"
      @selection-change="handleSelectionChange"
      v-loading="loading"
    >
      <!-- 表格列 -->
      <el-table-column
        type="selection"
        align="center"
        width="55"
      ></el-table-column>
      <!-- 访问页面 -->
      <el-table-column
        prop="page"
        label="访问页面"
        align="center"
        width="130"
      ></el-table-column>
      <!-- 访问ip -->
      <el-table-column
        prop="ipAddress"
        label="访问ip"
        align="center"
        width="150"
      ></el-table-column>
      <!-- ip来源 -->
      <el-table-column
        prop="ipSource"
        label="ip来源"
        align="center"
        width="200"
      ></el-table-column>
      <!-- 操作系统 -->
      <el-table-column
        prop="os"
        label="操作系统"
        align="center"
        width="180"
      ></el-table-column>
      <!-- 浏览器 -->
      <el-table-column
        prop="browser"
        label="浏览器"
        align="center"
      ></el-table-column>
      <!-- 操作日期 -->
      <el-table-column
        prop="createTime"
        label="访问时间"
        align="center"
        width="200"
      >
        <template #default="scope">
          <div class="create-time">
            <el-icon>
              <clock />
            </el-icon>
            <span style="margin-left: 10px">{{
              formatDateTime(scope.row.createTime)
            }}</span>
          </div>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" align="center" width="150">
        <template #default="scope">
          <el-button
            type="danger"
            icon="Delete"
            link
            @click="handleDelete(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination
      v-if="count > 0"
      :total="count"
      v-model:page="logQuery.current"
      v-model:limit="logQuery.size"
      @pagination="getVisitLogLists"
    />
  </div>
</template>

<script setup>
import { getVisitLogList, deleteVisit } from "@/api/log";
import { formatDateTime } from "@/utils/date";
import { modal } from "@/utils/modal";
import { ref } from "vue";
import { Clock } from "@element-plus/icons-vue";

const count = ref(0);
const showSearch = ref(true);
const loading = ref(false);
const logQuery = ref({
  current: 1,
  size: 10,
});
const logIdList = ref([]);
const logList = ref([]);

const handleSelectionChange = (selection) => {
  logIdList.value = selection.map((item) => item.id);
};

const handleDelete = (id) => {
  let ids = [];
  if (id == undefined) {
    ids = logIdList.value;
  } else {
    ids = [id];
  }
  modal
    .messageConfirm("确认删除已选中的数据项?")
    .then(() => {
      deleteVisit(ids).then(() => {
        modal.notifySuccess("删除成功");
        getVisitLogLists();
      });
    })
    .catch(() => {});
};

const getVisitLogLists = () => {
  loading.value = true;
  getVisitLogList(logQuery.value).then(({ data }) => {
    logList.value = data.data.recordList;
    count.value = data.data.count;
    loading.value = false;
  });
};

const queryVisitLogs = () => {
  logQuery.value.current = 1;
  getVisitLogLists();
};

onMounted(() => {
  getVisitLogLists();
});
</script>
<style lang="scss" scoped></style>
