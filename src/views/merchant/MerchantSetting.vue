<script setup lang="ts">
// 这里需要补充：
// 1. 导入必要的依赖和组件
// 2. 定义表单数据模型（商家信息、营业时间、联系方式等）
// 3. 实现表单验证逻辑
// 4. 实现提交表单的方法
// 5. 处理与后端API的交互逻辑（包括提交审核）
// 6. 实现图片上传功能
// 7. 实现配送范围地图选择功能（如果需要可视化）
// 8. 实现营业时间的时间段管理功能
</script>

<template>
  <div class="merchant-settings-container">
    <div class="settings-header">
      <h1 class="text-2xl font-bold mb-4">商家设置</h1>
      <p class="text-gray-500 mb-6">设置和管理您的商家信息</p>
    </div>

    <div class="settings-content grid grid-cols-1 md:grid-cols-12 gap-6">
      <!-- 商家信息卡片 -->
      <div class="md:col-span-12 bg-white rounded-xl shadow-md p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">商家信息</h2>
          <div class="flex items-center">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <i class="fa fa-clock-o mr-1"></i> 审核中
            </span>
            <button class="ml-3 text-sm text-blue-500 hover:text-blue-700">
              查看审核历史
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <!-- 商家头像 -->
          <div class="md:col-span-1">
            <label class="block text-gray-700 font-medium mb-2">商家头像</label>
            <div class="flex flex-col items-center">
              <div class="w-32 h-32 rounded-lg bg-gray-200 overflow-hidden mb-3">
                <img src="https://picsum.photos/200/200" alt="商家头像" class="w-full h-full object-cover">
              </div>
              <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
                上传新头像
                <!-- 这里需要补充：调用本地相册上传的功能 -->
              </button>
            </div>
          </div>

          <!-- 商家基本信息 -->
          <div class="md:col-span-3 space-y-4">
            <div>
              <label class="block text-gray-700 font-medium mb-1">商家名称</label>
              <input type="text" placeholder="请输入商家名称" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <!-- 这里需要补充：名称验证逻辑和错误提示 -->
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-1">商家描述</label>
              <textarea placeholder="描述您的商家特色..." rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              <!-- 这里需要补充：描述长度限制和错误提示 -->
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-1">商家分类</label>
              <select class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">请选择分类</option>
                <option value="restaurant">餐厅</option>
                <option value="retail">零售</option>
                <option value="service">服务</option>
                <option value="other">其他</option>
              </select>
              <!-- 这里需要补充：分类选择的状态管理 -->
            </div>
          </div>
        </div>
      </div>

      <!-- 左侧：营业时间和联系方式 -->
      <div class="md:col-span-6 space-y-6">
        <!-- 营业时间 -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">营业时间</h2>

          <div class="space-y-3">
            <!-- 周一至周日的营业时间设置 -->
            <div v-for="day in 7" :key="day" class="p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium">{{ ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][day-1] }}</span>
                <label class="inline-flex items-center">
                  <input type="checkbox" class="form-checkbox h-4 w-4 text-blue-500 rounded">
                  <span class="ml-1">营业</span>
                </label>
              </div>

              <div class="flex items-center space-x-2">
                <input type="time" class="w-32 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <span>-</span>
                <input type="time" class="w-32 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">

                <button class="ml-auto text-red-500 hover:text-red-700">
                  <i class="fa fa-plus-circle"></i> 添加时间段
                </button>
              </div>

              <!-- 额外时间段（默认隐藏） -->
              <div class="mt-2 hidden">
                <div class="flex items-center space-x-2">
                  <input type="time" class="w-32 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <span>-</span>
                  <input type="time" class="w-32 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">

                  <button class="ml-auto text-red-500 hover:text-red-700">
                    <i class="fa fa-minus-circle"></i> 移除
                  </button>
                </div>
              </div>
            </div>

            <!-- 特殊日期设置 -->
            <div class="p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium">特殊日期</span>
                <button class="text-blue-500 hover:text-blue-700 text-sm">
                  <i class="fa fa-plus"></i> 添加特殊日期
                </button>
              </div>

              <div class="text-sm text-gray-500 italic">
                例如节假日的特殊营业时间设置
              </div>
            </div>
          </div>
        </div>

        <!-- 联系方式 -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">联系方式</h2>

          <div class="space-y-4">
            <div>
              <label class="block text-gray-700 font-medium mb-1">联系电话</label>
              <input type="tel" placeholder="请输入联系电话" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <!-- 这里需要补充：电话号码验证逻辑 -->
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-1">备用电话</label>
              <input type="tel" placeholder="请输入备用电话（选填）" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-1">电子邮箱</label>
              <input type="email" placeholder="请输入电子邮箱" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <!-- 这里需要补充：邮箱验证逻辑 -->
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-1">商家地址</label>
              <div class="flex flex-col md:flex-row md:items-center gap-2">
                <div class="flex-1">
                  <input type="text" placeholder="省份/城市/区域" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div class="flex-1">
                  <input type="text" placeholder="街道/门牌号" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
              </div>

              <div class="mt-2">
                <button class="flex items-center text-blue-500 hover:text-blue-700">
                  <i class="fa fa-map-marker mr-1"></i> 在地图上选择位置
                  <!-- 这里需要补充：打开地图选择器的功能 -->
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：配送设置 -->
      <div class="md:col-span-6 space-y-6">
        <!-- 配送范围设置 -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">配送范围设置</h2>

          <div class="space-y-4">
            <div>
              <label class="block text-gray-700 font-medium mb-1">配送方式</label>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label class="inline-flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" class="form-checkbox h-4 w-4 text-blue-500 rounded">
                  <span class="ml-2">商家自配送</span>
                </label>
                <label class="inline-flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" class="form-checkbox h-4 w-4 text-blue-500 rounded">
                  <span class="ml-2">平台配送</span>
                </label>
                <label class="inline-flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" class="form-checkbox h-4 w-4 text-blue-500 rounded">
                  <span class="ml-2">顾客自提</span>
                </label>
              </div>
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-1">配送范围（公里）</label>
              <input type="number" min="0" step="0.1" placeholder="请输入配送范围" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">

              <div class="mt-2">
                <div class="h-40 bg-gray-100 rounded-md overflow-hidden">
                  <!-- 这里需要补充：配送范围地图可视化 -->
                  <div class="w-full h-full flex items-center justify-center text-gray-500">
                    <i class="fa fa-map-o mr-2"></i> 配送范围地图将显示在这里
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-1">配送费设置</label>

              <div class="space-y-3">
                <div class="p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-medium">基础配送费</span>
                    <div class="flex items-center">
                      <span class="mr-1">¥</span>
                      <input type="number" min="0" step="0.1" value="5" class="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                  </div>
                </div>

                <div class="p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-medium">满减配送费</span>
                    <button class="text-blue-500 hover:text-blue-700 text-sm">
                      <i class="fa fa-plus"></i> 添加规则
                    </button>
                  </div>

                  <div class="text-sm text-gray-500 italic">
                    例如：满30元免配送费
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 其他设置 -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">其他设置</h2>

          <div class="space-y-4">
            <div class="p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium">接受在线预订</h3>
                  <p class="text-sm text-gray-500">允许顾客在线预订座位或商品</p>
                </div>
                <label class="inline-flex items-center">
                  <input type="checkbox" class="form-checkbox h-5 w-5 text-blue-500 rounded">
                  <span class="ml-2">开启</span>
                </label>
              </div>
            </div>

            <div class="p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium">接受外卖订单</h3>
                  <p class="text-sm text-gray-500">允许顾客在线订购外卖</p>
                </div>
                <label class="inline-flex items-center">
                  <input type="checkbox" class="form-checkbox h-5 w-5 text-blue-500 rounded">
                  <span class="ml-2">开启</span>
                </label>
              </div>
            </div>

            <div class="p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium">显示在推荐列表</h3>
                  <p class="text-sm text-gray-500">在平台推荐商家列表中展示</p>
                </div>
                <label class="inline-flex items-center">
                  <input type="checkbox" class="form-checkbox h-5 w-5 text-blue-500 rounded">
                  <span class="ml-2">开启</span>
                </label>
              </div>
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
        保存并提交审核
        <!-- 这里需要补充：提交表单到后端的功能 -->
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.merchant-settings-container {
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

  .hidden {
    display: none;
  }
}
</style>