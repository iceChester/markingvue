<template>
  <div>
    <div style="margin: 0px auto; text-align: center">
      <h2>我的课程</h2>
    </div>
    <el-divider></el-divider>
    <MyCoursesData ref="myCoursesData" :option="this.option"></MyCoursesData>
  </div>
</template>

<script>
import MyCoursesData from "@/components/common/MyCoursesData";
export default {
  name: "StudentCourse",
  components: {
    MyCoursesData
  },
  data() {
    return {
      token: this.getToken(),
      option:[
        {
          offerId: '',
          courseId: '',
          courseName: '',
          mainTeacherName: '',
          assistantOneName: '',
          assistantTwoName: '',
          classes: '',
          memberCount: ''
        }
      ],
    };
  },
  created() {
    const _this = this;
    let account = this.$store.getters.getAccount ;
    axios.get("http://localhost:8181/timetable/studentCourse",
        {
          params: {
            account: account,
          },
          crossDomain: true,
          xhrFields: {withCredentials: true},
          headers: {
            token: this.getToken(),
          }
        }
    ).then(function (resp) {
      console.log(resp);
      _this.option = resp.data;
    })
  },
}
</script>

<style scoped>
</style>