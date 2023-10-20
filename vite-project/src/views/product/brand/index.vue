<template>
  <div>
    <el-card class="box-card">
    <!--卡片顶部的添加品牌按钮 -->
      <el-button type="primary" icon="Plus" @click="addBrand">
        添加品牌
      </el-button>
    <!--表格-->
    <!--
      table
      --border 设置表格纵向边框是否显示
      table column
      --label:某一个列表
      --width:列宽度
      --align：对齐方式，left，center，right
    -->
      <el-table style="margin:10px 0"  :data="brandArr">
        <el-table-column fixed prop="date" label="序号" width="80px" align="center" type="index"/>
        <!--table-column默认用div展示数据-->
        <el-table-column prop="tmName" label="品牌名称" align="center" >
              <template #="{row,$index}">
                <pre style="color: #337ecc; font-weight: 700">{{row.tmName}}</pre>
              </template>
        </el-table-column>
        <el-table-column prop="state" label="品牌logo" align="center" >
          <template #="{row,$index}">
            <img style="width: 30px;height: 30px" :src="row.logoUrl.startsWith('http://') ? row.logoUrl : 'http://' + row.logoUrl" alt="nopic">
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" >
          <template #="{row,$index}">
            <el-button type="primary" size="small" icon="Edit" @click="updateBrand(row)">
            </el-button>
            <el-button type="danger" size="small" icon="Delete" @click="deleteBrand"></el-button>
          </template>
        </el-table-column>
        </el-table>
      <!--
        分页器
        pagination:
         v-model:current-page:设置分页器当前页码
         v-model:page-size	每页显示条目个数
         page-sizes	每页显示个数选择器的选项设置
         background	是否为分页按钮添加背景色
         layout	组件布局，子组件名用逗号分隔,可以设置分页器子组件布局调整
         layout中箭头->的作用是把箭头后面的组件顶到右侧显示
        -->
<!--      下方@current-change可以触发自定义事件，也可以直接调用请求，效果一样的-->
      <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="limit"
          :pager-count="5"
          :page-sizes="[3,5,7,9]"
          :background="true"
          layout="prev, pager, next,jumper,->,sizes,total, "
          :total=total

      />
    </el-card>
    <!-- 对话框组件：添加或修改品牌的时候时需要 -->
    <!--
    v-model用于控制对话框显示和隐藏 true显示，false隐藏
    title设置对话框左上角标题
    -->
    <el-dialog v-model="showDialog" :title="BrandInfo.id?'修改品牌':'添加品牌'" @click="">
      <el-form style="width: 80%">
        <el-form-item label="品牌名称" required label-width="90px">
          <el-input placeholder="请输入品牌名称" v-model="BrandInfo.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" required label-width="90px">
          <!--
            请求中action图片上传路径必须要写/api,否则代理服务器无法正常发送
            在upload中，在before-upload中可以约束上传文件的格式或大小
            -->
          <el-upload
              class="avatar-uploader"
              action="/api/admin/product/fileUpload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
          >
            <img v-if="BrandInfo.logoUrl" :src="BrandInfo.logoUrl" class="avatar"/>
            <el-icon v-else class="avatar-uploader-icon">
              <Plus/>
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 使用具名插槽放置取消和确认按钮-->

      <template #footer>
      <span class="dialog-footer">
        <el-button @click="updateBrand">取消</el-button>
        <el-button type="primary" @click="confirmAdd">
          确认
        </el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>


<script setup lang="ts">
import type {UploadProps} from 'element-plus'
import {ElMessage} from "element-plus";
import {onMounted, reactive, ref, watch} from "vue";
import {reqHasBrand,reqAddOrUpdateBrand} from "@/api/product/brand";
import type {Brand, BrandResponseData, Records} from "@/api/product/brand/type.ts";
//当前页码
let pageNo=ref<number>(1)
//每页展示条数
let limit = ref<number>(5)
//存储已有品牌的总数
let total = ref<number>(0)
//存储已有品牌的数据
let brandArr = ref<Records>([])
// 控制对话框显示和隐藏
let showDialog = ref<boolean>(false)
//定义收集新增品牌数据
const BrandInfo = reactive<Brand>({
  tmName: '',
  logoUrl: ''
})
//获取已有品牌的接口，封装为一个函数，任何情况下获取数据都可以调用此函数
const getHasBrand = async (page = 1, lmt = limit.value) => {
  pageNo.value = page
  let res: BrandResponseData = await reqHasBrand(page, lmt);
  if (res.code == 200) {
    total.value = res.data.total;
    brandArr.value = res.data.records;
  }
};
//组件挂载完毕即发送一次请求
onMounted(()=>{
  getHasBrand()
})

// 监控pageNo属性的变化
watch(pageNo, (newPageNo: number, oldPageNo: number) => {
  if (newPageNo !== oldPageNo) {
    getHasBrand(newPageNo, limit.value);
  }
});

// 监控limit属性的变化
//当limit发生变化时，应该让页码跳回第一页
watch(limit, (newLimit: number, oldLimit: number) => {
  if (newLimit !== oldLimit) {
    getHasBrand(1, newLimit); // 当limit发生变化时，将页码跳转到第一页
  }
});
//点击添加品牌按
const addBrand = ()=>{
  showDialog.value=true
  //需要清空id，不然新增也会变成修改，赋0即可
  BrandInfo.id = 0
  //首先清空数据收集表单
  BrandInfo.tmName=''
  BrandInfo.logoUrl=''
}
//修改已有品牌按钮
//row为当前选择的品牌数据
const updateBrand = (row:Brand) => {
  showDialog.value = true
  // //收集品牌的id
  // BrandInfo.id = row.id
  // //在表单里把信息展示出来
  // BrandInfo.tmName = row.tmName
  // BrandInfo.logoUrl = row.logoUrl
  //上述代码用ES6中的语法合并对象，一行就可以搞定了
  //就是把row的数据复制给BrandInfo一份，因为这俩字段一致
  Object.assign(BrandInfo,row)
}
//点击确认按钮的回调
const confirmAdd = async()=>{
  let res:any = await reqAddOrUpdateBrand(BrandInfo)
  //添加成功 || 修改成功
  if(res.code == 200){
    //关闭表单
    showDialog.value=false
    //弹出提示信息
    ElMessage({
      type:'success',
      message:BrandInfo.id?'修改成功':'添加成功'
    })
    //再次发请求获取已有的全部品牌数据
    getHasBrand(BrandInfo.id?pageNo.value:1)
  }else{
    //关闭表单
    showDialog.value=false
    ElMessage({
      type:'error',
      message:BrandInfo.id?'修改失败':'添加失败'
    })
  }
}
//上传图片组件-》上传之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile:any) => {
  if (rawFile.type == 'image/png' || rawFile.type == "image/jpeg" || rawFile.type == "image/gif") {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '图片不能大于4M'
      })
    }
  } else {
    ElMessage({
      type: 'error',
      message: "上传的文件格式只能是jpg | png | gif"
    })
    return false
  }
}
//图片上传成功后的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
  //response为本次上传图片post请求服务器返回的数据
  //收集上传图片的地址，添加品牌时带给服务器
  BrandInfo.logoUrl = response.data
  // imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}
</script>


<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>