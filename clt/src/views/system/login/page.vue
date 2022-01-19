<template>
  <div class="page-login">
    <div class="page-login--layer page-login--layer-area">
      <!-- <ul class="circles">
        <li v-for="n in 10" :key="n"></li>
      </ul> -->
    </div>
    <div
      class="page-login--layer page-login--layer-time"
      flex="main:center cross:center"
    >
      <!-- {{time}} -->
    </div>
    <div class="page-login--layer">
      <div
        class="page-login--content"
        flex="dir:top main:justify cross:stretch box:justify"
      >
        <div class="page-login--content-header">
          <p class="page-login--content-header-motto"></p>
        </div>
        <div
          class="page-login--content-main"
          flex="dir:top main:center cross:center"
        >
          <!-- logo -->
          <h2>电商后台管理系统</h2>
          <!-- form -->
          <div class="page-login--form">
            <el-card shadow="never">
              <el-form
                ref="loginForm"
                label-position="top"
                :rules="rules"
                :model="formLogin"
                size="default"
              >
                <el-form-item prop="username">
                  <el-input
                    type="text"
                    v-model="formLogin.username"
                    placeholder="用户名"
                  >
                    <i slot="prepend" class="fa fa-user-circle-o"></i>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input
                    type="password"
                    v-model="formLogin.password"
                    placeholder="密码"
                  >
                    <i slot="prepend" class="fa fa-keyboard-o"></i>
                  </el-input>
                </el-form-item>
                <el-form-item prop="code">
                  <el-input
                    type="text"
                    v-model="formLogin.code"
                    placeholder="验证码"
                  >
                    <template slot="append" style="padding:0 !important;">
                      <!-- <img class="login-code" src="./image/login-code.png"> -->
                      <div class="coderight" @click="refreshCode">
                        <SIdentify
                          :identifyCode="identifyCode"
                          @click="refreshCode"
                        ></SIdentify>
                      </div>
                    </template>
                  </el-input>
                </el-form-item>
                <el-button
                  size="default"
                  @click="submit"
                  type="primary"
                  class="button-login"
                >
                  登录
                </el-button>
              </el-form>
            </el-card>
            <p class="page-login--options" flex="main:justify cross:center">
              <span @click="passwordDialogVisible = true"
                ><d2-icon name="question-circle" /> 忘记密码</span
              >
              <span @click="dialogVisible = true"
                ><d2-icon name="address-card-o" /> 注册用户</span
              >
            </p>
            <!-- quick login -->
          </div>
        </div>
        <div class="page-login--content-footer"></div>
      </div>
    </div>

    <!-- // 注册 -->
    <el-dialog
      title="注册"
      :visible.sync="dialogVisible"
      width="440px"
      :before-close="addHandleClose"
    >
      <div>
        <el-form
          ref="formReg"
          :rules="regRules"
          :model="formReg"
          label-width="auto"
        >
          <el-form-item label="账号" prop="username" style="width: 370px">
            <el-input
              v-model="formReg.username"
              maxlength="10"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" style="width: 370px">
            <el-input
              type="password"
              v-model="formReg.password"
              maxlength="20"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item
            label="再次输入密码"
            prop="passwordAgain"
            style="width: 370px"
          >
            <el-input
              type="password"
              v-model="formReg.passwordAgain"
              maxlength="20"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="name" style="width: 370px">
            <el-input
              v-model="formReg.name"
              maxlength="10"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="注册码" prop="regCode" style="width: 370px">
            <el-input v-model="formReg.regCode" show-word-limit></el-input>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="RegResetFields">重 置</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUser">注 册</el-button>
      </span>
    </el-dialog>

    <!-- // 忘记密码 -->
    <el-dialog
      title="忘记密码"
      :visible.sync="passwordDialogVisible"
      width="440px"
      :before-close="PasswordHandleClose"
    >
      <div>
        <el-form
          ref="formPassword"
          :rules="PasswordRules"
          :model="formPassword"
          label-width="auto"
        >
          <el-form-item label="账号" prop="username" style="width: 370px">
            <el-input
              v-model="formPassword.username"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="旧密码" prop="password" style="width: 370px">
            <el-input
               type="password"
              v-model="formPassword.password"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword" style="width: 370px">
            <el-input
              type="password"
              v-model="formPassword.newPassword"
              maxlength="20"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item
            label="再次输入新密码"
            prop="newPasswordAgain"
            style="width: 370px"
          >
            <el-input
              v-model="formPassword.newPasswordAgain"
              maxlength="20"
              show-word-limit
              type="password"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="passwordDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitPassword">修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapActions } from 'vuex'
