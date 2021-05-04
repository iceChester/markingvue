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
          <el-date-picker type="date" placeholder="选择日期" v-model="taskForm.deadline" style="width: 100%;"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-form-item>

    <el-form-item label="作业详细内容" prop="detail" class="text-area">
      <el-input type="textarea" v-model="taskForm.detail" :rows="5"></el-input>
    </el-form-item>
    <el-form-item label="作业对应课程目标点" style="width: 100%">
      <el-transfer :data="transferData" :render-content="renderContent" v-model="ObjectValue">
      </el-transfer>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm('taskForm')">立即创建</el-button>
      <el-button @click="resetForm('taskForm')">重置</el-button>
    </el-form-item>
  </el-form>
  <div>
    <el-dialog
        :title= "dialogTitle"
        :visible.sync="dialogVisible"
        width="30%"
        :show-close="false">
      <el-upload
          class="upload-demo"
          ref="upload"
          action=""
          :multiple = "true"
          :http-request="httpRequest"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="cleanFileList"
          :file-list="fileList"
          :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
      </el-upload>
      <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
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
    };
    const generateData  = _ => {
      const data = [];
      axios.get("http://localhost:8181/offerCourses/findObjectives",{
        params: {
          offerId: this.$store.getters.getOfferId,
        },
        crossDomain: true,
        xhrFields: {withCredentials: true},
        headers: {
          token: this.getToken(),
        }
      }).then(function (resp) {
        for (let i = 0; i < Object.keys(resp.data).length; i++) {
          data.push({
            key: resp.data[i].objectiveId,
            label: `指标点 ${i+1} ：${ resp.data[i].objectiveContent }`,
          });
        }
      })

      return data;
    };
    return {
      ObjectValue: [],
      transferData: generateData(),
      objectiveData: [{
        objectiveId: '',
        objectiveContent: '',
      }],
      isCooperationShow: false,
      teacherList: [],
      weightCount: 0,
      teacherCount: 0,
      dialogVisible: false,
      studentTaskData: [],
      fileList: [],
      file: [],
      newData: new FormData(),
      taskForm: {
        taskId: '',
        title: '',
        taskType: 0,
        markingType: 0,
        deadline: new Date(),
        detail: '',
        offerId: '',
        markingAccount: '',
        markingWeight: '',
        taskObjectives: '',
      },
      dialogTitle: "发布成功，是否需要添加附件",
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
          { required: true, message: '请选择截至日期', trigger: 'change' }
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
    renderContent (h, option) {
      return h('span', {domProps: {title: option.label}}, option.label);
    },
    httpRequest(param) {
      //this.file.push(param.file);// 需要上传多个文件，为避免发送多次请求，因此在这里只进行文件的获取，param可以拿到文件上传的所有信息
      this.newData.append('file', param.file);
    },
    cleanFileList(response, file, fileList){
      this.fileList = [];
      this.$message({
        type: 'info',
        message: "提交成功"
      });
    },
    submitUpload() {
      const  _this = this;
      this.$refs.upload.submit();
      this.newData.append('file', this.file);
      this.newData.append("task", JSON.stringify(this.taskForm)) // 这里需要转换一下格式传给后台
      console.log(this.newData);
      axios.post("http://localhost:8181/task/attachment/", this.newData,{
        crossDomain: true,
        xhrFields: {withCredentials: true},
        headers: {
          token: this.getToken(),
          'Content-Type':'multipart/form-data'
        }
      }).then(function(response) {
        if (response.data) {
          _this.$message({
            type: 'info',
            message: "提交成功"
          });
        }
      })
          .catch(function(error) {
            console.log(error);
          });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.reload();
    },
    handlePreview(file) {
      console.log(file);
    },
    dialogClose() {
      this.dialogVisible = false;
      this.$router.push('/CourseTasks');
    },
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
            let taskObjectives = "";
            if(this.ObjectValue!==null) {
              this.ObjectValue.forEach((item, index) => {
                taskObjectives = taskObjectives + item + ",";
              });
            }
            this.taskForm.taskObjectives = taskObjectives;
            axios.post("http://localhost:8181/task/save",this.taskForm,{
              crossDomain: true,
              xhrFields: {withCredentials: true},
              headers: {
                token: this.getToken(),
              }
            }).then(function (resp) {
              if(resp.data>0){
                _this.dialogVisible = true;
                _this.taskForm.taskId = resp.data;
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