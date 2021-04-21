<template>
<div>
  <el-table
      :data="tableData"
      height="580"
      border
      style="width: 80%">
    <el-table-column fixed label="序号" width="50" align="center">
      <template scope="scope">
        <span>
          {{scope.$index + 1}}
        </span>
      </template>
    </el-table-column>
    <el-table-column
        prop="studentId"
        label="学生序号"
        width="180"
        v-if=show>
    </el-table-column>
    <el-table-column
        prop="studentName"
        label="姓名"
        width="180">
    </el-table-column>
    <el-table-column
        prop="className"
        label="班级"
        width="180">
    </el-table-column>
    <el-table-column
        prop="account"
        label="学号">
    </el-table-column>
    <el-table-column
        label="操作">
      <template slot-scope="scope">
<!--        <el-button size="mini" type="primary" @click="updateStudent(scope.row)">编辑</el-button>-->
        <el-button size="mini" type="danger" @click="handleOpen(scope.row)">移除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
      background
      layout="prev, pager, next"
      :page-size=pageSize
      :total=total
      @current-change="newPage">
  </el-pagination>
</div>
</template>

<script>
export default {
  inject: ['reload'],
  name: "StudentInfo",
    data() {
      return {
        show: false,
        pageSize: 10,
        total: null,
        offerId: '',
        tableData: [{
          studentName: '',
          className: '',
          account: '',
          studentId: '',
        },
        ]
      }
    },
  created() {
    const _this = this;
    this.offerId = this.$store.getters.getOfferId;
    console.log(this.offerId)
    axios.get("http://localhost:8181/timetable/studentInfo/",{
      params: {
        page: 1,
        size: this.pageSize,
        offerId: this.offerId,
      },
      crossDomain: true,
      xhrFields: {withCredentials: true},
      headers: {
        token: this.getToken(),
      }
    }).then(function (resp) {
      _this.tableData = resp.data.records;
      _this.total = resp.data.total;
    })
  },
  methods: {
    handleOpen(data){
      this.$confirm('确认将该同学移除本门课程吗？')
          .then(_ => {
            this.deleteStudent(data);
          })
          .catch(_ => {});
    },
    deleteStudent(data){
      const _this = this;
      axios.delete("http://localhost:8181/timetable/delete",{
        params: {
          account: data.accept,
          offerId: this.offerId,
        },
        crossDomain: true,
        xhrFields: {withCredentials: true},
        headers: {
          token: this.getToken(),
        }
      }).then(function (resp) {
        if(resp.data){
          _this.$message({
            type: 'info',
            message: "移除成功"
          });
          this.reload();
        }else {
          _this.$message({
            type: 'warning',
            message: "移除失败"
          });
        }

      })
    },
    updateStudent(row){
      console.log(row)
    },
    newPage(currentPage){
      const _this = this;
      axios.get('http://localhost:8181/timetable/studentInfo/',{
        params: {
          page: currentPage,
          size: this.pageSize,
          offerId: this.offerId,
        },
        crossDomain: true,
        xhrFields: {withCredentials: true},
        headers: {
          token: this.getToken(),
        }
      })
          .then(function (response){
            _this.tableData = response.data.records;
            _this.total = response.data.total;
          })
    },
  },

}

</script>

<style scoped>
/deep/.el-table th > .cell {
  text-align: center;
}

/deep/.el-table .cell {
  text-align: center;
}
</style>