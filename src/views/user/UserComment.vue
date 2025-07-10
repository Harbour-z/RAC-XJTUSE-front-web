
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {pageComments, updateComment , deleteCurComment} from "@/api/user";
import {useUserInfoStore} from "@/stores/userInfo";
const userInfoStore = useUserInfoStore();



interface Comment {
  id: number
  merchantName: string
  merchantAvatar: string
  overallRating: number
  environmentRating: number
  serviceRating: number
  tasteRating: number
  content: string
  images: string
  createdAt: string
  isEdited: boolean
}

const loading = ref(false)
const comments = ref<Comment[]>([])
const editForm = ref({
  id: 0,
  overallRating: 0,
  environmentRating: 0,
  serviceRating: 0,
  tasteRating: 0,
  content: '',
  images: ''
})

const showEditForm = ref(0)

const query = {
  userId:userInfoStore.userInfo.id,
}

pageComments(query).then(response => {
  comments.value = response.data.records
})

// 图片预览对话框
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

// 获取用户评论历史
const fetchUserComments = async () => {
  loading.value = true
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 800))
  } catch (error) {
    ElMessage.error('获取评论历史失败')
  } finally {
    loading.value = false
  }
}

// 初始化编辑表单
const initEditForm = (comment: Comment) => {
  editForm.value = {
    id: comment.id,
    overallRating: comment.overallRating,
    environmentRating: comment.environmentRating,
    serviceRating: comment.serviceRating,
    tasteRating: comment.tasteRating,
    content: comment.content,
    images: comment.images,
  }
  showEditForm.value = comment.id
}

// 取消编辑
const cancelEdit = () => {
  showEditForm.value = 0
  editForm.value = {
    id: 0,
    overallRating: 0,
    environmentRating: 0,
    serviceRating: 0,
    tasteRating: 0,
    content: '',
    images: '',
  }
}

// 提交编辑
const submitEdit = () => {
  updateComment(editForm.value).then(res => {
    ElMessage.success('评论修改成功')
    cancelEdit()
  })
}

// 删除评论确认
const confirmDelete = (id: number) => {
  ElMessageBox.confirm('确定要删除这条评论吗？删除后不可恢复', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteComment(id)
  }).catch(() => {})
}

// 删除评论
const deleteComment = (id: number) => {
  comments.value = comments.value.filter(c => c.id !== id)
  const query = {
    id: id
  }
  deleteCurComment(query).then(response => {
    ElMessage.success('评论删除成功')
  })

}

// 图片预览
const handlePictureCardPreview = (url: string) => {
  dialogImageUrl.value = url
  dialogVisible.value = true
}

onMounted(() => {
  fetchUserComments()
})
</script>

