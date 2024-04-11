//用户相关的小仓库
import {defineStore} from "pinia";
//引入接口
import {reqLogin, reqUserInfo,reqLogout} from "@/api/user";
import type {loginFormData,loginResponseData,userInfoResponseData} from "@/api/user/type.ts";
//引入操作本地存储的工具方法
import {SET_TOKEN,GET_TOKEN,REMOVE_TOKEN} from "@/utils/token.ts";
//引入路由（常量路由）
import {constantRoute} from "@/router/routes.ts";
import {UserState} from "@/store/modules/types/type.ts";
//创建小仓库
let useUserStore = defineStore('User',{
    //小仓库存储数据的地方,函数返回的类型是UserState
    state:():UserState=>{
        return {
            token:GET_TOKEN(),//用户唯一标识token,从本地存储里获取
            menuRoutes:constantRoute,//仓库存储生成菜单需要的数组（路由）
            username:'',
            avatar:'',
        }
    },
    //处理异步或逻辑
    actions:{
        //用户登录方法
        async userLogin(data:loginFormData){
            //登录请求
            let result:loginResponseData = await reqLogin(data);
            //登录请求：成功-》token
            //失败-》登录失败错误信息
            if(result.code == 200){
                //通过store存储token
                this.token=(result.data as string)
                //还应该本地存储持久化token
                SET_TOKEN(result.data as string)
                return "ok"//保证async函数返回一个成功promise
            }else{
                return Promise.reject(new Error(result.data))
            }
        },

        //获取用户信息的方法
        async userInfo(){
            //获取用户的头像，名称等信息
            let res:userInfoResponseData = await reqUserInfo()
            //如果获取用户信息成功，则存储
            if (res.code === 200){
                this.username = res.data.name
                this.avatar = res.data.avatar
                return "ok"
            }else{
                return Promise.reject(new Error(res.message))
            }
        },
        //退出登录
        async userLogout(){
            let result:any = await reqLogout()
            if(result.code == 200){
                this.token=''
                this.username=''
                this.avatar=''
                //以上只清除了仓库中的token,没清除本地存储中的token
                // localStorage.removeItem('TOKEN')
                REMOVE_TOKEN()
                return "ok"
            }else{
                return Promise.reject(new Error(result.message))
            }
        }
    },
    getters:{

    }
})

//对外暴露小仓库
export default useUserStore