<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { StarFilled, Location, Timer } from '@element-plus/icons-vue'

interface Merchant {
  id: number
  name: string
  avatar: string
  cover: string
  rating: number
  category: string
  distance: string
  deliveryTime: string
  promotion?: string
  description: string
  isFavorite: boolean
}

const merchants = ref<Merchant[]>([])
const loading = ref(false)
const activeCategory = ref('all')

const categories = [
  { value: 'all', label: '全部' },
  { value: '1', label: '中餐' },
  { value: '2', label: '西餐' },
  { value: '3', label: '日料' },
  { value: '4', label: '甜品' },
  { value: '5', label: '快餐' }
]

const fetchMerchants = async () => {
  loading.value = true
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 800))
    merchants.value = [
      {
        id: 1,
        name: '美食家餐厅',
        avatar: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.exyOZTeu3IaY_1hTwo89DwHaEo?w=276&h=180&c=7&r=0&o=5&dpr=1.8&pid=1.7',
        cover: 'https://via.placeholder.com/800x400?text=美食家餐厅',
        rating: 4.8,
        category: 'chinese',
        distance: '1.2km',
        deliveryTime: '30分钟',
        promotion: '新用户立减20元',
        description: '专注传统美食20年，为您带来最地道的家乡味道',
        isFavorite: true
      },
      {
        id: 2,
        name: '咖啡时光',
        avatar: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.e8sbO1OUrKof5_mKL7_faQHaHa?w=190&h=199&c=7&r=0&o=5&dpr=1.8&pid=1.7',
        cover: 'https://via.placeholder.com/800x400?text=咖啡时光',
        rating: 4.5,
        category: 'dessert',
        distance: '0.8km',
        deliveryTime: '25分钟',
        promotion: '下午茶套餐7折',
        description: '都市中的一片宁静，品味咖啡与生活的美好',
        isFavorite: false
      },
      {
        id: 3,
        name: '寿司大师',
        avatar: 'data:image/webp;base64,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',
        cover: 'https://via.placeholder.com/800x400?text=寿司大师',
        rating: 4.9,
        category: 'japanese',
        distance: '2.5km',
        deliveryTime: '45分钟',
        description: '正宗日式料理，由日本师傅亲自操刀',
        isFavorite: true
      },
      {
        id: 4,
        name: '披萨工坊',
        avatar: 'data:image/webp;base64,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',
        cover: 'https://via.placeholder.com/800x400?text=披萨工坊',
        rating: 4.3,
        category: 'western',
        distance: '1.8km',
        deliveryTime: '35分钟',
        promotion: '买一送一',
        description: '纯手工制作，意大利传统风味',
        isFavorite: false
      }
    ]
  } catch (error) {
    console.error('获取商家数据失败', error)
  } finally {
    loading.value = false
  }
}

const toggleFavorite = (id: number) => {
  const merchant = merchants.value.find(m => m.id === id)
  if (merchant) {
    merchant.isFavorite = !merchant.isFavorite
  }
}

onMounted(() => {
  fetchMerchants()
})

//搜索框
import {getMerchantInfo} from "@/api/merchant"
import { Search } from '@element-plus/icons-vue'
const searchQuery = ref('') // 绑定搜索框输入值
// 辅助函数：随机选取最多 n 条数据
function getRandomItems(array, n) {
  if (array.length <= n) return [...array];
  // 随机打乱数组并取前n条
  return [...array].sort(() => 0.5 - Math.random()).slice(0, n);
}
const handleSearch = () => {
  console.log('搜索关键词:', searchQuery.value)
  // 这里添加搜索逻辑，比如过滤商家列表
  getMerchantInfo( searchQuery.value )
      .then(response => {
        // 处理返回的商家数据
        const mappedMerchants = response.data.records.map(shop => ({
          id: shop.id,
          name: shop.merchantName,      // 后端字段可能是 merchantName
          avatar: shop.avatar || 'https://via.placeholder.com/80',  // 默认头像
          cover: shop.cover || 'https://via.placeholder.com/800x400', // 默认封面
          rating: shop.avgRating || 0,   // 后端可能是 avgRating
          category: shop.categoryId || 'all', // 后端可能是 categoryId
          distance: shop.distance || '1.2km', // 默认距离
          deliveryTime: shop.deliveryTime || '30分钟', // 默认时间
          promotion: shop.promotion || '', // 促销信息
          description: shop.description || '暂无描述',
          isFavorite: false              // 默认未收藏
        }));

        // 2. 随机选取最多6条
        const randomMerchants = getRandomItems(mappedMerchants, 6);

        // 3. 更新到 merchants
        merchants.value = randomMerchants;
      })
      .catch(error => {
        console.error('搜索失败:', error);
      });
}
</script>

