<script lang="ts" setup>
import {ref, watchEffect} from 'vue';
import { pageShops } from "@/api/user"
import {BaiduMap, BmGeolocation, BmNavigation, BmPointCollection} from "vue-baidu-map-3x";



// 处理分页大小改变
const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  getShops();
};
// 处理当前页码改变
const handleCurrentChange = (newPage) => {
  pageNum.value = newPage;
  getShops();
};

// 表格数据
const shopList = ref([]);


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
];

// 搜索条件
const pageNum = ref(1);
const pageSize = ref(10);
const total = ref(0)
const selectedCategory = ref('');
const selectedSubCategory = ref('');
const selectedRating = ref('');

// 视图模式
const viewMode = ref('map');

// 排序方式
const sortBy = ref('');

// 检索商家数据
const getShops = async () => {
  loading.value = true; // 开始加载
  const query = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    categoryId: selectedSubCategory.value,
    avgRating: selectedRating.value
  }

  try {
    const res = await pageShops(query);
    shopList.value = res.data.records;
    total.value = res.data.total;
    // 数据加载完成后，更新地图标记
    updateMapPoints();
  } catch (error) {
    console.error('获取商家数据失败', error);
    // 可以添加错误提示
  } finally {
    loading.value = false; // 加载完成
  }
};

// 更新地图标记的函数
const updateMapPoints = () => {
  points.value = shopList.value.map(shop => ({
    lng: shop.longitude,
    lat: shop.latitude,
    data: shop
  }));
  console.log(points.value);
};

// 获取子类别
const getSubCategories = (categoryName) => {
  const category = categories.find((c) => c.name === categoryName);
  return category ? category.subCategories : [];
};

// 排序商家
const sortShops = () => {
  if (sortBy.value === 'distance') {
    shopList.value.sort((a, b) => {
      const distanceA = parseInt(a.distance.replace('km', ''));
      const distanceB = parseInt(b.distance.replace('km', ''));
      return distanceA - distanceB;
    });
  } else if (sortBy.value === 'rating') {
    shopList.value.sort((a, b) => b.avgRating - a.avgRating);
  }
};

//地图上标点
// 管理每个信息窗口的状态
const points = ref([]);
const loading = ref(false); //加载状态


const clickHandler = (e) => {
  // 获取点击的点数据
  const pointData = points.value[e.pointIndex]?.data;
  if (pointData) {
    // 可以打开弹窗或信息窗口显示详情
    alert(`点击了：${pointData.merchantName}\n地址：${pointData.address}`);
  } else {
    alert(`单击点的坐标为：${e.point.lng}，${e.point.lat}`);
  }
};

// 监听视图模式变化，确保切换到地图时更新标记
watchEffect(() => {
  if (viewMode.value === 'map' && shopList.value.length > 0) {
    updateMapPoints();
  }
});


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
        <el-col :span="6">
          <el-select placeholder="选择距离" clearable>
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
          <el-button @click="getShops">搜索</el-button>
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
      <baidu-map key="points.length" class="bm-view" :zoom="20" :center="{ lng: 108.98255910344992, lat: 34.25067879348277 }" :scroll-wheel-zoom="true">
        <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>

        <bm-point-collection
            :points="points"
            shape="BMAP_POINT_SHAPE_STAR"
            color="red"
            size="BMAP_POINT_SIZE_SMALL"
            @click="clickHandler"
        ></bm-point-collection>
      </baidu-map>
    </div>
    <!-- 列表模式 -->
    <div v-else>
      <el-table :data="shopList" style="width: 100%">
        <el-table-column fixed prop="merchantName" label="店铺名" width = "150px" />
        <el-table-column prop="address" label="地址" />
        <el-table-column prop="avgRating" label="评分" />
        <el-table-column prop="tag" label="标签" />

      </el-table>
      <el-pagination
          :page-sizes="[5, 10, 20, 30, 40]"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          v-model:current-page="pageNum"
          v-model:page-size="pageSize"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
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

.shop-info {
  padding: 10px;
  min-width: 200px;
}
.shop-info h3 {
  margin: 0 0 5px 0;
  font-size: 16px;
}
.shop-info p {
  margin: 3px 0;
  font-size: 14px;
}
</style>