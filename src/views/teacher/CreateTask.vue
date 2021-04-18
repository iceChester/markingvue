<template>
<div>
  <el-form :model="taskForm" :rules="rules" ref="taskForm" label-width="120px" class="taskForm" >
    <el-form-item label="作业标题" prop="title">
      <el-input v-model="taskForm.title"></el-input>
    </el-form-item>
    <el-form-item label="作业类型" prop="taskType">
      <el-select v-model="taskForm.taskType" placeholder="请选择作业类型">
        <el-option
            v-for="item in taskOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="评分方式" prop="markingType">
      <el-select v-model="taskForm.markingType" placeholder="请选择评分方式" @change="this.handleChange">
        <el-option
            v-for="item in markingOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="评分权重:" v-if="isCooperationShow" v-for="(item,index) in this.teacherList">
      <div >
        <el-row :gutter="24">
          <el-col :span="4">
            <div>
              <span>账号： {{item.account}}</span>
            </div>
          </el-col>
          <el-col :span="4">
            <div>
              <span>姓名： {{item.teacherName}}</span>
            </div>
          </el-col>
        </el-row>
        <div>
          权重：<el-slider
            v-model="item.weight"
            show-input style="width: 600px">
        </el-slider>
        </div>
      </div>
    </el-form-item>
    <el-form-item label="截至日期" required>
      <el-col :span="11">
        <el-form-item prop="deadline">
          <el-date-picker type="date" placeholder="选择日期" v-model="taskForm.deadline" style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-form-item>

    <el-form-item label="作业详细内容" prop="detail" class="text-area">
      <el-input type="textarea" v-model="taskForm.detail" :rows="5"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('taskForm')">立即创建</el-button>
      <el-button @click="resetForm('taskForm')">重置</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
export default {
  name: "CreateTask",
  data() {
    let validateWeight = (rule,value,callback) =>{
      let account = parseInt("0");
      this.teacherList.forEach((item,index) => {
        account = account + parseInt(item.weight);
      });
      console.log(account);
      if(account!=100){
        callback(new Error("评分权重值之和需要为100"))
      }else {
        callback()
      }
    }
    return {
      isCooperationShow: false,
      teacherList: [],
      weightCount: 0,
      teacherCount: 0,
      taskForm: {
        title: '',
        taskType: 0,
        markingType: 0,
        deadline: '',
        detail: '',
        offerId: '',
        markingAccount: '',
        markingWeight: '',
      },
      taskOptions: [
        {
          value: 0,
          label: '个人作业'
        },
        {
          value: 1,
          label: '小组作业'
        }
      ],
      markingOptions: [
        {
          value: 0,
          label: '主教师评分'
        },
        {
          value: 1,
          label: '教师合作评分'
        }
      ],
      rules: {
        title: [
          { required: true, message: '请输入作业标题', trigger: 'blur' },
          { min: 3, max: 25, message: '长度在 3 到 25 个字符', trigger: 'blur' }
        ],
        taskType: [
          { required: true, message: '请选择作业类型', trigger: 'change' }
        ],
        deadline: [
          { type: 'date', required: true, message: '请选择截至日期', trigger: 'change' }
        ],
        weight: [
          { required: true, message: '输入权重', trigger: 'change' },
          {validator: validateWeight,trigger: 'blur'}
        ],
        markingType: [
          { required: true, message: '请选择评分方式', trigger: 'change' }
        ],
        detail: [
          { required: true, message: '请填写作业详细内容', trigger: 'blur' }
        ]
      }
    };
  },
  mounted() {
    this.handleChange(0);
  },
  methods: {
    submitForm(formName) {
      let sum = 0;
      let weight = "";
      let account = "";
      if(this.isCooperationShow){
        sum = parseInt("0");
        this.teacherList.forEach((item,index) => {
          console.log(item.weight);
          if(item.weight==undefined){
            item.weight = 0;
          }
          weight = weight+item.weight+",";
          account = account + item.account+",";
          sum = sum + parseInt(item.weight);
        });
      }else {
        sum = 100;
        weight = 100 + ",";
        account = this.teacherList[0].account+",";
      }
      if(sum!=100){
        this.$alert('分数权重值之和需要为100', '警告', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'warning',
              message: "请重新输入权重"
            });
          }
        });
      }else{
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const _this = this;
            this.taskForm.offerId = this.$store.getters.getOfferId;
            this.taskForm.markingWeight = weight;
            this.taskForm.markingAccount = account;
            axios.post("http://localhost:8181/task/save",this.taskForm,{
              crossDomain: true,
              xhrFields: {withCredentials: true},
              headers: {
                token: this.getToken(),
              }
            }).then(function (resp) {
              console.log(resp.data)
              if(resp.data){
                _this.$alert("《"+_this.taskForm.title+'》发布成功', '消息', {
                  confirmButtonText: '确定',
                  callback: action => {
                    _this.$router.push('/CourseTasks');
                  }
                });
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleChange(value){
        const _this = this;
        axios.get("http://localhost:8181/offerCourses/findTeacher",{
          params: {
            offerId: this.$store.getters.getOfferId,
          },
          crossDomain: true,
          xhrFields: {withCredentials: true},
          headers: {
            token: this.getToken(),
          }
        }).then(function (resp){
          _this.teacherList = resp.data;
          console.log(_this.teacherList)
          _this.teacherCount = _this.teacherList.length + 0;
        })
      if(value=="1"){
        _this.isCooperationShow = true;
      }else {
        this.isCooperationShow = false;
      }
    },
  }
}
</script>
<style scoped>
.taskForm {
  margin: 0 auto;
  padding-top: 30px;
  width: 80%;
}
.text-area {
  width: 45%;
}
</style>