<template>
<div>
  <div class="toggle-button" @click="toggleCollapse" style="height: 30px;background-color:#545c64" >菜单</div>
  <el-aside style="background-color: #545c64;height: 850px;" :width="isCollapse?'66px':'200px'">
    <el-menu v-bind:router="true" v-bind:default-active="$route.path" :collapse="isCollapse"
             class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" mode="vertical"
             background-color="#545c64" active-text-color="#ffd04b" text-color="#fff">
      <el-submenu v-for="(item,index) in this.menus" v-bind:index="index" v-if="item.meta.course==='course'">
        <template slot="title">
          <i class="el-icon-message"></i>
          <span slot="title">{{ item.name }}</span>
        </template>
        <el-menu-item v-for="(item2,index2) in item.children" v-bind:index="item2.path"
                      v-bind:class="item2.path==$route.path?'is-active':''">
          {{ item2.name }}
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </el-aside>
</div>
</template>

<script>
export default {
  name: "CourseSideBar",
  props: {
    menus: [],
    isCollapse: false,
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style scoped>

</style>