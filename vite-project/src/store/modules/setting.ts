//小仓库：layout组件相关配置仓库
import {defineStore} from "pinia";

let useLayOutSettingStore = defineStore('SettingStore',{
    state:()=>{
        return {
            fold:false,//用于控制菜单折叠还是收起
            refresh:false,//用于控制刷新效果
            dark:false, // 控制暗黑模式切换
        }
    }
})

export default useLayOutSettingStore