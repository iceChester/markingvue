<template>
  <div>
    <el-table
        :data="CourseGroupData"
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
          <el-form label-position="left" inline class="table-expands" v-for="(item,index) in props.row.memberAccount">
            <el-form-item label="成员名：">
              <span>{{ props.row.memberName[index] }}</span>
            </el-form-item>
            <el-form-item label="学号：">
              <span>{{ item }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column fixed label="序号" width="50" align="center">
        <template scope="scope">
        <span>
          {{scope.$index + 1}}
        </span>
        </template>
      </el-table-column>
      <el-table-column
          prop="groupName"
          label="组名"
      >
      </el-table-column>
      <el-table-column
          prop="leaderName"
          label="组长名"
      >
      </el-table-column>
      <el-table-column
          label="操作"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small">查看</el-button>
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
  name: "CourseGroup",
  data() {
    return {
      dialogVisible: false,
      CourseGroupData: [],
      fileList: [],
      pageSize: 10,
      total: null,
      // 获取row的key值
      getRowKeys(row) {
        return row.taskId;
      },
      // 要展开的行，数值的元素是row的key值
      expands: [],
      headers: {
        token: this.getToken()
      },
    }
  },
  mounted() {
    this.groupDetail();
  },
  methods: {
    newPage(currentPage){
      const _this = this;
      axios.get("http://localhost:8181/groupInfo/courseGroups", {
        params: {
          offerId: this.$store.getters.getOfferId,
          page: currentPage,
          size: this.pageSize,
        },
        crossDomain: true,
        xhrFields: {withCredentials: true},
        headers: {
          token: this.getToken(),
        }
      }).then(function (resp) {
        _this.CourseGroupData = resp.data.records;
        _this.total = resp.data.total;
      })
    },
    groupDetail() {
      const _this = this;
      axios.get("http://localhost:8181/groupInfo/courseGroups", {
        params: {
          offerId: this.$store.getters.getOfferId,
          page: 1,
          size: this.pageSize,
        },
        crossDomain: true,
        xhrFields: {withCredentials: true},
        headers: {
          token: this.getToken(),
        }
      }).then(function (resp) {
        console.log(resp.data);
        _this.CourseGroupData = resp.data.records;
        _this.total = resp.data.total;
      })
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