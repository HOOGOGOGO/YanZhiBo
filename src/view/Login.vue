<template>
  <div>
    <div class="header">
      <div >
        <div id="logo" >
          <img @click="$router.push('/user/home')" src="../assets/imgs/logo.jpg" alt="lucky baby" width="140" height="100"
               style="cursor: pointer">
          <img src="https://storage.jd.com/retail-mall/jdc_user_passport/pc/user/passport/1.0.16/css/i/l-icon.png"
               style="" alt="欢迎登录" width="110" height="40">
        </div>

        <div class="message">
          <p style="margin-top: 5px"><i class="iconfont icon-tips" style="position:relative;left: -4px;top: 1px"></i>依据《网络安全法》，为保障您的账户安全和正常使用，请尽快完成手机号验证！
            新版<a href="https://about.jd.com/privacy/" class="black" target="_blank"
                   style="text-decoration: none;color: #666;">《Lucky Baby隐私政策》</a>已上线，将更有利于保护您的个人隐私。</p>
        </div>
      </div>


      <div class="advice">
        <a href=""><i class="iconfont icon-xinxi" style="font-size: 20px;position:relative;left: -3px;top: 2px"></i>登录页面，改进建议</a>
      </div>

    </div>
    <div class="main">
      <div  class="back" style="position: relative;top: 75px;left: 300px">
<!--        <img src="@/assets/imgs/login-content.png" width="350px" height="350px" style="border-radius: 10%"/>-->
      </div>

      <div id="login">
        <div class="logintop">
          <p><i class="iconfont icon-tips" style="position:relative; left: -3px;top: 1px"></i>Lucky Baby不会以任何理由要求您转账，谨防诈骗
          </p>
        </div>

        <span ref="login1" :style="style1" @click="switchForm1">邮箱登录</span>
        <span ref="login2" :style="style2" @click="switchForm2">密码登录</span>
        <div v-if="active===0" style="z-index: 20">
          <el-form class="demo-ruleForm" :rules="login_rules" :model="formData" ref="loginRef">
            <el-form-item prop="email">
              <el-input type="text" placeholder="请输入邮箱"
                        v-model="formData.email" ref="email" prefix-icon="el-icon-message"/>
            </el-form-item>
            <el-form-item prop="code">
              <el-row :gutter="10">
                <el-col :span="15">
                  <el-input v-model="formData.code" :maxlength="6" class="el-input numrule" type="number"
                            placeholder="请输入验证码" prefix-icon="el-icon-edit"/>
                </el-col>
                <el-col :span="3">
                  <el-button @click="sendCode" type="success" plain :disabled="isEmailValid">
                    {{ coldTime > 0 ? '请稍后' + coldTime : '获取验证码' }}
                  </el-button>
                </el-col>

              </el-row>
            </el-form-item>
            <el-form-item prop="role">
              <el-select v-model="formData.role" placeholder="请选择角色" style="width: 100%">
                <el-option label="管理员" value="ADMIN"></el-option>
                <el-option label="商家" value="SHOP"></el-option>
                <el-option label="用户" value="USER"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-button style="width: 268px;height: 36px;font-size: 14px ; position: relative;top: 30px;left: 15px"
                     type="danger"  @click="login">登录
          </el-button>
        </div>

        <div v-if="active===1" style="z-index: 20">
          <el-form class="demo-ruleForm" :rules="login_rules" :model="formData" ref="loginRef">
            <el-form-item prop="username">
              <el-input type="text" placeholder="请输入用户名"
                        v-model="formData.username" prefix-icon="el-icon-user"/>
            </el-form-item>
            <el-form-item prop="password">
              <el-input show-password type="password" placeholder="请输入密码"
                        v-model="formData.password"  prefix-icon="el-icon-lock"/>
            </el-form-item>
            <el-form-item prop="role">
              <el-select v-model="formData.role" placeholder="请选择角色" style="width: 100%">
                <el-option label="管理员" value="ADMIN"></el-option>
                <el-option label="商家" value="SHOP"></el-option>
                <el-option label="用户" value="USER"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-link @click="$router.push('/forget')" :underline="false"
                       style="margin-top: -8px;margin-bottom: -10px; float: right">忘记密码
              </el-link>
            </el-form-item>
          </el-form>
          <el-button style="width: 268px;height: 36px;font-size: 14px ; position: relative;top: 30px;left: 15px"
                     type="danger" @click="login">登录
          </el-button>
        </div>
        <div class="loginfoot">
          <el-link @click="$router.push('/register')"
                   :underline="false">立即注册
          </el-link>
        </div>
      </div>

    </div>


    <div class="footer">
      <div class="links" style="margin-top: 15px;">
        <a rel="nofollow" href="">
          关于我们
        </a>
        |
        <a rel="nofollow" href="">
          联系我们
        </a>
        |
        <a rel="nofollow" href="">
          人才招聘
        </a>
        |
        <a rel="nofollow" href="">
          商家入驻
        </a>
        |
        <a rel="nofollow" href="">
          广告服务
        </a>
        |
        <a rel="nofollow" href="">
          手机婴幼
        </a>
        |
        <a href="">
          友情链接
        </a>
        |
        <a href="">
          销售联盟
        </a>
        |
        <a href="">
          婴幼社区
        </a>
        |
        <a href="">
          婴幼公益
        </a>
      </div>
      <div class="copyright" style="margin-top: 5px">
        Copyright&nbsp;©&nbsp;2004-2024&nbsp;&nbsp;Lucky Baby LBaby.com&nbsp;版权所有
      </div>
    </div>

  </div>

