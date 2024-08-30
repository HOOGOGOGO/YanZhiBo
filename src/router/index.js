import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)


const routes = [
  {
    path:'/',
    name:'index',
    redirect: '/user/home'
  },
  {
    path:'/manager',
    name:'manager',
    component:()=>import('@/view/Manager.vue'),
    // redirect:'/login',
    children:[
      {path:'home',name:'ManagerHome',meta: { name: '后台首页' }, component: () => import('../view/manager/Home.vue')},
      { path: 'goods', name: 'Goods', meta: { name: '商品信息' }, component: () => import('../view/manager/Goods.vue') },
      { path: 'shopPerson', name: 'ShopPerson', meta: { name: '商家信息' }, component: () => import('../view/manager/ShopPerson.vue') },
      { path: 'password', name: 'Password', meta: { name: '修改密码' }, component: () => import('../view/manager/Password.vue') },
      { path: 'orders', name: 'ManagerOrders', meta: { name: '订单管理' }, component: () => import('../view/manager/Orders.vue') },
      { path: 'comment', name: 'Comment', meta: { name: '评论管理' }, component: () => import('../view/manager/Comment.vue') },
      { path: 'notice', name: 'Notice', meta: { name: '公告信息' }, component: () => import('../view/manager/Notice.vue') },
      { path: 'type', name: 'Type', meta: { name: '类别管理' }, component: () => import('../view/manager/Type.vue') },
      { path: 'admin', name: 'Admin', meta: { name: '管理员信息' }, component: () => import('../view/manager/Admin.vue') },
      { path: 'user', name: 'User', meta: { name: '用户信息' }, component: () => import('../view/manager/User.vue') },
      { path: 'shop', name: 'Shop', meta: { name: '商家信息' }, component: () => import('../view/manager/Shop.vue') },
      { path: 'adminPerson', name: 'AdminPerson', meta: { name: '个人信息' }, component: () => import('../view/manager/AdminPerson.vue') },

    ]
  },
  {
    path:'/user',
    name:'user',
    component:()=>import('@/view/Index.vue'),
    // redirect:'/login',
    children:[
      { path: 'home', name: 'Home', meta: { name: '系统首页' }, component: () => import('../view/user/Home') },
      { path: 'search', name: 'Search', meta: { name: '搜索' }, component: () => import('../view/user/Search') },
      { path: 'person', name: 'Person', meta: { name: '个人信息' }, component: () => import('../view/user/Person') },
      { path: 'detail', name: 'Detail', meta: { name: '商品详情' }, component: () => import('../view/user/Detail.vue') },
      { path: 'collect', name: 'Collect', meta: { name: '用户收藏' }, component: () => import('../view/user/Collect.vue') },
      { path: 'address', name: 'Address', meta: { name: '用户地址' }, component: () => import('../view/user/Address.vue') },
      { path: 'cart', name: 'Cart', meta: { name: '购物车' }, component: () => import('../view/user/Cart.vue') },
      { path: 'orders', name: 'UserOrders', meta: { name: '订单' }, component: () => import('../view/user/Orders.vue') },
      { path: 'comfirm', name: 'UserComfirm', meta: { name: '订单详情' }, component: () => import('../view/user/Comfirm.vue') },
      { path: 'shop', name: 'Shop', meta: { name: '店铺详情' }, component: () => import('../view/user/Shop.vue') },
      { path: 'type', name: 'Type', meta: { name: '分类详情' }, component: () => import('../view/user/Type.vue') },
      { path: 'chat', name: 'Chat', meta: { name: '聊天对话' }, component: () => import('../view/user/Chat.vue') },

    ]
  },
  {
    path:'/login',
    name:'login',
    component:()=>import('@/view/Login.vue'),
    children:[]
  },{
    path:'/register',
    name:'register',
    component:()=>import('@/view/Register.vue'),
  },{
    path:'/forget',
    name:'forget',
    component:()=>import('@/view/Forget.vue'),
  },{
    path:'*',
    name:'not',
    component:()=>import('@/view/404.vue'),
  }
  ]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
export default router

