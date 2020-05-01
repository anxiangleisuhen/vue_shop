<template>
    <div>  <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片视图区域-->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addCateDialog">添加分类</el-button>
                </el-col>
            </el-row>
            <!--表格 -->
            <tree-table  :data="catelist" :columns="columns" :show-index="true" index-text="#" 
            :border="true" :show-row-hover="true" :expand-type="false" :selection-type="false">
            <!-- 自定义模板，使用作用域插槽,在这里不能使用v-slot，会报错
            但使用   <template #isok="scope">或者
                    <template slot="isok" slot-scope="scope">或者
                    <template slot="isok" scope="scope">或者
                    <template  v-slot:isok="scope">
                这样子表达是正确  -->
                <!--是否有效列 -->
            <template slot="isok" slot-scope="scope">
                <i class="el-icon-success" 
                v-if="scope.row.cat_deleted === false"
                style="color:lightgreen;"></i>
                <i class="el-icon-error" 
                style="color:red;"
                v-else></i>
            </template>
            <!--排序列 -->
            <template  slot="order" slot-scope="scope">
                <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                <el-tag size="mini" type="warning" v-else>三级</el-tag>          
            </template>
             <!--操作列 -->
            <template  slot="opt" slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editdialog(scope.row.cat_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deletedialog(scope.row.cat_id)">删除</el-button>       
            </template>
            </tree-table>
            <!--分页区域-->   
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="querInfo.pagenum"
            :page-sizes="[3, 5, 10, 15]"
            :page-size="querInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>
        <!--添加商品分类的对话框-->
            <el-dialog
            title="添加分类"
            :visible.sync="addCateDialogVisible"
            width="50%" @close="addCateDialogClosed">
            <el-form :model="addCateForm" :rules="addCateFormRules" 
            ref="addCateFormRef" 
            label-width="100px">
            <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类：">
                <!--options 用来指定数据源-->
                <!--props 用来指定配置对象,里面是级联选择器的配置对象,v-model必须是个数组，不能是个
                具体的值或者对象，把对应的id保存在一个数组里面-->
                 <el-cascader
                    v-model="selectedKeys"
                    :options="ParentCateList"
                    :props="{ expandTrigger: 'hover',value:'cat_id', label:'cat_name', 
                    children:'children', checkStrictly:true }"
                    @change="parentCateChange" :clearable="true"></el-cascader>
            </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
            </el-dialog>
            <!--修改分类对话框-->
           <el-dialog
            title="修改分类"
            :visible.sync="editdialogVisible"
            width="50%">
                <el-form ref="editFormRef" :model="editForm" label-width="100px">
                <el-form-item label="分类名称：">
                    <el-input v-model="editForm.cat_name"></el-input>
                </el-form-item>
                </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editchange">确 定</el-button>
            </span>
            </el-dialog>
        </div>
