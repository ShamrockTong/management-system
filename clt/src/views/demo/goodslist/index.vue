<template>
  <d2-container>
    <template slot="header">
      商品详情信息列表
      <el-button type="primary" @click="searchRes(input)" class="headerbutton">搜索</el-button>
      <el-input v-model="input" placeholder="请输入搜索内容" style="width:300px;float:right;"></el-input>
      <el-button type="primary" @click="reload" class="headerbutton">刷新列表</el-button>
      <el-button type="primary" @click="addNew" class="headerbutton">添加商品</el-button>
    </template>

      <!-- 底插槽 @input.native="searchRes($event.target.value)" -->
        <div slot="footer">
            <el-pagination
                background
                layout="prev, pager, next"
                :page-size="limit"
                :total="total"
                @current-change="handlePageChange"
             />
        </div>
    <el-table
      :data="goodsList"
      stripe
      style="width: 100%">
      <el-table-column
        prop="id"
        label="ID"
        width="100">
      </el-table-column>
      <el-table-column
        prop="name1"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="category"
        label="分类"
        width="180">
      </el-table-column>
      <el-table-column
        prop="action"
        label="操作"
        width="180">
        <template slot-scope="scope">
        <el-button type="info" size="medium"  @click="showEdDialog(scope.row)">编辑</el-button>
        <el-popover
                    placement="top"
                    width="200"
                    trigger="click">
                      <div>您是否确认删除该信息
                           <el-button size="mini" 
                           @click="doDel(scope.row);visible=false">确认</el-button>
                      </div>
                    <el-button slot="reference" type="danger" size="medium" style="margin-left:10px;"
                    @click="visible=true" 
                     >删除</el-button>
          </el-popover>
      </template>
      </el-table-column>
    </el-table>

    <!-- 新增 -->
    <el-dialog
          title="新增"
          :visible.sync="dialogVisible"
          width="600px"
          :before-close="addHandleClose"
          >
            <div>

              <el-form ref="form" :rules="Addrules" :model="form" label-width="80px">
                  <el-form-item label="商品名称" prop="name1">
                    <el-input v-model="form.name1"></el-input>
                  </el-form-item>
                 <el-form-item label="分类" prop="category">
                        <el-select v-model="form.category" placeholder="请选择">
                          <el-option
                            v-for="item in categoryOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.label">
                          </el-option>
                        </el-select>
                  </el-form-item>
                  <el-form-item label="售价" prop="mallPcPrice">
                    <el-input v-model="form.mallPcPrice"></el-input>
                  </el-form-item>

                  <el-form-item label="市场价" prop="marketPrice">
                    <el-input v-model="form.marketPrice"></el-input>
                  </el-form-item>
                </el-form>

            </div>

          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="onSubmit">确 定</el-button>
          </span>
        </el-dialog>

    <!-- 编辑 -->
      <el-dialog
          title="编辑"
          :visible.sync="ediDialog"
           width="600px"
          :before-close="handleClose"
          >
            <div>
              <el-form ref="editform" :rules="Editrules" :model="editform" label-width="80px">
                  <el-form-item label="id" prop="id">
                    <el-input v-model="editform.id" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="商品名字" prop="name1">
                    <el-input v-model="editform.name1"></el-input>
                  </el-form-item>
                  <el-form-item label="分类" prop="category">
                        <el-select v-model="editform.category" placeholder="请选择">
                          <el-option
                            v-for="item in categoryOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.label">
                          </el-option>
                        </el-select>
                  </el-form-item>
                  <el-form-item label="售价" prop="mallPcPrice">
                    <el-input v-model="editform.mallPcPrice"></el-input>
                  </el-form-item>

                  <el-form-item label="市场价" prop="marketPrice">
                    <el-input v-model="editform.marketPrice"></el-input>
                  </el-form-item>
                </el-form>

            </div>

          <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="onEdit">确 定</el-button>
          </span>
        </el-dialog>


  </d2-container>
</template>

