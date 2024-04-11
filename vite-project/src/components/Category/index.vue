<template>
  <el-card>
    <el-form inline>
      <el-form-item label="一级分类">
        <el-select :disabled="scene!=0" v-model="categoryStore.c1Id" @change="handler">
          <!--option：label为显示文字，value即为select下拉菜单收集的数据-->
          <el-option v-for="(c1, index) in categoryStore.c1Arr" :key="c1.id" :label="c1.name" :value="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select :disabled="scene!=0" v-model="categoryStore.c2Id" @change="handler2">
          <el-option v-for="(c2, index) in categoryStore.c2Arr" :key="c2.id" :label="c2.name" :value="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select :disabled="scene!=0" v-model="categoryStore.c3Id">
          <el-option v-for="(c3, index) in categoryStore.c3Arr" :key="c3.id" :label="c3.name" :value="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>


<script setup lang="ts">
//引入onMounted
import {onMounted} from 'vue'
//引入分类相关的仓库
import useCategoryStore from "@/store/modules/category.ts";
let categoryStore = useCategoryStore()
//接受父组件传递过来的scene
defineProps(["scene"])

onMounted(()=>{
   getC1()
})

//通知仓库获取一级分类方法
const getC1 = ()=>{
  //通知分类仓库发请求获取一级分类数据
  categoryStore.getC1()
}
//此方法为一级分类下拉菜单change事件（保证一级分类中id存在）
const handler = ()=>{
  //change触发后需要将二类和三级分类清空
  categoryStore.c2Id = ''
  categoryStore.c3Arr=[]
  categoryStore.c3Id = ''
  getC2()
}
//通知仓库获取二级分类
const getC2=()=>{
  categoryStore.getC2()
}

const handler2 = ()=>{
  categoryStore.c3Id = ''
  getC3()
}

const getC3 = ()=>{
  categoryStore.getC3()
}
</script>


<style scoped>

</style>