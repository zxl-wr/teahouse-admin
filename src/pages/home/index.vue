<template>
  <!-- 新增按钮 -->
  <el-row class="mb-4" justify="end">
    <el-button type="primary" @click="isShowDialog = true">+ 添加桌台
    </el-button>
  </el-row>
  <!-- 桌台 -->
  <div class="h-auto">
    <div class="card m-2 text-center" v-for="table in defaultTables" :key="table.id" @click="clickTable(table.id)">
      <div class="text-5 my-2">{{ table.name }}</div>
      <img class="w-120px" :src="filterTableImg(table.id)" alt="桌台图片" />
    </div>
  </div>
  <!-- 消详情抽屉 -->
  <el-drawer v-model="isShowdDawer" direction="btt" size="300px" :with-header="false" :before-close="handleDawerClose">
    <div class="flex-row-between">
      <div>
        <div>开始时间：{{ start_at }}</div>
        <div>当前时间：{{ current_at }}</div>
        <div>{{ differ }}</div>
      </div>
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
    </div>
  </el-drawer>
  <!-- 新增桌台对话框 -->
  <el-dialog v-model="isShowDialog" title="新增桌台" :before-close="handleClose">
    <el-form :model="tableForm" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="tableForm.name" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="addTable">
        确认
      </el-button>
    </template>
  </el-dialog>
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

const isShowdDawer = ref(false); // 是否打开消费详情抽屉
const currentOrder = ref<Order>({ id: -1, tableId: -1, time: 0 }); // 当前订单
const { addOrder } = orderStore;
const { timestamp, pause, resume } = useTimestamp({ controls: true }); // 当前时间戳
pause(); // 先暂停当前时间计时
let current_at = useDateFormat(timestamp, 'YYYY-MM-DD HH:mm:ss'); // 当前时间格式化
let start_at = ref(); // 订单开始时间格式化

// 判断是已有订单还是新增订单
const clickTable = (tableId: string | number) => {
  resume(); // 开始当前时间计时
  // 没有开台去新增订单
  if (tableIdList.value.indexOf(tableId) == -1) {
    const _timestamp = new Date().getTime();
    const _orderId = _timestamp + '-' + tableId;
    addOrder({ id: _orderId, tableId, time: _timestamp });
  }
  currentOrder.value = currentOrderList.value.find((item) => item.tableId == tableId) || { id: -1, tableId: -1, time: 0 }; // 当前订单
  start_at = useDateFormat(currentOrder.value.time, 'YYYY-MM-DD HH:mm:ss'); // 订单开始时间格式化
  isShowdDawer.value = true; // 打开消费详情抽屉
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

// 计时功能
// const start_at =ref(1684900426000);
// const current_at = ref(new Data())
// 消费记录
const goodsData = ref([]);

/**
 * 新增桌台功能
 */
const isShowDialog = ref(false); // 是否展示新增弹窗
const tableForm = reactive({ name: '' }); // 弹窗中的表单
// 处理关闭：重置表单
const handleClose = (done: () => void) => {
  tableForm.name = '';
  done();
};
// 新增桌台
const addTable = (): void => {
  if (/^.{1,9}$/.test(tableForm.name)) {
    tableForm.name = '';
    isShowDialog.value = false;
  } else {
    ElMessage.error('请输入 1~9 位名称');
  }
};
</script>
