<template>
  <div>
    <div class="search">
      <el-input placeholder="请输入分类名称查询" style="width: 200px" v-model="name"></el-input>
      <el-button type="info" plain style="margin-left: 10px" @click="load(1)">查询</el-button>
      <el-button type="warning" plain style="margin-left: 10px" @click="reset">重置</el-button>
    </div>

    <div class="operation">
      <el-button type="primary" plain @click="handleAdd">新增</el-button>
      <el-button type="danger" plain @click="delBatch">批量删除</el-button>
    </div>

    <div class="table">
      <el-table :data="tableData" stripe  @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
<!--        <el-table-column prop="id" label="序号" width="80" align="center" sortable></el-table-column>-->
        <el-table-column prop="name" label="分类名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="description" label="分类描述" show-overflow-tooltip></el-table-column>
        <el-table-column label="分类图标">
          <template v-slot="scope">
            <div style="display: flex; align-items: center">
              <el-image style="width: 40px; height: 40px; " v-if="scope.row.img"
                        :src="scope.row.img" :preview-src-list="[scope.row.img]"></el-image>
            </div>
          </template>
        </el-table-column>
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

<!--分类信息添加的窗口-->
    <el-dialog title="信息" :visible.sync="fromVisible" width="40%" :close-on-click-modal="false" destroy-on-close :showClose="false">
      <el-form label-width="100px" style="padding-right: 50px" :model="form" :rules="rules" ref="formRef">
        <el-form-item prop="name" label="分类名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="description" label="分类描述">
          <el-input v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类图标" prop="img">
          <el-upload
              class="avatar-uploader"
              :action="$baseUrl + '/files/upload'"
              :headers="{ token: user.token }"
              list-type="picture"
              :file-list="fileList"
              accept=".jpg,.jpeg,.png,.avif"
              :before-upload="beforeUpload"
              :before-remove="beforeRemove"
              :on-success="handleAvatarSuccess"
              :limit="1"
          >
            <el-button type="primary">上传图标</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cannelDia">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import type from "@/view/user/Type.vue";

export default {
  name: "Notice",
  data() {
    return {
      tableData: [],  // 所有的数据
      pageNum: 1,   // 当前的页码
      pageSize: 10,  // 每页显示的个数
      total: 0,
      imgFlag:false,
      fileList:'',
      name: null,
      fromVisible: false,
      form: {},
      oldImg:'',
      user: JSON.parse(localStorage.getItem('bbshop-user') || '{}'),
      rules: {
        name: [
          {required: true, message: '请输入分类名称', trigger: 'blur'},
        ],
        description: [
          {required: true, message: '请输输入分类描述', trigger: 'blur'},
        ],
        img: [
          {required: true, message: '请输输入分类图标', trigger: 'blur'},
        ]
      },
      ids: []
    }
  },
  created() {
    this.load(1)
  },
  methods: {
    // 上传文件类型校验
    beforeUpload(file) {

      const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
      const whiteList = ["jpg", "png", "jpeg","avif"];
      this.imgFlag= true
      if (whiteList.indexOf(fileSuffix) === -1) {
        this.$message.error('上传图片只能是 jpg、png、jpeg、avif');
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
        }else {
          this.$message.error(res.message)
        }
      }).catch(()=>{
        this.$message.error('系统错误')
      })
    },
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
    handleAdd() {   // 新增数据
      this.form = {}  // 新增数据的时候清空数据
      this.fromVisible = true   // 打开弹窗
    },
    handleEdit(row) {   // 编辑数据
      this.form = JSON.parse(JSON.stringify(row))  // 给form对象赋值  注意要深拷贝数据

      if(this.form.img){
        this.oldImg=this.form.img.split('/')
        this.oldImg=this.oldImg[this.oldImg.length-1]
        this.fileList=[{name:this.form.img.split('/')[4],url:this.form.img}]
      }

      this.fromVisible = true   // 打开弹窗
    },
    save() {   // 保存按钮触发的逻辑  它会触发新增或者更新
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$request({
            url: this.form.id ? '/type/update' : '/type/add',
            method: this.form.id ? 'PUT' : 'POST',
            data: this.form
          }).then(res => {
            if (res.code === '200') {  // 表示成功保存
              this.fileList=''
              this.imgFlag=false
              if(this.oldImg){
                this.delImg(this.oldImg)
                this.oldImg=''
              }
              this.$message.success('保存成功')
              this.load(1)
              this.fromVisible = false
              this.filename=''
            } else {
              this.$message.error(res.message)  // 弹出错误的信息
            }
          })
        }
      })
    },
   cannelDia(){
      if(this.imgFlag){
        this.$message.warning("请删掉图片后再取消！")
      }else{
        this.fromVisible = false
        this.fileList=''
      }


    },
    del(id) {   // 单个删除
      this.$confirm('您确定删除吗？', '确认删除', {type: "warning"}).then(response => {
        this.$request.delete('/type/delete/' + id).then(res => {
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
        this.$request.delete('/type/delete/batch', {data: this.ids}).then(res => {
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
      this.$request.get('/type/selectPage', {
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
    handleAvatarSuccess(response, file, fileList) {
      this.form.img = response.data

    },
  }
}
</script>

<style scoped>

</style>
