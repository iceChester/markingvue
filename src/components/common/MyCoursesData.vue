<template>
  <div style="margin-left: 15%">
    <el-row v-bind:gutter="20" >
      <el-col :span="10" v-for="(item, index) in this.option" >
        <el-card class="box-card" style="margin-top: 15px" shadow="hover">
          <div slot="header" class="clearfix">
            <span>{{item.courseName}}</span>
            <el-button @click="task(index)" style="float: right; padding: 5px 7px" type="primary" round>进入</el-button>
          </div>
          <div  class="text item">
            {{'主教师： '+item.mainTeacherName}}
          </div>
          <div  class="text item">
            {{'助教一： '+item.assistantOneName}}
          </div>
          <div  class="text item">
            {{'助教二： '+item.assistantTwoName}}
          </div>
          <div  class="text item">
            {{'班级： '+item.classes}}
          </div>
          <div  class="text item">
            {{'上课人数： '+item.memberCount}}
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-backtop></el-backtop>
  </div>
</template>

<script>
export default {
  name: "MyCoursesData",
  props: {
    option: {
      type: Array,
      default: () => {}
    },
  },
  data() {
    return {
    }
  },
  methods: {
    task(index) {
      index = index+"";
      this.$store.dispatch('changeOfferId',this.option[index].offerId);
      this.$store.dispatch('changeCourseName',this.option[index].courseName);
      this.$router.push({
        path: "/CourseDetail",
        query: {
          courseDetail : this.option[index],
        }
      })
    },
  }
}
</script>

<style scoped>

</style>