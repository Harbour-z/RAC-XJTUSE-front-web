<script setup>
import {useRouter } from 'vue-router';
import {ElMessage} from "element-plus";
import {adminLogin, merchantLogin, userLogin,userRegister,merchantRegister} from "../api/api";
import {onMounted, ref} from 'vue';

const router = useRouter()

// 登录表单数据
const loginForm = ref({
  account: '',
  password: '',
  role: '用户'
})

// 注册表单数据
const registerForm = ref({
  role: 'user', // 'user' 或 'merchant'
  username: '',
  password: '',
  confirmPassword: '',
  phone: '',
  email: ''
})

const handleLogin = async (e) => {
  e.preventDefault()

  if (!loginForm.value.account || !loginForm.value.password) {
    ElMessage.warning('请输入账号和密码')
    return
  }

  try {
    let res
    const { account, password, role } = loginForm.value
    // 根据选择的身份调用不同的API
    switch(role) {
      case '用户':
        res = await userLogin({
          account: account,
          password: password
        })
        break
      case '商家':
        res = await merchantLogin({ account: account, password: password })
        break
      case '管理员':
        res = await adminLogin({ account: account, password: password })
        break
      default:
        throw new Error('未知用户身份')
    }
    console.info(res.data)
    if (!res.data) {
      ElMessage.error('用户名或密码错误')
    } else if(role==='管理员'){
      ElMessage.success('你就是我的Master吗')
      router.push({ path: '/admin/UserManagement' })
    } else {
      ElMessage.success(`${role}登录成功`)
      // 根据身份跳转到不同页面
      switch(role) {
        case '用户':
          router.push({ path: '/user/UserMainPage' })
          break
        case '商家':
          router.push({ path: '/merchant/MerchantMainPage' })
          break
      }
    }
  } catch (error) {
    ElMessage.error(`登录失败: ${error.message}`)
  }
}

const handleRegister = async (e) => {
  e.preventDefault()

  try {
    // 检查必填字段
    if (!registerForm.value.username || !registerForm.value.password) {
      ElMessage.warning('用户名和密码为必填项');
      return;
    }

    // 检查密码一致性
    if (registerForm.value.password !== registerForm.value.confirmPassword) {
      ElMessage.warning('两次输入的密码不一致');
      return;
    }

    // 准备注册数据
    const registerData = {
      username: registerForm.value.username,
      password: registerForm.value.password,
      phone: registerForm.value.phone || undefined,
      email: registerForm.value.email || undefined
    };

    // 根据角色调用不同API
    let res;
    console.info(registerForm.value.role)
    if (registerForm.value.role === 'user') {
      res = await userRegister(registerData);
    } else {
      res = await merchantRegister(registerData);
    }

    if (res.data) {
      ElMessage.success('注册成功');
      // 自动切换到登录界面
      container.classList.remove("sign-up-mode");

      // 自动填充登录表单
      loginForm.value.account = registerForm.value.username;
      loginForm.value.password = registerForm.value.password;
      loginForm.value.role = registerForm.value.role === 'user' ? '用户' : '商家';

      // 清空注册表单
      registerForm.value = {
        role: 'user',
        username: '',
        password: '',
        confirmPassword: '',
        phone: '',
        email: ''
      };
    } else {
      ElMessage.error('注册失败');
    }
  } catch (error) {
    ElMessage.error(`注册失败: ${error.message}`);
  }
}

let container, signInBtn, signUpBtn
onMounted(() => {
  container = document.querySelector(".container")
  signInBtn = document.querySelector("#sign-in-btn")
  signUpBtn = document.querySelector("#sign-up-btn")

  if (signUpBtn) {
    signUpBtn.addEventListener("click", () => {
      container.classList.add("sign-up-mode")
    })
  }

  if (signInBtn) {
    signInBtn.addEventListener("click", () => {
      container.classList.remove("sign-up-mode")
    })
  }
})
</script>

