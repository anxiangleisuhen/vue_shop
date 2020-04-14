import Vue from 'vue'
//导入各种组件和弹框提示组件
import { Message,Button,Form, FormItem, Input } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message