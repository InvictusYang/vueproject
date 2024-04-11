<template>
  <el-form label-width="100px">
    <el-form-item label="spu名称">
      <el-input placeholder="请输入spu名称" v-model="SpuParams.spuName"></el-input>
    </el-form-item>
    <el-form-item label="spu品牌">
      <el-select v-model="SpuParams.tmId">
        <el-option v-for="(item, index) in AllTradeMark" :label="item.tmName" :key="index" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="spu描述">
      <el-input type="textarea" placeholder="请输入SPU描述" v-model="SpuParams.description"></el-input>
    </el-form-item>
    <el-form-item label="spu图片">
      <el-upload
          v-model:file-list="imgWall"
          action="/api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :before-upload="handlerUpload"
      >
        <el-icon>
          <Plus/>
        </el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%;height: 100%"/>
      </el-dialog>
    </el-form-item>
    <el-form-item label="spu销售属性">
      <el-select
          v-model="saleIdAndName"
          :placeholder="unselectedSaleAttr.length?`还有${unselectedSaleAttr.length}项可选`:'无可选项'">
        <el-option :value="`${item.id}:${item.name}`" v-for="(item,index) in unselectedSaleAttr" :label="item.name" :key="item.id"></el-option>
      </el-select>
      <el-button @click="addSaleAttr" style="margin-left: 10px" type="primary" icon="plus" :disabled="!saleIdAndName">添加销售属性</el-button>
      <!--      展示销售属性和属性值-->
      <el-table style="margin:10px 0" border :data="saleAttr">
        <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
        <el-table-column label="属性名" width="100px" align="center" prop="saleAttrName"></el-table-column>
        <el-table-column label="属性值" align="center">
          <!--          row为当前spu已有的销售属性对象-->
          <template #="{row,$index}">
            <el-tag
                style="margin:0 5px"
                v-for="(item,index) in row.spuSaleAttrValueList"
                :key="item.id || $index"
                class="mx-1"
                closable
                @close="row.spuSaleAttrValueList.splice(index,1)"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input
                @blur="addNewSaleAttr(row)"
                v-model="row.saleAttrValue"
                v-if="row.flag == true"
                placeholder="请输入属性值"
                size="small"
                style="width: 100px;"
            ></el-input>
            <el-button v-else  @click="switchToInput(row)" type="primary" size="small" icon="plus"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
            <template #="{row, $index}">
                <el-popconfirm
                    confirm-button-text="确认"
                    cancel-button-text="取消"
                    icon="infoFilled"
                    :title="`确认删除${row.saleAttrName}?`"
                    @confirm="saleAttr.splice($index,1)"
                >
                  <template #reference>
                    <el-button type="danger" size="small" icon="delete"></el-button>
                  </template>
                </el-popconfirm>
            </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :disabled="saleAttr.length<=0" @click="reqSpuChange">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>


<script setup lang="ts">

import {
  AllSaleAttr,
  AllTrademark,
  HasSaleAttrResponse,
  SaleAttr,
  SaleAttrResponseData, SaleAttrValue,
  SpuData,
  SpuImg,
  SpuImgWall,
  Trademark
} from "@/api/product/spu/type.ts";
import {reqAddOrUpdateSpu, reqAllSaleAttr, reqAllTrademark, reqSpuImageList, reqSpuSaleAttr} from "@/api/product/spu";
import {computed, ref} from "vue";
import {ElMessage} from "element-plus";
import {reqAddOrUpdateAttr} from "@/api/product/attr";

let $emit = defineEmits(['changeScene'])

//存储已有的SPU数据
let AllTradeMark = ref<Trademark[]>([])
//照片墙
let imgWall = ref<SpuImg[]>([])
//销售属性对象
let saleAttr = ref<SaleAttr[]>([])
//所有销售属性
let allSaleAttr = ref<AllSaleAttr[]>([])
//存储已有的spu对象
let SpuParams = ref<SpuData>({
  category3Id: "",
  spuName: "",
  description: "",
  tmId: "",
  spuImageList: [],
  spuSaleAttrList: [],
})

//el-dialogue控制
let dialogVisible = ref<boolean>(false)
//图片地址
let dialogImageUrl = ref<string>("")
//收集还未选择的销售属性的id和name
let saleIdAndName = ref<string>("")

