//品牌管理接口
import request from "@/utils/request.ts";
import {Brand, BrandResponseData} from "@/api/product/brand/type.ts";
//品牌管理模块接口地址
enum API{
    //获取已有品牌接口 GET
    BRAND_URL = "/admin/product/baseTrademark",
    //新增品牌接口 POST
    ADDBRAND_URL = '/admin/product/baseTrademark/save',
    //修改品牌接口 PUT
    UPDATEBRAND_URL = '/admin/product/baseTrademark/update'
}
//获取已有品牌接口方法
//page：获取第几页，默认第一页
//limit：获取几个数据
export const reqHasBrand=(page:number,limit:number)=>request.get<any,BrandResponseData>(API.BRAND_URL+`/${page}/${limit}`)
//新增品牌接口方法和修改接口方法
export const reqAddOrUpdateBrand=(data:Brand)=>{
    //新增和修改提交参数的不同是修改携带了id
    //这是修改
    if(data.id){
        //返回值中data为null，没必要定义类型
        return request.put<any,any>(API.UPDATEBRAND_URL,data)
    }else{
        //这是新增，返回数据也是null，any即可
        return request.post<any,any>(API.ADDBRAND_URL,data)
    }
}