<template>
  <div class="container">
    <div class="forms-container">
      <div class="signin-signup">
        <form action="#" class="sign-in-form" @submit="handleLogin">
          <h2 class="title">Sign in</h2>
          <div class="input-field">
            <i class="fas fa-user"></i>
            <input v-model="loginForm.account" type="text" placeholder="Username/Phone/Email" required/>
          </div>
          <div class="input-field">
            <i class="fas fa-lock"></i>
            <input v-model="loginForm.password" type="password" placeholder="Password" required />
          </div>
          <el-radio-group v-model="loginForm.role">
            <el-radio value="用户">用户</el-radio>
            <el-radio value="商家">商家</el-radio>
            <el-radio value="管理员">管理员</el-radio>
          </el-radio-group>
          <input type="submit" value="Login" class="btn solid" />
        </form>

        <form action="#" class="sign-up-form" @submit="handleRegister">
          <h2 class="title">Sign up</h2>
          <div class="role-selection">
            <el-radio-group v-model="registerForm.role">
              <el-radio label="user" size="large">用户</el-radio>
              <el-radio label="merchant" size="large">商家</el-radio>
            </el-radio-group>
          </div>
          <div class="input-field">
            <i class="fas fa-user"></i>
            <input v-model="registerForm.username" type="text" placeholder="用户名" required />
          </div>

          <div class="input-field">
            <i class="fas fa-lock"></i>
            <input v-model="registerForm.password" type="password" placeholder="密码" required />
          </div>

          <div class="input-field">
            <i class="fas fa-lock"></i>
            <input v-model="registerForm.confirmPassword" type="password" placeholder="确认密码" required />
          </div>

          <div class="input-field">
            <i class="fas fa-phone"></i>
            <input v-model="registerForm.phone" type="text" placeholder="手机号（可选）" />
          </div>

          <div class="input-field">
            <i class="fas fa-envelope"></i>
            <input v-model="registerForm.email" type="email" placeholder="邮箱（可选）" />
          </div>
          <input type="submit" class="btn" value="Sign up" />
        </form>
      </div>
    </div>

    <div class="panels-container">
      <div class="panel left-panel">
        <div class="content">
          <h3>New here ?</h3>
          <p>
            Enter your details and start your journey with us
          </p>
          <button class="btn transparent" id="sign-up-btn">
            Sign up
          </button>
        </div>
        <img src="@/assets/images/signin.png" class="image" alt="" />
      </div>
      <div class="panel right-panel">
        <div class="content">
          <h3>One of us ?</h3>
          <p>
            To keep connected with us please login with your personal info
          </p>
          <button class="btn transparent" id="sign-in-btn">
            Sign in
          </button>
        </div>
        <img src="@/assets/images/signup.png" class="image" alt="" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* Your existing CSS remains unchanged */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body,
input {
  font-family: sans-serif;
}

.container {
  position: relative;
  width: 100%;
  background-color: #fff;
  min-height: 100vh;
  overflow: hidden;
}

.forms-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.signin-signup {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  left: 75%;
  width: 50%;
  transition: 1s 0.7s ease-in-out;
  display: grid;
  grid-template-columns: 1fr;
  z-index: 5;
}

form {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0rem 5rem;
  transition: all 0.2s 0.7s;
  overflow: hidden;
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}

form.sign-up-form {
  opacity: 0;
  z-index: 1;
}

form.sign-in-form {
  z-index: 2;
}

.title {
  font-size: 2.2rem;
  color: #444;
  margin-bottom: 10px;
}

.input-field {
  max-width: 380px;
  width: 100%;
  background-color: #f0f0f0;
  margin: 10px 0;
  height: 55px;
  border-radius: 55px;
  display: grid;
  grid-template-columns: 15% 85%;
  padding: 0 0.4rem;
  position: relative;
}

.input-field i {
  text-align: center;
  line-height: 55px;
  color: #acacac;
  transition: 0.5s;
  font-size: 1.1rem;
}

.input-field input {
  background: none;
  outline: none;
  border: none;
  line-height: 1;
  font-weight: 600;
  font-size: 1.1rem;
  color: #333;
}

.input-field input::placeholder {
  color: #aaa;
  font-weight: 500;
}

.social-text {
  padding: 0.7rem 0;
  font-size: 1rem;
}

.social-media {
  display: flex;
  justify-content: center;
}

.social-icon {
  height: 46px;
  width: 46px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0.45rem;
  color: #333;
  border-radius: 50%;
  border: 1px solid #333;
  text-decoration: none;
  font-size: 1.1rem;
  transition: 0.3s;
}

.social-icon:hover {
  color: #4481eb;
  border-color: #4481eb;
}

.btn {
  width: 150px;
  background-color: #5995fd;
  border: none;
  outline: none;
  height: 49px;
  border-radius: 49px;
  color: #fff;
  text-transform: uppercase;
  font-weight: 600;
  margin: 10px 0;
  cursor: pointer;
  transition: 0.5s;
}

