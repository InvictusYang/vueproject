import type {Attr, CategoryResponseData} from "@/api/product/attr/type.ts";

//书写属性相关API文件
import request from '@/utils/request.ts'
import {AttrResponseData} from "@/api/product/attr/type.ts";

//接口地址
enum API {
    //一级分类接口
    C1_URL = '/admin/product/getCategory1',
    //二级分类
    C2_URL = '/admin/product/getCategory2/',
    //三级分类
    C3_URL = '/admin/product/getCategory3/',
    //获取分类已有属性和属性值接口
    ATTR_INFO = '/admin/product/attrInfoList/',
    //添加或更新已有的属性接口
    ADDORUPDATEATTR_URL = '/admin/product/saveAttrInfo',
    //删除已有的属性接口
    DELETEATTR_URL = "/admin/product/deleteAttr/"
}

//一级分类获取接口方法
export const reqC1 = () => request.get<any, CategoryResponseData>(API.C1_URL)
//二级分类获取接口方法
export const reqC2 = (category1ID: number | string) => request.get<any, CategoryResponseData>(API.C2_URL + category1ID)
//三级分类获取接口方法
export const reqC3 = (category2ID: number | string) => request.get<any, CategoryResponseData>(API.C3_URL + category2ID)
//获取分类已有属性和属性值接口方法
export const reqAttrInfo = (category1ID: number | string, category2ID: number | string, category3ID: number | string) => request.get<any,AttrResponseData>(API.ATTR_INFO + `${category1ID}/${category2ID}/${category3ID}`)
//新增或修改已有的属性接口
export const reqAddOrUpdateAttr =(data:Attr)=>request.post<any,any>(API.ADDORUPDATEATTR_URL,data)
//删除某一个已有属性
export const reqRemoveAttr =(attrId:number)=>request.delete<any,any>(API.DELETEATTR_URL+attrId)