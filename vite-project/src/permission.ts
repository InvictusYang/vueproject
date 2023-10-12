//路由鉴权
import router from "@/router";
import setting from './setting.ts'
import nprogress from 'nprogress'
//引入进度条样式
import 'nprogress/nprogress.css'
//去掉加载的小圆圈
nprogress.configure({showSpinner:false})
//获取用户相关的小仓库内部token数据，判断用户是否登录成功
import useUserStore from "@/store/modules/user.ts";
//组件外部获取不到pinia实例，pinia 实例不能自动注入，你必须手动提供给 useStore() 函数
import pinia from "@/store";
let userStore = useUserStore(pinia)
//全局前置守卫
router.beforeEach(async (to:any,from:any,next:any)=>{
    //访问路由之前的守卫
    //to目标路由组件，from来源路由，next路由的放行函数
    nprogress.start()
    //获取token，判断是否登录
    let token = userStore.token
    //获取用户名字
    let username = userStore.username
    if(token){
        //如果已经登录且还想访问login页面，直接重定向到首页或当前所在页
        if(to.path == "/login"){
            next({path:from.path})
        }else{
            //登录成功，访问其余六个路由，都直接放行
            //判断是否有用户信息
            if(username){
                next()
            }else{
                //没有用户信息，守卫内部发送请求获取信息再放行
                //方法是异步，返回promise，可以判断
                try{
                    await userStore.userInfo()
                    next()
                }catch (e) {
                    //token过期，就获取不到用户信息
                    //或者用户手动修改了本地token
                    //遇到上述情况，先退出登录，清除用户信息
                    await userStore.userLogout()
                    //同时跳转登录页，并携带退出前目标路由参数
                    next({path:'/login',query:{redirect:to.path}})
                }
            }
        }
        next()
    }else{
        //如果指向登录页面，直接跳转放行
        if(to.path == '/login'){
            next()
        }else{
            //如果不是指向登录页面，则重定向到登录页面，并将要访问的页面作为参数携带
            next({path:'/login',query:{redirect:to.path}})
        }
    }
})
//全局后置守卫
router.afterEach((to:any,from:any)=>{
    nprogress.done()
    //页面title，利用dom属性即可操作
    document.title = `${setting.title} - ${to.meta.title}`
})

//任意路由切换进度条的问题 --nprogress
//当前全部路由组件：登录|404|任意路由|首页|数据大屏|权限管理（三个子路由）|商品管理（四个子路由）

//用户未登录：可以访问登录login，其余路由均不能访问，均指向login
//用户登录后，不能访问login，指向首页，其余路由均能访问