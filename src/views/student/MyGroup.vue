<template>
  <Group ref="group" v-if=this.isGroupShow :groupInfo = this.groupInfo></Group>
  <div v-else>
    <h1>你还未有小组，先创建小组吧</h1>
    <el-form :model="groupForm" :rules="rules" ref="groupForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="组长：" >
        <el-input v-model="groupForm.leaderName" readonly></el-input>
      </el-form-item>
      <el-form-item label="小组名称">
        <el-input v-model="groupForm.groupName" prop="name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('groupForm')">立即创建小组</el-button>
        <el-button @click="resetForm('groupForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Group from "@/components/common/Group";
export default {
  name: "MyGroup",
  components: {
    Group
  },
  data() {
    return {
      groupInfo: {
        leaderName: '',
        groupName: '',
        memberAccount: [],
        memberName: [],
      },
      isGroupShow: false,
      account: this.$store.getters.getAccount,
      offerId: this.$store.getters.getOfferId,
      groupForm: {
        // userId: this.$store.getters.getUserId,
        leaderName: this.$store.getters.getUserName,
        leaderAccount: this.$store.getters.getAccount,
        groupName: '',
        offerId: this.$store.getters.getOfferId,
      },
      groupId: '',
      rules: {
        name: [
          { required: true, message: '请选择输入', trigger: 'blur' }
        ],
      }
    }
  },
  watch: {
    offerId: {
      handler(newName, oldName) {
        this.init();
      },
    }
  },
  created() {
    this.init();
  },
  methods: {
    init(){
      const _this = this;
      console.log("_this.account")
      console.log(this.$store.getters.getAccount)
      axios.get("http://localhost:8181/groupInfo/checkStudentGroup",{
        params: {
          offerId: this.groupForm.offerId,
          account: this.account,
        },
        crossDomain: true,
        xhrFields: {withCredentials: true},
        headers: {
          token: this.getToken(),
        }
      }).then(function (resp) {
        if(resp.data!==""){
          _this.$store.dispatch('changeGroupId',resp.data.groupId);
          _this.groupInfo.leaderName = resp.data.leaderName;
          _this.groupInfo.groupName = resp.data.groupName;
          _this.groupInfo.memberAccount = resp.data.memberAccount;
          _this.groupInfo.memberName = resp.data.memberName;
          _this.isGroupShow = true;
        }else {
          _this.isGroupShow = false;
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const _this = this
          axios.post("http://localhost:8181/groups/create",this.groupForm,{
            crossDomain: true,
            xhrFields: {withCredentials: true},
            headers: {
              token: this.getToken(),
            }
          }).then(function (resp){
                console.log(resp.data)
                if(resp.data!=0){
                  _this.$alert("《"+_this.groupForm.groupName+'》创建成功', '消息', {
                    confirmButtonText: '确定',
                    callback: action => {
                      _this.isGroupShow = !(_this.isGroupShow);
                      _this.groupId = resp.data;
                    }
                  });
                }
              });
          console.log(this.groupForm);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  },
}
</script>

<style scoped>

</style>