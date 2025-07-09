<script setup lang="ts">
import { ref } from 'vue'
import {getCurMerchantInfo} from "@/api/merchant"
import {useMerchantInfoStore} from "@/stores/merchantInfo";
const merchantInfoStore = useMerchantInfoStore();
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";
import {Plus} from "@element-plus/icons-vue";
const router = useRouter();

const getMerchantInfo = ()=>{
  getCurMerchantInfo().then(res => {
    if(!res.data){
      ElMessage({
        message:'未登入',
        type:'warning'
      })
      router.push({path:'/login'})
    }else{
      merchantInfoStore.setMerchantInfo(res.data)
    }
  })
}

const formData = ref(
    {
      id:merchantInfoStore.id,
      username:merchantInfoStore.username,
      password:merchantInfoStore.password,
      email:merchantInfoStore.email,
      phone:merchantInfoStore.phone,
      avatar:merchantInfoStore.avatar,
      createTime:merchantInfoStore.createTime,
      updateTime:merchantInfoStore.updateTime,
    }
)

const imageUrl = ref('')
// 头像上传成功处理
const handleAvatarSuccess = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
  formData.value.avatar = response.data.url;
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
              <el-button type="text" >查看审核历史</el-button>
            </div>
          </div>
        </template>

        <el-row :gutter="20">
          <!-- 商家头像 -->
          <el-col :span="6">
            <el-form-item label="修改头像">
              <div class="flex flex-col items-center">
                <div>
                  <el-upload
                      class="avatar-uploader"
                      action="/api/file/upload"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess"
                  >
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" alt="avatar"/>
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                  </el-upload>
                </div>
              </div>
            </el-form-item>
          </el-col>

          <!-- 商家基本信息 -->
          <el-col :span="18">
            <el-form label-width="120px">
              <el-form-item label="商家名称" prop="name">
                <el-input v-model="formData.username" placeholder="请输入商家名称"></el-input>
              </el-form-item>
              <el-form-item label="商家描述" prop="description">
                <el-input
                    type="textarea"
                    placeholder="描述您的商家特色..."
                    :rows="3"
                ></el-input>
              </el-form-item>
              <el-form-item label="商家分类" prop="category">
                <el-select placeholder="请选择分类">
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
            <el-form  label-width="120px">
              <el-form-item label="周一至周日">
                <el-checkbox-group >
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

                        placeholder="开始时间"
                    ></el-time-picker>
                  </el-col>
                  <el-col :span="2">-</el-col>
                  <el-col :span="10">
                    <el-time-picker

                        placeholder="结束时间"
                    ></el-time-picker>
                  </el-col>
                  <el-col :span="2">
                    <el-button type="text" >添加时间段</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="特殊日期">
                <el-button type="text" >添加特殊日期</el-button>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- 联系方式 -->
          <el-card class="bg-white rounded-xl shadow-md p-6">
            <template #header>
              <h2 class="text-xl font-semibold">联系方式</h2>
            </template>
            <el-form  ref="contactFormRef" label-width="120px">
              <el-form-item label="联系电话" prop="phone">
                <el-input  placeholder="请输入联系电话"></el-input>
              </el-form-item>
              <el-form-item label="备用电话" prop="backupPhone">
                <el-input  placeholder="请输入备用电话（选填）"></el-input>
              </el-form-item>
              <el-form-item label="电子邮箱" prop="email">
                <el-input  placeholder="请输入电子邮箱"></el-input>
              </el-form-item>
              <el-form-item label="商家地址" prop="address">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-input

                        placeholder="省份/城市/区域"
                    ></el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-input  placeholder="街道/门牌号"></el-input>
                  </el-col>
                </el-row>
                <el-button type="text" >
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
            <el-form  label-width="120px">
              <el-form-item label="配送方式">
                <el-checkbox-group >
                  <el-checkbox label="商家自配送">商家自配送</el-checkbox>
                  <el-checkbox label="平台配送">平台配送</el-checkbox>
                  <el-checkbox label="顾客自提">顾客自提</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="配送范围（公里）">
                <el-input-number
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

                      :min="0"
                      :step="0.1"
                  ></el-input-number>
                </el-form-item>
                <el-form-item label="满减配送费">
                  <el-button type="text" >添加规则</el-button>
                </el-form-item>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- 其他设置 看着似乎不用-->
<!--          <el-card class="bg-white rounded-xl shadow-md p-6">-->
<!--            <template #header>-->
<!--              <h2 class="text-xl font-semibold">其他设置</h2>-->
<!--            </template>-->
<!--            <el-form :model="otherSettings" label-width="120px">-->
<!--              <el-form-item label="接受在线预订">-->
<!--                <el-switch v-model="otherSettings.acceptOnlineBooking"></el-switch>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="接受外卖订单">-->
<!--                <el-switch v-model="otherSettings.acceptTakeoutOrders"></el-switch>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="显示在推荐列表">-->
<!--                <el-switch v-model="otherSettings.showInRecommendList"></el-switch>-->
<!--              </el-form-item>-->
<!--            </el-form>-->
<!--          </el-card>-->
        </el-col>
      </el-row>
    </div>

    <!-- 底部：操作按钮 -->
    <div class="mt-6 flex justify-end space-x-4">
      <el-button >取消</el-button>
      <el-button type="primary" >保存并提交审核</el-button>
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

.avatar-uploader .avatar {
  width: 150px;
  height: 150px;
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
  width: 150px;
  height: 150px;
  text-align: center;
}
</style>