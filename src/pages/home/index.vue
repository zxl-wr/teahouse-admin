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
        <div class="text-5 my-2">{{ defaultTables.find(item => item.id == order.table_id)?.name }}</div>
        <img class="w-120px" src="@/assets/img/img-open.png" alt="桌台图片" />
      </div>
      <div class="mx-2 my-2 flex-column-between">
        <div class="text-6">{{ useDateFormat(order.start_at, 'YYYY-MM-DD HH:mm:ss').value }}</div>
        <div class="text-8 text-center"> {{ timestampDiffer(order.start_at, timestamp) }} </div>
        <div class="w-100% flex-row-between">
          <el-button class="w-40%" type="primary" size="large" @click="onAddGoods(order)"> 消费 </el-button>
          <el-button class="w-40%" type="danger" size="large" @click="onEndOrder(order)"> 结算 </el-button>
        </div>
      </div>
    </div>
  </div>
  <!-- 新增消费 -->
  <el-dialog v-model="isShowTransfer" title="新增消费" width="900" align-center :show-close="false"
    :close-on-click-modal="false" :close-on-press-escape="false">
    <el-select class="mb-4" v-model="currentGoodsTypeId" placeholder="请选择类型">
      <el-option v-for="item in goodsType.filter((i) => i.id >= 0)" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>
    <div class="flex-row">
      <el-table :data="currentGoodsList" style="width: 40%" height="400" border @selection-change="changeSelection"
        empty-text="暂无商品">
        <el-table-column type="selection" width="40" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="price" label="价格" />
      </el-table>
      <el-button class="mx-2" type="primary" @click="addGoods">
        新增 >
      </el-button>
      <el-table :data="newGoods" style="width: 60%" height="400" border stripe empty-text="暂无消费">
        <el-table-column prop="name" label="新增消费" />
        <el-table-column prop="price" label="单价" />
        <el-table-column prop="number" label="数量" />
        <el-table-column prop="time_at" label="时间">
          <template #default="scope">
            {{ useDateFormat(scope.row.time_at, 'MM-DD HH:mm').value }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template #footer>
      <el-button @click="isShowTransfer = false">取消</el-button>
      <el-button type="primary" @click="updateOrder">确定</el-button>
    </template>
  </el-dialog>
  <!-- 结算弹窗 -->
  <el-dialog v-model="isShowDialog" title="结账">
    <el-table :data="currentOrder?.goods_list" max-height="300" empty-text="没有额外消费">
      <el-table-column prop="name" label="名称" align="center" />
      <el-table-column prop="price" label="单价" align="center" />
      <el-table-column prop="number" label="数量" align="center" />
      <el-table-column label="总计" align="center">
        <template #default="scope">
          {{ scope.row.price * scope.row.number }}
        </template>
      </el-table-column>
    </el-table>
    <div class="mx-8 text-8 text-end c-#f4516c">
      ￥{{ currentOrderPrice }}
      <span class="text-4">(开台费：￥{{ currentTablePrice }})</span>
    </div>
    <template #footer>
      <el-button @click="isShowDialog = false">取消</el-button>
      <el-button type="danger" @click="clickEndOrder">确定</el-button>
    </template>
  </el-dialog>
  <!-- 打印预览 -->
  <el-dialog style="width: fit-content" v-model="isShowBill" title="打印预览">
    <Bill id="printBill" :defaultOrder="defaultOrder" v-if="defaultOrder"></Bill>
    <template #footer>
      <el-button type="danger" v-print="printObj">打印</el-button>
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

const currentOrder = ref<Order>(); // 当前订单
/**
 * 计时功能
 */
import { useDateFormat, useTimestamp } from '@vueuse/core'; // 时间格式化，当前时间戳
import { timestampDiffer } from '@/utils/format.ts'; // 时间戳相差
const timestamp = useTimestamp({ offset: 0 });

const onAddGoods = (order: Order) => { }
const onEndOrder = (order: Order) => { }

/**
 * 开台计算收费
 */
import { storeToRefs } from 'pinia';
import { useChargeStore } from '@/store/charge.ts';
const { chargeRates } = storeToRefs(useChargeStore()); // 收费标准
// 整理开台时间对应的金额
let chargeRatesArray: number[] = [];
for (let i = 0; i < chargeRates.value.length; i++) {
  const item = chargeRates.value[i];
  for (let j = item.district[0]; j < item.district[1]; j++) {
    if (item.type == 0) chargeRatesArray[j] = item.price;
    else if (j - 1 < 0) chargeRatesArray[j] = item.price;
    else chargeRatesArray[j] = chargeRatesArray[j - 1] + item.price;
  }
}
// 更新到数据库
// watch(timestamp, async () => {
//   if (!currentOrder.value) return; // 当前没有订单，返回
//   if (currentOrder.value.goods_list[0].price == currentTablePrice.value) return; // 价格没变化，返回
//   currentOrder.value.goods_list[0].price = currentTablePrice.value; // 变更价格
//   // 更新数据库
//   db.order_store
//     .update(currentOrder.value.id, toRaw(currentOrder.value))
//     .then(() => {
//       getCurrentOrderList(); // 重新获取未关闭订单
//     })
//     .catch((error) => console.log(error));
// });

/**
 * 消费功能
 */
import type { Goods, Order_Goods } from '@/assets/type.ts'; // 商品类型，订单中商品类型
import { goodsType } from '@/assets/constant.ts'; // 默认商品类型
const isShowTransfer = ref(false); // 是否打开新增消费穿梭框
const currentGoodsTypeId = ref<number>(); // 当前商品类型id
const currentGoodsList = ref<Goods[]>(); // 当前类型中的商品列表
const selectedGoods = ref<Goods[]>(); // 选中但未新增的商品
const newGoods = ref<Order_Goods[]>([]); // 新增的商品
// 监听开关，重置数据
watch(isShowTransfer, () => {
  currentGoodsTypeId.value = undefined;
  newGoods.value = [];
});
// 监听类型切换，获取数据
watch(currentGoodsTypeId, async (newValue) => {
  if (typeof newValue != 'number') currentGoodsList.value = [];
  else currentGoodsList.value = await db.goods_store.where({ type_id: newValue }).toArray();
});
// 选择商品
const changeSelection = (e: Goods[]) => {
  let _arr: Goods[] | undefined = [];
  e.forEach((item) => _arr?.push({ ...item }));
  selectedGoods.value = _arr;
};
// 新增商品
const addGoods = () => {
  if (!selectedGoods.value) return;
  for (const item of selectedGoods.value) {
    newGoods.value.push({
      name: item.name,
      price: item.price,
      number: 1,
      time_at: timestamp.value,
    });
  }
  currentGoodsTypeId.value = undefined;
};
// 更新订单
const updateOrder = async () => {
  const _currentOrder = await db.order_store.get({ id: currentOrder.value?.id });
  if (!_currentOrder) return;
  newGoods.value.forEach((item) => _currentOrder.goods_list.push({ ...item }));
  db.order_store
    .update(_currentOrder.id, _currentOrder)
    .then(() => {
      currentOrder.value = _currentOrder;
      getCurrentOrderList();
    })
    .catch((error) => console.log(error));
  isShowTransfer.value = false;
};
// 删除消费
// const deleteOrderGoods = async (e: Order_Goods) => {
//   const _currentOrder = await db.order_store.get({ id: currentOrder.value?.id });
//   if (!_currentOrder?.goods_list) return;
//   const _i = getIndexInArr(_currentOrder.goods_list, { ...e });
//   _currentOrder.goods_list.splice(_i, 1);
//   db.order_store
//     .update(_currentOrder.id, _currentOrder)
//     .then(() => {
//       currentOrder.value = _currentOrder;
//       getCurrentOrderList();
//     })
//     .catch((error) => console.log(error));
// };
//从数组中获取对象的索引
// const getIndexInArr = (_arr: object[], _obj: object) => {
//   for (var i = 0; i < _arr.length; i++) {
//     if (JSON.stringify(_arr[i]) == JSON.stringify(_obj)) {
//       return i;
//     }
//   }
//   return -1;
// };

/**
 * 统计收费
 */
const currentOrderPrice = computed(() => {
  let _num = 0;
  currentOrder.value?.goods_list.forEach((item) => (_num += item.price));
  return _num;
});

/**
 * 结算功能
 */
const isShowDialog = ref(false);
// 结算
const clickEndOrder = async () => {
  const _currentOrder = await db.order_store.get({ id: currentOrder.value?.id }); // 获取订单
  if (!_currentOrder) return;
  _currentOrder.end_at = new Date().getTime(); // 添加结束时间
  _currentOrder.price = currentOrderPrice.value; // 添加总金额
  // 更新数据库
  db.order_store
    .update(_currentOrder.id, _currentOrder)
    .then(() => {
      getCurrentOrderList(); // 刷新页面，重新获取当前订单
      isShowDialog.value = false; // 关闭结算弹窗
      printBill(_currentOrder); // 打印订单
    })
    .catch((error) => console.log(error));
};

/**
 * 打印小票
 */
import Bill from '@/component/bill.vue';
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
// 打印订单
const printBill = (order: Order) => {
  defaultOrder.value = order;
  isShowBill.value = true;
};
</script>
