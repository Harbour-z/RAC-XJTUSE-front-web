<script setup>
import { ref, reactive, } from 'vue'
import axios from "axios";
import { useRouter } from 'vue-router';
import {ElMessage} from "element-plus";
import {userLogin} from "../api/api";

const username = ref('admin')
const password = ref('admin')
const router = useRouter();

const login = () => {
  const user={
    loginName:username.value,
    password:password.value
  }
  userLogin(user).then(res => {
    if(!res.data){
          ElMessage({
            message:'用户名密码错误',
            type:'warning'
          })
        }else{
          ElMessage({
            message:'登录成功',
            type:'success'
          })
          router.push({path:'/user/list'})
        }
  })
  // axios.post('api/user/login',{loginName:username.value,password:password.value}).then(res => {
  //   if(!res.data.data){
  //     ElMessage({
  //       message:'用户名密码错误',
  //       type:'warning'
  //     })
  //   }else{
  //     ElMessage({
  //       message:'登录成功',
  //       type:'success'
  //     })
  //     router.push({path:'/user/list'})
  //   }
  // })
};
</script>

<template>
  <div class="login-body">
    <div class="login-panel">
      <div class="login-title">用户登录</div>
      <el-form :model="formData" ref="formDataRef">
        <el-form-item prop="username">
          <el-input placeholder="Username" v-model="username" size="large" type="text">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input placeholder="password" v-model="password" size="large" type="password"
                    @keyup.enter.native="login()">
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" style="width: 100%;" @click="login()" size="large">Sign in</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped >
.login-body {
  background: url("../assets/bg.jpg") no-repeat center center;
  height: 100%;
  width: 100%;
  background-size: cover;
  position: absolute;
  left: 0;
  top: 0;
  .login-panel {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    padding: 25px;
    width: 26%;
    min-width: 460px;
    height: 30%;
    min-height: 300px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 5%;
    box-shadow: 2px 2px 10px #ddd;
    .login-title {
      font-size: 22px;
      text-align: center;
      margin-bottom: 22px;
    }
  }
}
</style>