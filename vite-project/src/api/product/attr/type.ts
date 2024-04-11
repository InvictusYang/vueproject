//分类相关的数据ts类型,不包含data
export interface ResponseData {
    code: number
    message: string
    ok: boolean
}

//分类ts类型，即data数据类型
export interface CategoryObj {
    id: number | string, //三个接口都有
    name: string //三个接口都有
    category1Id?: number //可能不存在
    category2Id?: number //可能不存在
}

//相应的分类接口返回的数据类型，包含data的返回数据类型
export interface CategoryResponseData extends ResponseData {
    data: CategoryObj[]
}

//已有属性值对象ts类型
export interface AttrValue {
    id?: number,
    valueName: string,
    attrId?: number
    flag?:boolean
}

//存储每一个属性值的数组类型
export type AttrValueList = AttrValue[]

//属性对象
export interface Attr {
    id?: number,
    attrName: string,
    categoryId: number | string,
    categoryLevel: number
    attrValueList: AttrValueList
}

//存储每一个属性对象数组ts类型
export type AttrList = Attr[]

//属性接口返回的数据ts类型
export interface AttrResponseData extends ResponseData {
    data: AttrList
}
