<template>
  <div>
    <el-page-header @back="goBack" content="详情页面"></el-page-header>
    <el-row :gutter="20">
      <el-col :span="12"><Bar ref="bar" :barData = this.barData :xData = this.xData></Bar> </el-col>
      <el-col :span="12"><Pie ref="pie" :pieData = this.pieData></Pie> </el-col>
    </el-row>
    <div>
      <el-table
          :data="tableData"
          height="280"
          border
          style="width: 90% ;margin: 0 auto">
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
            width="120">
        </el-table-column>
        <el-table-column
            prop="className"
            label="班级"
            width="120">
        </el-table-column>
        <el-table-column
            prop="account"
            label="学号">
        </el-table-column>
        <el-table-column
            prop="submitDate"
            label="完成时间">
        </el-table-column>
        <el-table-column
            label="分数">
          <el-table-column
              prop="scoreOne"
              label="主教师评分">
          </el-table-column>
          <el-table-column
              prop="scoreTwo"
              label="助教一评分">
          </el-table-column>
          <el-table-column
              prop="scoreThere"
              label="助教二评分">
          </el-table-column>
          <el-table-column
              prop="scoreTotal"
              label="总分">
          </el-table-column>
        </el-table-column>
        <el-table-column
            width="240"
            fixed="right"
            label="评分">
          <template slot-scope="scope">
            <el-input
                v-model="marking"
                size="normal"
                placeholder="输入分数" style="height: 80%;width: 60%"/>
            <el-button size="mini" type="primary"  @click="updateStudent(scope.row)" style="margin-left: 10%">确定</el-button>
          </template>
        </el-table-column>
        <el-table-column width="240" fixed="right">
          <template slot="header" slot-scope="scope">
            <el-input
                v-model="search"
                size="normal"
                placeholder="输入关键字搜索" style="height: 80%"/>
          </template>
          <template slot-scope="scope">
            <el-button size="mini" type="primary"  @click="updateStudent(scope.row)">下载作业</el-button>
            <el-button size="mini" @click="openDrawer(scope.row)" type="primary" style="margin-left: 16px;">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          background
          layout="prev, pager, next"
          :page-size=pageSize
          :total=total
          @current-change="newPage"
          style="overflow: auto;float: right;padding-right: 5%;padding-top: 20px">
      </el-pagination>
    </div>
    <div>
      <el-drawer
          title="xxx的作业"
          :visible.sync="drawer"
          :before-close="handleClose"
          size="60%"
          >
        <div>
          <el-button @click="openInnerDrawer">其他文件!</el-button>
          <el-drawer
              title="我是里面的"
              :append-to-body="true"
              :before-close="handleClose"
              :visible.sync="innerDrawer">
            <p>_(:зゝ∠)_</p>
          </el-drawer>
        </div>
        <div style="height: 45%" v-if="isImgShow">
          <el-carousel :interval="4000" type="card">
            <el-carousel-item v-for="item in this.imgSrc" :key="item">
              <el-image :src="item" class="image"/>
            </el-carousel-item>
          </el-carousel>
          <div>
            <el-button @click="this.showBigImg" >预览</el-button>
            <el-image-viewer
                v-if="showViewer"
                :on-close="()=>{showViewer=false}"
                :url-list="this.imgSrc" />
          </div>
        </div>
        <div style="width: 75%;margin: 0 auto;" v-show="isVideoShow">
          <Video ref="video" :videoSrc = "this.videoSrc"></Video>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>

import Pie from '../../components/e-charts/pie.vue'
import Bar from '../../components/e-charts/bar.vue'
import Video from '../../components/common/VideoPlay.vue'
export default {
  name: "TaskDetail",
  components: {
    Pie,Bar,Video,'el-image-viewer':()=>import('element-ui/packages/image/src/image-viewer')
  },
  data() {
    return {
      videoSrc: '',
      showViewer: false,
      imgSrc: [],
      showBig: false,
      showBigImgList:[],
      isImgShow: false,
      isVideoShow: false,
      marking: '',
      pageSize: 6,
      total: null,
      drawer: false,
      innerDrawer: false,
      barData: [120, 200, 150, 80, 70, 110, 130],
      xData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      pieData:[          // 数据数组，name 为数据项名称，value 为数据项值
        {value:235, name:'视频广告'},
        {value:274, name:'联盟广告'},
        {value:310, name:'邮件营销'},
        {value:335, name:'直接访问'},
        {value:400, name:'搜索引擎'}
      ],
      show: false,
      offerId: '',
      taskId: '',
      search: '',
      tableData: [{
        studentName: '',
        className: '',
        account: '',
        scoreOne: '',
        scoreTwo: '',
        scoreThree: '',
        scoreTotal: '',
        fileName: [],
        submitDate: '',
      }],
    }
  },

  created() {
    this.taskId = this.$route.query.taskId;
    this.$store.dispatch("changeOfferId",this.$route.query.offerId);

  },
  mounted(){
    // 在通过mounted调用即可
    this.groupDetail();
  },
  methods: {
    newPage(currentPage){
      const _this = this;
      axios.get("http://localhost:8181/studentTask/courseTaskList/", {
        params: {
          taskId: this.taskId,
          page: currentPage,
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
    groupDetail() {
      const _this = this;
      axios.get("http://localhost:8181/studentTask/courseTaskList/", {
        params: {
          taskId: this.taskId,
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
        _this.tableData = resp.data.records;
        _this.total = resp.data.total;
      })
    },
    goBack(){
      this.$router.push({
        path: "/CourseTasks",
        query: {
          offerId: this.offerId,
        }
      })
    },
    updateStudent(row){
      console.log(row)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            this.isVideoShow = !this.isVideoShow;
            done();
          })
          .catch(_ => {});
      // this.isVideoShow = !this.isVideoShow;
      // done();
    },
    showBigImg(){
      this.showViewer=true;
      this.drawer= false;
      this.isVideoShow = !this.isVideoShow;
    },
    openDrawer(row) {
      let path = "studentTask/"+this.$store.getters.getOfferId+"/" + "个人作业" + "/" +this.taskId + "/" + row.account + "/";
      let videoName = row.videoFile.split(",")
      let imgName = row.imgFile.split(",")
      this.videoSrc = path + videoName[0];
      this.imgSrc = [];
      imgName.forEach((item,index) =>{
        if(item!=""){
          this.imgSrc.push(path+item);
        }
      })
      if(this.imgSrc.length>0){
        this.isImgShow = true;
      }
      this.drawer = !this.drawer;
      this.isVideoShow = !this.isVideoShow;
    },
    openInnerDrawer(){
      this.innerDrawer = !this.innerDrawer;
    }
  }
}
</script>

<style scoped>
/deep/.el-table th > .cell {
  text-align: center;
}

/deep/.el-table .cell {
  text-align: center;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
.image{
  height: 100%;
  width: 100%;
  /*z-index: 22000000000000 !important;*/
}
/*::v-deep.el-drawer__wrapper {*/
/*  z-index: 1800 !important;*/
/*}*/
</style>