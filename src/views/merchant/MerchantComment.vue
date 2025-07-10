<script setup lang="ts">
import {ref, onMounted, computed} from 'vue'
import { ElMessage } from 'element-plus'

interface Comment {
  id: number
  user: string
  avatar: string
  rating: number
  content: string
  images?: string[]
  video?: string
  date: string
  reply?: string
  tags: string[]
}

const comments = ref<Comment[]>([])
const loading = ref(false)
const filter = ref({
  rating: null as number | null,
  type: null as string | null,
  keyword: ''
})

const ratingOptions = [
  { value: 5, label: '五星' },
  { value: 4, label: '四星' },
  { value: 3, label: '三星' },
  { value: 2, label: '二星' },
  { value: 1, label: '一星' }
]

const typeOptions = [
  { value: 'positive', label: '好评' },
  { value: 'neutral', label: '中评' },
  { value: 'negative', label: '差评' }
]

const replyContent = ref('')

onMounted(() => {
  fetchComments()
})

const fetchComments = () => {
  loading.value = true
  // 模拟API请求
  setTimeout(() => {
    comments.value = [
      {
        id: 1,
        user: '用户A',
        avatar: '',
        rating: 5,
        content: '菜品非常好吃，服务也很周到！',
        images: [
          ''
        ],
        date: '2023-05-15',
        tags: ['好评']
      },
      {
        id: 2,
        user: '用户B',
        avatar: '',
        rating: 3,
        content: '味道还可以，但上菜速度有点慢',
        date: '2023-05-14',
        reply: '感谢您的反馈，我们会改进上菜速度。',
        tags: ['中评']
      },
      {
        id: 3,
        user: '用户C',
        avatar: '',
        rating: 1,
        content: '菜品与描述不符，非常失望',
        video: '',
        date: '2023-05-13',
        tags: ['差评']
      }
    ]
    loading.value = false
  }, 500)
}

const filteredComments = computed(() => {
  return comments.value.filter(comment => {
    const matchesRating = filter.value.rating ? comment.rating === filter.value.rating : true
    const matchesType = filter.value.type ? comment.tags.includes(filter.value.type) : true
    const matchesKeyword = filter.value.keyword ?
        comment.content.includes(filter.value.keyword) ||
        (comment.reply && comment.reply.includes(filter.value.keyword)) : true
    return matchesRating && matchesType && matchesKeyword
  })
})

const submitReply = (commentId: number) => {
  const comment = comments.value.find(c => c.id === commentId)
  if (comment && replyContent.value) {
    comment.reply = replyContent.value
    replyContent.value = ''
    ElMessage.success('回复成功')
  }
}

const getRatingText = (rating: number) => {
  return ratingOptions.find(opt => opt.value === rating)?.label || ''
}

const getTypeText = (tags: string[]) => {
  if (tags.includes('negative')) return '差评'
  if (tags.includes('neutral')) return '中评'
  return '好评'
}
</script>

<template>
  <div class="merchant-comment">
    <el-card>
      <h1>商家评论</h1>

      <div class="filter-section">
        <el-form :inline="true" :model="filter">
          <el-form-item label="评分">
            <el-select v-model="filter.rating" placeholder="全部评分" clearable style="width: 150px;">
              <el-option v-for="item in ratingOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="评论类型">
            <el-select v-model="filter.type" placeholder="全部类型" clearable style="width: 150px;">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

<!--         暂时搁置 <el-form-item label="关键词">-->
<!--            <el-input v-model="filter.keyword" placeholder="搜索评论内容" clearable />-->
<!--          </el-form-item>-->

<!--          <el-form-item>-->
<!--            <el-button type="primary" @click="fetchComments">搜索</el-button>-->
<!--          </el-form-item>-->
        </el-form>
      </div>

      <div class="comment-list" v-loading="loading">
        <div v-if="filteredComments.length === 0" class="empty">暂无评论</div>

        <div v-for="comment in filteredComments" :key="comment.id" class="comment-item" :class="{'negative': comment.tags.includes('negative')}">
          <div class="comment-header">
            <el-avatar :size="40" :src="comment.avatar" />
            <div class="user-info">
              <span class="username">{{ comment.user }}</span>
              <div class="meta">
                <el-rate v-model="comment.rating" disabled show-score :score-template="getRatingText(comment.rating)" />
                <span class="date">{{ comment.date }}</span>
                <el-tag :type="comment.tags.includes('negative') ? 'danger' : comment.tags.includes('neutral') ? 'warning' : 'success'" size="small">
                  {{ getTypeText(comment.tags) }}
                </el-tag>
              </div>
            </div>
          </div>

          <div class="comment-content">
            <p>{{ comment.content }}</p>

            <div v-if="comment.images && comment.images.length > 0" class="media-section">
              <el-image
                  v-for="(img, index) in comment.images"
                  :key="index"
                  :src="img"
                  :preview-src-list="comment.images"
                  fit="cover"
                  class="comment-image"
              />
            </div>

            <div v-if="comment.video" class="media-section">
              <video controls :src="comment.video" class="comment-video"></video>
            </div>
          </div>

          <div v-if="comment.reply" class="comment-reply">
            <div class="reply-header">
              <span class="reply-label">商家回复：</span>
            </div>
            <p>{{ comment.reply }}</p>
          </div>

          <div v-if="!comment.reply" class="reply-form">
            <el-input
                v-model="replyContent"
                type="textarea"
                :rows="2"
                placeholder="请输入回复内容"
            />
            <el-button type="primary" size="small" @click="submitReply(comment.id)">回复</el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.merchant-comment {
  padding: 20px;

  h1 {
    margin-bottom: 20px;
    font-size: 24px;
    color: #333;
  }

  .filter-section {
    margin-bottom: 20px;
  }

  .comment-list {
    .empty {
      text-align: center;
      padding: 40px;
      color: #999;
    }

    .comment-item {
      padding: 20px;
      border-bottom: 1px solid #eee;

      &.negative {
        background-color: #fff6f6;
      }

      .comment-header {
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        .user-info {
          margin-left: 10px;

          .username {
            font-weight: bold;
          }

          .meta {
            display: flex;
            align-items: center;
            margin-top: 5px;
            font-size: 12px;
            color: #999;

            .el-rate {
              margin-right: 10px;
            }

            .date {
              margin-right: 10px;
            }
          }
        }
      }

      .comment-content {
        margin-left: 50px;

        p {
          margin-bottom: 10px;
          line-height: 1.6;
        }
      }

      .media-section {
        margin: 10px 0;

        .comment-image {
          width: 100px;
          height: 100px;
          margin-right: 10px;
          border-radius: 4px;
        }

        .comment-video {
          max-width: 300px;
          max-height: 200px;
          border-radius: 4px;
        }
      }

      .comment-reply {
        margin-left: 50px;
        padding: 10px;
        background-color: #f5f7fa;
        border-radius: 4px;
        margin-top: 10px;

        .reply-header {
          margin-bottom: 5px;

          .reply-label {
            font-weight: bold;
            color: #666;
          }
        }

        p {
          margin: 0;
          line-height: 1.6;
        }
      }

      .reply-form {
        margin-left: 50px;
        margin-top: 10px;

        .el-button {
          margin-top: 10px;
        }
      }
    }
  }
}
</style>