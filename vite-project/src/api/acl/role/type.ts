export interface ResponseData{
    code:number,
    message:string,
    ok:boolean
}

// 职位数据
export interface RoleData{
    "id"?: number,
    "createTime"?: string,
    "updateTime"?: string,
    "roleName": string,
    "remark"?: null
}

// 响应的全部职位数据数组
// export type Records = RoleData[]
export interface Records extends Array<RoleData> {}

// 全部职位响应数据的ts类型
export interface RoleResponseData extends ResponseData{
    data:{
        records: Records,
        "total": number,
        "size": number,
        "current": number,
        "orders": [],
        "optimizeCountSql": boolean,
        "hitCount": boolean,
        "countId": null,
        "maxLimit": null,
        "searchCount": boolean,
        "pages": number
    }
}

// 菜单与按钮数据的ts类型
export interface MenuData{
    id : number
    createTime : string
    updateTime : string
    pid : number
    name : string
    code : string
    toCode : string
    type : number
    status : null
    level : number
    children?:MenuList[]
    select : boolean
}

export type MenuList = MenuData[]

// 菜单权限与按钮权限的ts类型
export interface MenuResponseData extends ResponseData{
    data:MenuList
}