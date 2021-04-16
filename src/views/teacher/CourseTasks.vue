<template>
<div>
    <el-card class="box-card" v-for="(item,index) in taskFrom">
      <div slot="header" class="clearfix">
        <span>作业名称：{{item.title}}</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="taskDetail(item.taskId)">详情</el-button>
      </div>
      <el-collapse v-model="activeName" accordion @change="handleChange" >
        <el-collapse-item title="作业内容" :name=mergeName(item.taskId,1)>
          <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
          <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
        </el-collapse-item>
        <el-collapse-item title="作业完成情况" :name=item.taskId>
        </el-collapse-item>
        <el-collapse-item title="作业成绩情况" :name=mergeName(item.taskId,2)>
          <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
          <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
        </el-collapse-item>

      </el-collapse>
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
    this.taskFrom.offerId = this.$store.getters.getOfferId;
    axios.get("http://localhost:8181/task/findByOfferId/",{
      params: {
        offerId: this.taskFrom.offerId,
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
    taskDetail(taskId) {
      this.$router.push({
        path: "/TaskDetail",
        query: {
          taskId : taskId,
          offerId: this.taskFrom[0].offerId,
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