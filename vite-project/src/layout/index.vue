<template>
  <div class="layout_container">
    <!--左侧菜单-->
    <div class="layout_slider">
      <Logo></Logo>
      <!--滚动组件-->
      <el-scrollbar class="scrollbar">
        <!--菜单组件-->
        <el-menu background-color="$base-menu-background" text-color="white">
<!--          根据路由动态生成菜单-->
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!--顶部导航-->
    <div class="layout_tabbar">456</div>
    <!--layout_main-->
    <div class="layout_main">
      <Main></Main>
    </div>
  </div>
</template>


<script setup lang="ts">
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
//右侧内容展示区域
import Main from './main/index.vue'
//获取用户相关的小仓库
import useUserStore from "@/store/modules/user.ts";
let userStore = useUserStore()
</script>


<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;
  color: antiquewhite;
}

.layout_slider {
  width: $base-menu-width;
  height: 100vh;
  background-color: $base-menu-background;

  .scrollbar {
    width: 100%;
    height: calc(100vh - $base-menu-logo-height);
    .el-menu{
      border-right: none;
    }
  }
}

.layout_tabbar {
  position: fixed;
  top: 0px;
  left: $base-menu-width;
  width: calc(100% - $base-menu-width);
  height: $base-tabbar-height;
  background-color: purple;
}

.layout_main {
  position: absolute;
  left: $base-menu-width;
  top: $base-tabbar-height;
  padding: 20px;
  width: calc(100% - $base-menu-width);
  height: calc(100vh - $base-tabbar-height);
  background-color: lightslategray;
  overflow: auto;
}

.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
</style>