<template>
    <div><!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片视图区域-->
        <el-card>
            <!--警告区域-->
             <el-alert  show-icon title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false"></el-alert>
             <!--选择商品分类区域-->
             <el-row class="cat_opt">
                 <el-col>
                     <span>选择商品分类:</span>
                     <!-- 选择商品分类的级联选择框.props 是级联选择框的配置对象-->
                       <el-cascader
                        v-model="selectedCateKeys"
                        :options="catelist"
                        :props="{ expandTrigger: 'hover', value:'cat_id',label:'cat_name',children:'children' }"
                        @change="handleChange"></el-cascader>
                 </el-col>
            </el-row>
            <!--tab  页签区域-->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <!-- 添加动态参数的面板-->
                <el-tab-pane label="动态参数" name="many">
                 <!-- 添加参数的按钮  :disabled="isBtnDisabled" -->
                    <el-button type="primary" size="mini"
                     :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
                    <!-- 动态参数的表格-->
                    <el-table :data="manyTableData" :border="true" stripe>
                        <!--展开列-->
                        <el-table-column type="expand">
                            <!-- 循环渲染Tag标签 -->
                            <template v-slot="scope">
                                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="hamdleClose(i,scope.row)">
                                    {{item}}
                                </el-tag>
                                <!-- 输入的文本框，v-if="inputVisible" 是进行按钮和输入框的切换的布尔什值；
                                v-model="inputValue" 是绑定输入的数据 -->
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                    >
                                    </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>  
                            </template>
                        </el-table-column>
                        <!--索引列-->
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template v-slot="scope">
                                <!-- {{scope.row}} -->
                                <el-button size="mini" type="warning" 
                                icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" size="mini" 
                                icon="el-icon-delete"
                                 @click="deleteParams(scope.row.attr_id)">删除</el-button> 
                            </template>
                        </el-table-column>
                        </el-table>
                </el-tab-pane>
                <!-- 添加静态属性的面板-->
                <el-tab-pane label="静态属性" name="only">
                    <!-- 添加参数的按钮 
                    可以直接在这里判断，对于比较多按钮，可能会比较简洁
                    :disabled="selectedCateKeys.length <3或者
                    :disabled="selectedCateKeys.length ！== 3-->
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true" >添加属性</el-button>
                    <!-- 静态属性的表格-->
                    <el-table :data="onlyTableData" :border="true" stripe>
                        <!--展开列-->
                        <el-table-column type="expand">
                            <!-- 循环渲染Tag标签 -->
                            <template v-slot="scope">
                                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="hamdleClose(i,scope.row)">
                                    {{item}}
                                </el-tag>
                                <!-- 输入的文本框，v-if="inputVisible" 是进行按钮和输入框的切换的布尔什值；
                                v-model="inputValue" 是绑定输入的数据 -->
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                    >
                                    </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>  
                            </template>
                        </el-table-column>
                        <!--索引列-->
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template v-slot="scope">
                                <el-button size="mini" type="warning" icon="el-icon-edit" 
                                 @click="showEditDialog(scope.row.attr_id)" >编辑</el-button>
                                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                        </el-table>
                    </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 添加参数的对话框-->
            <el-dialog
            :title="'添加' + titleText"
            :visible.sync="addDialogVisible"
            width="50%" @close="addDialogClosed">
                <el-form :model="addForm" :rules="addFormRules" 
                ref="addFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
                </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
            </el-dialog>
        <!-- 修改按钮的对话框-->
            <el-dialog
                :title="'修改' + titleText"
                :visible.sync="editDialogVisible"
                width="50%" @close="editDialogClosed">
                    <el-form :model="editForm" :rules="editFormRules" 
                    ref="editFormRef" label-width="100px">
                    <el-form-item :label="titleText" prop="attr_name">
                        <el-input v-model="editForm.attr_name"></el-input>
                    </el-form-item>
                    </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editParams">确 定</el-button>
                </span>
                </el-dialog>
        </div>
