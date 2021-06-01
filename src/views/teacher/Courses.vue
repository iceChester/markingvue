<template>
  <div>
    <div style="margin: 30px auto; text-align: center">
      <h2>学校课程</h2>
    </div>
    <el-divider></el-divider>
    <el-table
        :data="tableData.filter(data => !search || data.courseName.toLowerCase().includes(search.toLowerCase()))"
        :border="true"
        style="width: 66%;margin: 3% 15% 1% 15%">
      <el-table-column
          label="编号"
          prop="courseId">
      </el-table-column>
      <el-table-column
          label="课程名称"
          prop="courseName">
      </el-table-column>
      <el-table-column
          align="right">
        <template slot="header" slot-scope="scope">
          <el-input
              v-model="search"
              size="mini"
              placeholder="输入关键字搜索"/>
        </template>
        <template slot-scope="scope">
          <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">开设课程</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        background
        style="margin-left: 45%"
        layout="prev, pager, next"
        :page-size=pageSize
        :total=total
        @current-change="pageChange">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageSize: 10,
      total: null,
      tableData: {},
      search: ''
    }
  },
  created() {
    const _this = this;
    axios.get('http://localhost:8181/course/findAll/',{
      params: {
        page: 1,
        size: this.pageSize,
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
  methods: {
    handleEdit(index, row) {
      this.$router.push({
        path: "/OfferCourse",
        query: {
          courseId: row.courseId,
          courseName: row.courseName,
        }
      })
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    pageChange(currentPage){
      console.log(currentPage);
      const _this = this;
      axios.get('http://localhost:8181/course/findAll/',{
        params: {
          page: currentPage,
          size: this.pageSize,
        },
        crossDomain: true,
        xhrFields: {withCredentials: true},
        headers: {
          token: this.getToken(),
        }
      }).then(function (response){
        _this.tableData = response.data.records;
        _this.total = response.data.total;
      })
    }
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