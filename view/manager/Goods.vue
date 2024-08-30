<template>
  <div>
    <div class="search">
      <el-input placeholder="请输入商品名称查询" style="width: 200px" v-model="name"></el-input>
      <el-button type="info" plain style="margin-left: 10px" @click="load(1)">查询</el-button>
      <el-button type="warning" plain style="margin-left: 10px" @click="reset">重置</el-button>
    </div>

    <div class="operation">
      <el-button type="primary" plain @click="handleAdd"v-if="user.role==='SHOP'">发布商品</el-button>
      <el-button type="danger" plain @click="delBatch">批量删除</el-button>
    </div>

    <div class="table">
      <el-table :data="tableData" stripe  @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
<!--        <el-table-column prop="id" label="序号" width="80" align="center" sortable></el-table-column>-->
        <el-table-column label="商品主图" >
          <template v-slot="scope">
            <div style="display: flex; align-items: center">
              <el-image style="width: 40px; height: 40px; " v-if="scope.row.img"
                        :src="scope.row.img" :preview-src-list="[scope.row.img]"></el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名称" :show-overflow-tooltip="true">
          <template v-slot="scope">
            <a :href="'/user/detail?id=' + scope.row.id" style="text-decoration: none;color: #606266">{{scope.row.name}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="商品描述">
          <template slot-scope="scope">
            <el-button type="success" @click="viewEditor(scope.row.description)">点击查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="商品价格" show-overflow-tooltip></el-table-column>
        <el-table-column prop="unit" label="计件单位" show-overflow-tooltip></el-table-column>
        <el-table-column prop="typeName" label="商品分类" show-overflow-tooltip></el-table-column>
        <el-table-column prop="shopName" label="所属商家" show-overflow-tooltip></el-table-column>
        <el-table-column prop="count" label="商品销量" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template v-slot="scope">
            <el-button plain type="primary" @click="handleEdit(scope.row)" size="mini">编辑</el-button>
            <el-button plain type="danger" size="mini" @click=del(scope.row.id)>删除</el-button>
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


    <el-dialog title="信息" :visible.sync="fromVisible" width="40%" :close-on-click-modal="false" destroy-on-close :showClose="false" @close="cancel">
      <el-form label-width="100px" style="padding-right: 50px" :model="form" :rules="rules" ref="form">
        <el-form-item label="商品主图" prop="img">
          <el-upload
              class="avatar-uploader"
              :action="$baseUrl + '/files/upload'"
              :headers="{ token: user.token }"
              :file-list="fileList"
              list-type="picture"
              accept=".jpg,.jpeg,.png"
              :before-upload="beforeUpload"
              :before-remove="beforeRemove"
              :on-success="handleAvatarSuccess"
              :limit="1"
          >
            <el-button type="primary">上传图片</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item prop="name" label="商品名称">
          <el-input v-model="form.name" autocomplete="off" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item prop="price" label="商品价格">

          <el-input v-model="form.price" class="el-input numrule" type="number"
                    placeholder="请输入商品价格" />
        </el-form-item>
        <el-form-item prop="typeId" label="商品分类">
          <el-select v-model="form.typeId" placeholder="请选择分类" style="width: 100%" >
            <el-option v-for="item in typeData" :label="item.name" :value="item.id" :key="item.id" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="unit" label="计件单位">
          <el-input v-model="form.unit" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="description" label="商品介绍">
          <div id="editor" style="width: 100%"></div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="商品介绍" :visible.sync="editorVisible" width="50%">
      <div v-html="this.viewData" class="w-e-text"></div>
    </el-dialog>
  </div>
</template>

<script>
import E from 'wangeditor'

let editor
function initWangEditor(content) {	setTimeout(() => {
  if (!editor) {
    editor = new E('#editor')
    editor.config.placeholder = '请输入内容' // 默认显示
    editor.config.uploadFileName = 'file'
    editor.config.uploadImgMaxLength = 10
    editor.config.uploadImgAccept  =["jpg","png","jpeg",".avif"]
    editor.config.uploadImgServer = 'http://localhost:8080/files/wang/upload'
    editor.config.uploadImgMaxSize=1024*1024*20 //20m
    editor.config.uploadImgMaxLength = 20
    editor.create() //创建文本对象
  }
  console.log(content)
  editor.txt.html(content) //重新设置编辑框的内容
}, 0)
}

export default {
  name: "Notice",
  data() {

   const valideImg = (rule,value,callback)=>{
      if(!this.form.img){
        callback(new Error('请上传商品主图'))
      }else{
        callback()
      }
    }

    return {
      tableData: [],  // 所有的数据
      pageNum: 1,   // 当前的页码
      pageSize: 10,  // 每页显示的个数
      total: 10,
      updateDelFlag:false,
      name: null,
      oldImg:'',
      fileList:'',
      fromVisible: false,
      editorVisible: false,
      form: {
      },
      user: JSON.parse(localStorage.getItem('bbshop-user') || '{}'),
      imgFlag:false,
      rules: {
        name: [
          {required: true, message: '请输入商品名称', trigger: ['blur','change']},
        ],
        price: [
          {required: true, message: '请输入商品价格', trigger: ['blur','change']},
        ],
        unit: [
          {required: true, message: '请输入计件单位', trigger: ['blur','change']},
        ],
        typeId: [
          {required: true, message: '请选择商品类别', trigger: ['blur','change']},
        ],
        img:[
          {required: true,validator:valideImg,trigger: ['blur', 'change']},
        ],
      },
      ids: [],
      typeData: [],
      viewData: null
    }
  },
  created() {
    this.load(1)
    this.loadType()
  },

  methods: {

    // 上传文件类型校验
    beforeUpload(file) {
      const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);

      const whiteList = ["jpg", "png", "jpeg",".avif"];
      this.imgFlag= true
      this.updateDelFlag=true
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
    delImg(filename){
      this.$request.delete('/files/'+ filename ).then(res=>{
        if(res.code === '200'){
          this.imgFlag=false
          this.form.img=''
        }else {
          this.$message.error(res.message)
        }
      }).catch(()=>{
        this.$message.error('系统错误')
      })
    },
    // 移除商品主图
    beforeRemove(file){
      if(this.fileList){
        this.fileList=''
        return
      }
// 移除前
      const fileFlag=file.response.data.substring(file.response.data.lastIndexOf('/')+1)
      return this.$confirm(`确定移除 ${file.name}？`).then(() => {
        this.delImg(fileFlag)
        this.$message.success('删除成功')
      });
    },
    loadType() {
      this.$request.get('/type/selectAll').then(res => {
        if (res.code === '200') {
          this.typeData = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleAdd() {   // 新增数据
      if ('审核通过' !== this.user.status) {
        this.$message.warning('您的店铺信息还未审核通过，暂时不允许发布商品')
        return
      }
      this.form = {}  // 新增数据的时候清空数据
      initWangEditor('')
      this.fromVisible = true   // 打开弹窗
    },
    handleEdit(row) {   // 编辑数据
      this.form = JSON.parse(JSON.stringify(row))  // 给form对象赋值  注意要深拷贝数据
      if(this.form.img){
        this.oldImg=this.form.img.split('/')
        this.oldImg=this.oldImg[this.oldImg.length-1]
        this.fileList=[{name:this.form.img.split('/')[4],url:this.form.img}]
        this.updateDelFlag=false
      }
      initWangEditor(this.form.description || '')
      this.fromVisible = true   // 打开弹窗
    },
    // 查看商品详情
    viewEditor(content) {
      this.viewData = content
      this.editorVisible = true
    },
    cancel() {
      if(this.imgFlag){
        this.$message.warning("请删掉图片后再取消！")
      }else{
        this.fromVisible = false
        location.href = '/manager/goods'
        this.fileList=''
      }
    },
    // 保存按钮触发的逻辑  它会触发新增或者更新
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.form.description = editor.txt.html() //编辑器的html格式
          console.log(this.form.description)
          this.$request({
            url: this.form.id ? '/goods/update' : '/goods/add', //根据id是否存在选择api
            method: this.form.id ? 'PUT' : 'POST',
            data: this.form

          }).then(res => {
            if (res.code === '200') {  // 表示成功保存
              this.imgFlag=false
              this.fileList=''
              if(this.updateDelFlag){
                this.delImg(this.oldImg)
                this.oldImg=''
              }
              this.$message.success('保存成功')
              // this.load(1)
              this.fromVisible = false
              location.href = '/manager/goods'
            } else {
              this.$message.error(res.message)  // 弹出错误的信息
            }
          })
        }
      })
    },
    del(id) {   // 单个删除
      this.$confirm('您确定删除吗？', '确认删除', {type: "warning"}).then(response => {
        this.$request.delete('/goods/delete/' + id).then(res => {
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
      this.ids = rows.map(v => v.id)   //  [1,2]
    },
    delBatch() {   // 批量删除
      if (!this.ids.length) {
        this.$message.warning('请选择数据')
        return
      }
      this.$confirm('您确定批量删除这些数据吗？', '确认删除', {type: "warning"}).then(response => {
        this.$request.delete('/goods/delete/batch', {data: this.ids}).then(res => {
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
      this.$request.get('/goods/selectPage', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          name: this.name,
        }
      }).then(res => {
        this.tableData = res.data?.list
        this.total = res.data?.total
      })
    },
    reset() {
      this.name = null
      this.load(1)
    },
    handleCurrentChange(pageNum) {
      this.load(pageNum)
    },
    // 插入商品主图
    handleAvatarSuccess(response, file, fileList) {
      this.form.img = response.data
      this.$refs['form'].validateField('img') //触发图片的校验
    },
    watch:{

    },
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
