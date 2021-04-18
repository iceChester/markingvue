import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import echarts from 'echarts'
import VideoPlayer from 'vue-video-player'
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'
import axios from 'axios'
import '@/permission.js'
import '@/components/common/css/font.css';
Vue.use(VideoPlayer)


Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
Vue.prototype.getToken = function() {
  const token = localStorage.getItem("token");
  if (token === "" || token == null) {
    this.$message({
      showClose: true,
      message: "请先登录",
      type: "error",
      duration: "3000"
    });
    this.$router.push({ path: "/" });
  }
  return token;
}
Vue.prototype.setToken = function(token) {
  localStorage.setItem("token", token);
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
