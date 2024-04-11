<template>
  <el-card>
    <div class="card">
      <img :src="userStore.avatar" alt="" class="avatar">
      <div class="bottom">
        <h3 class="title">{{ getTime() }}{{ userStore.username }}</h3>
        <p class="sub_title">fastapi运营平台</p>
      </div>
    </div>
  </el-card>
  <div class="chart">
  <el-card>
    <div ref="container"></div>
    <button @click="onClick">Update Data</button>
  </el-card>
  </div>
  <div class="pic">
  <svg-icon name="welcome" width="500px" height="500px"></svg-icon>
  </div>
</template>

<script setup lang="ts">
import useUserStore from "@/store/modules/user.ts";
import {getTime} from "@/utils/time.ts";
import {Chart} from "@antv/g2";
import {onMounted, ref} from "vue";
// 存储用户信息的仓库对象
let userStore = useUserStore()

let chart:any
const container = ref(null)
onMounted(()=>{
  chart = renderBarChart(container.value);
})


function onClick() {
  updateBarChart(chart);
}

// 渲染条形图
function renderBarChart(container:any) {
  const chart = new Chart({
    container,
  });

  // 准备数据
  const data = [
    { genre: 'Sports', sold: 275 },
    { genre: 'Strategy', sold: 115 },
    { genre: 'Action', sold: 120 },
    { genre: 'Shooter', sold: 350 },
    { genre: 'Other', sold: 150 },
  ];

  // 声明可视化
  chart
      .interval() // 创建一个 Interval 标记
      .data(data) // 绑定数据
      .encode('x', 'genre') // 编码 x 通道
      .encode('y', 'sold') // 编码 y 通道
      .encode('key', 'genre') // 指定 key
      .animate('update', { duration: 300 }); // 指定更新动画的时间

  // 渲染可视化
  chart.render();

  return chart;
}

// 更新条形图的数据
function updateBarChart(chart) {
  // 获得 Interval Mark
  const interval = chart.getNodesByType('interval')[0];

  // 模拟并且更新 Interval 的数据
  const newData = interval.data().map((d) => ({
    ...d,
    sold: Math.random() * 400 + 100,
  }));

  interval.data(newData);

  // 重新渲染
  chart.render();
}
</script>


<style scoped lang="scss">
.card {
  display: flex;

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  .bottom{
    margin-top: 16px;
    margin-left: 20px;
    .title{
      font-size: 30px;
      font-weight: 900;
      margin-bottom: 20px;
    }
    .sub_title{
      //font-style: italic;
      color: darkgray;
    }
  }
}
.chart{
  margin:10px 0;
}
.pic{
  display: flex;
  justify-content: center;
  align-content: center;
}
</style>