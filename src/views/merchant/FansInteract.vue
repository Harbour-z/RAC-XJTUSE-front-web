<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

interface ExclusiveContent {
  id: number
  title: string
  type: 'text' | 'image' | 'video'
  content: string
  media?: string[]
  date: string
  views: number
  likes: number
  comments: number
}

interface Topic {
  id: number
  title: string
  content: string
  participants: number
  comments: number
  date: string
  hotComments: string[]
}

const activeTab = ref('content')
const exclusiveContents = ref<ExclusiveContent[]>([])
const topics = ref<Topic[]>([])
const loading = ref(false)
const newContent = ref({
  title: '',
  type: 'text',
  content: '',
  media: [] as string[]
})
const newTopic = ref({
  title: '',
  content: ''
})

onMounted(() => {
  fetchData()
})

const fetchData = () => {
  loading.value = true
  // 模拟API请求
  setTimeout(() => {
    exclusiveContents.value = [
      {
        id: 1,
        title: '新品预告：夏日限定甜品',
        type: 'image',
        content: '我们即将推出夏日限定甜品系列，敬请期待！',
        media: [
          'https://tse2-mm.cn.bing.net/th/id/OIP-C.fHWDMkoQrzAhRf5hrd0hoAHaDI?w=344&h=148&c=7&r=0&o=5&dpr=1.8&pid=1.7'
        ],
        date: '2023-05-10',
        views: 256,
        likes: 128,
        comments: 32
      },
      {
        id: 2,
        title: '店铺故事：我们的初心',
        type: 'video',
        content: '讲述我们开店以来的心路历程',
        media: [''],
        date: '2023-05-05',
        views: 189,
        likes: 95,
        comments: 18
      },
      {
        id: 3,
        title: '厨师风采：主厨专访',
        type: 'text',
        content: '本期我们采访了店里的主厨，分享他的烹饪理念...',
        date: '2023-05-01',
        views: 142,
        likes: 76,
        comments: 12
      }
    ]

    topics.value = [
      {
        id: 1,
        title: '你最喜欢的本店菜品是什么？',
        content: '欢迎大家分享你最喜欢的菜品，我们会根据反馈优化菜单',
        participants: 56,
        comments: 23,
        date: '2023-05-08',
        hotComments: [
          '用户A：最喜欢你们的招牌红烧肉',
          '用户B：酸菜鱼是我的最爱'
        ]
      },
      {
        id: 2,
        title: '对本店服务有什么建议？',
        content: '我们希望能提供更好的服务，欢迎提出宝贵建议',
        participants: 42,
        comments: 18,
        date: '2023-05-03',
        hotComments: [
          '用户C：希望上菜速度能再快一点',
          '用户D：服务员态度很好，继续保持'
        ]
      }
    ]

    loading.value = false
  }, 500)
}

const submitContent = () => {
  if (!newContent.value.title || !newContent.value.content) {
    ElMessage.warning('请填写标题和内容')
    return
  }

  const content: ExclusiveContent = {
    id: exclusiveContents.value.length + 1,
    title: newContent.value.title,
    type: newContent.value.type as any,
    content: newContent.value.content,
    media: [...newContent.value.media],
    date: new Date().toISOString().split('T')[0],
    views: 0,
    likes: 0,
    comments: 0
  }

  exclusiveContents.value.unshift(content)
  newContent.value = {
    title: '',
    type: 'text',
    content: '',
    media: []
  }

  ElMessage.success('发布成功')
}

const submitTopic = () => {
  if (!newTopic.value.title || !newTopic.value.content) {
    ElMessage.warning('请填写标题和内容')
    return
  }

  const topic: Topic = {
    id: topics.value.length + 1,
    title: newTopic.value.title,
    content: newTopic.value.content,
    participants: 0,
    comments: 0,
    date: new Date().toISOString().split('T')[0],
    hotComments: []
  }

  topics.value.unshift(topic)
  newTopic.value = {
    title: '',
    content: ''
  }

  ElMessage.success('话题发布成功')
}

const handleMediaUpload = (file: File) => {
  // 模拟上传
  setTimeout(() => {
    const url = URL.createObjectURL(file)
    if (newContent.value.type === 'image') {
      newContent.value.media.push(url)
    } else if (newContent.value.type === 'video') {
      newContent.value.media = [url]
    }
    ElMessage.success('上传成功')
  }, 500)
  return false // 阻止默认上传
}
</script>

