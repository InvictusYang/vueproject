import request from "@/utils/request.ts";
import {SkuResponseData} from "@/api/product/sku/type.ts";
import {SkuInfoData} from "@/api/product/spu/type.ts";

//枚举api接口地址
enum API {
    // 获取sku接口
    GETSKU_URL = '/admin/product/list/',
    // 下架商品
    CANCELSALE_URL = '/admin/product/cancelSale/',
    // 上架商品
    ONSALE_URL = '/admin/product/onSale/',
    // 查询SKU详情
    SKUINFO_ULR = '/admin/product/getSkuInfo/',
    // 删除sku
    DELETESKU_URL = '/admin/product/deleteSku/'
}

// 接口请求sku
export const reqSkuList = (page: number, limit: number) => request.get<any,SkuResponseData>(API.GETSKU_URL + `${page}/${limit}`)
// 请求下架商品
export const reqCancelSale = (skuId: number) => request.get<any, any>(API.CANCELSALE_URL + skuId)
// 请求上架商品
export const reqOnSale = (skuId: number) => request.get<any, any>(API.ONSALE_URL + skuId)
// 请求sku详情数据
export const reqSkuInfo = (skuId:number)=>request.get<any, SkuInfoData>(API.SKUINFO_ULR + skuId)
// 请求删除某个sku
export const reqDeleteSku = (skuId:number)=>request.delete<any, any>(API.DELETESKU_URL + skuId)