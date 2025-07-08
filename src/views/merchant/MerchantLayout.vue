<script setup>

import {
  CaretBottom,
  EditPen,
  House,
  MessageBox,
  Promotion,
  StarFilled,
  SwitchButton,
  User,
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import {useUserInfoStore} from "@/stores/userInfo";
import {useRouter} from "vue-router";
import {ElMessage, ElMessageBox} from "element-plus";
import {getCurUser} from "@/api/user";
const userInfoStore = useUserInfoStore();

//getCurUser
const getUserInfo = ()=>{
  getCurUser().then(res => {
    if(!res.data){
      ElMessage({
        message:'未登入',
        type:'warning'
      })
      router.push({path:'/login'})
    }else{
      userInfoStore.setUserInfo(res.data)
    }
  })
}
getUserInfo()

const router = useRouter();
const handleCommand = (command) => {
  if (command === 'logout') {
    ElMessageBox.confirm(
        '你确认要退出吗？',
        '温馨提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }
    ).then(
        async () => {
          // clear data in pinia
          userInfoStore.removeUserInfo()
          ElMessage.success("退出成功")
          await router.push('/login')
        }
    )
  } else {
    router.push('/merchant/' + command)
  }
}
</script>

<template>
  <el-container class="layout-container">
    <!-- 左侧菜单 -->
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu active-text-color="#ffd04b" background-color="#232323" text-color="#fff"
               router>
        <el-menu-item index="/merchant/merchantMainPage">
          <el-icon>
            <House />
          </el-icon>
          <span>商家主页</span>
        </el-menu-item>
        <el-menu-item index="/merchant/MerchantRegister">
          <el-icon>
            <Promotion/>
          </el-icon>
          <span>商家注册</span>
        </el-menu-item>
        <el-menu-item index="/merchant/FansInteract">
          <el-icon>
            <StarFilled />
          </el-icon>
          <span>粉丝互动</span>
        </el-menu-item>
        <el-menu-item index="/merchant/MerchantComment">
          <el-icon>
            <MessageBox />
          </el-icon>
          <span>商家评论</span>
        </el-menu-item>
        <el-menu-item index="/merchant/MerchantSetting">
          <el-icon>
            <User />
          </el-icon>
          <span>商家设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <!-- 右侧主区域 -->
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <div>欢迎：<strong>{{ userInfoStore.userInfo.loginName }}</strong></div>
        <el-dropdown placement="bottom-end" @command="handleCommand">
                    <span class="el-dropdown__box">
                        <el-avatar :src="userInfoStore.userInfo.avatar?userInfoStore.userInfo.avater:avatar"/>
                        <el-icon>
                            <CaretBottom/>
                        </el-icon>
                    </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="info" :icon="User">基本资料</el-dropdown-item>
              <el-dropdown-item command="resetPassword" :icon="EditPen">重置密码</el-dropdown-item>
              <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <!-- 中间区域 -->
      <el-main>
        <router-view/>
      </el-main>
      <!-- 底部区域 -->
      <el-footer>商品选择系统 ©2025 </el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;

  .el-aside {
    background-color: #232323;

    &__logo {
      height: 120px;
      background: url('@/assets/login_title.png') no-repeat center / 120px auto;
    }

    .el-menu {
      border-right: none;
    }
  }

  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .el-dropdown__box {
      display: flex;
      align-items: center;

      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }

  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>

