<template>
  <div>
    <div class="background">
      <img :src="imgSrc" width="100%" height="100%" alt="" />
    </div>
    <div style="margin: 200px auto;height: 200px;width: 350px;" class="front">
        <el-card class="card">
          <div slot="header" class="title">
            <span>作业提交与评分系统</span>
          </div>
          <div>
            <el-form :model="loginData" status-icon :rules="rules" ref="ruleForm"  class="demo-ruleForm">
              <el-form-item prop="account">
                <el-input type="text" v-model="loginData.account" autocomplete="off" placeholder="账号"></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input type="password" v-model="loginData.password" autocomplete="off" placeholder="密码"> </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="userLogin()">提交</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
    </div>
  </div>

</template>

<script>
export default {
  name: "Login",
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        callback();
      }
    };
    return {
      imgSrc: require('../assets/images/login.jpeg'),
      loginData: {
        password: '',
        account: '',
      },
      rules: {
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
      }
    };
  },
  methods: {
    userLogin() {
      const _this  = this;
      this.$axios({
        method: "post",
        url: "http://localhost:8181/userLogin",
        data: {
          account: this.loginData.account,
          password: this.loginData.password
        }
      }).then(result => {
        if (result.status === 200) {
          let data = result.data;
          if (data.status === 200) {
            _this.$message({
              showClose: true,
              message: "登录成功",
              type: "success",
              duration: "600"
            });
            _this.loginData.account = "";
            _this.loginData.password = "";
            _this.setToken(data.token);
            console.log(data.role);
            _this.$store.dispatch("changeUserId",data.userId);
            _this.$store.dispatch("changeRole",data.role);
            _this.$store.dispatch("changeRoleId",data.roleId);
            _this.$store.dispatch("changeAccount",data.account);
            _this.$store.dispatch("changeUserName",data.userName);
            _this.$router.push({ path: "/Index" });
          } else {
            _this.$message({
              showClose: true,
              message: "登录失败，原因: " + data.msg,
              type: "error",
              duration: "3000"
            });
          }
        } else {
          _this.$message({
            showClose: true,
            message: "登录失败，请联系管理员",
            type: "error",
            duration: "3000"
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style scoped>
.background{
  width:100%;
  height:100%;  /**宽高100%是为了图片铺满屏幕 */
  z-index:-1;
  position: absolute;
}

.front{
  z-index:1;
  position: absolute;
}
.card{
  width: 400px;
  margin-top: 15%;
  margin-left: calc(calc(100vw - 400px)/2);
  background-color: rgba(200,200,200,0.5);
  border-radius: 10px;
}
.title{
  text-align: center;
  font-size: 24px;
  color: rgba(50,50,50,0.8);
}
</style>