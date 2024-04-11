<template>
  <el-form label-width="80px">
    <el-form-item label="SKU名称">
      <el-input placeholder="请输入SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input placeholder="价格(元)" type="number" v-model="skuParams.price"></el-input>
    </el-form-item>
    <el-form-item label="重量(克)">
      <el-input placeholder="重量(克)" type="number" v-model="skuParams.weight"></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input type="textarea" placeholder="请输入SKU描述" v-model="skuParams.skuDesc"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form inline>
        <el-form-item v-for="(item, index) in attrArr" :key="item.id" :label="item.attrName">
          <el-select v-model="item.attrIdAndValueId">
            <el-option :value="`${item.id}:${attrValue.id}`" v-for="(attrValue, index) in item.attrValueList" :key="attrValue.id"
                       :label="attrValue.valueName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form inline>
        <el-form-item v-for="(item,index) in saleArr" :key="item.id" :label="item.saleAttrName">
          <el-select v-model="item.saleIdAndValueId">
            <el-option :value="`${item.id}:${saleValue.id}`" v-for="(saleValue, index) in item.spuSaleAttrValueList" :key="saleValue.id"
                       :label="saleValue.saleAttrValueName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imgArr" ref="table">
        <el-table-column type="selection" width="80px" align="center"></el-table-column>
        <el-table-column label="图片">
          <template #="{row, $index}">
            <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px">
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #="{row, $index}">
            <el-button type="success" size="small" @click="imgHandler(row)">设置默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>


<script setup lang="ts">
//引入请求API
import {reqAttrInfo} from "@/api/product/attr";
import {reqAddSku, reqSpuImageList, reqSpuSaleAttr} from "@/api/product/spu";
import {reactive, ref} from "vue";
import {SkuData} from "@/api/product/spu/type.ts";
import {ElMessage} from "element-plus";

const $emit = defineEmits(["changeScene"])
//平台属性
let attrArr = ref<any>([])
//销售属性
let saleArr = ref<any>([])
//照片数据
let imgArr = ref<any>([])
//收集SKU参数
let skuParams = reactive<SkuData>({
  "category3Id": '', //三级分类id
  "spuId": '',//已有的SPU的id
  "tmId": '', // spu品牌id
  "skuName": "",//新增的sku的名字
  "price": '',//sku价格
  "weight": "",//sku重量
  "skuDesc": "",//sku描述
  //平台属性
  "skuAttrValueList": [],
  //销售属性
  "skuSaleAttrValueList": [],
  //售卖商品sku图片地址
  "skuDefaultImg": "",
})
//获取table组件
let table = ref<any>()
//点击取消按钮向父组件传递参数
const cancel = () => {
  $emit('changeScene', {flag: 0, params: ""})
}

//子组件对外暴露方法
const initSkuData = async (c1Id: number | string, c2Id: number | string, spu: any) => {
  //收集数据
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id
  skuParams.tmId = spu.tmId
  //通过v-model收集
  //发送请求
  //获取平台属性
  // console.log(c1Id, c2Id, spu.category3Id)
  let res: any = await reqAttrInfo(c1Id, c2Id, spu.category3Id)
  // 获取销售属性
  let res2: any = await reqSpuSaleAttr(spu.id)
  // 获取照片墙数据
  let res3: any = await reqSpuImageList(spu.id)
  //存储平台属性
  attrArr.value = res.data
  //存储销售属性
  saleArr.value = res2.data
  //存储图片
  imgArr.value = res3.data
}

//图片设置默认回调
const imgHandler = (row:any)=>{
  skuParams.skuDefaultImg = row.imgUrl
  //复选框选中,排他
  imgArr.value.forEach(item=>{
    table.value.toggleRowSelection(item,false)
  })
  table.value.toggleRowSelection(row, true)
}

//保存按钮方法
const save=async ()=>{
  //整理参数
  //平台属性
  skuParams.skuAttrValueList = attrArr.value.reduce((prev:any,next:any)=>{
      if(next.attrIdAndValueId){
        let [attrId, valueId] = next.attrIdAndValueId.split(':')
        prev.push({
          attrId,
          valueId
        })
      }
      return prev
  },[])
  //销售属性
  skuParams.skuSaleAttrValueList = saleArr.value.reduce((prev:any, next:any)=>{
    if(next.saleIdAndValueId){
      let [saleId, valueId] = next.saleIdAndValueId.split(':')
      prev.push({
        saleId,
        valueId
      })
    }
    return prev
  },[])
  //添加SKU请求
  let res = await reqAddSku(skuParams)
  if (res.code == 200){
    ElMessage({
      type:'success',
      message:"添加成功"
    })
    $emit('changeScene', {flag:0, params:''})
  }else{
    ElMessage({
      type:'error',
      message:"添加失败"
    })
  }
}
defineExpose({
  initSkuData
})
</script>


<style scoped lang="less">

</style>