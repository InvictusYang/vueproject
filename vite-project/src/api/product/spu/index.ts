// @ts-ignore
import request from "@/utils/request.ts";
// @ts-ignore
import type {
    AllTrademark,
    HasSaleAttrResponse,
    HasSpuResponseData,
    SkuData,
    SkuInfoData,
    SpuImgWall
} from "@/api/product/spu/type.ts";
// @ts-ignore
import {SaleAttrResponseData} from "@/api/product/spu/type.ts";

enum API {
    //SPU查询地址
    HASSPU_URL = '/admin/product/',
    //获取全部品牌数据
    ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
    //获取某个SPU下全部商品的图片数据
    IMAGE_URL = "/admin/product/spuImageList/",
    //获取某个spu下所有的销售属性接口
    SPUSALEATTR_URL = '/admin/product/spuSaleAttrList/',
    //获取整个项目全部的销售属性【颜色、版本、尺码】
    ALL_SALEATTR_URL = '/admin/product/baseSaleAttrList',
    //新增一个SPU
    ADDSPU_URL = '/admin/product/saveSpuInfo',
    //更新已有的SPU
    UPDATESPU_URL = "/admin/product/updateSpuInfo",
    //追加新的SKU
    ADDSKU_URL = '/admin/product/saveSkuInfo',
    //查看某个spu下的全部SKU
    SKUINFO_URL = '/admin/product/findBySpuId/',
    //删除已有的SPU
    REMOVESPU_URL = '/admin/product/deleteSpu/'
}

//获取某个三级分类下的SPU数据
export const reqHasSpu = (page: number, limit: number, category3Id: string | number) => request.get<any, HasSpuResponseData>(API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`)

//获取全部品牌SPU品牌的接口方法
export const reqAllTrademark = () => request.get<any, AllTrademark>(API.ALLTRADEMARK_URL)

//获取spu下全部商品图片地址
export const reqSpuImageList = (spuId: number) => request.get<any, SpuImgWall>(API.IMAGE_URL + spuId)

//获取某个SPU下全部销售属性
export const reqSpuSaleAttr = (spuId: number) => request.get<any, SaleAttrResponseData>(API.SPUSALEATTR_URL + spuId)

//获取全部销售属性
export const reqAllSaleAttr = () => request.get<any, HasSaleAttrResponse>(API.ALL_SALEATTR_URL)

//新增/更新SPU接口
//data为新增的spu对象/已有的SPU对象
export const reqAddOrUpdateSpu = (data: any) => {
    //存在id表示更新
    if (data.id) {
        return request.post<any, any>(API.UPDATESPU_URL, data)
    } else {
        return request.post<any, any>(API.ADDSPU_URL, data)
    }
}

//新增SKU方法
export const reqAddSku = (data: SkuData) => request.post<any, any>(API.ADDSKU_URL, data)

//获取SKU数据
export const reqSkuList = (spuid: number | string) => request.get<any, SkuInfoData>(API.SKUINFO_URL + spuid)

//删除某SPU
export const reqDeleteSpu = (spuid: number | string) => request.delete<any, any>(API.REMOVESPU_URL + spuid)