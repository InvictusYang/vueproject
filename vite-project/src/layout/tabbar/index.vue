<template>
  <div class="tabbar">
    <div class="tabbar_left">
      <BreadCrumb></BreadCrumb>
    </div>
    <div class="tabbar_right">
      <Setting></Setting>
    </div>
  </div>
</template>


<script lang="ts" setup>
import BreadCrumb from './breadcrumb/index.vue'
import Setting from "./setting/index.vue";
</script>
<script lang="ts">
export default {
  name:'Tabbar'
}
</script>

<style lang="scss" scoped>
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  //background-image: linear-gradient(to right, #ffffff, #fafafa, #e0c9c9);
  .tabbar_left {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }
  .tabbar_right{
    display: flex;
    align-items: center;
    //justify-content: space-between;
    //margin-right: 15px;
  }
}
</style>