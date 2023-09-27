<template>
      <!--    顶部左侧静态-->
      <el-icon style="margin-right: 10px" @click="switchIcon">
        <component :is="LayOutSettingStore.fold?'Fold':'Expand'"></component>
      </el-icon>
      <el-breadcrumb separator-icon="ArrowRight">
        <!-- 面包屑动态展示路由名字和标题 -->
        <el-breadcrumb-item v-for="(item,index) in  $route.matched" :key="index" v-show="item.meta.title" :to="item.path">
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <!--面包屑展示匹配路由的标题-->
          <span style="margin: 0 2px">{{item.meta.title}}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
</template>


<script setup lang="ts">
import {useRoute} from "vue-router";
//引入小仓库
import useLayOutSettingStore from "@/store/modules/setting.ts";
const LayOutSettingStore = useLayOutSettingStore()
//获取路由对象
let $route = useRoute()
//点击图标切换的方法
const switchIcon = ()=>{
  LayOutSettingStore.fold = !LayOutSettingStore.fold//js中使用ref属性需要加.value
}

</script>
<script  lang="ts">
export default{
  name:'BreadCrumb'
}
</script>

<style scoped lang="scss">

</style>