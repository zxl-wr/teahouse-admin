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
      <el-form-item label="两边宽度">
        <el-input-number v-model="business.padding" />
      </el-form-item>
      <el-button class="float-right" type="primary" v-print="printObj" @click="updateBusiness"> 打印测试</el-button>
    </el-form>
    <Bill id="printMe" :defaultOrder="defaultOrder"></Bill>
  </div>
</template>

<script lang="ts" setup>
import Bill from "@/component/bill.vue";
/**
 * 获取商家信息
 */
import { storeToRefs } from "pinia";
import { useBusinessStore } from "@/store/business.ts";
const businessStore = useBusinessStore();
const { business } = storeToRefs(businessStore); // 商家信息
// 更新商家信息
const updateBusiness = () => {
  businessStore.updateBusiness(business.value);
};

/**
 * 测试订单
 */
import type { Order } from "@/assets/type";
// 默认订单
const defaultOrder: Order = {
  id: "1685408400000001",
  table_id: 1,
  goods_list: [
    { name: "开台费", price: 100, number: 1, time_at: 1672502400000 },
    { name: "消费1", price: 5, number: 1, time_at: 1672502400000 },
    { name: "消费2", price: 10, number: 1, time_at: 1672502400000 },
    { name: "消费3", price: 50, number: 1, time_at: 1672502400000 },
    { name: "消费4", price: 100, number: 1, time_at: 1672502400000 },
    { name: "消费5", price: 200, number: 1, time_at: 1672502400000 },
  ],
  start_at: 1672502400000,
  end_at: 1672506000000,
  price: 465,
};

/**
 * 打印设置
 */
const printObj: any = { id: "printMe", popTitle: business.value.name };
</script>
