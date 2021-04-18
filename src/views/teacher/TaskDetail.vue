<template>
  <div>
    <div style="margin: 30px auto; text-align: center">
        <h1>作业详情</h1>
    </div>
    <el-divider></el-divider>
    <el-page-header @back="goBack" content="详情页面"></el-page-header>
    <el-row :gutter="20" style="margin-top: 30px">
      <el-col :span="12"><Bar ref="bar" :barData = this.barData :xData = this.xData v-if="isBarShow"></Bar> </el-col>
      <el-col :span="12"><Pie ref="pie" :pieData = this.pieData v-if="isPieShow"></Pie> </el-col>
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
            label="评分"
            v-if="isMarkingShow">
          <template slot-scope="scope">
            <el-input
                v-model="scope.row.score"
                size="normal"
                type="number"
                placeholder="输入分数" style="height: 80%;width: 60%"
                @change="setScore(scope.row)"
                :max="1"/>
            <el-button size="mini" type="primary"  @click="updateStudent(scope.row)" style="margin-left: 10%">确定</el-button>
          </template>
        </el-table-column>
        <el-table-column width="240" fixed="right">
          <template slot="header" slot-scope="scope">
            <el-button type="primary" @click="toExcel" style="padding-right: 5%;padding-top: 20px">导出表格</el-button>
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
      isMarkingShow: false,
      isBarShow: false,
      isPieShow: false,
      markingType: {
        position: '',
        weight: [],
      },
      pageSize: 6,
      total: null,
      drawer: false,
      innerDrawer: false,
      barData: [0, 0, 0, 0, 0, 0],
      xData: ['0~20', '20~40', '40~60', '60~80', '80~100',"未批改"],
      pieData:[          // 数据数组，name 为数据项名称，value 为数据项值
        {value:0, name:'已完成'},
        {value:100, name:'未完成'},
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
        score: '',
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
    this.getBarData();
    this.getPieData();
    this.checkMarking();
  },
  methods: {
    setScore(data){
      const testScore = parseInt(data.score);
      console.log(testScore);
      if(testScore>=0&&testScore<=100){
        if(this.markingType.position==1){
          data.scoreOne = testScore;
        }else if(this.markingType.position==2){
          data.scoreTwo = testScore;
        }else if(this.markingType.position==3){
          data.scoreThree = testScore;
        }
        if(this.markingType.weight[0]==0){
          data.scoreOne = 0;
        }
        if(this.markingType.weight[1]==0){
          data.scoreTwo = 0;
        }
        if(this.markingType.weight[2]==0){
          data.scoreThree = 0;
        }
        if(data.scoreOne!=undefined&&data.scoreTwo!=undefined&&data.scoreThree!=undefined){
          data.scoreTotal = data.scoreOne * this.markingType.weight[0] + data.scoreTwo * this.markingType.weight[1] + data.scoreThree * this.markingType.weight[2];
          this.score = 0;
        }
      }else {
        this.$message({
          type: 'warning',
          message: "分数需要在0~100；请重新输入分数"
        });
      }
    },
    checkMarking(){
      const _this = this;
      axios.get("http://localhost:8181/task/checkMarking/", {
        params: {
          taskId: this.taskId,
          account: this.$store.getters.getAccount,
        },
        crossDomain: true,
        xhrFields: {withCredentials: true},
        headers: {
          token: this.getToken(),
        }
      }).then(function (resp) {
         _this.markingType = resp.data;
        if(_this.markingType.position==4){
          _this.isMarkingShow = false;
        }else{
          _this.isMarkingShow = true;
        }
      })
    },
    getPieData(){
      const _this = this;
      axios.get("http://localhost:8181/studentTask/pieData/", {
        params: {
          taskId: this.taskId,
          offerId: this.$store.getters.getOfferId,
        },
        crossDomain: true,
        xhrFields: {withCredentials: true},
        headers: {
          token: this.getToken(),
        }
      }).then(function (resp) {
        console.log(resp);
        _this.pieData[0].value = resp.data[0];
        _this.pieData[1].value = resp.data[1];
        _this.isPieShow = true;
      })
    },
    getBarData(){
      const _this = this;
      axios.get("http://localhost:8181/studentTask/barData/", {
        params: {
          taskId: this.taskId,
        },
        crossDomain: true,
        xhrFields: {withCredentials: true},
        headers: {
          token: this.getToken(),
        }
      }).then(function (resp) {
        _this.barData = resp.data;
        _this.isBarShow = true;
      })
    },
    toExcel(){
      axios.get("http://localhost:8181/studentTask/export/", {
        params: {
          taskId: this.taskId,
        },
        crossDomain: true,
        responseType: 'blob',
        xhrFields: {withCredentials: true},
        headers: {
          token: this.getToken(),
        }
      }).then(function (resp) {
        const blob = new Blob([resp.data], {type: 'application/vnd.ms-excel'})
        let filename = '成绩单.xls'
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