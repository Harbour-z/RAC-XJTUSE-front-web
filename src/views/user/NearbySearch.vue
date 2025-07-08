<script lang="ts" setup>



</script>

<template>
  <div >
    <el-card >
      附近搜索
    </el-card>
  </div>
  <div>
    <baidu-map class="bm-view" :zoom="12" :center="{lng: 116.404, lat: 39.915}" >
    </baidu-map>
  </div>

</template>

<style>
.bm-view {
  width: 100%;
  height: 300px;
}
</style>