import Vue from 'vue'
import Router from 'vue-router'
import Editpaper from '../components/goods/editpaper.vue'

const Login = () => import(/* webpackChunkName: "Login-Home-Welcome" */ '../components/Login.vue')
/* import Login from '../components/Login.vue' */
/* import Home from '../components/Home.vue' */
const Home = () => import(/* webpackChunkName: "Login-Home-Welcome" */ '../components/Home.vue')
/* import Welcome from '../components/Welcome.vue' */
const Welcome = () => import(/* webpackChunkName: "Login-Home-Welcome" */ '../components/Welcome.vue')

/* import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue' */
const Users = () => import(/* webpackChunkName: "Users-Rights-Roles" */ '../components/user/Users.vue')
const Rights = () => import(/* webpackChunkName: "Users-Rights-Roles" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "Users-Rights-Roles" */ '../components/power/Roles.vue')

/* import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue' */
const Cate = () => import(/* webpackChunkName: "Cate-Params" */ '../components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "Cate-Params" */ '../components/goods/Params.vue')

/* import GoodsList from '../components/goods/list.vue'
import Add from '../components/goods/add.vue' */
const GoodsList = () => import(/* webpackChunkName: "GoodsList-Add" */ '../components/goods/list.vue')
const Add = () => import(/* webpackChunkName: "GoodsList-Add" */ '../components/goods/add.vue')
/* 
import Order from '../components/order/Order.vue'
import Editpaper from '../components/goods/editpaper.vue'
import Report from '../components/report/Report.vue' */
const Order = () => import(/* webpackChunkName: "Order-Editpaper-Report" */ '../components/order/Order.vue')
const Report = () => import(/* webpackChunkName: "Users-Rights-Roles" */ '../components/report/Report.vue')

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { 
      path: '/Home' ,
      component:Home,
      redirect:'/welcome',
      children:[{path:'/welcome',component:Welcome},
                {path:'/users', component:Users},
                {path:'/rights', component:Rights},
                {path:'/roles',component:Roles},
                {path:'/categories',component:Cate},
                {path:'/params', component:Params},
                {path:'/goods',component:GoodsList},
                {path:'/goods/add',component:Add},
                {path:'/orders',component:Order},
                {path:'/goods/editpaper',
                name:'Editpaper',
                component:Editpaper},
                {path:'/reports',component:Report}
      ]
    },
  ]
})
//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  //to 将要访问的路径
  //from 代表从哪个路径跳转过来
  //next 是一个函数，表示放行，有两种方法，1、next() 放行  2、next('/login')  强制跳转
  if (to.path=== '/login') return next()
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})


export default router