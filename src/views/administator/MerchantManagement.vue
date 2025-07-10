<script lang="ts" setup>
import {ref} from 'vue';
import {ElMessage, ElMessageBox} from "element-plus";
import {
  updateMerchant,deleteMerchant
} from '../../api/admin'
import { Plus } from "@element-plus/icons-vue"
import {pageMerchants,getShopByName,getQulificationById} from '../../api/merchant'
const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString()
}

const merchantList = ref([]);
const shop = ref([]);
const Qulification = ref([]);
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
const activeDetailTab = ref('info');
// 查看详情方法
const viewDetail = async (row) => {
  try {
    activeDetailTab.value = 'info';
    currentMerchant.value = JSON.parse(JSON.stringify(row));

    // 强制初始化
    shop.value = [];
    Qulification.value = [];

    // 并行请求
    const [shopRes, qualRes] = await Promise.all([
      getShopByName({ id: row.id, username: row.username }),
      getQulificationById({ merchantId: row.id })
    ]);

    // 统一处理响应格式（兼容对象和数组）
    shop.value = normalizeArrayResponse(shopRes.data);
    Qulification.value = normalizeArrayResponse(qualRes.data);

    detailDialogVisible.value = true;
  } catch (error) {
    console.error('获取详情失败:', error);
    ElMessage.error('获取详情失败');
    shop.value = [];
    Qulification.value = [];
  }
};

// 响应数据标准化工具函数
const normalizeArrayResponse = (data) => {
  if (!data) return []; // 处理null/undefined
  if (Array.isArray(data)) return data; // 已经是数组
  return [data]; // 单个对象转为数组
};

const saveChanges = async () => {
    const submitData = {
      id: currentMerchant.value.id,
      username: currentMerchant.value.username,
      phone: currentMerchant.value.phone,
      email: currentMerchant.value.email
    };
    updateMerchant(submitData)
        .then(res => {
          if (res.status) { // 根据你的后端实际返回结构调整
            ElMessage({
              message: "编辑成功",
              type: "success",
            });
            getMerchants(); // 刷新用户列表
          } else {
            ElMessage({
              message: res.message,
              type: "warning",
            });
          }
        })
        .catch(error => {
          ElMessage({
            message: error.message || "请求失败，请稍后重试",
            type: "error",
          });
        })
        .finally(() => {
          detailDialogVisible.value = false;
        });
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
    <el-table :data="merchantList" style="width: 100%">
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
    <el-tabs v-model="activeDetailTab">
      <el-tab-pane label="基本信息" name="info">
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

      <el-tab-pane label="商铺" name="shop" lazy>
        <el-table :data="shop" style="width: 100%" border v-if="shop && shop.length > 0">
          <el-table-column prop="id" label="ID" width="80" align="center" />
          <el-table-column prop="username" label="用户名" width="120" />
          <el-table-column prop="merchantName" label="商户名称" width="150" />
          <el-table-column prop="address" label="地址" show-overflow-tooltip />
          <el-table-column prop="description" label="描述" show-overflow-tooltip />
          <el-table-column prop="categoryId" label="分类ID" width="100" align="center">
            <template #default="{row}">
              <el-tag v-if="row.categoryId">{{ row.categoryId }}</el-tag>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180">
            <template #default="{row}">
              {{ formatDate(row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column prop="isDeleted" label="状态" width="100" align="center">
            <template #default="{row}">
              <el-tag :type="row.isDeleted === 0 ? 'success' : 'danger'">
                {{ row.isDeleted === 0 ? '正常' : '已删除' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
        <el-empty description="暂无商铺数据" v-else />
      </el-tab-pane>

      <el-tab-pane label="资质信息" name="qualification" lazy>
        <el-table :data="Qulification" style="width: 100%" border v-if="Qulification && Qulification.length > 0">
          <el-table-column prop="id" label="ID" width="80" align="center" />
          <el-table-column prop="merchantId" label="商户ID" width="100" align="center" />
          <el-table-column prop="licenseNumber" label="许可证编号" width="150" align="center" />
          <el-table-column label="营业执照" width="180">
            <template #default="{row}">
              <el-image
                  v-if="row.license"
                  style="width: 100px; height: 60px"
                  :src="row.license"
                  :preview-src-list="[row.license]"
                  fit="cover"
                  hide-on-click-modal
                  preview-teleported
              />
              <span v-else>-</span>
            </template>
          </el-table-column>

          <el-table-column label="卫生许可证" width="180">
            <template #default="{row}">
              <el-image
                  v-if="row.health"
                  style="width: 100px; height: 60px"
                  :src="row.health"
                  :preview-src-list="[row.health]"
                  fit="cover"
                  hide-on-click-modal
                  preview-teleported
              />
              <span v-else>-</span>
            </template>
          </el-table-column>

          <el-table-column label="其他许可" width="150">
            <template #default="{row}">
              <el-image
                  v-if="row.otherPermit"
                  style="width: 100px; height: 60px"
                  :src="row.otherPermit"
                  :preview-src-list="[row.otherPermit]"
                  fit="cover"
                  hide-on-click-modal
                  preview-teleported
              />
              <span v-else>-</span>
            </template>
          </el-table-column>

          <el-table-column prop="status" label="审核状态" width="120" align="center">
            <template #default="{row}">
              <el-tag :type="row.status">
                {{ formatStatus(row.status) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="rejectReason" label="驳回原因" show-overflow-tooltip>
            <template #default="{row}">
              {{ row.rejectReason || '-' }}
            </template>
          </el-table-column>
        </el-table>
        <el-empty description="暂无资质数据" v-else />
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