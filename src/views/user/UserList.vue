<script lang="ts" setup>
import {pageUsers, deleteUser,removeById,updateUser} from "../../api/api";
import {ref} from "vue";
import { h } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {Plus} from "@element-plus/icons-vue";

const imageUrl = ref('')

const handleAvatarSuccess = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
  selectUser.value.avater = response.data.url
}
const users =ref([])
const pageNum = ref(1)
const pageSize = ref(10)
const loginName = ref('')
const password = ref('')
const total = ref(0)
const dialogVisible = ref(false)
const selectUser = ref({})
const handleClose = (done: () => void) => {
  ElMessageBox.confirm('确认退出?未执行的修改不会生效')
      .then(() => {
        done()
      })
      .catch(() => {
      })
}


const getUsers = () => {
  const query = {
    pageNum:pageNum.value,
    pageSize:pageSize.value,
    loginName:loginName.value,
    password:password.value
  }
  pageUsers(query).then(res => {
    users.value = res.data.records
    total.value = res.data.total
  })
}
const pageNumChange = (value) => {
  pageNum.value = value
  getUsers()
}
const pageSizeChange = (value) => {
  pageSize.value = value
  pageNum.value = 1
  getUsers()
}
const removeUser = (row) => {
  ElMessageBox({
    title: '确认删除',
    message: h('p', null, [
      h('span', null, '确定要删除用户'+row.loginName+'吗？ '),
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
const showEdit = (row) => {
  //不要直接赋值地址，会影响表格
  selectUser.value = JSON.parse(JSON.stringify(row))
  imageUrl.value = row.avater
  dialogVisible.value = true
}
const saveUser =() => {
  const user = {
    loginName:selectUser.value.loginName,
    password:selectUser.value.password,
    id:selectUser.value.id,
    avater:selectUser.value.avater
  }
  updateUser(user).then(res=>{
    if(res.data){
      ElMessage({
        message:"编辑成功",
        type:"success"
      })
      getUsers()
    }else{
      ElMessage({
        message:"编辑失败",
        type:"warning"
      })
    }
    dialogVisible.value = false
  })
}

getUsers()
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>用户列表</span>
      </div>
    </template>
    <el-form :inline="true"  class="demo-form-inline">
      <el-form-item label="用户名">
        <el-input v-model="loginName" placeholder="请输入用户名" clearable />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="password" placeholder="请输入密码" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getUsers">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="users"  height="360" style="width: 100%">
      <el-table-column prop="id" label="id"/>
      <el-table-column prop="avater" label="头像">
      <template #default="scope">
        <img height="50"  :src="scope.row.avater" alt="">
      </template>
      </el-table-column>
      <el-table-column prop="loginName" label="用户名" width="200"/>
      <el-table-column prop="password" label="密码" width="200"/>
      <el-table-column prop="remark" label="备注" width="1000"/>
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="scope">
          <el-button
              size="small"
              type="primary"
              @click="showEdit(scope.row)"
          >
            Edit
          </el-button>
          <el-button
              size="small"
              type="danger"
              @click="removeUser(scope.row)"
          >
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        :background="true"
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="pageSizeChange"
        @current-change="pageNumChange"
    />
    <el-button plain @click="dialogVisible = true">
      Click to open the Dialog
    </el-button>

    <el-dialog
        v-model="dialogVisible"
        title="Tips"
        width="500"
        :before-close="handleClose"
    >
      <span>
        <el-form label-width="auto" style="max-width: 600px">
          <el-form-item label="用户名">
            <el-input v-model="selectUser.loginName"/>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="selectUser.password"/>
          </el-form-item>
          <el-form-item label="头像">
            <el-upload
                class="avatar-uploader"
                action="/api/file/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
            >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
          </el-form-item>
        </el-form>
      </span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveUser">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>

  </el-card>
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
