<template>
  <div style="width: 70%;margin: 0 auto;">
    <el-divider content-position="center"><h2>结束收集的作业</h2></el-divider>
    <div style="margin: 50px auto">
      <el-card class="box-card" v-for="(item,index) in taskFrom" style="margin-bottom: 30px">
        <div >
          <div slot="header" class="clearfix">
            <h3>作业名称：{{item.title}}</h3>
            <el-button style="float: right; padding: 3px 0" type="text" @click="taskDetail(item)">详情</el-button>
          </div>
          <el-divider></el-divider>
          <div v-if="item.objectiveContent!=null" >
            <h3 style="margin-left: 120px">目标点：</h3>
            <el-collapse v-model="activeNameDeadline" style="margin: 30px 10%">
              <el-collapse-item :title="title+(index+1)" :name="item.taskId+'-'+index" v-for="(item2,index) in item.objectiveContent">
                <h3>{{ item2.objectiveContent }}</h3>
              </el-collapse-item>
            </el-collapse>
          </div>
          <h3 style="margin-left: 120px">基本信息：</h3>
          <el-row :gutter="20" style="margin-left: 120px;margin-bottom: 20px">
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <span>作业内容： {{item.detail}}</span>
              </div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">
                <span>截至日期： {{item.deadline}}</span>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-left: 120px">
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <span>作业类型： {{item.taskType}}</span>
              </div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">
                <span>评分类型： {{item.markingType}}</span>
              </div>
            </el-col>
          </el-row>
        </div>

      </el-card>
    </div>
    <el-divider content-position="center"><h2>待收集的作业</h2></el-divider>
    <el-card class="box-card" v-for="(item,index) in deadlineTask" style="margin-bottom: 30px">
      <div >
        <div slot="header" class="clearfix">
          <span>作业名称：{{item.title}}</span>
<!--          <el-button style="float: right; padding: 3px 0" type="text" @click="taskDetail(item)">详情</el-button>-->
        </div>
        <el-divider></el-divider>
        <div v-if="item.objectiveContent!=null" >
          <h3 style="margin-left: 120px">作业课程指标点</h3>
          <el-collapse v-model="activeNameDeadline" style="margin: 30px 10%">
            <el-collapse-item :title="title+(index+1)" :name="item.taskId+'-'+index" v-for="(item2,index) in item.objectiveContent">
              <h3>{{ item2.objectiveContent }}</h3>
            </el-collapse-item>
          </el-collapse>
        </div>
        <h3 style="margin-left: 120px">作业基本信息：</h3>
        <el-row :gutter="20" style="margin-left: 120px;margin-bottom: 20px">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <span>作业内容： {{item.detail}}</span>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purple">
              <span>截至日期： {{item.deadline}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-left: 120px">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <span>作业类型： {{item.taskType}}</span>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purple">
              <span>评分类型： {{item.markingType}}</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

  </div>
</template>

<script>
export default {
  name: "teacherTasks",
  props: {
    taskType: {
      type: Number,
      default: 0,
    }
  },
  data() {
    return {
      activeName: '1',
      activeNameCollecting: [],
      activeNameDeadline: [],
      title: '对应的课程目标-',
      activeNames: [],
      datacollection: null,
      myChart: '',
      token: this.getToken(),
      taskFrom: [
        {
          taskId: '',
          offerId: '',
          title: '',
          detail: '',
          deadline: '',
          taskType: '',
          markingType: '',
        }
      ],
      deadlineTask: [
        {
          taskId: '',
          offerId: '',
          title: '',
          detail: '',
          deadline: '',
          taskType: '',
          markingType: '',
        }
      ],
    }
  },
  created () {
    this.getCollectingTask();
    this.getDeadlineTask();
  },

  methods: {
    getDeadlineTask(){
      const _this = this;
      axios.get("http://localhost:8181/task/findCollectingTask/",{
        params: {
          offerId: this.$store.getters.getOfferId,
          taskType: this.taskType,
        },
        crossDomain: true,
        xhrFields: {withCredentials: true},
        headers: {
          token: this.getToken(),
        }
      }).then(function (resp) {
        _this.deadlineTask = resp.data;
        console.log(resp.data);
      });
    },
    getCollectingTask(){
      const _this = this;
      axios.get("http://localhost:8181/task/findDeadlineTask/",{
        params: {
          offerId: this.$store.getters.getOfferId,
          taskType: this.taskType,
        },
        crossDomain: true,
        xhrFields: {withCredentials: true},
        headers: {
          token: this.getToken(),
        }
      }).then(function (resp) {
        _this.taskFrom = resp.data;
        console.log(resp.data);
      });
    },
    handleChange(data){
      this.activeName = data;
    },
    taskDetail(data) {
      this.$store.dispatch("changeTaskId",data.taskId)
      this.$store.dispatch("changeTaskTitle",data.taskTitle)
      if(this.taskType===0){
        this.$router.push({
          path: "/TaskDetail",
          query: {
            taskId : data.taskId,
            title: data.title,
            offerId: data.offerId,
          }
        })
      }else {
        this.$router.push("/GroupTaskDetail")
      }

    },
    num2str(num){
      return num.toString();
    },
    mergeName(item,index){
      return this.num2str(item)+'-'+this.num2str(index);
    }
  }
}
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  width: auto;
}

</style>