<template>
  <div>
    <Category :scene="scene"/>
    <el-card style="margin: 10px 0">
      <div v-show="scene==0">
        <el-button @click="addAttr" size="default" type="primary" icon="plus" :disabled="!categoryStore.c3Id">添加属性
        </el-button>
        <el-table border style="margin: 10px 0" :data="attrArr" stripe>
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="属性名称" align="center" width="120px" prop="attrName"></el-table-column>
          <el-table-column label="属性值名称" align="center">
            <template #="{row, $index}">
              <el-tag style="margin: 5px" v-for="(item,$index) in row.attrValueList" :key="item.id">
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="120px">
            <!--row代表已有的属性对象-->
            <template #="{row, $index}">
              <el-button @click="editAttr(row)" type="primary" size="small" icon="edit"></el-button>
              <el-popconfirm :title="`确认删除${row.attrName}?`" width="200px" icon="Delete" icon-color="red" @confirm="deleteAttr(row.id)">
                <template #reference>
                  <el-button type="danger" size="small" icon="delete" ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--场景2-->
      <div v-show="scene==1">
        <el-form inline>
          <el-form-item label="属性名称">
            <el-input placeholder="请输入属性名称" v-model="attrParams.attrName" ></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" size="default" icon="plus" :disabled="!attrParams.attrName" @click="addAttrTag">
          添加属性值
        </el-button>
        <el-button @click="cancel">取消</el-button>
        <el-table border style="margin:10px 0" :data="attrParams.attrValueList">
          <el-table-column label="序号" width="80px" type="index" align="center"></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{row, $index}">
              <!-- row是数组中的每一个属性值对象 -->
              <el-input
                  :ref="(vc:any)=>inputArr[$index]=vc"
                  size="small"
                  placeholder="请输入属性值名称"
                  v-model="row.valueName"
                  v-if="row.flag"
              @blur="viewOnly(row, $index)"></el-input>
              <div v-else @click="editMode(row,$index)">{{row.valueName}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
                        <template #="{row,$index}">
                          <el-popconfirm :title="`确认删除${row.valueName}?`" width="200px" icon="Delete" icon-color="red" @confirm="attrParams.attrValueList.splice($index,1)">
                            <template #reference>
                              <el-button type="danger" size="small" icon="Delete"></el-button>
                            </template>
                          </el-popconfirm>
                        </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="save" :disabled="!attrParams.attrValueList.length">提交</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>


<script setup lang="ts">
//引入组合式API函数watch监听c3Id
import {computed, nextTick, reactive, ref, watch, onBeforeUnmount} from "vue";
//引入获取属性和属性值的接口
import {reqAddOrUpdateAttr, reqAttrInfo,reqRemoveAttr} from "@/api/product/attr";
//引入分类相关的仓库
import useCategoryStore from "@/store/modules/category.ts";
import {Attr, AttrResponseData, AttrValue} from "@/api/product/attr/type.ts";
import {ElMessage} from "element-plus";
import {reqDeleteBrand} from "@/api/product/brand";
import category from "@/store/modules/category.ts";

let categoryStore = useCategoryStore()
//存储已有的属性和属性值
let attrArr = ref<Attr>([])
//定义card组件内容切换
let scene = ref<number>(0)//场景为0，显示table，1显示添加与修改属性结构
//收集新增的属性数据
let attrParams = reactive<Attr>({

  "attrName": "", //新增属性名字
  "attrValueList": [//新增属性值--数组

  ],
  "categoryId": 0, //三级分类id
  "categoryLevel": 3, //代表三级分类
})
//准备一个数组来存储对应的组件实例（el-input）
let inputArr=ref<any>([])
//监听c3Id
watch(() => categoryStore.c3Id, () => {
  //三级分类发生变化，先清空查询的属性和属性值
  attrArr.value = []
  //三级分类不为空才能发请求
  if (!categoryStore.c3Id) return
  getAttr()
})

const getAttr = async () => {
  const {c1Id, c2Id, c3Id} = categoryStore //从仓库中解构id
  if (c3Id) {
    let res: AttrResponseData = await reqAttrInfo(c1Id, c2Id, c3Id)
    if (res.code == 200) {
      attrArr.value = res.data
    }
  }
}

//添加属性按钮的回调
const addAttr = () => {
  //点击的时候，先清空场景2的样式,利用Object提供的assign合并对象，每次点击先回到初始状态
  Object.assign(attrParams, {

    "attrName": "", //新增属性名字
    "attrValueList": [//新增属性值--数组

    ],
    "categoryId": 0, //三级分类id
    "categoryLevel": 3, //代表三级分类
  })
  //切换场景和结构样式
  scene.value = 1
  //点击按钮时收集新增属性所属的三级分类id
  attrParams.categoryId = categoryStore.c3Id
}

//table表格中的修改按钮
const editAttr = (row:Attr) => {
  scene.value = 1
  console.log(row)
  //将已有的属性值对象赋值给attrParams对象
  //ES6->Object.assign()
  // JSON.parse(JSON.stringify(row))意为深拷贝，复制数值给目标数组。浅拷贝是提供内存地址，导致修改其中之一会影响两个数组
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}

//取消按钮回调
const cancel = () => {
  scene.value = 0
}

//添加属性值按钮回调
const addAttrTag = () => {
  // // Check if any attribute value is in editing mode
  // const isEditing = attrParams.attrValueList.some((item) => item.flag);
  //
  // // If there is an input in editing mode, show a message and return
  // if (isEditing) {
  //   ElMessage({
  //     type: "warning",
  //     message: "请先完成当前编辑的属性值",
  //   });
  //   return;
  // }
  //
  // // Check if there are any invalid values (e.g., empty or duplicate)
  // const invalidValue = attrParams.attrValueList.find((item) => {
  //   return item.valueName.trim() === "" || attrParams.attrValueList.filter(i => i !== item).some(i => i.valueName === item.valueName);
  // });
  //
  // // If there is an invalid value, show a message and return
  // if (invalidValue) {
  //   ElMessage({
  //     type: "warning",
  //     message: "存在非法属性值，请检查并完成输入",
  //   });
  //   return;
  // }


  //点击添加属性值按钮的时候,向数组添加一个属性值对象
  attrParams.attrValueList.push({
    valueName: '',
    flag: true,//控制每一个属性值编辑模式与切换模式的切换
  });
  //点击按钮，给生成的input组件聚焦
  nextTick(()=>{
    inputArr.value[attrParams.attrValueList.length-1].focus()
  })
}



//确认按钮回调
const save = async () => {
  let res: any = await reqAddOrUpdateAttr(attrParams)
  if (res.code == 200) {
    //切换场景
    scene.value = 0
    //提示
    ElMessage({
      type: "success",
      message: attrParams.id ? '修改属性成功' : "添加属性成功"
    })
    //添加成功后重新发请求获取已有属性值
    getAttr()
  } else {
    ElMessage({
      type: "error",
      message: attrParams.id ? '修改属性失败' : "添加属性失败"
    })
  }
}


//属性值表单失去焦点切换到只读模式
const viewOnly = (row:AttrValue, $index:number)=>{
  //非法情况判断1，比如没输入属性值就失去焦点
  if(row.valueName.trim() == ""){
    //因为不填写数据时，还是会生成一条数据，需要从attrParams.attrValueList中将其移除掉
    attrParams.attrValueList.splice($index, 1)
    //先弹出提示信息
    ElMessage({
      type:"warning",
      message:"属性值不能为空"
    })
    //直接停止执行后面的语句，不会变成div
    return;
  }
  //非法情况判断2， 属性值重复输入后失去焦点
  let repeat = attrParams.attrValueList.find((item)=>{
    //要把当前属性对象先排除
    if(item != row){
      return item.valueName === row.valueName
    }
  })
  //如果存在重复
  if(repeat){
    ElMessage({
      type:"warning",
      message:"存在重复属性值"
    })
    return
  }
  //控制变量，变成div
  row.flag=false
}
//点击div恢复编辑模式
const editMode = (row:AttrValue, $index)=>{
  //响应的属性值对象falg变成true，展示input
  row.flag=true
  //nextTick响应式数据发生变化，获取更新后的DOM
  nextTick(()=>{
    inputArr.value[$index].focus()
  })
}
//点击删除属性按钮回调
const deleteAttr = async (attrId:Number)=>{
  let result:any = await reqRemoveAttr(attrId)
  if(result.code == 200){
    ElMessage({
      type:"success",
      message:"属性删除成功"
    })
    //删除成功后重新获取属性列表
    getAttr()
  }else{
    ElMessage({
      type:"error",
      message:"属性删除失败"
    })
  }
}

//路由组件销毁时，把仓库分类相关的数据清空
onBeforeUnmount(()=>{
  categoryStore.$reset()
})
</script>


<style scoped>

</style>




