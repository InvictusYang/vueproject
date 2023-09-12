//通过vue-router插件实现模板路由配置
import {createRouter, createWebHashHistory} from 'vue-router'

//引入路由规则
import {constantRoute} from "@/router/routes.ts";
//创建路由器
let router = createRouter({
    //路由模式hash,地址带#
    history:createWebHashHistory(),
    routes:constantRoute,
    //滚动行为
    scrollBehavior(){
        return{
            left:0,
            top:0
        }
    }
})

export default router;