<script setup lang="ts">
import * as echarts from 'echarts';
import {onMounted} from "vue";
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {aiChat} from "@/api/api";

const result = ref('')
const imageUrl = ref('')
const msg = ref('')

const sendMsg = () => {
  const query = {
    msg: msg.value
  }
  console.info(query)

  aiChat(query).then(res => {
    console.info(query)
    result.value = res.data
  })
}

const handleAvatarSuccess = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
}
//准备容器：div，有id，有宽高
//挂载
onMounted(() => {
  //使用echarts初始化容器
  const obj = echarts.init(document.getElementById('test'))
//增加容器配置
  const data = genData(50);
  function genData(count) {
    // prettier-ignore
    const nameList = [
      '赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈', '褚', '卫', '蒋', '沈', '韩', '杨', '朱', '秦', '尤', '许', '何', '吕', '施', '张', '孔', '曹', '严', '华', '金', '魏', '陶', '姜', '戚', '谢', '邹', '喻', '柏', '水', '窦', '章', '云', '苏', '潘', '葛', '奚', '范', '彭', '郎', '鲁', '韦', '昌', '马', '苗', '凤', '花', '方', '俞', '任', '袁', '柳', '酆', '鲍', '史', '唐', '费', '廉', '岑', '薛', '雷', '贺', '倪', '汤', '滕', '殷', '罗', '毕', '郝', '邬', '安', '常', '乐', '于', '时', '傅', '皮', '卞', '齐', '康', '伍', '余', '元', '卜', '顾', '孟', '平', '黄', '和', '穆', '萧', '尹', '姚', '邵', '湛', '汪', '祁', '毛', '禹', '狄', '米', '贝', '明', '臧', '计', '伏', '成', '戴', '谈', '宋', '茅', '庞', '熊', '纪', '舒', '屈', '项', '祝', '董', '梁', '杜', '阮', '蓝', '闵', '席', '季', '麻', '强', '贾', '路', '娄', '危'
    ];
    const legendData = [];
    const seriesData = [];
    for (var i = 0; i < count; i++) {
      var name =
          Math.random() > 0.65
              ? makeWord(4, 1) + '·' + makeWord(3, 0)
              : makeWord(2, 1);
      legendData.push(name);
      seriesData.push({
        name: name,
        value: Math.round(Math.random() * 100000)
      });
    }
    return {
      legendData: legendData,
      seriesData: seriesData
    };
    function makeWord(max, min) {
      const nameLen = Math.ceil(Math.random() * max + min);
      const name = [];
      for (var i = 0; i < nameLen; i++) {
        name.push(nameList[Math.round(Math.random() * nameList.length - 1)]);
      }
      return name.join('');
    }
  }

  const option = {
    title: {
      text: '同名数量统计',
      subtext: '纯属虚构',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
      top: 20,
      bottom: 20,
      data: data.legendData
    },
    series: [
      {
        name: '姓名',
        type: 'pie',
        radius: '55%',
        center: ['40%', '50%'],
        data: data.seriesData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
//绑定配置
  obj.setOption(option)
})

</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>用户统计</span>
      </div>
    </template>
  </el-card>
  <div id="test" style="width: 600px;height: 400px;">

  </div>
  <div>
    <el-upload
        class="avatar-uploader"
        action="/api/file/upload"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
    问题：<br>
    <el-input
        v-model="msg"
        style="width: 540px"
        :rows="10"
        type="textarea"
        placeholder="Please input"
    />
    <el-button type="primary" round @click="sendMsg">提问</el-button><br>
    <div>
      回答：<div v-text="result"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>