import localeMixin from '@/locales/mixin.js'
import axios from 'axios'
import service from '@/api/service.js'
import Axios from 'axios'
import SIdentify from '@/components/identify.vue'

export default {
  mixins: [localeMixin],
  components: {
    SIdentify: SIdentify
  },
  data () {
    return {
      timeInterval: null,
      username: '',
      identifyCode: '',
      identifyCodes: '1234567890',
      time: dayjs().format('HH:mm:ss'),
      // 快速选择用户
      dialogVisible: false,
      passwordDialogVisible: false,
      // 表单
      formLogin: {
        username: '',
        password: '',
        code: ''
      },
      formReg: {
        username: '',
        password: '',
        passwordAgain: '',
        name: '',
        regCode: ''
      },
      formPassword: {
        username: '',
        password: '',
        newPassword: '',
        newPasswordAgain: ''
      },
      // 表单校验
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          }
        ]
      },
      regRules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        regCode: [{ required: true, message: '请输入注册码', trigger: 'blur' }],
        passwordAgain: [
          { required: true, message: '请再次输入密码', trigger: 'blur' }
        ]
      },
      PasswordRules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        newPasswordAgain: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.timeInterval = setInterval(() => {
      this.refreshTime()
    }, 1000)
    this.identifyCode = ''
    this.makeCode(this.identifyCodes, 4)
  },
  beforeDestroy () {
    clearInterval(this.timeInterval)
  },
  methods: {
    ...mapActions('d2admin/account', ['login']),
    refreshTime () {
      this.time = dayjs().format('HH:mm:ss')
    },
    /**
     * @description 接收选择一个用户快速登录的事件
     * @param {Object} user 用户信息
     */
    /**
     * @description 提交表单
     */
    // 提交登录信息

    submit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          if(this.identifyCode !== this.formLogin.code) {
            this.refreshCode()
            this.formLogin.code = ""
            return this.$message.error("验证码有误！") 
          }
          // 登录
          // 注意 这里的演示没有传验证码
          // 具体需要传递的数据请自行修改代码
          this.login({
            username: this.formLogin.username,
            password: this.formLogin.password
          }).then((res) => {
            // 重定向对象不存在则返回顶层路径
            console.log('res', res)
            if (res) {
              this.$message.success('登陆成功')

              this.$router.replace(this.$route.query.redirect || '/')
            } else {
              this.$message.error('账号或密码错误')
            }
            // console.log('登陆成功 in page');
          })
        } else {
          // 登录表单校验失败
          this.$message.error('请输入账号或密码')
        }
      })
    },
    submitUser () {
      // dayjs().format('YYYY-MM-DD dddd HH:mm:ss.SSS A')
      this.$refs.formReg.validate(async (res, wtf) => {
        if (res) {
          if (this.formReg.password != this.formReg.passwordAgain) { return this.$message.error('二次密码有误') }
          const regTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
          const postData = {
            username: this.formReg.username,
            password: this.formReg.password,
            name: this.formReg.name,
            _regCode: this.formReg.regCode,
            regTime: regTime,
            status: '已使用',
            user: this.formReg.username,
            uuid: ''
          }
          await Axios.post('http://localhost:3000/api/checkregCode', postData)
            .then(async (res) => {
              if (!res.data.data) {
                return this.$message.error('注册码不存在')
              }
              if (res.data.data.status == '已使用') {
                return this.$message.error('该注册码已被使用！')
              } else {
                const reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
                if (reg.test(this.formReg.username)) { return this.$message.error('账号不能包含汉字！') }
                postData.uuid = res.data.data.uuid
                await Axios.post('http://localhost:3000/api/addUser', postData)
                  .then(async (res) => {
                    if (!res.data.success) {
                      this.$message.error('该账号已经被使用！')
                    } else {
                      await Axios.post(
                        'http://localhost:3000/api/updateregCode',
                        postData
                      )
                        .then((res) => {
                          console.log('updateregCode', res)
                          this.$message.success('注册成功！')
                        })
                        .catch((e) => {
                          this.$message.warning('操作失败', e)
                        })

                      this.dialogVisible = false
                      this.$refs.formReg.resetFields() // 重置表单
                    }
                  })
                  .catch((e) => {
                    this.$message.warning('操作失败', e)
                  })
              }
            })
            .catch((e) => {
              this.$message.warning('操作失败', e)
            })

          //

          //   this.fileList = []
        } else {
          // console.log("error submit!!");
          // return false;
        }
      })
    },
    submitPassword () {
      this.$refs.formPassword.validate(async (valid) => {
        if (valid) {
          if (
            this.formPassword.newPassword != this.formPassword.newPasswordAgain
          ) { return this.$message.error('二次密码有误') }
          const postData = {
            username: this.formPassword.username,
            password: this.formPassword.password,
            newPassword: this.formPassword.newPassword
          }
          console.log('postData', postData)

          //     const res = await this.$api.post('/build/add', postData)
          await Axios.post(
            'http://localhost:3000/api/updateUserPassword',
            postData
          )
            .then((res) => {
              if (!res.data.success) {
                this.$message.error('修改失败！' + res.data.info)
              } else {
                this.$message.success('修改成功！')
                this.$refs.formPassword.resetFields() // 重置表单
                this.passwordDialogVisible = false
              }
            })
            .catch((e) => {
              this.$message.warning('操作失败', e)
            })
          //     const { success } = res.data
          //     if (!success) return this.$message.warning('操作失败')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addHandleClose (done) {
      // 在关闭之前 清空表单
      this.$refs.formReg.resetFields() // 重置表单
      done()
    },
    PasswordHandleClose (done) {
      // 在关闭之前 清空表单
      this.$refs.formPassword.resetFields() // 重置表单
      done()
    },
    RegResetFields () {
      this.$refs.formReg.resetFields()
    },

    // 验证码

    ...mapActions('modules/account', ['settoken', 'setname']),
    jumpregister: function () {
      this.$router.push({ path: '/register' })
    },
    // 验证码
    randomNum (min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    refreshCode () {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    makeCode (o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode +=
          this.identifyCodes[this.randomNum(0, this.identifyCodes.length)]
      }
      console.log('identifyCode',this.identifyCode)
    }
  }
}
</script>

<style lang="scss">
.page-login {
  @extend %unable-select;
  $backgroundColor: #f0f2f5;
  // ---
  background-color: $backgroundColor;
  height: 100%;
  position: relative;
  // 层
  .page-login--layer {
    @extend %full;
    overflow: auto;
  }
  .page-login--layer-area {
    overflow: hidden;
  }
  // 时间
  .page-login--layer-time {
    font-size: 24em;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.03);
    overflow: hidden;
  }
  // 登陆页面控件的容器
  .page-login--content {
    height: 100%;
    min-height: 500px;
  }
  // header
  .page-login--content-header {
    padding: 1em 0;
    .page-login--content-header-motto {
      margin: 0px;
      padding: 0px;
      color: $color-text-normal;
      text-align: center;
      font-size: 12px;
    }
  }
  // main
  .page-login--logo {
    width: 600px;
    // margin-bottom: 2em;
    margin-top: -2em;
  }
  // 登录表单
  .page-login--form {
    width: 350px;
    // 卡片
    .el-card {
      margin-bottom: 15px;
      box-shadow: 0 4px 4px 4px rgba(0, 0, 0, 0.03);
    }
    // 登录按钮
    .button-login {
      width: 100%;
      box-shadow: 0 2px 2px 2px rgba(0, 0, 0, 0.03);
    }
    // 输入框左边的图表区域缩窄
    .el-input-group__prepend {
      padding: 0px 14px;
    }
    .el-input-group__append{
      padding: 0 !important;
    }
    .login-code {
      height: 40px - 2px;
      display: block;
      margin: 0px -20px;
      border-top-right-radius: 2px;
      border-bottom-right-radius: 2px;
    }
    // 登陆选项
    .page-login--options {
      margin: 0px;
      padding: 0px;
      font-size: 14px;
      color: $color-primary;
      margin-bottom: 15px;
      font-weight: bold;
    }
    .page-login--quick {
      width: 100%;
    }
  }
  // 快速选择用户面板
  .page-login--quick-user {
    @extend %flex-center-col;
    padding: 10px 0px;
    border-radius: 4px;
    &:hover {
      background-color: $color-bg;
      i {
        color: $color-text-normal;
      }
      span {
        color: $color-text-normal;
      }
    }
    i {
      font-size: 36px;
      color: $color-text-sub;
    }
    span {
      font-size: 12px;
      margin-top: 10px;
      color: $color-text-sub;
    }
  }
  // footer
  .page-login--content-footer {
    padding: 1em 0;
    .page-login--content-footer-locales {
      padding: 0px;
      margin: 0px;
      margin-bottom: 15px;
      font-size: 12px;
      line-height: 12px;
      text-align: center;
      color: $color-text-normal;
      a {
        color: $color-text-normal;
        margin: 0 0.5em;
        &:hover {
          color: $color-text-main;
        }
      }
    }
    .page-login--content-footer-copyright {
      padding: 0px;
      margin: 0px;
      margin-bottom: 10px;
      font-size: 12px;
      line-height: 12px;
      text-align: center;
      color: $color-text-normal;
      a {
        color: $color-text-normal;
      }
    }
    .page-login--content-footer-options {
      padding: 0px;
      margin: 0px;
      font-size: 12px;
      line-height: 12px;
      text-align: center;
      a {
        color: $color-text-normal;
        margin: 0 1em;
      }
    }
  }

  .coderight {
    // margin: 400px auto;
    width: 112px;
    height: 38px;
    padding: 0px !important;
  }
  // 背景
  // .circles {
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   width: 100%;
  //   height: 100%;
  //   overflow: hidden;
  //   margin: 0px;
  //   padding: 0px;
  //   li {
  //     position: absolute;
  //     display: block;
  //     list-style: none;
  //     width: 20px;
  //     height: 20px;
  //     background: #FFF;
  //     animation: animate 25s linear infinite;
  //     bottom: -200px;
  //     @keyframes animate {
  //       0%{
  //         transform: translateY(0) rotate(0deg);
  //         opacity: 1;
  //         border-radius: 0;
  //       }
  //       100%{
  //         transform: translateY(-1000px) rotate(720deg);
  //         opacity: 0;
  //         border-radius: 50%;
  //       }
  //     }
  //     &:nth-child(1) {
  //       left: 15%;
  //       width: 80px;
  //       height: 80px;
  //       animation-delay: 0s;
  //     }
  //     &:nth-child(2) {
  //       left: 5%;
  //       width: 20px;
  //       height: 20px;
  //       animation-delay: 2s;
  //       animation-duration: 12s;
  //     }
  //     &:nth-child(3) {
  //       left: 70%;
  //       width: 20px;
  //       height: 20px;
  //       animation-delay: 4s;
  //     }
  //     &:nth-child(4) {
  //       left: 40%;
  //       width: 60px;
  //       height: 60px;
  //       animation-delay: 0s;
  //       animation-duration: 18s;
  //     }
  //     &:nth-child(5) {
  //       left: 65%;
  //       width: 20px;
  //       height: 20px;
  //       animation-delay: 0s;
  //     }
  //     &:nth-child(6) {
  //       left: 75%;
  //       width: 150px;
  //       height: 150px;
  //       animation-delay: 3s;
  //     }
  //     &:nth-child(7) {
  //       left: 35%;
  //       width: 200px;
  //       height: 200px;
  //       animation-delay: 7s;
  //     }
  //     &:nth-child(8) {
  //       left: 50%;
  //       width: 25px;
  //       height: 25px;
  //       animation-delay: 15s;
  //       animation-duration: 45s;
  //     }
  //     &:nth-child(9) {
  //       left: 20%;
  //       width: 15px;
  //       height: 15px;
  //       animation-delay: 2s;
  //       animation-duration: 35s;
  //     }
  //     &:nth-child(10) {
  //       left: 85%;
  //       width: 150px;
  //       height: 150px;
  //       animation-delay: 0s;
  //       animation-duration: 11s;
  //     }
  //   }
  // }
}
</style>
