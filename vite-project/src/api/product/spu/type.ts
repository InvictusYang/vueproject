//服务器全部接口返回的数据类型
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

//spu数据ts类型
export interface SpuData {
    id?: number//新增无id
    spuName: string
    description: string
    category3Id: number | string
    tmId: number | string
    spuSaleAttrList: null | SaleAttr[]
    spuImageList: null | SpuImg[]
}

//数组包含元素都是spu数据ts类型
export type Records = SpuData[]

//以后的spu接口返回的数据类型
export interface HasSpuResponseData extends ResponseData {
    data: {
        records: Records
        total: number
        size: number
        current: number
        searchCount: boolean
        pages: number
    }
}

//所有品牌的ts类型
export interface Trademark {
    id: number
    tmName: string
    logoUrl: string
}

//品牌接口返回数据类型
export interface AllTrademark extends ResponseData {
    data: Trademark[]
}

//商品图片ts类型
export interface SpuImg {
    id?: number
    createTime?: string
    updateTime?: string
    spuId?: number
    imgName?: string
    imgUrl?: string
    name?:string
    url?:string
}

//已有spu照片墙数据类型
export interface SpuImgWall extends SpuImg {
    data: SpuImg[]
}

//已有的SPU销售属性值对象
export interface SaleAttrValue {
    id?: number
    createTime?: null
    updateTime?: null
    spuId?: number
    baseSaleAttrId: number | string
    saleAttrValueName: string
    saleAttrName?: string
    isChecked?: null
}

//存储已有销售属性值数组类型
export type SpuSaleAttrValueList = SaleAttrValue[]

//销售属性对象ts类型
export interface SaleAttr {
    id?: number
    createTime: null
    updateTime: null
    spuId: number
    baseSaleAttrId: number | string
    SaleAttrName: string
    spuSaleAttrValueList: SpuSaleAttrValueList[]
    flag?:boolean
    saleAttrValue?:string
}

//SPU已有的销售属性返回的数据ts类型
export interface SaleAttrResponseData extends ResponseData {
    data: SaleAttr[]
}

//所有SPU属性
export interface AllSaleAttr {
    id: number
    name: string
}

//全部SPU返回数据类型
export interface HasSaleAttrResponse extends ResponseData {
    data: AllSaleAttr[]
}

export interface Attr{
    "attrId": number | string
    "valueId": number | string
}

export interface saleAttr{
    "saleAttrId": number | string
    "saleAttrValueId": number | string
}

export interface SkuData{
    "category3Id":string | number
    "spuId": string | number
    "tmId": string | number
    "skuName": string
    "price": string | number
    "weight": string | number
    "skuDesc": string
    "skuAttrValueList"?: Attr[],
    //销售属性
    "skuSaleAttrValueList"?: saleAttr[],
    //售卖商品sku图片地址
    "skuDefaultImg": string
}

//获取sku数组接口的ts类型
export interface SkuInfoData extends ResponseData{
    data : SkuData[]
}
