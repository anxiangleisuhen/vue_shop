import Vue from 'vue'
//导入各种组件和弹框提示组件
import { Message,Button,Form, FormItem, Input,Container,Header,Aside,Main, 
Menu,MenuItemGroup,Submenu,MenuItem,Breadcrumb, BreadcrumbItem,Card,Row,Col,Table,TableColumn,
Switch,Tooltip,Pagination,Dialog,MessageBox} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Dialog)
Vue.prototype.$message = Message
//原型挂载MessageBox中的confirm
Vue.prototype.$confirm = MessageBox.confirm