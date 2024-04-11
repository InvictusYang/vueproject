<template>
  <el-table
      :data = "permissionArr"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
  >
    <el-table-column prop="name" label="名称"/>
    <el-table-column prop="code" label="权限值"/>
    <el-table-column prop="createTime" label="修改时间"/>
    <el-table-column prop="updateTime" label="操作">
      <template #="{row, $index}">
        <el-button
            size="small"
            type="primary"
            :disabled="row.level === 4"
            @click="addPermission(row)"
        >{{row.level === 3 || row.level===4? "添加功能":"添加菜单"}}</el-button>
        <el-button size="small" type="success" :disabled="row.level === 1" @click="updatePermission(row)">编辑</el-button>
        <el-popconfirm :title="`确定要删除${row.name}?`" @confirm="removePermission(row)" width="200px">
          <template #reference>
            <el-button size="small" type="danger" :disabled="row.level === 1">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
<!--  对话框，用于添加或修改已有的菜单数据-->
  <el-dialog
      v-model="dialogVisible"
      :title="menuData.id?'修改菜单':'添加菜单'"
  >
    <el-form>
      <el-form-item label="名称" label-width="60px">
        <el-input placeholder="请输入名称" v-model="menuData.name"></el-input>
      </el-form-item>
      <el-form-item label="权限值" label-width="60px">
        <el-input placeholder="请输入权限值" v-model="menuData.code"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>


<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {reqAddOrUpdatePermission, reqAllPermission, reqDeleteMenu} from "@/api/acl/menu";
import {Permission, PermissionList, PermissionResponseData} from "@/api/acl/menu/type.ts";
import {ElMessage} from "element-plus";
let permissionArr = ref<PermissionList>([])
//控制对话框展示与隐藏
let dialogVisible = ref<boolean>(false)
let menuData = reactive({
  code:"",
  level:0,
  name:"",
  pid:0
})
// 组件挂载
onMounted(()=>{
  getAllPermissions()
})

const getAllPermissions = async ()=>{
  let res:PermissionResponseData = await reqAllPermission()
  if(res.code === 200){
    permissionArr.value = res.data
  }
}

// 点击添加菜单按钮回调
const addPermission = (row:Permission)=>{
  // 先清空数据
  Object.assign(menuData,{
    id:0,
    code:"",
    level:0,
    name:"",
    pid:0
  })
  dialogVisible.value = true
  // 收集level和pid
  menuData.level = row.level +1
  menuData.pid = (row.id as number)
}

// 点击编辑按钮回调
const updatePermission =(row:Permission)=>{
  dialogVisible.value = true
  // 将已有的数据合并
  Object.assign(menuData,row)
  console.log(menuData)
}

// 点击确定按钮回调
const submit = async ()=>{
  dialogVisible.value = false
  let res:any = await reqAddOrUpdatePermission(menuData)
  if(res.code === 200){
    ElMessage({
      "type":"success",
      "message":menuData.id?"更新成功":"新增成功"
    })
    await getAllPermissions()
  }else{
    ElMessage({
      "type":"error",
      "message":menuData.id?"更新失败":"新增失败"
    })
  }
}
// 点击删除按钮回调
const removePermission =async (row:Permission)=> {
  let res: any = await reqDeleteMenu(row.id)
  if (res.code === 200) {
    ElMessage({
      type: "success",
      message: "删除成功"
    })
    await getAllPermissions()
  } else {
    ElMessage({
      type: "error",
      message: "删除失败"
    })
  }
}
</script>


<style scoped>

</style>