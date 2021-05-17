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
            <el-form :model="loginData" ref="loginData" status-icon>
              <el-form-item prop="account">
                <el-input type="text" v-model="loginData.account" autocomplete="off" placeholder="账号"></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input type="password" v-model="loginData.password" autocomplete="off" placeholder="密码"> </el-input>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" @click="userLogin()">提交</el-button>
                <el-button type="primary" @click="changePassword()" style="margin-left: 15%">修改密码</el-button>
                  <el-button @click="resetForm('loginData')" style="float: right">重置</el-button>

              </el-form-item>
            </el-form>
          </div>
        </el-card>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" :center="true" width="24%">
      <el-form :model="formEdit" status-icon :rules="rules" ref="formEdit"  class="demo-ruleForm">
        <el-form-item label="账号" label-width="100px" prop="account">
          <el-input placeholder="请输入账号" v-model="formEdit.account" autocomplete="off" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="原密码" label-width="100px" prop="password">
          <el-input placeholder="请输入原密码" v-model="formEdit.password" show-password autocomplete="off" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="新密码" label-width="100px" prop="newPassword">
          <el-input placeholder="请输入新密码" v-model="formEdit.newPassword"  show-password autocomplete="off" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" label-width="100px" prop="checkPassword">
          <el-input placeholder="请确认新密码" v-model="formEdit.checkPassword" show-password  autocomplete="off" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item >
          <el-button @click="dialogFormVisible = false" style="margin-left: 25%">取 消</el-button>
          <el-button type="primary" @click="submitFrom('formEdit')">确 定</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
      </div>
    </el-dialog>
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
        // if (this.formEdit.newPassword!== '') {
        //   this.$refs.formEdit.validateField('newPassword');
        // }
        callback();
      }
    };
    let validatePass1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else {
        // if (this.formEdit.checkPassword !== '') {
        //   this.$refs.formEdit.validateField('checkPassword');
        // }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.formEdit.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      };
    };
    return {
      imgSrc: require('../assets/images/login.jpeg'),
      loginData: {
        password: '',
        account: '',
      },
      rules: {
        password: [
          {require:true, validator: validatePass, trigger: 'blur' },
        ],
        newPassword: [
          {require:true, validator: validatePass1, trigger: 'blur' }
        ],
        checkPassword: [
          {require:true, validator: validatePass2, trigger: 'blur' }
        ],
        account: [
          {require:true,trigger: 'blur'}
        ]
      },
      dialogFormVisible: false,
      formEdit: {
        account: '',
        password: '',
        newPassword: '',
        checkPassword: '',
      },
    };
  },
  methods: {
    submitFrom(formName){
      const _this = this;
      this.$refs[formName].validate((valid) => {
        console.log(valid);
        if (valid) {
          this.$axios({
            method: "post",
            url: "http://localhost:8181/changePwd",
            data: {
              account: this.formEdit.account,
              password: this.formEdit.password,
              checkPassword: this.formEdit.checkPassword
            }
          }).then(function (resp) {
            if(resp.status === 200){
              _this.$message({
                message: '修改成功',
                type: 'success'
              });
              _this.dialogFormVisible = false;
            }else {
              _this.$message.error('出错了，请联系管理员');
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    changePassword(){
      this.dialogFormVisible = true;
    },
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