</template>
<script>
export default {
    data(){
        return{
            //商品列表数据表
            catelist:[],         
           //级联选择框双向绑定到的数组
            selectedCateKeys:[],
            //被激活的页签的名字
            activeName:'many',
            //动态参数的数据
            manyTableData:[],
            //静态属性的数据
            onlyTableData:[] ,
            //控制添加对话框的显示和隐藏
            addDialogVisible:false,
            //添加参数的表单数据对象
            addForm:{
                attr_name:'',
            },
            //添加表单的验证规则对象
            addFormRules:{
                attr_name:[
                    {required: true , message:'请输入参数名称', trigger : 'blur'}
                ]
            },
            //控制修改按钮的对话框的显示与隐藏
            editDialogVisible:false,
            //修改的表单数据对象
            editForm:{},
            //修改变淡的验证规则
            editFormRules:{
                attr_name:[
                    {required: true , message:'请输入参数名称', trigger : 'blur'}
                ]
            },      
        }
    },
    created(){
        this.getCateList()

    },
    methods:{
        //获取所有商品的分类列表
        async  getCateList(){
            const {data:res} = await this.$http.get('categories')
            if(res.meta.status !== 200){
                return this.$message.error('获取列表失败！')
            }
            this.catelist = res.data
            console.log(this.catelist)
        },
        //获取参数的列表数据
        async getParanmsData(){
            //证明选中的不是三级分类
            if(this.selectedCateKeys.length !== 3){
                this.selectedCateKeys = []
                return
            }
            //证明选中的是三级分类
            console.log(this.selectedCateKeys)
            //根据所选分类的ID，和当前所处的面板，获取对应的参数
           const{data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
            if(res.meta.status !== 200){
                return this.$message.error('获取列表失败！')
            }
            //将attr_vals这个字符串转化成数组输出，同时判断是否为空字符串，
            //如果为空，则输出空字符串
            res.data.forEach(item =>{
                   item.attr_vals =  item.attr_vals ? item.attr_vals.split(' ') :[]
                   //控制文本框的显示与隐藏
                   item.inputVisible = false
                   //文本框中输入的值
                   item.inputValue=''
                }) 
            console.log(res.data)
            if(this.activeName  === 'many'){
                this.manyTableData = res.data
            }else{
                this.onlyTableData = res.data
            }
        },
        //级联选择框选中发生变化时，会触发这个函数
        handleChange(){
            this.getParanmsData()
            this.manyTableData = []
            this.onlyTableData = []
            
        },    
        // tab页签点击事件的处理函数
        handleTabClick(){
            console.log(this.activeName) 
            this.getParanmsData() 
            this.addDialogVisible = false 
        },
        //监听添加对话框的关闭事件
        addDialogClosed(){
            this.$refs.addFormRef.resetFields()
        },
        //点击按钮，添加参数
        addParams(){
            this.$refs.addFormRef.validate(async valid =>{
                if(!valid) return
                const {data:res} = await 
                this.$http.post(`categories/${this.cateId}/attributes`,
                {attr_name:this.addForm.attr_name,
                attr_sel:this.activeName})
                if(res.meta.status !== 201){
                return this.$message.error('添加参数失败！')
            }
            this.$message.success('添加参数成功！')
            this.getParanmsData()
            this.addDialogVisible = false
            })
        },
        //点击按钮，展示修改对话框
        async showEditDialog(attr_id){
            const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,
            {
                params:{attr_sel:this.activeName}
            })
            if(res.meta.status !== 200){
                return this.$message.error('获取数据失败！')
            }
            this.editForm = res.data
            this.editDialogVisible = true
        },
        //重置修改的表单数据
        editDialogClosed(){
            this.$refs.editFormRef.resetFields()
        },
        //点击表单，修改参数信息
        editParams(){
            this.$refs.editFormRef.validate(async valid=>{
                if(! valid)return
            const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
            {
                attr_name:this.editForm.attr_name,
                attr_sel:this.activeName
            })
            if(res.meta.status !== 200){
                return this.$message.error('修改数据失败！')
            }
            this.$message.success('修改数据成功！')
            this.getParanmsData()
            this.editDialogVisible = false
            })
        },
        //删除参数的按钮的函数
        async deleteParams(attr_id){
            const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error =>{
            return error}
        )
        if(confirmResult !== 'confirm'){
            return this.$message.info('已取消删除！')
        }
        const {data:res} = await this.$http.
        delete(`categories/${this.cateId}/attributes/${attr_id}`)
        if(res.meta.status !== 200){
            return this.$message.error('删除失败！')
        }
        this.$message.success('删除成功！')
        this.getParanmsData()
        },
        //删除对应参数的可选项
        hamdleClose(i,row){
            row.attr_vals.splice(i,1)
            this.saveAttrVals(row)
        },
        //文本框失去的焦点，或摁下了 enter 都会触发，而trim这个函数是去除字符串两端的空格
        handleInputConfirm(row){
            if(row.inputValue.trim().length === 0)
            {
                row.inputValue = ''
                row.inputVisible = false
                return
            }
            //如果没有写return ，则证明输入了内容，需要做后续处理
            //将获取到的数值oush到attr_vals中
            row.attr_vals.push(row.inputValue.trim())
            row.inputValue = ''
            row.inputVisible = false
            this.saveAttrVals(row)
        },
        //将对 Attr_vals 的操作，保存到数据库中
        async saveAttrVals(row){
            //需要发起请求，保存这次操作
             const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
            {
                attr_name:row.attr_name,
                attr_sel:row.attr_sel,
                //将获得的数组封装成以空格分开的字符串
                attr_vals:row.attr_vals.join(' ')
            })
            if(res.meta.status !== 200){
                return this.$message.error('添加参数项失败！')
            }
            this.$message.success('添加参数成功！')
            /* this.getParanmsData() */
        },
        //点击按钮，展示文本框
        showInput(row){
            row.inputVisible = true
            //让文本框自动获得焦点
            // $nextTick 方法的作用，就是当页面上的元素被重新渲染之后，
            //才会指定回调函数中的代码，第二个$ref是原生的dom对象的引用
            this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
        });
        }
    },
    //计算属性，用来计算简化页面
    computed:{
        //如果按钮需要被禁用，则返回true，否则返回false
         isBtnDisabled(){
            if(this.selectedCateKeys.length !== 3){
                return true
            }
            return false
        },
        //当前选中的三级分类的id
        cateId(){
            if(this.selectedCateKeys.length === 3){
                return this.selectedCateKeys[2]
            }
            return null
        } ,
        //动态计算标题的文本
        titleText(){
            if(this.activeName ==='many'){
                return '动态参数'
            }else{
            return '静态属性'}
        }
    }
}
</script>
<style lang="less" scoped>
.cat_opt{
    margin:15px 0,
}
.el-tag{
    margin:10px;
}
.input-new-tag{
    width:120px;
}
</style>