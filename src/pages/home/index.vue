<template>
  <!-- 桌台 -->
  <div class="h-auto">
    <div class="card m-2 text-center" v-for="table in defaultTables" :key="table.id" @click="clickTable(table.id)">
      <div class="text-5 my-2">{{ table.name }}</div>
      <img class="w-120px" :src="filterTableImg(table.id)" alt="桌台图片" />
    </div>
  </div>
  <!-- 消详情抽屉 -->
  <el-drawer v-model="isShowDawer" direction="btt" size="300px" :with-header="false" :before-close="handleDawerClose">
    <div class="flex-row-between">
      <el-table style="width: 620px" :data="goodsData" height="260">
        <el-table-column prop="id" label="序号" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="price" label="价格" />
        <el-table-column prop="number" label="数量" />
        <el-table-column label="操作">
          <el-button type="danger">删除</el-button>
        </el-table-column>
        <template #empty>
          <el-empty class="!p-0" :image-size="80" description="暂无数据" />
        </template>
      </el-table>
      <div class="w-500px h-260px">
        <div class="text-6">开始时间：{{ start_at }}</div>
        <div class="mt-8 text-12 text-center">{{ differ }}</div>
        <div class="mb-8 text-8 text-center">￥200</div>
        <el-button class="float-right !w-120px !h-48px !text-5" type="danger" size="large"
          @click="endOrder(currentOrder.tableId)"> 结算 </el-button>
        <el-button class="float-right mx-4  !w-120px !h-48px !text-5" type="primary" size="large"> + 消费 </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
/**
 * 渲染桌台
 */
import { storeToRefs } from 'pinia';
import { useOrderStore } from '@/store/order.ts';
import { defaultTables } from '@/assets/constant.ts';
import img_close from '@/assets/img/img-close.png';
import img_open from '@/assets/img/img-open.png';
const orderStore = useOrderStore(); // 订单仓库
const { currentOrderList } = storeToRefs(orderStore); // 当前订单
const tableIdList = computed(() =>
  currentOrderList.value.map((item) => {
    return item.tableId;
  })
); //  当前订单中的桌台id数组
// 分别已开台和未开台的桌台
const filterTableImg = (id: string | number) => {
  if (currentOrderList.value.length < 1 || tableIdList.value.indexOf(id) == -1) return img_close; // 当前没有订单 或者 该桌台没有订单
  else return img_open;
};

/**
 * 开台功能
 * 计时功能
 */
import type { Order } from '@/assets/type';
import { useDateFormat, useTimestamp } from '@vueuse/core';
const isShowDawer = ref(false); // 是否打开消费详情抽屉
const currentOrder = ref<Order>({ id: -1, tableId: -1, time: 0 }); // 当前订单
const { addOrder } = orderStore;
const { timestamp, pause, resume } = useTimestamp({ controls: true }); // 当前时间戳
pause(); // 先暂停当前时间计时
let start_at = ref(); // 订单开始时间格式化
// 判断是已有订单还是新增订单
const clickTable = async (tableId: string | number) => {
  // 没有开台去新增订单
  if (tableIdList.value.indexOf(tableId) == -1) {
    const res = await ElMessageBox.confirm('是否确认开台？', { confirmButtonText: '确认', cancelButtonText: '取消', }).catch(() => { return 'cancel' })
    if (res == 'cancel') return;
    const _timestamp = new Date().getTime();
    const _orderId = _timestamp + '-' + tableId;
    addOrder({ id: _orderId, tableId, time: _timestamp });
  }
  resume(); // 开始当前时间计时
  currentOrder.value = currentOrderList.value.find((item) => item.tableId == tableId) || { id: -1, tableId: -1, time: 0 }; // 当前订单
  start_at = useDateFormat(currentOrder.value.time, 'YYYY-MM-DD HH:mm:ss'); // 订单开始时间格式化
  isShowDawer.value = true; // 打开消费详情抽屉
};
// 关闭消费详情抽屉
const handleDawerClose = (done: () => void) => {
  pause(); // 暂停当前时间计时
  done();
};

// 计算差值
const differ = ref('');
watch(timestamp, (newValue) => {
  let _differ = newValue - currentOrder.value.time;
  let hh = 0, mm = 0, ss = 0;
  // 小于一秒
  if (_differ < 60000) {
    ss = Math.floor(_differ / 1000);
  }
  // 大于一小时
  else if (_differ - 3600000 > 0) {
    hh = Math.floor(_differ / 3600000);
    mm = Math.floor((_differ - 3600000 * hh) / 60000);
    ss = Math.floor((_differ - 3600000 * hh - 60000 * mm) / 1000);
  }
  // 大于一分钟，小于一小时
  else {
    mm = Math.floor(_differ / 60000);
    ss = Math.floor((_differ - 60000 * mm) / 1000);
  }
  differ.value = prefixZero(hh) + ':' + prefixZero(mm) + ':' + prefixZero(ss);
});
// 保留两位数
const prefixZero = (n: number, m = 2) => {
  const num = (Array(m).join('0') + n).slice(-m);
  return num;
};

/**
 * 消费、结算功能
 */

const { endOrder } = orderStore;


// 消费记录
const goodsData = ref([
  { id: 0, name: '简餐1', price: 50, number: 1 },
  { id: 0, name: '简餐1', price: 50, number: 1 },
  { id: 0, name: '简餐1', price: 50, number: 1 },
  { id: 0, name: '简餐1', price: 50, number: 1 },
  { id: 0, name: '简餐1', price: 50, number: 1 },
]);
</script>
