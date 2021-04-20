import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const state={   //要设置的全局访问的state对象
                //要设置的初始属性值
  courseName: '',
  courseId: 0,
  offerId: 0,
  userId: '',
  userName: '',
  account: '',
  roleId: 0,
  taskId: '',
  taskTitle: '',
  role: 'unload',
  groupId: '',
  globalRouter: [
    {
      antRouter: '',
    }
  ],
};
const getters = {   //实时监听state值的变化(最新状态)
  getCourseName(){  //方法名随意,主要是用来承载变化的changableNum的值
    return state.courseName;
  },
  getCourseId(){
    return state.courseId;
  },
  getOfferId(){
    if(!state.offerId){
      //防止页面刷新，数据丢失
      return localStorage.getItem("offerId");
    }
    return state.offerId;
  },
  getUserId(){
    if(!state.userId){
      //防止页面刷新，数据丢失
      return localStorage.getItem("userId");
    }
    return state.userId;
  },
  getAccount() {
    if(!state.account){
      //防止页面刷新，数据丢失
      return localStorage.getItem("account");
    }
    return state.account;
  },
  getUserName() {
    if(!state.userName){
      //防止页面刷新，数据丢失
      return localStorage.getItem("userName");
    }
    return state.userName;
  },
  getRole(){
    if(!state.role){
      return sessionStorage.getItem("role");
    }
    return state.role;
  },
  getGlobalRouter(){
    return state.globalRouter.antRouter;
  },
  getRoleId(){
    if(!state.roleId){
      return localStorage.getItem("roleId");
    }
    return state.roleId;
  },
  getGroupId(){
    if(!state.groupId){
      return localStorage.getItem("groupId");
    }
    return state.groupId;
  },
  getTaskId(){
    if(!state.taskId){
      return sessionStorage.getItem("taskId");
    }
    return state.taskId;
  },
  getTaskTitle(){
    if(!state.taskTitle){
      return sessionStorage.getItem("taskTitle");
    }
    return state.taskTitle;
  }
};
const mutations = {
  changeName(state,name) {   //自定义改变state初始值的方法，这里面的参数除了state之外还可以再传额外的参数(变量或对象);
    state.courseName = name;
  },
  setId(state,id){
    state.courseId = id;
  },
  setOfferId(state,id){
    state.offerId = id;
  },
  setUserId(state,id){
    state.userId = id ;
  },
  setRole(state,role){
    state.role = role;
  },
  setGlobalRouter(state,antRouter){
    state.globalRouter.antRouter = antRouter;
  },
  setRoleId(state,roleId){
    state.roleId = roleId;
  },
  setAccount(state,account){
    state.account = account;
  },
  setUserName(state,userName){
    state.userName = userName;
  },
  setGroupId(state,groupId){
    state.groupId = groupId;
  },
  setTaskId(state,taskId){
    state.taskId = taskId;
  },
  setTaskTitle(state,taskTitle){
    state.taskTitle = taskTitle;
  }
};
const actions = {
  changeCourseName(context,name){
    context.commit('changeName',name);
  },
  setCourseId(context,id){
    context.commit('setId',id);
  },
  changeOfferId(context, id) {
    context.commit('setOfferId',id);
    localStorage.offerId = id;
  },
  changeUserId(context,id){
    context.commit('setUserId',id);
    localStorage.userId = id;
  },
  changeRole(context,role){
    context.commit('setRole',role);
    sessionStorage.role = role;
  },
  changeGlobalRouter(context,antRouter){
    context.commit('setGlobalRouter',antRouter);
  },
  changeRoleId(context,roleId){
    context.commit('setRoleId',roleId);
    localStorage.roleId = roleId;
  },
  changeAccount(context,account){
    context.commit('setAccount',account);
    localStorage.account = account;
  },
  changeUserName(context,userName){
    context.commit('setUserName',userName);
    localStorage.userName = userName;
  },
  changeGroupId(context,groupId){
    context.commit('setGroupId',groupId);
    localStorage.groupId = groupId;
  },
  changeTaskId(context,taskId){
    context.commit('setTaskId',taskId)
    sessionStorage.taskId = taskId;
  },
  changeTaskTitle(context,taskTitle){
    context.commit('taskTitle',taskTitle)
    sessionStorage.taskTitle = taskTitle;
  }
}
const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
});

export default store;
