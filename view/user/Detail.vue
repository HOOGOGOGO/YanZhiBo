<template>
  <div class="main-content">
    <div style="width: 60%; background-color: white; min-height: 1000px; margin: 20px auto; border-radius: 20px">
      <div style="padding: 15px 20px">
        <el-row :gutter="20">
          <el-col :span="10">
            <img :src="goodsData.img" alt="" style="width: 100%; height: 400px; border-radius: 20px">
          </el-col>
          <el-col :span="12">
            <div
                style="font-size: 20px; font-weight: 900; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
              {{ goodsData.name }}
            </div>
            <div style="color: #666666FF; margin-top: 5px">销量：{{ goodsData.count }}</div>
            <div style="color: red; margin-top: 15px">疯抢价：<span
                style="font-size: 20px">{{ goodsData.price }} / {{ goodsData.unit }}</span></div>
            <div style="margin-top: 20px">
              <img src="@/assets/imgs/right.png" alt="" style="width: 70%; height: 130px; border-radius: 15px">
            </div>
            <div style="color: #666666FF; margin-top: 20px">商家：<a href="#"
                                                                    @click="navTo('/user/shop?id=' + goodsData.shopId)">{{ goodsData.shopName }}</a>
            </div>
            <div style="color: #666666FF; margin-top: 20px">分类：<a href="#"
                                                                    @click="navTo('/user/type?id=' + goodsData.typeId)">{{ goodsData.typeName }}</a>
            </div>
            <div style="color: #666666FF; margin-top: 20px">
              <el-button type="warning" @click="addCart">加入购物车</el-button>
              <el-button type="warning" @click="collect">收藏</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div style="padding: 15px 20px">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="宝贝详情" name="first">
            <div style="padding: 15px 175px" v-html="goodsData.description"></div>
          </el-tab-pane>
          <el-tab-pane label="宝贝评价" name="second">
            <div style="margin-top: 10px">
              <div style="margin-top: 20px" v-for="item in commentData">
                <div style="display: flex" @click="addCommentReply(item)">
                  <div style="width: 40px">
                    <img :src="item.userPhoto" alt="" style="height: 40px; width: 40px; border-radius: 50%">
                  </div>
                  <div style="width: 200px; margin-left: 10px">
                    <div style="font-weight: 700; font-size: 16px; color: #000000FF">{{ item.userName }}</div>
                    <div style="color: #7A7A7AFF;font-size: 14px">{{ timeFormat(item.time) }}</div>
                  </div>
                </div>
                <div style="margin-top: 15px; font-size: 16px">{{ item.content }}</div>
                <!-- 评论回复-->
                <div class="reply-comment" v-for="reply in item.reply" style="margin-top: 10px;margin-left: 25px;"  @click="addReplyReply(item,reply)">
                  <div style="display: flex;">
                    <div style="width: 40px">
                      <img :src="reply.commentUser.photo" alt="" style="height: 30px; width: 30px; border-radius: 50%">
                    </div>
                    <div style="width: 200px; margin-left: 10px">
                      <div style="font-weight: 700; font-size: 13px; color: #000000FF">
                        <span>{{ reply.commentUser.role == 'SHOP' ? '商家' : reply.commentUser.name }}</span>
                        <span style="font-weight: 500;color: #000000"> 回复：{{reply.replyUser.role==='SHOP'? '商家': reply.replyUser.name}}</span>
                      </div>
                      <div style="color: #7A7A7AFF;font-size: 12px">{{ timeFormat(reply.time) }}</div>
                    </div>
                  </div>
                  <div style="margin-top: 10px; font-size: 14px">{{ reply.content }}</div>
                </div>
                <div style="margin-top:5px;border-bottom: 1px solid #e6e6e6"></div>
              </div>


            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <el-dialog title="回复评价" :visible.sync="fromVisible" width="40%" :close-on-click-modal="false" destroy-on-close>
      <el-form :model="form" label-width="100px" style="padding-right: 50px" :rules="rules" ref="formRef">
        <el-form-item label="回复评论" prop="content">
          <el-input type="textarea" v-model="form.content" placeholder="请输入回复内容"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="fromVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveReply">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//评论时间格式修改

