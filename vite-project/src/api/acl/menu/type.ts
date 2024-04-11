// 返回的数据类型
export interface ResponseData{
    code:number
    message:string
    ok:boolean
}


// 菜单与按钮数据
export interface Permission{
    "id"?: number,
    "createTime"?: string,
    "updateTime"?: string,
    "pid": number,
    "name": string,
    "code": null,
    "toCode": null,
    "type": number,
    "status": null,
    "level": number,
    "children"?: PermissionList,
    "select": boolean
}

export type PermissionList = Permission[]


// 接口返回数据类型
export interface PermissionResponseData extends ResponseData{
    data:PermissionList
}

// 添加与修改菜单携带的参数类型
export interface MenuParams{
    id?:number,
    code: string,
    level:number,
    name: string,
    pid:number
}