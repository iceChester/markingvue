<template>
  <div style="height: 100%">
    <el-container>
      <NavBar ref="navBar" :routes="getRoutes"></NavBar>
      <el-main>
        <router-view/>
      </el-main>
      <el-footer>@By XiaoMao</el-footer>
    </el-container>
  </div>
</template>

<script>
import NavBar from '../components/common/NavBar';
export default {
  name: 'Index',
  components: {
    NavBar
  },
  data() {
    const item = {
      date: '2016-05-02',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1518 弄'
    };
    return {
      tableData: Array(20).fill(item),
      activeIndex: '1',
      activeIndex2: '1'
    }
  },
  computed: {
    getRoutes(){
      console.log(this.$store.getters.getGlobalRouter)
      return this.$store.getters.getGlobalRouter;
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style>
.toggle-button {
  background-color: #869de6;
  font-size: 10px;
  padding-right: 10px;
  padding-left: 10px;
  margin: 0 auto;
  padding-top: 12%;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>