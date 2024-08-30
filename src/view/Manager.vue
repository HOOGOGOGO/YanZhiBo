<template>
  <div class="manager-container">
    <!--  头部  -->
    <div class="manager-header">
      <div class="manager-header-left">
        <img src="@/assets/imgs/logo.jpg" style="border-radius: 10px" />
        <div class="title">后台管理系统</div>
      </div>

      <div class="manager-header-center" >
        <el-breadcrumb separator-class="el-icon-arrow-right" >
          <el-breadcrumb-item @click.native="$router.push('/manager/home')" style="cursor: pointer">首页</el-breadcrumb-item>
          <el-breadcrumb-item >{{ $route.meta.name }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="manager-header-right">
        <el-dropdown placement="bottom">
          <div class="photo">
            <img :src="user.photo || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
            <div>{{ user.name ||  '管理员' }}</div>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="goToPerson">个人信息</el-dropdown-item>
            <el-dropdown-item @click.native="$router.push('/manager/password')">修改密码</el-dropdown-item>
            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <!--  主体  -->
    <div class="manager-main">
      <!--  侧边栏  -->
      <div class="manager-main-left">
        <el-menu router  style="border: none" :default-active="this.$route.path">
          <el-menu-item index="/manager/home">
            <i class="el-icon-s-home"></i>
            <span slot="title">系统首页</span>
          </el-menu-item>
          <el-submenu index="info">
            <template slot="title">
              <i class="el-icon-menu"></i><span>信息管理</span>
            </template>
            <el-menu-item v-if="user.role === 'ADMIN'" index="/manager/notice">公告信息</el-menu-item>
            <el-menu-item v-if="user.role === 'ADMIN'" index="/manager/type">分类信息</el-menu-item>
            <el-menu-item index="/manager/goods">商品信息</el-menu-item>
            <el-menu-item index="/manager/orders">订单管理</el-menu-item>
            <el-menu-item index="/manager/comment">评论管理</el-menu-item>
          </el-submenu>

          <el-submenu index="user"  v-if="user.role === 'ADMIN'">
            <template slot="title">
              <i class="el-icon-menu"></i><span>用户管理</span>
            </template>
            <el-menu-item index="/manager/admin">管理员信息</el-menu-item>
            <el-menu-item index="/manager/shop">商家信息</el-menu-item>
            <el-menu-item index="/manager/user">用户信息</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>

      <!--  数据表格  -->
      <div class="manager-main-right">
        <router-view @update:user="updateUser" />
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "Manager",
  data() {
    return {
      user: JSON.parse(localStorage.getItem('bbshop-user') || '{}'),
    }
  },
  created() {
    if (!this.user.id) {
      // this.$router.push('/login')'
      this.$router.push('/user/home')
    }
  },
  methods: {
    updateUser() {
      this.user = JSON.parse(localStorage.getItem('bbshop-user') || '{}')   // 重新获取下用户的最新信息
    },
    goToPerson() {
      if (this.user.role === 'ADMIN') {
        this.$router.push('/manager/adminPerson')
      }
      if (this.user.role === 'SHOP') {
        this.$router.push('/manager/shopPerson')
      }
    },
    logout() {
      localStorage.removeItem('bbshop-user')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
@import "@/assets/css/manager.css";
</style>