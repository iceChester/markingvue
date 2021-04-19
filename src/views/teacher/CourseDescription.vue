<template>
  <div>
    <el-card class="box-card"style="margin-left: 10%;width: 75%;height: 50vh">
      <el-row :gutter="20"style="margin-top: 30px;margin-left: 10%">
        <el-col :span="6"  style="margin-right: 20%"><div>
          <span>课程名称：{{this.result.courseName}}</span>
        </div></el-col>
        <el-col :span="6" ><div class="grid-content bg-purple">
          <span>课程人数：{{this.result.memberCount}}</span>
        </div></el-col>
      </el-row>
      <el-row :gutter="20"style="margin-top: 30px;margin-left: 10%">
        <el-col :span="6" style="margin-right: 20%"><div class="grid-content bg-purple">
          <span>上课班级：{{this.result.classes}}</span>
        </div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple">
          <span>主教师：{{this.result.mainTeacherName}}</span>
        </div></el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 30px;margin-left: 10%">
        <el-col :span="6" style="margin-right: 20%"><div class="grid-content bg-purple">
          <span>助教一：{{this.result.assistantOneName}}</span>
        </div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple">
          <span>助教二：{{this.result.assistantTwoName}}</span>
        </div></el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 30px;margin-left: 10%">
        <el-col :span="6" style="margin-right: 20%"><div class="grid-content bg-purple">
          <span>小组数：{{this.result.groupNumber}}</span>
        </div></el-col>
      </el-row>

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
    }
  },
  mounted() {
    this.initData();
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
    }
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