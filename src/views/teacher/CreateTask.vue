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
        <el-option label="个人作业" value="1"></el-option>
        <el-option label="小组作业" value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="评分方式" prop="markingType">
      <el-select v-model="taskForm.markingType" placeholder="请选择评分方式">
        <el-option
            v-for="item in markingOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
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
    return {
      taskForm: {
        title: '',
        taskType: 1,
        markingType: 1,
        deadline: '',
        detail: '',
        offerId: '',
      },
      taskOptions: [
        {
          value: 1,
          label: '个人作业'
        },
        {
          value: 2,
          label: '小组作业'
        }
      ],
      markingOptions: [
        {
          value: 1,
          label: '主教师评分'
        },
        {
          value: 2,
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
        markingType: [
          { required: true, message: '请选择评分方式', trigger: 'change' }
        ],
        detail: [
          { required: true, message: '请填写作业详细内容', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const _this = this;
          this.taskForm.offerId = this.$store.getters.getOfferId;
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
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>
<style scoped>
.taskForm {
  margin: 0 auto;
  padding-top: 30px;
  width: 60%;
}
.text-area {
  width: 45%;
}
</style>