<template>
    <div style="background-color: #545c64">
      <el-row >
        <el-col :span="4" style="margin-top: 15px;margin-left: 20px;height: 80px;">
          <div>
            <span class="title" style="color: #fff;padding-top: 20px">作业提交与评分系统</span>
          </div>
        </el-col>
        <el-col :span="19">
          <div>
            <el-menu
                :default-active="activeIndex2"
                class="el-menu-demo"
                mode="horizontal"
                @select="handleSelect"
                background-color="#545c64"
                style="font-size: 20px"
                text-color="#fff"
                active-text-color="#ffd04b"
                v-bind:router="true"
                v-bind:default-active="$route.path">
              <el-submenu v-for="(item,index) in this.meuns" v-bind:index="index" v-if="!item.hidden">
                <template slot="title">
                  <i class="el-icon-message"></i>
                  <span slot="title">{{ item.name }}</span>
                </template>
                <el-menu-item v-for="(item2,index2) in item.children" v-bind:index="item2.path"
                              v-bind:class="item2.path==$route.path?'is-active':''">
                  {{ item2.name }}
                </el-menu-item>
              </el-submenu>
              <el-submenu style="float: right">
                <template slot="title">
                  <i class="el-icon-message"></i>
                  <span slot="title">我的</span>
                </template>
                <el-menu-item @click="logout()">
                  退出登录
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </div>
        </el-col>
      </el-row>

    </div>
</template>

<script>
export default {
  name: "NavBar",
  props: {
    routes: {
      type: Array,
      default: () => []
    }
  },
  data(){
    return {
      isShow: false,
      isCollapse: false,
      activeIndex: '1',
      activeIndex2: '1',
      meuns: [],
    }
  },
  mounted() {
    this.meuns = this.routes;
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    logout(){
      const _this = this;
      axios.post("http://localhost:8181/userLogout",{},{
        crossDomain: true,
        xhrFields: {withCredentials: true},
        headers: {
          token: this.getToken(),
        }
      }).then(function (resp) {
        if (resp.status === 200) {
          const data = resp.data;
          if (data.status === 200) {
            _this.$message({
              showClose: true,
              message: data.msg,
              type: "success",
              duration: "1600"
            });
          } else {
            _this.$message({
              showClose: true,
              message: data.msg,
              type: "error",
              duration: "3000"
            });
          }
          _this.setToken("");
          localStorage.clear();
          localStorage.setItem("role", 'unload')
          // 跳转到登录页的时候顺便刷新
          window.location.href = window.location.origin + window.location.pathname
          // _this.$router.push({ path: "/" });
        } else {
          _this.$message({
            showClose: true,
            message: "操作失败，请联系管理员",
            type: "error",
            duration: "3000"
          });
        }
      });
    }
  },

}
</script>

<style scoped>
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
.title{
  font-family:"dmft";
  font-size: 30px
}
</style>