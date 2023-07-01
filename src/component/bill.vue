<template>
  <div class="bg-#fff text-4" :style="{ width: `${business.width}px`, padding: `auto ${business.padding}px` }">
    <div class="ml-16 text-6">结账单·{{ business.name }}</div>
    <div>{{ getTableName(defaultOrder.table_id) }}</div>
    <div>账单号：{{ defaultOrder.id }}</div>
    <div>开台时间：{{ useDateFormat(defaultOrder.start_at, "YYYY-MM-DD HH:mm:ss").value }}</div>
    <div>打印时间：{{ useDateFormat(defaultOrder.end_at, "YYYY-MM-DD HH:mm:ss").value }}</div>
    <hr />
    <div class="flex-row">
      <div class="w-20%">项目</div>
      <div class="w-20%">单价</div>
      <div class="w-20%">数量</div>
      <div class="w-20%">金额</div>
    </div>
    <div class="text-4" v-for="(item, index) in defaultOrder.goods_list" :key="index">
      <div>{{ item.name }}</div>
      <div class="flex-row">
        <div class="w-20%"></div>
        <div class="w-20%">{{ item.price.toFixed(2) }}</div>
        <div class="w-20%">{{ item.number }}</div>
        <div class="w-20%">{{ (item.price * item.number).toFixed(2) }}</div>
      </div>
    </div>
    <hr />
    <div>应收金额：{{ defaultOrder.price?.toFixed(2) }}</div>
    <div>电话： {{ business.phone }}</div>
    <div>地址：{{ business.address }}</div>
    <hr class="mt-40px" />
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
 * 获取桌台名称
 */
import { defaultTables } from "@/assets/constant.ts"; // 默认桌台
const getTableName = (id: string | number) => {
  return defaultTables.find((item) => item.id == id)?.name;
};

/**
 * 商家信息
 */
import { useBusinessStore } from "@/store/business.ts";
const businessStore = useBusinessStore();
const { business } = storeToRefs(businessStore); // 商家信息
</script>
