<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

// 表单数据模型
const formData = ref({
  avatar: '',
  nickname: '',
  signature: '',
  gender: 'other',
  birthday: null
});

// 隐私设置状态
const privacySettings = ref({
  profileVisibility: 'everyone',
  collectionVisibility: 'everyone',
  commentVisibility: 'everyone',
  activeStatus: true
});

// 表单验证规则
const rules = ref({
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' }
  ],
  signature: [
    { max: 200, message: '签名长度不能超过200个字符', trigger: 'blur' }
  ]
});

// 表单引用
const formRef = ref(null);

// 上传接口地址，需根据实际情况修改
const uploadUrl = 'https://example.com/upload';

// 头像上传成功处理
const handleAvatarUploadSuccess = (response) => {
  formData.value.avatar = response.data.url;
  ElMessage.success('头像上传成功');
};

// 头像上传前验证
const beforeAvatarUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    ElMessage.error('只能上传 JPG/PNG 格式的图片');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB');
  }
  return isJpgOrPng && isLt2M;
};

// 打开系统头像选择器
const openSystemAvatarSelector = () => {
  // 这里需要实现系统头像选择器的逻辑
  ElMessage.warning('系统头像选择器功能待实现');
};

// 提交表单
const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      // 处理与后端API的交互逻辑
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
    profileVisibility: 'everyone',
    collectionVisibility: 'everyone',
    commentVisibility: 'everyone',
    activeStatus: true
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

        <!-- 头像设置区域 -->
        <el-form-item label="头像">
          <template #content>
            <div class="flex items-center">
              <div class="w-20 h-20 rounded-full bg-gray-200 overflow-hidden mr-4">
                <img :src="formData.avatar || 'https://picsum.photos/200/200'" alt="用户头像" class="w-full h-full object-cover">
              </div>
              <div>
                <el-upload
                    :action="uploadUrl"
                    :show-file-list="false"
                    @success="handleAvatarUploadSuccess"
                    :before-upload="beforeAvatarUpload"
                >
                  <el-button type="primary">上传新头像</el-button>
                </el-upload>
                <el-button type="text" @click="openSystemAvatarSelector">选择系统头像</el-button>
              </div>
            </div>
          </template>
        </el-form-item>

        <!-- 个人信息表单 -->
        <el-form :model="formData" :rules="rules" ref="formRef">
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="formData.nickname" placeholder="请输入您的昵称"></el-input>
          </el-form-item>
          <el-form-item label="签名" prop="signature">
            <el-input type="textarea" v-model="formData.signature" placeholder="介绍一下您自己..." rows="3"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="formData.gender">
              <el-radio label="male">男</el-radio>
              <el-radio label="female">女</el-radio>
              <el-radio label="other">保密</el-radio>
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
              <el-option label="所有人可见" value="everyone"></el-option>
              <el-option label="仅关注者可见" value="followers"></el-option>
              <el-option label="仅自己可见" value="onlyMe"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收藏记录">
            <el-select v-model="privacySettings.collectionVisibility">
              <el-option label="所有人可见" value="everyone"></el-option>
              <el-option label="仅关注者可见" value="followers"></el-option>
              <el-option label="仅自己可见" value="onlyMe"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="评论内容">
            <el-select v-model="privacySettings.commentVisibility">
              <el-option label="所有人可见" value="everyone"></el-option>
              <el-option label="仅关注者可见" value="followers"></el-option>
              <el-option label="仅自己可见" value="onlyMe"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活跃状态">
            <el-switch v-model="privacySettings.activeStatus"></el-switch>
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
</style>