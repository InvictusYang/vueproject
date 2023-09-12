<script setup lang="ts">
import request from '@/utils/request.ts'
import {onMounted} from "vue";

//组件挂载完毕后测试请求
async function requestTest(){
  try{
    await request({
      //二次封装时已经配置了起始路径是/api，这里没必要再带上，否则会出错
      url:'/user/log111in',
      method:'POST',
      data:{
        username:'admin',
        password:'111111'
      }
    })
  }catch(e){
    console.log(e)
  }
}
onMounted(async ()=>{
  await requestTest()
})
</script>

<template>
<div>
  <h1>测试AXIOS二次封装</h1>
</div>
</template>

<style scoped>

</style>
