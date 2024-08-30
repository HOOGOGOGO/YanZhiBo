

<template>
  <div>
    <div class="header">
      <div class="logo-title">
        <img src="../assets/imgs/logo.jpg" style="width: 130px;height: 80px;position: relative;top: -20px;float: left"></img>
        <span style="position: relative;left: -2px;top: 15px">重置密码</span>
      </div>
      <div class="have-account">无需重置？ <a @click="$router.push('/login')" style="cursor:pointer;">返回登录&gt;</a></div>
    </div>
    <div style="width: 100%;">
      <div style="width: 30%;display: block;margin: auto">
        <div style="margin: 70px 20px">
          <el-steps :active="active" finish-status="success" align-center>
            <el-step title="验证电子邮件"></el-step>
            <el-step title="重新设定密码"></el-step>
          </el-steps>
        </div>
        <!--重置密码第一步-->
        <div style="text-align: center;" v-if="active===0">
          <div style="margin-top: 50px">
            <div style="font-size: 25px">验证电子邮件</div>
            <div style="font-size: 14px;color: grey">请输入需要重置密码的电子邮件</div>
          </div>

          <div style="margin-top: 40px">
            <el-form :model="form" :rules="reset_rules"  ref="resetRef">
              <el-form-item prop="email">
                <el-input class="el-input" v-model="form.email" type="text" placeholder="请输入需要重置密码的邮箱"
                          prefix-icon="el-icon-message"/>
              </el-form-item>
              <el-form-item prop="code">
                <el-row :gutter="10">
                  <el-col :span="18" style="text-align: left">
                    <el-input v-model="form.code" :maxlength="6" class="el-input" type="text" placeholder="请输入邮箱验证码"
                              prefix-icon="el-icon-check"/>
                  </el-col>
                  <el-col :span="5">
                    <el-button @click="sendCode" type="success" plain :disabled="isEmailValid">
                      {{ coldTime > 0 ? '请稍后' + coldTime : '获取验证码' }}
                    </el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item prop="role">
                <el-select v-model="form.role" placeholder="请选择需要重置密码的身份" style="width: 100%">
                  <el-option label="商家" value="SHOP"></el-option>
                  <el-option label="用户" value="USER"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div style="margin-top: 30px">
              <el-button @click="compareCode" style="width: 200px;font-size: 15px" type="danger" plain>开始重置</el-button>
            </div>
          </div>

        </div>
        <!--重置密码第二步-->
        <div style="text-align: center;margin: 0 40px" v-if="active===1">
          <div style="margin-top: 100px">
            <div style="font-size: 25px">重新设定密码</div>
            <div style="font-size: 14px;color: grey">请输入您的新密码，务必牢记，防止丢失</div>
          </div>

          <div style="margin-top: 40px">
            <el-form :model="form" :rules="reset_rules"  ref="resetRef">
              <el-form-item prop="password">
                <el-input class="el-input" v-model="form.password" :maxlength="18" type="password"
                          placeholder="请输入需要重置的密码"
                          prefix-icon="el-icon-lock"/>
              </el-form-item>
              <el-form-item prop="password_repeat">
                <el-input class="el-input" v-model="form.password_repeat" :maxlength="18" type="password"
                          placeholder="请确认密码" prefix-icon="el-icon-lock"/>
              </el-form-item>
            </el-form>

            <div style="margin-top: 30px">
              <el-button @click="modifyPassword" style="width: 200px;font-size: 15px" type="danger" plain>重置密码</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>



</template>

<script >
export default{
  data(){
    const valiatePassword=(rule,value,callback)=>{
      if(value===''){
        callback(new Error('请再次输入密码'))
      }else if(value!=this.form.password){
        callback(new Error('两次密码输入不一致，请重新输入'))
      }else{
        callback()
      }
    }
    return{
      isEmailValid: false,
      coldTime: 0,
      active:0,
      form:{

      },
      reset_rules:{
        password: [
          {required: true, message: '请输入密码', trigger: ['blur', 'change']},
          {min: 6, max: 18, message: '密码长度必须在6-18个字符之间', trigger: ['blur', 'change']}
        ],
        password_repeat: [
          {validator: valiatePassword, trigger: ['blur', 'change']}
        ],
        email: [
          {required: true, message: '请输入邮箱地址', trigger: ['blur', 'change']},
          {type: 'email', message: '请输入合法的邮箱地址', trigger: ['blur', 'change']}
        ],
        code: [
          {required: true, message: '请输入邮箱验证码', trigger: ['blur', 'change']},
          {min: 6, max: 6, message: '验证码必须为6位', trigger: ['blur', 'change']}
        ]
      }
    }
  },methods:{
    sendCode() {
      this.$refs['resetRef'].validateField("email", (valid) => {
        if (!valid) {
          this.isEmailValid = true;
          this.form.emailState=true
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
    compareCode(){
      this.$refs['resetRef'].validate((isValid)=>{
        if(isValid){
          this.$request.post('/compareCode', this.form).then(res => {
            if (res.code === '200') {
              this.active=1
              this.$message.success('验证成功')
            } else {
              this.isEmailValid = false;
              this.coldTime = 0;
              this.$message.error("请输入正确的验证码")
            }
          })
        }else{
          this.$message.warning("请认真核对上述内容")
        }
      })
    },
//修改密码
    modifyPassword(){
      this.$refs['resetRef'].validate((isValid)=>{
        if(isValid){
          this.$request.post('/forgetPassword', this.form).then(res => {
            if (res.code === '200') {
              this.$router.push("/login")
              this.$message.success("修改成功")
            } else {
              this.$message.error("修改失败")
            }
          })
        }else{
          this.$message.warning("请认真核对上述内容")
        }
      })
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
  margin-top: 40px;
  margin-left: 15%;
}
.logo-title .el-image{
  width: 150px;
  height: 50px;
}
.logo-title span{
  width: 96px;
  height: 34px;
  position: relative;
  top: -10px;
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
</style>