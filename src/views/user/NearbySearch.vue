<script lang="ts" setup>
import { ref } from 'vue';

// 商家类别数据
const categories = [
  {
    name: '餐饮',
    subCategories: ['川菜', '粤菜', '鲁菜', '法式西餐', '意式西餐', '美式西餐']
  },
  {
    name: '娱乐',
    subCategories: ['IMAX 厅电影院', '普通厅电影院', '小包厢 KTV', '中包厢 KTV', '大包厢 KTV']
  },
  {
    name: '购物',
    subCategories: []
  }
];

// 搜索条件
const selectedCategory = ref('');
const selectedSubCategory = ref('');
const selectedDistance = ref('');
const selectedRating = ref('');

// 视图模式
const viewMode = ref('map');

// 排序方式
const sortBy = ref('');

// 模拟商家数据
const shops = [
  {
    name: '川菜馆',
    rating: 4.5,
    distance: '2km',
    tags: ['川菜', '辣']
  },
  {
    name: '法式西餐厅',
    rating: 4.8,
    distance: '3km',
    tags: ['法式西餐', '浪漫']
  }
];

// 过滤后的商家数据
const filteredShops = ref([...shops]);

// 获取子类别
const getSubCategories = (categoryName) => {
  const category = categories.find((c) => c.name === categoryName);
  return category ? category.subCategories : [];
};

// 搜索商家
const search = () => {
  let tempShops = [...shops];
  if (selectedCategory.value) {
    // 这里需要根据实际情况筛选
  }
  if (selectedSubCategory.value) {
    // 这里需要根据实际情况筛选
  }
  if (selectedDistance.value) {
    // 这里需要根据实际情况筛选
  }
  if (selectedRating.value) {
    // 这里需要根据实际情况筛选
  }
  filteredShops.value = tempShops;
};

// 排序商家
const sortShops = () => {
  if (sortBy.value === 'distance') {
    filteredShops.value.sort((a, b) => {
      const distanceA = parseInt(a.distance.replace('km', ''));
      const distanceB = parseInt(b.distance.replace('km', ''));
      return distanceA - distanceB;
    });
  } else if (sortBy.value === 'rating') {
    filteredShops.value.sort((a, b) => b.rating - a.rating);
  }
};
</script>

<template>
  <div>
    <!-- 搜索筛选区域 -->
    <el-card>
      <el-row>
        <!-- 商家类别选择 -->
        <el-col :span="6">
          <el-select v-model="selectedCategory" placeholder="选择商家类别" clearable>
            <el-option
                v-for="category in categories"
                :key="category.name"
                :label="category.name"
                :value="category.name"
            >
            </el-option>
          </el-select>
        </el-col>
        <!-- 子类别选择 -->
        <el-col :span="6">
          <el-select v-model="selectedSubCategory" placeholder="选择子类别" clearable>
            <el-option
                v-for="subCategory in getSubCategories(selectedCategory)"
                :key="subCategory"
                :label="subCategory"
                :value="subCategory"
            >
            </el-option>
          </el-select>
        </el-col>
        <!-- 距离筛选 -->
        <el-col :span="6">
          <el-select v-model="selectedDistance" placeholder="选择距离" clearable>
            <el-option label="1km 以内" value="1km"></el-option>
            <el-option label="5km 以内" value="5km"></el-option>
            <el-option label="10km 以内" value="10km"></el-option>
          </el-select>
        </el-col>
        <!-- 评分筛选 -->
        <el-col :span="6">
          <el-select v-model="selectedRating" placeholder="选择评分" clearable>
            <el-option label="4 星以上" value="4"></el-option>
            <el-option label="4.5 星以上" value="4.5"></el-option>
            <el-option label="5 星" value="5"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="6">
          <el-button @click="search">搜索</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- 模式切换 -->
    <el-radio-group v-model="viewMode">
      <el-radio label="map">地图模式</el-radio>
      <el-radio label="list">列表模式</el-radio>
    </el-radio-group>
    <!-- 地图模式 -->
    <div v-if="viewMode === 'map'">
      <baidu-map class="bm-view" :zoom="12" :center="{ lng: 116.404, lat: 39.915 }">
        <!-- 这里可以添加地图标记逻辑 -->
        <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
      </baidu-map>
    </div>
    <!-- 列表模式 -->
    <div v-else>
      <el-table :data="filteredShops" style="width: 100%">
        <el-table-column prop="name" label="商家名称"></el-table-column>
        <el-table-column prop="rating" label="评分"></el-table-column>
        <el-table-column prop="distance" label="距离"></el-table-column>
        <el-table-column prop="tags" label="特色标签">
          <template #default="scope">
            <el-tag v-for="tag in scope.row.tags" :key="tag">{{ tag }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-row style="margin-top: 10px">
        <el-col :span="6">
          <el-select v-model="sortBy" placeholder="排序方式">
            <el-option label="距离从近到远" value="distance"></el-option>
            <el-option label="评分从高到低" value="rating"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button @click="sortShops">排序</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style>
.bm-view {
  width: 100%;
  height: 600px;
}
</style>