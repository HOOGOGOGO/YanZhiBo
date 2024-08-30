<template>
  <div class="main-content">
    <div style="width: 80%; background-color: white; margin: 30px auto; border-radius: 20px">
      <div style="padding-bottom: 10px">
        <div style="font-size: 18px; color: #000000FF; line-height: 80px; border-bottom: #cccccc 1px solid;">
          <div style="margin-left: 20px;display: inline-block;">我的订单（{{ total }} 个）</div>
          <div class="order-search" style="width:400px;display: inline-block;  float: right">
            <el-input size="" placeholder="搜索 订单号/商品名称"  class="input-with-select" style="width: 350px" v-model="text">
              <el-button slot="append"  style="width: 50px;" @click="searchOrders" icon="el-icon-search"></el-button>
            </el-input>
          </div>
        </div>
        <div style="margin: 20px 0; padding: 0 50px">
          <div class="table">
            <el-table :data="ordersData" strip >
              <el-table-column label="商品图片" width="120px">
                <template v-slot="scope">
                  <el-image style="width: 80px; height: 60px; border-radius: 3px" v-if="scope.row.goodsImg"
                            :src="scope.row.goodsImg" :preview-src-list="[scope.row.goodsImg]"></el-image>
                </template>
              </el-table-column>
              <el-table-column prop="orderId" label="订单编号" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="goodsName" label="商品名称" :show-overflow-tooltip="true">
                <template v-slot="scope">
                  <a :href="'/user/detail?id=' + scope.row.goodsId" style="text-decoration: none;color: #606266">{{scope.row.goodsName}}</a>
                </template>
              </el-table-column>
              <el-table-column prop="shopName" label="店铺名称">
                <template v-slot="scope">
                  <a :href="'/user/shop?id=' + scope.row.shopId" style="text-decoration: none">{{scope.row.shopName}}</a>
                </template>
              </el-table-column>
              <el-table-column prop="goodsPrice" label="商品价格">
                <template v-slot="scope">
                  {{scope.row.goodsPrice}} / {{scope.row.goodsUnit}}
                </template>
              </el-table-column>
              <el-table-column prop="num" label="商品数量"></el-table-column>
              <el-table-column prop="price" label="订单总价"></el-table-column>
              <el-table-column prop="username" label="收货人"></el-table-column>
              <el-table-column prop="useraddress" label="收货地址" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="phone" label="联系电话" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="status" label="订单状态"></el-table-column>
              <el-table-column label="操作" align="center" width="180">
                <template v-slot="scope">
                  <el-button size="mini" type="primary" v-if="scope.row.status === '待收货'" plain @click="updateStatus(scope.row, '已完成')">确认收货</el-button>
                  <el-button size="mini" type="primary" v-if="scope.row.status === '已完成'" plain @click="addComment(scope.row)">评价</el-button>
                  <el-button size="mini" type="danger" v-if="scope.row.status === '待发货'" plain @click="cancelOrder(scope.row, '已取消')">取消订单</el-button>
                  <el-button size="mini" type="danger" v-if="  ['已评价','已取消'].includes(scope.row.status) && scope.row.delStatus === '0'" plain @click="del(scope.row.id)">删除订单</el-button>

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
    <el-dialog title="请输入评价内容" :visible.sync="fromVisible" width="40%" :close-on-click-modal="false" destroy-on-close>
      <el-form :model="form" label-width="100px" style="padding-right: 50px" :rules="rules" ref="formRef">
        <el-form-item label="评价内容" prop="content">
          <el-input type="textarea" v-model="form.content" placeholder="请输入评价内容"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="fromVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  computed: {
  },

  data() {
    return {
      user: JSON.parse(localStorage.getItem('bbshop-user') || '{}'),
      ordersData: [],
      pageNum: 1,   // 当前的页码
      pageSize: 3,  // 每页显示的个数
      total: 0,
      form: {},
      fromVisible: false,
      text : null,
      rules:{
        content:{required:true,message:'请输入评价内容',trigger:['blur','click']}
      }
    }
  },
  mounted() {
    this.searchOrders()
  },
  // methods：本页面所有的点击事件或者其他函数定义区
  methods: {
    searchOrders(pageNum) {  // 订单搜索
      this.$request.get('/orders/selectPage', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          orderId: this.text,
          goodsName: this.text,
        }
      }).then(res => {
        if (res.code === '200') {
          this.ordersData = res.data?.list
          this.total = res.data?.total
        } else {
          this.$message.error(res.message)
        }
      })
    },
    navTo(url) {
      location.href = url
    },
    cancelOrder(row,status) {
      this.$confirm('是否取消','订单取消',{type: "warning"}).then(res=>{
        this.form = row
        this.form.status = status
        this.$request.put('/orders/update', this.form).then(res => {
          if (res.code === '200') {
            this.$message.success('操作成功')
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(()=>{

      })

    },
    handleCurrentChange(pageNum) {
      this.pageNum=pageNum
      this.searchOrders()
    },
    updateStatus(row, status) {
      if(status==='已完成'){
        this.$confirm('是否确认收货','收货提醒').then(res=>{
          this.form = row
          this.form.status = status
          this.$request.put('/orders/update', this.form).then(res => {
            if (res.code === '200') {
              this.$message.success('操作成功')
            } else {
              this.$message.error(res.msg)
            }
          })
        }).catch(()=>{

        })
      }else{
        this.form = row
        this.form.status = status
        this.$request.put('/orders/update', this.form).then(res => {
          if (res.code === '200') {
            this.$message.success('操作成功')
          } else {
            this.$message.error(res.msg)
          }
        })
      }


    },
    del(id) {   // 单个删除
      this.$confirm('您确定删除吗？', '确认删除', {type: "warning"}).then(response => {
        this.$request.delete('/orders/delete/' + id).then(res => {
          if (res.code === '200') {   // 表示操作成功
            this.$message.success('操作成功')
            this.searchOrders()
          } else {
            this.$message.error(res.message)  // 弹出错误的信息
          }
        })
      }).catch(() => {
      })
    },
    addComment(row) {
      this.fromVisible = true
      this.form = row
    },
    save() {
      let data = {
        userId: this.user.id,
        userType: this.user.role,
        shopId: this.form.shopId,
        goodsId: this.form.goodsId,
        content: this.form.content,
      }
      this.$refs.formRef.validate(isValid => {
        if(isValid){
          this.$request.post('/comment/add', data).then(res => {
            if (res.code === '200') {
              this.$message.success('评价成功')
              this.fromVisible = false
              this.updateStatus(this.form, '已评价')
              this.form = {}
            } else {
              this.$message.error(res.msg)
            }
          })
        }else{
          this.$message.warning("请认真核对上述内容")
        }
      })

    },
  }
}
</script>
