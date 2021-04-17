<template>
  <div>
    <el-page-header @back="goBack" content="开设课程" style="margin-bottom: 30px"></el-page-header>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="课程编号" >
        <el-input v-model="ruleForm.courseId" readonly></el-input>
      </el-form-item>
      <el-form-item label="课程名称">
        <el-input v-model="ruleForm.courseName" readonly></el-input>
      </el-form-item>
      <el-form-item label="主教师" prop="mainTeacherId">
        <el-select
            v-model="ruleForm.mainTeacherId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入教师名关键词"
            :remote-method="remoteMethod"
            :loading="loading">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.teacherName+item.account"
              :value="item.account">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="助教一" >
        <el-select
            v-model="ruleForm.assistantTeacherOne"
            filterable
            remote
            reserve-keyword
            placeholder="请输入教师名关键词"
            :remote-method="remoteMethod"
            :loading="loading">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.teacherName+item.account"
              :value="item.account">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="助教二" >
        <el-select
            v-model="ruleForm.assistantTeacherTwo"
            filterable
            remote
            reserve-keyword
            placeholder="请输入教师名关键词"
            :remote-method="remoteMethod"
            :loading="loading">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.teacherName+item.account"
              :value="item.account">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级" prop="classes">
        <el-select
            v-model="ruleForm.classes"
            filterable
            multiple
            remote
            reserve-keyword
            placeholder="请输入班级关键词"
            :remote-method="remoteClasses"
            :loading="loading">
          <el-option
              v-for="item in classesOption"
              :key="item.key"
              :label="item.className"
              :value="item.className">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即开设课程</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    let validateTeacher = (rule,value,callback) =>{
      if(this.ruleForm.mainTeacher===this.ruleForm.assistantTeacherOne
          ||this.ruleForm.mainTeacher===this.ruleForm.assistantTeacherTwo){
        callback(new Error("主教师不能与助教重复"))
      }else {
        callback()
      }
    }
    let validateAssistant = (rule,value,callback) =>{
      if(this.ruleForm.assistantTeacherOne!==''&&this.ruleForm.assistantTeacherTwo!==''){
        if(this.ruleForm.assistantTeacherOne===this.ruleForm.assistantTeacherTwo){
          callback(new Error("助教不能重复"))
        }else {
          callback()
        }
      }else {
        callback()
      }
    }
    return {
      options: [{
        teacherName: '',
        teacherId: '',
        account: '',
      }],
      classesOption:[{
        className: '',
        key: '',
      }],
      value: [],
      list: [],
      loading: false,
      ruleForm: {
        courseId: '',
        courseName: '',
        mainTeacher: '',
        assistantTeacherOne: '',
        assistantTeacherTwo: '',
        classes: '',
      },
      rules: {
        classes: [
          { required: true, message: '请选择班级', trigger: 'blur' }
        ],
        mainTeacherId: [
          {required: true,message:'请选择主教师', trigger: 'blur'},
          {validator: validateTeacher,trigger: 'blur'}
        ],
        assistantTeacherOne: [
          {validator: validateAssistant,trigger: 'blur'}
        ],
        assistantTeacherTwo: [
          {validator: validateAssistant,trigger: 'blur'}
        ]
      }
    };
  },
  created() {
    // const _this = this;
    this.ruleForm.courseId = this.$route.query.courseId;
    this.ruleForm.courseName = this.$route.query.courseName;


  },
  mounted() {
  },

  methods: {
    goBack(){
      this.$router.push("/Courses");
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const _this = this
          axios.post("http://localhost:8181/offerCourses/offerCourse",this.ruleForm,{
            crossDomain: true,
            xhrFields: {withCredentials: true},
            headers: {
              token: this.getToken(),
            }
          }).then(function (resp){
            console.log(resp.data)
            if(resp.data){
              _this.$alert("《"+_this.ruleForm.courseName+'》开课成功', '消息', {
                confirmButtonText: '确定',
                callback: action => {
                  _this.$router.push('/MyCourses')
                }
              });
            }
          });
          console.log(this.ruleForm);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        const _this = this;

        setTimeout(() => {
          this.loading = false;
          axios.get("http://localhost:8181/teacher/likeName/",{
            params: {
              name: query,
            },
            crossDomain: true,
            xhrFields: {withCredentials: true},
            headers: {
              token: this.getToken(),
            }
          })
              .then(function (resp){
                _this.options = resp.data;
              })
        }, 200);
      } else {
        this.options = [];
      }
    },
    remoteClasses(query){
      if (query !== '') {
        this.loading = true;
        const _this = this;
        setTimeout(() => {
          this.loading = false;
          axios.get("http://localhost:8181/student/findClassName/",{
            params: {
              name: query,
            },
            crossDomain: true,
            xhrFields: {withCredentials: true},
            headers: {
              token: this.getToken(),
            }
          })
              .then(function (resp){
                _this.classesOption = resp.data;
              })
        }, 200);
      } else {
        this.classesOption = [];
      }
    }

  }
}
</script>