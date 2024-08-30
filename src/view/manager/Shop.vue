<template>
  <div>
    <div class="search">
      <el-input placeholder="请输入账号查询" style="width: 200px" v-model="username"></el-input>
      <el-button type="info" plain style="margin-left: 10px" @click="load(1)">查询</el-button>
      <el-button type="warning" plain style="margin-left: 10px" @click="reset">重置</el-button>
    </div>

    <div class="operation">
      <el-button type="primary" plain @click="handleAdd">新增</el-button>
      <el-button type="danger" plain @click="delBatch">批量删除</el-button>
    </div>

    <div class="table">
      <el-table :data="tableData" strip @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
<!--        <el-table-column prop="id" label="序号" width="70" align="center" sortable></el-table-column>-->
        <el-table-column prop="username" label="账号"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column label="头像">
          <template v-slot="scope">
            <div style="display: flex; align-items: center">
              <el-image style="width: 40px; height: 40px; border-radius: 50%" v-if="scope.row.photo"
                        :src="scope.row.photo" :preview-src-list="[scope.row.photo]"></el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="role" label="角色"></el-table-column>
        <el-table-column prop="description" label="商家介绍" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="status" label="审核状态"></el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template v-slot="scope">
            <el-button size="mini" type="primary" plain @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" plain @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[5, 10, 20]"
            :page-size="pageSize"
            layout="total, prev, pager, next"
            :total="total">
        </el-pagination>
      </div>
    </div>


    <el-dialog title="用户" :visible.sync="fromVisible" width="35%" :close-on-click-modal="false" destroy-on-close :showClose="false">
      <el-form :model="form" label-width="100px" style="padding-right: 50px" :rules="rules" ref="formRef">
        <el-form-item prop="username" label="用户名">
          <el-input   class="el-input" v-model="form.username" :maxlength="8" type="text" placeholder="请输入用户名" prefix-icon="el-icon-user"/>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input  class="el-input numrule" v-model="form.phone" type="number" placeholder="请输入电话"
                     prefix-icon="el-icon-phone" :maxlength="11"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="img">
          <el-upload
              class="avatar-uploader"
              :action="$baseUrl + '/files/upload'"
              :headers="{ token: user.token }"
              list-type="picture"
              :file-list="fileList"
              accept=".jpg,.jpeg,.png"
              :before-upload="beforeUpload"
              :before-remove="beforeRemove"
              :on-success="handleAvatarSuccess"
              :limit="1"
          >
            <el-button type="primary">上传头像</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="商家介绍" prop="description" >
          <el-input v-model="form.description" placeholder="商家介绍"></el-input>
        </el-form-item>
        <el-form-item label="审核状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择" style="width: 100%">
            <el-option label="审核中" value="审核中"></el-option>
            <el-option label="审核通过" value="审核通过"></el-option>
            <el-option label="审核不通过" value="审核不通过"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cannelDia">取 消</el-button>
        <el-button type="primary" @click="modifyAdmin">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="获取验证码" :visible.sync="dialogEmailVisible" width="30%" :close-on-click-modal="false" destroy-on-close>
      <el-form :model="form" label-width="80px" style="padding-right: 20px" :rules="rules" ref="formRef">
        <el-form-item prop="email">
          <el-input class="el-input" v-model="form.email" type="text" placeholder="请输入需要重置密码的邮箱"
                    prefix-icon="el-icon-message" disabled/>
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cannelDiaEmail">取 消</el-button>
        <el-button type="primary" @click="cpmpareMethod">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Admin",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value === ''||!value) {
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
      user:JSON.parse(localStorage.getItem('bbshop-user') || '{}'),
      isEmailValid: false,
      dialogEmailVisible:false,
      coldTime: 0,
      tableData: [],  // 所有的数据
      pageNum: 1,   // 当前的页码
      pageSize: 10,  // 每页显示的个数
      imgFlag:false,
      total: 0,
      username:'',
      oldImg:'',
      fromVisible: false,
      newFlag:false,
      updateDelFlag:false,
      fileList:[],
      form: {
        email:'',
        username:'',
        name:'',
        password:'',
        password_repeat:'',
        code:'',
        phone:'',
        role:''
      },
      user_email: '',
      rules: {
        username: [
          {required: true, validator: validateUsername, trigger: ['blur', 'change']},
          {min: 2, max: 8, message: '用户名长度必须在2-8个字符之间', trigger: ['blur', 'change']},
        ],
        name: [
          {required: true, validator: validateUsername, trigger: ['blur', 'change']},

          {min: 2, max: 30, message: '名称长度必须在2-30个字符之间', trigger: ['blur', 'change']},
        ],
        email: [
          {required: true, message: '请输入邮箱地址', trigger: ['blur', 'change']},
          {type: 'email', message: '请输入合法的邮箱地址', trigger: ['blur', 'change']}
        ],
        description: [
          {required: true, message: '请输入商家介绍', trigger: ['blur', 'change']},
        ],
        phone:[
          {required:true,message:'请输入电话',trigger:['blur','change']},
          {min:11,max:11,message:'电话号码有误',trigger:['blur','change']}
        ],
        status: [
          {required: true, message: '请选择审核状态', trigger: ['blur', 'change']},
        ],
      },
      ids: []
    }
  },
  created() {
    this.load(1)
  },
  methods: {
    sendCode() {
      this.$refs['formRef'].validateField("email", (valid) => {
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
    // 上传文件类型校验
    beforeUpload(file) {

      const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
      const whiteList = ["jpg", "png", "jpeg"];
      this.imgFlag= true //当前对话框是否存在图片，删除后才能取消
      this.updateDelFlag=true //是否重新上传了照片
      if (whiteList.indexOf(fileSuffix) === -1) {
        this.$message.error('上传图片只能是 jpg、png、jpeg');
        return false;
      }

      const isLt2M = file.size / 1024 / 1024 < 5;

      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 5MB');
        return false;
      }
    },
    cannelDia(){
      if(this.imgFlag){
        this.$message.warning("请删掉图片后再取消！")
      }else{
        this.fromVisible = false
        this.dialogEmailVisible=false
        this.$refs['formRef'].resetFields()
        this.fileList=[]
      }

    },
    cannelDiaEmail(){
      this.dialogEmailVisible=false
      this.form.code=' '
    },
    cpmpareMethod(){
      if(this.newFlag){
        return this.save()
      }else{
        return this.update()
      }
    },
    delImg(filename){
      this.$request.delete('/files/'+ filename ).then(res=>{
        this.imgFlag=false
        if(res.code === '200'){
        }else {
          this.$message.error(res.message)
        }
      }).catch(()=>{
        this.$message.error('系统错误')
      })
    },
    beforeRemove(file){
      if(this.fileList.length>0){
        this.fileList=[]
        return
      }
// 移除前
      const fileFlag=file.response.data.substring(file.response.data.lastIndexOf('/')+1)

      return this.$confirm(`确定移除 ${file.name}？`).then(() => {
        this.delImg(fileFlag)
        this.$message.success('删除成功')
      });
    },
    handleAdd() {   // 新增数据
      this.form = {}  // 新增数据的时候清空数据
      this.fromVisible = true   // 打开弹窗
      this.fileList=[]
      this.newFlag=true //是否为新建管理员
    },
    handleEdit(row) {   // 编辑数据

      this.form = JSON.parse(JSON.stringify(row))  // 给form对象赋值  注意要深拷贝数据
      this.user_email=this.form.email
      if(this.form.photo){
        this.oldImg=this.form.photo.split('/')
        this.oldImg=this.oldImg[this.oldImg.length-1]
        this.fileList=[{name:this.form.photo.split('/')[4],url:this.form.photo}]
        this.updateDelFlag=false
      }
      this.fromVisible = true   // 打开弹窗
    },
    modifyAdmin(){
      this.$refs.formRef.validate((valid) => {
            if (valid) {
              if(this.user_email===this.form.email){
                this.update()
              }else{
                this.dialogEmailVisible=true
              }
            }

      })

    },
    save() {   // 保存按钮触发的逻辑  它会触发新增或者更新
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.form.role="SHOP"
          this.form.password='123456'
          this.$request({
            url: '/register',
            method: 'POST',
            data: this.form
          }).then(res => {
            if (res.code === '200') {  // 表示成功保存
              this.fileList=[]
              this.newFlag=false
              this.imgFlag=false
              this.user_email=''
              this.dialogEmailVisible=false
              this.$message.success('保存成功')
              this.load(1)
              this.fromVisible = false
            } else {
              this.$message.error(res.message)  // 弹出错误的信息
            }
          })
        }
      })
    },
    update() {
      this.$refs.formRef.validate((valid)=>{
        this.user.emailState= false //每次重置邮箱状态
        if(valid){
          if(this.user_email !==this.form.email){
            this.user.emailState= true
          }
// 保存当前的用户信息到数据库
          this.$request.put('/shop/update', this.form).then(res => {
            if (res.code === '200') {

              if(this.updateDelFlag){ //重新上传了照片。删掉之前的旧图片
                this.delImg(this.oldImg)
                this.oldImg=''
              }
              this.fileList=[] //初始化文件标值
              this.form='' //初始化表单
              this.newFlag=false //初始化新增商家
              this.fromVisible = false
              this.dialogEmailVisible=false
              this.user_email=''
              this.imgFlag=false
              // 成功更新
              this.$message.success('保存成功')
              // 更新浏览器缓存里的用户信息
              localStorage.setItem('bbshop-user', JSON.stringify(this.user))
              // 触发父级的数据更新
              this.$emit('update:user')
              this.dialogEmailVisible=false
              this.load();
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },
    del(id) {   // 单个删除
      this.$confirm('您确定删除吗？', '确认删除', {type: "warning"}).then(response => {
        this.$request.delete('/shop/delete/' + id).then(res => {
          if (res.code === '200') {   // 表示操作成功
            this.$message.success('操作成功')
            this.load(1)
          } else {
            this.$message.error(res.message)  // 弹出错误的信息
          }
        })
      }).catch(() => {
      })
    },
    handleSelectionChange(rows) {   // 当前选中的所有的行数据
      this.ids = rows.map(v => v.id)
    },
    delBatch() {   // 批量删除
      if (!this.ids.length) {
        this.$message.warning('请选择数据')
        return
      }
      this.$confirm('您确定批量删除这些数据吗？', '确认删除', {type: "warning"}).then(response => {
        this.$request.delete('/shop/delete/batch', {data: this.ids}).then(res => {
          if (res.code === '200') {   // 表示操作成功
            this.$message.success('操作成功')
            this.load(1)
          } else {
            this.$message.error(res.message)  // 弹出错误的信息
          }
        })
      }).catch(() => {
      })
    },
    load(pageNum) {  // 分页查询
      if (pageNum) this.pageNum = pageNum
      this.$request.get('/shop/selectPage', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          username: this.username,
        }
      }).then(res => {
        this.tableData = res.data?.list
        this.total = res.data?.total
      })
    },
    reset() {
      this.username = null
      this.load(1)
    },
    handleCurrentChange(pageNum) {
      this.load(pageNum)
    },
    handleAvatarSuccess(response, file, fileList) {
      // 把头像属性换成上传的图片的链接
      this.form.photo = response.data
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
:deep(.numrule input::-webkit-outer-spin-button),
:deep(.numrule input::-webkit-inner-spin-button) {

  -webkit-appearance: none !important;
}

:deep(.numrule input[type="number"]) {
  -moz-appearance: textfield;
}
</style>