<script>
import Axios from 'axios'
import log from '@/libs/util.log'
export default {
  name: 'goodslist',
  data(){
    return {
      goodsList:[],
      fileList: [],
      input:'',
      visible: false,
      dialogVisible: false,
      ediDialog: false,

      // 翻页
      page: 1,
      limit: 10,
      total: 0,

      editform: {
        name1: '',
        category : '',
        masterImg : '',
        mallPcPrice : '',
        marketPrice : ''
      },
      form: {
        name1: '',
        category : '',
        mallPcPrice : '',
        marketPrice : ''
      },
      categoryOptions:[{
          value: 1,
          label: '厨卫大电'
        }, {
          value: 2,
          label: '超级电视'
        }, {
          value: 3,
          label: '影音娱乐'
        }, {
          value: 4,
          label: '外设产品'
        }, {
          value: 5,
          label: '智能穿戴'
        }, {
          value: 6,
          label: '防盗监控'
         }],
      categoryOptionsValue: '',
      curEditRow: null,
      actionUrl: 'http://127.0.0.1:7001/api/uploadGood',
      Addrules: {
        name1: [
          { required: true, message: '请填写产品名称', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择产品分类', trigger: 'change' }
        ],
        mallPcPrice: [
          {required : true, message : '请填写售价' , trigger: 'blur'}
        ],
        marketPrice:[
          { required: true , message: '请填写市场价',trigger:'blur' }
        ]
      },
      Editrules: {
        name1: [
          { required: true, message: '请填写房产名称', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择产品分类', trigger: 'change' }
        ],
        mallPcPrice: [
          {required : true, message : '请填写售价' , trigger: 'blur'}
        ],
        marketPrice:[
          { required: true , message: '请填写市场价',trigger:'blur' }
        ]
      },
      
    }
  },
  created(){
    this.getAllList()
  },
  mounted() {
    // this.list = this.states.map(item => {
    //     return {value:item};
    //   });
    //   console.log('this.list',this.list);
  },
  beforeUpdate(){
    
  },
  methods:{
    reload(){
        this.page = 1;
        this.limit = 10;
        this.getAllList()
        this.$message.success('刷新成功')
    },
    fuck(res){
      console.log(`${res} is fired`);
      this.editform.name1 = res
    },
    addNew(){
        this.dialogVisible = true
    },
    async getAllList(){
       const postData = {
        limit: this.limit,
        page: this.page
      }
      await Axios.post('http://localhost:3000/api/getAllgoods',postData).then(res=>{
        this.goodsList = res.data.data
        // const { success, data } = res.data
        // console.log('res',res)
        console.log(this.goodsList);
        this.total = res.data.count
        // this.state = res.data.
      }).catch(err=>{
        console.log(err);
      })
    },

    showEdDialog (row) {
      console.log(row)
      this.ediDialog = true
      this.editform = row
      this.categoryOptionsValue = row.category
      this.curEditRow = { ...row }
      console.log('this.curEditRow', this.curEditRow)
    },
    
    async doDel (row) {
      console.log('row', row.id)
      await Axios.delete(`http://localhost:3000/api/removeGood/${row.id}`)
      this.$message.success('删除成功')
      this.getAllList()
      },


     onSubmit () {
      this.$refs.form.validate(async (res, wtf) => {
        if (res) {
      //     // 才去执行提交
          console.log(this.form)
          const postData = {
            name1: this.form.name1,
            category: this.form.category,
            mallPcPrice: this.form.mallPcPrice,
            marketPrice: this.form.marketPrice,
          }
          console.log('postData', postData)

      //     const res = await this.$api.post('/build/add', postData)
        await Axios.post(`http://localhost:3000/api/addGoods`,postData).then(res=>{
            console.log(res);
            this.$message.success('操作成功')
            }).catch(e=>{
              this.$message.warning('操作失败',e)
            })
      //     const { success } = res.data
      //     if (!success) return this.$message.warning('操作失败')
          this.$message.success('操作成功')
          this.getAllList()
          this.$refs.form.resetFields() // 重置表单
          this.fileList = []
          this.dialogVisible = false
        }else {
            console.log('error submit!!');
            return false;
          }
      })
    },
       onEdit () {
      this.$refs.editform.validate(async (res, wtf) => {
        if (res) {
          console.log(this.curEditRow);
          console.log('this.editform.category',this.editform.category);
          console.log('this.editform',this.editform);
          const postData = {
            id:this.editform.id,
            name1: this.editform.name1,
            category: this.editform.category,
            mallPcPrice: this.editform.mallPcPrice,
            marketPrice: this.editform.marketPrice,
          }

          // const res = await this.$api.post('/build/update', postData)

           await Axios.post(`http://localhost:3000/api/updateGood`,postData).then(res=>{
            console.log(res);
            this.$message.success('操作成功')
            }).catch(e=>{
              this.$message.warning('操作失败',e)
            })
          //   const { success } = res.data
          // if (!success) return this.$message.warning('操作失败')
          // this.$message.success('操作成功')
          this.$refs.editform.resetFields() // 重置表单
          this.fileList = []
          this.categoryOptionsValue = ''
          this.getAllList()
          this.ediDialog = false
        }
      })
    },
        preView () {

        },
        remove () {

        },
      handleClose (done) {
      // 在关闭之前 清空表单
      this.$refs.editform.resetFields() // 重置表单
      this.fileList = []
      this.categoryOptionsValue = ''
      this.getAllList()
      done()
      },

      addHandleClose(done) {
      // 在关闭之前 清空表单
      this.$refs.form.resetFields() // 重置表单
      this.fileList = []
      this.getAllList()
      done()
      },

      cancel(){
      this.$refs.editform.resetFields() // 重置表单
      this.fileList = []
      this.categoryOptionsValue = ''
      this.getAllList()
      this.ediDialog = false
      },

      handlePageChange(res){
        this.page = res
        this.getAllList()
      },

      // 搜索
     async searchRes(searchInfo){
      //  console.log(searchInfo);
        const postData = {
          name:searchInfo
        }
        
        await Axios.post(`http://localhost:3000/api/searchGoods`,postData).then(res=>{
          if(!searchInfo) {this.getAllList()}
          else{
            this.page = 1;
        this.limit = 9999;
            this.$message.success('搜索成功')
          this.goodsList = res.data.data
          // this.limit = res.data.count
          console.log(res.data.count);
          }
          // console.log(res.data.data);
            }).catch(e=>{
              this.$message.warning('操作失败',e)
            })
      }
  }
}
</script>

<style scoped>
.headerbutton{
    float: right;
    margin: 0 10px;
}
</style>