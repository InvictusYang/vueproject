<script setup lang="ts">
import {useRouter} from "vue-router";
import {onMounted} from "vue";
let $router = useRouter()
onMounted(()=>{
  setTimeout(()=>{
    $router.push("/home")
  },2000)
})
</script>

<template>
  <div class="box">
    <img src="../../assets/images/404.png" alt="">
  </div>
</template>

<style scoped lang="scss">
.box{
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  background-color: lightblue;
  img{
    width: 800px;
    height: 800px;
  }
}
</style>