.btn:hover {
  background-color: #4d84e2;
}
.panels-container {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.container:before {
  content: "";
  position: absolute;
  height: 2000px;
  width: 2000px;
  top: -10%;
  right: 48%;
  transform: translateY(-50%);
  background-image: linear-gradient(-45deg, #4481eb 0%, #04befe 100%);
  transition: 1.8s ease-in-out;
  border-radius: 50%;
  z-index: 6;
}

.image {
  width: 100%;
  transition: transform 1.1s ease-in-out;
  transition-delay: 0.4s;
}

.panel {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-around;
  text-align: center;
  z-index: 6;
}

.left-panel {
  pointer-events: all;
  padding: 3rem 17% 2rem 12%;
}

.right-panel {
  pointer-events: none;
  padding: 3rem 12% 2rem 17%;
}

.panel .content {
  color: #fff;
  transition: transform 0.9s ease-in-out;
  transition-delay: 0.6s;
}

.panel h3 {
  font-weight: 600;
  line-height: 1;
  font-size: 1.5rem;
}

.panel p {
  font-size: 0.95rem;
  padding: 0.7rem 0;
}

.btn.transparent {
  margin: 0;
  background: none;
  border: 2px solid #fff;
  width: 130px;
  height: 41px;
  font-weight: 600;
  font-size: 0.8rem;
}

.right-panel .image,
.right-panel .content {
  transform: translateX(800px);
}

/* ANIMATION */

.container.sign-up-mode:before {
  transform: translate(100%, -50%);
  right: 52%;
}

.container.sign-up-mode .left-panel .image,
.container.sign-up-mode .left-panel .content {
  transform: translateX(-800px);
}

.container.sign-up-mode .signin-signup {
  left: 25%;
}

.container.sign-up-mode form.sign-up-form {
  opacity: 1;
  z-index: 2;
}

.container.sign-up-mode form.sign-in-form {
  opacity: 0;
  z-index: 1;
}

.container.sign-up-mode .right-panel .image,
.container.sign-up-mode .right-panel .content {
  transform: translateX(0%);
}

.container.sign-up-mode .left-panel {
  pointer-events: none;
}

.container.sign-up-mode .right-panel {
  pointer-events: all;
}

@media (max-width: 870px) {
  .container {
    min-height: 800px;
    height: 100vh;
  }
  .signin-signup {
    width: 100%;
    top: 95%;
    transform: translate(-50%, -100%);
    transition: 1s 0.8s ease-in-out;
  }

  .signin-signup,
  .container.sign-up-mode .signin-signup {
    left: 50%;
  }

  .panels-container {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 2fr 1fr;
  }

  .panel {
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 2.5rem 8%;
    grid-column: 1 / 2;
  }

  .right-panel {
    grid-row: 3 / 4;
  }

  .left-panel {
    grid-row: 1 / 2;
  }

  .image {
    width: 200px;
    transition: transform 0.9s ease-in-out;
    transition-delay: 0.6s;
  }

  .panel .content {
    padding-right: 15%;
    transition: transform 0.9s ease-in-out;
    transition-delay: 0.8s;
  }

  .panel h3 {
    font-size: 1.2rem;
  }

  .panel p {
    font-size: 0.7rem;
    padding: 0.5rem 0;
  }

  .btn.transparent {
    width: 110px;
    height: 35px;
    font-size: 0.7rem;
  }

  .container:before {
    width: 1500px;
    height: 1500px;
    transform: translateX(-50%);
    left: 30%;
    bottom: 68%;
    right: initial;
    top: initial;
    transition: 2s ease-in-out;
  }

  .container.sign-up-mode:before {
    transform: translate(-50%, 100%);
    bottom: 32%;
    right: initial;
  }

  .container.sign-up-mode .left-panel .image,
  .container.sign-up-mode .left-panel .content {
    transform: translateY(-300px);
  }

  .container.sign-up-mode .right-panel .image,
  .container.sign-up-mode .right-panel .content {
    transform: translateY(0px);
  }

  .right-panel .image,
  .right-panel .content {
    transform: translateY(300px);
  }

  .container.sign-up-mode .signin-signup {
    top: 5%;
    transform: translate(-50%, 0);
  }
}

@media (max-width: 570px) {
  form {
    padding: 0 1.5rem;
  }

  .image {
    display: none;
  }
  .panel .content {
    padding: 0.5rem 1rem;
  }
  .container {
    padding: 1.5rem;
  }

  .container:before {
    bottom: 72%;
    left: 50%;
  }

  .container.sign-up-mode:before {
    bottom: 28%;
    left: 50%;
  }
}
</style>