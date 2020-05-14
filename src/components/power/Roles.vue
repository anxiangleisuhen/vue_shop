<template>
    <div>
    <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片视图区域-->
        <el-card>
            <!--添加角色按钮区域-->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addroleDialogVisible=true">添加角色</el-button>
                </el-col>
            </el-row>
            <!--角色列表区域-->
            <el-table :data="rolelist" :border="true" :stripe="true" >
                <!--展开列-->
                <el-table-column type="expand">
                    <template v-slot="scope">
                       <!--  测试是否可以获取相应数据
                        {{scope.row}} -->
                       <!--  pre标签可以使获得的数据模块变成有序列化，可以看的清晰
                        pre 元素可定义预格式化的文本。被包围在 pre 元素中的文本通常会保留空格和换行符。而文本也会呈现为等宽字体
                        <pre>
                            {{scope.row}}
                        </pre> -->
                        <!-- 视频是 v-for="(item1.i1),有两个参数的情况 / 第一参数为内容 / 第二参数为键值Key,
                        其中i1只是用来标识的,我理解为遍历item2,i3代表他遍历的子项数目，即树形结构-->
                        <el-row 
                        :class="['bdbottom',i1 === 0 ? 'bdtop' : '']"
                        v-for="(item1,i1) in scope.row.children"
                        :key="item1.id">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag>{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级和三级权限 -->
                            <el-col :span="19">
                                <el-row
                                :class="[i2===0 ? '' : 'bdtop', 'vcenter']"
                                v-for="(item2,i2) in item1.children"
                                :key="item2.id">
                                <el-col :span="6" >
                                   <!--  渲染二级权限 -->                                  
                                        <el-tag type="success">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!-- 渲染三级权限 -->
                                    <el-col :span="18" ><el-tag type="warning" v-for="item3
                                    in item2.children" :key="item3.id" closable 
                                    @close="removeRightByid(scope.row,item3.id)">{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column> 
                <!--索引列-->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template v-slot="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="editrole(scope.row.id)">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleterole(scope.row.id)">删除</el-button>
                        <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>    
                </el-table-column>              
            </el-table>
        </el-card>
        <!--添加角色的对话框-->
            <el-dialog
            title="添加角色"
            :visible.sync="addroleDialogVisible"
            width="50%">
            <!--内容主体区域，添加角色的表单-->
            <el-form :model="roleruleForm" ref="roleruleFormRef" label-width="100px">
            <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="roleruleForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="roleruleForm.roleDesc"></el-input>
            </el-form-item>
            </el-form>
            <!--底部区域-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addroleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addrole">确 定</el-button>
            </span>
            </el-dialog>
            <!--编辑角色的对话框-->
            <el-dialog
            title="编辑角色"
            :visible.sync="editroleDialogVisible"
            width="50%">
            <!--内容主体区域，编辑角色的表单-->
            <el-form :model="editroleform" ref="editroleruleFormRef" label-width="100px">
            <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editroleform.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editroleform.roleDesc"></el-input>
            </el-form-item>   
            <!-- 这是我用于测试数据库传的id命名是id还是roleid，因为可以获取到数据却提交不上去，显示提交路径与问题
            <el-form-item label="id" prop="id">
            <el-input v-model="editroleform.id"></el-input>
            </el-form-item> 
            <el-form-item label="id" prop="roleId">
            <el-input v-model="editroleform.roleId"></el-input>
            </el-form-item> 
            测试发现，如果是id，那么这个表格也获取不到id的值，所以名字为roleid，而不是id-->
            </el-form>
            <!--底部区域-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editroleDialogVisible = false">取 消</el-button>
             <el-button type="primary" @click="saveeditrole">确 定</el-button> 
            </span>
            </el-dialog>
             <!--分配权限的对话框,close是用来监听关闭事件-->
                <el-dialog
                title="分配权限"
                :visible.sync="setRightDialogVisible"
                width="50%" @close="setRightDialogClosed">
                <!--树形控件-->
                <el-tree :data="rightslist" :props="treeProps" 
                show-checkbox :default-expand-all="true" node-key="id"
                :default-checked-keys="defkeys" ref="treeRef"></el-tree>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="setRightDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="allotRights">确 定</el-button>
                </span>
                </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            //所有角色列表数据
            rolelist:[],
            //添加角色对话框的开关闭状态
            addroleDialogVisible:false,
            //添加角色表单的数据双向绑定表单
            roleruleForm:{
                roleName:'',
                roleDesc:'',
            },
            //控制编辑角色对话框的显示与隐藏
            editroleDialogVisible:false,
            editroleform:[],
            //控制分配权限对话框的显示与隐藏
            setRightDialogVisible:false,
            //所有权限的数据
            rightslist:[],
            //树形控件的属性绑定对象
            treeProps:{
                label:'authName',
                children:'children',
            },
            //默认选中的节点id数组
            defkeys:[],
            //当前即将分配权限的角色id
            roleId:''
        
        }
    },
    created(){
        this.getRolesList()
    },
    methods:{
        //获取所有角色列表
        async getRolesList(){
        const{data:res} = await this.$http.get('roles')
        if(res.meta.status!== 200){
            return this.$message.error('获取角色列表失败！')
        }
        this.rolelist = res.data
        //这里需要加上this，要不会报错
        //console.log(this.rolelist)         
        },
        //发起请求，将数据传到数据库中
            async addrole(){
            const {data:res} = await this.$http.post('roles',this.roleruleForm)
            console.log(res)
            if(res.meta.status !==201){
            this.$message.error('添加角色失败')
            }
            this.$message.success('添加角色成功')
            this.getRolesList()
            this.addroleDialogVisible=false
        },
        // 展示编辑角色的对话框
        async editrole(id){
            const{data:res} = await this.$http.get('roles/'+id)
            //console.log(res)
            if(res.meta.status !== 200){
                return this.$message.error('获取角色失败！')
            }
            this.editroleform = res.data
            this.editroleDialogVisible=true
            //this.$message.success('获取角色成功！')   
            //console.log(this.editroleform)        
        },
        //提交编辑角色信息
        async saveeditrole(){

            /*  this.$refs.editroleform.validate(async valid =>{
                //console.log(valid)
                if(!valid) return 
                //发起修改用户信息的数据请求 */

                //在这里，我出现一个bug，弄了好久，原因在于前面的用户管理传的是一个idput('roles/'+this.editroleform.id
                //而在这里，参数命名为roleid,put('roles/'+this.editroleform.roleId，所以一直报错路径找不到Id,即未定义
                //
            const {data:res} =await this.$http.put('roles/'+this.editroleform.roleId,{
                roleName:this.editroleform.roleName,
                roleDesc:this.editroleform.roleDesc,
            })
            //console.log(res)
                if(res.meta.status !==200){
                return this.$message.error('提交角色失败！')
            }
            this.$message.success('提交成功')
            this.editroleDialogVisible=false
            this.getRolesList()               
        },  
        //删除角色
        async deleterole(id){
            const deleterole = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(error=>{
                return error
            })
            //确定取消操作和确定操作的返回值字符串
            //console.log(deleterole)
            //确定返回值是否为promise(pending)对象，console.log(res)
            if(deleterole !=='confirm'){
                return this.$message.info('取消删除角色')
            }
                //发起删除请求
            const {data:res} = await this.$http.delete('roles/'+id)
            //打印获取到的数据
            //console.log(res)
                if(res.meta.status !== 200){
                return this.$message.error('删除角色失败！')
            }
            this.$message.success('删除角色成功！')
            this.getRolesList()
                            
        },
        //删除权限列表
        async removeRightByid(role,rightId){
        const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).catch(error=>{
            return error
        })
        if(confirmResult !== 'confirm'){
            return this.$message.info('取消了删除！')
        }
        //console.log('确认了删除')
        //这里delete请求要用反引号，表示字符串
        const{data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        //console.log(res)
        if(res.meta.status !== 200){
            return this.$message.error('删除权限失败！')
        }
        this.$message.success('删除权限成功！')
        //重新获取数据  this.getRolesList()为了防止页面整个刷新，可以把最新的数据赋给权限表单
        //对于是否可以取到具体数据，如id，我们可以通过作用域插槽获取看看，便能确定是否具有该数据
        role.children = res.data
        },
        //展示分配权限的对话框及获取相关数据  
        async showSetRightDialog(role){
            
            //获取所有权限的数据
            const {data:res} =await this.$http.get('rights/tree')
            //确定是否获取到数据   console.log(res)
            if(res.meta.status !==200){
                return this.$message.error('获取权限数据失败！')
            }
            //把获取到的权限数据保存到data中
            this.rightslist = res.data
            //console.log(this.rightslist)
            //递归获取三级节点的id
            this.getleafkeys(role,this.defkeys)
            //打开对话框
            this.setRightDialogVisible=true
            //将获取到的role保存在roleid中
            this.roleId = role.id

        },
        //通过递归的方式，获取到角色下所有三级权限的id，并保存到defkeys 数组中
        //node是我们的数据节点，而arr是一个数组
        getleafkeys(node,arr){
            if(!node.children){
                return arr.push(node.id)
            }
            node.children.forEach(item=>{
                this.getleafkeys(item,arr)
            })
        },
        //监听分配权限对话框的关闭事件
        setRightDialogClosed(){
            this.defkeys = []
        },
        //点击为角色分配权限
        async allotRights(){
            //定义数组获取到叶子节点的key和半选中节点的key, 包括 1，2，3级节点
            //...是Es6语法的展开运算符
            const keys = [
                //获取到叶子节点的key
                ...this.$refs.treeRef.getCheckedKeys(),
                //获取到半选中节点的key
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            //用join将叶子节点和半选中节点的key，并将数据传给idStr这个字符串
            const idStr = keys.join(',')
            //检查是否获取成功
            //console.log(keys)
            //发起请求,这里使用的是反引号
            const {data:res} = await this.$http.post(`roles/${this.roleId}
            /rights`, {rids:idStr})
            console.log(res)
             if(res.meta.status !== 200){
                return this.$message.error('分配权限失败！')
            }
            this.$message.success('分配权限成功！')
            this.getRolesList()
            this.setRightDialogVisible=false 
            
        }

    }
}
</script>
<style lang="less" scoped>
.el-tag{
    margin:7px;
}
.bdtop {
    border-top:1px solid #eee;
} 
/* 实线是solid，是个形容词，由于写成soild,名词实线，导致一直显示不出来样式，找了好久 */
.bdbottom {
    border-bottom:1px solid #eee;
}
.vcenter{
    display:flex;
    align-items:center;
}
</style>