<template>
  <div>
    <NavBar ref="navBar" :routes="this.$store.getters.getGlobalRouter"></NavBar>
    <el-container style="height: 100%; border: 1px solid #eee">
      <CourseSideBar ref="courseSideBar" :menus="this.menus" ></CourseSideBar>
      <el-container style="overflow: auto;height: 90vh">
        <el-row>
          <el-col :span="24">
            <div style="margin-top: 15px ;margin-left: 30px;">
            <i>
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/Index' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/MyCourses'}">我的课程</el-breadcrumb-item>
                <el-breadcrumb-item>{{ this.$store.getters.getCourseName}}</el-breadcrumb-item>

<!--                <el-breadcrumb-item>{{ this.$store.getters.getCourseName }}</el-breadcrumb-item>-->
              </el-breadcrumb>
            </i>
          </div>
          </el-col>
          <el-col>
            <el-divider></el-divider>
          </el-col>

          <el-col>
            <el-main>
              <router-view v-if="isRouterShow"/>
            </el-main>
          </el-col>
        </el-row>
        <el-footer></el-footer>
      </el-container>
    </el-container>


  </div>
</template>

<script>
import CourseSideBar from "@/components/common/CourseSideBar";
import NavBar from "@/components/common/NavBar";
export default {
  name: "CourseDetail",
  provide () {
    return {
      reload: this.reload
    }
  },
  components: {
    NavBar,
    CourseSideBar,
  },
  data() {
    return {
      isRouterShow: true,
      menus: [],
      option: [
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
    }
  },
  created() {
    this.menus = this.$store.getters.getGlobalRouter;
  },
  methods: {
    async reload () {
      this.isRouterShow = false
      await this.$nextTick()
      this.isRouterShow = true
    }
  }

}
</script>

<style scoped>

</style>