<template>
  <div class="main-content">
    <el-card style="width: 50%; margin: 30px auto">
      <div style="text-align: right; margin-bottom: 20px">
        <el-button type="primary" @click="updatePassword">修改密码</el-button>
      </div>
      <el-form :model="user" label-width="80px" style="padding-right: 20px" :rules="rules" ref="formRef">
        <div style="margin: 15px; text-align: center">
          <el-upload
              class="photo-uploader"
              :action="$baseUrl + '/files/upload'"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
          >
            <img v-if="user.photo" :src="user.photo" class="photo" />
            <i v-else class="el-icon-plus photo-uploader-icon"></i>
          </el-upload>
        </div>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username" placeholder="用户名" disabled></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="name">
          <el-input v-model="user.name" placeholder="昵称"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="user.phone" placeholder="电话"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="user.email" placeholder="邮箱"></el-input>
        </el-form-item>
        <div style="text-align: center; margin-bottom: 20px">
          <el-button type="primary" @click="back">返 回</el-button>
          <el-button type="primary" @click="modifyPerson">保 存</el-button>
        </div>
      </el-form>
    </el-card>
    <el-dialog title="获取验证码" :visible.sync="dialogEmailVisible" width="30%" :close-on-click-modal="false" destroy-on-close>
      <el-form :model="user" label-width="80px" style="padding-right: 70px" :rules="rules" ref="formRef">
        <el-form-item prop="email">
          <el-input class="el-input" v-model="user.email" type="text" placeholder="请输入需要重置密码的邮箱"
                    prefix-icon="el-icon-message" disabled/>
        </el-form-item>
        <el-form-item prop="code" style="padding-right: 50px">
          <el-row :gutter="14">
            <el-col :span="18" >
              <el-input v-model="user.code" :maxlength="6" class="el-input numrule" type="number" placeholder="请输入邮箱验证码" prefix-icon="el-icon-edit"/>
            </el-col>
            <el-col :span="5" >
              <el-button @click="sendCode" type="success" plain :disabled="isEmailValid">
                {{ coldTime > 0 ? '请稍后' + coldTime : '获取验证码' }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="canelDialog">取 消</el-button>
        <el-button type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改密码" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false" destroy-on-close>
      <el-form :model="user" label-width="80px" style="padding-right: 20px" :rules="rules" ref="formRef">
        <el-form-item label="原始密码" prop="password">
          <el-input show-password v-model="user.password" placeholder="原始密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input show-password v-model="user.newPassword" placeholder="新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input show-password v-model="user.confirmPassword" placeholder="确认密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="canelDialog">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请确认密码'))
      } else if (value !== this.user.newPassword) {
        callback(new Error('两次密码输入不一致，请重新输入'))
      } else {
        callback()
      }
    }
    return {
      user_store:JSON.parse(localStorage.getItem('bbshop-user') || '{}'),
      user: JSON.parse(localStorage.getItem('bbshop-user') || '{}'),
      dialogVisible: false,
      dialogEmailVisible:false,
      isEmailValid: false,
      coldTime: 0,

      rules: {
        name:[
            {required: true, message: '请输入昵称', trigger: ['blur', 'change']},
          {min: 2, max: 10, message: '昵称长度必须在2-10个字符之间', trigger: ['blur', 'change']}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: ['blur', 'change']},
          {min: 6, max: 18, message: '密码长度必须在6-18个字符之间', trigger: ['blur', 'change']}
        ],

        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          {min: 6, max: 18, message: '密码长度必须在6-18个字符之间', trigger: ['blur', 'change']}
        ],
        confirmPassword: [
          { validator: validatePassword, required: true, trigger: 'blur' },
        ],
        email: [
          {required: true, message: '请输入邮箱地址', trigger: ['blur', 'change']},
          {type: 'email', message: '请输入合法的邮箱地址', trigger: ['blur', 'change']}
        ],
        phone:[
          {required:true,message:'请输入电话',trigger:['blur','change']},
          {min:11,max:11,message:'电话号码有误',trigger:['blur','change']}
        ],
        code: [
          {required: true, message: '请输入邮箱验证码', trigger: ['blur', 'change']},
          {min: 6, max: 6, message: '验证码必须为6位', trigger: ['blur', 'change']}
        ],
      }
    }
  },
  created() {
    // this.dialogVisible = false
  },
  methods: {
    modifyPerson(){
      if(this.user_store.email=== this.user.email){
        this.update()
      }else{
        this.dialogEmailVisible=true
      }

    },
    update() {
      this.$refs.formRef.validate((valid)=>{
        this.user.emailState= false //每次重置邮箱状态
        if(valid){
          if(this.user_store.email !==this.user.email){
            this.user.emailState= true
          }
// 保存当前的用户信息到数据库
          this.$request.put('/user/update', this.user).then(res => {
            if (res.code === '200') {
              // 成功更新
              this.$message.success('保存成功')
              // 更新浏览器缓存里的用户信息
              localStorage.setItem('bbshop-user', JSON.stringify(this.user))
              // 触发父级的数据更新
              this.$emit('update:user')
              this.user_store=JSON.parse(localStorage.getItem('bbshop-user') || '{}')
              this.dialogEmailVisible=false
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },
    handleAvatarSuccess(response, file, fileList) {
      // 把user的头像属性换成上传的图片的链接
      this.$set(this.user, 'photo', response.data)
    },
    // 修改密码
    updatePassword() {
      this.dialogVisible = true
    },
    save() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$request.put('/updatePassword', this.user).then(res => {
            if (res.code === '200') {
              // 成功更新
              this.$message.success('修改密码成功')
              localStorage.removeItem("bbshop-user");
              this.$router.push('/login')
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },
    canelDialog(){
      // if(this.dialogVisible)
        this.dialogVisible=false;
      // if(this.dialogEmailVisible)
        this.dialogEmailVisible=false;
      this.$refs['formRef'].resetFields();
    },

    sendCode() {
      this.$refs['formRef'].validateField("email", (valid) => {
        if (!valid) {
          this.isEmailValid = true;
          this.user.emailState=false
          this.$request.post('/sendCode', this.user).then(res => {
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
    //返回按钮
    back(){
      this.$router.back();
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
/deep/.el-form-item__label {
  font-weight: bold;
}
/deep/.el-upload {
  border-radius: 50%;
}
/deep/.photo-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
}
/deep/.photo-uploader .el-upload:hover {
  border-color: #409EFF;
}
.photo-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  border-radius: 50%;
}
.photo {
  width: 120px;
  height: 120px;
  display: block;
  border-radius: 50%;
}

:deep(.numrule input::-webkit-outer-spin-button),
:deep(.numrule input::-webkit-inner-spin-button) {

  -webkit-appearance: none !important;
}

:deep(.numrule input[type="number"]) {
  -moz-appearance: textfield;
}
</style>