</template>


<script>


export default {
name:'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else if (!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(value)) {
        callback(new Error('用户名不能包含特殊字符，只能是中/英文'))
      } else {
        callback()
      }
    }
    const onValidate = (prop, isValid) => {
      if (prop === 'email')
        this.isEmailValid = isValid
    }


    return {

      active: 0,
      isEmailValid: false,
      coldTime: 0,
      style1: "cursor:pointer;font-weight: 600;position: relative;top: 20px;left: 20px;color: #FA2C19;",
      style2: "cursor:pointer;font-weight: 600;position: relative; top: 20px;left: 30px;color: #666666;",
      formData: {
        username: '',
        password: '',
        email: '',
        code: '',
        role:''
      },
// 定义检验规则
      login_rules: {
        username: [
          {validator: validateUsername, trigger: ['blur', 'change']},
          {min: 2, max: 8, message: '用户名长度必须在2-8个字符之间', trigger: ['blur', 'change']},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: ['blur', 'change']},
          {min: 6, max: 18, message: '密码长度必须在6-18个字符之间', trigger: ['blur', 'change']}
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
      }
    }
  }, created() {
  }, methods: {
    switchForm2() {
      this.style2 = "cursor:pointer;font-weight: 600;position: relative;top: 20px;left: 30px;color: #FA2C19;";
      this.style1 = "cursor:pointer;font-weight: 600;position: relative;top: 20px;left: 20px;color: #666666;";
      this.active = 1;
      this.$refs['loginRef'].resetFields();
    },
    switchForm1() {
      this.style1 = "cursor:pointer;font-weight: 600;position: relative;top: 20px;left: 20px;color: #FA2C19;";
      this.style2 = "cursor:pointer;font-weight: 600;position: relative;top: 20px;left: 30px;color: #666666;";
      this.active = 0;
      this.$refs['loginRef'].resetFields();
    },
    // 发送验证码
    sendCode() {
      this.$refs['loginRef'].validateField("email", (valid) => {
        if (!valid) {
          this.isEmailValid = true;
          this.formData.emailState=true
          this.$request.post('/sendCode', this.formData).then(res => {
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
    login(){
      this.$refs['loginRef'].validate((valid)=>{
        if(valid){
          this.$request.post('/login', this.formData).then(res => {
            if (res.code === '200') {
              let user = res.data
              localStorage.setItem("bbshop-user", JSON.stringify(user))  // 存储用户数据
              if (user.role === 'USER') {
                location.href = '/user/home'
              } else {
                location.href = '/manager/home'
              }
              this.$message.success('登录成功')
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

<style lang="css" scoped>
@import 'https://at.alicdn.com/t/c/font_4434801_v9j0bihvjai.css';

a, .copyright {
  text-decoration: none;
  font: 12px/150% Arial, Verdana, "\5b8b\4f53";
  color: #666;
}

.header {
  width: 100%;
  height: 15vh;
}

.footer {
  text-align: center;
  text-decoration: none;
  width: 100%;
  height: 20.5vh;
  //margin-left: -20%;

}

.main {
  width: 100%;
  height: 64.5vh;
  //background-color: rgba(132, 148, 245, 0.36);
  background: url("../assets/imgs/bg.jpg") no-repeat ;
  background-size: 100%;

}

#logo {
  margin-left: 200px;
  float: left;
}

.message {
  width: 100%;
  height: 30px;
  background: #fff8f0;
  vertical-align: middle;
  color: #999;
  font-size: 12px;
  display: inline-block;
  text-align: center;

}

.advice a {
  display: block;
  position: relative;
  top: -70px;
  left: 74%;
}

#login {
  background: white;
  width: 300px;
  height: 330px;
  position: relative;
  top: 8vh;
  left: 64%;
  border-radius: 8px;
}

.demo-ruleForm {
  display: block;
  float: left;
  position: absolute;
  top: 40px;

}

.logintop {
  line-height: 46px;
  background-color: #fff8f0;;
  width: 300px;
  height: 28px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.logintop p {
  font-family: PingFang SC;
  font-size: 12px !important;
  font-weight: 400;
  letter-spacing: 0;
  text-align: left;
  color: #FF860D !important;
  line-height: 26px;
  text-align: center;
}

.demo-ruleForm {
  position: relative;
  top: 30px;
  width: 260px;
  margin-left: 15px;
}

.el-link:hover, .loginfoot .el-link:hover {
  color: #E93854;
}

.loginfoot {
  line-height: 46px;
  background-color: #F6F6F6;
  width: 300px;
  height: 50px;
  position: absolute;
  top: 300px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;

}

.loginfoot .el-link {
  display: block;
  color: #595959;
  font-size: 13px;
  font-weight: 400;
  position: absolute;
  top: 15px;
  right: 30px;
  float: right;
}

:deep(.numrule input::-webkit-outer-spin-button),
:deep(.numrule input::-webkit-inner-spin-button) {

  -webkit-appearance: none !important;
}

:deep(.numrule input[type="number"]) {
  -moz-appearance: textfield;
}
</style>