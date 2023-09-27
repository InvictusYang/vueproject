<script setup lang="ts">
//引入生命周期函数
import {onMounted} from "vue";
//引入仓库
import userUserStore from '@/store/modules/user.ts'
let userStore = userUserStore()
//首页挂载完毕发请求获取用户信息
onMounted(()=>{
  userStore.userInfo()
})
</script>

<template>
<div>
  <h1>我是一级路由管理后台首页{{userStore.username}}</h1>
</div>
</template>

<style scoped>

</style>