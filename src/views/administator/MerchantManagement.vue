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
  id: '',
  username: '',
  phone: '',
  email: ''
});

// 审核数据
const auditData = ref({
  auditStatus: 0,
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
  editMerchantData.value = {
    id: row.id,
    username: row.username,
    phone: row.phone,
    email: row.email
  };
  editDialogVisible.value = true;
};

// 查看审核详情
const viewAuditDetails = (row) => {
  currentAuditMerchant.value = row;
  auditData.value = {
    auditStatus: row.status,
    auditComment: row.auditComment || '',
  };
  auditDialogVisible.value = true;
};

// 取消编辑
const cancelEdit = () => {
  editDialogVisible.value = false;
};
// 保存编辑
const saveEdit = async () => {
  try {
    // 只提交允许修改的字段
    const submitData = {
      id: editMerchantData.value.id,
      username: editMerchantData.value.username,
      phone: editMerchantData.value.phone,
      email: editMerchantData.value.email
    };

    await updateMerchant(submitData);
    ElMessage.success('商户信息更新成功');
    getMerchants();
    editDialogVisible.value = false;
  } catch (error) {
    ElMessage.error('更新商户信息失败');
  }
};
// 取消审核
const cancelAudit = () => {
  auditDialogVisible.value = false;
};
// 保存审核
const saveAudit = async () => {
  if (!currentAuditMerchant.value) return;

  try {
    await updateMerchant({
      id: currentAuditMerchant.value.id,
      status: auditData.value.auditStatus,
      auditComment: auditData.value.auditComment
    });

    ElMessage.success('审核状态已更新');
    getMerchants();
    auditDialogVisible.value = false;
  } catch (error) {
    ElMessage.error('更新审核状态失败');
  }
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

// 处理文件上传成功
const handleFileUploadSuccess = (response, file, fileList) => {
  console.log('File upload success:', response);
};
// 处理图片上传成功
const handleImageUploadSuccess = (response, file, fileList) => {
  console.log('Image upload success:', response);
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
      v-model="editDialogVisible"
      width="500"
  >
    <el-form label-width="100px" style="max-width: 500px">
      <el-form-item label="商户ID" prop="id">
        <el-input v-model="editMerchantData.id" disabled />
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="editMerchantData.username" />
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="editMerchantData.phone" />
      </el-form-item>
      <el-form-item label="电子邮箱" prop="email">
        <el-input v-model="editMerchantData.email" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelEdit">取消</el-button>
        <el-button type="primary" @click="saveEdit">确认</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
      title="审核详情"
      v-model="auditDialogVisible"
      width="500"
  >
    <span>
      <el-form label-width="auto" style="max-width: 600px">
        <el-form-item label="当前状态">
          <el-tag :type="formatStatus(currentAuditMerchant?.status)">
            {{ formatStatus(currentAuditMerchant?.status) }}
          </el-tag>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="auditData.auditStatus">
            <el-option label="待审核" :value="0" />
            <el-option label="已通过" :value="1" />
            <el-option label="未通过" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item
            label="审核意见"
            v-if="auditData.auditStatus === 2"
        >
          <el-input
              v-model="auditData.auditComment"
              type="textarea"
              placeholder="请输入未通过原因"
              :rows="3"
          />
        </el-form-item>
        <el-form-item
            label="备注信息"
            v-else
        >
          <el-input
              v-model="auditData.auditComment"
              type="textarea"
              placeholder="可输入备注信息"
              :rows="3"
          />
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