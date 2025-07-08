<script setup lang="ts">
// 这里需要补充：
// 1. 导入必要的依赖和组件
// 2. 定义表单数据模型（头像、签名、昵称、性别、生日等）
// 3. 实现头像上传功能（包括本地相册上传和系统模板选择）
// 4. 实现表单验证逻辑
// 5. 实现隐私选项的状态管理
// 6. 实现提交表单的方法
// 7. 实现重置表单的方法
// 8. 处理与后端API的交互逻辑
</script>

<template>
  <div class="user-profile-settings-container">
    <el-card>
      <div class="settings-header">
        <h1 class="text-2xl font-bold mb-4">账户设置</h1>
        <p class="text-gray-500 mb-6">自定义您的个人信息和隐私设置</p>
      </div>
    </el-card>


    <div class="settings-content grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- 左侧：个人信息表单 -->
      <div class="md:col-span-2 bg-white rounded-xl shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">个人信息</h2>

        <!-- 头像设置区域 -->
        <div class="mb-6">
          <label class="block text-gray-700 font-medium mb-2">头像</label>
          <div class="flex items-center">
            <!-- 这里需要补充：头像预览区域，显示当前选择的头像 -->
            <div class="w-20 h-20 rounded-full bg-gray-200 overflow-hidden mr-4">
              <!-- 头像图片将显示在这里 -->
              <img src="https://picsum.photos/200/200" alt="用户头像" class="w-full h-full object-cover">
            </div>

            <div>
              <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mb-2">
                上传新头像
                <!-- 这里需要补充：调用本地相册上传的功能 -->
              </button>
              <button class="text-blue-500 hover:text-blue-700">
                选择系统头像
                <!-- 这里需要补充：打开系统头像模板选择器的功能 -->
              </button>
            </div>
          </div>
        </div>

        <!-- 个人信息表单 -->
        <div class="space-y-4">
          <div>
            <label class="block text-gray-700 font-medium mb-1">昵称</label>
            <input type="text" placeholder="请输入您的昵称" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <!-- 这里可能需要补充：昵称验证逻辑和错误提示 -->
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-1">签名</label>
            <textarea placeholder="介绍一下您自己..." rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            <!-- 这里需要补充：签名长度限制和错误提示 -->
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-1">性别</label>
            <div class="flex space-x-4">
              <label class="inline-flex items-center">
                <input type="radio" name="gender" value="male" class="form-radio h-4 w-4 text-blue-500">
                <span class="ml-2">男</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" name="gender" value="female" class="form-radio h-4 w-4 text-blue-500">
                <span class="ml-2">女</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" name="gender" value="other" class="form-radio h-4 w-4 text-blue-500">
                <span class="ml-2">保密</span>
              </label>
            </div>
            <!-- 这里需要补充：性别选择的状态管理 -->
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-1">生日</label>
            <input type="date" class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <!-- 这里需要补充：生日格式验证和年龄计算 -->
          </div>
        </div>
      </div>

      <!-- 右侧：隐私设置 -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">隐私设置</h2>

        <div class="space-y-4">
          <!-- 隐私选项列表 -->
          <div class="p-3 bg-gray-50 rounded-lg">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="font-medium">个人资料</h3>
                <p class="text-sm text-gray-500">控制您的基本信息可见性</p>
              </div>
              <select class="border border-gray-300 rounded-md px-2 py-1 bg-white">
                <option>所有人可见</option>
                <option>仅关注者可见</option>
                <option>仅自己可见</option>
              </select>
              <!-- 这里需要补充：个人资料隐私设置的状态管理 -->
            </div>
          </div>

          <div class="p-3 bg-gray-50 rounded-lg">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="font-medium">收藏记录</h3>
                <p class="text-sm text-gray-500">控制您的收藏内容可见性</p>
              </div>
              <select class="border border-gray-300 rounded-md px-2 py-1 bg-white">
                <option>所有人可见</option>
                <option>仅关注者可见</option>
                <option>仅自己可见</option>
              </select>
              <!-- 这里需要补充：收藏记录隐私设置的状态管理 -->
            </div>
          </div>

          <div class="p-3 bg-gray-50 rounded-lg">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="font-medium">评论内容</h3>
                <p class="text-sm text-gray-500">控制您的评论可见性</p>
              </div>
              <select class="border border-gray-300 rounded-md px-2 py-1 bg-white">
                <option>所有人可见</option>
                <option>仅关注者可见</option>
                <option>仅自己可见</option>
              </select>
              <!-- 这里需要补充：评论内容隐私设置的状态管理 -->
            </div>
          </div>

          <div class="p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium">活跃状态</h3>
                <p class="text-sm text-gray-500">显示您的在线/离线状态</p>
              </div>
              <label class="inline-flex items-center">
                <input type="checkbox" class="form-checkbox h-5 w-5 text-blue-500 rounded">
                <span class="ml-2">开启</span>
              </label>
              <!-- 这里需要补充：活跃状态设置的状态管理 -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部：操作按钮 -->
    <div class="mt-6 flex justify-end space-x-4">
      <button class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
        取消
        <!-- 这里需要补充：重置表单的功能 -->
      </button>
      <button class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        保存更改
        <!-- 这里需要补充：提交表单到后端的功能 -->
      </button>
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

  .form-radio:focus, .form-checkbox:focus {
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
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