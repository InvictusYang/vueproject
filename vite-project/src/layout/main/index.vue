<template>
<div>
<!--  路由组件出口的位置-->
<!--  <router-view>获取的组件实际上是从Vue Router的路由配置中传入的。-->
  <router-view #default="{ Component }">
    <transition name="fade">
      <component :is="Component" v-if="flag" />
    </transition>
  </router-view>
</div>
</template>


<script setup lang="ts">
import {nextTick, ref, watch} from "vue";
//获取仓库
import useLayOutSettingStore from "@/store/modules/setting.ts";
let LayOutSettingStore = useLayOutSettingStore()
//控制当前组件是否销毁重建
let flag = ref(true)
//监听仓库内部数据是否发生变化，如果变化，说明用户点击过刷新按钮
watch(()=>LayOutSettingStore.refresh,async ()=>{
  //点击路由组件，销毁组件
  flag.value = !flag.value
  //Dom更新完毕后调用
  await nextTick()
  flag.value = true
})
</script>
<script lang="ts">
export default {
    name:'Main'
}
</script>


<style scoped>
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}

.fade-enter-active {
  transition: all .3s;
}

.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>