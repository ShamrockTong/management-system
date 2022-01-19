<template>
  <d2-container>
    <template slot="header">
      用户信息列表
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
    <el-table :data="usersList" stripe style="width: 100%" height="100%">
      <el-table-column prop="username" label="用户名" width="180">
      </el-table-column>
      <el-table-column prop="password" label="密码" width="180">
      </el-table-column>
      <el-table-column prop="uuid" label="权限" width="180"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
      <el-table-column prop="regTime" label="注册时间" width="180">
      </el-table-column>
      <el-table-column prop="action" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="info" size="medium" @click="showEdDialog(scope.row)"
            >编辑</el-button
          >
          <el-popover placement="top" width="200" trigger="click">
            <div>
              您是否确认删除该信息
              <el-button
                size="small"
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

    <!-- 编辑 -->
    <el-dialog
      title="编辑"
      :visible.sync="ediDialog"
      width="600px"
      :before-close="handleClose"
    >
      <div>
        <el-form
          :model="editform"
          :rules="Editrules"
          ref="editform"
          label-width="80px"
          class="demo-editform"
        >
          <el-form-item label="账号" prop="username" style="width: 500px">
            <el-input v-model="editform.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" style="width: 500px">
            <el-input v-model="editform.password"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="name" style="width: 500px">
            <el-input v-model="editform.name"></el-input>
          </el-form-item>
          <el-form-item label="权限定位" prop="uuid" style="width: 500px">
            <el-select v-model="editform.uuid" placeholder="请选择">
              <el-option
                v-for="item in uuidOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
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
import Axios from "axios";
export default {
  name: "userslist",
  data() {
    return {
      usersList: [],
      fileList: [],
      visible: false,
      ediDialog: false,

      // 翻页
      page: 1,
      limit: 10,
      total: 0,
      input: "",
      editform: {
        username: "",
        password: "",
        name: "",
        uuid: "",
      },
      userForm: {
        username: "",
        password: "",
        name: "",
        uuid: "",
      },
      uuidOptions: [
        {
          value: "admin-uuid",
          name: "管理员",
        },
        {
          value: "editor-uuid",
          name: "编辑",
        },
        {
          value: "user1-uuid",
          name: "用户",
        },
      ],
      Editrules: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请选择密码", trigger: "blur" }],
        name: [{ required: true, message: "请选择用户名", trigger: "blur" }],
        uuid: [{ required: true, message: "请选择权限", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getAllList();
  },
  methods: {
    reload() {
      // this.page = 1;
      this.limit = 10;
      this.getAllList();
      this.$message.success("刷新成功");
    },
    async getAllList() {
      const postData = {
        limit: this.limit,
        page: this.page,
      };
      await Axios.post("http://localhost:3000/api/getAllusers", postData)
        .then((res) => {
          this.usersList = res.data.data;
          console.log(this.usersList);
          this.total = res.data.count;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async doDel(row) {
      console.log("row", row.username);
      await Axios.delete(
        `http://localhost:3000/api/removeUser/${row.username}`
      );
      this.$message.success("删除成功");
      this.getAllList();
    },
    showEdDialog(row) {
      console.log(row);
      this.ediDialog = true;
      this.editform = row;
      // this.curEditRow = { ...row }
      // console.log('this.curEditRow', this.curEditRow)
    },
    handleClose(done) {
      // 在关闭之前 清空表单
      this.$refs.editform.resetFields(); // 重置表单
      this.fileList = [];
      this.getAllList();
      done();
    },
    cancel() {
      this.$refs.editform.resetFields(); // 重置表单
      this.fileList = [];
      this.getAllList();
      this.ediDialog = false;
    },

    onEdit() {
      this.$refs.editform.validate(async (res, wtf) => {
        if (res) {
          console.log(this.curEditRow);
          console.log("this.editform.category", this.editform.category);
          console.log("this.editform", this.editform);
          const postData = {
            username: this.editform.username,
            password: this.editform.password,
            name: this.editform.name,
            uuid: this.editform.uuid,
          };

          // const res = await this.$api.post('/build/update', postData)

          await Axios.post(`http://localhost:3000/api/updateUser`, postData)
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
          this.categoryOptionsValue = "";
          this.getAllList();
          this.ediDialog = false;
        }
      });
    },
    handlePageChange(res) {
      this.page = res;
      this.getAllList();
    },
    // 搜素
    async searchRes(searchInfo) {
      //  console.log(searchInfo);
      const postData = {
        name: searchInfo,
      };

      await Axios.post(`http://localhost:3000/api/searchUser`, postData)
        .then((res) => {
          if (!searchInfo) {
            this.getAllList();
          } else {
            this.page = 1;
            this.limit = 9999;
            this.$message.success("搜索成功");
            this.usersList = res.data.data;
            // this.limit = res.data.count
            console.log(res.data.data);
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