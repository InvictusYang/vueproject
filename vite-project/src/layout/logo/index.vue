<template>
  <div class="logo" v-if="setting.isLogoShow">
    <!-- 可以随时修改   -->
    <!-- v-bind可以给标签里的任何属性动态绑定值。可以简写为单**:（冒号）**，使用v-bind后，属性可以解析js表达式。如Date.now()等。-->
    <img :src="setting.logo" alt="">
    <p>{{ setting.title }}</p>
  </div>
</template>


<script setup lang="ts">
  //引入标题与logo配置文件
  import setting from "@/setting.ts"
</script>

<script lang="ts">
export default {
  name:'Logo'
}
</script>
<style scoped lang="scss">
  .logo{
    height: $base-menu-logo-height;
    width: 100%;
    color: white;
    display: flex;
    align-items: center;
    padding: 12px;
    img{
      height: 42px;
      width: 42px;
    }
    p{
      font-size: $base-logo-title-fontsize;
      margin-left:10px;
    }
  }
</style>