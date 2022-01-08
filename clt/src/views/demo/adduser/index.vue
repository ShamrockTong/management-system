<template>
<d2-container>
  <el-form :model="userForm" :rules="rules" ref="userForm" label-width="80px" class="demo-userForm">
  <el-form-item label="账号" prop="username" style="width:500px"> 
    <el-input v-model="userForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password" style="width:500px"> 
    <el-input v-model="userForm.password"></el-input>
  </el-form-item>
  <el-form-item label="用户名" prop="name" style="width:500px"> 
    <el-input v-model="userForm.name"></el-input>
  </el-form-item>
  <el-form-item label="权限定位" prop="uuid" style="width:500px"> 
     <el-select v-model="userForm.uuid" placeholder="请选择">
       <el-option
      v-for="item in uuidOptions"
      :key="item.value"
      :label="item.name"
      :value="item.value">
    </el-option>
  </el-select>
  </el-form-item>
    <el-button type="primary" @click="submitUser('userForm')">添加</el-button>
    <el-button @click="resetForm('userForm')">重置</el-button>
</el-form>
</d2-container>
</template>
<script>
import Axios from 'axios'
import dayjs, { Dayjs } from 'dayjs'
import log from '@/libs/util.log';
export default {
   name: 'adduser',
    data() {
      return {
        userForm: {
          username: '',
          password: '',
          name: '',
          uuid:''
        },
        uuidOptions:[
          {
            value:'admin-uuid',
            name:'管理员'
          },
          {
            value:'editor-uuid',
            name:'编辑'
          },
          {
            value:'user1-uuid',
            name:'用户'
          }
        ],
        rules: {
          username: [
            { required: true, message: '请输入账号', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请选择密码', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请选择用户名', trigger: 'blur' }
          ],
          uuid: [
            { required: true, message: '请选择用户名', trigger: 'blur' }
          ],
        }
      };
    },
    methods: {
      submitUser() {
        // dayjs().format('YYYY-MM-DD dddd HH:mm:ss.SSS A')
       this.$refs.userForm.validate(async (res, wtf) => {
        if (res) {
      //     // 才去执行提交
          console.log(this.userForm)
          const regTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
          const postData = {
            username: this.userForm.username,
            password: this.userForm.password,
            name: this.userForm.name,
            uuid:this.userForm.uuid,
            regTime:regTime,
          }
          console.log('postData', postData)
        await Axios.post(`http://localhost:3000/api/addUser`,postData).then(res=>{
          if(!res.data.success){
            this.$message.error('该账号已经被使用！')
          }else{
            this.$message.success('添加成功！')
            this.$refs.userForm.resetFields() // 重置表单
          }
            }).catch(e=>{
              this.$message.warning('操作失败',e)
            })
        //   this.fileList = []
        }else {
            console.log('error submit!!');
            return false;
          }
      })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
}
</script>

<style scoped>

</style>