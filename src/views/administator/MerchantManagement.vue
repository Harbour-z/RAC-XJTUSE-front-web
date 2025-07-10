<script lang="ts" setup>
import {h, ref} from 'vue';
import {ElMessage, ElMessageBox} from "element-plus";
import {
  updateMerchant,deleteMerchant
} from '../../api/admin'
import { Plus } from "@element-plus/icons-vue"
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
      return '未知状态';
  }
};

const statusTagType = (status: number) => {
  switch(status) {
    case 0: return 'warning';  // 待审核-黄色
    case 1: return 'success';  // 正常-绿色
    case 2: return 'danger';   // 未通过-红色
    case 3: return 'info';     // 已冻结-灰色
    default: return '';
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

// 详情弹窗控制
const detailDialogVisible = ref(false)
const currentMerchant = ref<any>(null)

// 审核详情对话框是否可见
const auditDialogVisible = ref(false);
// 处罚对话框是否可见
const punishDialogVisible = ref(false);

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

// 查看详情方法（合并了编辑功能）
const viewDetail = (row: any) => {
  currentMerchant.value = {...row} // 使用拷贝避免直接修改原数据
  detailDialogVisible.value = true
}

// 保存修改（合并了编辑保存功能）
const saveChanges = async () => {
  try {
    // 只提交允许修改的字段
    const submitData = {
      id: currentMerchant.value.id,
      username: currentMerchant.value.username,
      phone: currentMerchant.value.phone,
      email: currentMerchant.value.email
    };

    await updateMerchant(submitData);
    ElMessage.success('商户信息更新成功');
    getMerchants();
    detailDialogVisible.value = false;
  } catch (error) {
    ElMessage.error('更新商户信息失败');
  }
};

// 查看审核
const viewAuditDetails = (row) => {
  currentAuditMerchant.value = row;
  auditData.value = {
    auditStatus: row.status,
    auditComment: row.auditComment || '',
  };
  auditDialogVisible.value = true;
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
// 保存处罚
const savePunish = async () => {
  if (!currentPunishMerchant.value) return;

  try {
    if (punishData.value.punishMeasure === 'freeze') {
      // 冻结/解冻逻辑
      const newStatus = currentPunishMerchant.value.status === 3 ? 1 : 3; // 解冻设为1(正常)，冻结设为3
      await updateMerchant({
        id: currentPunishMerchant.value.id,
        status: newStatus,
        auditComment: currentPunishMerchant.value.status === 3 ?
            `解冻账号，原因：${punishData.value.punishReason}` :
            `冻结账号，原因：${punishData.value.punishReason}`
      });

      const action = currentPunishMerchant.value.status === 3 ? '解冻' : '冻结';
      ElMessage.success(`商户已${action}成功`);

    } else if (punishData.value.punishMeasure === 'delete') {
      // 删除逻辑
      await deleteMerchant({id: currentPunishMerchant.value.id});
      ElMessage.success('删除成功');

    } else {
      // 警告逻辑
      await updateMerchant({
        id: currentPunishMerchant.value.id,
        auditComment: `警告：${punishData.value.punishReason}`
      });
      ElMessage.success('警告已发送');
    }

    getMerchants();
    punishDialogVisible.value = false;
    punishData.value = { punishReason: '', punishMeasure: '' }; // 重置表单
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
          <el-tag :type="statusTagType(scope.row.status)">
            {{ formatStatus(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300%">
        <template #default="scope">
          <el-button type="primary" @click="viewDetail(scope.row)">详情</el-button>
          <el-button type="success" @click="viewAuditDetails(scope.row)">审核</el-button>
          <el-button type="danger" @click="punishMerchant(scope.row)">处罚管理</el-button>
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
      v-model="detailDialogVisible"
      title="商户详情与设置"
      width="70%"
  >
    <el-tabs>
      <el-tab-pane label="基本信息">
        <el-form label-width="120px">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="商户ID">
                <el-input v-model="currentMerchant.id" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="用户名">
                <el-input v-model="currentMerchant.username" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="联系电话">
                <el-input v-model="currentMerchant.phone" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电子邮箱">
                <el-input v-model="currentMerchant.email" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="注册时间">
                <el-input v-model="currentMerchant.createTime" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="最后更新时间">
                <el-input v-model="currentMerchant.updateTime" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="设置信息">
        <el-form label-width="120px">
          <el-form-item label="头像">
            <el-upload
                class="avatar-uploader"
                action="/api/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
            >
              <img v-if="currentMerchant.avatar" :src="currentMerchant.avatar" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <el-button @click="detailDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="saveChanges">保存</el-button>
    </template>
  </el-dialog>

  <!-- 其他弹窗保持不变 -->
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
            <el-option
                :label="currentPunishMerchant?.status === 3 ? '解冻账号' : '冻结账号'"
                value="freeze"
            />
            <el-option label="删除账号" value="delete" />
          </el-select>
        </el-form-item>
        <el-form-item
            label="处罚原因"
            v-if="punishData.punishMeasure === 'warning' || punishData.punishMeasure === 'delete'"
        >
          <el-input v-model="punishData.punishReason" type="textarea" />
        </el-form-item>
        <el-form-item
            :label="currentPunishMerchant?.status === 3 ? '解冻说明' : '冻结原因'"
            v-else
        >
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
.page-container {
  margin: 20px;
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