<template>
  <div class="main-content">
    <div style="display: flex; width: 60%; background-color: white; margin: 40px auto; border-radius: 20px">
      <div style=" padding: 0px 30px">
        <div style="font-size: 18px; color: #000000FF; line-height: 80px; border-bottom: #cccccc 1px solid">{{typeData.name}}</div>
        <div style="margin: 20px 40px">
          <el-row :gutter="16" style="margin-bottom: 15px">
            <el-col class="goods-item" :span="5" style="" v-for="item in goodsData" >
              <img @click="navTo('/user/detail?id=' + item.id)" :src="item.img" alt="" style="width: 100%; height: 200px; border-radius: 10px; border: #cccccc 1px solid">
              <div style="margin-top: 10px; font-weight: 500; font-size: 14px; width: 160px; color: #000000FF; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{item.name}}</div>
              <div style="margin-top: 5px; font-size: 16px; color: #FF5000FF">￥ {{item.price}} / {{item.unit}}</div>
            </el-col>
          </el-row>
        </div>
        <div class="pagination" style="margin-bottom: 10px;text-align: center">
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
<!--      <div style="width: 250px; padding: 0 20px; border-left: #cccccc 1px solid">-->
<!--        <div style="font-size: 18px; color: #000000FF; line-height: 80px; border-bottom: #cccccc 1px solid">猜你喜欢</div>-->
<!--        <div style="margin: 20px 0; padding: 0 10px">-->
<!--          <div style="margin-bottom: 20px" v-for="item in recommendData">-->
<!--            <img @click="navTo('/user/detail?id=' + item.id)" :src="item.img" alt="" style="width: 100%; height: 175px; border-radius: 10px; border: #cccccc 1px solid">-->
<!--            <div style="margin-top: 10px; font-weight: 500; font-size: 16px; width: 180px; color: #000000FF; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{item.name}}</div>-->
<!--            <div style="margin-top: 5px; font-size: 20px; color: #FF5000FF">￥ {{ item.price }} / {{item.unit}}</div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

    </div>
    </div>

</template>

<script>

export default {

  data() {
    let typeId = this.$route.query.id
    return {
      user: JSON.parse(localStorage.getItem('bbshop-user') || '{}'),
      typeId: typeId,
      goodsData: [],
      recommendData: [],
      typeData: {},
      pageNum: 1,   // 当前的页码
      pageSize: 20,  // 每页显示的个数
      total: 0,
    }
  },
  mounted() {
    this.loadGoods()
    this.loadType()
    // this.loadRecommend()
  },
  // methods：本页面所有的点击事件或者其他函数定义区
  methods: {
    handleCurrentChange(pageNum) {
      this.loadGoods(pageNum)
    },
    loadRecommend() {
      this.$request.get('/goods/recommend').then(res => {
        if (res.code === '200') {
          this.recommendData = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    loadType() {
      this.$request.get('/type/selectById/' + this.typeId).then(res => {
        if (res.code === '200') {
          this.typeData = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    loadGoods(pageNum) {
      if(pageNum){
        this.pageNum=pageNum
      }
      this.$request.get('/goods/selectByTypeId' ,{
        params: {
          id:this.typeId,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        }
      }).then(res => {
        if (res.code === '200') {
          this.goodsData = res.data.list
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    navTo(url) {
      location.href = url
    }
  }
}
</script>
<style scoped>
.goods-item{
  padding: 10px;
  display: block;
  border:1px solid transparent;
  margin-bottom: 20px;
  margin-right: 25px;
  cursor: pointer;
  //width: 21%;
}
.goods-item:hover{
  border: 1px solid red;
  border-radius: 15px;
}
</style>