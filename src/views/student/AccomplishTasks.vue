<template>
<div>
  <el-divider content-position="center"><h2>需要进一步完善作业吗</h2></el-divider>
  <div style="margin: 50px auto">
    <el-table
        :data="accomplishTaskData"
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
          <el-button @click.stop="deleteClick(scope.row)" type="text" size="small">删除作业</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-divider content-position="center"><h2>恭喜你，及时完成作业了耶</h2></el-divider>
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
            <el-form-item label="提交日期">
              <span>{{ props.row.submitDate }}</span>
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
          label="作业详情"
          prop="detail"
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
        </template>
      </el-table-column>
    </el-table>
  </div>
</div>
</template>

<script>
import {Loading} from "element-ui";

export default {
  name: "AccomplishTasks",
  inject: ['reload'],
  data() {
    return {
      dialogVisible: false,
      accomplishTaskData: [],
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
    this.getAccomplishTask();
  },
  methods: {
    downloadOne(row){
      console.log(row);
      let loadingInstance = Loading.service({
        text: "压缩文件中，请稍等。"
      });
      const _this = this;
      axios.get("http://localhost:8181/studentTask/downloadOneTask",{
        params: {
          taskId: row.taskId,
          account: this.$store.getters.getAccount,
        },
        crossDomain: true,
        responseType: 'blob',
        xhrFields: {withCredentials: true},
        headers: {
          token: this.getToken(),
        }
      }).then(function (resp) {
        console.log(row);
        let blob = new Blob([resp.data],{type:"application/zip"});
        let url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");//创建a标签
        link.href=url;
        link.download = row.title+"_"+_this.$store.getters.getAccount;//重命名文件
        link.click();
        URL.revokeObjectURL(url);
        _this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
          loadingInstance.close();
        });
      })
    },
    deleteClick(data){
      this.$confirm('此操作将永久删除该次作业文件，需要重新提交, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteTask(data)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    deleteTask(data){
      const _this = this;
      axios.delete("http://localhost:8181/studentTask/deleteStudentTask",{
        params: {
          taskId: data.taskId,
          account: this.$store.getters.getAccount,
        },
        crossDomain: true,
        xhrFields: {withCredentials: true},
        headers: {
          token: this.getToken(),
        }
      }).then(function (resp) {
        if(resp.data){
          _this.$message({
            type: 'success',
            message: '删除成功!'
          });
          _this.reload();
        }else {
          _this.$message({
            type: 'warning',
            message: '删除失败!'
          });
        }
      })
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
    getAccomplishTask(){
      const _this = this;
      axios.get("http://localhost:8181/task/studentAccomplishTask", {
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
        _this.accomplishTaskData = resp.data;
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