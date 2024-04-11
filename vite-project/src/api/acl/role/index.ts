import request from "@/utils/request.ts";
import {MenuResponseData, RoleData, RoleResponseData} from "@/api/acl/role/type.ts";

enum API{
    // 查询用户角色接口
    ROLEINFO_URL = '/admin/acl/role/',
    // 新增用户角色
    ADDROLE_URL = '/admin/acl/role/save',
    // 更新用户角色
    UPDATEROLE_URL = '/admin/acl/role/update',
    // 获取全部菜单与按钮数据
    ALLPERMISSION_URL='/admin/acl/permission/toAssign/',
    // 给用户分配权限
    SETPERMISSION_URL='/admin/acl/permission/doAssign/',
    // 删除已有的职位
    DELETEROLE_URL = '/admin/acl/role/remove/',
}

// 请求用户信息
export const reqRoleInfo = (page:number, limit:number, role:string)=>request.get<any, RoleResponseData>(API.ROLEINFO_URL+`${page}/${limit}?roleName=${role}`)
// 新增或更新用户角色
export const reqAddOrUpdateRole = (data:RoleData)=>{
    if(data.id){
        return request.put<any,any>(API.UPDATEROLE_URL, data)
    }else{
        return request.post<any,any>(API.ADDROLE_URL, data)
    }
}
// 获取角色权限方法
export const reqAssignPermission = (roleId:number)=>request.get<any,MenuResponseData>(API.ALLPERMISSION_URL+roleId)
// 给职位配置权限
export const reqSetPermission = (roleId:number, permissionId:number[])=>request.post(API.SETPERMISSION_URL+`?roleId=${roleId}&permissionId=${permissionId}`)
// 删除响应职位
export const reqDelRole = (roleId:number)=>request.delete(API.DELETEROLE_URL+roleId)