// 用户管理模块接口
import request from "@/utils/request.ts";
import {AssignRoleData, UserResponseData, UserType} from "@/api/acl/user/type.ts";

// 枚举地址
enum API{
    // 获取用户账号信息
    USERACCS_URL = '/admin/acl/user/',
    // 新增用户
    ADDUSER_URL = '/admin/acl/user/save',
    // 修改用户
    UPDATEUSER_URL = '/admin/acl/user/update',
    // 获取职位，当前账号拥有的职位接口
    ROLE_URL="/admin/acl/user/toAssign/",
    // 给已有用户分配相应角色
    ASSIGNROLE_URL = '/admin/acl/user/doAssignRole',
    // 删除某一个账号
    DELETEUSER_URL = '/admin/acl/user/remove/',
    // 批量删除账号
    BATCHREMOVE_URL = '/admin/acl/user/batchRemove'
}

// 获取用户信息接口方法
export const reqUserAcc = (pageNo:number, limit: number, username:string)=>request.get<any, UserResponseData>(API.USERACCS_URL+`${pageNo}/${limit}?username=${username}`)
// 新增/修改用户
export const reqCreateOrUpdateUser = (data: UserType)=> {
    // 根据id来判断
    if(data.id){
        return request.put(API.UPDATEUSER_URL, data)
    }else{
        return request.post(API.ADDUSER_URL, data)
    }
}
// 获取全部职位以及包含当前用户已有职位的接口方法
export const reqAllRole = (userId:number)=>request.get<any, any>(API.ROLE_URL+userId)

// 分配角色接口
export const reqAssignRoles = (roleData:AssignRoleData)=>request.post<any,any>(API.ASSIGNROLE_URL,roleData)

// 删除用户的接口方法
export const reqDeleteUser=(id:number)=>request.delete<any,any>(API.DELETEUSER_URL+id)

// 删除用户的接口方法
export const reqBatchRemove=(idList:number[])=>request.delete<any,any>(API.BATCHREMOVE_URL, {data:idList})