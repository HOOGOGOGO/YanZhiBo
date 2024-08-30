

<template>
  <div id="body_b" style="width: 100%;height: 100%;">
    <div id="header" style="display: block;height:13vh">
        <div  @click="$router.push('/user/home')"  id="logo" class="logo" style="position: relative;top:1vh;left: 25vh">
              <img  src="../assets/imgs/logo.jpg" style="display: block;width: 90px; height: 80px;cursor: pointer">
        </div>
        <div class="front-header-center" style="width:600px;margin: auto;position: relative;top: -40px">
          <el-input size="big" placeholder="搜索 商品/品牌/店铺"  class="input-with-select" style="width:600px" v-model="name">
            <el-button slot="append"  style="color:#fff;width: 70px;" @click="search">搜索</el-button>
          </el-input>
        </div>

      <div class="front-header-right">
        <div v-if="!user.username" style="position: relative;left: 140vh;top: 0vh;">
          <span>你好，</span>
          <span style="color: red;cursor: pointer" @click="$router.push('/login')">请登录</span>
          <span style="cursor: pointer" @click="$router.push('/login')">&nbsp;&nbsp;免费注册</span>
        </div>
        <div v-else style="position: relative;left: 160vh;top: -10vh;">
          <el-dropdown>
            <div class="front-header-dropdown">
              <img @click="navTo('/user/person')" :src="user.photo" alt="">
              <div style="margin-left: 5px">
                {{ user.name }}<i class="el-icon-arrow-down" ></i>
              </div>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div style="text-decoration: none;" @click="navTo('/user/cart')">我的购物车</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div style="text-decoration: none" @click="navTo('/user/collect')">我的收藏</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div style="text-decoration: none" @click="navTo('/user/address')">我的地址</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div style="text-decoration: none" @click="navTo('/user/orders')">我的订单</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div style="text-decoration: none" @click="logout">退出</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>

<!--    主体-->
    <div class="main-body" style="padding-bottom: 25px;padding-top: 25px;background-color: rgba(194, 142, 96, 0.18)">
      <router-view ref="child" @update:user="updateUser" />
    </div>
    <div class="footer">
      <div class="links" style="margin-top: 15px">
        <a rel="nofollow" href="">
          关于我们
        </a>
        |
        <a rel="nofollow" href="">
          联系我们
        </a>
        |
        <a rel="nofollow" href="">
          人才招聘
        </a>
        |
        <a rel="nofollow" href="">
          商家入驻
        </a>
        |
        <a rel="nofollow" href="">
          广告服务
        </a>
        |
        <a rel="nofollow" href="">
          手机婴幼
        </a>
        |
        <a href="">
          友情链接
        </a>
        |
        <a href="">
          销售联盟
        </a>
        |
        <a href="">
          婴幼社区
        </a>
        |
        <a href="">
          婴幼公益
        </a>
      </div>
      <div class="copyright" style="margin-top: 5px">
        Copyright&nbsp;©&nbsp;2004-2024&nbsp;&nbsp;Lucky Baby LBaby.com&nbsp;版权所有
      </div>
    </div>
  </div>

</template>
<script>
export default {
  data(){
    return{
      user: JSON.parse(localStorage.getItem("bbshop-user") || '{}'),
      name:null
    }
  },methods:{
    search() {
      let name = this.name ? this.name : ''
      location.href = '/user/search?name=' + name
    },
    navTo(url) {
      location.href = url
    },
    // 退出登录
    logout() {
      localStorage.removeItem("bbshop-user");
      this.$router.push("/login");
    },
  }

}
</script>
<style scoped>
@import "@/assets/css/front.css";
#header {
  background: #fff;
  border-bottom: 1px solid #ddd;
  height: 100px;
}

span {
font-size: 16px;
  color: #999999;
  position: relative;
  top: -60px;
  left: 75%;
  height: 25px;
}
.front-header-center :deep(.el-input__inner){
  border-radius: 15px;
  border-color: #fe0137;
  width: 500px;

}
.front-header-center :deep(.el-input-group__append){
  text-align: center;
  border-radius: 15px;
  background-color: #fe0137;
  border-color:#fe0137 ;
  width: 50px;
  height: 38px;
  position: relative;
  left: -70px;
  top: 0px;
  margin: 0;
}
.footer {
  text-align: center;
  text-decoration: none;
  width: 100%;
  height: 20.5vh;
}

a, .copyright {
  text-decoration: none;
  font: 12px/150% Arial, Verdana, "\5b8b\4f53";
  color: #666;
}

</style>