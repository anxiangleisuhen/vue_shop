import Vue from 'vue'
import App from './App.vue'
import router from './router'
/* import router from './router/index' */
import './plugins/element.js'
//导入字体图标
import './assets/fonts/iconfont.css'
//导入全局样式表
import './assets/css/global.css'
//引入第三方组件1
import TreeTable from 'vue-table-with-tree-grid'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//require style ，导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme


//导入 Nprogress 包对应的js和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import axios from 'axios'
//配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//在request拦截器中，展示进度条 NProgress.start()
axios.interceptors.request.use(config=>{
  //console.log(config)
  NProgress.start()
  //在token前面添加Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //在最后必须return config
  return config
})
//在 response 拦截器中，隐藏进度条 NProgress.done()
axios.interceptors.response.use(config=>{
  NProgress.done()
  return config
})
Vue.prototype.$http = axios
//将富文本编辑器注册为全局可用对象
Vue.use(VueQuillEditor, /* { default global options } */)

Vue.config.productionTip = false
//引入第三方组件2
Vue.component('tree-table', TreeTable)
//全局的格式化时间的过滤器,dataFormat 是自己定义的名字，而 originVal 是传入进来的参数,再传入
//Date()中，由于后台时间戳是10位的，所以在这里需要*1000
//(dt.getMonth() +1+'').padStart(2,'0') 第一个括号里+空字符是为了将获取到的数据封装成字符串
//然后放在第一个括号里，再调用padStart(2,'0'),表示字符长度为2位，不够就添加0做为补充
//有人说可以用 ("0"+(dt.getMonth()+1)).slice(-2)这样子表达
//最后return出去一个拼接好的字符串
Vue.filter('dataFormat',function(originVal){
  const dt = new Date(originVal*1000)
  const y = dt.getFullYear()
  const m = (dt.getMonth() +1+'').padStart(2,'0')
  const d = (dt.getDate()+'').padStart(2,'0')

  const hh = (dt.getHours()+'').padStart(2,'0')
  const mm = (dt.getMinutes()+'').padStart(2,'0')
  const ss = (dt.getSeconds()+'').padStart(2,'0')

  return `${y}-${m}-${d}-${hh}-${mm}-${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
