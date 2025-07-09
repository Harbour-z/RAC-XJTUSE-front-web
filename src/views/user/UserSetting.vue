<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import {getCurUser} from "@/api/user";
import {useUserInfoStore} from "@/stores/userInfo";
import {useRouter} from "vue-router";
import {Plus} from "@element-plus/icons-vue";
const userInfoStore = useUserInfoStore();
const router = useRouter();
import {updateUser} from "@/api/user"

const imageUrl = ref('')

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
getUserInfo();

// 表单数据模型
const formData = ref({
  id:userInfoStore.userInfo.id,
  avatar: userInfoStore.userInfo.userAvatar,
  username: userInfoStore.userInfo.username,
  signature: userInfoStore.userInfo.signature,
  gender: userInfoStore.userInfo.userGender,
  birthday: userInfoStore.userInfo.birthday,
});

// 隐私设置状态
const privacySettings = ref({
  profileVisibility: userInfoStore.userInfo.profileVisibile,
  collectionVisibility: userInfoStore.userInfo.favoriteVisibile,
});

// 表单验证规则
const rules = ref({
  username: [
    { required: true, message: '请输入昵称', trigger: 'blur' }
  ],
  signature: [
    { max: 50, message: '签名长度不能超过50个字符', trigger: 'blur' }
  ]
});

// 表单引用
const formRef = ref(null);

// 头像上传成功处理
const handleAvatarSuccess = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
  formData.value.avatar = URL.createObjectURL(response.avatar);
}


// 打开系统头像选择器
const openSystemAvatarSelector = () => {
  // 这里需要实现系统头像选择器的逻辑
  ElMessage.warning('系统头像选择器功能待实现');
};

// 提交表单
const submitForm = () => {
  const submitData = { ...formData.value, ...privacySettings.value }

  formRef.value.validate((valid) => {
    if (valid) {
      // 处理与后端API的交互逻辑
      updateUser(submitData).then(res => {getUserInfo()})
      ElMessage.success('表单提交成功');
    } else {
      ElMessage.error('表单验证失败，请检查输入');
    }
  });
};

// 重置表单
const resetForm = () => {
  formRef.value.resetFields();
  formData.value.avatar = '';
  privacySettings.value = {
    profileVisibility: 0,
    collectionVisibility: 0,
  };
};
</script>

<template>
  <div class="user-profile-settings-container">
    <el-card>
      <template #header>
        <div class="settings-header">
          <h1 class="text-2xl font-bold mb-4">账户设置</h1>
          <p class="text-gray-500 mb-6">自定义您的个人信息和隐私设置</p>
        </div>
      </template>
    </el-card>

    <div class="settings-content grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- 左侧：个人信息表单 -->
      <div class="md:col-span-2 bg-white rounded-xl shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">个人信息</h2>

        <div>
          头像展示
          <img
              v-if="userInfoStore.userInfo.userAvatar"
              :src="userInfoStore.userInfo.userAvatar"
              alt=""  width="100" height="100"/>
          <div v-else>暂无头像</div>
        </div>

        <div>
          <!-- 头像设置区域 -->
          <el-form-item label="头像修改">
            <el-upload
                class="avatar-uploader"
                action="/api/file/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" alt="avatar"/>
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
        </div>


        <!-- 个人信息表单 -->
        <el-form :model="formData" :rules="rules" ref="formRef">
          <el-form-item label="昵称" prop="username">
            <el-input v-model="formData.username" placeholder="请输入您的昵称"></el-input>
          </el-form-item>
          <el-form-item label="签名" prop="signature">
            <el-input type="textarea" v-model="formData.signature" placeholder="介绍一下您自己..." rows="2"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="formData.gender">
              <el-radio :label= 0>男</el-radio>
              <el-radio :label= 1>女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="生日" prop="birthday">
            <el-date-picker v-model="formData.birthday" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-form>
      </div>

      <!-- 右侧：隐私设置 -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">隐私设置</h2>
        <el-form :model="privacySettings">
          <el-form-item label="个人资料">
            <el-select v-model="privacySettings.profileVisibility">
              <el-option label="所有人可见" :value= 0></el-option>
              <el-option label="仅自己可见" :value= 1></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收藏记录">
            <el-select v-model="privacySettings.collectionVisibility">
              <el-option label="所有人可见" :value= 0></el-option>
              <el-option label="仅自己可见" :value= 1></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 底部：操作按钮 -->
    <div class="mt-6 flex justify-end space-x-4">
      <el-button @click="resetForm">取消</el-button>
      <el-button type="primary" @click="submitForm">保存更改</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user-profile-settings-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;

  .settings-header {
    text-align: center;
  }

  .settings-content {
    .bg-white {
      transition: all 0.3s ease;
      &:hover {
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      }
    }
  }

  button {
    transition: all 0.2s ease;
    &:hover {
      transform: translateY(-1px);
    }
    &:active {
      transform: translateY(0);
    }
  }
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

</style>

