<template>
  <div>
    <MyCoursesData ref="myCoursesData" v-if="option" :option="option"></MyCoursesData>
  </div>
</template>

<script>
import MyCoursesData from "@/components/common/MyCoursesData";
export default {
  name: "MyCourses",
  components: {
    MyCoursesData
  },
  data() {
    return {
      token: this.getToken(),
      option: [],
    };
  },
  created() {
    console.log(1);
    this.init();
  },
  methods: {
    init(){
      const _this = this;
        axios.get("http://localhost:8181/timetable/teacherCourse",
            {
              params: {
                account: this.$store.getters.getAccount
              },
              crossDomain: true,
              xhrFields: {withCredentials: true},
              headers: {
                token: this.getToken(),
              }
            }
        ).then(function (resp){
          _this.option = resp.data;
        })
      }
  },
}
</script>

<style scoped>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}
</style>