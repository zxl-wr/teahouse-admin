<template>
  <!-- 清理数据 -->
  <el-row class="mb-4">
    <el-button class="!ml-auto" type="danger" @click="clearData"> 清理数据 </el-button>
  </el-row>
  <!-- 数据表格 -->
  <el-table :data="tableData" height="560">
    <el-table-column prop="id" label="订单号" />
    <el-table-column prop="table_id" label="桌台">
      <template #default="scope">
        {{ filterTableName(scope.row.table_id) }}
      </template>
    </el-table-column>
    <el-table-column prop="start_at" label="开始时间">
      <template #default="scope">
        {{ useDateFormat(scope.row.start_at, 'YYYY-MM-DD HH:mm:ss').value }}
      </template>
    </el-table-column>
    <el-table-column prop="end_at" label="结束时间">
      <template #default="scope">
        {{ filterEndAt(scope.row.end_at) }}
      </template>
    </el-table-column>
    <el-table-column prop="price" label="收费" />
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="primary" @click="readOrder(scope.row)">查看</el-button>
        <el-button type="danger" @click="deleteOrder(scope.row)" v-if="scope.row.end_at != -1">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="py-2 px-4 bg-#fff">
    <el-config-provider :locale="zhCn">
      <el-pagination
        class="flex-row-reverse"
        background
        layout="jumper, next, pager, prev, sizes, total"
        :total="total"
        :page-sizes="[10, 20, 30]"
        :page-size="pageSize"
        :current-page="page"
        @update:page-size="updatePageSize"
        @update:current-page="updatePage" />
    </el-config-provider>
  </div>
  <!-- 查看订单、打印小票 -->
  <el-dialog style="width: fit-content" v-model="isShowBill" title="打印预览" top="0">
    <Bill id="printBill" :defaultOrder="defaultOrder" v-if="defaultOrder"></Bill>
    <template #footer v-if="defaultOrder?.end_at != -1">
      <el-button type="danger" v-print="printObj">打印</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
/**
 * 获取订单表格数据
 */
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'; // 中文设置
import { db } from '@/utils/indexDB.ts'; // 数据库
const total = ref<number>(0); // 数据总量
const page = ref<number>(1); // 当前页码
const pageSize = ref<number>(10); // 页容量
const tableData = ref<object[]>([]); // 表格数据
// 初始化数据
onMounted(async () => {
  getTableData();
});
// 改变页容量
const updatePageSize = (e: number) => {
  pageSize.value = e;
};
// 改变页码
const updatePage = (e: number) => {
  page.value = e;
  getTableData();
};
// 获取数据
const getTableData = async () => {
  total.value = await db.order_store.count(); // 获取总数
  tableData.value = await db.order_store
    .reverse()
    .offset((page.value - 1) * pageSize.value)
    .limit(pageSize.value)
    .toArray();
};

/**
 * 清理数据
 */
const clearData = async () => {
  const res = await ElMessageBox.confirm('是否确认清理数据？', { confirmButtonText: '确认', cancelButtonText: '取消' })
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
  if (!res) return;
  db.order_store.where('end_at').notEqual(-1).delete();
  total.value = await db.order_store.count(); // 获取总数
  page.value = 1; // 当前页码
  getTableData(); // 获取数据
};

/**
 * 格式化显示
 */
import { defaultTables } from '@/assets/constant'; // 桌台列表
const filterTableName = (id: string | number) => {
  const _name = defaultTables.find((item) => item.id == id)?.name;
  return _name;
};
import { useDateFormat } from '@vueuse/core'; // 时间格式化
const filterEndAt = (time: number) => {
  if (time == -1) return '未结束';
  return useDateFormat(time, 'YYYY-MM-DD HH:mm:ss').value;
};

/**
 * 查看订单、打印订单
 */
import Bill from '@/component/bill.vue';
import type { Order } from '@/assets/type.ts'; // Order类型
const isShowBill = ref(false); // 是否预览打印
const defaultOrder = ref<Order>(); // 打印的订单信息
// 打印设置
const printObj: any = ref({
  id: 'printBill', // 打印标签的ID
  // 关闭打印的回调
  closeCallback() {
    isShowBill.value = false;
    defaultOrder.value = undefined;
  },
});
// 查看订单
const readOrder = (order: Order) => {
  defaultOrder.value = order;
  isShowBill.value = true;
};

/**
 * 删除订单
 */
const deleteOrder = (order: any) => {
  db.order_store.delete(order.id);
  getTableData(); // 获取数据
};
</script>
