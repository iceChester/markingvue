<template>
  <div>
    <el-transfer
        filterable
        :filter-method="filterMethod"
        filter-placeholder="请输入学号"
        v-model="value"
        :data="studentData">
    </el-transfer>
    <el-button type="primary" @click="add">确认添加</el-button>
    <el-button type="primary" @click="cancel">取消</el-button>
  </div>
</template>

<script>
export default {
  name: "AddMember",
  inject: ['reload'],
  data() {
    const generateData = _ => {
      const studentData = [];
      axios.get("http://localhost:8181/groupInfo/noGroupStudent",
          {
            params: {
              offerId: this.$store.getters.getOfferId,
            },
            crossDomain: true,
            xhrFields: {withCredentials: true},
            headers: {
              token: this.getToken(),
            }
          }
      ).then(function (resp) {
        if(resp.data!==null){
          resp.data.forEach((student, index) => {
            studentData.push({
              label: student.studentName,
              key: index,
              account: student.account
            });
          });
        }
      })
      return studentData;
    };
    return {
      studentData: generateData(),
      value: [],
      offerId: this.$store.getters.getOfferId,
      groupId: this.$store.getters.getGroupId,
      memberInfo: [
        {
          offerId: this.offerId,
          groupId: this.groupId,
          memberAccount: '',
          memberName: '',
        }
      ],
      filterMethod(query, item) {
        return item.account.indexOf(query) > -1;
      },
    };
  },
  methods: {
    add(){
      const _this = this;
      let obj = [];
      this.$confirm('确认添加？')
          .then(_ => {
            if(this.value!==null){
              this.value.forEach((item,index) => {
                let account = _this.studentData[item].account;
                let studentName = _this.studentData[item].label;
                obj.push({
                  offerId: this.offerId,
                  groupId: this.groupId,
                  memberAccount: account,
                  memberName: studentName
                })
              });
              this.memberInfo = obj;
              console.log(obj);
              axios.post("http://localhost:8181/groupInfo/save",this.memberInfo,
                  {
                    crossDomain: true,
                    xhrFields: {withCredentials: true},
                    headers: {
                      token: this.getToken(),
                    }
                  }
              ).then(function (resp) {
                if(resp.data){
                  _this.$message('添加成功');
                  _this.reload();
                }
              })
            }
          })
          .catch(_ => {});
    },
    cancel(){
      let isShowAdd = false;
      this.$emit("cancel",isShowAdd);
    }
  }
}
</script>

<style scoped>

</style>