export const timeFormat = (date) => {
  let myDate = new Date(date);
  let time = myDate.getFullYear() + '/' + (myDate.getMonth() + 1) + '/' + (myDate.getDate()) + ' ' + myDate.getHours() + ':' + myDate.getMinutes() + ':' + myDate.getSeconds();
  let timestamp = Date.parse(time)
  var mistiming = Math.round((Date.now() - timestamp) / 1000);
  var arrr = ['年', '个月', '周', '天', '小时', '分钟', '秒'];
  var arrn = [31536000, 2592000, 604800, 86400, 3600, 60, 1];
  for (var i = 0; i < arrn.length; i++) {
    var inm = Math.floor(mistiming / arrn[i]);
    if (inm != 0) {
      return inm + arrr[i] + '前';
    }
  }
}
export default {

  data() {
    let goodsId = this.$route.query.id
    return {
      user: JSON.parse(localStorage.getItem('bbshop-user') || '{}'),
      goodsId: goodsId,
      goodsData: {},
      activeName: 'first',
      commentData: [],
      timeFormat: timeFormat, //定义事件格式函数
      fromVisible: false, //回复评论控制变量
      form: {},
      rules: {
        content: {required: true, message: '请输入评价内容', trigger: ['blur', 'click']}
      }
    }
  },
  mounted() {
    this.loadGoods()
    this.loadComments()
  },
  // methods：本页面所有的点击事件或者其他函数定义区
  methods: {
    loadGoods() {
      this.$request.get('/goods/selectById?id=' + this.goodsId).then(res => {
        if (res.code === '200') {
          this.goodsData = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleClick(tab, event) {
      // this.activeName = tab.name
    },
    collect() {
      let data = {
        userId: this.user.id,
        shopId: this.goodsData.shopId,
        goodsId: this.goodsId
      }
      this.$request.post('/collect/add', data).then(res => {
        if (res.code === '200') {
          this.$message.success('收藏成功')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    addCart() {
      let data = {num: 1, userId: this.user.id, goodsId: this.goodsId, shopId: this.goodsData.shopId}
      this.$request.post('/cart/add', data).then(res => {
        if (res.code === '200') {
          this.$message.success('操作成功')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    loadComments() {
      this.$request.get('/comment/selectByGoodsId?id=' + this.goodsId).then(res => {
        if (res.code === '200') {
          this.commentData = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },
    navTo(url) {
      location.href = url
    },
    addCommentReply(comment) { //对评论回复
      this.fromVisible = true
      this.form.commentId=comment.id
      this.form.userId=this.user.id
      this.form.role=this.user.role
      this.form.replyRole="USER"
      this.form.shopId=comment.shopId
      this.form.goodsId=comment.goodsId
      this.form.replyUserId=comment.userId

    },
    addReplyReply(comment,reply) { //对回复回复
      if(this.user.role==='USER'){
        this.fromVisible = true
        console.log(reply)
        this.form.commentId=comment.id
        this.form.userId=this.user.id
        this.form.role=this.user.role
        this.form.replyRole=reply.commentUser.role
        this.form.shopId=comment.shopId
        this.form.goodsId=comment.goodsId
        this.form.replyUserId=reply.commentUser.id
      }
    },
    saveReply() { //保存评论
      this.$refs.formRef.validate(isValid => {
        if(isValid){

          this.$request.post('/reply/add', this.form).then(res => {
            if (res.code === '200') {
              this.$message.success('回复成功')
              this.fromVisible = false
              this.loadComments()
              this.form = {}
            } else {
              this.$message.error(res.msg)
            }
          })
        }else{
          this.$message.warning("请认真核对上述内容")
        }
      })
    }
  }
}
</script>

<style>
.reply-comment {

  font-size: 10px;
}
a{
  text-decoration: none;
}
</style>
