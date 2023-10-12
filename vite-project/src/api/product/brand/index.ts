//品牌管理接口
import request from "@/utils/request.ts";
import {BrandResponseData} from "@/api/product/brand/type.ts";
//品牌管理模块接口地址
enum API{
    //获取已有品牌接口
    BRAND_URL = "/admin/product/baseTrademark"
}
//获取已有品牌接口方法
//page：获取第几页，默认第一页
//limit：获取几个数据
export const reqHasBrand=(page:number,limit:number)=>request.get<any,BrandResponseData>(API.BRAND_URL+`/${page}/${limit}`)