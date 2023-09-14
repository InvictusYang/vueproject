<template>
  <div class="layout_container">
    <!--左侧菜单-->
    <div class="layout_sider">
      <Logo></Logo>
    </div>
    <!--顶部导航-->
    <div class="layout_tabbar">456</div>
    <!--layout_main-->
    <div class="layout_main">
      <p style="height: 100000px;background-color:white;">我是一个段落</p>
    </div>
  </div>
</template>


<script setup lang="ts">
  import Logo from './logo/index.vue'
</script>


<style scoped lang="scss">
  .layout_container{
    width: 100%;
    height: 100vh;
  }
  .layout_sider{
    width: $base-menu-width;
    height: 100vh;
    background-color: $base-menu-background;
  }
  .layout_tabbar{
    position: fixed;
    top:0px;
    left:$base-menu-width;
    width: calc(100% - $base-menu-width) ;
    height: $base-tabbar-height;
    background-color: purple;
  }
  .layout_main{
    position: absolute;
    left:$base-menu-width;
    top:$base-tabbar-height;
    padding: 20px;
    width:calc(100% - $base-menu-width) ;
    height: calc(100vh - $base-tabbar-height);
    background-color: greenyellow;
    overflow: auto;
  }
</style>