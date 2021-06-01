<template>
  <div>
    <div style="margin: 0px auto; text-align: center">
      <h2>课程信息</h2>
    </div>
    <el-divider></el-divider>
    <el-card class="box-card"style="margin-left: 22%;width: 55%">
      <div>
        <el-row :gutter="20" style="margin-top: 30px;margin-left: 10%">
          <el-col :span="9"  style="margin-right: 20%"><div>
            <span>课程名称：{{this.result.courseName}}</span>
          </div></el-col>
          <el-col :span="9" ><div class="grid-content bg-purple">
            <span>课程人数：{{this.result.memberCount}}</span>
          </div></el-col>
        </el-row>
        <el-row :gutter="20"style="margin-top: 30px;margin-left: 10%">
          <el-col :span="9" style="margin-right: 20%"><div class="grid-content bg-purple">
            <span>上课班级：{{this.result.classes}}</span>
          </div></el-col>
          <el-col :span="9"><div class="grid-content bg-purple">
            <span>主教师：{{this.result.mainTeacherName}}</span>
          </div></el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 30px;margin-left: 10%">
          <el-col :span="9" style="margin-right: 20%"><div class="grid-content bg-purple">
            <span>助教一：{{this.result.assistantOneName}}</span>
          </div></el-col>
          <el-col :span="9"><div class="grid-content bg-purple">
            <span>助教二：{{this.result.assistantTwoName}}</span>
          </div></el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 30px;margin-left: 10%; margin-bottom: 50px">
          <el-col :span="9" style="margin-right: 20%"><div class="grid-content bg-purple">
            <span>小组数：{{this.result.groupNumber}}</span>
          </div></el-col>
        </el-row>
        <div v-if="isShowCollapse">
          <h3 style="margin-left: 20px">课程目标:</h3>
          <el-collapse v-model="activeNames"  style="margin: 30px">
            <el-collapse-item :title="title+(index+1)" :name="index+1" v-for="(item,index) in this.courseObjectives">
              <h3>{{ item.objectiveContent }}</h3>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div v-else >
          <h3 style="text-align: center">暂时没有课程目标</h3>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "CourseDescription",
  data(){
    return {
      result: {
        OfferId: '',
        courseId: '',
        courseName: '',
        mainTeacherName: '',
        assistantOneName: '',
        assistantTwoName: '',
        classes: '',
        memberCount: '',
        groupNumber: '',
      },
      courseObjectives: [],
      activeNames: [],
      title: '课程目标-',
      isShowCollapse: false,
    }
  },
  mounted() {
    this.initData();
    this.initObject();
  },
  methods: {
    initData(){
      const _this = this;
      axios.get("http://localhost:8181/offerCourses/findCourse/",{
        params: {
          offerId: this.$store.getters.getOfferId,
        },
        crossDomain: true,
        xhrFields: {withCredentials: true},
        headers: {
          token: this.getToken(),
        }
      }).then(function (resp) {
        _this.result = resp.data;
      })
    },
    initObject(){
      const _this = this;
      axios.get("http://localhost:8181/offerCourses/findObjectives/",{
        params: {
          offerId: this.$store.getters.getOfferId,
        },
        crossDomain: true,
        xhrFields: {withCredentials: true},
        headers: {
          token: this.getToken(),
        }
      }).then(function (resp) {
        if(resp.data.length>0){
          _this.isShowCollapse = true;
          _this.courseObjectives = resp.data;
        }else {
          _this.isShowCollapse = false;
        }
        console.log(resp.data);
      })
    },
  }
}
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: auto;
}
</style>