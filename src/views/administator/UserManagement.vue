<script lang="ts" setup>
import {h, ref} from 'vue';
import {deleteUser,updateUser} from '../../api/admin'
import {pageUsers} from '../../api/user'
import {ElMessage, ElMessageBox} from "element-plus";
import avatar from '@/assets/default.png'
// 表格数据
const userList = ref([]);
// 搜索相关
const searchUsername = ref('');
const searchStatus = ref(0);
const pageNum = ref(1);
const pageSize = ref(10);
const total = ref(0)

// 处罚弹窗相关
const punishDialogVisible = ref(false);
const currentPunishUser = ref(null);
const punishData = ref({
  punishReason: '',
  punishMeasure: '',
});

// 处理分页大小改变
const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  getUsers();
};
// 处理当前页码改变
const handleCurrentChange = (newPage) => {
  pageNum.value = newPage;
  getUsers();
};

// 计算属性：格式化状态显示
const formatStatus = (status: number) => {
  return status === 0 ? '正常' : '冻结';
};
const formatGender = (userGender: number) => {
  if (userGender == 1) return '男'
  else if(userGender == 2) return '女'
  else return '未知';
};
const getUsers = () => {
  const query = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    username: searchUsername.value,
    status: searchStatus.value
  }

  pageUsers(query).then(res => {
    userList.value = res.data.records
    total.value = res.data.total
  })
}

// 对话框相关
const editDialogVisible = ref(false);
const recordDialogVisible = ref(false);
const editUserData = ref({
  id:0,
  username: '',
  phone: '',
  email: '',
});
const recordDetails = ref('');

// 编辑用户
const editUser = (row) => {
  editUserData.value = JSON.parse(JSON.stringify(row))
  editDialogVisible.value = true;
};
// 保存编辑
const saveEdit = () => {
  const user = {
    id: editUserData.value.id,
    username: editUserData.value.username,
    phone: editUserData.value.phone,
    email: editUserData.value.email,
  };
  updateUser(user)
      .then(res => {
        console.info(res.code)
        if (res.status) { // 根据你的后端实际返回结构调整
          ElMessage({
            message: "编辑成功",
            type: "success",
          });
          getUsers(); // 刷新用户列表
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
        editDialogVisible.value = false;
      });
};

// 处罚用户
const punishUser = (row) => {
  punishDialogVisible.value = true;
  currentPunishUser.value = row;
  punishData.value = {
    punishReason: '',
    punishMeasure: '',
  };
};

// 保存处罚
const savePunish = async () => {
  if (!currentPunishUser.value) return;

  try {
    if (punishData.value.punishMeasure === 'freeze') {
      const newStatus = currentPunishUser.value.status === 1 ? 0 : 1; // 解冻设为0(正常)，冻结设为1
      await updateUser({
        id: currentPunishUser.value.id,
        status: newStatus,
        auditComment: currentPunishUser.value.status === 1 ?
            `解冻账号，原因：${punishData.value.punishReason}` :
            `冻结账号，原因：${punishData.value.punishReason}`
      });

      const action = currentPunishUser.value.status === 1 ? '解冻' : '冻结';
      ElMessage.success(`用户已${action}成功`);

    } else if (punishData.value.punishMeasure === 'delete') {
      // 删除逻辑
      await deleteUser({id: currentPunishUser.value.id});
      ElMessage.success('删除成功');

    } else {
      // 警告逻辑
      await updateUser({
        id: currentPunishUser.value.id,
        auditComment: `警告：${punishData.value.punishReason}`
      });
      ElMessage.success('警告已发送');
    }
    getUsers();
    punishDialogVisible.value = false;
    punishData.value = { punishReason: '', punishMeasure: '' }; // 重置表单
  } catch (error) {
    ElMessage.error('操作失败');
  }
};

// 查看登录记录
const viewLoginRecords = (user) => {
  // 这里应该调用后端接口获取登录记录
  recordDetails.value = '模拟登录记录...';
  recordDialogVisible.value = true;
};

// 查看收藏记录
const viewFavoriteRecords = (user) => {
  // 这里应该调用后端接口获取收藏记录
  recordDetails.value = '模拟收藏记录...';
  recordDialogVisible.value = true;
};

getUsers()
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>用户列表</span>
      </div>
    </template>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="用户名">
        <el-input placeholder="用户名" clearable v-model="searchUsername" />
      </el-form-item>
      <el-form-item label="账号状态">
        <el-select v-model="searchStatus" placeholder="请选择账号状态" style="width:150px">
          <el-option label="正常" :value="0" />
          <el-option label="冻结" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getUsers">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="userList" style="width: 100%">
      <el-table-column fixed prop="username" label="用户名" width="150%" />
      <el-table-column label="性别" >
        <template #default="scope">
          {{ formatGender(scope.row.userGender) }}
        </template>
      </el-table-column>
      <el-table-column prop="birthday" label="生日" />
      <el-table-column prop="phone" label="电话" />
      <el-table-column prop="email" label="邮箱" width="200%" />
      <el-table-column prop="signature" label="个性签名" />
      <el-table-column label="账号状态">
        <template #default="scope">
          {{ formatStatus(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="注册时间" />
      <el-table-column prop="avatar" label="头像">
        <template #default="scope">
          <img height="50" :src="scope.row.userAvatar?scope.row.userAvatar:avatar" alt="Avatar" />
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="300">
        <template #default="scope">
          <el-button type="primary" @click="editUser(scope.row)">编辑</el-button>
          <el-button type="danger" @click="punishUser(scope.row)">处罚</el-button>
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
      title="用户信息编辑"
      v-model="editDialogVisible"
      width="500"
  >
    <span>
      <el-form label-width="auto" style="max-width: 600px">
        <el-form-item label="用户名">
          <el-input v-model="editUserData.username" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="editUserData.phone" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editUserData.email" />
        </el-form-item>
      </el-form>
    </span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEdit">确认</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 处罚用户对话框 -->
  <el-dialog
      title="处罚用户"
      v-model="punishDialogVisible"
      width="500"
  >
    <span>
      <el-form label-width="auto" style="max-width: 600px">
        <el-form-item label="处罚措施">
          <el-select v-model="punishData.punishMeasure">
            <el-option label="警告" value="warning" />
            <el-option
                :label="currentPunishUser?.status === 1 ? '解冻账号' : '冻结账号'"
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
            :label="currentPunishUser?.status === 1 ? '解冻说明' : '冻结原因'"
            v-else
        >
          <el-input v-model="punishData.punishReason" type="textarea" />
        </el-form-item>
      </el-form>
    </span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="punishDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePunish">确认</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 记录查看对话框 -->
  <el-dialog
      title="详细记录查看"
      v-model="recordDialogVisible"
      width="800"
  >
    <span>
      <pre>{{ recordDetails }}</pre>
    </span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="recordDialogVisible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
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