<template>
  <div class="main-content">
    <div style="width: 60%; margin: 30px auto; border-radius: 20px">
      <div style="height: 100px; padding: 0 10px; display: flex; align-items: center; border-radius: 25px; background-color: white;">
        <img :src="shopData.photo" alt="" style="height: 60px; width: 60px; border-radius: 50%">
        <div style="width: 220px; margin: 0 30px 0 15px; font-size: 20px; font-weight: bold;">
          <div style="height: 30px; line-height: 30px">{{shopData.name}}</div>
          <div style="width: 60px;height: 25px;font-size: 14px;border-radius: 15px;background-color: red;color: white;line-height: 25px;text-align: center">品牌</div>
        </div>
        <div style="width: 150px; height: 100px; padding: 20px">
          <div style="font-size: 16px; height: 30px; line-height: 30px; color: #7F7F7FFF">店铺电话</div>
          <div style="font-size: 14px; height: 30px; line-height: 30px; ">{{shopData.phone}}</div>
        </div>
        <div style="width: 150px; height: 100px; padding: 20px">
          <div style="font-size: 16px; height: 30px; line-height: 30px; color: #7F7F7FFF">店铺邮箱</div>
          <div style="font-size: 14px; height: 30px; line-height: 30px; ">{{shopData.email}}</div>
        </div>
        <div style="flex: 1; height: 100px; padding: 20px">
          <div style="font-size: 16px; height: 30px; line-height: 30px; color: #7F7F7FFF">店铺介绍：</div>
          <div style="height: 60px; line-height: 30px; font-size: 14px; color: #000000FF; overflow: hidden; text-overflow: ellipsis;text-overflow: ellipsis;">
            <el-tooltip :content="shopData.description" placement="top" effect="light">
              <span>{{shopData.description}}</span>
            </el-tooltip>
          </div>

        </div>
      </div>
      <div style="border-radius: 20px; padding: 0 20px; background-color: white; margin-top: 20px">
        <div style="font-size: 18px; color: #000000FF; line-height: 80px; border-bottom: #cccccc 1px solid">本店所有商品（{{goodsData.length}}件）</div>
        <div style="margin: 20px -40px 10px 30px">
          <el-row :gutter="16" style="margin-bottom: 15px">
            <el-col class="goods-item" :span="5" style="" v-for="item in goodsData" >
              <img @click="navTo('/user/detail?id=' + item.id)" :src="item.img" alt="" style="width: 100%; height: 200px; border-radius: 10px; border: #cccccc 1px solid">
              <div style="margin-top: 10px; font-weight: 500; font-size: 14px; width: 160px; color: #000000FF; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{item.name}}</div>
              <div style="margin-top: 5px; font-size: 16px; color: #FF5000FF">￥ {{item.price}} / {{item.unit}}</div>
            </el-col>
          </el-row>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

export default {

  data() {
    let shopId = this.$route.query.id
    return {
      user: JSON.parse(localStorage.getItem('xm-user') || '{}'),
      shopId: shopId,
      goodsData: [],
      shopData: {}
    }
  },
  mounted() {
    this.loadshop()
    this.loadGoods()
  },
  // methods：本页面所有的点击事件或者其他函数定义区
  methods: {
    loadshop() {
      this.$request.get('/shop/selectById/' + this.shopId).then(res => {
        if (res.code === '200') {
          this.shopData = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    loadGoods() {
      this.$request.get('/goods/selectByShopId?id=' + this.shopId).then(res => {
        if (res.code === '200') {
          this.goodsData = res.data
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
.el-col-5{
  width: 20%;
  max-width: 20%;
  padding: 10px 10px;
}

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
