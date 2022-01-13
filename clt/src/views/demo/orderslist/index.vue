<template>
  <d2-container>
    <template slot="header">
      订单列表
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
    <el-table :data="orderslist" stripe style="width: 100%">
      <el-table-column prop="id" label="订单号" width="100"> </el-table-column>
      <el-table-column prop="orderstatus" label="订单状态" width="150">
      </el-table-column>
      <el-table-column prop="ordersTime" label="下单时间" width="150">
      </el-table-column>
      <el-table-column prop="totalPrice" label="订单金额" width="150">
      </el-table-column>
      <el-table-column prop="customer" label="客户用户名" width="140">
      </el-table-column>
      <el-table-column prop="recipient" label="客户姓名" width="140">
      </el-table-column>
      <el-table-column prop="addTime" label="添加时间" width="150">
      </el-table-column>
      <el-table-column prop="action" label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="info" size="medium" @click="showEdDialog(scope.row)"
            >编辑</el-button
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
            <el-button
              slot="reference"
              type="danger"
              size="medium"
              style="margin-left: 10px"
              @click="visible = true"
              >删除</el-button
            >
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <!-- 详情 -->
    <el-dialog
      title="详情"
      :visible.sync="ediDialog"
      width="800px"
      :before-close="handleClose"
    >
      <div>
        <el-form
          ref="detailsform"
          :rules="rules"
          :model="detailsform"
          label-width="100px"
        >
          <el-form-item label="id" prop="id">
            <el-input v-model="detailsform.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="商品总价" prop="totalPrice">
            <el-input v-model.number="detailsform.totalPrice"></el-input>
          </el-form-item>
          <el-form-item label="订单状态" prop="orderstatus">
            <el-select v-model="detailsform.orderstatus" placeholder="请选择">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户用户名" prop="customer">
            <el-input v-model="detailsform.customer"></el-input>
          </el-form-item>

          <el-form-item label="快递公司" prop="courier">
            <el-input v-model="detailsform.courier"></el-input>
          </el-form-item>
          <el-form-item label="快递单号" prop="courierNumber">
            <el-input v-model="detailsform.courierNumber"></el-input>
          </el-form-item>

          <el-form-item label="收件人" prop="recipient">
            <el-input v-model="detailsform.recipient"></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="detailsform.address"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="phonenum">
            <el-input v-model.number="detailsform.phonenum"></el-input>
          </el-form-item>
          <el-form-item label="邮政编码" prop="zipCode">
            <el-input v-model="detailsform.zipCode"></el-input>
          </el-form-item>
          <el-form-item label="下单时间" prop="ordersTime">
            <el-date-picker
              v-model="detailsform.ordersTime"
              type="datetime"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="订单详情" prop="goodsDetails">
            <el-input
              type="textarea"
              v-model="detailsform.goodsDetails"
            ></el-input>
          </el-form-item>
          <el-form-item label="添加时间" prop="addTime">
            <el-input v-model="detailsform.addTime" disabled></el-input>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
        <el-button type="primary" @click="onEdit">确 定</el-button>
      </span>
    </el-dialog>
  </d2-container>
</template>

