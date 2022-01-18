<template>
  <d2-container>
    <template slot="header">
      库存管理
      <el-button type="primary" @click="searchRes(input)" class="headerbutton"
        >搜索</el-button
      >
      <el-input
        v-model="input"
        placeholder="请输入搜索内容"
        style="width: 300px; float: right"
      ></el-input>
      <el-button type="primary" @click="reload" class="headerbutton"
        >刷新列表</el-button
      >
    </template>

    <!-- 底插槽 @input.native="searchRes($event.target.value)" -->
    <div slot="footer">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="limit"
        :total="total"
        :current-page="this.page"
        @current-change="handlePageChange"
      />
    </div>
    <el-table :data="goodsList" stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="100"> </el-table-column>
      <el-table-column prop="name1" label="商品名称"> </el-table-column>
      <el-table-column prop="storage" label="库存" width="200">
      </el-table-column>
      <el-table-column prop="action" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="info" size="medium" @click="showAdd(scope.row)"
            >入库</el-button
          >
          <el-button type="danger" size="medium" @click="showReduce(scope.row)"
            >出库</el-button
          >
          <el-popover placement="top" width="200" trigger="click">
            <div>
              您是否确认删除该信息
              <el-button
                size="mini"
                @click="
                  doDel(scope.row);
                  visible = false;
                "
                >确认</el-button
              >
            </div>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <!-- 入库 -->
    <el-dialog
      title="入库"
      :visible.sync="AddEdiDialog"
      width="600px"
      :before-close="handleClose"
    >
      <div>
        <el-form
          ref="editform"
          :rules="Addrules"
          :model="editform"
          label-width="100px"
        >
          <el-form-item label="id" prop="id">
            <el-input v-model="editform.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="商品名字" prop="name1">
            <el-input v-model="editform.name1" disabled></el-input>
          </el-form-item>
          <el-form-item label="库存" prop="mallPcPrice">
            <el-input v-model="editform.storage" disabled></el-input>
          </el-form-item>
          <el-form-item label="入库" prop="add">
            <el-input v-model="editform.add"></el-input>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="AddCancel">取 消</el-button>
        <el-button type="primary" @click="AddEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 出库 -->
    <el-dialog
      title="出库"
      :visible.sync="ReduceEdiDialog"
      width="600px"
      :before-close="handleClose"
    >
      <div>
        <el-form
          ref="editform"
          :rules="Reducerules"
          :model="editform"
          label-width="100px"
        >
          <el-form-item label="id" prop="id">
            <el-input v-model="editform.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="商品名字" prop="name1">
            <el-input v-model="editform.name1" disabled></el-input>
          </el-form-item>
          <el-form-item label="库存" prop="storage">
            <el-input v-model="editform.storage" disabled></el-input>
          </el-form-item>
          <el-form-item label="出库" prop="reduce">
            <el-input v-model="editform.reduce"></el-input>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="ReduceCancel">取 消</el-button>
        <el-button type="primary" @click="ReduceEdit">确 定</el-button>
      </span>
    </el-dialog>
  </d2-container>
</template>

