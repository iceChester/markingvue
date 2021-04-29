<template>
<div>
  <el-divider content-position="center"><h2>请及时完成作业喔</h2></el-divider>
  <div style="margin: 50px auto">
    <el-table
        :data="studentTaskData"
        height="550"
        border
        style="width: 100%"
        ref="multipleTable"
        tooltip-effect="dark">
      <el-table-column
          prop="taskId"
          label="作业编号"
      >
      </el-table-column>
      <el-table-column
          prop="title"
          label="标题"
      >
      </el-table-column>
      <el-table-column
          prop="detail"
          label="作业详情"
      >
      </el-table-column>
      <el-table-column
          prop="deadline"
          label="截止日期"
      >
      </el-table-column>
      <el-table-column
          label="操作"
      >
        <template slot-scope="scope">
          <el-button @click.stop="handleClick(scope.row)" type="text" size="small">提交作业</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog
      title="提交作业文件"
      :visible.sync="dialogVisible"
      width="30%"
      :show-close="false">
    <el-upload
        class="upload-demo"
        ref="upload"
        action=""
        :headers="this.headers"
        :data="this.taskData"
        :multiple = "true"
        :http-request="httpRequest"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-success="cleanFileList"
        :file-list="fileList"
        :auto-upload="false">
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
    </el-upload>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">关 闭</el-button>
      </span>
  </el-dialog>
  <el-backtop target=".page-component__scroll .el-scrollbar__wrap"></el-backtop>
</div>
</template>

<script>
export default {
  name: "CollectingTasks",
  inject: ['reload'],
  data() {
    return {
      dialogVisible: false,
      studentTaskData: [],
      fileList: [],
      file: [],
      newData: new FormData(),
      // 获取row的key值
      getRowKeys(row) {
        return row.taskId;
      },
      // 要展开的行，数值的元素是row的key值
      expands: [],
      headers: {
        token: this.getToken()
      },
      taskData: {
        account: this.$store.getters.getAccount,
        taskId: '',
        groupId: '',
      },
    }
  },
  mounted() {
    this.taskDetail();
  },
  methods: {
    httpRequest(param) {
      //this.file.push(param.file);// 需要上传多个文件，为避免发送多次请求，因此在这里只进行文件的获取，param可以拿到文件上传的所有信息
      this.newData.append('file', param.file);
    },
    cleanFileList(response, file, fileList){
      this.fileList = [];
      this.$message({
        type: 'info',
        message: "提交成功"
      });
    },
    submitUpload() {
      const  _this = this;
      this.$refs.upload.submit();
      this.newData.append('file', this.file);
      this.newData.append("studentTask", JSON.stringify(this.taskData)) // 这里需要转换一下格式传给后台
      console.log(this.newData);
      axios.post("http://localhost:8181/studentTask/uploadTask/", this.newData,{
        crossDomain: true,
        xhrFields: {withCredentials: true},
        headers: {
          token: this.getToken(),
          'Content-Type':'multipart/form-data'
        }
      }).then(function(response) {
        if (response.data) {
          _this.$message({
            type: 'info',
            message: "提交成功"
          });
        }
      })
          .catch(function(error) {
            console.log(error);
          });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.reload();
    },
    handlePreview(file) {
      console.log(file);
    },
    dialogClose() {
      this.dialogVisible = false;
      this.reload();
    },
    taskDetail() {
      const _this = this;
      axios.get("http://localhost:8181/task/studentCollectingTask", {
        params: {
          offerId: this.$store.getters.getOfferId,
          account: this.$store.getters.getAccount,
          taskType: 0,
        },
        crossDomain: true,
        xhrFields: {withCredentials: true},
        headers: {
          token: this.getToken(),
        }
      }).then(function (resp) {
        console.log("resp.data");
        console.log(resp.data);
        _this.studentTaskData = resp.data;
      })
    },
    handleClick(data) {
      this.dialogVisible = true;
      this.taskData.taskId = data.taskId;
      this.taskData.groupId = -1;
    },
  }
}
</script>

<style scoped>
/deep/ .el-table th > .cell {
  text-align: center;
}

/deep/ .el-table .cell {
  text-align: center;
}

.table-expands {
  font-size: 0;
}

.table-expands label {
  width: 90px;
  color: #83afec;
}

.table-expands .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>