<script setup lang="ts">
import { reactive } from 'vue'

// do not use same name with ref
const form = reactive({
  address: '',
  logitude: '',
  latitude:'',
  merchantName: '',
  licenseNumber: '',
  type: [],
  description: '',
})

const onSubmit = () => {
  console.log('submit!')
}


//图片列的
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'

import type { UploadProps, UploadUserFile } from 'element-plus'

const fileList = ref<UploadUserFile[]>([
  {
    name: 'food.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
  {
    name: 'plant-1.png',
    url: '/images/plant-1.png',
  },
  {
    name: 'food.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
  {
    name: 'plant-2.png',
    url: '/images/plant-2.png',
  },
  {
    name: 'food.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
  {
    name: 'figure-1.png',
    url: '/images/figure-1.png',
  },
  {
    name: 'food.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
  {
    name: 'figure-2.png',
    url: '/images/figure-2.png',
  },
])

const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

//自适应输入框
const textarea2 = ref('')

//许可证图片栏
import { ElMessage } from 'element-plus'
const imageUrl = ref('')
const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header><h2 class="txt-style-mega-light txt-block-title__title">现在开始注册属于你的店铺！</h2></el-header>
      <el-main>
        <el-form :model="form" label-width="auto" style="max-width: 600px">
          <el-form-item label="店面地址">
            <el-input v-model="form.address" placeholder="请输入店面地址" />
            <el-input v-model="form.logitude" placeholder="经度" />
            <el-input v-model="form.latitude" placeholder="纬度" />
          </el-form-item>
          <el-form-item label="负责人">
            <el-input v-model="form.merchantName" placeholder="请输入店铺负责人姓名" />
          </el-form-item>
          <el-form-item label="营业许可编号">
            <el-input v-model="form.licenseNumber" placeholder="请输入对应的营业许可编号" />
          </el-form-item>
          <el-form-item label="许可证图片">
            <el-upload
              class="avatar-uploader"
              action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          </el-form-item>
          <el-form-item label="其它许可证照片">
            <el-upload
                v-model:file-list="fileList"
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
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
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
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
            <el-checkbox-group v-model="form.type">
              <el-checkbox value="中餐" name="type">
                中餐
              </el-checkbox>
              <el-checkbox value="西餐" name="type">
                西餐
              </el-checkbox>
              <el-checkbox value="日料" name="type">
                日料
              </el-checkbox>
              <el-checkbox value="中东料理" name="type">
                中东料理
              </el-checkbox>
              <el-checkbox value="泰料" name="type">
                泰料
              </el-checkbox>
            </el-checkbox-group>
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