//子组件书写第一个方法
const initHasSpuData = async (spu: SpuData) => {
  //存储父组件传入的spu对象
  SpuParams.value = spu
  //spu为父组件传递过来的当前spu对象（不完整，缺少图片等）
  //获取全部品牌数据
  let result: AllTrademark = await reqAllTrademark()
  //获取一个品牌下全部销售商品的图片
  let result1: SpuImgWall = await reqSpuImageList(spu.id)
  //获取已有的SPU销售属性数据
  let result2: SaleAttrResponseData = await reqSpuSaleAttr(spu.id)
  //获取项目所有的销售属性
  let result3: HasSaleAttrResponse = await reqAllSaleAttr()

  //存储全部品牌数据
  AllTradeMark.value = result.data
  //SPU对应商品图片
  imgWall.value = result1.data.map(item => {
    return {
      name: item.imgName,
      url: item.imgUrl
    }
  })
  //销售属性值
  saleAttr.value = result2.data
  //全部销售属性
  allSaleAttr.value = result3.data

}
//照片墙点击预览回调
const handlePictureCardPreview = (file: any) => {
  dialogImageUrl.value = file.url
  //弹出对话框el-dialogue
  dialogVisible.value = true
}
//照片墙点击删除按钮钩子
const handleRemove = (file: any) => {

}
//上传之前检查大小类型等
const handlerUpload = (file: any) => {
  if (file.type == "image/png" || file.type == "image/jpeg" || file.type == "image/gif") {
    if (file.size / 1024 / 1024 < 3) {
      return true
    } else {
      ElMessage({
        message: "图片不能大于3M",
        type: "error"
      })
      return false
    }
  } else {
    ElMessage({
      message: "图片只能是jpg/gif/png",
      type: "error"
    })
    return false
  }
}
//计算出SPU还未拥有的销售属性
let unselectedSaleAttr=computed(()=>{
  //本项目中有三个销售属性，颜色、版本、尺码
  //利用filter将未选择的销售属性过滤出来,为数组中的每个元素执行的函数。它应该返回一个真值以将元素保留在结果数组中，否则返回一个假值。
  //every为数组中的每个元素执行的函数。它应该返回一个真值以指示元素通过测试，否则返回一个假值。
  return allSaleAttr.value.filter(item => saleAttr.value.every(item1 => item.name != item1.saleAttrName))
  // return allSaleAttr.value.filter(item => {
  //   console.log('Computed property recalculated');
  //   return saleAttr.value.every(item1 => {
  //     return item.name != item1.saleAttrName
  //   });
  // })
})
//添加销售属性按钮
const addSaleAttr = ()=>{
  //必须有baseSaleAttrId、saleAttrName和spuSaleAttrValueList三个字段
  const [baseSaleAttrId, saleAttrName] = saleIdAndName.value.split(':')
  //准备新的销售属性对象
  let newSaleAttr:SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList:[]
  }
  //将新的属性对象追加到数组当中
  saleAttr.value.push(newSaleAttr)
  //添加完清空收集的数据
  saleIdAndName.value = ''
}
//点击添加属性值回调
const switchToInput = (row:SaleAttr)=>{
  row.flag = true
  row.saleAttrValue=''//销售属性值收集
}
//添加销售属性输入框blur回调
const addNewSaleAttr=(row:SaleAttr)=>{
  //整理收集到的属性id和属性值名称
  const{baseSaleAttrId, saleAttrValue } = row
  //整理成服务器需要的格式
  let newSaleAttrValue:SaleAttrValue ={
    baseSaleAttrId,
    saleAttrValueName:saleAttrValue
  }
  //非法情况判断
  if(saleAttrValue?.trim()==""){
    ElMessage({
      type:'error',
      message:"属性值不能为空",
    })
    row.flag=false
    return
  }
  //判断属性值是否重复
  let isDup = row.spuSaleAttrValueList.find((item:SaleAttrValue)=>{
    return item.saleAttrValueName == saleAttrValue
  })
  if(isDup){
    ElMessage({
      type:'error',
      message:"已存在重复属性值",
    })
    row.flag=false
    return
  }
  //追加到属性值对象数组中
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  //切换回button
  row.flag = false
}

//保存按钮回调
const reqSpuChange = async()=>{
  //参数已收集，但需要整理成符合接口的参数提交
  //1.照片墙数据
  //因为此时imgWall里的数据只有name和url，不符合接口要求，需要map修改为需要的数据
  SpuParams.value.spuImageList = imgWall.value.map((item:any)=>{
        return {
          imgName:item.name,
          imgUrl:(item.response&&item.response.data)||item.url//新增图片用服务器返回的response，修改图片用url即可
        }
  })
  // console.log(SpuParams.value.spuImageList)
  //2. 销售属性数据
  SpuParams.value.spuSaleAttrList=saleAttr.value
  // console.log(SpuParams.value)
  let res = await reqAddOrUpdateSpu(SpuParams.value)
  if(res.code == 200){
    ElMessage({
      type:"success",
      message:SpuParams.value.id?'更新成功':'添加成功',
    })
    //使用自定义事件通知父组件切换场景
    $emit('changeScene', {flag:0,params:SpuParams.value.id?'update':'add'})
  }else{
    ElMessage({
      type:"warning",
      message:SpuParams.value.id?'更新失败':'添加失败',
    })
  }
}

//点击取消按钮：通知父组件切换场景为0
const cancel = () => {
  $emit('changeScene', {flag:0,params:'update'})
}
//添加新的SPU初始化请求方法
const initAddSpu = async(c3Id:number|string)=>{
  //每次都清空一下页面数据
  Object.assign(SpuParams.value, {
    id:"",
    category3Id: "",
    spuName: "",
    description: "",
    tmId: "",
    spuImageList: [],
    spuSaleAttrList: [],
  })
  //还有照片墙和销售属性没清
  imgWall.value=[]
  saleAttr.value=[]
  saleIdAndName.value=''
  //获取全部品牌数据
  let res: AllTrademark = await reqAllTrademark()
  //获取项目所有的销售属性
  let res2: HasSaleAttrResponse = await reqAllSaleAttr()
  //存储数据
  AllTradeMark.value = res.data
  allSaleAttr.value = res2.data
  //存储c3Id
  SpuParams.value.category3Id = c3Id
}
defineExpose({initHasSpuData,initAddSpu})//使用 defineExpose 的目的是显式地指定哪些函数或变量应该被父组件访问。
</script>


<style scoped lang="less">

</style>