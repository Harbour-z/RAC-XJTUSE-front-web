<script setup lang="ts">
import { ref } from 'vue'

// 表单数据模型
const merchantInfo = ref({
  avatar: '',
  name: '',
  description: '',
  category: ''
})
const businessHours = ref({
  days: [],
  startTime: '',
  endTime: '',
  specialDates: []
})
const contactInfo = ref({
  phone: '',
  backupPhone: '',
  email: '',
  province: '',
  street: ''
})
const deliverySettings = ref({
  deliveryMethods: [],
  deliveryRange: 0,
  baseFee: 5,
  deliveryFeeRules: []
})
const otherSettings = ref({
  acceptOnlineBooking: false,
  acceptTakeoutOrders: false,
  showInRecommendList: false
})

// 表单引用
const merchantFormRef = ref(null)
const contactFormRef = ref(null)

// 上传地址
const uploadUrl = 'your_upload_api_url'

// 查看审核历史
const viewAuditHistory = () => {
  console.log('查看审核历史')
}

// 处理头像上传成功
const handleAvatarUploadSuccess = (response, file, fileList) => {
  merchantInfo.value.avatar = response.url
}

// 添加时间段
const addTimePeriod = () => {
  console.log('添加时间段')
}

// 添加特殊日期
const addSpecialDate = () => {
  console.log('添加特殊日期')
}

// 打开地图选择器
const openMapSelector = () => {
  console.log('打开地图选择器')
}

// 添加配送费规则
const addDeliveryFeeRule = () => {
  console.log('添加配送费规则')
}

// 重置表单
const resetForm = () => {
  merchantFormRef.value.resetFields()
  contactFormRef.value.resetFields()
  // 重置其他表单数据
  merchantInfo.value = {
    avatar: '',
    name: '',
    description: '',
    category: ''
  }
  businessHours.value = {
    days: [],
    startTime: '',
    endTime: '',
    specialDates: []
  }
  contactInfo.value = {
    phone: '',
    backupPhone: '',
    email: '',
    province: '',
    street: ''
  }
  deliverySettings.value = {
    deliveryMethods: [],
    deliveryRange: 0,
    baseFee: 5,
    deliveryFeeRules: []
  }
  otherSettings.value = {
    acceptOnlineBooking: false,
    acceptTakeoutOrders: false,
    showInRecommendList: false
  }
}

// 提交表单
const submitForm = () => {
  // 表单验证
  merchantFormRef.value.validate((valid) => {
    if (valid) {
      // 提交表单到后端
      console.log('提交表单到后端', {
        merchantInfo: merchantInfo.value,
        businessHours: businessHours.value,
        contactInfo: contactInfo.value,
        deliverySettings: deliverySettings.value,
        otherSettings: otherSettings.value
      })
    } else {
      console.log('表单验证失败')
    }
  })
}
</script>

