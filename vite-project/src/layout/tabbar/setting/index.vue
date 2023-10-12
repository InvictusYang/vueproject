<template>
    <el-button circle icon="Refresh" size="small" @click="updRefresh">
    </el-button>
    <el-button circle icon="FullScreen" size="small" @click="fullScreen">
    </el-button>
    <el-button circle icon="Setting" size="small">
    </el-button>
    <img :src="userStore.avatar" style="width: 22px;height: 22px; margin:0 10px; border-radius:50%">
  <el-dropdown>
        <span class="el-dropdown-link" style="margin-right: 10px">
          {{userStore.username}}
          <el-icon class="el-icon--right">
            <CaretBottom />
          </el-icon>
        </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item icon="Promotion" @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import {useRouter,useRoute} from "vue-router";
import useUserStore from "@/store/modules/user.ts";
//获取骨架小仓库
import useLayOutSettingStore from "@/store/modules/setting.ts";
import {ElNotification} from "element-plus";
import {getTime} from "@/utils/time.ts";
let LayoutSettingStore = useLayOutSettingStore()
//刷新按钮点击回调
const updRefresh=()=>{
  LayoutSettingStore.refresh = !LayoutSettingStore.refresh
}
//获取用户相关仓库
let userStore = useUserStore()
//获取路由器对象
let $router = useRouter()
//获取路由对象
let $route = useRoute()
//全屏按钮点击回调
const fullScreen = ()=>{
  //dom对象的一个属性，用来判断当前是不是全屏模式，是返回true，否返回null
  let full = document.fullscreenElement
  if(!full){
    //利用dom根节点的方法实现全屏
    document.documentElement.requestFullscreen();
  }else{
    //退出全屏
    document.exitFullscreen()
  }
}
//退出登录点击回调
const logout = async ()=>{
  //第一件事，向服务器发送请求[退出登录接口]，假接口没提供，先不做
  //第二件事，仓库中用户相关的数据要清空，token|username|avatar
  //第三件事，跳转到登录页面
  await userStore.userLogout()
  //跳转到登录页面
  $router.push({path:'/login',query:{redirect:$route.path}});
  ElNotification({
    type: 'success',
    message: '退出成功',
  })
}
</script>
<script lang="ts">
export default {
  name:'Setting'
}
</script>


<style scoped lang="scss">
</style>