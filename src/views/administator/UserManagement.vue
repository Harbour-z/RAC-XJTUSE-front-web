<script lang="ts" setup>
import {h, ref} from 'vue';
import {deleteUser,updateUser} from '../../api/admin'
import {pageUsers} from '../../api/user'
import {ElMessage, ElMessageBox} from "element-plus";

// 搜索相关
const searchUsername = ref('');
const searchStatus = ref(0);
const pageNum = ref(1);
const pageSize = ref(10);
const total = ref(0)
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
// 表格数据
const userList = ref([]);
// 计算属性：格式化状态显示
const formatStatus = (status: number) => {
  return status === 0 ? '正常' : '冻结';
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
  loginName: '',
  nickname: '',
  avatar: '',
});
const recordDetails = ref('');

// 默认头像
const defaultAvatar = ref('https://via.placeholder.com/50');

// 删除用户
const removeUser = (row) => {
  ElMessageBox({
    title: '确认删除',
    message: h('p', null, [
      h('span', null, '确定要删除用户'+row.username+'吗？ '),
      h('i', { style: 'color: teal' }, '(此操作不可逆)'),
    ]),
    showCancelButton: true,
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
    beforeClose: async (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = '删除中...'
        try {
          const query = {
            id:row.id
          }
          await deleteUser(query)
          done()
          ElMessage.success('删除成功')
          getUsers()
        } catch (error) {
          ElMessage.error('删除失败')
          done()
        } finally {
          instance.confirmButtonLoading = false
        }
      } else {
        done()
      }
    }
  })
}

// 编辑用户
const editUser = (user) => {
  editUserData.value = { ...user };
  editDialogVisible.value = true;
};

// 切换用户状态（冻结/解冻）
const toggleUserStatus = (row) => {
  const newStatus = row.status === 0 ? 1 : 0;
  const actionText = newStatus === 1 ? '冻结' : '解冻';
  ElMessageBox.confirm(
      `确定要${actionText}用户 ${row.username} 吗？`,
      '确认操作',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
  ).then(async () => {
    try {
      await updateUser({id: row.id, status: newStatus});
      ElMessage.success(`用户已${actionText}`);
      getUsers();
    } catch (error) {
      ElMessage.error(`${actionText}用户失败`);
    }
  }).catch(() => {});
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

// 取消编辑
const cancelEdit = () => {
  editDialogVisible.value = false;
};

// 保存编辑
const saveEdit = () => {
  // 这里应该调用后端接口保存编辑信息
  console.log('Save edit:', editUserData.value);
  editDialogVisible.value = false;
};

// 处理头像上传成功
const handleAvatarUploadSuccess = (response, file, fileList) => {
  editUserData.value.avatar = response.url; // 假设返回的是图片的URL
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
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="userGender" label="性别" />
      <el-table-column prop="birthday" label="生日" />
      <el-table-column prop="phone" label="电话" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="signature" label="个性签名" />
      <el-table-column label="账号状态">
        <template #default="scope">
          {{ formatStatus(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="注册时间" />
      <el-table-column prop="updateTime" label="账号状态" />
<!--      <el-table-column prop="avatar" label="头像">-->
<!--        <template #default="scope">-->
<!--          <img height="50" :src="scope.row.avatar || defaultAvatar" alt="Avatar" />-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="登录记录">-->
<!--        <template #default="scope">-->
<!--          <el-button type="text" @click="viewLoginRecords(scope.row)">查看</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="收藏记录">-->
<!--        <template #default="scope">-->
<!--          <el-button type="text" @click="viewFavoriteRecords(scope.row)">查看</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->

      <el-table-column fixed="right" label="操作" width="300">
        <template #default="scope">
          <el-button type="danger" @click="removeUser(scope.row)">删除</el-button>
          <el-button type="primary" @click="editUser(scope.row)">编辑</el-button>
          <el-button type="warning" @click="toggleUserStatus(scope.row)">
            {{ scope.row.status == 0 ? '冻结' : '解冻' }}
          </el-button>
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
      :visible.sync="editDialogVisible"
      width="500"
  >
    <span>
      <el-form label-width="auto" style="max-width: 600px">
        <el-form-item label="用户名">
          <el-input v-model="editUserData.loginName" disabled />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="editUserData.nickname" />
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
              class="avatar-uploader"
              action="/api/file/upload"
              :show-file-list="false"
              :on-success="handleAvatarUploadSuccess"
          >
            <img v-if="editUserData.avatar" :src="editUserData.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
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
      title="详细记录查看"
      :visible.sync="recordDialogVisible"
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