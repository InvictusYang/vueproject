//用户相关的小仓库
import {defineStore} from "pinia";
//引入接口
import {reqLogin} from "@/api/user";
//引入数据类型
import {loginForm,loginResponseData} from "@/api/user/type.ts";
import type {UserState} from "@/store/modules/types/type.ts";
//引入操作本地存储的工具方法
import {SET_TOKEN,GET_TOKEN} from "@/utils/token.ts";
//创建小仓库
let useUserStore = defineStore('User',{
    //小仓库存储数据的地方,函数返回的类型是UserState
    state:():UserState=>{
        return {
            token:GET_TOKEN()//用户唯一标识token,从本地存储里获取
        }
    },
    //处理异步或逻辑
    actions:{
        //用户登录方法
        async userLogin(data:loginForm){
            //登录请求
            let result:loginResponseData = await reqLogin(data);
            //登录请求：成功-》token
            //失败-》登录失败错误信息
            if(result.code === 200){
                //通过store存储token
                this.token=(result.data.token as string)
                //还应该本地存储持久化token
                SET_TOKEN(result.data.token as string)
                return "ok"//保证async函数返回一个成功promise
            }else{
                return Promise.reject(new Error(result.data.message))
            }
        }
    },
    getters:{

    }
})

//对外暴露小仓库
export default useUserStore