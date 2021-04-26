<template>
  <TeacherTasks ref="teacherTasks" :taskType="taskType"></TeacherTasks>
</template>

<script>
import TeacherTasks from "@/components/common/TeacherTasks";
export default {
  name: "GroupTasks",
  components: {
    TeacherTasks,
  },
  data() {
    return {
      taskType: 1,
    }
  },
}
</script>

<style scoped>

</style>