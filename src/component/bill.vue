<template>
  <div class="py-40px bg-#fff" :style="{ width: `${business.width}px`, padding: `auto ${business.padding}px` }">
    <h1 class="text-center">结账单</h1>
    <h3>{{ business.name }}</h3>
    <div>账单号：{{ defaultOrder.id }}</div>
    <div>开台时间：{{ useDateFormat(defaultOrder.start_at, "YYYY-MM-DD HH:mm:ss").value }}</div>
    <div>打印时间：{{ useDateFormat(defaultOrder.end_at, "YYYY-MM-DD HH:mm:ss").value }}</div>
    <el-table class="my-12px" :data="defaultOrder.goods_list">
      <el-table-column prop="name" label="项目" />
      <el-table-column label="单价">
        <template #default="scope"> {{ scope.row.price.toFixed(2) }} </template>
      </el-table-column>
      <el-table-column prop="number" label="数量" />
      <el-table-column label="金额">
        <template #default="scope">
          {{ (scope.row.price * scope.row.number).toFixed(2) }}
        </template>
      </el-table-column>
    </el-table>
    <div>应收金额：{{ defaultOrder.price?.toFixed(2) }}</div>
    <div>电话： {{ business.phone }}</div>
    <div>地址：{{ business.address }}</div>
  </div>
</template>

<script lang="ts" setup>
/**
 * 订单信息
 */
import { useDateFormat } from "@vueuse/core";
import type { Order } from "@/assets/type";
defineProps<{ defaultOrder: Order }>();

/**
 * 商家信息
 */
import { useBusinessStore } from "@/store/business.ts";
const businessStore = useBusinessStore();
const { business } = storeToRefs(businessStore); // 商家信息
</script>
