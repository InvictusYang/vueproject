<template>
  <el-card>
    <el-table border style="margin: 10px 0" :data="skuArr">
      <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
      <el-table-column label="名称" show-overflow-tooltip width="150px" prop="skuName"></el-table-column>
      <el-table-column label="描述" show-overflow-tooltip width="150px" prop="skuDesc"></el-table-column>
      <el-table-column label="图片" width="150px">
        <template #="{row, $index}">
          <img :src="row.skuDefaultImg" style="height: 100px; width: 100px">
        </template>
      </el-table-column>
      <el-table-column label="重量" width="150px" prop="weight"></el-table-column>
      <el-table-column label="价格" width="150px" prop="price"></el-table-column>
      <el-table-column label="操作" width="250px" fixed="right">
        <template #="{row, $index}">
          <el-button
              size="small"
              :icon="row.isSale==1?'Bottom':'top'"
              :type="row.isSale==1?'info':'primary'"
              @click=saleStatusHandler(row)
          ></el-button>
          <el-button type="success" size="small" icon="edit" @click="unfinished"></el-button>
          <el-button type="warning" size="small" icon="infoFilled" @click="showDrawer(row)"></el-button>
          <el-popconfirm :title="`确定要删除${row.skuName}?`" @confirm="deleteSku(row.id)">
            <template #reference>
              <el-button icon="delete" type="danger" size="small" ></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[10,20,30,50]"
        :background="true"
        layout="prev, pager, next, jumper,->,sizes,total"
        :total="total"
        @current-change="getSkuData"
        @size-change="handler"
    />
  </el-card>
  <!--  抽屉组件，用来展示商品详情-->
  <el-drawer
      v-model="drawer"
      title="查看商品详情"
  >
    <template #header>
      <h4>商品详情</h4>
    </template>
    <template #default>
      <el-row style="margin: 0 0 30px 0">
        <el-col :span="6">名称</el-col>
        <el-col :span="18">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row style="margin: 0 0 30px 0">
        <el-col :span="6">描述</el-col>
        <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row style="margin: 0 0 30px 0">
        <el-col :span="6">价格</el-col>
        <el-col :span="18">{{skuInfo.price}}元</el-col>
      </el-row>
      <el-row style="margin: 0 0 30px 0">
        <el-col :span="6">平台属性</el-col>
        <el-col :span="18">
          <el-tag v-for="item in skuInfo.skuAttrValueList" :key="item.id" style="margin: 0 5px 5px 0">{{ item.valueName }}</el-tag>
        </el-col>
      </el-row>
      <el-row style="margin: 0 0 30px 0">
        <el-col :span="6">销售属性</el-col>
        <el-col :span="18">
          <el-tag type="danger" v-for="item in skuInfo.skuSaleAttrValueList" :key="item.id" style="margin: 0 5px 5px 0">{{ item.saleAttrValueName }}</el-tag>
        </el-col>
      </el-row>
      <el-row style="margin: 0 0 30px 0">
        <el-col :span="6">图片</el-col>
        <el-col :span="18">
          <el-carousel :interval="4000" type="card" height="200px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" style="height: 100%; width: 100%">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
//引入请求
import {reqCancelSale, reqDeleteSku, reqOnSale, reqSkuInfo, reqSkuList} from "@/api/product/sku";
import {SkuData, SkuResponseData} from "@/api/product/sku/type.ts";
import {ElMessage} from "element-plus";
import {SkuInfoData} from "@/api/product/spu/type.ts";
//分页器默认页码
let pageNo = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
let skuArr = ref<SkuResponseData[]>([])
//控制抽屉显隐
let drawer = ref<boolean>(false)
// 存储sku详情
let skuInfo = ref<any>([])
//组件挂载自动请求数据
onMounted(() => {
  getSkuData()
})
//封装一个请求方法
const getSkuData = async (pager = 1) => {
  //当前分页器页码
  pageNo.value = pager
  let res: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)
  if (res.code == 200) {
    total.value = res.data.total
    skuArr.value = res.data.records
  }
}
// 页码变化时更新,可以将getSkuData作为事件回调，避免代码重复
// const changePage= (num:number)=>{
//   // num是自动注入的页码信息
//   pageNo.value=num
//   // 将页码注入请求函数
//   getSkuData(pageNo.value)
// }

// 分页器size下拉菜单发生变化回调
// v-model会自动收集pageSize，只需要重发请求即可
const handler = () => {
  getSkuData()
}

//点击下架/上架按钮回调
const saleStatusHandler = async (row: SkuData) => {
  if (row.isSale == 1) {
    //如果isSale为1，说明当前商品是上架状态,点击即为切换下架
    let res = await reqCancelSale(row.id)
    if (res.code == 200) {
      ElMessage({
        type: "success",
        message: "下架成功"
      })
      //发请求更新，页码已经在请求中获取了
      getSkuData(pageNo.value)
    } else {
      ElMessage({
        type: "error",
        message: "下架失败"
      })
    }
  } else {
    let res = await reqOnSale(row.id)
    if (res.code == 200) {
      ElMessage({
        type: "success",
        message: "上架成功"
      })
      //发请求更新，页码已经在请求中获取了
      getSkuData(pageNo.value)
    } else {
      ElMessage({
        type: "error",
        message: "上架失败"
      })
    }
  }
}

// 点击编辑按钮回调，提示开发中
const unfinished = () => {
  ElMessage({
    type: 'info',
    message: "功能开发中"
  })
}

// 打开抽屉查看详情
const showDrawer = async (row: SkuData) => {
  drawer.value = true
  let res:SkuInfoData = await reqSkuInfo(row.id)
  if (res.code== 200) {
    skuInfo.value = res.data
    console.log(skuInfo)
  }
}

// 删除sku回调
const deleteSku = async (id:number)=>{
  let res = await reqDeleteSku(id)
  if(res.code == 200){
    ElMessage({
      type:'success',
      message:"删除成功"
    })
    await getSkuData(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }else{
    ElMessage({
      type:'error',
      message:"删除失败"
    })
  }
}
</script>


<style scoped>

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

</style>