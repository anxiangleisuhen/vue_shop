<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片视图区域-->
        <el-card>
            <!-- 搜索框区域 -->
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容"
                    v-model="queryInfo.query">
                        <el-button slot="append" 
                        icon="el-icon-search"
                         @click="handleSizeChange(1);getOrderList"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 表格区域-->
             <el-table
             :border="true"
                :data="orderlist"
                stripe
                style="width: 100%">
                <el-table-column type="index" label="#">
                </el-table-column>
                <el-table-column prop="order_number" label="订单编号">
                </el-table-column>
                <el-table-column prop="order_price" label="订单价格" width="80">
                </el-table-column>
                <el-table-column prop="order_pay" label="是否付款" width="100">
                    <!--使用作用域插槽对等级进行分别渲染-->
                    <template v-slot="scope">
                        <el-tag type="danger" v-if="scope.row.order_pay === '0'">未付款</el-tag>
                        <el-tag type="success" v-else>已付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="is_send" label="是否发货" width="80">
                </el-table-column>
                <el-table-column prop="create_time" label="下单时间" width="230">
                    <template v-slot="scope">
                        {{scope.row.create_time | dataFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template v-slot="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini"
                    @click="showBox(scope.row.order_id)"></el-button>
                    <el-button type="success" icon="el-icon-location" size="mini"
                    @click="showprogressbox"></el-button>
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
        <!-- 展示修改地址的对话框 -->
            <!-- <el-dialog
                title="修改信息"
                :visible.sync="dialogVisible"
                width="50%" @close="addressclosed">
                <el-form :model="editForm" :rules="editFormrules"
                 ref="ruleFormref"
                 label-width="100px" >
                    <el-form-item label="省市区/县" prop="address1">
                         <el-cascader
                            v-model="editForm.address1"
                            :options="cityData"
                            :props="{ expandTrigger: 'hover' }">
                            </el-cascader>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="address2">
                        <el-input v-model="editForm.address2"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
            </el-dialog> -->
            <el-dialog
                title="修改订单信息"
                :visible.sync="dialogVisible"
                width="50%" @close="addressclosed">
                <el-form :model="editForm" :rules="editFormrules"
                 ref="ruleFormref"
                 label-width="100px" >
                    <el-form-item label="订单id" prop="order_id">
                        <el-input v-model="editForm.order_id"></el-input>
                    </el-form-item>
                    <el-form-item label="订单编号" prop="order_number">
                        <el-input v-model="editForm.order_number"></el-input>
                    </el-form-item>
                    <el-form-item label="订单价格" prop="order_price">
                        <el-input v-model="editForm.order_price"></el-input>
                    </el-form-item>
                    <el-form-item label="创建时间" prop="create_time">
                        <el-input v-model="editForm.create_time"></el-input>
                    </el-form-item>
                    <el-form-item label="是否已送" prop="is_send">
                        <el-input v-model="editForm.is_send"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editopen">确 定</el-button>
                </span>
            </el-dialog> 
            <!-- 展示物流进度的对话框 -->
            <el-dialog
                title="物流进度"
                :visible.sync="progressdialogVisible"
                width="50%">
                <!-- 时间线 -->
                 <el-timeline>
                    <el-timeline-item
                    v-for="(activity, index) in progressInfo"
                    :key="index"
                    :timestamp="activity.time">
                    {{activity.context}}
                    </el-timeline-item>
                </el-timeline>
            </el-dialog>
    </div>
</template>
<script>
import cityData from './citydata.js'
export default {
    data(){
        return {
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10,
            },
            orderlist:[],
            total:0,
            dialogVisible:false,
            editForm:{
               /*  /* 第一个是级联选择器的，所以是数组
                address1:[],
                address2:''
                */
            },
            editFormrules:{
               /*  address1:[
                    {required:true,
                    message:'请选择省市区/县',
                    trigger:'blur',
                    }
                ],
                address2:[
                    {required:true,
                    message:'请填写详细地址',
                    trigger:'blur',
                    }
                ], */
            },
            cityData:cityData,
            progressdialogVisible:false,
            progressInfo:[]
        }
    },
    created(){
        this.getOrderList()
    },
    methods:{
        //获取订单列表
        async getOrderList(){
           const {data:res} = await this.$http.get(`orders`,{params:this.queryInfo})
           if(res.meta.status !== 200){
               return this.$message.error('获取订单列表数据失败！')
           }
           //确认是否正确获取数据
           console.log(res)
           this.orderlist = res.data.goods
           this.total= res.data.total
        },
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getOrderList()
        },
        handleCurrentChange(newNum){
            this.queryInfo.pagenum = newNum
            this.getOrderList()
        },
        async showBox(id){
            const {data:res} = await this.$http.get(`orders/${id}`)
            this.editForm = res.data
            console.log(this.editForm)
            this.dialogVisible = true
        },
        addressclosed(){
            this.$refs.ruleFormref.resetFields()
        },
        async showprogressbox(){
            const {data:res} = await 
            this.$http.get(`/kuaidi/1106975712662`)
            if(res.meta.status !== 200){
                return this.$message.error('获取物流进度失败')
            }
            console.log(res)
            this.$message.success('获取成功')
            this.progressInfo = res.data
            console.log(this.progressInfo)
            this.progressdialogVisible = true
        }, 
        async editopen(){
            const{data:res} = await this.$http.put(`orders/`+this.editForm.order_id,{
                is_send:this.editForm.is_send,
                order_pay:this.editForm.order_pay,
                order_price:this.editForm.order_price,
                order_number:this.editForm.order_number,
                pay_status:this.editForm.pay_status
            })
            if(res.meta.status !== 201){
                return this.$message.error('提交失败')
            }
            this.$message.success('提交成功')
            this.dialogVisible = false
            console.log(res)
        }       
    }
}
</script>
<style lang="less" scoped>
.el-cascader{
    width:100%
}
</style>