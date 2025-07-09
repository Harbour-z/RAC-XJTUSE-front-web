<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { StarFilled, Location, Timer, Goods, Discount } from '@element-plus/icons-vue'

const merchant = ref({
  id: 1,
  name: '美食家餐厅',
  avatar: 'https://via.placeholder.com/100',
  cover: 'https://via.placeholder.com/1200x400?text=美食家餐厅',
  rating: 4.8,
  monthlySales: 1289,
  deliveryTime: '30分钟',
  distance: '1.2km',
  minOrder: 20,
  deliveryFee: 5,
  description: '专注传统美食20年，为您带来最地道的家乡味道',
  isFavorite: true,
  promotions: [
    {
      id: 1,
      title: '新用户立减20元',
      description: '首次下单立享20元优惠',
      type: 'discount'
    },
    {
      id: 2,
      title: '满100减15',
      description: '单笔订单满100元减15元',
      type: 'voucher'
    },
    {
      id: 3,
      title: '招牌套餐8折',
      description: '精选招牌菜品组合优惠',
      type: 'combo'
    }
  ],
  featuredProducts: [
    {
      id: 1,
      name: '招牌红烧肉',
      price: 58,
      image: 'https://via.placeholder.com/200x200?text=招牌红烧肉',
      sales: 328,
      rating: 4.9
    },
    {
      id: 2,
      name: '清蒸鲈鱼',
      price: 68,
      image: 'https://via.placeholder.com/200x200?text=清蒸鲈鱼',
      sales: 256,
      rating: 4.8
    },
    {
      id: 3,
      name: '宫保鸡丁',
      price: 38,
      image: 'https://via.placeholder.com/200x200?text=宫保鸡丁',
      sales: 412,
      rating: 4.7
    }
  ]
})

const loading = ref(false)
const activeTab = ref('menu')

const fetchMerchantData = async () => {
  loading.value = true
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 800))
  } catch (error) {
    console.error('获取商家数据失败', error)
  } finally {
    loading.value = false
  }
}

const toggleFavorite = () => {
  merchant.value.isFavorite = !merchant.value.isFavorite
}

onMounted(() => {
  fetchMerchantData()
})
</script>

