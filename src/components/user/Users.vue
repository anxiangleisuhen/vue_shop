<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片视图区域-->
        <el-card>
        <!--搜索与添加区域-->
        <el-row :gutter="20">
        <el-col :span="8"><el-input placeholder="请输入内容" v-model="queryInfo.query" :clearable="true" @clear="getUserList">
        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
        </el-input>
        </el-col>
        <el-col :span="4"><el-button type="primary" @click="addDialogVisible=true">添加用户</el-button></el-col>
        </el-row>
        <!--用户列表区域-->
        <el-table :data="userlist" :stripe="true" :border="true">
            <el-table-column type="index" label="#"></el-table-column>
             <el-table-column prop="username" label="姓名"></el-table-column>
             <el-table-column prop="email" label="邮箱"></el-table-column>
             <el-table-column prop="mobile" label="电话"></el-table-column>
             <el-table-column prop="role_name" label="角色"></el-table-column>
             <el-table-column prop="mg_state" label="状态">
                 <!--作用域插槽,显示出状态，用v-model来绑定显示出一个布尔值-->
                 <!--以前是slot-scope="scope",现在改成v-slot="scope"-->
                 <template v-slot="scope">
                    <!-- {{scope.row}}-->
                    <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
                    </el-switch>
                 </template>
             </el-table-column>
             <el-table-column label="操作" width="180px">
                 <!--这里仍未进行操作这些动作的绑定-->
                 <template v-slot="scope">
                     <!--修改按钮-->
                     <el-button type="primary" icon="el-icon-edit" size="mini"
                      @click="showEditDialog(scope.row.id)"></el-button>
                     <!--删除按钮-->
                     <el-button type="danger" icon="el-icon-delete" size="mini" 
                     @click="removeUserById(scope.row.id)"></el-button>
                     <!--分配角色按钮-->
                    <!--el-tooltip是鼠标移到按钮上面会出现提示用的-->
                     <el-tooltip effect="dark" content="分配角色" placement="top" 
                     :enterable="false" >
                    <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
                    </el-tooltip>
                 </template>
             </el-table-column>
        </el-table>
        <!--分页区域,current-page是当前页码值-->
             <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1 ,2 ,5 ,10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>
        <!--添加用户的对话框，@closed="addDialogClosed"是为了重置而设置的-->
            <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="50%" @closed="addDialogClosed">
            <!--内容主体区域，添加用户的表单-->
            <el-form :model="addForm" :rules="addFormrules"
             ref="addFormRef"
             label-width="70px">
            <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
            </el-form>
            <!--底部区域-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
            </el-dialog>
         <!--修改用户对话框,@closed是关闭对话框时（动画）触发的-->
            <el-dialog
            title="修改用户"
            :visible.sync="editDialogVisible"
            width="50%" @closed="editDialogClosed">
            <!--修改用户内容主体区域，修改用户的表单-->
            <el-form :model="editForm" :rules="editFormrules" ref="editFormRef"
             label-width="70px">
            <el-form-item label="用户名" >
            <el-input v-model="editForm.username" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
            
            </el-form>
            <!--修改用户底部区域-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
            </el-dialog>
            <!--分配角色的对话框-->
            <el-dialog
            title="分配角色"
            :visible.sync="setRoleDialogVisible"
            width="50%"
            @close="setRoleDialogClosed">
            <!--内容主体区域，添加用户的表单-->
           <div>
               <p>当前的用户：{{userInfo.username}}</p>
               <p>当前的角色：{{userInfo.role_name}}</p>
               <p>分配新角色：
                <el-select v-model="selectedRoleId"
                 placeholder="请选择">
                <el-option
                v-for="item in rolelist"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
                </el-option>
                </el-select>
               </p>
            </div>
            <!--底部区域-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </span>
            </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        //验证邮箱规则
        var checkEmail = (rule,value,callback) => {
            //验证邮箱的正则表达式
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if(regEmail.test(value)){
                //合法的邮箱
                return callback()
            }
            callback(new Error('请输入合法的邮箱'))
        }
        //验证手机号的规则
        var checkMobile = (rule,value,callback) => {
            //验证手机号的正则表达式
            const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            if(regMobile.test(value)){
                return callback()
            }
            callback(new Error('请输入合法的手机号'))
        }

        return{
            queryInfo:{
                query:'',
                //当前页数
                pagenum:1,
                //当前每页显示多少条数据
                pagesize:2,
            },
            userlist:[],
            total:0,
            //控制添加用户对话框的显示与隐藏
            addDialogVisible:false,
            //控制修改用户对话框的显示与隐藏
            editDialogVisible:false,
            //添加用户的表单数据
            addForm:{
                username:'',
                password:'',
                email:'',
                mobile:'',
            },
            //修改用户的表单验证规则
            editFormrules:{
                email:[
                    {required:true,
                    message:'请输入邮箱',
                    trigger:'blur',
                    },
                    {
                        validator:checkEmail,
                        trigger:'blur',
                    }
                ],
                mobile:[
                    {
                        required:true,
                        message:'请输入手机号',
                        trigger:'blur',
                    },
                    {
                        validator:checkMobile,
                        trigger:'blur',
                    }
                ],
            },
            //修改用户的表单数据,把获取到的数值封装在这个form表单里
            editForm:{

            },
            //添加表单的验证规则对象
            addFormrules:{
                username:[
                    {
                        required:true,
                        message:'请输入用户名' ,
                        trigger:'blur',
                    },
                    { min: 3, max: 10,
                     message: '用户名的长度在3~10个字符之间', 
                     trigger: 'blur'
                    }
                ],
                password:[
                     {
                        required:true,
                        message:'请输入密码' ,
                        trigger:'blur',
                    },
                    { min: 6, max: 15,
                     message: '密码的长度在6~15个字符之间', 
                     trigger: 'blur'
                    }
                ],
                email:[
                    {
                        required:true,
                        message:'请输入邮箱',
                        trigger:'blur'
                    },
                    {
                        validator:checkEmail, trigger:'blur'
                    }                  
                ],
                mobile:[
                    {
                    required:true,
                    message:'请输入手机号',
                    trigger:'blur'        
                    },
                    {
                        validator:checkMobile, trigger:'blur'
                    }
                ],
            },
            //控制分配角色对话框的显示与隐藏
            setRoleDialogVisible:false,
            //需要被分配角色的用户信息,用大括号
            userInfo:{},
            //所有角色的数据列表
            rolelist:[],
            //已选中的角色Id值
            selectedRoleId:''
        }
        
    },
    created(){
        this.getUserList()
    },
    methods:{
        async getUserList(){
            const {data:res} = await this.$http.get('users',{params:this.queryInfo })
           if(res.meta.status !== 200){
               return this.$message.error('获取用户列表失败')
           }
            this.userlist = res.data.users
            this.total = res.data.total
            console.log(res)
        },
        
        //监听 pagesize 改变的事件（即每页展示的数据条数）
        handleSizeChange(newSize){
         console.log(newSize)
            this.queryInfo.pagesize = newSize
            this.getUserList()
        },
        //监听页码值改变的事件
        handleCurrentChange(newPage){
            console.log(newPage)
            this.queryInfo.pagenum = newPage
            this.getUserList()
        },
        //监听switch开关状态的改变
       async userStateChanged(userinfo){
            console.log(userinfo)
            //put里面的使用的是反引号，就是esc下面的第一个键，
            //双击两下就可以打出来，如果没有用反引号，会出现id必须是数值的报错
            const{data:res}  = await this.$http.put(`users/
            ${userinfo.id}/state/${userinfo.mg_state}`)
            if(res.meta.status !== 200){
                userinfo.mg_state = ! userinfo.mg_state
                return this.$message.error('更新用户状态失败！')
            }
            this.$message.success('更新用户状态成功！')
        },
        //监听添加用户对话框的关闭事件
        addDialogClosed(){
            this.$refs.addFormRef.resetFields()
        },
        //点击按钮，添加新用户
        //valid是匿名函数【(valid)=> {}】的形式参数;匿名函数作为函数validate的实际参数；
        //validate函数执行时，会为valid这个形式参数赋值。具体就是，validate函数执行时, 会在某一时刻执行匿名函数，并为valid赋值。如果validate校验为true, 执行匿名函数时valid赋值为true；
        //如果validate校验为false，执行匿名函数时valid赋值为false。
        //js自带的方法sort方法，参数可以为compare函数，可以作为类比。var newArr = [1,3,13,4].sort((num1, num2) => num1 - num2); 这里的num1, num2跟valid效果一样。
        addUser(){
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid) return
                //可以发起添加用户的网络请求
                const {data:res} = await this.$http.post('users',this.addForm)
                if(res.meta.status !== 201){
                    this.$message.error('添加用户失败！')
                }
                this.$message.success('添加用户成功！')
                 //隐藏添加用户对话框
                this.addDialogVisible = false
                //重新获取用户列表数据
                this.getUserList()
            })
        },
        //展示编辑用户的对话框
       async showEditDialog(id){
          //  console.log(id)
          //'users/'+id在这里需要字符串，所以在'users/这里添加成+id
         //发起get请求获取id所对应的数值
         const{data:res} = await this.$http.get('users/'+id)
         if(res.meta.status !==200){
             this.$message.error('查询用户信息失败！')
         }
         this.editForm = res.data
         this.editDialogVisible = true
        },
        //监听修改用户对话框的关闭事件
        editDialogClosed(){
            this.$refs.editFormRef.resetFields()
        },
        //修改用户信息并提交（表单的预验证）
        editUserInfo(){
            this.$refs.editFormRef.validate(async valid =>{
                //console.log(valid)
                if(!valid) return 
                //发起修改用户信息的数据请求
                const {data:res} = await this.$http.put('users/'+this.editForm.id,{
                    email:this.editForm.email,
                    mobile:this.editForm.mobile,
                })
                //console.log(res)
                if(res.meta.status!==200){
                    this.$message.error('更新用户信息失败！')
                }
                //关闭对话框
                this.editDialogVisible=false
                //刷新数据列表
                this.getUserList()
                //提示修改成功
                this.$message.success('更新用户信息成功！')
            },)
        },
        //根据id删除对应的用户信息
        async removeUserById(id){
            //弹框询问用户是否删除数据,confirm需要原型挂载蔡可以使用，因为this表示当前组件，
            //把confirm挂载到vue上，才可以使用
            //通过打印确定是否为promise,一个函数的返回值是promise（peding),
            //可以使用async+await形式进行改造简化
            //const res = this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            //confirmButtonText: '确定',
            //cancelButtonText: '取消',
            //type: 'warning'
            //})
             const confirmResult = await this.$confirm(
            '此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }
            //捕获错误，同时错误操作只有一个，可以简写为  ).catch(err => err)，同时确定了错误的话
            //返回值为字符串cancel(就是点击取消时，系统会捕获抛出的错误)
            ).catch(error =>{
                return error
            })
            //如果用户确认删除，则返回值为字符串 confirm
            //如果用户取消了删除，则返回值是字符串cancel
            //console.log(confirmResult)
            //打印确认函数返回值是否为promise
            //console.log(res)
            if(confirmResult !=='confirm'){
                return this.$message.info('已取消删除')
            }
            const{data:res} = await this.$http.delete('users/'+id)
            if(res.meta.status !== 200){
                 return this.$message.error('删除用户失败！')
            }
            this.$message.success('删除用户成功！')
            this.getUserList()
            

           // console.log('确认了删除') 
        /* 这是then和catch的，then正确通过,错误由catch来捕获的方法
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        }); */
        },
        //展示分配角色的对话框
        async setRole(userInfo){
            this.userInfo = userInfo
            //在展示对话框之前获取到所有角色的信息
            const {data:res} = await this.$http.get('roles')
            console.log(this.userInfo)
            if(res.meta.status !== 200){
                return this.$message.error('获取角色列表失败！')
            }
            this.$message.success('获取角色列表成功！')
            this.rolelist = res.data
            this.setRoleDialogVisible=true 
        },
        //点击按钮，分配角色
        async saveRoleInfo(){
            //先判断是否有选中值，如果没有，则。。。
            if(!this.selectedRoleId){
                return this.$message.error('请选择要分配的角色！')
            }
           const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId})
           if(res.meta.status !==200){
               return this.$message.error('更新角色失败！')
           }
           this.$message.success('更新角色成功！')
           this.getUserList()
           this.setRoleDialogVisible=false
        },
        //监听分配角色对话框的关闭事件
        setRoleDialogClosed(){
            //将selectedRoleId里面的值重新置为空
            this.selectedRoleId = ''
            this.userInfo = {}
        }
    }
}
</script>
<style lang="less" scoped>

</style>