<template>
  <div id="printMe">
    <p>葫芦娃，葫芦娃</p>
    <p>一根藤上七朵花</p>
    <p>小小树藤是我家 啦啦啦啦</p>
    <p>叮当当咚咚当当 浇不大</p>
    <p>叮当当咚咚当当 是我家</p>
    <p>啦啦啦啦</p>
    <p>...</p>
    <p>电话： {{ phone }} 地址：{{ address }}</p>
  </div>

  <el-button v-print="printObj"> 打印测试</el-button>
</template>
<script lang="ts" setup>
const title = '天云茶楼';
const phone = 18226163451;
const address = '合肥市蜀山区江夏西路颐和花园';
const printObj: any = { id: 'printMe', popTitle: title };
</script>
