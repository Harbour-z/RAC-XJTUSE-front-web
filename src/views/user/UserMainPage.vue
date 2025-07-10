<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
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
const allMerchants = ref<Merchant[]>([]) // 存储所有商家数据，用于筛选
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

// 计算属性：根据当前选中的分类筛选商家
const filteredMerchants = computed(() => {
  if (activeCategory.value === 'all') {
    return merchants.value
  }
  return allMerchants.value.filter(merchant => merchant.category === activeCategory.value)
})

const fetchMerchants = async () => {
  loading.value = true
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 800))
    const mockData = [
      {
        id: 1,
        name: '美食家餐厅',
        avatar: '',
        cover: '',
        rating: 4.8,
        category: '1', // 修改为对应分类ID
        distance: '1.2km',
        deliveryTime: '30分钟',
        promotion: '新用户立减20元',
        description: '专注传统美食20年，为您带来最地道的家乡味道',
        isFavorite: true
      },
      {
        id: 2,
        name: '咖啡时光',
        avatar: '',
        cover: '',
        rating: 4.5,
        category: '4', // 修改为对应分类ID
        distance: '0.8km',
        deliveryTime: '25分钟',
        promotion: '下午茶套餐7折',
        description: '都市中的一片宁静，品味咖啡与生活的美好',
        isFavorite: false
      },
      {
        id: 3,
        name: '寿司大师',
        avatar:'',
        cover: '',
        rating: 4.9,
        category: '3', // 修改为对应分类ID
        distance: '2.5km',
        deliveryTime: '45分钟',
        description: '正宗日式料理，由日本师傅亲自操刀',
        isFavorite: true
      },
      {
        id: 4,
        name: '披萨工坊',
        avatar:'',
        cover: '',
        rating: 4.3,
        category: '2', // 修改为对应分类ID
        distance: '1.8km',
        deliveryTime: '35分钟',
        promotion: '买一送一',
        description: '纯手工制作，意大利传统风味',
        isFavorite: false
      },
      {
        id: 5,
        name: '甜蜜时光甜品屋',
        avatar: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.abcdefghijkHaHa?pid=ImgDet',
        cover: 'https://via.placeholder.com/800x400?text=甜蜜时光甜品屋',
        rating: 4.7,
        category: '4', // 甜品分类
        distance: '1.5km',
        deliveryTime: '25分钟',
        promotion: '周末特惠8折',
        description: '专业法式甜品，每日新鲜现做，带给您甜蜜体验',
        isFavorite: true
      },
      {
        id: 6,
        name: '川味小厨',
        avatar: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.klmnopqrstUVWX?pid=ImgDet',
        cover: 'https://via.placeholder.com/800x400?text=川味小厨',
        rating: 4.6,
        category: '1', // 中餐分类
        distance: '2.0km',
        deliveryTime: '40分钟',
        promotion: '满100减20',
        description: '正宗川菜风味，麻辣鲜香，让您体验地道四川味道',
        isFavorite: false
      }
    ]
    merchants.value = mockData
    allMerchants.value = mockData // 保存所有商家数据
  } catch (error) {
    console.error('获取商家数据失败', error)
  } finally {
    loading.value = false
  }
}

const toggleFavorite = (id: number) => {
  const merchant = allMerchants.value.find(m => m.id === id)
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
          avatar: shop.avatar || '',  // 默认头像
          cover: shop.cover || '', // 默认封面
          rating: shop.avgRating || 0,   // 后端可能是 avgRating
          category:  String(shop.categoryId)|| 'all', // 后端可能是 categoryId
          distance: shop.distance || '1.2km', // 默认距离
          deliveryTime: shop.deliveryTime || '30分钟', // 默认时间
          promotion: shop.promotion || '暑期优惠', // 促销信息
          description: shop.description || '暂无描述',
          isFavorite: false              // 默认未收藏
        }));

        // 2. 随机选取最多6条
        const randomMerchants = getRandomItems(mappedMerchants, 6);
        // 3. 更新到 merchants 和 allMerchants
        merchants.value = randomMerchants;
        allMerchants.value = mappedMerchants;
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
        <div v-if="filteredMerchants.length === 0 && !loading" class="empty">
          <img src="@/assets/images/empty-shop.png" alt="暂无商家" class="empty-image">
          <p class="empty-text">附近暂无商家</p>
        </div>


        <div v-for="merchant in filteredMerchants" :key="merchant.id" class="merchant-card">
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