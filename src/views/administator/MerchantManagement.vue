<script lang="ts" setup>
import { ref } from 'vue';

// 编辑对话框是否可见
const editDialogVisible = ref(false);
// 审核详情对话框是否可见
const auditDialogVisible = ref(false);
// 处罚对话框是否可见
const punishDialogVisible = ref(false);
// 编辑的商家数据
const editMerchantData = ref({
  merchantName: '',
  qualificationFiles: '',
  storeInfo: '',
  storeImages: '',
});
// 审核数据
const auditData = ref({
  auditStatus: 'pending',
  auditComment: '',
});
// 处罚数据
const punishData = ref({
  punishReason: '',
  punishMeasure: '',
});
// 当前审核的商家
const currentAuditMerchant = ref(null);
// 当前处罚的商家
const currentPunishMerchant = ref(null);

// 删除商家
const deleteMerchant = (row) => {
  // 实现删除逻辑
  console.log('Delete merchant:', row);
};

// 编辑商家
const editMerchant = (row) => {
  editMerchantData.value = { ...row };
  editDialogVisible.value = true;
};

// 冻结商家
const freezeMerchant = (row) => {
  // 实现冻结逻辑
  console.log('Freeze merchant:', row);
};

// 查看审核详情
const viewAuditDetails = (row) => {
  currentAuditMerchant.value = row;
  auditData.value = {
    auditStatus: row.auditStatus,
    auditComment: '',
  };
  auditDialogVisible.value = true;
};

// 取消编辑
const cancelEdit = () => {
  editDialogVisible.value = false;
};

// 保存编辑
const saveEdit = () => {
  // 实现保存编辑逻辑
  console.log('Save edit:', editMerchantData.value);
  editDialogVisible.value = false;
};

// 取消审核
const cancelAudit = () => {
  auditDialogVisible.value = false;
};

// 保存审核
const saveAudit = () => {
  // 实现保存审核逻辑
  if (currentAuditMerchant.value) {
    currentAuditMerchant.value.auditStatus = auditData.value.auditStatus;
    if (auditData.value.auditStatus === 'rejected') {
      // 通知商家审核不通过及原因
      console.log('Notify merchant:', currentAuditMerchant.value.merchantName, 'Rejected reason:', auditData.value.auditComment);
    } else if (auditData.value.auditStatus === 'approved') {
      // 允许用户评论商家
      console.log('Allow users to comment on merchant:', currentAuditMerchant.value.merchantName);
    }
  }
  console.log('Save audit:', auditData.value);
  auditDialogVisible.value = false;
};

// 处理文件上传成功
const handleFileUploadSuccess = (response, file, fileList) => {
  // 实现文件上传成功逻辑
  console.log('File upload success:', response);
};

// 处理图片上传成功
const handleImageUploadSuccess = (response, file, fileList) => {
  // 实现图片上传成功逻辑
  console.log('Image upload success:', response);
};

// 处罚商家
const punishMerchant = (row) => {
  currentPunishMerchant.value = row;
  punishData.value = {
    punishReason: '',
    punishMeasure: '',
  };
  punishDialogVisible.value = true;
};

// 取消处罚
const cancelPunish = () => {
  punishDialogVisible.value = false;
};

// 保存处罚
const savePunish = () => {
  if (currentPunishMerchant.value) {
    console.log('Punish merchant:', currentPunishMerchant.value.merchantName, 'Reason:', punishData.value.punishReason, 'Measure:', punishData.value.punishMeasure);
    if (punishData.value.punishMeasure === 'freeze') {
      freezeMerchant(currentPunishMerchant.value);
    } else if (punishData.value.punishMeasure === 'delete') {
      deleteMerchant(currentPunishMerchant.value);
    }
  }
  punishDialogVisible.value = false;
};
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>商家列表</span>
      </div>
    </template>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="商家名称">
        <el-input placeholder="商家名称" clearable />
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select placeholder="请选择审核状态" style="width: 150px;">
          <el-option label="待审核" value="pending" />
          <el-option label="已通过" value="approved" />
          <el-option label="未通过" value="rejected" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table height="500" style="width: 100%">
      <el-table-column prop="merchantName" label="商家名称" />
      <el-table-column prop="qualificationFiles" label="资质文件" />
      <el-table-column prop="storeInfo" label="店铺信息" />
      <el-table-column prop="storeImages" label="店铺图片" />
      <el-table-column prop="registrationTime" label="注册时间" />
      <el-table-column prop="auditStatus" label="审核状态" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="danger" @click="deleteMerchant(scope.row)">删除</el-button>
          <el-button type="primary" @click="editMerchant(scope.row)">编辑</el-button>
          <el-button type="warning" @click="freezeMerchant(scope.row)">冻结</el-button>
          <el-button type="success" @click="viewAuditDetails(scope.row)">审核详情</el-button>
          <el-button type="info" @click="punishMerchant(scope.row)">处罚</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        :page-sizes="[5, 10, 20, 30, 40]"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
    />
  </el-card>
  <el-dialog
      title="商家信息编辑"
      :visible.sync="editDialogVisible"
      width="500"
  >
    <span>
      <el-form label-width="auto" style="max-width: 600px">
        <el-form-item label="商家名称">
          <el-input v-model="editMerchantData.merchantName" />
        </el-form-item>
        <el-form-item label="资质文件">
          <el-upload
              class="file-uploader"
              action="/api/file/upload"
              :show-file-list="false"
              :on-success="handleFileUploadSuccess"
          >
            <el-icon class="file-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="店铺信息">
          <el-input v-model="editMerchantData.storeInfo" type="textarea" />
        </el-form-item>
        <el-form-item label="店铺图片">
          <el-upload
              class="image-uploader"
              action="/api/file/upload"
              :show-file-list="false"
              :on-success="handleImageUploadSuccess"
          >
            <el-icon class="image-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
    </span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelEdit">取消</el-button>
        <el-button type="primary" @click="saveEdit">确认</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
      title="审核详情"
      :visible.sync="auditDialogVisible"
      width="500"
  >
    <span>
      <el-form label-width="auto" style="max-width: 600px">
        <el-form-item label="审核状态">
          <el-select v-model="auditData.auditStatus">
            <el-option label="待审核" value="pending" />
            <el-option label="已通过" value="approved" />
            <el-option label="未通过" value="rejected" />
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见">
          <el-input v-model="auditData.auditComment" type="textarea" />
        </el-form-item>
      </el-form>
    </span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelAudit">取消</el-button>
        <el-button type="primary" @click="saveAudit">确认</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
      title="处罚商家"
      :visible.sync="punishDialogVisible"
      width="500"
  >
    <span>
      <el-form label-width="auto" style="max-width: 600px">
        <el-form-item label="处罚原因">
          <el-input v-model="punishData.punishReason" type="textarea" />
        </el-form-item>
        <el-form-item label="处罚措施">
          <el-select v-model="punishData.punishMeasure">
            <el-option label="警告" value="warning" />
            <el-option label="冻结账号" value="freeze" />
            <el-option label="删除账号" value="delete" />
          </el-select>
        </el-form-item>
      </el-form>
    </span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelPunish">取消</el-button>
        <el-button type="primary" @click="savePunish">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.file-uploader .el-upload,
.image-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.file-uploader .el-upload:hover,
.image-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.file-uploader-icon,
.el-icon.image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>