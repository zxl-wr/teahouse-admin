<template>
  <!-- 没有订单的桌台 -->
  <div class="flex">
    <div class="card m-2 flex-column-between" v-for="table in currentNoOrderList" :key="table.id"
      @dblclick="clickTable(table.id)">
      <div class="text-5 my-2">{{ table.name }}</div>
      <img class="w-120px" src="@/assets/img/img-close.png" alt="桌台图片" />
    </div>
  </div>
  <hr />
  <!-- 有订单的桌台 -->
  <div class="flex">
    <div class="card m-2 flex" v-for="order in currentOrderList" :key="order.table_id">
      <div class="flex-column-between">
        <div class="text-5 my-2">{{ getTableName(order.table_id) }}</div>
        <img class="w-120px" src="@/assets/img/img-open.png" alt="桌台图片" />
      </div>
      <div class="mx-2 my-2 flex-column-between">
        <div class="text-6">{{ useDateFormat(order.start_at, 'YYYY-MM-DD HH:mm:ss').value }}</div>
        <div class="text-8 text-center"> {{ timestampDiffer(order.start_at, timestamp) }} </div>
        <div class="w-100% flex-row-between">
          <el-button class="w-40%" type="primary" size="large" @click="onShowTransfer(order)"> 消费 </el-button>
          <el-button class="w-40%" type="danger" size="large" @click="onShowBill(order)"> 结算 </el-button>
        </div>
      </div>
    </div>
  </div>
  <!-- 新增消费 -->
  <el-dialog style="width: fit-content" v-model="isShowTransfer" :title="getTableName(currentOrder.table_id)" top="0"
    v-if="currentOrder">
    <!-- 商品类型选择 -->
    <el-select class="mb-4" v-model="currentGoodsTypeId" placeholder="请选择类型">
      <el-option v-for="item in goodsType" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>
    <!-- 商品列表 -->
    <div class="flex">
      <div class="w-300px h-400px overflow-auto">
        <div class="flex-row-between card m-1 p-2" v-for="goods in currentGoodsList" :key="goods.id"
          @dblclick="addGoods(goods)">
          <span>{{ goods.name }}</span>
          <span>￥{{ goods.price }}</span>
        </div>
      </div>
      <el-table class="!w-500px" :data="currentOrder.goods_list" border>
        <el-table-column prop="name" label="已购商品" />
        <el-table-column prop="price" label="单价" width="60" />
        <el-table-column prop="number" label="数量" width="60" />
        <el-table-column label="时间">
          <template #default="scope">
            {{ useDateFormat(scope.row.time_at, 'MM-DD HH:mm:ss').value }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button type="danger" @click="deleteOrderGoods(scope.row)" v-if="scope.row.name != '开台费'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
  <!-- 结算、打印预览 -->
  <el-dialog style="width: fit-content" v-model="isShowBill" title="结账" v-if="currentOrder">
    <Bill id="printBill" :defaultOrder="currentOrder"></Bill>
    <template #footer>
      <el-button type="danger" v-print="printObj" @click="printBill(currentOrder)">结账打印</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
/**
 * 获取当前订单列表
 */
import type { Order } from '@/assets/type.ts'; // Order类型
import { db } from '@/utils/indexDB.ts'; // 数据库
import { defaultTables } from '@/assets/constant.ts'; // 默认桌台
const currentOrderList = ref<Order[]>([]); // 当前订单列表
// 获取当前订单列表
const getCurrentOrderList = async () => {
  currentOrderList.value = await db.order_store.where({ end_at: -1 }).toArray();
};
onMounted(() => getCurrentOrderList()); // 初始当前订单列表
// 获取没有订单的桌台
const currentNoOrderList = computed(() => {
  const currentOrderTableIdList = currentOrderList.value.map((item) => item.table_id);
  return defaultTables.filter(item => !currentOrderTableIdList.includes(item.id));
});
// 获取桌台名称
const getTableName = (id: number) => {
  return defaultTables.find(item => item.id == id)?.name
}

/**
 * 开台功能
 */
const clickTable = async (tableId: number) => {
  const _timestamp = new Date().getTime(); // 开始时间
  const _orderId = _timestamp + '00' + tableId; // 订单id
  const _tableItem = { name: '开台费', price: 0, number: 1, time_at: _timestamp }; // 默认开台费用
  await db.order_store.add({ id: _orderId, table_id: tableId, start_at: _timestamp, end_at: -1, goods_list: [_tableItem] }); // 数据库新增数据
  await getCurrentOrderList(); // 获取当前订单列表
};

/**
 * 计时功能
 */
import { useDateFormat, useTimestamp } from '@vueuse/core'; // 时间格式化，当前时间戳
import { timestampDiffer } from '@/utils/format.ts'; // 时间戳相差
const timestamp = useTimestamp({ offset: 0 });

/**
 * 开台计算收费
 */
import { storeToRefs } from 'pinia';
import { useChargeStore } from '@/store/charge.ts';
const { chargeRatesArray } = storeToRefs(useChargeStore()); // 收费标准
// 获取订单开台金额
const getCurrentTablePrice = (order: Order) => {
  const time: string = timestampDiffer(order.start_at, timestamp.value);
  const _time: number = parseInt(time.slice(0, 2));
  if (_time >= 24) return chargeRatesArray.value[23];
  else return chargeRatesArray.value[_time];
}
// 获取订单总金额
const getCurrentOrderPrice = (order: Order) => {
  let _num = 0;
  order.goods_list.forEach((item) => (_num += item.price));
  return _num;
};

/**
 * 消费功能
 */
const currentOrder = ref<Order>(); // 当前订单
const isShowTransfer = ref(false); // 是否打开新增消费穿梭框
// 显示消费穿梭框
const onShowTransfer = (order: Order) => {
  order = toRaw(order);
  order.goods_list[0].price = getCurrentTablePrice(order); // 开台费
  order.price = getCurrentOrderPrice(order); // 总金额
  currentOrder.value = order;
  isShowTransfer.value = true;
}
import type { Goods, Order_Goods } from '@/assets/type.ts'; // 商品类型，订单中商品类型
import { goodsType } from '@/assets/constant.ts'; // 默认商品类型
const currentGoodsTypeId = ref<number>(-1); // 当前商品类型id
const currentGoodsList = ref<Goods[]>(); // 当前类型中的商品列表
// 监听商品类型切换，获取商品数据
watch(currentGoodsTypeId, async (newValue) => {
  if (newValue == -1) currentGoodsList.value = [];
  else currentGoodsList.value = await db.goods_store.where({ type_id: newValue }).toArray();
});
// 新增商品
const addGoods = (goods: Goods) => {
  if (!currentOrder.value) return;
  goods = toRaw(goods);
  const _goods: Order_Goods = {
    name: goods.name,
    price: goods.price,
    number: 1,
    time_at: timestamp.value,
  }
  currentOrder.value.goods_list.push(_goods);
};
// 删除消费
const deleteOrderGoods = async (goods: Order_Goods) => {
  if (!currentOrder.value) return;
  currentOrder.value.goods_list = currentOrder.value.goods_list.filter(item => item != goods)
};
// 监听消费穿梭框显隐，
watch(isShowTransfer, async (newValue) => {
  console.log(newValue);
  if (newValue == true) return;
  else {
    currentOrder.value = undefined;
    currentGoodsTypeId.value = -1;
  }
});
// // 更新订单
// const updateOrder = async () => {
//   const _currentOrder = await db.order_store.get({ id: currentOrder.value?.id });
//   if (!_currentOrder) return;
//   newGoods.value.forEach((item) => _currentOrder.goods_list.push({ ...item }));
//   db.order_store
//     .update(_currentOrder.id, _currentOrder)
//     .then(() => {
//       currentOrder.value = _currentOrder;
//       getCurrentOrderList();
//     })
//     .catch((error) => console.log(error));
//   isShowTransfer.value = false;
// };

/**
 * 结算打印功能
 */
import Bill from '@/component/bill.vue';
const isShowBill = ref(false);
// 打印设置
const printObj: any = ref({
  id: 'printBill', // 打印标签的ID
  // 关闭打印的回调,重置订单
  closeCallback() {
    currentOrder.value = undefined;
    isShowBill.value = false;
  },
});
// 结账显示弹窗
const onShowBill = (order: Order) => {
  order = toRaw(order);
  order.goods_list[0].price = getCurrentTablePrice(order); // 开台费
  order.price = getCurrentOrderPrice(order); // 总金额
  order.end_at = timestamp.value; // 结束时间
  currentOrder.value = order;
  isShowBill.value = true;
}
// 确定结账打印
const printBill = (order: Order) => {
  order = toRaw(order)
  // 更新数据库
  db.order_store
    .update(order.id, order)
    .then(() => { getCurrentOrderList(); })
    .catch((error) => console.log(error));
}
</script>
