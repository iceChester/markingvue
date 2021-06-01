import Vue from 'vue'
import VueRouter from 'vue-router'
import MyCourses from "@/views/teacher/MyCourses";
import Index from "@/views/Index";
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
import CollectingTasks from "@/views/student/CollectingTasks";
import AccomplishTasks from "@/views/student/AccomplishTasks";
import OverdueTask from "@/views/student/OverdueTasks";
import GroupAccomplishTasks from "@/views/student/GroupAccomplishTasks";
import GroupCollectingTasks from "@/views/student/GroupCollectingTasks";
import GroupOverdueTasks from "@/views/student/GroupOverdueTasks";
import GroupTasks from "@/views/teacher/GroupTasks";
import GroupTaskDetail from "@/views/teacher/GroupTaskDetail";
import CourseObjectiveData from "@/views/admin/CourseObjectiveData";
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
    redirect: "/MyCourses",

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
        path: '/MyCourses',
        name: '课程信息',
        component: CourseData
      },
      {
        path: '/CourseObjectiveData',
        name: '课程指标信息',
        component: CourseObjectiveData
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
      {
        path: "/CourseGroup",
        name: "小组信息",
        component: CourseGroup
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
    name: "小组信息",
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
        name: "个人作业",
        component: CourseTasks,
      },
      {
        path: "/GroupTasks",
        name: "小组作业",
        component: GroupTasks,
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
    redirect: "/CollectingTasks",
    children: [
      {
        path: "/CollectingTasks",
        component: CollectingTasks,
        name: "待完成的作业",
      },
      {
        path: "/AccomplishTasks",
        component: AccomplishTasks,
        name: "已完成的作业",
      },
      {
        path: "/Overdue",
        component: OverdueTask,
        name: "未按时完成的作业",
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
  },
  {
    path: "/GroupTaskDetail",
    component: GroupTaskDetail,
    hidden: true,
    meta: {
      roles: ['teacher'],
      course: 'null'
    },
    show: false,
    name: "小组作业详情"
  },
  {
    path: "/GroupAccomplishTasks",
    component: GroupAccomplishTasks,
    hidden: true,
    meta: {
      roles: ['student'],
      course: 'null'
    },
    show: false,
    name: "已完成小组作业"
  },
  {
    path: "/GroupCollectingTasks",
    component: GroupCollectingTasks,
    hidden: true,
    meta: {
      roles: ['student'],
      course: 'null'
    },
    show: false,
    name: "待完成小组作业"
  },
  {
    path: "/GroupOverdueTasks",
    component: GroupOverdueTasks,
    hidden: true,
    meta: {
      roles: ['student'],
      course: 'null'
    },
    show: false,
    name: "过期作业"
  },

]

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: fixedRouter
})
export default router
