<template>
  <el-tabs v-model="tabName" type="card" @tab-click="changeTag">
    <el-tab-pane label="统计" name="count">统计</el-tab-pane>
    <el-tab-pane label="数据" name="data">数据</el-tab-pane>
    <el-tab-pane label="数据库" name="database">数据库</el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
// 切换tab栏
const tabName = ref("count");
const changeTag = (tab: any) => {
  tabName.value = tab.paneName;
};
</script>
