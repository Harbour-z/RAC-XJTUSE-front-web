<script setup lang="ts">
import { ref } from 'vue';
import type { FormInstance } from 'element-plus';

// 评论表单数据
const commentForm = ref({
  rating: 0,
  environmentRating: 0,
  serviceRating: 0,
  tasteRating: 0,
  content: '',
  images: [],
  video: ''
});
const commentFormRef = ref<FormInstance | null>(null);

// 回复表单数据
const replyForm = ref({
  content: ''
});
const replyFormRef = ref<FormInstance | null>(null);

// 评论列表
const comments = ref([
  {
    id: 1,
    username: '用户1',
    rating: 4,
    content: '这家店很不错，口味和服务都很好！',
    images: [],
    video: '',
    createdAt: '2024-01-01 10:00:00',
    replies: []
  }
]);

// 显示回复表单的评论ID
const showReplyForm = ref(0);

// 图片预览对话框
const dialogImageUrl = ref('');
const dialogVisible = ref(false);

// 上传图片移除事件
const handleRemove = (file: any, fileList: any) => {
  console.log(file, fileList);
};

// 图片预览事件
const handlePictureCardPreview = (file: any) => {
  dialogImageUrl.value = file.url || file.response.url;
  dialogVisible.value = true;
};

// 视频预览事件
const handleVideoPreview = (file: any) => {
  // 这里可以实现视频预览逻辑
  console.log('预览视频:', file);
};

// 提交评论
const submitComment = () => {
  if (commentFormRef.value) {
    commentFormRef.value.validate((valid) => {
      if (valid) {
        // 模拟审核通过
        const newComment = {
          id: comments.value.length + 1,
          username: '当前用户',
          ...commentForm.value,
          createdAt: new Date().toLocaleString(),
          replies: []
        };
        comments.value.push(newComment);
        // 清空表单
        commentForm.value = {
          rating: 0,
          environmentRating: 0,
          serviceRating: 0,
          tasteRating: 0,
          content: '',
          images: [],
          video: ''
        };
      }
    });
  }
};

// 显示回复表单
const replyComment = (commentId: number) => {
  showReplyForm.value = commentId;
};

// 取消回复
const cancelReply = () => {
  showReplyForm.value = 0;
  replyForm.value.content = '';
};

// 提交回复
const submitReply = (commentId: number) => {
  if (replyFormRef.value) {
    replyFormRef.value.validate((valid) => {
      if (valid) {
        const comment = comments.value.find((c) => c.id === commentId);
        if (comment) {
          const newReply = {
            id: comment.replies.length + 1,
            username: '当前用户',
            content: replyForm.value.content,
            createdAt: new Date().toLocaleString()
          };
          comment.replies.push(newReply);
          // 清空表单
          replyForm.value.content = '';
          showReplyForm.value = 0;
        }
      }
    });
  }
};

// 确认删除评论
const confirmDeleteComment = (commentId: number) => {
  window.confirm('确定要删除这条评论吗？') && deleteComment(commentId);
};

// 删除评论
const deleteComment = (commentId: number) => {
  comments.value = comments.value.filter((c) => c.id !== commentId);
};
</script>


<template>
  <div>
    <el-card>
      <template #header>
        <h1>评论</h1>
      </template>
      <!-- 发布评论表单 -->
      <el-form :model="commentForm" ref="commentFormRef" label-width="80px">
        <el-form-item label="评分">
          <el-rate v-model="commentForm.rating" :max="5"></el-rate>
        </el-form-item>
        <el-form-item label="环境评分">
          <el-rate v-model="commentForm.environmentRating" :max="5"></el-rate>
        </el-form-item>
        <el-form-item label="服务评分">
          <el-rate v-model="commentForm.serviceRating" :max="5"></el-rate>
        </el-form-item>
        <el-form-item label="口味评分">
          <el-rate v-model="commentForm.tasteRating" :max="5"></el-rate>
        </el-form-item>
        <el-form-item label="评论内容">
          <el-input v-model="commentForm.content" type="textarea" :rows="4"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
              action="#"
              :multiple="true"
              :limit="3"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
          >
            <template #trigger>
              <el-button size="small" type="primary">上传图片</el-button>
            </template>
            <template #tip>
              <div class="el-upload__tip">只能上传jpg/png文件，且不超过3张</div>
            </template>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <template #content>
              <img width="100%" :src="dialogImageUrl" alt="" />
            </template>
            <template #footer>
              <el-button @click="dialogVisible = false">关闭</el-button>
            </template>
          </el-dialog>
        </el-form-item>
        <el-form-item label="视频">
          <el-upload
              action="#"
              :multiple="false"
              list-type="picture-card"
              :on-preview="handleVideoPreview"
              :on-remove="handleRemove"
          >
            <template #trigger>
              <el-button size="small" type="primary">上传视频</el-button>
            </template>
            <template #tip>
              <div class="el-upload__tip">只能上传mp4文件</div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitComment">发布评论</el-button>
        </el-form-item>
      </el-form>

      <!-- 评论列表 -->
      <el-list :data="comments" :item-key="item => item.id">
        <template #item="{ item }">
          <el-card>
            <div class="comment-header">
              <span>{{ item.username }}</span>
              <el-rate :value="item.rating" :disabled="true"></el-rate>
              <span class="comment-time">{{ item.createdAt }}</span>
            </div>
            <div class="comment-content">
              <p>{{ item.content }}</p>
              <div v-if="item.images.length > 0">
                <el-image
                    v-for="(image, index) in item.images"
                    :key="index"
                    :src="image"
                    style="width: 100px; height: 100px; margin-right: 10px"
                    @click="handlePictureCardPreview({ url: image })"
                />
              </div>
              <div v-if="item.video">
                <video width="320" height="240" controls>
                  <source :src="item.video" type="video/mp4" />
                  您的浏览器不支持视频播放。
                </video>
              </div>
            </div>
            <div class="comment-actions">
              <el-button size="small" @click="replyComment(item.id)">回复</el-button>
              <el-button size="small" type="danger" @click="confirmDeleteComment(item.id)">删除</el-button>
            </div>
            <!-- 回复列表 -->
            <el-list :data="item.replies" :item-key="reply => reply.id" v-if="item.replies.length > 0">
              <template #item="{ item: reply }">
                <el-card style="margin-left: 20px">
                  <div class="comment-header">
                    <span>{{ reply.username }}</span>
                    <span class="comment-time">{{ reply.createdAt }}</span>
                  </div>
                  <div class="comment-content">
                    <p>{{ reply.content }}</p>
                  </div>
                </el-card>
              </template>
            </el-list>
            <!-- 回复表单 -->
            <el-form
                :model="replyForm"
                ref="replyFormRef"
                label-width="80px"
                v-if="showReplyForm === item.id"
            >
              <el-form-item label="回复内容">
                <el-input v-model="replyForm.content" type="textarea" :rows="2"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitReply(item.id)">提交回复</el-button>
                <el-button @click="cancelReply">取消</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </template>
      </el-list>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.comment-time {
  color: #999;
  font-size: 12px;
}

.comment-actions {
  margin-top: 10px;
}
</style>