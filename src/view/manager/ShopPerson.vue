<template>
  <div>
    <el-card style="width: 50%">
      <el-form :model="user" label-width="100px" style="padding-right: 50px" ref="formRef" :rules="rules">
        <div style="margin: 15px; text-align: center">
          <el-upload
              class="avatar-uploader"
              :action="$baseUrl + '/files/upload'"
              :show-file-list="false"
              accept=".jpg,.jpeg,.png"
              :on-success="handleAvatarSuccess"
          >
            <img v-if="user.photo" :src="user.photo" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username" placeholder="用户名" disabled></el-input>
        </el-form-item>
        <el-form-item label="店铺名" prop="name">
          <el-input v-model="user.name" placeholder="店铺名"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="user.phone" placeholder="电话"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="user.email" placeholder="邮箱" ></el-input>
        </el-form-item>
        <el-form-item label="介绍" prop="description">
          <el-input type="textarea" v-model="user.description" placeholder="店铺介绍"></el-input>
        </el-form-item>
        <el-form-item label="审核状态" prop="status">
          <el-input v-model="user.status" placeholder="审核状态" disabled></el-input>
        </el-form-item>
        <div style="text-align: center; margin-bottom: 20px">
          <el-button type="primary" @click="modifyShop">保 存</el-button>
        </div>
      </el-form>
    </el-card>

    <el-dialog title="获取验证码" :visible.sync="dialogEmailVisible" width="30%" :close-on-click-modal="false" destroy-on-close>
      <el-form :model="user" label-width="80px" style="padding-right: 20px" :rules="rules" ref="formRef">
        <el-form-item prop="email">
          <el-input class="el-input" v-model="user.email" type="text" placeholder="请输入需要重置密码的邮箱"
                    prefix-icon="el-icon-message" disabled/>
        </el-form-item>
        <el-form-item prop="code">
          <el-row :gutter="10">
            <el-col :span="18" style="text-align: left">
              <el-input v-model="user.code"  class="el-input numrule" type="number" placeholder="请输入邮箱验证码" prefix-icon="el-icon-edit"/>
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
  </div>
</template>

<script>
export default {
  name: "AdminPerson",
  data() {
    return {
      user_store:JSON.parse(localStorage.getItem('bbshop-user') || '{}'),
      user: JSON.parse(localStorage.getItem('bbshop-user') || '{}'),
      dialogEmailVisible:false,
      isEmailValid: false,
      coldTime: 0,
      rules: {
        name:[
          {required: true, message: '请输入昵称', trigger: ['blur', 'change']},
          {min: 2, max: 10, message: '昵称长度必须在2-10个字符之间', trigger: ['blur', 'change']}
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

  },
  methods: {
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
    modifyShop(){
      if(this.user_store.email===this.user.email){
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
          this.$request.put('/shop/update', this.user).then(res => {
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
    canelDialog(){
      this.dialogEmailVisible=false;
      this.$refs['formRef'].resetFields();
    },
    handleAvatarSuccess(response, file, fileList) {
      // 把user的头像属性换成上传的图片的链接
      this.$set(this.user, 'photo', response.data)
    },
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
/deep/.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
}
/deep/.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  border-radius: 50%;
}
.avatar {
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