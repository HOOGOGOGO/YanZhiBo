<template>
  <div class="main-content">
    <div style="width: 70%; background-color: white; margin: 30px auto; border-radius: 20px">
      <div style="padding-bottom: 10px">
        <div
            style="display: flex; font-size: 18px; color: #000000FF; line-height: 80px; border-bottom: #cccccc 1px solid;">
          <div style="flex: 3; margin-left: 20px">我的地址</div>
          <div style="flex: 1; text-align: right; padding-right: 20px">
            <el-button type="warning" round @click="addAddress">添加收货地址</el-button>
          </div>
        </div>
        <div style="margin: 20px 0; padding: 0 50px">
          <div class="table">
            <el-table :data="addressData" strip>
              <el-table-column prop="username" label="收货人" width="150px"></el-table-column>
              <el-table-column prop="useraddress" label="收货地址" width="450px"></el-table-column>
              <el-table-column prop="phone" label="联系电话" width="200px"></el-table-column>
              <el-table-column label="操作" align="center" width="160">
                <template v-slot="scope">
                  <el-button size="mini" type="primary" plain @click="editAddress(scope.row)">编辑</el-button>
                  <el-button size="mini" type="danger" plain @click="del(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <div class="pagination" style="margin-top: 20px">
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
        </div>
      </div>
    </div>
    <el-dialog title="地址信息" :visible.sync="formVisible" width="40%" :close-on-click-modal="false" destroy-on-close>
      <el-form label-width="100px" style="" :model="form" :rules="rules" ref="formRef">
        <el-form-item prop="username" label="收货人">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="addrCodes" label="地址信息">
          <el-cascader :options="options" :props="addressParams" ref="cascaderAddr"
                       v-model="addrCodes" @change="handleAddress" >
          </el-cascader>
        </el-form-item>
        <el-form-item prop="addressRear" label="详细地址">
          <el-input v-model="form.addressRear" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="联系电话">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

let pcas = require('@/assets/pcas-code.json')
export default {

  data() {
    return {
      user: JSON.parse(localStorage.getItem('bbshop-user') || '{}'),
      addressData: [],
      // 级联 地址选择的参数
      addressParams: {
        checkStrictly: false, //是否支持部分选中
        value: 'code', //传递的值
        label: 'name' //显示的名称
      },
      addressRear:'',//详细地址
      selectFlag:false,
      addrCodes:'',//地址编码
      addrLabels:'',//地址名称
      pageNum: 1,   // 当前的页码
      pageSize: 10,  // 每页显示的个数
      total: 0,
      formVisible: false,
      form: {

      },
      options: pcas,
      rules: {
        username: [
          {required: true, message: '请输入收货人', trigger: 'blur'},
        ],
        addressRear: [
          {required: true, message: '请输入详细地址', trigger: 'blur'},
        ],
        // addrCodes: [
        //   {required: true,message: '请输入地址信息', trigger: 'blur'},
        // ],
        phone: [
          {required: true, message: '请输入联系电话', trigger: 'blur'},
        ],
      },
    }
  },
  mounted() {
    this.loadAddress(1)
  },
  // methods：本页面所有的点击事件或者其他函数定义区
  methods: {
    // 获取省市区地址级联
    handleAddress(thsAreaCode) {
      thsAreaCode = this.$refs['cascaderAddr'].getCheckedNodes()[0]
      this.addrCodes = thsAreaCode.path //显示对应地址的编码
      this.addrLabels = thsAreaCode.pathLabels //显示对应地址的名称

      this.selectFlag=true //已经选择了三级地址
    },
    addAddress() {
      this.form = {}
      this.addrCodes=''
      this.addrLabels=''
      this.selectFlag=false //未选择三级地址
      this.formVisible = true
    },
    editAddress(row) {
      this.form = JSON.parse(JSON.stringify(row))
      // this.addrCodes=row.split(',') //将字符串转为数组,赋值地址编码
      // this.addressRear=row.addressRear //显示详细地址

      this.form.useraddress=this.form.useraddress.slice(0,this.form.useraddress.length-this.form.addressRear.length)
      this.addrCodes = this.form.addressCode.split(',')
      this.addrLabels=''
      this.formVisible = true
    },
    save() {   // 保存按钮触发的逻辑  它会触发新增或者更新

      if(!this.addrCodes){
        return this.$message.warning('请输入地址信息')
      }
      // 写入完整地址
      if (this.selectFlag) {//判断是否点击过了三级地址选择器
        this.form.useraddress = ''
        for (let i = 0; i < this.addrLabels.length; i++) {
          this.form.useraddress += this.addrLabels[i] //省市区镇
        }

      }
      this.form.useraddress+=this.form.addressRear //完整地址 省市区镇+详细信息
      this.form.addressCode=this.addrCodes.toString() //转字符串

      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.form.userId = this.user.id
          this.$request({
            url: this.form.id ? '/address/update' : '/address/add',
            method: this.form.id ? 'PUT' : 'POST',
            data: this.form
          }).then(res => {
            if (res.code === '200') {  // 表示成功保存
              this.addrCodes='' //重置三级地址 编码标志
              this.addrLabels=''//重置三级地址 名称标志

              this.selectFlag=false //重新初始化选择标签
              this.$message.success('保存成功')
              this.loadAddress(1)
              this.formVisible = false
            } else {
              this.$message.error(res.message)  // 弹出错误的信息
            }
          })
        }
      })
    },
    loadAddress(pageNum) {
      if (pageNum) this.pageNum = pageNum
      this.$request.get('/address/selectPage', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        }
      }).then(res => {
        if (res.code === '200') {
          this.addressData = res.data?.list

          this.total = res.data?.total
        } else {
          this.$message.error(res.message)
        }
      })
    },
    navTo(url) {
      location.href = url
    },
    del(id) {
      this.$confirm('是否移除','确认删除',{type: "warning"}).then(()=> {
        this.$request.delete('/address/delete/' + id).then(res => {
          if (res.code === '200') {
            this.$message.success('删除成功')
            this.loadAddress(1)
          } else {
            this.$message.error(res.message)
          }
        })
      }).catch(()=>{

      })
    },
    handleCurrentChange(pageNum) {
      this.loadAddress(pageNum)
    }
  }
}
</script>