<template>
  <div class="user-comments">
    <el-card shadow="never" class="luxury-card">
      <template #header>
        <div class="card-header">
          <h1><i class="el-icon-notebook-2"></i>我的评论</h1>
          <div class="header-actions">
            <el-tag type="info" size="large">
              <i class="el-icon-collection"></i> 共 {{ comments.length }} 条评论
            </el-tag>
          </div>
        </div>
      </template>

      <div class="comment-list" v-loading="loading">
        <div v-if="comments.length === 0 && !loading" class="empty">
          <img src="@/assets/images/empty-comment.png" alt="暂无评论" class="empty-image">
          <p class="empty-text">您还没有发表过任何评论</p>
          <el-button type="primary" size="large" class="empty-action">
            <i class="el-icon-s-promotion"></i> 去发表评论
          </el-button>
        </div>

        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <div class="merchant-info">
            <el-avatar :size="50" :src="comment.merchantAvatar" />
            <div class="merchant-details">
              <!--              <h3 class="merchant-name">{{ comment.merchantName }}</h3>-->
              <div class="comment-time">
                <span>{{ comment.createdAt }}</span>
                <el-tag v-if="comment.isEdited" size="small" effect="plain">已编辑</el-tag>
              </div>
            </div>
          </div>

          <div class="rating-section">
            <div class="rating-item">
              <span class="rating-label">总体评分:</span>
              <el-rate v-model="comment.overallRating" disabled />
            </div>
            <div class="rating-item">
              <span class="rating-label">环境评分:</span>
              <el-rate v-model="comment.environmentRating" disabled />
            </div>
            <div class="rating-item">
              <span class="rating-label">服务评分:</span>
              <el-rate v-model="comment.serviceRating" disabled />
            </div>
            <div class="rating-item">
              <span class="rating-label">口味评分:</span>
              <el-rate v-model="comment.tasteRating" disabled />
            </div>
          </div>

          <div class="comment-content">
            <p>{{ comment.content }}</p>

            <div class="media-section">
              <el-image
                  v-for="(image, index) in comment.images"
                  :key="index"
                  :src="image"
                  :preview-src-list="comment.images"
                  fit="cover"
                  class="comment-image"
                  @click="handlePictureCardPreview(image)"
              />
            </div>

          </div>

          <div class="comment-actions">
            <el-button type="primary" size="small" @click="initEditForm(comment)">
              <i class="el-icon-edit"></i> 编辑
            </el-button>
            <el-button type="danger" size="small" @click="confirmDelete(comment.id)">
              <i class="el-icon-delete"></i> 删除
            </el-button>
          </div>

          <el-collapse-transition>
            <div v-if="showEditForm === comment.id" class="edit-form">
              <el-form :model="editForm" ref="editFormRef" label-width="100px">
                <el-form-item label="总体评分" prop="rating" required>
                  <el-rate v-model="editForm.overallRating" :max="5" />
                </el-form-item>
                <el-form-item label="环境评分" prop="environmentRating" required>
                  <el-rate v-model="editForm.environmentRating" :max="5" />
                </el-form-item>
                <el-form-item label="服务评分" prop="serviceRating" required>
                  <el-rate v-model="editForm.serviceRating" :max="5" />
                </el-form-item>
                <el-form-item label="口味评分" prop="tasteRating" required>
                  <el-rate v-model="editForm.tasteRating" :max="5" />
                </el-form-item>
                <el-form-item label="评论内容" prop="content" required>
                  <el-input v-model="editForm.content" type="textarea" :rows="4" placeholder="请输入您的评论" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitEdit">保存修改</el-button>
                  <el-button @click="cancelEdit">取消</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-collapse-transition>
        </div>
      </div>

      <el-dialog v-model="dialogVisible" width="80%" top="5vh">
        <img :src="dialogImageUrl" style="width: 100%;" alt="预览图片" />
      </el-dialog>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.user-comments {
  padding: 20px;
  background: #f5f7fa;

  .luxury-card {
    border-radius: 12px;
    border: none;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);

    :deep(.el-card__header) {
      background: linear-gradient(to right, #6a11cb, #2575fc);
      color: white;
      border-bottom: none;
      padding: 20px 25px;

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        h1 {
          margin: 0;
          font-size: 22px;
          font-weight: 600;
          display: flex;
          align-items: center;

          i {
            margin-right: 10px;
            font-size: 24px;
          }
        }

        .el-tag {
          background: rgba(255, 255, 255, 0.15);
          border: none;
          color: white;
          font-size: 14px;
          height: 32px;
          line-height: 32px;

          i {
            margin-right: 5px;
          }
        }
      }
    }

    :deep(.el-card__body) {
      padding: 25px;
    }
  }

  .empty {
    text-align: center;
    padding: 50px 0;

    .empty-image {
      width: 200px;
      opacity: 0.7;
      margin-bottom: 20px;
    }

    .empty-text {
      color: #909399;
      font-size: 16px;
      margin-bottom: 20px;
    }

    .empty-action {
      padding: 12px 30px;
      border-radius: 30px;
      font-size: 16px;

      i {
        margin-right: 8px;
      }
    }
  }

  .comment-list {
    .comment-item {
      padding: 25px;
      margin-bottom: 25px;
      background: white;
      border-radius: 10px;
      box-shadow: 0 3px 15px rgba(0, 0, 0, 0.05);
      transition: all 0.3s;

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
      }

      .merchant-info {
        display: flex;
        align-items: center;
        margin-bottom: 20px;

        .merchant-details {
          margin-left: 15px;

          .merchant-name {
            margin: 0 0 5px 0;
            font-size: 18px;
            color: #303133;
          }

          .comment-time {
            display: flex;
            align-items: center;
            font-size: 13px;
            color: #909399;

            .el-tag {
              margin-left: 10px;
            }
          }
        }
      }

      .rating-section {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
        margin-bottom: 20px;

        .rating-item {
          display: flex;
          align-items: center;

          .rating-label {
            width: 80px;
            color: #606266;
            font-size: 14px;
          }

          :deep(.el-rate) {
            margin-left: 10px;
          }
        }
      }

      .comment-content {
        margin-bottom: 20px;

        p {
          margin: 0 0 15px 0;
          line-height: 1.8;
          color: #606266;
          font-size: 15px;
        }
      }

      .media-section {
        margin: 15px 0;

        .comment-image {
          width: 150px;
          height: 150px;
          margin-right: 15px;
          margin-bottom: 15px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            transform: scale(1.03);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          }
        }

        .comment-video {
          max-width: 400px;
          max-height: 250px;
          border-radius: 8px;
        }
      }

      .comment-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;

        .el-button {
          margin-left: 10px;
          padding: 8px 15px;
          border-radius: 20px;

          i {
            margin-right: 5px;
          }
        }
      }

      .edit-form {
        margin-top: 20px;
        padding: 20px;
        background: #f8fafc;
        border-radius: 8px;

        :deep(.el-rate) {
          height: 36px;
        }

        :deep(.el-textarea__inner) {
          border-radius: 8px;
        }
      }

      .replies-section {
        margin-top: 25px;
        padding-top: 20px;
        border-top: 1px dashed #e4e7ed;

        .replies-title {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          font-size: 16px;
          color: #409EFF;
          font-weight: 500;

          i {
            margin-right: 8px;
            font-size: 18px;
          }
        }

        .reply-item {
          margin-bottom: 15px;
          padding: 15px;
          background: #f8fafc;
          border-radius: 8px;

          .reply-header {
            display: flex;
            align-items: center;
            margin-bottom: 10px;

            .reply-info {
              margin-left: 10px;

              .reply-merchant {
                font-weight: bold;
                color: #303133;
                margin-right: 10px;
              }

              .reply-time {
                font-size: 12px;
                color: #909399;
              }
            }
          }

          .reply-content {
            margin-left: 46px;

            p {
              margin: 0;
              color: #606266;
              line-height: 1.6;
            }
          }
        }
      }
    }
  }
}
</style>