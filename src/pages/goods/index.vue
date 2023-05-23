<template>
  <el-row class="mb-4">
    <el-button :type="currentTab == tab.id ? 'primary' : ''" v-for="tab in goodsType" :key="tab.id"
      @click="currentTab = tab.id">
      {{ tab.name }}
    </el-button>
  </el-row>

  <el-table :data="tableData" height="600">
    <el-table-column prop="id" label="序号" />
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="price" label="价格" />
    <el-table-column label="操作">
      <el-button type="danger">删除</el-button>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { goodsType } from "@/assets/constant.ts";

const currentTab = ref(-1)

const tableData = ref([
  { id: 0, name: '简餐1', price: '5' },
  { id: 1, name: '简餐2', price: '10' },
  { id: 2, name: '简餐3', price: '20' },
  { id: 3, name: '简餐4', price: '50' },
  { id: 4, name: '简餐5', price: '100' },
  { id: 0, name: '简餐1', price: '5' },
  { id: 1, name: '简餐2', price: '10' },
  { id: 2, name: '简餐3', price: '20' },
  { id: 3, name: '简餐4', price: '50' },
  { id: 4, name: '简餐5', price: '100' },
  { id: 0, name: '简餐1', price: '5' },
  { id: 1, name: '简餐2', price: '10' },
  { id: 2, name: '简餐3', price: '20' },
  { id: 3, name: '简餐4', price: '50' },
  { id: 4, name: '简餐5', price: '100' },
  { id: 0, name: '简餐1', price: '5' },
  { id: 1, name: '简餐2', price: '10' },
  { id: 2, name: '简餐3', price: '20' },
  { id: 3, name: '简餐4', price: '50' },
  { id: 4, name: '简餐5', price: '100' },
  { id: 0, name: '简餐1', price: '5' },
  { id: 1, name: '简餐2', price: '10' },
  { id: 2, name: '简餐3', price: '20' },
  { id: 3, name: '简餐4', price: '50' },
  { id: 4, name: '简餐5', price: '100' },
])


</script>
