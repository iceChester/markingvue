<template>
  <div>
    <el-page-header @back="goBack" content="详情页面">
    </el-page-header>
  </div>
</template>

<script>
export default {
  name: "GroupOverdueTasks",
  methods: {
    goBack(){
      this.$emit("goBack");
    }
  }
}
</script>

<style scoped>

</style>