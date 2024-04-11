// 账号信息ts类型
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

// 一个账号的ts类型
export interface UserType {
    id?: number,
    createTime?: string,
    updateTime?: string,
    username?: string,
    password?: string,
    name?: string,
    phone?: null,
    roleName?: string
}

// 数组包含全部用户信息
export type Records = UserType[]

// 获取全部用户信息返回数据ts类型
export interface UserResponseData extends ResponseData {
    data: {
        "records": Records
        "total": number,
        "size": number,
        "pages": number
    }

}

// 代表一个职位的ts类型
export interface RoleData {
    "id"?: number,
    "createTime"?: string,
    "updateTime"?: string,
    "roleName"?: string,
    "remark"?: null
}

// 全部职位列表
export type AllRole = RoleData[]
// 获取全部职位接口返回的ts数据类型
export interface AllRoleResponseData extends ResponseData{
    data:{
        assignRoles:AllRole,
        allRoleList: AllRole,
    }
}

// 分配角色接口携带参数ts类型
export  interface  AssignRoleData{
    roleIdList: number[],
    userId: number
}