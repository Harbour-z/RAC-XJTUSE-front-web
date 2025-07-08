<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

// 模拟从后端获取数据
const fetchData = async () => {
  // 这里应该替换为实际的 API 请求
  return {
    merchants: [
      { id: 1, name: '商户1', ratings: [5, 4, 3, 5, 5], joinedAt: '2020-01-01' },
      { id: 2, name: '商户2', ratings: [4, 4, 4, 4, 4], joinedAt: '2021-02-02' },
      // 更多商户数据...
    ],
    users: [
      { id: 1, joinedAt: '2020-01-01', comments: [] },
      { id: 2, joinedAt: '2020-02-02', comments: ['评论1'] },
      // 更多用户数据...
    ]
  };
};

const top20FiveStarMerchantsChart = ref<HTMLElement | null>(null);
const top20CommentCountMerchantsChart = ref<HTMLElement | null>(null);
const top10AverageScoreMerchantsChart = ref<HTMLElement | null>(null);
const ratingDistributionChart = ref<HTMLElement | null>(null);
const usersJoinedByYearChart = ref<HTMLElement | null>(null);
const userRatioByYearChart = ref<HTMLElement | null>(null);

onMounted(async () => {
  const { merchants, users } = await fetchData();

  // 收获五星评论最多的商户（前20）
  const top20FiveStarMerchantsData = merchants
      .map(merchant => ({
        name: merchant.name,
        fiveStarCount: merchant.ratings.filter(rating => rating === 5).length
      }))
      .sort((a, b) => b.fiveStarCount - a.fiveStarCount)
      .slice(0, 20);

  const top20FiveStarMerchantsChartInstance = echarts.init(top20FiveStarMerchantsChart.value!);
  top20FiveStarMerchantsChartInstance.setOption({
    xAxis: {
      type: 'category',
      data: top20FiveStarMerchantsData.map(item => item.name)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: top20FiveStarMerchantsData.map(item => item.fiveStarCount),
        type: 'bar'
      }
    ]
  });

  // 统计评论数前20的商户
  const top20CommentCountMerchantsData = merchants
      .map(merchant => ({
        name: merchant.name,
        commentCount: merchant.ratings.length
      }))
      .sort((a, b) => b.commentCount - a.commentCount)
      .slice(0, 20);

  const top20CommentCountMerchantsChartInstance = echarts.init(top20CommentCountMerchantsChart.value!);
  top20CommentCountMerchantsChartInstance.setOption({
    xAxis: {
      type: 'category',
      data: top20CommentCountMerchantsData.map(item => item.name)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: top20CommentCountMerchantsData.map(item => item.commentCount),
        type: 'bar'
      }
    ]
  });

  // 统计评论平均分前10的商户
  const top10AverageScoreMerchantsData = merchants
      .map(merchant => ({
        name: merchant.name,
        averageScore: merchant.ratings.reduce((sum, rating) => sum + rating, 0) / merchant.ratings.length
      }))
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 10);

  const top10AverageScoreMerchantsChartInstance = echarts.init(top10AverageScoreMerchantsChart.value!);
  top10AverageScoreMerchantsChartInstance.setOption({
    xAxis: {
      type: 'category',
      data: top10AverageScoreMerchantsData.map(item => item.name)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: top10AverageScoreMerchantsData.map(item => item.averageScore),
        type: 'bar'
      }
    ]
  });

  // 统计商户评分分布数量
  const ratingDistributionData: Record<number, number> = {};
  merchants.forEach(merchant => {
    merchant.ratings.forEach(rating => {
      ratingDistributionData[rating] = (ratingDistributionData[rating] || 0) + 1;
    });
  });

  const ratingDistributionChartInstance = echarts.init(ratingDistributionChart.value!);
  ratingDistributionChartInstance.setOption({
    xAxis: {
      type: 'category',
      data: Object.keys(ratingDistributionData).map(Number)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: Object.values(ratingDistributionData),
        type: 'bar'
      }
    ]
  });

  // 分析每年加入的用户数量
  const usersJoinedByYearData: Record<number, number> = {};
  users.forEach(user => {
    const year = new Date(user.joinedAt).getFullYear();
    usersJoinedByYearData[year] = (usersJoinedByYearData[year] || 0) + 1;
  });

  const usersJoinedByYearChartInstance = echarts.init(usersJoinedByYearChart.value!);
  usersJoinedByYearChartInstance.setOption({
    xAxis: {
      type: 'category',
      data: Object.keys(usersJoinedByYearData).map(Number)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: Object.values(usersJoinedByYearData),
        type: 'bar'
      }
    ]
  });

  // 显示每年总用户数、沉默用户数（未写评论）、活跃用户的比例
  const usersByYear: Record<number, any[]> = {};
  users.forEach(user => {
    const year = new Date(user.joinedAt).getFullYear();
    if (!usersByYear[year]) {
      usersByYear[year] = [];
    }
    usersByYear[year].push(user);
  });

  const userRatioByYearData: Record<number, { totalUsers: number; silentUsersRatio: number; activeUsersRatio: number }> = {};
  Object.keys(usersByYear).forEach(year => {
    const yearNum = parseInt(year);
    const totalUsers = usersByYear[yearNum].length;
    const silentUsers = usersByYear[yearNum].filter(user => user.comments.length === 0).length;
    const activeUsers = totalUsers - silentUsers;

    userRatioByYearData[yearNum] = {
      totalUsers,
      silentUsersRatio: silentUsers / totalUsers,
      activeUsersRatio: activeUsers / totalUsers
    };
  });

  const userRatioByYearChartInstance = echarts.init(userRatioByYearChart.value!);
  userRatioByYearChartInstance.setOption({
    xAxis: {
      type: 'category',
      data: Object.keys(userRatioByYearData).map(Number)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '沉默用户比例',
        data: Object.values(userRatioByYearData).map(item => item.silentUsersRatio * 100),
        type: 'bar'
      },
      {
        name: '活跃用户比例',
        data: Object.values(userRatioByYearData).map(item => item.activeUsersRatio * 100),
        type: 'bar'
      }
    ]
  });
});
</script>

<template>
  <div>
    <el-card>
      <h1>数据可视化</h1>
      <!-- 收获五星评论最多的商户（前20） -->
      <h2>收获五星评论最多的商户（前20）</h2>
      <div ref="top20FiveStarMerchantsChart" style="width: 100%; height: 400px;"></div>

      <!-- 统计评论数前20的商户 -->
      <h2>统计评论数前20的商户</h2>
      <div ref="top20CommentCountMerchantsChart" style="width: 100%; height: 400px;"></div>

      <!-- 统计评论平均分前10的商户 -->
      <h2>统计评论平均分前10的商户</h2>
      <div ref="top10AverageScoreMerchantsChart" style="width: 100%; height: 400px;"></div>

      <!-- 统计商户评分分布数量 -->
      <h2>统计商户评分分布数量</h2>
      <div ref="ratingDistributionChart" style="width: 100%; height: 400px;"></div>

      <!-- 分析每年加入的用户数量 -->
      <h2>分析每年加入的用户数量</h2>
      <div ref="usersJoinedByYearChart" style="width: 100%; height: 400px;"></div>

      <!-- 每年总用户数、沉默用户数（未写评论）、活跃用户的比例 -->
      <h2>每年总用户数、沉默用户数（未写评论）、活跃用户的比例</h2>
      <div ref="userRatioByYearChart" style="width: 100%; height: 400px;"></div>
    </el-card>
  </div>
</template>



<style scoped lang="scss">

</style>