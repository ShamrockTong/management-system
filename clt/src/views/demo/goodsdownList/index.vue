<template>
  <d2-container>
    <template slot="header">
      商品已上架列表
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
        layout="prev, pager, next,jumper"
        :page-size="limit"
        :total="total"
        :current-page="this.page"
        @current-change="handlePageChange"
      />
    </div>
    <el-table :data="goodsList" stripe style="width: 100%" height="100%">
      <el-table-column prop="id" label="ID" width="100"> </el-table-column>
      <el-table-column prop="name1" label="商品名称"> </el-table-column>
      <el-table-column prop="category" label="分类" width="180">
      </el-table-column>
      <el-table-column prop="mallPcPrice" label="售价" width="180">
      </el-table-column>
      <el-table-column prop="marketPrice" label="市场价" width="180">
      </el-table-column>
    </el-table>
  </d2-container>
</template>

<script>
import Axios from "axios";
import log from "@/libs/util.log";
export default {
  name: "goodsdownList",
  data() {
    return {
      goodsList: [],
      fileList: [],
      input: "",
      visible: false,
      dialogVisible: false,
      ediDialog: false,
      value: "",
      thisID: "",
      // 翻页
      page: 1,
      limit: 10,
      total: 0,

      editform: {
        name1: "",
        category: "",
        masterImg: "",
        mallPcPrice: "",
        marketPrice: "",
        upOrdown: "",
      },
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
      // this.page = 1;
      this.limit = 10;
      this.getAllList();
      this.$message.success("刷新成功");
      console.log(this.thisID);
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
      await Axios.post("http://localhost:3000/api/getAllUpGoods", postData)
        .then((res) => {
          this.goodsList = res.data.data;
          // const { success, data } = res.data
          // console.log('res',res)
          console.log(this.goodsList);
          this.total = res.data.count;
          // this.state = res.data.
        })
        .catch((err) => {
          console.log(err);
        });
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

      await Axios.post(`http://localhost:3000/api/searchUpGoods`, postData)
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