</template>
<script>
export default {
    data(){
        return{ 
            //查询条件
            querInfo:{
                type:3,
                pagenum:1,
                pagesize:5,
            },
            //商品分类的数据列表，默认为空
            catelist:[],
            //数据总数
            total:0,
            //为table指定列的定义
            columns:[
                    {
                    label: '分类名称',
                    prop: 'cat_name',
                },
                //是否有效
                {
                    label: '是否有效',
                    //表示，将当前列定义为模板列
                    type: 'template',
                    //表示当前这一列使用模板名称
                    template: 'isok',
                },
                //排序列
                {
                    label: '排序',
                    //表示，将当前列定义为模板列
                    type: 'template',
                    //表示当前这一列使用模板名称
                    template: 'order',
                },
                //操作列
                {
                    label: '操作',
                    //表示，将当前列定义为模板列
                    type: 'template',
                    //表示当前这一列使用模板名称
                    template: 'opt',
                },
            ] ,
            //控制添加商品分类对话框的显示与隐藏
            addCateDialogVisible:false,  
            //添加分类的表单数据对象
            addCateForm:{
                //将要添加分类的名称
                cat_name:'',
                //父级分类的ID
                cat_pid:0,
                //分类的等级，默认要添加的是1级分类
                cat_level:0,
            },
            //控制修改分类对话框的显示与隐藏
            editdialogVisible:false,          
            //将要添加分类的验证规则对象
            addCateFormRules:{
                cat_name:[
                    {required:true,message:'请输入分类名称'
                    ,trigger:'blur'}],
            },
            //父级分类的列表
            ParentCateList:[],
            //选中是父级分类的id数组
            selectedKeys:[],
            //修改分类的表单
            editForm:[]
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        //获取商品分类数据
        async getCateList(){
           const{data:res} = await this.$http.get('categories',{params:this.querInfo})
           if(res.meta.status !== 200){
               return this.$message.error('获取商品分类失败！')
           }
           //检查数据是否成功
           //console.log(res)
           //把数据列表，赋值给catelist
           this.catelist = res.data.result
           //为总数据条数赋值
           this.total = res.data.total
           console.log(res)
        },
        //监听pagesize的改变
        handleSizeChange(newSize){
            this.querInfo.pagesize = newSize
            this.getCateList()
        },
        //监听 pagenum 的改变
        handleCurrentChange(newPage){
            this.querInfo.pagenum = newPage
            this.getCateList()
        },
        //点击按钮，展示添加分类的对话框
        addCateDialog(){
            //先获取分级分类的数据列表
            this.getParentCateList()
            //再展示对话框
            this.addCateDialogVisible = true
        },
        //获取父级分类的数据列表
       async getParentCateList(){
           const {data:res} = await this.$http.get('categories',{params:{type:2}})
            if(res.meta.status!==200){
                return this.$message.error('获取父级分类数据失败！')
        }
        //console.log(res)
        this.ParentCateList = res.data
       },
       //选择项发生变化时触发这个函数
       parentCateChange(){
           console.log(this.selectedKeys)
           //如果 selectedKeys 数组中的length大于0，证明选中父级分类
           //反之，就说明没有选中任何父级分类
           if(this. selectedKeys.length>0){
               //父级分类的id,selectedKeys保存的是id值，
               //this.selectedKeys[this.selectedKeys.length-1]是获取到最小的父级id，
               //并将id赋值给新添加的数据的cat_pid
               this.addCateForm.cat_pid = this.selectedKeys[
                   this.selectedKeys.length-1]
               //console.log(this.selectedKeys.length)
              //console.log(this.addCateForm.cat_name)
               //console.log(this.addCateForm.cat_pid)
               //为当前分类的等级赋值
               this.addCateForm.cat_level = this.selectedKeys.length
               return
           }else{
               //父级分类的id
               this.addCateForm.cat_pid = 0
               //为当前分类的等级赋值
               this.addCateForm.cat_level = 0
           }
       },
       //点击按钮，添加新的分类
       addCate(){
           this.$refs.addCateFormRef.validate(async valid =>{
               if(!valid) return

               const {data:res} = await this.$http.post('categories',
               this.addCateForm)

               if(res.meta.status !== 201){
                   return this.$message.error('添加分类失败！')
               }

               this.$message.success('添加分类成功！')
               this.getCateList()
               this.addCateDialogVisible = false
               console.log(this.addCateForm.cat_pid)
           })
           //console.log(this.addCateForm)
       },
       //监听添加分类对话框的关闭事件，重置表单数据
       addCateDialogClosed(){
           this.$refs.addCateFormRef.resetFields()
           this.selectedKeys = []
           this.addCateForm.cat_pid = 0
           this.addCateForm.cat_level = 0
       },
       //点击按钮，显示修改分类对话框
        async editdialog(id){
            const {data:res} = await this.$http.get('categories/'+id)
            if(res.meta.status !== 200){
                return this.$message.error('获取列表失败！')
            }
            //console.log(res)
            this.editForm = res.data
            this.editdialogVisible = true
          //console.log(this.editForm)
       },
       //点击提交，修改分类的名称
      async  editchange(){
          const {data:res} = await  this.$http.put('categories/'+this.editForm.cat_id,{
               cat_name:this.editForm.cat_name
           })
           if(res.meta.status !== 200){
                return this.$message.error('修改分类失败！')
           }
           this.$message.success('修改分类成功！')
           this.getCateList()
           this.editdialogVisible = false
       },
       //删除分类的函数
        async deletedialog(id){
        const resw = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error=>{
            return error
        })
        if(resw !== 'confirm'){
            return this.$message.info('已取消删除！')
        }
        const{data:res} = await this.$http.delete('categories/'+id)
        if(res.meta.status !== 200){
            return this.$message.error('删除失败！')
        }
        this.$message.success('删除成功！')
        this.getCateList()
        //console.log(res)
        },     
    }
}
</script>
<style lang="less" scoped>
.el-button{
    margin-bottom:10px;
}
.el-cascader{
    width:100%;
}

</style>