//返回数据类型，不包含data部分
export interface ResponseData{
    code:number
    message:string
    ok:boolean
}

//单个品牌的数据类型，即records中的某一条
export interface Brand{
    id?:number//新增数据则不会携带id，数据库自动生成
    tmName:string
    logoUrl:string
}

//包含全部品牌数据的ts类型，多个品牌的数组
export type Records=Brand[]

//获取已有全部品牌数据ts类型，继承了ResponseData，包含所有字段
export interface BrandResponseData extends ResponseData{
    data:{
        records:Records
        total:number
        size:number
        current:number
        searchCount:boolean
        pages:number
    }
}