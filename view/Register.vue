<template xmlns="http://www.w3.org/1999/html">
  <div style="text-align: center;width: 100%;height: 100vh">
    <div class="header">
        <div class="logo-title">
          <el-image style="cursor: pointer;" @click="$router.push('/user')" :src="require('@/assets/imgs/logo.jpg')"></el-image>
          <span>欢迎注册</span>
        </div>
        <div class="have-account">已有账号？ <a @click="$router.push('/login')" style="cursor:pointer;">请登录&gt;</a></div>
    </div>


<!--表单-->
    <div style="margin-top: 40px" class="form-style">
      <div class="form-two">
        <div style="padding-bottom: 25px" class="tips">
          <div style="font-size: 25px">用户注册页面</div>
          <div style="font-size: 14px;color: grey">欢迎使用婴幼用品平台！请在下方填写相关信息</div>
        </div>
        <div>
          <el-form :model="form"   ref="registerRef" :rules="register_rules">
            <el-form-item prop="username">
              <el-input   class="el-input" v-model="form.username" :maxlength="8" type="text" placeholder="请输入用户名" prefix-icon="el-icon-user"/>
            </el-form-item>
            <el-form-item prop="password">
              <el-input show-password class="el-input" v-model="form.password" :maxlength="18" type="password" placeholder="请输入密码" prefix-icon="el-icon-lock"/>
            </el-form-item>
            <el-form-item prop="password_repeat">
              <el-input show-password class="el-input" v-model="form.password_repeat" :maxlength="18" type="password" placeholder="请确认密码"  prefix-icon="el-icon-lock"/>
            </el-form-item>
            <el-form-item prop="email">
              <el-input class="el-input" v-model="form.email" type="text" placeholder="请输入邮箱" prefix-icon="el-icon-message"/>
            </el-form-item>
            <el-form-item prop="code">
              <el-row :gutter="10">
                <el-col :span="18" style="text-align: left">
                  <el-input v-model="form.code" :maxlength="6" class="el-input numrule" type="number" placeholder="请输入邮箱验证码" prefix-icon="el-icon-edit"/>
                </el-col>
                <el-col :span="5" >
                  <el-button @click="sendCode" type="success" plain :disabled="isEmailValid">
                    {{ coldTime > 0 ? '请稍后' + coldTime : '获取验证码' }}
                  </el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item prop="phone">
              <el-input  class="el-input numrule" v-model="form.phone" type="number" placeholder="请输入电话" prefix-icon="el-icon-phone" :maxlength="11"/>
            </el-form-item>
            <el-form-item prop="role">
              <el-select v-model="form.role" placeholder="请选择角色" style="width: 100%">
                <el-option label="商家" value="SHOP"></el-option>
                <el-option label="用户" value="USER"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <!--      按钮块-->
              <el-button @click="register" style="width: 200px;font-size: 15px" type="success" plain>立即注册</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>


    </div>



  </div>
</template>


<script>
export default {

  data(){
    const validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else if (!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(value)) {
        callback(new Error('用户名不能包含特殊字符，只能是中/英文'))
      } else {
        callback()
      }
    }
    const valiatePassword=(rule,value,callback)=>{
      if(value===''){
        callback(new Error('请再次输入密码'))
      }else if(value!=this.form.password){
        callback(new Error('两次密码输入不一致，请重新输入'))
      }else{
        callback()
      }
    }
    const onValidate = (prop, isValid) => {
      if (prop === 'email')
        this.isEmailValid = isValid
    }
    return{
      isEmailValid: false,
      coldTime: 0,
      form:{
        email:'',
        username:'',
        password:'',
        password_repeat:'',
        code:'',
        phone:'',
        role:''

      },
      // 定义检验规则
      register_rules: {
        username: [
          {validator: validateUsername, trigger: ['blur', 'change']},
          {min: 2, max: 8, message: '用户名长度必须在2-8个字符之间', trigger: ['blur', 'change']},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: ['blur', 'change']},
          {min: 6, max: 18, message: '密码长度必须在6-18个字符之间', trigger: ['blur', 'change']}
        ],
        password_repeat:[
          {validator:valiatePassword,trigger:['blur','change']}
        ],
        email: [
          {required: true, message: '请输入邮箱地址', trigger: ['blur', 'change']},
          {type: 'email', message: '请输入合法的邮箱地址', trigger: ['blur', 'change']}
        ],
        code: [
          {required: true, message: '请输入邮箱验证码', trigger: ['blur', 'change']},
          {min: 6, max: 6, message: '验证码必须为6位', trigger: ['blur', 'change']}
        ],
        role: [{ required: true, message: '请选择角色', trigger: 'blur' },],
        phone:[
          {required:true,message:'请输入电话',trigger:['blur','change']},
          {min:11,max:11,message:'电话号码有误',trigger:['blur','change']}
        ]
      }
    }
  },methods:{
    sendCode() {
      this.$refs['registerRef'].validateField("email", (valid) => {
        if (!valid) {
          this.isEmailValid = true;
          this.form.emailState=false

          this.$request.post('/sendCode', this.form).then(res => {
            if (res.code === '200') {
              this.coldTime = 60;
              setInterval(() => this.coldTime--, 1000)
              this.$message.success('发送成功')
            } else {
              this.isEmailValid = false;
              this.coldTime = 0;
              this.$message.error(res.message)
            }
          })
        } else {
          this.$message.warning("请检查邮箱")
        }
      })
    },
    //注册
    register() {
      this.$refs['registerRef'].validate((valid) => {
        if (valid) {
          // 验证通过
          this.$request.post('/register', this.form).then(res => {
            if (res.code === '200') {
              this.$router.push('/login')  // 跳转登录页面
              this.$message.success('注册成功')
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    }
  },watch:{
    'coldTime'(newVal){
      if(newVal==0){
        this.isEmailValid=false
      }
    }
  }
}
</script>

<style scoped>
.header{
  height: 110px;
  //background-color: lightgoldenrodyellow;
  background: url(https://storage.jd.com/retail-mall/jdc_user_reg/pc/user/reg/4.0.5/css/i/headbg.jpg) repeat-x left bottom;
}
.header .logo-title {
  float: left;
  //line-height: 34px;
  font-size: 24px;
  color: #333;
  //margin-top: 40px;
  margin-left: 15%;
}
.logo-title .el-image{
  width: 110px;
  height: 100px;
}
.logo-title span{
  width: 96px;
  height: 34px;
  position: relative;
  top: -30px;
  left: 20px;
}
.header .have-account {
  font-size: 16px;
  float: right;
  margin-top: 70px;
  margin-right: 10%;
  color: #999;
}
.header .have-account a {
  color: #e22;
}

.form-style{
  width: 100%;
  position: relative;
}
.form-two{
  display: block;
  margin: auto;
  width: 25%;
  justify-content: center;
}

:deep(.numrule input::-webkit-outer-spin-button),
:deep(.numrule input::-webkit-inner-spin-button) {

  -webkit-appearance: none !important;
}

:deep(.numrule input[type="number"]) {
  -moz-appearance: textfield;
}
</style>