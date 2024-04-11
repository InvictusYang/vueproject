import { createApp } from 'vue'
import App from '@/App.vue'
//引入模板的全局样式
import '@/styles/index.scss'
// 暗黑模式需要的样式
import 'element-plus/theme-chalk/dark/css-vars.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//svg插件需要的配置代码
import 'virtual:svg-icons-register'
//引入自定义插件对象：注册项目全局组件
import globalComponent from '@/components'
//配置element-plus国际化中文
//@ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
//引入路由
import router from './router'
//引入仓库
import pinia from './store/index.ts'
//获取应用实例对象
const app = createApp(App)

app.use(ElementPlus,{
    //设置中文
    locale:zhCn
})

//安装自定义插件
app.use(globalComponent)
//安装仓库
app.use(pinia)

//测试代码，测试假的接口能否使用
// import axios from 'axios'
//登录接口测试
// axios({
//     url:'/api/user/login',
//     method:'POST',
//     data:{
//         username:'admin',
//         password:'1111111'
//     }
// })
//注册模板路由
app.use(router)
//引入路由鉴权的文件
import '@/permission.ts'
//挂载应用
app.mount('#app')
