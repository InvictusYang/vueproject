<template>
  <el-card style="height: 80px">
    <el-form inline class="form">
      <el-form-item label="用户名:">
        <el-input placeholder="请输入用户名" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="!keyword" @click="searchKeyword">搜索</el-button>
        <el-button type="warning" @click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 8px 0">
    <el-button type="primary" @click="addUser">添加用户</el-button>
    <el-button type="danger" :disabled="!usersToBeDel.length" @click="batchDelUser">批量删除</el-button>
    <!--    展示用户信息的表格-->
    <el-table style="margin: 10px 0" :data="userArr" @selection-change="tableChange">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column label="用户名" align="center" prop="username"></el-table-column>
      <el-table-column label="昵称" align="center" prop="name" show-overflow-tooltip></el-table-column>
      <el-table-column label="角色" align="center" prop="roleName"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="300px" align="center">
        <template #="{row, $index}">
          <el-button type="primary" size="small" icon="user" @click="allocateRole(row)">分配角色</el-button>
          <el-button type="success" size="small" icon="edit" @click="editUser(row)">编辑</el-button>
          <el-popconfirm :title="`Are you sure to delete ${row.username}?`" width="260px" @confirm="confirmDel(row)" >
            <template #reference>
              <el-button type="danger" size="small" icon="delete">删除</el-button>
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
        :total="userCount"
        @current-change="getUserInfo"
        @size-change="handler"
    />
  </el-card>
  <!--  添加抽屉组件，用来新增、修改用户等-->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>{{ userParams.id ? "更新用户" : "添加用户" }}</h4>
    </template>
    <template #default>
      <el-form :model="userParams" :rules="rules" ref="ruleFormRef">
        <el-form-item label="用户姓名" prop="username">
          <el-input placeholder="请输入用户姓名" v-model="userParams.username"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input placeholder="请输入用户昵称" v-model="userParams.name"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
          <el-input placeholder="请输入用户密码" v-model="userParams.password"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirmInfo()">确认</el-button>
    </template>
  </el-drawer>
  <!--  用于分配角色和职位-->
  <el-drawer v-model="drawer2">
    <template #header>
      <h4>分配角色</h4>
    </template>
    <template #default>
      <el-form :model="userParams">
        <el-form-item label="用户姓名">
          <el-input v-model="userParams.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="职位列表">
          <!--          全选按钮-->
          <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
          >全选
          </el-checkbox>
          <!--          职位复选框，也受全选按钮控制-->
          <el-checkbox-group v-model="checkedRoles" @change="handleCheckedRolesChange">
            <el-checkbox
                v-for="(role, index) in allRoles"
                :key="index"
                :label="role"
            >{{ role.roleName }}
            </el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer2=false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确认</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import {nextTick, onMounted, reactive, ref} from 'vue'
import useLayOutSettingStore from "@/store/modules/setting.ts";
import {
  reqAllRole,
  reqAssignRoles,
  reqBatchRemove,
  reqCreateOrUpdateUser,
  reqDeleteUser,
  reqUserAcc
} from "@/api/acl/user";
import {
  AllRole,
  AllRoleResponseData,
  AssignRoleData,
  Records,
  UserResponseData,
  UserType
} from "@/api/acl/user/type.ts";
import {ElMessage} from "element-plus";
// 分页器默认页码
let pageNo = ref<number>(1)
// 页面数据数
let pageSize = ref<number>(3)
// 收集请求返回的用户信息
let userArr = ref<Records>([])
// 用户总个数
let userCount = ref<number>(0)
// 定义响应式数据，控制抽屉组件显隐
let drawer = ref<boolean>(false)
//定义响应式数据控制分配角色抽屉显隐
let drawer2 = ref<boolean>(false)
// 收集用户信息
let userParams = reactive<UserType>({
  username: "",
  name: "",
  password: ""
})
// 获取form组件实例
let ruleFormRef = ref<any>()
// 分配角色全选按钮默认状态
let checkAll = ref<boolean>(false)
let isIndeterminate = ref<boolean>(true)
//接口获取所有职位
let allRoles = ref<AllRole>([])
//当前用户已有的职位
let checkedRoles = ref<AllRole>([])
// 准备一个数组用来存储要批量删除的数据
let usersToBeDel = ref<UserType[]>([])
// 定义一个数据，收集用户输入的关键字
let keyword = ref<string>('')
// 获取模板setting仓库
let settingStore = useLayOutSettingStore()
// 组件挂载时请求用户数据
onMounted(() => {
  getUserInfo()
})

// 请求用户数据方法
const getUserInfo = async (page = 1) => {
  pageNo.value = page
  let res: UserResponseData = await reqUserAcc(pageNo.value, pageSize.value,keyword.value)
  if (res.code == 200) {
    userArr.value = res.data.records
    userCount.value = res.data.total
  }
}

// 页码size变化回调
const handler = () => {
  getUserInfo()
}

// 添加用户按钮回调
const addUser = () => {
  drawer.value = true
  //点击添加按钮就清空组件内的数据
  Object.assign(userParams, {
    id: "",
    username: "",
    name: "",
    password: ""
  })
  // 清楚上一次的错误提示信息
  // 组件刚挂载时还没有加载form实例，所以需要使用nextTick获取更新后的实例
  nextTick(() => {
    ruleFormRef.value.clearValidate("username")
    ruleFormRef.value.clearValidate("name")
    ruleFormRef.value.clearValidate("password")
  })
}

