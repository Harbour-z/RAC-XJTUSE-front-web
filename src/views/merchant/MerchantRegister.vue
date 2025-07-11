<script setup lang="ts">
import { reactive } from 'vue'

// do not use same name with ref
const form = reactive({
  address: '',
  longitude: '',
  latitude:'',
  merchantName: '',
  username:'',
  licenseNumber: '',
  categoryId: '',
  description: '',
  license:'',
  health:'',
  otherPermit:[],
})
//提交注册表
import {merchantRegister} from "../../api/merchant";
const onSubmit = () => {
  merchantRegister(form)
      .then(res => {
        if (res.status == true || res.success) { // 假设成功返回的code是200或有success字段
          console.log('submit!');
          alert("店铺创建成功！")
          // 这里可以添加成功后的其他操作，比如跳转页面等
        } else {
          // 显示后端返回的错误信息
          console.error(res.message || '店铺创建失败');
          // 这里可以添加错误提示，比如使用alert或UI组件的提示
          alert(res.message || '店铺创建失败');
        }
      })
      .catch(error => {
        console.error('请求失败:', error);
        // 处理网络错误或其他异常
        alert('请求失败，请稍后重试');
      });
};


//图片列的
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'

import type { UploadProps, UploadUserFile } from 'element-plus'

const fileList = ref<UploadUserFile[]>([])

const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}
const handleOtherSuccess = (res, uploadFile) => {
  console.log(res)
  console.log(uploadFile)
  console.log(uploadFile.response.data.url)
  form.otherPermit.push(uploadFile.response.data.url)
}

const handlePictureCardPreview = (res,uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

//自适应输入框
const textarea2 = ref('')

//许可证图片栏
const imageUrl1 = ref('')
const handleLicenseSuccess = (res, uploadFile) => {
  imageUrl1.value = URL.createObjectURL(uploadFile.raw!)
  form["license"] = res.data.url;
}
//卫生许证
const imageUrl2 = ref('')
const handleHealthSuccess = (res, uploadFile) => {
  imageUrl2.value = URL.createObjectURL(uploadFile.raw!)
  form["health"] = res.data.url;
}

</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header><h2 class="txt-style-mega-light txt-block-title__title">现在开始注册属于你的店铺！</h2></el-header>
      <el-main>
        <el-form :model="form" label-width="auto" style="max-width: 600px">
          <el-form-item label="店铺名字">
            <el-input v-model="form.merchantName" placeholder="请输入店铺名字" />
          </el-form-item>
          <el-form-item label="店面地址">
            <el-input v-model="form.address" placeholder="请输入店面地址" />
            <el-input v-model="form.longitude" placeholder="经度" />
            <el-input v-model="form.latitude" placeholder="纬度" />
          </el-form-item>
          <el-form-item label="负责人">
            <el-input v-model="form.username" placeholder="请输入店铺负责人姓名" />
          </el-form-item>
          <el-form-item label="营业许可编号">
            <el-input v-model="form.licenseNumber" placeholder="请输入对应的营业许可编号" />
          </el-form-item>

          <el-form-item label="许可证图片">
            <el-upload
                class="avatar-uploader"
                action="/api/file/upload"
                :show-file-list="false"
                :on-success="handleLicenseSuccess"
            >
            <img v-if="imageUrl1" :src="imageUrl1" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          </el-form-item>


          <el-form-item label="其它许可证照片">
            <el-upload
                v-model:file-list="fileList"
                action="/api/file/upload"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-success="handleOtherSuccess"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>

            <el-dialog v-model="dialogVisible">
              <img w-full :src="dialogImageUrl" alt="Preview Image" />
            </el-dialog>
          </el-form-item>


          <el-form-item label="卫生许可证图片">
            <el-upload
                class="avatar-uploader"
                action="/api/file/upload"
                :show-file-list="false"
                :on-success="handleHealthSuccess"
            >
              <img v-if="imageUrl2" :src="imageUrl2" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
<!--      注释功能暂时弃置    <el-form-item label="Activity time">-->
<!--            <el-col :span="11">-->
<!--              <el-date-picker-->
<!--                  v-model="form.date1"-->
<!--                  type="date"-->
<!--                  placeholder="Pick a date"-->
<!--                  style="width: 100%"-->
<!--              />-->
<!--            </el-col>-->
<!--            <el-col :span="2" class="text-center">-->
<!--              <span class="text-gray-500">-</span>-->
<!--            </el-col>-->
<!--            <el-col :span="11">-->
<!--              <el-time-picker-->
<!--                  v-model="form.date2"-->
<!--                  placeholder="Pick a time"-->
<!--                  style="width: 100%"-->
<!--              />-->
<!--            </el-col>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="是否接受外卖订单">-->
<!--            <el-switch v-model="form.delivery" />-->
<!--          </el-form-item>-->
          <el-form-item label="商品类别">
            <el-radio-group v-model="form.categoryId" >
              <el-radio-button label="中餐" value="1" />
              <el-radio-button label="西餐" value="2" />
              <el-radio-button label="日料" value="3" />
              <el-radio-button label="甜品" value="4" />
              <el-radio-button label="快餐" value="5" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="对店铺的描述">
            <el-input
                v-model="form.description"
                style="width: 240px"
                :autosize="{ minRows: 2, maxRows: 4 }"
                type="textarea"
                placeholder="在这里输入对您店面的描述"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">Create</el-button>
            <el-button>Cancel</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped lang="scss">

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