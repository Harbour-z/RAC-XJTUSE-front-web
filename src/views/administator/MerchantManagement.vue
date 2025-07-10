<script lang="ts" setup>
import {h, ref} from 'vue';
import {ElMessage, ElMessageBox} from "element-plus";
import {
  updateMerchant,deleteMerchant
} from '../../api/admin'
import {pageMerchants} from '../../api/merchant'

const merchantList = ref([]);
const searchUsername = ref('');
const searchStatus = ref(0);
const pageNum = ref(1);
const pageSize = ref(10);
const total = ref(0)

// 处理分页大小改变
const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  getMerchants();
};
// 处理当前页码改变
const handleCurrentChange = (newPage) => {
  pageNum.value = newPage;
  getMerchants();
};

const formatStatus = (status: number) => {
  switch(status) {
    case 0:
      return '待审核'
    case 1:
      return '已通过'
    case 2:
      return '未通过'
    case 3:
      return '冻结'
    default:
      throw new Error('未知用户身份')
  }
};

const getMerchants = () => {
  const query = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    username: searchUsername.value,
    status: searchStatus.value
  }

  pageMerchants(query).then(res => {
    merchantList.value = res.data.records
    total.value = res.data.total
  })
}

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

// 编辑商家
const editMerchant = (row) => {
  editMerchantData.value = { ...row };
  editDialogVisible.value = true;
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
  punishDialogVisible.value = true;
  currentPunishMerchant.value = row;
  punishData.value = {
    punishReason: '',
    punishMeasure: '',
  };
};

// 保存处罚
const savePunish = async () => {
  if (!currentPunishMerchant.value) return;

  try {
    if (punishData.value.punishMeasure === 'freeze') {
      const newStatus = currentPunishMerchant.value.status === 3 ? 0 : 3;
      await updateMerchant({id: currentPunishMerchant.value.id, status: newStatus});
      ElMessage.success(`商户已${newStatus === 3 ? '冻结' : '解冻'}`);
    } else if (punishData.value.punishMeasure === 'delete') {
      await deleteMerchant({id: currentPunishMerchant.value.id});
      ElMessage.success('删除成功');
    } else {
      ElMessage.success('处罚措施已执行');
    }

    getMerchants();
    punishDialogVisible.value = false;
  } catch (error) {
    ElMessage.error('操作失败');
  }
};

getMerchants();
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>商家列表</span>
      </div>
    </template>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="商户名">
        <el-input placeholder="商户名" clearable v-model="searchUsername"/>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select v-model="searchStatus" placeholder="请选择审核状态" style="width: 150px;">
          <el-option label="待审核" :value="0" />
          <el-option label="已通过" :value="1" />
          <el-option label="未通过" :value="2" />
          <el-option label="冻结" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getMerchants">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="merchantList" height="500" style="width: 100%">
      <el-table-column prop="username" label="商户名称" width="150%"/>
      <el-table-column prop="phone" label="电话" />
      <el-table-column prop="email" label="邮箱" width="200%" />
      <el-table-column prop="createTime" label="注册时间" />
      <el-table-column label="账号状态">
        <template #default="scope">
          {{ formatStatus(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300%">
        <template #default="scope">
          <el-button type="primary" @click="editMerchant(scope.row)">编辑</el-button>
          <el-button type="success" @click="viewAuditDetails(scope.row)">审核详情</el-button>
          <el-button type="warning" @click="punishMerchant(scope.row)">处罚</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        :page-sizes="[5, 10, 20, 30, 40]"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
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
          <el-input v-model="auditData.auditComment" type="text" placeholder="请注意社区规范"/>
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
      v-model="punishDialogVisible"
      width="500"
  >
    <span>
      <el-form label-width="auto" style="max-width: 600px">
        <el-form-item label="处罚措施">
          <el-select v-model="punishData.punishMeasure">
            <el-option label="警告" value="warning" />
            <el-option label="冻结账号" value="freeze" />
            <el-option label="删除账号" value="delete" />
          </el-select>
        </el-form-item>
        <el-form-item label="处罚原因">
          <el-input v-model="punishData.punishReason" type="textarea" />
        </el-form-item>
      </el-form>
    </span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="punishDialogVisible = false;">取消</el-button>
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