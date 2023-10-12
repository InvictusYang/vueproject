<script setup lang="ts">
import {User, Lock} from '@element-plus/icons-vue'
import {reactive, ref} from 'vue'
import useUserStore from '@/store/modules/user.ts'
import {useRouter,useRoute} from "vue-router"
import {ElNotification} from "element-plus";
//获取小仓库对象
let userStore = useUserStore()
//获取el-form组件
let loginForms = ref()
let bagayalo = ref()
//获取路由器
let $router = useRouter()
//获取路由对象
let $route = useRoute()
//定义变量控制按钮加载效果
let loading = ref(false)
//收集账号和密码数据
let loginForm = reactive({username: 'admin', password: 'atguigu123'})
//引入时间函数
import {getTime} from "@/utils/time.ts";
import {call} from "axios";
//登录按钮回调
const login = async () => {
  //全部表单项全部通过验证再发请求
  await loginForms.value.validate()
  //加载效果
  loading.value = true
  //点击登录按钮以后：
  //1. 通知仓库发送登录请求
  //2. 请求成功，跳转首页
  //3. 请求失败->弹出登录失败提示
  //登录判定可以用.then或者try{}catch(e){}
  try {
    //登录成功逻辑
    await userStore.userLogin(loginForm);
    //编程式导航跳转到home页
    //判断登录时是否有query参数，如果有按照query参数跳转，没有则跳home页
    let redirect:any = $route.query.redirect
    await $router.push({path: redirect || '/'})
    //登录成功提示信息
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `${getTime()}`
    })
    //登陆成功，加载效果消失
    loading.value = false
  } catch (e) {
    //登陆失败加载效果
    loading.value = false
    //失败弹出失败信息
    ElNotification({
      type: 'error',
      message: (e as Error).message
    })
  }
}
//自定义校验规则函数
const validateUserName=(rule:any,value:any,callback:any)=>{
  //rule为校验规则
  //表单元素的文本内容
  //函数：如果符合条件，callBack放行通过
  //如果不符合，callBack方法注入错误提示信息
  // if(/^\d{5,10}$/.test(value)){ //正则方式
  if(value.length >=5){
    callback()
  }else{
    callback(new Error("账号长度至少为5"))
  }
}
const validatePassword = (rule:any,value:any,callback:any)=>{
  if(value.length >=6){
    callback()
  }else{
    callback(new Error("密码长度至少为6"))
  }
}
//定义表单校验需要配置对象
const rules = {
  username: [
      //必填，最少5位，最多10位，报错信息：‘账号长度5-10位’，触发条件是文本改变，blur是失去焦点
    // {required: true, min: 5, max: 10, message: '账号长度5-10位', trigger:'change'}
      //自定义校验规则
    {trigger:'change',validator:validateUserName}
  ],
  password: [
    // {required:true, min:6, max:15, message:'密码长度6-15位',trigger:'change'}
    {trigger:'change',validator:validatePassword}
  ]
}
</script>

<template>
  <div class="login_container">
    <el-row ref="bagayalo">
      <!--    占位列，用来占左半边-->
      <el-col :span=12 :xs="0"></el-col>
      <!--    右半边，:xs表示当屏幕尺寸小于768时，左侧消失 ，右侧占有全部-->
      <el-col :span=12 :xs="24">
        <el-form class="login-form" :model="loginForm" :rules="rules" ref="loginForms">
          <h1>Hello</h1>
          <h2>欢迎来到admin</h2>
          <el-form-item prop="username">
            <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" :prefix-icon="Lock" v-model="loginForm.password" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" class="login_btn" type="primary" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url("@/assets/images/background.jpg") no-repeat;
  background-size: cover;
}

.login-form {
  position: relative;
  width: 80%;
  top: 30vh;
  background: url("@/assets/images/login_form.png") no-repeat;
  background-size: cover;
  padding: 40px;

  h1 {
    color: white;
    font-size: 40px;
  }

  h2 {
    color: white;
    font-size: 20px;
    margin: 20px 0;
  }

  .login_btn {
    width: 100%;
  }
}
</style>