<template>
  <div class="user-main-page">
    <el-card shadow="never" class="luxury-card">
      <template #header>
        <div class="card-header">
          <h1><i class="el-icon-house"></i> 发现附近好店</h1>
          <div class="header-actions">
            <el-input
                v-model="searchQuery"
                placeholder="搜索商家名字"
                class="search-input"
                size="large"
            >
              <template #suffix>
                <el-icon class="search-icon" @click="handleSearch">
                  <Search />
                </el-icon>
              </template>
            </el-input>
          </div>
        </div>
      </template>

      <div class="categories">
        <el-scrollbar>
          <div class="category-list">
            <el-tag
                v-for="category in categories"
                :key="category.value"
                :type="activeCategory === category.value ? 'primary' : 'info'"
                size="large"
                effect="plain"
                @click="activeCategory= category.value"
                class="category-tag"
            >
              {{ category.label }}
            </el-tag>
          </div>
        </el-scrollbar>
      </div>

      <div class="merchant-list" v-loading="loading">
        <div v-if="merchants.length === 0 && !loading" class="empty">
          <img src="@/assets/images/empty-shop.png" alt="暂无商家" class="empty-image">
          <p class="empty-text">附近暂无商家</p>
        </div>

        <div v-for="merchant in merchants" :key="merchant.id" class="merchant-card">
          <div class="merchant-cover" @click="$router.push(`/merchant/${merchant.id}`)">
            <el-image :src="merchant.cover" class="cover-image" fit="cover" />
            <div class="cover-overlay">
              <div class="promotion" v-if="merchant.promotion">
                <el-tag type="danger" effect="dark" size="large">
                  {{ merchant.promotion }}
                </el-tag>
              </div>
              <div class="favorite" @click.stop="toggleFavorite(merchant.id)">
                <el-icon :size="28" :color="merchant.isFavorite ? '#F56C6C' : '#fff'">
                  <StarFilled />
                </el-icon>
              </div>
            </div>
          </div>

          <div class="merchant-info">
            <div class="basic-info">
              <el-avatar :size="60" :src="merchant.avatar" class="merchant-avatar" />
              <div class="info-details">
                <h3 class="merchant-name" @click="$router.push(`/merchant/${merchant.id}`)">
                  {{ merchant.name }}
                </h3>
                <div class="rating">
                  <el-rate v-model="merchant.rating" disabled show-score :score-template="merchant.rating.toFixed(1)" />
                </div>
                <div class="description">
                  {{ merchant.description }}
                </div>
              </div>
            </div>

            <div class="extra-info">
              <div class="info-item">
                <el-icon><Location /></el-icon>
                <span>{{ merchant.distance }}</span>
              </div>
              <div class="info-item">
                <el-icon><Timer /></el-icon>
                <span>{{ merchant.deliveryTime }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.search-icon {
  cursor: pointer;
  color: #606266; // 默认颜色
  font-size: 16px;
  margin-right: 8px;
  transition: color 0.2s;

  &:hover {
    color: #6a11cb; // 悬停时使用主题色
  }
}

.user-main-page {
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
          font-size: 24px;
          font-weight: 600;
          display: flex;
          align-items: center;

          i {
            margin-right: 10px;
            font-size: 28px;
          }
        }

        .search-input {
          width: 300px;

          :deep(.el-input__inner) {
            height: 40px;
            line-height: 40px;
            border-radius: 20px;
            padding-left: 40px;
          }

          :deep(.el-input__prefix) {
            left: 15px;
            display: flex;
            align-items: center;
          }
        }
      }
    }

    :deep(.el-card__body) {
      padding: 25px;
    }
  }

  .categories {
    margin-bottom: 25px;

    .category-list {
      display: flex;
      gap: 10px;
      padding-bottom: 5px;
    }

    .category-tag {
      cursor: pointer;
      padding: 0 20px;
      height: 36px;
      line-height: 36px;
      font-size: 14px;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-2px);
      }
    }
  }

  .merchant-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 25px;

    .empty {
      grid-column: 1 / -1;
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
      }
    }

    .merchant-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 3px 15px rgba(0, 0, 0, 0.05);
      transition: all 0.3s;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
      }

      .merchant-cover {
        position: relative;
        height: 180px;
        cursor: pointer;

        .cover-image {
          width: 100%;
          height: 100%;
        }

        .cover-overlay {
          position: absolute;
          top: 0;
          left: -20px;
          width: 100%;
          height: 100%;
          background: linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0.1));
          display: flex;
          justify-content: flex-end;
          align-items: flex-start;
          padding: 15px;

          .promotion {
            .el-tag {
              font-weight: bold;
              font-size: 14px;
            }
          }

          .favorite {
            cursor: pointer;
            transition: all 0.3s;

            &:hover {
              transform: scale(1.2);
            }
          }
        }
      }

      .merchant-info {
        padding: 20px;

        .basic-info {
          display: flex;
          margin-bottom: 15px;

          .merchant-avatar {
            border: 3px solid white;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
            margin-right: 15px;
            margin-top: -5px;
            background: white;
          }

          .info-details {
            flex: 1;

            .merchant-name {
              margin: 10px 0 5px 0;
              font-size: 18px;
              color: #303133;
              cursor: pointer;
              transition: all 0.2s;

              &:hover {
                color: #6a11cb;
              }
            }

            .rating {
              margin-bottom: 8px;

              :deep(.el-rate) {
                height: 20px;
              }

              :deep(.el-rate__text) {
                margin-left: 10px;
                font-size: 14px;
                color: #F7BA2A;
              }
            }

            .description {
              font-size: 14px;
              color: #606266;
              line-height: 1.5;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }

        .extra-info {
          display: flex;
          justify-content: space-between;
          padding-top: 15px;
          border-top: 1px dashed #e4e7ed;

          .info-item {
            display: flex;
            align-items: center;
            color: #909399;
            font-size: 14px;

            .el-icon {
              margin-right: 5px;
              font-size: 16px;
            }
          }
        }
      }
    }
  }
}
</style>