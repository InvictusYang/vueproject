<script setup lang="ts">
//接收父组件传递过来的参数
defineProps({
  //#xlink:href属性值前缀
  prefix:{
    type:String,
    default:'#icon-'
  },
  //定义使用图标的名字
  name:String,
  //接收父组件传递颜色
  color:{
    type:String,
    default:""
  },
  //接收父组件传递过来的图标宽度
  width:{
    type:String,
    default:'16px'
  },
  height:{
    type:String,
    default:'16px'
  }
})
</script>

<template>
  <!--  测试svg文件-->
  <!--  svg:图标外层容器，与use标签配合使用-->
  <svg :style="{width,height}">
    <use :xlink:href="prefix+name" :fill="color"></use>
  </svg>
</template>

<style scoped>

</style>