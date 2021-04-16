<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <div>
          <el-col :span="8">
            <span>组名：</span>
            <el-input v-model="groupInfo.groupName" :disabled = true ></el-input>
          </el-col>
          <el-col :span="8">
            <span>组长：</span>
            <el-input v-model="groupInfo.leaderName" :disabled = true ></el-input>
          </el-col>
          <el-col :span="5" style="padding-top: 22px">
            <el-button type="primary" @click="add" :disabled="this.isShowButton">添加组员</el-button>
          </el-col>
        </div>
      </el-col>
      <el-col :span="20" style="margin-top: 50px">
        <AddMember ref="addMember" v-if="isShowAdd" @cancel="cancel"></AddMember>
      </el-col>
      <el-col :span="18" style="margin-top: 50px">
        <div>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>小组成员</span>
            </div>
            <div>
              <el-table
                  :data="tableData"
                  style="width: 100%">
                <el-table-column
                    prop="memberName"
                    label="姓名"
                    >
                </el-table-column>
                <el-table-column
                    prop="memberAccount"
                    label="学号"
                    >
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import AddMember from "@/components/common/AddMember";
export default {
  name: "Group",
  components: {AddMember},
  props: {
    groupInfo: {
      type: Object
    }
  },
  data(){
    return {
      tableData: [{
        memberAccount: '',
        memberName: '',
      }],
      isShowAdd: false,
      isShowButton: false,
      groupName: '',
      leaderName: '',
    }
  },
  created() {
    this.init();
  },
  mounted() {
    this.checkLeader();
  },
  methods: {
    init(){
      let temp = [];
      if(this.groupInfo!==null){
        this.groupInfo.memberAccount.forEach((item,index) => {
          let obj = {
            memberAccount: '',
            memberName: '',
          }
          obj.memberAccount = item;
          obj.memberName = this.groupInfo.memberName[index];
          temp.push(obj);
        });
      }
      this.tableData = temp;
    },
    checkLeader(){
      const _this = this;
      axios.get("http://localhost:8181/groups/checkLeader",{
        params: {
          offerId: this.$store.getters.getOfferId,
          account: this.$store.getters.getAccount,
        },
        crossDomain: true,
        xhrFields: {withCredentials: true},
        headers: {
          token: this.getToken(),
        }
      }).then(function (resp) {
        console.log(resp.data)
        if(!resp.data){
          _this.isShowButton = !(_this.isShowButton)
        }
      });
    },
    add(){
      this.isShowAdd = !this.isShowAdd;
      this.isShowButton = !this.isShowButton;
    },
    cancel(obj){
      this.isShowAdd = obj;
      this.isShowButton = obj;
    }
  }
}
</script>

<style scoped>

</style>