<script>
import Axios from "axios";
import log from "@/libs/util.log";
import dayjs, { Dayjs } from "dayjs";
export default {
  name: "storagelist",
  data() {
    return {
      goodsList: [],
      fileList: [],
      goodsStorage: "",
      input: "",
      visible: false,
      dialogVisible: false,
      AddEdiDialog: false,
      ReduceEdiDialog: false,

      // 翻页
      page: 1,
      limit: 10,
      total: 0,

      editform: {
        name1: "",
        storage: "",
        add: 0,
        reduce: 0,
      },
      form: {
        name1: "",
        category: "",
        mallPcPrice: "",
        marketPrice: "",
      },
      categoryOptions: [
        {
          value: 1,
          label: "厨卫大电",
        },
        {
          value: 2,
          label: "超级电视",
        },
        {
          value: 3,
          label: "影音娱乐",
        },
        {
          value: 4,
          label: "外设产品",
        },
        {
          value: 5,
          label: "智能穿戴",
        },
        {
          value: 6,
          label: "防盗监控",
        },
      ],
      categoryOptionsValue: "",
      curEditRow: null,
      actionUrl: "http://127.0.0.1:7001/api/uploadGood",
      Addrules: {
        // add:[
        //   { required: true , message: '请填写入库数量',trigger:'blur' }
        // ],
      },
      Reducerules: {
        // reduce:[
        //   { required: true , message: '请填写出库数量',trigger:'blur' }
        // ]
      },
    };
  },
  created() {
    this.getAllList();
  },
  mounted() {
    // this.list = this.states.map(item => {
    //     return {value:item};
    //   });
    //   console.log('this.list',this.list);
  },
  beforeUpdate() {},
  methods: {
    reload() {
      // this.page = 1;
      this.limit = 10;
      this.getAllList();
      this.$message.success("刷新成功");
    },
    fuck(res) {
      console.log(`${res} is fired`);
      this.editform.name1 = res;
    },
    addNew() {
      this.dialogVisible = true;
    },
    async getAllList() {
      const postData = {
        limit: this.limit,
        page: this.page,
      };
      await Axios.post("http://localhost:3000/api/getGoodsStorage", postData)
        .then((res) => {
          this.goodsList = res.data.data;
          // const { success, data } = res.data
          // console.log('res',res)
          console.log(this.goodsList);
          // console.log('this.$store.username',this.$store.getters.getName);
          this.total = res.data.count;
          // this.state = res.data.
        })
        .catch((err) => {
          console.log(err);
        });
    },

    showAdd(row) {
      console.log(row);
      this.AddEdiDialog = true;
      this.editform = row;
      this.goodsStorage = row.storage;
      // console.log('showadd row',row);
      // console.log('showadd goodsStorage',goodsStorage);
      this.curEditRow = { ...row };
    },
    showReduce(row) {
      console.log(row);
      this.ReduceEdiDialog = true;
      this.editform = row;
      this.goodsStorage = row.storage;
      this.curEditRow = { ...row };
      console.log("this.curEditRow", this.curEditRow);
    },
    AddEdit() {
      this.$refs.editform.validate(async (res, wtf) => {
        if (res) {
          if (
            this.editform.add < 1 ||
            !this.editform.add ||
            isNaN(this.editform.add) ||
            this.editform.add % 1 != 0
          )
            return this.$message.error("入库数量不能小于0或者非数字或小数！");
          if (!this.goodsStorage) this.goodsStorage = 0;
          const postData = {
            id: this.editform.id,
            storage: this.goodsStorage * 1 + this.editform.add * 1,
          };
          console.log("postData", postData);
          // const res = await this.$api.post('/build/update', postData)

          await Axios.post(
            `http://localhost:3000/api/updateGoodsStorage`,
            postData
          )
            .then((res) => {
              console.log(res);
              this.$message.success("操作成功");
            })
            .catch((e) => {
              this.$message.warning("操作失败", e);
            });
          //   const { success } = res.data
          // if (!success) return this.$message.warning('操作失败')
          // this.$message.success('操作成功')
          this.$refs.editform.resetFields(); // 重置表单
          this.fileList = [];
          this.getAllList();
          this.AddEdiDialog = false;
        }
      });
    },
    ReduceEdit() {
      this.$refs.editform.validate(async (res, wtf) => {
        if (res) {
          if (
            this.editform.reduce < 1 ||
            !this.editform.reduce ||
            isNaN(this.editform.reduce) ||
            this.editform.reduce % 1 != 0
          )
            return this.$message.error("出库不能小于0或者非数字或小数！");
          if (!this.goodsStorage) this.goodsStorage = 0;
          let postData = {
            id: this.editform.id,
            storage: this.goodsStorage * 1 - this.editform.reduce * 1,
          };
          if (postData.storage <= 0) postData.storage = 0;
          console.log("postData", postData);
          // const res = await this.$api.post('/build/update', postData)

          await Axios.post(
            `http://localhost:3000/api/updateGoodsStorage`,
            postData
          )
            .then((res) => {
              console.log(res);
              this.$message.success("操作成功");
            })
            .catch((e) => {
              this.$message.warning("操作失败", e);
            });
          //   const { success } = res.data
          // if (!success) return this.$message.warning('操作失败')
          // this.$message.success('操作成功')
          this.$refs.editform.resetFields(); // 重置表单
          this.fileList = [];
          this.getAllList();
          this.ReduceEdiDialog = false;
        }
      });
    },
    preView() {},
    remove() {},
    handleClose(done) {
      // 在关闭之前 清空表单
      this.$refs.editform.resetFields(); // 重置表单
      this.fileList = [];
      this.categoryOptionsValue = "";
      this.getAllList();
      done();
    },

    addHandleClose(done) {
      // 在关闭之前 清空表单
      this.$refs.form.resetFields(); // 重置表单
      this.fileList = [];
      this.getAllList();
      done();
    },

    AddCancel() {
      this.$refs.editform.resetFields(); // 重置表单
      this.fileList = [];
      this.categoryOptionsValue = "";
      this.getAllList();
      this.AddEdiDialog = false;
    },
    ReduceCancel() {
      this.$refs.editform.resetFields(); // 重置表单
      this.fileList = [];
      this.categoryOptionsValue = "";
      this.getAllList();
      this.ReduceEdiDialog = false;
    },

    handlePageChange(res) {
      this.page = res;
      this.getAllList();
    },

    // 搜索
    async searchRes(searchInfo) {
      //  console.log(searchInfo);
      const postData = {
        name: searchInfo,
      };

      await Axios.post(`http://localhost:3000/api/searchGoods`, postData)
        .then((res) => {
          if (!searchInfo) {
            this.getAllList();
          } else {
            this.page = 1;
            this.limit = 9999;
            this.$message.success("搜索成功");
            this.goodsList = res.data.data;
            // this.limit = res.data.count
            console.log(res.data.count);
          }
          // console.log(res.data.data);
        })
        .catch((e) => {
          this.$message.warning("操作失败", e);
        });
    },
  },
};
</script>

<style scoped>
.headerbutton {
  float: right;
  margin: 0 10px;
}
</style>