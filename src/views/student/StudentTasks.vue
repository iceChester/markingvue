<template>
  <div>
    <el-divider content-position="center"><h2>已经截至</h2></el-divider>
    <div>
      <el-table
          :data="studentTaskData"
          height="550"
          border
          style="width: 100%"
          ref="multipleTable"
          tooltip-effect="dark"
          :row-key="getRowKeys"
          :expand-row-keys="expands"
          @row-click="clickRowHandle">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="table-expands">
              <el-form-item label="分数一：">
                <span>{{ props.row.scoreOne }}</span>
              </el-form-item>
              <el-form-item label="分数二：">
                <span>{{ props.row.scoreTwo }}</span>
              </el-form-item>
              <el-form-item label="分数三：">
                <span>{{ props.row.scoreThree }}</span>
              </el-form-item>
              <el-form-item label="总分：">
                <span>{{ props.row.scoreTotal }}</span>
              </el-form-item>
              <el-form-item label="文件名:">
                <span>{{ props.row.fileName }}</span>
              </el-form-item>
              <el-form-item label="提交日期">
                <span>{{ props.row.submitDate }}</span>
              </el-form-item>
              <el-form-item label="作业详情：">
                <span>{{ props.row.detail }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
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
            prop="deadline"
            label="截止日期"
        >
        </el-table-column>
        <el-table-column
            label="操作"
        >
          <template slot-scope="scope">
            <el-button @click.stop="downloadOne(scope.row)" type="text" size="small">下载作业</el-button>
            <el-button type="text" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "StudentTasks",
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
      this.$router.go(0);
    },
    handlePreview(file) {
      console.log(file);
    },
    dialogClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
    },
    taskDetail() {
      const _this = this;
      axios.get("http://localhost:8181/studentTask/checkMyTask", {
        params: {
          offerId: this.$store.getters.getOfferId,
          account: this.$store.getters.getAccount,
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

    },
    clickRowHandle(row, column, event) {
      if (this.expands.includes(row.taskId)) {
        this.expands = this.expands.filter(val => val !== row.taskId);
      } else {
        //判断是否已经存在展开的行
        if (this.expands.length != 0) {
          //如果存在展开行,清空expands数组,使它关闭
          this.expands.splice(0, this.expands.length);
          //打开点击的行
          this.expands.push(row.taskId);
        } else {
          //如果不存在展开行,直接push打开点击的行
          this.expands.push(row.taskId);
        }
      }
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