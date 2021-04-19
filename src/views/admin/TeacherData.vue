<template>
  <div style="margin: 30px 8%">
    <div style="margin: 30px auto; text-align: center">
      <h1>学生信息</h1>
    </div>
    <el-divider></el-divider>
    <el-row :gutter="20">
      <el-col :span="10" ><div>
        <el-upload
            class="upload-demo"
            action="http://localhost:8181/teacher/importExcel/"
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
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </div></el-col>
      <el-col :span="2" style="float: right"><div>
        <a style="color: #01a7f8;" class='download' href='http://localhost:8181/data/学生信息模板.xls' download="学生信息模板.xls" title="学生信息模板下载">
          Excel模板下载
        </a>
      </div></el-col>
    </el-row>
    <div>
      <el-table
          :data="tableData"
          height="380"
          border
          style="width: 80%;margin-left: 8%">
        <el-table-column fixed label="序号" width="50" align="center">
          <template scope="scope">
        <span>
          {{scope.$index + 1}}
        </span>
          </template>
        </el-table-column>
        <el-table-column
            prop="teacherId"
            label="序号"
            width="180"
            v-if=show>
        </el-table-column>
        <el-table-column
            prop="teacherName"
            label="姓名"
            width="180">
        </el-table-column>
        <el-table-column
            prop="account"
            label="工号">
        </el-table-column>
        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="updateStudent(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger">删除</el-button>
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
  name: "TeacherData",
  data() {
    return {
      show: false,
      headers: {
        token: this.getToken()
      },
      pageSize: 6,
      total: null,
      offerId: '',
      fileList:[],
      tableData: [{
        teacherName: '',
        className: '',
        account: '',
      },
      ]
    }
  },
  created() {
    const _this = this;
    console.log(this.offerId)
    axios.get("http://localhost:8181/teacher/findAll/",{
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
    download(){

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
      axios.get('http://localhost:8181/teacher/findAll/',{
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