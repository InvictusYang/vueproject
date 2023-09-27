<template>
  <template v-for="(item,index) in menuList" :key="item.path">
    <!--没有子路由-->
    <template v-if="!item.children" :key="item.path">
      <el-menu-item :index="item.path" v-if="!item.meta.hidden" @click="goRoute">
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <!--利用插槽向el-menu-item组件传递信息-->
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!--有且只有一个子路由-->
    <template v-if="item.children && item.children.length===1">
      <el-menu-item :index="item.children[0].path" v-if="!item.children[0].meta.hidden" @click="goRoute">
        <el-icon>
          <component :is="item.children[0].meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.children[0].meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!--有子路由且大于一个-->
    <el-sub-menu v-if="item.children && item.children.length>1" :index="item.path">
      <template #title>
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <Menu :menuList="item.children"></Menu><!--递归-->
    </el-sub-menu>
  </template>
</template>


<script setup lang="ts">
//获取父组件传递过来的全部路由数组
defineProps(['menuList'])
import {useRouter} from "vue-router";
//获取路由器对象
//因为我们在 setup 里面没有访问 this，所以我们不能再直接访问 this.$router 或 this.$route。
//作为替代，我们使用 useRouter 和 useRoute 函数
let $router = useRouter()
//点击菜单回调，element提供的方法
const goRoute = (vc:any)=>{
  console.log($router)
  //路由跳转
  $router.push(vc.index)
}
</script>
<script lang="ts">
export default {
  name: 'Menu'
}
</script>

<style scoped>

</style>