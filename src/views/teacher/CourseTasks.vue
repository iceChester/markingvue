<template>
  <TeacherTasks ref="teacherTasks" :taskType="taskType"></TeacherTasks>
</template>

<script>
import TeacherTasks from "@/components/common/TeacherTasks";
export default {
  name: "CourseTasks",
  components: {
    TeacherTasks,
  },
  data() {
    return {
      taskType: 0,
    }
  },
}
</script>

<style scoped>

</style>