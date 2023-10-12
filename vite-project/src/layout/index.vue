<template>
  <div class="layout_container">
    <!--左侧菜单-->
    <div class="layout_slider" :class="{fold:LayOutSettingStore.fold}">
      <Logo></Logo>
      <!--滚动组件-->
      <el-scrollbar class="scrollbar">
        <!--菜单组件-->
        <el-menu :collapse="LayOutSettingStore.fold" background-color="#001529" text-color="white"
                 active-text-color="skyblue" :default-active="$route.path">
<!--          根据路由动态生成菜单-->
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!--顶部导航-->
    <div class="layout_tabbar" :class="{fold:LayOutSettingStore.fold?true:false}">
      <Tabbar></Tabbar>
    </div>
    <!--layout_main-->
    <div class="layout_main" :class="{fold:LayOutSettingStore.fold?true:false}">
      <Main></Main>
    </div>
  </div>
</template>


<script setup lang="ts">
//获取路由对象
import {useRoute} from "vue-router";
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
//引入tabbar组件
import Tabbar from './tabbar/index.vue'
//右侧内容展示区域
import Main from './main/index.vue'
//获取用户相关的小仓库
import useUserStore from "@/store/modules/user.ts";
import useLayOutSettingStore from "@/store/modules/setting.ts";
let userStore = useUserStore()
let LayOutSettingStore = useLayOutSettingStore()
//获取路由对象
let $route = useRoute()
</script>
<script lang="ts">
export default {
  name:'Layout'
}
</script>


<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;
}

.layout_slider {
  color: antiquewhite;
  width: $base-menu-width;
  height: 100vh;
  background: $base-menu-background;
  transition:all 0.3s;

  .scrollbar {
    width: 100%;
    height: calc(100vh - $base-menu-logo-height);

    .el-menu {
      border-right: none;
    }

  }
  /**
在CSS中，& 符号是一个特殊的选择器，它代表了当前选择器的父级
&.fold 会被解析为 .layout_slider.fold。
意味着，当 .layout_slider 元素同时也有 .fold 类时，
该样式规则将会被应用。
**/
  &.fold {
    width: $base-menu-min-width;
  }
}

.layout_tabbar {
  position: fixed;
  top: 0;
  left: $base-menu-width;
  width: calc(100% - $base-menu-width);
  height: $base-tabbar-height;

  &.fold{
    width:calc(100vw - $base-menu-min-width);
    left:$base-menu-min-width;
    transition:all 0.3s;
  }
}

.layout_main {
  position: absolute;
  left: $base-menu-width;
  top: $base-tabbar-height;
  padding: 20px;
  width: calc(100% - $base-menu-width);
  height: calc(100vh - $base-tabbar-height);
  overflow: auto;
  transition:all 0.3s;
  &.fold{
    width: calc(100vw - $base-menu-min-width);
    left:$base-menu-min-width;
  }
}

//.scrollbar-demo-item {
//  display: flex;
//  align-items: center;
//  justify-content: center;
//  height: 50px;
//  margin: 10px;
//  text-align: center;
//  border-radius: 4px;
//  background: var(--el-color-primary-light-9);
//  color: var(--el-color-primary);
//}
</style>