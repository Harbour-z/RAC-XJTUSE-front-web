<script lang="ts" setup>

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
        <el-input  placeholder="用户名" clearable />
      </el-form-item>
      <el-form-item label="密码">
        <el-input  placeholder="密码" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" >查询</el-button>
      </el-form-item>
    </el-form>
    <el-table  height="500" style="width: 100%">

      <el-table-column prop="loginName" label="用户名"  />
      <el-table-column prop="avatar" label="头像" />
      <el-table-column  label="登陆记录" />
      <el-table-column  label="消费记录" />
      <el-table-column  label="注册时间" >

        <template #default="scope">
          <img height="100" :src="scope.row.avater" alt="">
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="danger" >删除</el-button>
          <el-button type="primary" >编辑</el-button>
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

      title="Tips"
      width="500"
  >
    <span>
<!--      <el-form label-width="auto" style="max-width: 600px">-->
<!--        <el-form-item label="用户名">-->
<!--          <el-input v-model="selectUser.loginName"/>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="密码">-->
<!--          <el-input v-model="selectUser.password"/>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="头像">-->
<!--          <el-upload-->
<!--              class="avatar-uploader"-->
<!--              action="/api/file/upload"-->
<!--              :show-file-list="false"-->
<!--              :on-success="handleAvatarSuccess"-->
<!--          >-->
<!--      <img v-if="imageUrl" :src="imageUrl" class="avatar" />-->
<!--      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>-->
<!--    </el-upload>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
    </span>
    <template #footer>
      <div class="dialog-footer">
        <el-button >取消</el-button>
        <el-button type="primary" >
          确认
        </el-button>
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