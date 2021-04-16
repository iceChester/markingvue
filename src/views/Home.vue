<template>
  <div class="demo-image" style="width: 100%; height: 100%">
    <div class="block">
      <el-image
          style="width: 100%; height: 100%"
          :src="imgSrc"></el-image>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      imgSrc: require('../assets/images/index.jpg'),
    }
  }
}
</script>

<style scoped>

</style>