import request from "@/utils/request.ts";
import {MenuParams, Permission, PermissionResponseData} from "@/api/acl/menu/type.ts";

// 枚举地址
enum API{
    // 获取全部菜单和按钮的标识数据
    ALLPERMISSION_URL = '/admin/acl/permission',
    // 新增权限菜单
    ADDPERMISSION_URL = '/admin/acl/permission/save',
    // 更新权限菜单
    UPDATEPERMISSION_URL = '/admin/acl/permission/update',
    // 删除权限菜单
    REMOVEPERMISSION_URL = '/admin/acl/permission/remove/'
}

// 获取菜单数据
export const reqAllPermission = ()=> request.get<any, PermissionResponseData>(API.ALLPERMISSION_URL)
// 新增或更新菜单
export const reqAddOrUpdatePermission = (data:MenuParams)=> {
    if(data.id){
        return request.put<any,any>(API.UPDATEPERMISSION_URL,data)
    }else{
        return request.post<any,any>(API.ADDPERMISSION_URL,data)
    }
}
// 删除菜单
export const reqDeleteMenu = (id:number)=>request.delete<any,any>(API.REMOVEPERMISSION_URL+id)