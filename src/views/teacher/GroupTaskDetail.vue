<template>
<div>
  <div style="margin: 30px auto; text-align: center">
    <h1>作业详情</h1>
  </div>
  <el-divider></el-divider>
  <el-page-header @back="goBack" content="详情页面"></el-page-header>
  <div style="margin-top: 20px">
    <el-button type="primary" @click="toExcel" size="mini"  style="padding-right: 5%;margin-left: 42%">导出表格</el-button>
    <el-button type="primary" @click="downloadAllTask" size="mini"  style="padding-right: 5%;">下载所有作业</el-button>
  </div>
  <div style="width: 90% ;margin: 0 auto;height:880px;overflow: auto">
    <el-card class="taskCard" v-for="(item,index) in taskData">
      <div slot="header" class="clearfix">
        <span>小组名称：{{item.groupName}}</span>
        <span style="float: right">
          <el-button size="mini" type="primary"  @click="downloadOne(item)">下载作业</el-button>
          <el-button size="mini" @click="openDrawer(item.studentTaskList[0])" type="primary" style="margin-left: 16px;">查看</el-button>
        </span>
      </div>
      <el-table
          :data="item.studentTaskList"
          height="480"
          border
          >
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
              prop="scoreThree"
              label="助教二评分">
          </el-table-column>
          <el-table-column
              prop="scoreTotal"
              label="总分">
          </el-table-column>
        </el-table-column>
        <el-table-column
            width="160"
            fixed="right"
            label="评分"
            v-if="isMarkingShow">
          <template slot-scope="scope">
            <el-input
                v-model="scope.row.score"
                size="normal"
                type="number"
                placeholder="输入分数"
                @change="setScore(scope.row)"
                />
            <!--            <el-button size="mini" type="primary"  @click="updateStudent(scope.row)" style="margin-left: 10%">确定</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
  <div>
    <el-drawer
        title="xxx的作业"
        :visible.sync="drawer"
        :before-close="handleClose"
        size="50%"
        style="overflow: auto"
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
        <div >
          <el-button @click="this.showBigImg"  style="margin: 20px 50%">预览</el-button>
          <el-image-viewer
              v-if="showViewer"
              :on-close="()=>{showViewer=false}"
              :url-list="this.imgSrc" />
        </div>
      </div>
      <div style="width: 75%;margin: 30px auto;height: 45%" v-show="isVideoShow">
        <Video ref="video" :videoSrc = "this.videoSrc"></Video>
      </div>
    </el-drawer>
  </div>
</div>
</template>