<template>
  <div class="merchant-main-page">
    <el-card shadow="never" class="luxury-card">
      <!-- 商家封面 -->
      <div class="merchant-cover">
        <el-image :src="merchant.cover" class="cover-image" fit="cover" />
        <div class="cover-overlay">
          <div class="favorite" @click="toggleFavorite">
            <el-icon :size="32" :color="merchant.isFavorite ? '#F56C6C' : '#fff'">
              <StarFilled />
            </el-icon>
            <span>{{ merchant.isFavorite ? '已收藏' : '收藏' }}</span>
          </div>
        </div>
      </div>

      <!-- 商家基本信息 -->
      <div class="merchant-basic-info">
        <div class="avatar-section">
          <el-avatar :size="100" :src="merchant.avatar" class="merchant-avatar" />
        </div>

        <div class="info-section">
          <h1 class="merchant-name">{{ merchant.name }}</h1>

          <div class="rating-section">
            <el-rate v-model="merchant.rating" disabled show-score :score-template="merchant.rating.toFixed(1)" />
            <span class="sales">月售{{ merchant.monthlySales }}单</span>
          </div>

          <div class="delivery-info">
            <div class="info-item">
              <el-icon><Timer /></el-icon>
              <span>{{ merchant.deliveryTime }}</span>
            </div>
            <div class="info-item">
              <el-icon><Location /></el-icon>
              <span>{{ merchant.distance }}</span>
            </div>
          </div>

          <div class="price-info">
            <div class="info-item">
              <span>起送 ¥{{ merchant.minOrder }}</span>
            </div>
            <div class="info-item">
              <span>配送费 ¥{{ merchant.deliveryFee }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 商家描述 -->
      <div class="merchant-description">
        <p>{{ merchant.description }}</p>
      </div>

      <!-- 促销活动 -->
      <div class="promotion-section">
        <h2 class="section-title">
          <el-icon><Discount /></el-icon>
          <span>优惠活动</span>
        </h2>

        <div class="promotion-list">
          <div v-for="promo in merchant.promotions" :key="promo.id" class="promotion-item">
            <div class="promo-icon">
              <el-icon v-if="promo.type === 'discount'"><PriceTag /></el-icon>
              <el-icon v-else-if="promo.type === 'voucher'"><Ticket /></el-icon>
              <el-icon v-else><Goods /></el-icon>
            </div>
            <div class="promo-content">
              <h3>{{ promo.title }}</h3>
              <p>{{ promo.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 标签页 -->
      <el-tabs v-model="activeTab" class="merchant-tabs">
        <el-tab-pane label="点餐" name="menu">
          <div class="featured-products">
            <h2 class="section-title">
              <el-icon><Star /></el-icon>
              <span>招牌推荐</span>
            </h2>

            <div class="product-list">
              <div v-for="product in merchant.featuredProducts" :key="product.id" class="product-card">
                <el-image :src="product.image" class="product-image" fit="cover" />
                <div class="product-info">
                  <h3>{{ product.name }}</h3>
                  <div class="product-meta">
                    <span class="price">¥{{ product.price }}</span>
                    <span class="sales">月售{{ product.sales }}</span>
                  </div>
                  <div class="product-rating">
                    <el-rate v-model="product.rating" disabled size="small" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="评价" name="reviews">
          <div class="reviews-section">
            <p>这里是商家评价内容</p>
          </div>
        </el-tab-pane>

        <el-tab-pane label="商家" name="info">
          <div class="info-section">
            <p>这里是商家详细信息</p>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.merchant-main-page {
  padding: 20px;
  background: #f5f7fa;

  .luxury-card {
    border-radius: 12px;
    border: none;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);

    :deep(.el-card__body) {
      padding: 0;
    }
  }

  .merchant-cover {
    position: relative;
    height: 250px;

    .cover-image {
      width: 100%;
      height: 100%;
    }

    .cover-overlay {
      position: absolute;
      top: 0;
      left: -25px;
      width: 100%;
      height: 100%;
      background: linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0.1));
      display: flex;
      justify-content: flex-end;
      align-items: flex-start;
      padding: 20px;

      .favorite {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        color: white;
        transition: all 0.3s;

        span {
          margin-top: 5px;
          font-size: 14px;
        }

        &:hover {
          transform: scale(1.1);
        }
      }
    }
  }

  .merchant-basic-info {
    display: flex;
    padding: 20px;
    position: relative;

    .avatar-section {
      margin-right: 20px;
      margin-top: -60px;

      .merchant-avatar {
        border: 4px solid white;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      }
    }

    .info-section {
      flex: 1;

      .merchant-name {
        margin: 0 0 10px 0;
        font-size: 24px;
        color: #303133;
      }

      .rating-section {
        display: flex;
        align-items: center;
        margin-bottom: 15px;

        :deep(.el-rate) {
          height: 24px;
        }

        :deep(.el-rate__text) {
          margin-left: 10px;
          font-size: 16px;
          color: #F7BA2A;
        }

        .sales {
          margin-left: 15px;
          color: #909399;
          font-size: 14px;
        }
      }

      .delivery-info {
        display: flex;
        gap: 20px;
        margin-bottom: 15px;

        .info-item {
          display: flex;
          align-items: center;
          color: #606266;
          font-size: 14px;

          .el-icon {
            margin-right: 5px;
            font-size: 16px;
          }
        }
      }

      .price-info {
        display: flex;
        gap: 20px;

        .info-item {
          color: #606266;
          font-size: 14px;
        }
      }
    }
  }

  .merchant-description {
    padding: 0 20px 20px 20px;
    color: #606266;
    font-size: 14px;
    line-height: 1.6;
    border-bottom: 1px solid #f0f0f0;
  }

  .promotion-section {
    padding: 20px;
    border-bottom: 1px solid #f0f0f0;

    .section-title {
      display: flex;
      align-items: center;
      margin: 0 0 15px 0;
      font-size: 18px;
      color: #303133;

      .el-icon {
        margin-right: 10px;
        font-size: 20px;
        color: #F56C6C;
      }
    }

    .promotion-list {
      .promotion-item {
        display: flex;
        padding: 12px 0;
        border-bottom: 1px dashed #e4e7ed;

        &:last-child {
          border-bottom: none;
        }

        .promo-icon {
          margin-right: 15px;

          .el-icon {
            font-size: 20px;
            color: #6a11cb;
          }
        }

        .promo-content {
          flex: 1;

          h3 {
            margin: 0 0 5px 0;
            font-size: 16px;
            color: #303133;
          }

          p {
            margin: 0;
            font-size: 14px;
            color: #909399;
          }
        }
      }
    }
  }

  .merchant-tabs {
    padding: 0 20px;

    :deep(.el-tabs__nav-wrap) {
      &::after {
        height: 1px;
        background-color: #e4e7ed;
      }
    }

    :deep(.el-tabs__item) {
      font-size: 16px;
      font-weight: 500;
      height: 50px;
      line-height: 50px;

      &:hover {
        color: #6a11cb;
      }

      &.is-active {
        color: #6a11cb;
      }
    }

    :deep(.el-tabs__active-bar) {
      background-color: #6a11cb;
      height: 3px;
    }
  }

  .featured-products {
    padding: 20px 0;

    .section-title {
      display: flex;
      align-items: center;
      margin: 0 0 15px 0;
      font-size: 18px;
      color: #303133;

      .el-icon {
        margin-right: 10px;
        font-size: 20px;
        color: #F7BA2A;
      }
    }

    .product-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;

      .product-card {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
        transition: all 0.3s;
        cursor: pointer;

        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .product-image {
          width: 100%;
          height: 160px;
        }

        .product-info {
          padding: 12px;

          h3 {
            margin: 0 0 8px 0;
            font-size: 16px;
            color: #303133;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .product-meta {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;

            .price {
              color: #F56C6C;
              font-weight: bold;
            }

            .sales {
              color: #909399;
              font-size: 12px;
            }
          }

          .product-rating {
            :deep(.el-rate) {
              height: 16px;
            }
          }
        }
      }
    }
  }

  .reviews-section,
  .info-section {
    padding: 20px 0;
    min-height: 300px;
  }
}
</style>