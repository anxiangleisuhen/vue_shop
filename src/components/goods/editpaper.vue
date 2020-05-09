<template>
    <div>
        <el-form :model="editgoodslist" :rules="editRuleForm" ref="editRuleFormRef" :label-position="labelPosition" label-width="80px" >
            <el-form-item label="商品 ID">
                <el-input v-model="editgoodslist.goods_id"></el-input>
            </el-form-item>
            <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="editgoodslist.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="goods_price">
                <el-input v-model="editgoodslist.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
                <el-input v-model="editgoodslist.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
                <el-input v-model="editgoodslist.goods_weight"></el-input>
            </el-form-item> 
            <!-- 这里我还不懂怎么展示图片以及修改 -->
            <el-form-item label="商品介绍" prop="goods_introduce">
                <el-input v-model="editgoodslist.goods_introduce" width="200"></el-input>
            </el-form-item>
            <el-form-item>
            <el-button type="primary" class="btn" @click="submitForm">提交</el-button>  
            </el-form-item> 
        </el-form>
    </div>
</template>
<script>
export default {
    data(){
        return{
            //获取商品列表数据表单
            editgoodslist:[],
            //接收传进来的参数id
            gid:this.$route.query.id,
            //编辑表单的数据
            editForm:[],
            //表单校验规则
            editRuleForm:{
                goods_name:[],
            }
        }
    },
    created(){
        this.getId()
    },
    methods:{
        //获取跳转的具体id 值
        getId(){ 
            console.log("接收过来的值为："+ this.$route.query.id)
            console.log(this.gid)
            this.editgoods(this.gid)
    },
         //查询商品信息
         async editgoods(gid){
             //console.log(gid)
           const {data:res} = await this.$http.get(`goods/${gid}`)
          if(res.meta.status !== 200){
              return this.$message.error('获取商品数据失败！') 
          }
          this.editgoodslist = res.data
          console.log(this.editgoodslist) 
          //console.log(goods_id)
        },
       /*  async submitForm(){
            console.log(this.editgoodslist)
            const {data:res} = await this.$http.put(`goods/`+this.editgoodslist.goods_id,{
                goods_name:this.editgoodslist.goods_name,
                goods_price:this.editgoodslist.goods_price,
                goods_number:this.editgoodslist.goods_number,
                goods_weight:this.editgoodslist.goods_weight,
                goods_introduce:this.editgoodslist.goods_introduce,
                attr_sel:this.editgoodslist.attrs.attr_sel
            })
            console.log(res)
        } */
    }

}
</script>
<style lang="less" scoped>
.el-input{
    width:90%
}
</style>
