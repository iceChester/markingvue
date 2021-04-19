<template>
  <div>
    <el-table
        :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%">
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
          <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        background
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
      tableData: null,
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