<template>
  <div class="login-container">
    <h2 class="title">{{ appTitle }}</h2>
    <!-- 中间的盒子 -->
    <div class="container">
      <!-- 盒子左侧图片 -->
      <div class="left_box">
        <img src="@/assets/images/login-background.jpg" alt="" />
      </div>
      <!-- 盒子右侧的表单部分 -->
      <div class="right_box">
        <!-- 标题 -->
        <h3 class="titles">登录</h3>
        <!-- 登录表单 -->
        <div class="form-container">
          <el-form :model="loginForm" :rules="rules" ref="formDateRef">
            <el-form-item prop="username">
              <el-input placeholder="请输入用户名" v-model="loginForm.username">
                <template #prefix>
                  <el-icon>
                    <Avatar />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                type="password"
                shwo-password
                placeholder="请输入密码"
                v-model="loginForm.password"
                @keyup.enter="handleLogin(formDateRef)"
              >
                <template #prefix>
                  <el-icon>
                    <Lock />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-form>
          <!-- 提交表单 -->
          <div style="margin-top: 10px; width: 100%">
            <el-button
              :loading="loading"
              type="primary"
              @click.prevent="handleLogin(formDateRef)"
            >
              <span v-if="!loading">登录</span>
              <span v-else>登 录中...</span>
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2024 - {{ new Date().getFullYear() }} By sulinye</span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import useStore from "@/store";
import router from "@/router";

const appTitle = import.meta.env.VITE_APP_TITLE;
const { userStore } = useStore();

const loading = ref(false);

const loginForm = reactive({
  username: "test@qq.com",
  password: "123456",
});

const formDateRef = ref(null);

const rules = reactive({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      min: 6,
      message: "密码不能少于6位",
      trigger: "blur",
    },
  ],
});

const handleLogin = async (formDateRef) => {
  if (!formDateRef) {
    return;
  }
  await formDateRef.validate((valid) => {
    if (valid) {
      loading.value = true;
      userStore
        .login(loginForm)
        .then(() => {
          router.push({ path: "/" });
          loading.value = false;
        })
        .catch(() => {
          loading.value = false;
        });
    } else {
      return false;
    }
  });
};
</script>
<style lang="scss" scoped>
.login-container {
  height: 100vh;
  width: 100%;
  background: linear-gradient(to right, rgb(247, 209, 215), rgb(191, 227, 241));
  overflow: hidden;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  .container {
    background-color: var(--el-bg-color);
    width: 670px;
    height: 400px;
    display: flex;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 5px 20px 2px rgba(255, 255, 255, 0.1);
    .left_box {
      width: 286px;
      img {
        height: 100%;
      }
    }
    .right_box {
      width: 344px;
      padding: 20px;
      position: relative;
      .titles {
        font-size: 20px;
        color: #333;
        // @include text_color();
        margin: 20px auto 40px auto;
        text-align: center;
        font-weight: 700;
      }
      .form-container {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        .el-form {
          width: 100%;
          // vue3中的样式穿透
          ::v-deep(.el-form-item__content) {
            margin-right: 0px !important;
          }
        }
        .el-button {
          width: 100%;
        }
      }
    }
  }
}
.check-code-panel {
  display: flex;
  align-items: center;
  .input-panel {
    flex: 1;
    margin-right: 5px;
  }
  .check-code {
    height: 30px;
  }
}

.title {
  margin: 0 auto 30px auto;
  text-align: center;
  color: #707070;
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  font-family: Arial, sans-serif;
  font-size: 12px;
  letter-spacing: 1px;
  transition: color 99999s ease-out, background-color 99999s ease-out;
  -webkit-transition: color 99999s ease-out, background-color 99999s ease-out;
}
</style>
