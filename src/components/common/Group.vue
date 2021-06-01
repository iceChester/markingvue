<template>
  <div>
    <GroupAccomplishTasks v-if="isAccomplishShow" @goBack="goBack" :isLeader = "!this.isShowButton"></GroupAccomplishTasks>
    <GroupOverdueTasks v-if="isOverdueShow"@goBack="goBack"></GroupOverdueTasks>
    <GroupCollectingTasks v-if="isCollectingShow"@goBack="goBack" :isLeader = "!this.isShowButton"></GroupCollectingTasks>
    <div style="margin: 0px auto; text-align: center"  v-if="isMemberShow">
      <h2>小组信息</h2>
    </div>
    <el-divider  v-if="isMemberShow"></el-divider>
    <div v-if="isMemberShow" style="margin-left: 25%">
      <el-row :gutter="20">
        <el-col :span="8">
          <div>
            <el-col :span="8">
              <span>组名：</span>
              <el-input v-model="groupInfo.groupName" :disabled = true ></el-input>
            </el-col>
            <el-col :span="5">
              <span>组长：</span>
              <el-input v-model="groupInfo.leaderName" :disabled = true ></el-input>
            </el-col>
            <el-col :span="5" style="padding-top: 22px;margin-right: 10px">
              <el-button type="primary" @click="add" :disabled="this.isShowButton">添加组员</el-button>
            </el-col>
            <el-col :span="5" style="padding-top: 22px">
              <el-dropdown>
                <el-button type="primary">
                  小组作业<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="collectingTask">待完成作业</el-dropdown-item>
                  <el-dropdown-item @click.native="accomplishTask">已完成作业</el-dropdown-item>
                  <el-dropdown-item @click.native="overdueTask">已过期作业</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </div>
        </el-col>
        <el-col :span="20" style="margin-top: 50px">
          <AddMember ref="addMember" v-if="isShowAdd" @cancel="cancel"></AddMember>
        </el-col>
        <el-col :span="12" >
          <div>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>
                  <strong>小组成员</strong>
                </span>
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
                  <el-table-column
                      label="操作"
                      v-if="!isShowButton"
                  >
                    <template slot-scope="scope">
                      <el-button @click.stop="deleteClick(scope.row)"size="small"type="warning" >移除成员</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
import AddMember from "@/components/common/AddMember";
import GroupAccomplishTasks from "@/views/student/GroupAccomplishTasks";
import GroupCollectingTasks from "@/views/student/GroupCollectingTasks";
import GroupOverdueTasks from "@/views/student/GroupOverdueTasks";
export default {
  name: "Group",
  inject: ['reload'],
  components: {
    AddMember,GroupCollectingTasks,GroupOverdueTasks,GroupAccomplishTasks
  },
  props: {
    groupInfo: {
      type: Object
    }
  },
  data(){
    return {
      isCollectingShow: false,
      isAccomplishShow: false,
      isOverdueShow: false,
      isMemberShow: true,
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
    deleteClick(row){
      const _this = this;
      axios.delete("http://localhost:8181/groupInfo/removeMember",{
        params: {
          groupId: this.$store.getters.getGroupId,
          account: row.memberAccount,
        },
        crossDomain: true,
        xhrFields: {withCredentials: true},
        headers: {
          token: this.getToken(),
        }
      }).then(function (resp) {
        if(resp.data){
          _this.$message({
            type: 'info',
            message: "删除成功"
          });
          _this.reload();
        }else {
          _this.$message({
            type: 'warning',
            message: "删除失败"
          });
        }
      })
    },
    goBack(){
      this.isCollectingShow = false;
      this.isAccomplishShow = false;
      this.isOverdueShow = false;
      this.isMemberShow = true;
    },
    collectingTask(){
      console.log(this.isShowButton);
      this.isCollectingShow = true;
      this.isAccomplishShow = false;
      this.isOverdueShow = false;
      this.isMemberShow = false;
    },
    accomplishTask(){
      this.isCollectingShow = false;
      this.isAccomplishShow = true;
      this.isOverdueShow = false;
      this.isMemberShow = false;
    },
    overdueTask(){
      this.isCollectingShow = false;
      this.isAccomplishShow = false;
      this.isOverdueShow = true;
      this.isMemberShow = false;
    },
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
/deep/.el-table th > .cell {
  text-align: center;
}

/deep/.el-table .cell {
  text-align: center;
}
</style>