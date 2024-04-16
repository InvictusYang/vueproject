<template>
  <el-card style="height: 75px">
    <el-form inline class="form">
      <el-form-item label="角色名称">
        <el-input placeholder="请输入角色" v-model="keyword" style="width: 240px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="!keyword" @click="searchKeyword">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 8px 0">
    <el-button type="primary" icon="plus" @click="addRole" >添加角色</el-button>
<!--    <el-button type="warning" icon="delete">批量删除</el-button>-->
    <el-table style="margin: 15px 0" border :data="roleArr">
      <el-table-column type="index" align="center" label="#"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column label="角色名称" align="center" show-overflow-tooltip prop="roleName"></el-table-column>
      <el-table-column label="创建时间" align="center" show-overflow-tooltip prop="createTime"></el-table-column>
      <el-table-column label="更新时间" align="center" show-overflow-tooltip prop="updateTime"></el-table-column>
      <el-table-column label="操作" align="center" width="300px">
        <template #="{row, $index}">
          <el-button type="primary" size="small" icon="user" @click="assignRole(row)">分配权限</el-button>
          <el-button type="success" size="small" icon="edit" @click="updateRole(row)">编辑</el-button>
          <el-popconfirm :title="`确定要删除${row.roleName}?`" @confirm="deleteRole(row)">
            <template #reference>
              <el-button icon="delete" size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[1,3,5]"
        :background="true"
        layout=" prev, pager, next, jumper,->,sizes,total"
        :total="totalCount"
        @current-change="getRoleInfo"
        @size-change="sizeHandler"
    />
  </el-card>
<!--  添加用户角色对话框-->
  <el-dialog v-model="dialogFormVisible" :title="roleParams.id?'更新角色':'新增角色'" width="500">
    <el-form :model="roleParams" :rules="rules" ref="form">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="roleParams.roleName" placeholder="请输入角色名称" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
<!--  抽屉组件，用来分配用户角色权限-->
  <el-drawer v-model="drawerVisible">
    <template #header>
      <h4>分配权限</h4>
    </template>
    <template #default>
      <el-tree
          ref="tree"
          style="max-width: 600px"
          :data="permissionArr"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="selectArr"
          :props="defaultProps"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button>取消</el-button>
        <el-button type="primary" @click="submitAssign">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import {nextTick, onMounted, reactive, ref} from "vue";
import {reqAddOrUpdateRole, reqAssignPermission, reqDelRole, reqRoleInfo, reqSetPermission} from "@/api/acl/role";
import {MenuData, MenuResponseData, Records, RoleData, RoleResponseData} from "@/api/acl/role/type.ts";
import {ElMessage} from "element-plus";
import useUserStore from "@/store/modules/user.ts";

let userStore = useUserStore()
let pageNo = ref<number>(1)
let pageSize = ref<number>(2)
// 搜索关键字
let keyword = ref<string>('')
// 存储全部已有的职位
let roleArr = ref<Records>([])
// 职位总个数
let totalCount = ref<number>(0)
// 控制添加角色对话框显隐
let dialogFormVisible = ref<boolean>(false)
// 添加角色信息
let roleParams = reactive<RoleData>({
  roleName:''
})
// 控制抽屉显隐
let drawerVisible = ref<boolean>(false)
// 存储权限数据
let permissionArr = ref<MenuData[]>([])
// 使用一个数组来存储勾选的节点id
let selectArr = ref<number[]>([])
//获取form组件
const form = ref<any>()
onMounted(() => {
  getRoleInfo()
})
// 获取树形控件的实例
const tree= ref<any>()
const getRoleInfo = async(pager = 1)=>{
  pageNo.value = pager
  let res: RoleResponseData = await reqRoleInfo(pageNo.value,pageSize.value,keyword.value)
  if(res.code === 200) {
    roleArr.value = res.data.records
    totalCount.value = res.data.total
  }
}
// 分页器页面容量变化回调
const sizeHandler = ()=>{
  getRoleInfo()
}

// 点击搜索按钮发送请求
const searchKeyword = ()=>{
  // 再次发请求
  getRoleInfo()
}

// 点击重置按钮回调
const resetSearch= ()=>{
  keyword.value = ''
  getRoleInfo()
}

// 点击新增按钮回调
const addRole = ()=>{
  Object.assign(roleParams,{
    id:0,
    roleName:''
  })
  nextTick(()=>{
    form.value.clearValidate("roleName")
  })
  dialogFormVisible.value = true
}

// 点击编辑按钮回调
const updateRole = (row:RoleData)=>{
  nextTick(()=>{
    form.value.clearValidate('roleName')
  })
  dialogFormVisible.value=true
  // 存储已有的职位
  Object.assign(roleParams, row)
}

// 点击分配权限回调
const assignRole=async (row:RoleData)=>{
  drawerVisible.value=true
  roleParams.id = row.id
  let res:MenuResponseData = await reqAssignPermission(roleParams.id)
  permissionArr.value = res.data
  selectArr.value = filterArr(permissionArr.value,[])
}
// 定义递归判断是否选择的方法
const filterArr = (allData:any, initArr:any)=>{
  // 如果不递归，则无法全部遍历
  allData.forEach((item:any)=>{
    if(item.select && item.level == 4){
      initArr.push(item.id)
    }
    // 递归
    if(item.children && item.children.length > 0 ){
      filterArr(item.children,initArr)
    }
  })
  return initArr
}
// 角色校验方法
const validateRoleName = (rule: any, value: any, callback: any)=>{
    if(value.trim().length >= 3){
      callback()
    }else{
      callback(new Error("职位名称至少3位"))
    }
}
// 角色校验规则
const rules = {
  roleName:[
    {required:true, trigger:"blur", validator:validateRoleName}
  ]
}

// el-dialog点击确认按钮回调
const submit = async ()=>{
  // 表单先校验通过才能进行下方逻辑,否则无法通过
  await form.value.validate()
  let res:any = await reqAddOrUpdateRole(roleParams)
  if(res.code === 200){
    ElMessage({
      type:"success",
      message:roleParams.id?"更新成功":"添加成功"
    })
    // 请求成功后消失
    dialogFormVisible.value = false
    // 重新获取
    await getRoleInfo(roleParams.id?pageNo.value:1)
  }else{
    ElMessage({
      type:"error",
      message:roleParams.id?"更新失败":"添加失败"
    })
  }
}

// 控制分配权限页面展示的数据名称
const defaultProps = {
  children: 'children',
  label: 'name',
}

// 点击分配权限抽屉内的确定按钮回调
const submitAssign = async ()=>{
  // 角色id
  const roleId = roleParams.id
  // 选中节点的id,树形控件提供了对应的方法
  // 选中节点的id
  let arr = tree.value.getCheckedKeys()
  // 半选id
  let arr1 = tree.value.getHalfCheckedKeys()
  // 合并数组
  let jointArr = arr.concat(arr1)
  let res = await reqSetPermission(roleId, jointArr)
  if(res.code === 200){
    ElMessage({
      type:"success",
      message:"分配权限成功"
    })
    drawerVisible.value = false
  }else{
    ElMessage({
      type:"error",
      message:"分配权限失败"
    })
  }
  window.location.reload()
}

// 点击删除按钮回调
const deleteRole = async(row:RoleData)=>{
  let res = await reqDelRole(row.id)
  if(res.code === 200){
    ElMessage({
      type:"success",
      message:"删除成功",
    })
    await getRoleInfo(roleArr.value.length>1?pageNo.value:pageNo.value-1)
  }else{
    ElMessage({
      type:"error",
      message:"删除失败",
    })
  }
}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>