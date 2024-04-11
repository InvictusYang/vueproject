export interface ResponseData{
    code:number,
    message: string,
    ok:boolean
}

//sku对象的ts类型
export interface Attr{
    "id?": number
    "attrId": number | string
    "valueId": number | string
}

export interface saleAttr{
    "id"?:number
    "saleAttrId": number | string
    "saleAttrValueId": number | string
}

export interface SkuData{
    "category3Id"?:string | number
    "spuId"?: string | number
    "tmId"?: string | number
    "skuName"?: string
    "price"?: string | number
    "weight"?: string | number
    "skuDesc"?: string
    "skuAttrValueList"?: Attr[],
    //销售属性
    "skuSaleAttrValueList"?: saleAttr[],
    //售卖商品sku图片地址
    "skuDefaultImg"?: string
    "isSale"?:number
}


//获取sku接口返回的数据ts类型
export interface SkuResponseData extends ResponseData{
    data:{
        records: SkuData[],
        total:number,
        size:number,
        current: number,
        orders: [],
        optimizeCountSql: boolean,
        hitCount: boolean,
        countId: null,
        maxLimit: null,
        searchCount: boolean,
        pages:number
    }
}