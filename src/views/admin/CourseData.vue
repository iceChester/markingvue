<template>
  <div style="margin: 30px 8%">
    <div style="margin: 30px auto; text-align: center">
      <h1>课程信息</h1>
    </div>
    <el-divider></el-divider>
    <el-row :gutter="20" style="margin-bottom: 20px">
      <el-col :span="2" style="margin-left: 8%"><div>
        <el-upload
            class="upload-demo"
            action="http://localhost:8181/course/importExcel/"
            accept=".xls,.xlsx"
            :headers="this.headers"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-success="uploadSuccess"
            :multiple="false"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList"
        >
          <el-button size="small" type="primary">导入数据</el-button>
        </el-upload>
      </div></el-col>
      <el-col :span="2" style="float: left"><div>
        <el-link :underline="false" :href="fileUrl" download="课程信息模板.xls" >
          <el-button size="small" type="primary" @click="downTemplate">课程信息模板下载</el-button>
        </el-link>
      </div></el-col>
      <el-col :span="2" style="float: right;margin-right: 10%"><div>
        <el-button type="primary" @click="toExcel"size="small" >导出表格</el-button>
      </div></el-col>
    </el-row>
    <div>
      <el-table
          :data="tableData"
          height="580"
          border
          style="width: 80%;margin-left: 8%">
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
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="danger"
                @click="handleOpen(scope.row)">删除课程</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
      <el-pagination
          background
          layout="prev, pager, next"
          :page-size=pageSize
          :total=total
          @current-change="newPage"
          style="margin: 20px 42%">
      </el-pagination>
  </div>
</template>

<script>
export default {
  name: "CourseData",
  data() {
    return {
      show: false,
      headers: {
        token: this.getToken()
      },
      pageSize: 10,
      total: null,
      keyWord: '',
      offerId: '',
      fileUrl: '',
      fileList:[],
      tableData: [{
        courseName: '',
        courseId: '',
      },
      ]
    }
  },
  created() {
    const _this = this;
    console.log(this.offerId)
    axios.get("http://localhost:8181/course/findAll/",{
      params: {
        page: 1,
        size: this.pageSize,
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
    toExcel(){
      axios.get("http://localhost:8181/course/export/", {
        params: {
        },
        crossDomain: true,
        responseType: 'blob',
        xhrFields: {withCredentials: true},
        headers: {
          token: this.getToken(),
        }
      }).then(function (resp) {
        const blob = new Blob([resp.data], {type: 'application/vnd.ms-excel'})
        let filename = '课程信息.xls'
        // 创建一个超链接，将文件流赋进去，然后实现这个超链接的单击事件
        const elink = document.createElement('a')
        elink.download = filename
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象

      })
    },
    handleOpen(data){
      this.$confirm('确认删除？')
          .then(_ => {
            this.deleteCourse(data);
          })
          .catch(_ => {});
    },
    deleteCourse(data){
      const _this = this;
      axios.delete("http://localhost:8181/course/delete",{
        params: {
          id: data.courseId,
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
            message: "删除成功"
          });
          this.$router.go(0);
        }else {
          _this.$message({
            type: 'warning',
            message: "删除失败"
          });
        }
      })
    },
    downTemplate(){
      this.fileUrl = "http://localhost:8181/static/data/课程信息模板.xls";
    },
    uploadSuccess(response, file, fileList){
      this.fileList = [];
      console.log(response);
      if(response.data){
        this.$message({
          type: 'info',
          message: "导入成功"
        });
      }else {
        this.$message({
          type: 'warning',
          message: "导入失败"
        });
      }
      this.$router.go(0);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    importData(){

    },
    updateStudent(row){
      console.log(row)
    },
    newPage(currentPage){
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