<template>
  <div class="merchant-settings-container">
    <el-card class="settings-header">
      <template #header>
        <h1 class="text-2xl font-bold mb-4">商家设置</h1>
      </template>
      <p class="text-gray-500 mb-6">设置和管理您的商家信息</p>
    </el-card>

    <div class="settings-content">
      <!-- 商家信息卡片 -->
      <el-card class="md:col-span-12 bg-white rounded-xl shadow-md p-6 mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold">商家信息</h2>
            <div class="flex items-center">
              <el-tag type="warning">审核中</el-tag>
              <el-button type="text" @click="viewAuditHistory">查看审核历史</el-button>
            </div>
          </div>
        </template>

        <el-row :gutter="20">
          <!-- 商家头像 -->
          <el-col :span="6">
            <el-form-item label="商家头像">
              <div class="flex flex-col items-center">
                <img
                    :src="merchantInfo.avatar || 'https://picsum.photos/200/200'"
                    alt="商家头像"
                    class="w-32 h-32 rounded-lg bg-gray-200 overflow-hidden mb-3"
                />
                <el-upload
                    :action="uploadUrl"
                    :on-success="handleAvatarUploadSuccess"
                    :show-file-list="false"
                >
                  <el-button type="primary">上传新头像</el-button>
                </el-upload>
              </div>
            </el-form-item>
          </el-col>

          <!-- 商家基本信息 -->
          <el-col :span="18">
            <el-form :model="merchantInfo" ref="merchantFormRef" label-width="120px">
              <el-form-item label="商家名称" prop="name">
                <el-input v-model="merchantInfo.name" placeholder="请输入商家名称"></el-input>
              </el-form-item>
              <el-form-item label="商家描述" prop="description">
                <el-input
                    v-model="merchantInfo.description"
                    type="textarea"
                    placeholder="描述您的商家特色..."
                    :rows="3"
                ></el-input>
              </el-form-item>
              <el-form-item label="商家分类" prop="category">
                <el-select v-model="merchantInfo.category" placeholder="请选择分类">
                  <el-option label="餐厅" value="restaurant"></el-option>
                  <el-option label="零售" value="retail"></el-option>
                  <el-option label="服务" value="service"></el-option>
                  <el-option label="其他" value="other"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-card>

      <!-- 左侧：营业时间和联系方式 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <!-- 营业时间 -->
          <el-card class="bg-white rounded-xl shadow-md p-6">
            <template #header>
              <h2 class="text-xl font-semibold">营业时间</h2>
            </template>
            <el-form :model="businessHours" label-width="120px">
              <el-form-item label="周一至周日">
                <el-checkbox-group v-model="businessHours.days">
                  <el-checkbox
                      v-for="(day, index) in ['周一', '周二', '周三', '周四', '周五', '周六', '周日']"
                      :key="index"
                      :label="day"
                  >
                    {{ day }}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="时间段">
                <el-row :gutter="20">
                  <el-col :span="10">
                    <el-time-picker
                        v-model="businessHours.startTime"
                        placeholder="开始时间"
                    ></el-time-picker>
                  </el-col>
                  <el-col :span="2">-</el-col>
                  <el-col :span="10">
                    <el-time-picker
                        v-model="businessHours.endTime"
                        placeholder="结束时间"
                    ></el-time-picker>
                  </el-col>
                  <el-col :span="2">
                    <el-button type="text" @click="addTimePeriod">添加时间段</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="特殊日期">
                <el-button type="text" @click="addSpecialDate">添加特殊日期</el-button>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- 联系方式 -->
          <el-card class="bg-white rounded-xl shadow-md p-6">
            <template #header>
              <h2 class="text-xl font-semibold">联系方式</h2>
            </template>
            <el-form :model="contactInfo" ref="contactFormRef" label-width="120px">
              <el-form-item label="联系电话" prop="phone">
                <el-input v-model="contactInfo.phone" placeholder="请输入联系电话"></el-input>
              </el-form-item>
              <el-form-item label="备用电话" prop="backupPhone">
                <el-input v-model="contactInfo.backupPhone" placeholder="请输入备用电话（选填）"></el-input>
              </el-form-item>
              <el-form-item label="电子邮箱" prop="email">
                <el-input v-model="contactInfo.email" placeholder="请输入电子邮箱"></el-input>
              </el-form-item>
              <el-form-item label="商家地址" prop="address">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-input
                        v-model="contactInfo.province"
                        placeholder="省份/城市/区域"
                    ></el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-input v-model="contactInfo.street" placeholder="街道/门牌号"></el-input>
                  </el-col>
                </el-row>
                <el-button type="text" @click="openMapSelector">
                  <i class="fa fa-map-marker mr-1"></i> 在地图上选择位置
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>

        <!-- 右侧：配送设置 -->
        <el-col :span="12">
          <!-- 配送范围设置 -->
          <el-card class="bg-white rounded-xl shadow-md p-6">
            <template #header>
              <h2 class="text-xl font-semibold">配送范围设置</h2>
            </template>
            <el-form :model="deliverySettings" label-width="120px">
              <el-form-item label="配送方式">
                <el-checkbox-group v-model="deliverySettings.deliveryMethods">
                  <el-checkbox label="商家自配送">商家自配送</el-checkbox>
                  <el-checkbox label="平台配送">平台配送</el-checkbox>
                  <el-checkbox label="顾客自提">顾客自提</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="配送范围（公里）">
                <el-input-number
                    v-model="deliverySettings.deliveryRange"
                    :min="0"
                    :step="0.1"
                    placeholder="请输入配送范围"
                ></el-input-number>
                <div class="mt-2">
                  <div class="h-40 bg-gray-100 rounded-md overflow-hidden">
                    <!-- 这里需要补充：配送范围地图可视化 -->
                    <div class="w-full h-full flex items-center justify-center text-gray-500">
                      <i class="fa fa-map-o mr-2"></i> 配送范围地图将显示在这里
                    </div>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="配送费设置">
                <el-form-item label="基础配送费">
                  <el-input-number
                      v-model="deliverySettings.baseFee"
                      :min="0"
                      :step="0.1"
                  ></el-input-number>
                </el-form-item>
                <el-form-item label="满减配送费">
                  <el-button type="text" @click="addDeliveryFeeRule">添加规则</el-button>
                </el-form-item>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- 其他设置 -->
          <el-card class="bg-white rounded-xl shadow-md p-6">
            <template #header>
              <h2 class="text-xl font-semibold">其他设置</h2>
            </template>
            <el-form :model="otherSettings" label-width="120px">
              <el-form-item label="接受在线预订">
                <el-switch v-model="otherSettings.acceptOnlineBooking"></el-switch>
              </el-form-item>
              <el-form-item label="接受外卖订单">
                <el-switch v-model="otherSettings.acceptTakeoutOrders"></el-switch>
              </el-form-item>
              <el-form-item label="显示在推荐列表">
                <el-switch v-model="otherSettings.showInRecommendList"></el-switch>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 底部：操作按钮 -->
    <div class="mt-6 flex justify-end space-x-4">
      <el-button @click="resetForm">取消</el-button>
      <el-button type="primary" @click="submitForm">保存并提交审核</el-button>
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
    .el-card {
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