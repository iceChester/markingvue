import Vue from 'vue'
import VueRouter from 'vue-router'
import MyCourses from "@/views/teacher/MyCourses";
import Index from "@/views/Index";
import Home from "@/views/Home";
import Courses from "@/views/teacher/Courses";
import OfferCourse from "@/views/teacher/OfferCourse";
import CourseDetail from "@/views/teacher/CourseDetail";
import CourseTasks from "@/views/teacher/CourseTasks";
import Login from "@/views/Login";
import CourseDescription from "@/views/teacher/CourseDescription";
import CreateTask from "@/views/teacher/CreateTask";
import StudentInfo from "@/views/teacher/StudentInfo";
import TaskDetail from "@/views/teacher/TaskDetail";
import StudentCourse from "@/views/student/StudentCourse";
import MyGroup from "@/views/student/MyGroup";
import StudentTasks from "@/views/student/StudentTasks";
import CourseGroup from "@/views/teacher/CourseGroup";
import StudentData from "@/views/admin/StudentData";
import TeacherData from "@/views/admin/TeacherData";
import CourseData from "@/views/admin/CourseData";
Vue.use(VueRouter)

export const fixedRouter = [
  {
    path: "/",
    component: Login,
    meta: {
      course: 'null'
    },
    hidden: true,
    name: "登录"
  },
  {
    path: "/Index",
    name: "首页",
    hidden: true,
    meta: {
      course: 'null'
    },
    component: Index,
    redirect: '/Home',
    children: [
      {
        path: "/Home",
        name: "首页",
        component: Home
      }
    ]
  },
]

export const permissionRouter  = [
  {
    path: '/TeacherCourses',
    name: '课程',
    component: Index,
    show: true,
    meta: {
      roles: ['teacher'],
      course: 'null'
    },
    children:[
      {
        path: '/MyCourses',
        name: '我的课程',
        component: MyCourses
      },
      {
        path: '/Courses',
        name: '学校课程',
        component: Courses,
      },

    ]
  },
  {
    path: '/dataInfo',
    name: '系统信息',
    component: Index,
    show: true,
    meta: {
      roles: ['admin'],
      course: 'null'
    },
    children:[
      {
        path: '/studentData',
        name: '学生信息',
        component: StudentData
      },
      {
        path: '/TeacherData',
        name: '教师信息',
        component: TeacherData
      },
      {
        path: '/CourseData',
        name: '课程信息',
        component: CourseData
      },
    ]
  },
  {
    path: '/StudentCourse',
    name: '课程',
    component: Index,
    show: true,
    meta: {
      roles: ['student'],
      course: 'null'
    },
    children:[
      {
        path: '/MyCourses',
        name: '我的课程',
        component: StudentCourse
      },
    ]
  },
  {
    path: "/CourseTask",
    name: "课程作业",
    component: Index,
    meta: {
      roles: ['teacher'],
      course: 'null'
    },
    children: [
      {
        path: "/CourseTask",
        name: "我的课程作业",
        component: CourseTasks
      }
    ]
  },
  {
    path: '/TeacherOfferCourse',
    show: false,
    meta: {
      roles: ['teacher'],
      course: 'null'
    },
    hidden: true,
    component: Index,
    children: [
      {
        path: "/OfferCourse",
        component: OfferCourse,
      },
    ]
  },
  {
    path: "/CourseDetail",
    component: CourseDetail,
    show: false,
    hidden: true,
    meta: {
      roles: ['teacher'],
      course: 'course'
    },
    name: "课程介绍",
    redirect: "/CourseDescription",
    children: [
      {
        path: "/CourseDescription",
        component: CourseDescription,
        name: "课程信息",
      },
      {
        path: "/StudentInfo",
        component: StudentInfo,
        name: "学生信息",
      },
    ]
  },
  {
    path: "/CourseDetail",
    component: CourseDetail,
    show: false,
    hidden: true,
    meta: {
      roles: ['student'],
      course: 'course'
    },
    name: "课程介绍",
    redirect: "/CourseDescription",
    children: [
      {
        path: "/CourseDescription",
        component: CourseDescription,
        name: "课程信息",
      },
    ]
  },
  {
    path: "/Group",
    component: CourseDetail,
    show: false,
    hidden: true,
    meta: {
      roles: ['student'],
      course: 'course'
    },
    name: "小组",
    redirect: "/MyGroup",
    children: [
      {
        path: "/MyGroup",
        component: MyGroup,
        name: "我的小组",
      },
    ]
  },
  {
    path: "/CourseGroups",
    name: "课程小组",
    component: CourseDetail,
    hidden: true,
    redirect: '/CourseGroup',
    meta: {
      roles: ['teacher'],
      course: 'course'
    },
    children: [
      {
        path: "/CourseGroup",
        name: "课程小组",
        component: CourseGroup
      }
    ]
  },
  {
    path: "/TeacherTask",
    name: "作业",
    hidden: true,
    meta: {
      roles: ['teacher'],
      course: 'course'
    },
    component: CourseDetail,
    children: [
      {
        path: "/CreateTask",
        name: "发布作业",
        component: CreateTask,
      },
      {
        path: "/CourseTasks",
        name: "布置的作业",
        component: CourseTasks,
      }
    ]
  },
  {
    path: "/Task",
    component: CourseDetail,
    show: false,
    hidden: true,
    meta: {
      roles: ['student'],
      course: 'course'
    },
    name: "作业",
    redirect: "/StudentTasks",
    children: [
      {
        path: "/StudentTasks",
        component: StudentTasks,
        name: "我的作业",
      },
    ]
  },
  {
    path: "/TaskDetail",
    component: TaskDetail,
    hidden: true,
    meta: {
      roles: ['teacher'],
      course: 'null'
    },
    show: false,
    name: "作业详情"
  }
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: fixedRouter
})
export default router
