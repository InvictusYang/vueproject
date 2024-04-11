<template>
  <div>
    <!--category组件，已经定义为全局组件-->
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0">
      <div v-show="scene==0">
        <el-button ref="spuForm" type="primary" size="default" icon="plus" :disabled="!categoryStore.c3Id"
                   @click="addSpu">添加SPU
        </el-button>
        <el-table style="margin: 10px 0" border :data="records">
          <el-table-column label="序号" type="index" align="center" width="80px">
          </el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" prop="description" show-overflow-tooltip></el-table-column>
          <el-table-column label="SPU操作">
            <template #="{row, $index}">
              <el-button type="primary" size="small" icon="Plus" title="添加SKU" @click="addSku(row)"></el-button>
              <el-button type="warning" size="small" icon="Edit" title="修改SPU" @click="updateSpu(row)"></el-button>
              <el-button type="info" size="small" icon="View" title="查看SPU" @click="getSkuList(row)"></el-button>
              <el-popconfirm :title="`确定删除${row.spuName}？`" width="200px" @confirm="deleteSpu(row)">
                <template #reference>
                  <el-button icon="delete" size="small" type="danger"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            v-model:current-page="pageNo"
            v-model:page-size="pageSize"
            :page-sizes="[3,6,9,12]"
            :background="true"
            layout="prev, pager, next, jumper,->,sizes,total"
            :total="spuTotal"
            @current-change="reqSpuInfo"
            @size-change="changeSize"
        />
      </div>
      <!--添加或修改SPU组件-->
      <SpuForm ref="spuForm" v-show="scene==1" @changeScene="changeScene"></SpuForm>
      <!--添加sku组件-->
      <sku-form ref="skuForm" v-show="scene==2" @changeScene="changeScene"></sku-form>
      <!--添加查看skulist的dialog组件,dialog需要用v-model接收控制显阴的布尔值变量-->
      <el-dialog title="sku列表" v-model="showSkuList">
        <el-table :data="skuList">
            <el-table-column label="SKU名称" prop="skuName"></el-table-column>
            <el-table-column label="SKU价格" prop="price"></el-table-column>
            <el-table-column label="SKU重量" prop="weight"></el-table-column>
            <el-table-column label="SKU图片">
                <template #="{row, $index}">
                  <img :src="row.skuDefaultImg" style="width: 100px; height: 100px">
                </template>
            </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>


<script setup lang="ts">
import {ref, watch, onBeforeUnmount} from "vue";
//引入仓库
import useCategoryStore from "@/store/modules/category.ts";
import {reqDeleteSpu, reqHasSpu, reqSkuList} from "@/api/product/spu";
import {HasSpuResponseData, Records, SkuData, SkuInfoData, SpuData} from "@/api/product/spu/type.ts";
import SpuForm from "@/views/product/spu/spuForm.vue";
import SkuForm from "@/views/product/spu/skuForm.vue";
import {reqRemoveAttr} from "@/api/product/attr";
import {ElMessage} from "element-plus";

let categoryStore = useCategoryStore()
//模拟一个场景
let scene = ref<number>(0)//0展示已有SPU，1添加或修改SPU，2：添加sku
//分页器默认页码
let pageNo = ref<number>(1)
let pageSize = ref<number>(3)

//创建一个数组存储当前页中的spu data，也可以写成类型注解let records: Records = ref([]);
let records = ref<Records>([])
//存储spu总个数
let spuTotal = ref<number>(0)

//获取子组件实例spuForm
let spuForm = ref<any>()
//获取子组件实例skuForm
let skuForm = ref<any>()
//存储全部SKU数据
let skuList = ref<SkuData[]>([])
//控制sku dialogue的显示和隐藏
let showSkuList = ref<boolean>(false)
//监听categoryC3Id
watch(() => categoryStore.c3Id, () => {
  //仅在有c3Id的情况下才会发请求,因为当c1Id和c2Id变动时，c3Id会空，watch能监听到
  if (!categoryStore.c3Id) return
  reqSpuInfo()
})

//封装一个发送请求的方法，获取三级分类下所有的SPU
const reqSpuInfo = async (pager: number = 1) => {
  pageNo.value = pager
  let res: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3Id)
  if (res.code === 200) {
    records.value = res.data.records
    spuTotal = res.data.total
  }
}
//分页器下拉菜单发生变化时触发
const changeSize = () => {
  reqSpuInfo()
}

//点击添加spu按钮回调
const addSpu = () => {
  // 场景切换为1
  scene.value = 1
  //点击添加spu按钮调用spuForm组件内的方法
  spuForm.value.initAddSpu(categoryStore.c3Id)
}

//子组件SpuForm绑定的自定义事件，让子组件通知父组件场景切换为0
const changeScene = (obj: any) => {
  //子组件点击取消变为场景0
  scene.value = obj.flag
  if (obj.params == 'update') {
    //重新获取spu数据
    reqSpuInfo(pageNo.value)
  } else {
    reqSpuInfo()
  }
}

//修改已有SPU按钮回调
const updateSpu = (row: SpuData) => {
  scene.value = 1
  //调用子组件实例方法获取完整的已有SPU数据
  //ref拿到子组件，并可以使用子组件的方法或数据
  spuForm.value.initHasSpuData(row)
}

//点击添加SKU按钮回调
const addSku = (row: SpuData) => {
  scene.value = 2  //切换场景
  //调用子组件方法初始化SKU数据
  // row内已经有c3Id
  skuForm.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}

//点击查看SKU列表回调
const getSkuList = async (row) => {
  let res: SkuInfoData = await reqSkuList(row.id)
  if (res.code == 200) {
    skuList.value = res.data
    showSkuList.value = true
  }
}

//点击删除按钮的回调
const deleteSpu=async(row)=>{
  let res = await reqDeleteSpu(row.id as number)
  console.log(res)
  if(res.code == 200){
    ElMessage({
      type:'success',
      message:'删除成功'
    })
    //获取剩余的spu数据
    reqSpuInfo(records.value.length>1?pageNo.value:pageNo.value-1)
  }else{
    ElMessage({
      type:'error',
      message:'删除失败'
    })
  }
}
//路由组件销毁前，清空仓库关于分类的数据
onBeforeUnmount(()=>{
  categoryStore.$reset()
})
</script>


<style scoped>

</style>