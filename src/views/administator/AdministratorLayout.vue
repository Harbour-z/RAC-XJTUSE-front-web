<script setup>

import {
  CaretBottom,
  EditPen,
  HomeFilled,
  SwitchButton,
  User, UserFilled, View,
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import {useRouter} from "vue-router";
import {ElMessage, ElMessageBox} from "element-plus";

//欢迎后的id实现
import {useAdminInfoStore} from "@/stores/adminInfo";
import {getCurAdminInfo} from "@/api/admin";
const adminInfoStore = useAdminInfoStore();
getCurAdminInfo().then(
    res => {
      if(!res.data){
        ElMessage({
          message:'未登入',
          type:'warning'
        })
        router.push({path:'/login'})
      }else{
        adminInfoStore.setAdminInfo(res.data)
      }
    }
)

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
          adminInfoStore.removeAdminInfo()
          ElMessage.success("退出成功")
          await router.push('/login')
        }
    )
  } else {
    router.push('/admin/' + command)
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
        <el-menu-item index="/admin/UserManagement">
          <el-icon>
            <UserFilled />
          </el-icon>
          <span>用户管理面板</span>
        </el-menu-item>
        <el-menu-item index="/admin/MerchantManagement">
          <el-icon>
            <HomeFilled />
          </el-icon>
          <span>管理商家</span>
        </el-menu-item>
        <el-menu-item index="/admin/DataAnalysis">
          <el-icon>
            <View />
          </el-icon>
          <span>数据可视化</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <!-- 右侧主区域 -->
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <div>欢迎：<strong>{{ adminInfoStore.adminInfo.username }}</strong></div>
        <el-dropdown placement="bottom-end" @command="handleCommand">
                    <span class="el-dropdown__box">
                        <el-avatar :src="adminInfoStore.adminInfo.avatar?adminInfoStore.adminInfo.avater:avatar"/>
                        <el-icon>
                            <CaretBottom/>
                        </el-icon>
                    </span>
          <template #dropdown>
            <el-dropdown-menu>
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

