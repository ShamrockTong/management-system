<template>
  <d2-container>
    <template slot="header">
      注册码列表（注意：注册码不可编辑和删除）
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
      <el-button type="danger" @click="addNew" class="headerbutton"
        >新增注册码</el-button
      >
    </template>

    <!-- 底插槽  -->
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
    <el-table :data="regcodeList" stripe style="width: 100%" height="100%">
      <el-table-column prop="id" label="ID" width="100"> </el-table-column>
      <el-table-column prop="code" label="注册码"> </el-table-column>
      <el-table-column prop="uuid" label="权限" width="180"> </el-table-column>
      
      <el-table-column prop="user" label="使用者" width="150">
      </el-table-column>
      <el-table-column prop="status" label="使用状态" width="200">
      </el-table-column>
      <el-table-column prop="addTime" label="添加时间" width="180"> </el-table-column>
      <el-table-column prop="regTime" label="使用时间" width="180"> </el-table-column>
      <el-table-column prop="action" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="info" size="medium" @click="showEdDialog(scope.row)"
            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增 -->
    <el-dialog
      title="新增注册码"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="addHandleClose"
    >
      <div>
        <el-form ref="form" :rules="Addrules" :model="form" label-width="90px">
          <el-form-item label="注册码" prop="code">
            <el-input v-model="form.code"></el-input>
          </el-form-item>
          <el-form-item label="权限" prop="uuid">
            <el-select v-model="form.uuid" placeholder="请选择">
              <el-option
                v-for="item in uuidOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
                :disabled="item.disabled"
              >
              </el-option>
            </el-select>
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
      title="详情"
      :visible.sync="ediDialog"
      width="600px"
      :before-close="handleClose"
    >
      <div>
        <el-form
          ref="editform"
          :rules="Editrules"
          :model="editform"
          label-width="100px"
        >
          <el-form-item label="id" prop="id">
            <el-input v-model="editform.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="注册码" prop="code">
            <el-input v-model="editform.code" disabled></el-input>
          </el-form-item>
          <el-form-item label="权限" prop="uuid">
            <el-select v-model="editform.uuid" placeholder="请选择" disabled>
              <el-option
                v-for="item in uuidOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="使用者" prop="user">
            <el-input v-model="editform.user" disabled></el-input>
          </el-form-item>

          <el-form-item label="使用状态" prop="status">
            <el-input v-model="editform.status" disabled></el-input>
          </el-form-item>
          <el-form-item label="添加时间" prop="addTime">
            <el-input v-model="editform.addTime" disabled></el-input>
          </el-form-item>
          <el-form-item label="使用时间" prop="regTime">
            <el-input v-model="editform.regTime" disabled></el-input>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </span>
    </el-dialog>
  </d2-container>
</template>

<script>
import Axios from "axios";
import log from "@/libs/util.log";
import dayjs, { Dayjs } from "dayjs";
export default {
  name: "regcodelist",
  data() {
    return {
      regcodeList: [],
      fileList: [],
      input: "",
      visible: false,
      dialogVisible: false,
      ediDialog: false,

      // 翻页
      page: 1,
      limit: 10,
      total: 0,
      editform: {
        id: "",
        code: "",
        uuid: "",
        user: "",
        status: "",
        addTime: "",
        regTime:''
      },
      form: {
        code: "",
        uuid: "",
      },
      uuidOptions: [
        {
          value: "admin-uuid",
          name: "管理员",
          disabled: true
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
      uuidOptionsValue: "",
      curEditRow: null,
      Addrules: {
        code: [{ required: true, message: "请输入注册码", trigger: "blur" }],
        uuid: [{ required: true, message: "请选择权限", trigger: "change" }],
      },
      Editrules: {},
    };
  },
  created() {
    this.getAllList();
  },
  destroyed(){
    console.log("destroyed");
  }
  ,
  methods: {
    reload() {
      // this.page = 1;
      this.limit = 10;
      this.getAllList();
      this.$message.success("刷新成功");
    },
    addNew() {
      this.dialogVisible = true;
    },
    async getAllList() {
      const postData = {
        limit: this.limit,
        page: this.page,
      };
      await Axios.post("http://localhost:3000/api/getAllregCode", postData)
        .then((res) => {
          this.regcodeList = res.data.data;
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

    showEdDialog(row) {
      console.log(row);
      this.ediDialog = true;
      this.editform = row;
      this.uuidOptionsValue = row.category;
      this.curEditRow = { ...row };
      console.log("this.curEditRow", this.curEditRow);
    },
    onSubmit() {
      this.$refs.form.validate(async (res, wtf) => {
        if (res) {
          console.log(this.form);
          const addTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

          const postData = {
            code: this.form.code,
            uuid: this.form.uuid,
            status: "未使用",
            addTime: addTime,
          };
          console.log("postData", postData);

          //     const res = await this.$api.post('/build/add', postData)
          await Axios.post(`http://localhost:3000/api/addregCode`, postData)
            .then((res) => {
              if (!res.data.success) {
                this.$message.error("该注册码已重复");
              } else {
                this.$message.success("添加成功！");
                this.getAllList();
                this.$refs.form.resetFields(); // 重置表单
                this.fileList = [];
                this.dialogVisible = false;
              }
            })
            .catch((e) => {
              this.$message.warning("操作失败", e);
            });
          //     const { success } = res.data
          //     if (!success) return this.$message.warning('操作失败')
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleClose(done) {
      // 在关闭之前 清空表单
      this.$refs.editform.resetFields(); // 重置表单
      this.fileList = [];
      this.uuidOptionsValue = "";
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
      this.$refs.editform.resetFields(); // 重置表单
      this.fileList = [];
      this.uuidOptionsValue = "";
      this.getAllList();
      this.ediDialog = false;
    },

    handlePageChange(res) {
      this.page = res;
      console.log(res);
      this.getAllList();
    },

    // 搜索
    async searchRes(searchInfo) {
      //  console.log(searchInfo);
      const postData = {
        name: searchInfo,
      };

      await Axios.post(`http://localhost:3000/api/searchregCode`, postData)
        .then((res) => {
          if (!searchInfo) {
            this.getAllList();
          } else {
            this.page = 1;
            this.limit = 9999;
            this.$message.success("搜索成功");
            this.regcodeList = res.data.data;
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