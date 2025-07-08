<script setup lang="ts">
import { ref } from 'vue';

// 模拟收藏商家数据
const favoriteMerchants = ref([
  { id: 1, name: '商家1', tags: ['常去'], latestNews: '优惠活动：满100减20' },
  { id: 2, name: '商家2', tags: ['备选'], latestNews: '新品上架：特色小吃' },
]);

// 模拟推荐商家数据
const recommendedMerchants = ref([
  { id: 3, name: '商家3', tags: ['待体验'] },
  { id: 4, name: '商家4', tags: ['备选'] },
]);

const tableRef = ref(null);

// 删除单个商家
const deleteMerchant = (merchant) => {
  const index = favoriteMerchants.value.findIndex((item) => item.id === merchant.id);
  if (index !== -1) {
    favoriteMerchants.value.splice(index, 1);
  }
};

// 批量删除商家
const batchDelete = () => {
  const selectedRows = tableRef.value?.getSelectionRows();
  if (selectedRows && selectedRows.length > 0) {
    selectedRows.forEach((row) => {
      const index = favoriteMerchants.value.findIndex((item) => item.id === row.id);
      if (index !== -1) {
        favoriteMerchants.value.splice(index, 1);
      }
    });
    tableRef.value?.clearSelection();
  }
};

// 添加商家到收藏列表
const addMerchantToFavorites = (merchant) => {
  const isExist = favoriteMerchants.value.some((item) => item.id === merchant.id);
  if (!isExist) {
    favoriteMerchants.value.push({ ...merchant, latestNews: '' });
  }
};
</script>

<template>
  <div>
    <el-card>
      <template #header>
        <div class="card-header">
          <h1>收藏管理</h1>
        </div>
      </template>
      <el-table :data="favoriteMerchants" ref="tableRef" stripe>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="商家名称"></el-table-column>
        <el-table-column prop="tags" label="标签">
          <template #default="{ row }">
            <el-tag v-for="tag in row.tags" :key="tag" size="mini">
              {{ tag }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="latestNews" label="最新动态"></el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="danger" size="small" @click="deleteMerchant(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-actions">
        <el-button type="danger" @click="batchDelete">批量删除</el-button>
      </div>
    </el-card>
    <el-card>
      <template #header>
        <div class="card-header">
          <h1>推荐商家</h1>
        </div>
      </template>
      <el-table :data="recommendedMerchants" stripe>
        <el-table-column prop="name" label="商家名称"></el-table-column>
        <el-table-column prop="tags" label="标签">
          <template #default="{ row }">
            <el-tag v-for="tag in row.tags" :key="tag" size="mini">
              {{ tag }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="addMerchantToFavorites(row)">一键收藏</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.card-header {
  display: flex;
  align-items: center;
}

.table-actions {
  margin-top: 16px;
}
</style>