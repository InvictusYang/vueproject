//对axios二次封装
import axios from 'axios'
import {ElMessage} from "element-plus";

//1. 利用axios对象create方法，创建axios实例，此实例可以进行其他配置（其他配置：基础路径、超时时间）
let request = axios.create({
    //基础路径
    baseURL:import.meta.env.VITE_APP_BASE_API, //基础路径上会携带/api
    timeout:5000 //超时时间ms
});
//2. request实例添加请求与响应拦截器
request.interceptors.request.use((config) =>{
    //config配置对象，headers属性请求头，经常给服务器携带公共参数
    //返回配置对象
    return config
})
//3. 响应拦截器
request.interceptors.response.use((response)=>{
    //成功回调
    //简化数据,如return { code: 200, data: { checkUser } }，只返回data信息
    return response.data
},(error)=>{
    //失败回调
    //处理http网络错误
    //定义一个变量，存储网络错误信息
    let message = ''
    let status = error.response.status
    switch (status){
        case 401:
            message = 'TOKEN Expired'
            break
        case 403:
            message = 'Unauthorized'
            break
        case 404:
            message = "请求地址错误"
            break
        case 500:
            message = "服务器出错"
            break
        default:
            message = "网络错误"
            break
    }
    //提示错误信息
    ElMessage({
        type:'error',
        message
    })
    //结束promise对象
    return Promise.reject(error)
})

export default request