<template>
  <div class="fans-interact">
    <el-card>
      <h1>粉丝互动</h1>

      <el-tabs v-model="activeTab" class="interact-tabs">
        <el-tab-pane label="独家内容" name="content">
          <div class="section">
            <h2>发布独家内容</h2>
            <el-form :model="newContent" label-width="80px">
              <el-form-item label="标题" required>
                <el-input v-model="newContent.title" placeholder="请输入标题" />
              </el-form-item>

              <el-form-item label="类型">
                <el-radio-group v-model="newContent.type">
                  <el-radio label="text">图文</el-radio>
                  <el-radio label="image">图片</el-radio>
                  <el-radio label="video">视频</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="内容" required>
                <el-input
                    v-model="newContent.content"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入内容"
                />
              </el-form-item>

              <el-form-item v-if="newContent.type !== 'text'" label="上传">
                <el-upload
                    v-if="newContent.type === 'image'"
                    action="#"
                    list-type="picture-card"
                    :on-change="handleMediaUpload"
                    :auto-upload="false"
                    :multiple="true"
                    accept="image/*"
                >
                  <el-icon><Plus /></el-icon>
                </el-upload>

                <el-upload
                    v-else-if="newContent.type === 'video'"
                    action="#"
                    :on-change="handleMediaUpload"
                    :auto-upload="false"
                    accept="video/*"
                >
                  <el-button type="primary">上传视频</el-button>
                </el-upload>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="submitContent">发布</el-button>
              </el-form-item>
            </el-form>
          </div>

          <div class="section">
            <h2>内容数据</h2>
            <div class="content-list" v-loading="loading">
              <div v-for="item in exclusiveContents" :key="item.id" class="content-item">
                <div class="content-header">
                  <h3>{{ item.title }}</h3>
                  <span class="date">{{ item.date }}</span>
                </div>

                <div class="content-body">
                  <p>{{ item.content }}</p>

                  <div v-if="item.media && item.media.length > 0" class="media-section">
                    <el-image
                        v-if="item.type === 'image'"
                        v-for="(media, index) in item.media"
                        :key="index"
                        :src="media"
                        :preview-src-list="item.media"
                        fit="cover"
                        class="content-image"
                    />

                    <video
                        v-else-if="item.type === 'video'"
                        :src="item.media[0]"
                        controls
                        class="content-video"
                    ></video>
                  </div>
                </div>

                <div class="content-footer">
                  <div class="stats">
                    <span><el-icon><View /></el-icon> {{ item.views }}</span>
                    <span><el-icon><Star /></el-icon> {{ item.likes }}</span>
                    <span><el-icon><ChatDotRound /></el-icon> {{ item.comments }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="话题讨论" name="topics">
          <div class="section">
            <h2>发起话题</h2>
            <el-form :model="newTopic" label-width="80px">
              <el-form-item label="标题" required>
                <el-input v-model="newTopic.title" placeholder="请输入话题标题" />
              </el-form-item>

              <el-form-item label="内容" required>
                <el-input
                    v-model="newTopic.content"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入话题内容"
                />
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="submitTopic">发起话题</el-button>
              </el-form-item>
            </el-form>
          </div>

          <div class="section">
            <h2>话题数据</h2>
            <div class="topic-list" v-loading="loading">
              <div v-for="topic in topics" :key="topic.id" class="topic-item">
                <div class="topic-header">
                  <h3>{{ topic.title }}</h3>
                  <span class="date">{{ topic.date }}</span>
                </div>

                <div class="topic-body">
                  <p>{{ topic.content }}</p>
                </div>

                <div class="topic-footer">
                  <div class="stats">
                    <span>参与人数: {{ topic.participants }}</span>
                    <span>评论数: {{ topic.comments }}</span>
                  </div>

                  <div v-if="topic.hotComments.length > 0" class="hot-comments">
                    <h4>热门评论</h4>
                    <ul>
                      <li v-for="(comment, index) in topic.hotComments" :key="index">{{ comment }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.fans-interact {
  padding: 20px;

  h1 {
    margin-bottom: 20px;
    font-size: 24px;
    color: #333;
  }

  .interact-tabs {
    margin-top: 20px;
  }

  .section {
    margin-bottom: 30px;

    h2 {
      margin-bottom: 20px;
      font-size: 18px;
      color: #333;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
  }

  .content-list, .topic-list {
    .content-item, .topic-item {
      padding: 20px;
      border-bottom: 1px solid #eee;
      margin-bottom: 20px;

      .content-header, .topic-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        h3 {
          margin: 0;
          font-size: 16px;
        }

        .date {
          color: #999;
          font-size: 14px;
        }
      }

      .content-body, .topic-body {
        p {
          margin: 10px 0;
          line-height: 1.6;
          color: #666;
        }
      }

      .media-section {
        margin: 15px 0;

        .content-image {
          width: 200px;
          height: 150px;
          margin-right: 10px;
          border-radius: 4px;
        }

        .content-video {
          max-width: 400px;
          max-height: 300px;
          border-radius: 4px;
        }
      }

      .content-footer, .topic-footer {
        margin-top: 15px;

        .stats {
          display: flex;
          gap: 20px;
          color: #999;
          font-size: 14px;

          span {
            display: flex;
            align-items: center;

            .el-icon {
              margin-right: 5px;
            }
          }
        }
      }

      .hot-comments {
        margin-top: 15px;
        padding: 10px;
        background-color: #f5f7fa;
        border-radius: 4px;

        h4 {
          margin: 0 0 10px 0;
          font-size: 14px;
          color: #666;
        }

        ul {
          margin: 0;
          padding-left: 20px;

          li {
            margin-bottom: 5px;
            color: #666;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>