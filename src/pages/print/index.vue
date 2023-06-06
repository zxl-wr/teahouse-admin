<template>
  <div class="flex">
    <el-form class="mr-60px w-400px" :model="business" label-width="80px">
      <el-form-item label="商家">
        <el-input v-model="business.name" />
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="business.phone" />
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="business.address" />
      </el-form-item>
      <el-form-item label="打印宽度">
        <el-input-number v-model="business.width" />
      </el-form-item>
      <el-button class="float-right" type="primary" v-print="printObj" @click="updateBusiness"> 打印测试</el-button>
    </el-form>
    <div id="printMe" class="py-40px px-24px bg-#fff" :style="{ width: `${business.width}px` }">
      <h1 class="text-center">结账单</h1>
      <h3>{{ business.name }}</h3>
      <div>账单号：{{ defaultOrder.id }}</div>
      <div>开台时间：{{ useDateFormat(defaultOrder.start_at, 'YYYY-MM-DD HH:mm:ss').value }}</div>
      <div>打印时间：{{ useDateFormat(defaultOrder.end_at, 'YYYY-MM-DD HH:mm:ss').value }}</div>
      <el-table class="my-12px" :data="defaultOrder.goods_list">
        <el-table-column prop="name" label="项目" />
        <el-table-column label="单价">
          <template #default="scope"> {{ scope.row.price.toFixed(2) }} </template>
        </el-table-column>
        <el-table-column prop="number" label="数量" />
        <el-table-column label="金额">
          <template #default="scope"> {{ (scope.row.price * scope.row.number).toFixed(2) }} </template>
        </el-table-column>
      </el-table>
      <div>应收金额：{{ defaultOrder.price?.toFixed(2) }}</div>
      <div>电话： {{ business.phone }}</div>
      <div>地址：{{ business.address }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * 获取商家信息
 */
import { storeToRefs } from 'pinia';
import { useBusinessStore } from '@/store/business.ts';
const businessStore = useBusinessStore();
const { business } = storeToRefs(businessStore); // 商家信息
// 更新商家信息
const updateBusiness = () => {
  businessStore.updateBusiness(business.value)
}

/**
 * 测试订单
 */
import { useDateFormat } from '@vueuse/core';
import type { Order } from "@/assets/type";
// 默认订单
const defaultOrder: Order = {
  id: "1685408400000001",
  table_id: 1,
  goods_list: [
    { name: '开台费', price: 100, number: 1, time_at: 1672502400000 },
    { name: '消费1', price: 5, number: 1, time_at: 1672502400000 },
    { name: '消费2', price: 10, number: 1, time_at: 1672502400000 },
    { name: '消费3', price: 50, number: 1, time_at: 1672502400000 },
    { name: '消费4', price: 100, number: 1, time_at: 1672502400000 },
    { name: '消费5', price: 200, number: 1, time_at: 1672502400000 }
  ],
  start_at: 1672502400000,
  end_at: 1672506000000,
  price: 465
};

/**
 * 打印设置
 */
const printObj: any = { id: "printMe", popTitle: business.value.name };
</script>

<style scoped>
@media print {
  #printMe {
    margin: 0 auto;
  }
}
</style>