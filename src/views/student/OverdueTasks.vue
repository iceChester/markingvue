<template>
<div>
  <el-divider content-position="center"><h2>下次记得及时提交作业哦</h2></el-divider>
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
    </el-table>
  </div>
  <el-backtop target=".page-component__scroll .el-scrollbar__wrap"></el-backtop>
</div>
</template>

<script>
export default {
  name: "OverdueTasks",
  data() {
    return {
      studentTaskData: [],
    }
  },
  mounted() {
    this.taskDetail();
  },
  methods: {
    taskDetail() {
      const _this = this;
      axios.get("http://localhost:8181/studentTask/studentOverdueTask", {
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
  }
}
</script>

<style scoped>

</style>