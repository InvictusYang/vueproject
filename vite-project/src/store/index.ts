//创建大仓库
import {createPinia} from "pinia";
let pinia = createPinia()

//定义单独的重置方法，组合式写法中必须这么写
pinia.use(({store}) => {
    const initialState = JSON.parse(JSON.stringify(store.$state))
    store.$reset = () => {
        store.$state = JSON.parse(JSON.stringify(initialState))
    }
})

//对外暴露：入口文件需要安装仓库
export default pinia