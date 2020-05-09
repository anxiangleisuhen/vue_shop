<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片视图区域-->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容"
                     v-model="queryInfo.query" 
                     clearable @clear="getGoodsList">
                        <!-- @click="handleCurrentChange(1);getGoodsList" 调用这个办法是解决用户没有在第一页发起搜索请求时查找不到数据的问题，
                        强制触发当前页码值为1的函数之后再调用获取相应数值的办法 -->
                    <el-button slot="append" icon="el-icon-search"
                      @click="handleCurrentChange(1);getGoodsList"></el-button>
                </el-input>
                </el-col>
                <el-col :span="4">
                <el-button type="primary" @click="goAddpage">添加商品</el-button>
                </el-col>
            </el-row>
            <!-- table 表格区域 -->
            <el-table :data="goodslist"  :border="true" stripe>
                <el-table-column type="index" label="#">
                </el-table-column>
                <el-table-column label="商品名称" prop="goods_name">
                </el-table-column>
                <el-table-column label="商品价格（元）" prop="goods_price" width="95px">
                </el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="70px">
                </el-table-column>
                <el-table-column label="创建时间" prop="add_time" width="140px">
                    <template v-slot="scope">
                        {{scope.row.add_time | dataFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200px">
                    <template v-slot="scope">
                        <el-button type="warning" icon="el-icon-edit" size="mini" @click="editgoods(scope.row.goods_id)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeId(scope.row.goods_id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>
<script>
export default {
    data(){
        return{
            //查询参数对象
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10,
            },
            //商品列表
            goodslist:[],
            //总数据条数
            total:0,
           /*  获取修改商品信息的列表数据
            editgoodslist:[] */
        }
    },
    created(){
        this.getGoodsList()
    },
    methods:{
        //根据分页获取对应的商品列表
        async getGoodsList(){
          const{data:res} = await  this.$http.get('goods',{params:this.queryInfo})
          if(res.meta.status !== 200){
              return this.$message.error('获取商品列表失败！')
          }
          this.$message.success('获取商品列表成功！')
          console.log(res)
          this.goodslist = res.data.goods
          this.total = res.data.total
        },
        //pagesize 即每页展示的数据条数
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getGoodsList()
        },
        //pagenum 是当前的页码值
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getGoodsList()
        },
        //删除商品信息
        async removeId(id){
          const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error=>{
            return error
        })
        if(confirmResult !=='confirm'){
            return this.$message.info('已取消删除！')
        }
        const {data:res} = await this.$http.delete(`goods/${id}`)
        if(res.meta.status !== 200){
            return this.$message.error('删除商品失败！')
        }
        this.$message.success('删除商品成功！')
        this.getGoodsList()
        },
        //添加商品跳转功能
        goAddpage(){
            this.$router.push('/goods/add')
        },
        /* //查询商品信息,为了尝试带参数跳转页面，这个在本页面获取到数据的方法先不用
         async editgoods(goods_id){
           const {data:res} = await this.$http.get(`goods/${goods_id}`)
          if(res.meta.status !== 200){
              return this.$message.error('获取商品数据失败！') 
          }
          this.editgoodslist = res.data
          console.log(this.editgoodslist) 
          //console.log(goods_id)
        }*/
        //成功完成带参数的跳转页面
        editgoods(id){
            console.log("查询成功",id);
            this.$router.push({
                path:'/goods/editpaper',
                query:{
                    id:id
                }
            }
            );
        }
    }
}
</script>
<style lang="less" scoped>

</style>