// 点击编辑按钮回调
const editUser = (row: UserType) => {
  drawer.value = true
  Object.assign(userParams, row)
  nextTick(() => {
    ruleFormRef.value.clearValidate("username")
    ruleFormRef.value.clearValidate("name")
  })
}

// 抽屉内点击确定按钮回调
const confirmInfo = async () => {
  // 符合条件再发请求，校验表格,不符合条件会返回失败的promise
  await ruleFormRef.value.validate()
  // 可能是添加或更新
  let res = await reqCreateOrUpdateUser(userParams)
  if (res.code == 200) {
    drawer.value = false
    ElMessage({
      type: "success",
      message: userParams.id ? "更新成功" : "添加成功"
    })
    // 需要判断是更新还是添加，添加回第一页，更新留在当前页
    await getUserInfo(userParams.id ? pageNo.value : 1)
    // 添加或更新成功后，浏览器自动刷新，针对当用户修改了当前账户信息的情况
    // 使用了windows自带的刷新方法
    window.location.reload()
  } else {
    ElMessage({
      type: "error",
      message: userParams.id ? "更新失败" : "添加失败"
    })
    drawer.value = false
  }
}

// 抽屉内取消按钮回调
const cancel = () => {
  drawer.value = false
}

// 校验用户名的回调函数
const validatorUsername = (rule: any, value: any, callback: any) => {
  // 用户昵称，长度至少5位，value是输入的内容
  if (value.trim().length >= 5) {
    callback()
  } else {
    callback(new Error("用户名不能少于5位"))
  }
}
const validatorName = (rule: any, value: any, callback: any) => {
  // 用户昵称，长度至少5位，value是输入的内容
  if (value.trim().length >= 5) {
    callback()
  } else {
    callback(new Error("昵称不能少于5位"))
  }
}
const validatorPwd = (rule: any, value: any, callback: any) => {
  // 用户昵称，长度至少5位，value是输入的内容
  if (value.trim().length >= 6) {
    callback()
  } else {
    callback(new Error("用户密码不能少于6位"))
  }
}

// 表单校验规则对象
const rules = {
  username: [{validator: validatorUsername, required: true, trigger: 'blur'}],
  name: [{validator: validatorName, required: true, trigger: 'blur'}],
  password: [{validator: validatorPwd, required: true, trigger: 'blur'}],
}

// 分配角色按钮回调
const allocateRole = async (row: UserType) => {
  //存储已有用户的信息
  Object.assign(userParams, row)
  let res: AllRoleResponseData = await reqAllRole(userParams.id)
  if (res.code == 200) {
    allRoles.value = res.data.allRolesList
    //存储当前用户所有职位
    checkedRoles.value = res.data.assignRoles
    drawer2.value = true
  }
  //点击时如果还没分配角色，全选按钮不勾选
  if(checkedRoles.value.length === 0 ){
    isIndeterminate.value = false
  }
}

// 全选按钮回调
const handleCheckAllChange = (val: boolean) => {
  checkedRoles.value = val ? allRoles.value : []
  isIndeterminate.value = false
}
// 注入的value是一个数组，存放了所有勾选的项目如['销售', '前台', '前端']
const handleCheckedRolesChange = (value: string) => {
  const checkedCount = value.length
  checkAll.value = value.length === allRoles.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < allRoles.value.length
}

// 分配角色点击确认按钮
const confirmClick = async ()=>{
  //收集参数
  let data:AssignRoleData = {
    userId: userParams.id,
    roleIdList: checkedRoles.value.map(item=>item.id)
  }
  let res = await reqAssignRoles(data)
  if(res.code === 200){
    ElMessage({
      message:"分配角色成功",
      type:'success'
    })
    drawer2.value = false
    await getUserInfo(pageNo.value)
  }else{
    ElMessage({
      message:"分配角色失败",
      type:"failure"
    })
  }
}

// 删除按钮回调
const confirmDel =async (row:UserType)=>{
  let res = await reqDeleteUser(row.id)
  if(res.code === 200){
    ElMessage({
      type:"success",
      message:"删除成功"
    })
    await getUserInfo(userArr.value.length>1? pageNo.value : pageNo.value - 1)
  }else{
    ElMessage({
      type:"error",
      message:"删除失败"
    })
  }
}

// 表格中复选框勾选时发生的事件
const tableChange = (val:any)=>{
  // 将自动注入的数组赋值给usersToBeDel
  usersToBeDel.value = val
}

// 批量删除按钮回调
const batchDelUser = async ()=>{
  // 整理批量删除的参数
  let idList = usersToBeDel.value.map(item=>item.id)
  let res = await reqBatchRemove(idList)
  if(res.code === 200){
    ElMessage({
      type:"success",
      message:"批量删除成功"
    })
    await getUserInfo(userArr.value.length>1? pageNo.value : pageNo.value - 1)
  }else{
    ElMessage({
      type:"error",
      message:"批量删除失败"
    })
  }
}

// 搜索用户回调
const searchKeyword = async ()=>{
  // 根据关键字获取用户数据
  await getUserInfo()
  // 清空关键字
  // keyword.value = ''
}

// 重置按钮回调
const resetSearch=async()=>{
  // 第一种方式，刷新layout组件
  // settingStore.refresh = !settingStore.refresh
  // 第二种方式，keyword变为空重新请求数据，这个最符合要求，只是重置输入框
  keyword.value = ''
  await getUserInfo()
}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>