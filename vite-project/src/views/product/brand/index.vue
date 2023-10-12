<template>
  <div>
    <el-card class="box-card">
    <!--卡片顶部的添加品牌按钮 -->
      <el-button type="primary" icon="Plus">
        添加品牌
      </el-button>
    <!--表格-->
    <!--
      table
      --border 设置表格纵向边框是否显示
      table column
      --label:某一个列表
      --width:列宽度
      --align：对齐方式，left，center，right
    -->
      <el-table style="margin:10px 0"  :data="brandArr">
        <el-table-column fixed prop="date" label="序号" width="80px" align="center" type="index"/>
        <!--table-column默认用div展示数据-->
        <el-table-column prop="tmName" label="品牌名称" align="center" >
              <template #="{row,$index}">
                <pre style="color: #337ecc; font-weight: 700">{{row.tmName}}</pre>
              </template>
        </el-table-column>
        <el-table-column prop="state" label="品牌logo" align="center" >
          <template #="{row,$index}">
            <img style="width: 30px;height: 30px" :src="row.logoUrl.startsWith('http://') ? row.logoUrl : 'http://' + row.logoUrl" alt="nopic">
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" >
          <template #="{row,$index}">
            <el-button type="primary" size="small" icon="Edit"></el-button>
            <el-button type="danger" size="small" icon="Delete"></el-button>
          </template>
        </el-table-column>
        </el-table>
      <!--
        分页器
        pagination:
         v-model:current-page:设置分页器当前页码
         v-model:page-size	每页显示条目个数
         page-sizes	每页显示个数选择器的选项设置
         background	是否为分页按钮添加背景色
         layout	组件布局，子组件名用逗号分隔,可以设置分页器子组件布局调整
         layout中箭头->的作用是把箭头后面的组件顶到右侧显示
        -->
<!--      下方@current-change可以触发自定义事件，也可以直接调用请求，效果一样的-->
      <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="limit"
          :pager-count="5"
          :page-sizes="[3,5,7,9]"
          :background="true"
          layout="prev, pager, next,jumper,->,sizes,total, "
          :total=total
          @current-change="getHasBrand"
          @size-change="sizeChange"
      />
    </el-card>
  </div>
</template>


<script setup lang="ts">
import {ref,onMounted} from "vue";
import {reqHasBrand} from "@/api/product/brand";
import type {Records,BrandResponseData} from "@/api/product/brand/type.ts";
//当前页码
let pageNo=ref<number>(1)
//每页展示条数
let limit = ref<number>(3)
//存储已有品牌的总数
let total = ref<number>(0)
//存储已有品牌的数据
let brandArr = ref<Records>([])
//获取已有品牌的接口，封装为一个函数，任何情况下获取数据都可以调用此函数
const getHasBrand = async (pager = 1)=>{
  console.log(pager)
  //当前页码
  pageNo.value = pager
  let res:BrandResponseData = await reqHasBrand(pageNo.value,limit.value)
  if(res.code == 200){
    total=res.data.total
    brandArr.value=res.data.records
  }
}
//组件挂载完毕即发送一次请求
onMounted(()=>{
  getHasBrand()
})
//分页器页码发生变化时触发
//pageNo和limit已经通过分页器中v-model获取到了
//页码改变时，重发请求，携带pageNo和limit
//自定义事件current-change	current-page 改变时触发，回传了当前页码给父组件
// const changePageNo = async()=>{
//   await getHasBrand()
// }

//下拉菜单修改每页显示条目数时调用此方法，回传的是limit
//limit也已经通过v-model获取到了
//因为有其他逻辑，不能直接调用请求方法
//当limit发生变化时，应该让页码跳回第一页
const sizeChange = ()=>{
   getHasBrand()
}
</script>


<style scoped>

</style>