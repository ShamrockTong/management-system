<template>
  <d2-container>
    <el-form
      :model="detailsform"
      :rules="rules"
      ref="detailsform"
      label-width="90px"
      class="demo-detailsform"
    >
      <el-form-item label="商品总价" prop="totalPrice" style="width: 600px">
        <el-input v-model="detailsform.totalPrice"></el-input>
      </el-form-item>
      <el-form-item label="订单状态" prop="orderstatus" style="width: 600px">
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
      <el-form-item label="客户用户名" prop="customer" style="width: 600px">
        <el-input v-model="detailsform.customer"></el-input>
      </el-form-item>

      <el-form-item label="快递公司" prop="courier" style="width: 600px">
        <el-input v-model="detailsform.courier"></el-input>
      </el-form-item>
      <el-form-item label="快递单号" prop="courierNumber" style="width: 600px">
        <el-input v-model="detailsform.courierNumber"></el-input>
      </el-form-item>

      <el-form-item label="收件人" prop="recipient" style="width: 600px">
        <el-input v-model="detailsform.recipient"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="address" style="width: 600px">
        <el-input v-model="detailsform.address"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="phonenum" style="width: 600px">
        <el-input v-model="detailsform.phonenum"></el-input>
      </el-form-item>
      <el-form-item label="邮政编码" prop="zipCode" style="width: 600px">
        <el-input v-model="detailsform.zipCode"></el-input>
      </el-form-item>
      <el-form-item label="下单时间" prop="ordersTime" style="width: 600px">
        <el-date-picker
          v-model="detailsform.ordersTime"
          type="datetime"
          placeholder="选择日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="订单详情" prop="goodsDetails" style="width: 600px">
        <el-input type="textarea" v-model="detailsform.goodsDetails"></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="submitOrder('detailsform')"
      >添加</el-button
    >
    <el-button @click="resetForm('detailsform')">重置</el-button>
  </d2-container>
</template>
<script>
import Axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import log from "@/libs/util.log";
export default {
  name: "addorder",
  data() {
    return {
      detailsform: {
        id: "",
        totalPrice: "",
        customer: "",
        courier: "",
        courierNumber: "",
        orderstatus: "",
        goodsDetails: "",
        recipient: "",
        address: "",
        phonenum: "",
        zipCode: "",
        ordersTime: "",
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
        phonenum: [
          { required: true, message: "请输入收件人电话号码", trigger: "blur" },
        ],
        address: [
          { required: true, message: "请输入收件人地址", trigger: "blur" },
        ],
        goodsDetails: [
          { required: true, message: "请输入订单详情", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    submitOrder() {
      // console.log(this.detailsform.ordersTime);
      // dayjs().format('YYYY-MM-DD dddd HH:mm:ss.SSS A')
      this.$refs.detailsform.validate(async (res, wtf) => {
        if (res) {
          //     // 才去执行提交
          console.log(this.detailsform);
          const addTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
          const postData = {
            totalPrice: this.detailsform.totalPrice,
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
            addTime: addTime,
          };
          console.log("postData", postData);
          await Axios.post(`http://localhost:3000/api/addOrder`, postData)
            .then((res) => {
              if (res.data.success) {
                this.$message.success("添加成功！");
                this.$refs.detailsform.resetFields(); // 重置表单
              } else {
                this.$message.warning("操作失败", e);
              }
            })
            .catch((e) => {
              this.$message.warning("操作失败", e);
            });
          //   this.fileList = []
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped>
</style>