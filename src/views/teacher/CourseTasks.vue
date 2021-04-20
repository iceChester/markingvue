<template>
<div style="width: 70%;margin: 0 auto;">
    <el-card class="box-card" v-for="(item,index) in taskFrom" style="margin-bottom: 30px">
      <div >
        <div slot="header" class="clearfix">
          <span>作业名称：{{item.title}}</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="taskDetail(item)">详情</el-button>
        </div>
        <el-divider></el-divider>
        <el-row :gutter="20" style="margin-left: 240px;margin-bottom: 20px">
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
        <el-row :gutter="20" style="margin-left: 240px">
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
  name: "CourseTasks",
  components: {

  },
  data() {
    return {
      activeName: '1',
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
    }
  },
  created () {
    const _this = this;
    axios.get("http://localhost:8181/task/findByOfferId/",{
      params: {
        offerId: this.$store.getters.getOfferId,
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

  methods: {
    handleChange(data){
      this.activeName = data;
    },
    taskDetail(data) {
      this.$store.dispatch("changeTaskId",data.taskId)
      this.$store.dispatch("changeTaskTitle",data.taskTitle)
      this.$router.push({
        path: "/TaskDetail",
        query: {
          taskId : data.taskId,
          title: data.title,
          offerId: data.offerId,
        }
      })
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