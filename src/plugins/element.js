import Vue from 'vue'
//导入各种组件和弹框提示组件
import { Message,Button,Form, FormItem, Input,Container,Header,Aside,Main, 
Menu,MenuItemGroup,Submenu,MenuItem,Breadcrumb, BreadcrumbItem,Card,Row,Col,Table,TableColumn,
Switch,Tooltip,Pagination,Dialog,MessageBox,Tag,Tree,
Select,Option,Cascader,Alert,Tabs,TabPane,Steps,Step,Checkbox,
CheckboxGroup,Upload} from 'element-ui'

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
Vue.use(Tag)
Vue.use(Select)
Vue.use(Tree)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Step)
Vue.use(Steps)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
Vue.prototype.$message = Message
//原型挂载MessageBox中的confirm
Vue.prototype.$confirm = MessageBox.confirm