<script>
import Video from '../../components/common/VideoPlay.vue'
import { Loading } from 'element-ui';
export default {
  name: "GroupTaskDetail",
  components: {
    Video,'el-image-viewer':()=>import('element-ui/packages/image/src/image-viewer')
  },
  data(){
    return {
      videoSrc: '',
      showViewer: false,
      imgSrc: [],
      showBig: false,
      isImgShow: false,
      isVideoShow: false,
      isMarkingShow: false,
      markingType: {
        position: '',
        weight: [],
      },
      drawer: false,
      innerDrawer: false,
      show: false,
      offerId: this.$store.getters.getOfferId,
      taskId: this.$store.getters.getTaskId,
      title: this.$store.getters.getTaskTitle,
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
        groupId: '',
      }],
      taskData: [],
    }
  },
  created(){
    this.groupDetail();
    this.checkMarking();
  },
  methods: {
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
    downloadOne(item){
      const row = item.studentTaskList[0];
      let loadingInstance = Loading.service({
        text: "压缩文件中，请稍等。"
      });
      const _this = this;
      axios.get("http://localhost:8181/studentTask/downloadOneTask",{
        params: {
          taskId: this.taskId,
          account: row.account,
          groupId: row.groupId,
        },
        crossDomain: true,
        responseType: 'blob',
        xhrFields: {withCredentials: true},
        headers: {
          token: this.getToken(),
        }
      }).then(function (resp) {
        let blob = new Blob([resp.data],{type:"application/zip"});
        let url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");//创建a标签
        link.href=url;
        link.download = item.groupName;//重命名文件
        link.click();
        URL.revokeObjectURL(url);
        _this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
          loadingInstance.close();
        });
      })
    },
    downloadAllTask(){
      let loadingInstance = Loading.service({
        text: "压缩文件中，请稍等。"
      });
      const _this = this;
      axios.get("http://localhost:8181/studentTask/downloadAllTask",{
        params: {
          taskId: this.taskId,
          groupId: 0,
        },
        crossDomain: true,
        responseType: 'blob',
        xhrFields: {withCredentials: true},
        headers: {
          token: this.getToken(),
        }
      }).then(function (resp) {
        let blob = new Blob([resp.data],{type:"application/zip"});
        let url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");//创建a标签
        link.href=url;
        link.download = "小组作业";//重命名文件
        link.click();
        URL.revokeObjectURL(url);
        _this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
          loadingInstance.close();
        });
      })
    },
    setScore(data){
      const testScore = parseInt(data.score);
      if(testScore>=0&&testScore<=100){
        if(this.markingType.weight.length==1){
          if(this.markingType.position==1){
            data.scoreOne = testScore;
            data.scoreTwo = 0;
            data.scoreThree = 0;
          }
        }else if(this.markingType.weight.length==2){
          if(this.markingType.position==1){
            data.scoreOne = testScore;
            data.scoreThree = 0;
          }else if(this.markingType.position==2){
            data.scoreTwo = testScore;
            data.scoreThree = 0;
          }
          if(this.markingType.weight[0]==0){
            data.scoreOne = 0;
          }
          if(this.markingType.weight[1]==0){
            data.scoreTwo = 0;
          }
        }else if(this.markingType.weight.length==3){
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
        }
        if(data.scoreOne!=undefined&&data.scoreTwo!=undefined&&data.scoreThree!=undefined){
          if(this.markingType.weight.length ==1){
            data.scoreTotal = data.scoreOne * parseFloat(this.markingType.weight[0])/100.0;
          }else if(this.markingType.weight.length ==2){
            data.scoreTotal = data.scoreOne * parseFloat(this.markingType.weight[0])/100.0+ data.scoreTwo * parseFloat(this.markingType.weight[1])/100.0;
          }else if(this.markingType.weight.length ==3){
            data.scoreTotal = data.scoreOne * parseFloat(this.markingType.weight[0])/100.0 + data.scoreTwo * parseFloat(this.markingType.weight[1])/100.0 + data.scoreThree * parseFloat(this.markingType.weight[2])/100.0;
          }
          console.log();
          data.score = 0;
        }
        this.saveScore(data);
      }else {
        this.$message({
          type: 'warning',
          message: "分数需要在0~100；请重新输入分数"
        });
      }
    },
    saveScore(data){
      const _this = this;
      axios.post("http://localhost:8181/studentTask/saveScore",data,{
        crossDomain: true,
        xhrFields: {withCredentials: true},
        headers: {
          token: this.getToken(),
        }
      }).then(function (resp) {
        if(resp.data){
          _this.$message({
            type: 'info',
            message: "评分成功"
          });
        }else {
          _this.$message({
            type: 'warning',
            message: "评分失败"
          });
        }
      })
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
        console.log(_this.markingType.position)
        if(_this.markingType.position==4){
          _this.isMarkingShow = false;
        }else{
          _this.isMarkingShow = true;
        }
      })
    },
    groupDetail() {
      const _this = this;
      axios.get("http://localhost:8181/studentTask/groupTaskList/", {
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
        console.log(resp.data);
        _this.taskData = resp.data;

      })
    },
    goBack(){
      this.$router.push({
        path: "/GroupTasks"
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            this.isVideoShow = false;
            done();
          })
          .catch(_ => {});
      // this.isVideoShow = !this.isVideoShow;
      // done();
    },
    showBigImg(){
      this.showViewer=true;
      this.drawer= false;
      this.isVideoShow = false;
    },
    openDrawer(row) {
      let path = "studentTask/"+this.$store.getters.getOfferId+"/" + "小组作业" + "/" +this.taskId + "/" + row.groupId + "/";
      let videoName = row.videoFile.split(",")
      let imgName = row.imgFile.split(",")
      console.log(videoName)
      if(videoName.length>0&&videoName[0]!=""){
        this.videoSrc = path + videoName[0];
        this.isVideoShow = true;
      }else {
        this.isVideoShow = false;
      }
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
    },
    openInnerDrawer(){
      this.innerDrawer = !this.innerDrawer;
    }
  }
}
</script>

<style scoped>
.taskCard{
  margin-top: 50px;
}
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