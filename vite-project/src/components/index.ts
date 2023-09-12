import SvgIcon from './SvgIcon/Index.vue'
import Pagination from './Pagination/index.vue'

const allGlobalComponents = {
    SvgIcon,
    Pagination
}

//对外暴露插件对象
export default{
    //务必叫install，否则入口文件里app.use后不能正常执行
    //可以自动传入app对象
    install(app){
        //注册项目全部全局组件，这里是指上面的SvgIcon和Pagination
        Object.keys(allGlobalComponents).forEach(key =>{
            //遍历后注册每一个全局组件
            app.component(key,allGlobalComponents[key])
        })
    }
}