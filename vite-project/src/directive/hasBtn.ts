import pinia from "@/store";
import useUserStore from "@/store/modules/user.ts";

let userStore = useUserStore(pinia)
export const isHasButton = (app:any)=>{
    app.directive('has',{
        // 代表使用这个全局自定义指令的DOM|组件挂载完毕时会执行一次
        mounted(el:any,option:any){
            // el即为组件
            // option是自定义指令右侧的数值，如果用户信息button中没有该button
            // 从dom树中移除掉
            if(!userStore.buttons.includes(option.value)){
                // 原生dom方法，从父节点移除
                el.parentNode.removeChild(el)
            }
        }
    })
}