<script>
import Axios from "axios";
import log from "@/libs/util.log";
import dayjs, { Dayjs } from "dayjs";
export default {
  name: "orderslist",
  data() {
    return {
      orderslist: [],
      fileList: [],
      input: "",
      visible: false,
      dialogVisible: false,
      ediDialog: false,

      // 翻页
      page: 1,
      limit: 10,
      total: 0,

      detailsform: {
        // id=lastID,totalPrice,customer,courier,courierNumber,orderstatus,addTime,goodsDetails,recipient,address,phonenum,zipCode
        id: "",
        totalPrice: "",
        customer: "",
        courier: "",
        courierNumber: "",
        orderstatus: "",
        addTime: "",
        goodsDetails: "",
        recipient: "",
        address: "",
        phonenum: "",
        zipCode: "",
        ordersTime: "",
      },
      form: {
        name1: "",
        category: "",
        mallPcPrice: "",
        marketPrice: "",
      },
      statusOptions: [
        {
          value: 1,
          label: "未付款未发货",
        },
        {
          value: 2,
          label: "已付款未发货",
        },
        {
          value: 3,
          label: "已付款已发货",
        },
        {
          value: 4,
          label: "已签收",
        },
        {
          value: 5,
          label: "订单作废",
        },
        {
          value: 6,
          label: "退货",
        },
      ],
      rules: {
        totalPrice: [
          { required: true, message: "请输入商品总价", trigger: "blur" },
        ],
        orderstatus: [
          { required: true, message: "请选择订单状态", trigger: "blur" },
        ],
        recipient: [
          { required: true, message: "请输入收件人", trigger: "blur" },
        ],
        address: [
          { required: true, message: "请输入收件人地址", trigger: "blur" },
        ],
        ordersTime: [
          { required: true, message: "请输入下单时间", trigger: "change" },
        ],
        phonenum: [
          { required: true, message: "请输入收件人电话号码", trigger: "blur"}
        ],
        address: [
          { required: true, message: "请输入收件人地址", trigger: "blur" },
        ],
        goodsDetails: [
          { required: true, message: "请输入订单详情", trigger: "blur" },
        ],
      },
      // categoryOptionsValue: '',
      curEditRow: null,
      actionUrl: "http://127.0.0.1:7001/api/uploadGood",
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
      this.page = 1;
      this.limit = 10;
      this.getAllList();
      this.$message.success("刷新成功");
    },
    fuck(res) {
      console.log(`${res} is fired`);
      this.detailsform.name1 = res;
    },
    addNew() {
      this.dialogVisible = true;
    },
    async getAllList() {
      const postData = {
        limit: this.limit,
        page: this.page,
      };
      await Axios.post("http://localhost:3000/api/getAllorders", postData)
        .then((res) => {
          this.orderslist = res.data.data;
          // const { success, data } = res.data
          // console.log('res',res)
          console.log(this.orderslist);
          // console.log('this.$store.username',this.$store.getters.getName);
          this.total = res.data.count;
          // this.state = res.data.
        })
        .catch((err) => {
          console.log(err);
        });
    },

    showEdDialog(row) {
      console.log(row);
      this.ediDialog = true;
      this.detailsform = row;
      // this.categoryOptionsValue = row.category
      this.curEditRow = { ...row };
      console.log("this.curEditRow", this.curEditRow);
    },

    async doDel(row) {
      console.log("row", row.id);
      await Axios.delete(`http://localhost:3000/api/removeorder/${row.id}`);
      this.$message.success("删除成功");
      this.getAllList();
    },
    onEdit() {
      this.$refs.detailsform.validate(async (res, wtf) => {
        if (res) {
          // console.log(this.curEditRow);
          // console.log('this.detailsform.category',this.detailsform.category);
          // console.log('this.detailsform',this.detailsform);
          // id=lastID,totalPrice,customer,courier,courierNumber,orderstatus,addTime,goodsDetails,recipient,address,phonenum,zipCode
          if (
            this.detailsform.totalPrice < 0 ||
            this.detailsform.totalPrice < 0 ||
            isNaN(this.detailsform.totalPrice) ||
            isNaN(this.detailsform.totalPrice)
          )
            return this.$message.error("总价不能小于0或者非数字！");
          const totalPrice =
            this.detailsform.totalPrice % 1 === 0
              ? this.detailsform.totalPrice * 1
              : Math.round(this.detailsform.totalPrice * 100) / 100;
          const postData = {
            id: this.detailsform.id,
            totalPrice: totalPrice.toFixed(2),
            customer: this.detailsform.customer,
            courier: this.detailsform.courier,
            courierNumber: this.detailsform.courierNumber,
            orderstatus: this.detailsform.orderstatus,
            ordersTime: this.detailsform.ordersTime,
            goodsDetails: this.detailsform.goodsDetails,
            recipient: this.detailsform.recipient,
            address: this.detailsform.address,
            phonenum: this.detailsform.phonenum,
            zipCode: this.detailsform.zipCode,
            addTime: this.detailsform.addTime,
          };

          // const res = await this.$api.post('/build/update', postData)

          await Axios.post(`http://localhost:3000/api/updateOrder`, postData)
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
          this.$refs.detailsform.resetFields(); // 重置表单
          this.fileList = [];
          // this.categoryOptionsValue = ''
          this.getAllList();
          this.ediDialog = false;
        }
      });
    },
    handleClose(done) {
      // 在关闭之前 清空表单
      this.$refs.detailsform.resetFields(); // 重置表单
      this.fileList = [];
      // this.categoryOptionsValue = ''
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

    cancel() {
      this.$refs.detailsform.resetFields(); // 重置表单
      this.fileList = [];
      // this.categoryOptionsValue = ''
      this.getAllList();
      this.ediDialog = false;
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

      await Axios.post(`http://localhost:3000/api/searchOrders`, postData)
        .then((res) => {
          if (!searchInfo) {
            this.getAllList();
          } else {
            this.page = 1;
            this.limit = 9999;
            this.$message.success("搜索成功");
            this.orderslist = res.data.data;
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