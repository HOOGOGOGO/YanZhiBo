<template>
  <div class="main-content">
    <div style="width: 70%; background-color: white; margin: 30px auto; border-radius: 20px">
      <div style="padding-bottom: 10px">
        <div style="display: flex; font-size: 18px; color: #000000FF; line-height: 80px; border-bottom: #cccccc 1px solid;">
          <div style="margin-left: 20px; flex: 1">购物车（全部{{ goodsData.length }}）</div>
          <div style="flex: 2; text-align: right">
            <el-select v-model="addressId" placeholder="请选择收货地址" style="width: 70%">
              <el-option v-for="item in addressData" :label="item.username + ' - ' + item.useraddress + ' - ' + item.phone" :value="item.id"></el-option>
            </el-select>
          </div>
          <div style="flex: 1; font-size: 16px; text-align: right; padding-right: 20px">
            已选商品 ￥ {{totalPrice}} <el-button type="danger" round @click="gotoPay">去结算</el-button>
          </div>
        </div>
        <div style="margin: 20px 0; padding: 0 50px">
          <div class="table">
            <el-table :data="goodsData" strip @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column label="商品图片" width="120px">
                <template v-slot="scope">
                  <el-image style="width: 80px; height: 60px; border-radius: 3px" v-if="scope.row.goodsImg"
                            :src="scope.row.goodsImg" :preview-src-list="[scope.row.goodsImg]"></el-image>
                </template>
              </el-table-column>
              <el-table-column prop="goodsName" label="商品名称" width="240px">
                <template v-slot="scope">
                  <a :href="'/user/detail?id=' + scope.row.goodsId" style="text-decoration: none;text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{scope.row.goodsName}}</a>
                </template>
              </el-table-column>
              <el-table-column prop="shopName" label="店铺名称">
                <template v-slot="scope">
                  <a :href="'/user/shop?id=' + scope.row.shopId"  style="text-decoration: none;overflow: hidden;text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{scope.row.shopName}}</a>
                </template>
              </el-table-column>
              <el-table-column prop="goodsPrice" label="商品价格"></el-table-column>
              <el-table-column prop="num" label="选择数量">
                <template v-slot="scope">
                  <el-input-number v-model="scope.row.num" style="width: 100px" @change="handleChange(scope.row)" :min="1"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="180">
                <template v-slot="scope">
                  <el-button size="mini" type="danger" plain @click="del(scope.row.id)">移除购物车</el-button>
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
  </div>
</template>

<script>

export default {

  data() {
    return {
      user: JSON.parse(localStorage.getItem('bbshop-user') || '{}'),
      goodsData: [],
      pageNum: 1,   // 当前的页码
      pageSize: 10,  // 每页显示的个数
      totalPrice: 0,
      total: 0,
      addressId: null,
      addressData: [],
      selectedData: [],
    }
  },
  mounted() {
    this.loadGoods(1)
    this.loadAddress()
  },
  // methods：本页面所有的点击事件或者其他函数定义区
  methods: {
    loadAddress() {
      this.$request.get('/address/selectAll').then(res => {
        if (res.code === '200') {
          this.addressData = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    loadGoods(pageNum) {
      if (pageNum) this.pageNum = pageNum
      this.$request.get('/cart/selectPage', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        }
      }).then(res => {
        if (res.code === '200') {
          this.goodsData = res.data?.list
          this.total = res.data?.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    navTo(url) {
      location.href = url
    },
    del(id) {
      this.$request.delete('/cart/delete/' + id).then(res => {
        if (res.code === '200') {
          this.$message.success('移除成功')
          this.loadGoods(1)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleCurrentChange(pageNum) {
      this.loadGoods(pageNum)
    },
    handleSelectionChange(rows) { //选中数据触发函数
      this.totalPrice = 0
      this.selectedData = rows //选择所有数据
      // 计算总价格
      this.selectedData.forEach(item => {
        this.totalPrice += (item.goodsPrice * item.num)
      })
      console.log(this.goodsData)
    },
    handleChange(row) { //修还商品数量触发函数
      this.totalPrice = 0
      this.selectedData.forEach(item => {
        this.totalPrice += item.goodsPrice * item.num
      })
    },
    gotoPay(){
      if(this.selectedData.length===0){
        return this.$message.warning('请选择要购买的商品')
      }
      return this.$router.push({name:'UserComfirm',
        params:{
        orderGoods:this.selectedData,
          totalPrice:this.totalPrice
      }
      })
    }


  }
}
</script>
