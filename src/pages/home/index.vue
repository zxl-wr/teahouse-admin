<template>
  <!-- 桌台 -->
  <div class="h-auto">
    <div class="card m-2 text-center" v-for="table in defaultTables" :key="table.id" @click="clickTable(table.id)">
      <div class="text-5 my-2">{{ table.name }}</div>
      <img class="w-120px" :src="filterTableImg(table.id)" alt="桌台图片" />
    </div>
  </div>
  <!-- 消详情抽屉 -->
  <el-drawer v-model="isShowDawer" direction="btt" size="300px" :with-header="false">
    <div class="flex-row-between">
      <el-table style="width: 620px" :data="currentOrder?.goods_list" height="260" table-layout="auto" empty-text="暂无消费">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="price" label="价格" />
        <el-table-column prop="number" label="数量" />
        <el-table-column prop="time_at" label="消费时间">
          <template #default="scope">
            {{ useDateFormat(scope.row.time_at, 'MM-DD HH:mm').value }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="danger" @click="deleteOrderGoods(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="w-500px h-260px" v-if="currentOrder">
        <div class="text-6">开始时间：{{ useDateFormat(currentOrder.start_at, 'YYYY-MM-DD HH:mm:ss').value }}</div>
        <div class="mt-8 text-12 text-center">{{ differ }}</div>
        <div class="mb-8 text-8 text-center c-#f4516c">￥{{ currentOrderPrice }}</div>
        <el-button class="float-right !w-120px !h-48px !text-5" type="danger" size="large" @click="isShowDialog = true">
          结算
        </el-button>
        <el-button class="float-right mx-4 !w-120px !h-48px !text-5" type="primary" size="large"
          @click="isShowTransfer = true">
          + 消费
        </el-button>
      </div>
    </div>
  </el-drawer>
  <!-- 新增消费 -->
  <el-dialog v-model="isShowTransfer" title="新增消费" width="900" align-center :show-close="false"
    :close-on-click-modal="false" :close-on-press-escape="false">
    <el-select class="mb-4" v-model="currentGoodsTypeId" placeholder="请选择类型">
      <el-option v-for="item in goodsType.filter((i) => i.id >= 0)" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>
    <div class="flex-row">
      <el-table :data="currentGoodsList" style="width: 40%" height="400" border @selection-change="changeSelection">
        <el-table-column type="selection" width="40" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="price" label="价格" />
      </el-table>
      <el-button class="mx-2" type="primary" @click="addGoods"> 新增 > </el-button>
      <el-table :data="newGoods" style="width: 60%" height="400" border stripe>
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
    <el-table :data="currentOrder?.goods_list" max-height="300">
      <el-table-column prop="name" label="名称" align="center" />
      <el-table-column prop="price" label="单价" align="center" />
      <el-table-column prop="number" label="数量" align="center" />
      <el-table-column label="总计" align="center">
        <template #default="scope">
          {{ scope.row.price * scope.row.number }}
        </template>
      </el-table-column>
    </el-table>
    <div class="mx-8 text-8 text-end c-#f4516c">￥{{ currentOrderPrice }}</div>
    <template #footer>
      <el-button @click="isShowDialog = false">取消</el-button>
      <el-button type="danger" @click="clickEndOrder">确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
/**
 * 渲染桌台,获取未关闭的订单
 */
import { db } from '@/utils/indexDB.ts';// 数据库
import type { Order } from '@/assets/type.ts';
import { defaultTables } from '@/assets/constant.ts';
import img_close from '@/assets/img/img-close.png';
import img_open from '@/assets/img/img-open.png';
const currentOrderList = ref<Order[]>([]); // 当前订单
const tableIdList = computed(() => currentOrderList.value.map((item) => { return item.table_id })); //  当前订单中的桌台id数组
// 过滤出已开台和未开台的桌台，分别渲染图片
const filterTableImg = (id: number) => {
  if (currentOrderList.value.length < 1 || tableIdList.value.indexOf(id) == -1) return img_close; // 当前没有订单 或者 该桌台没有订单
  else return img_open;
};
// 获取未关闭的订单
const getCurrentOrderList = async () => {
  currentOrderList.value = await db.order_store.where({ end_at: -1 }).toArray();
}
onMounted(() => { getCurrentOrderList() })

/**
 * 开台功能
 */
const isShowDawer = ref(false); // 是否打开消费详情抽屉
const currentOrder = ref<Order>(); // 当前订单
// 判断是已有订单还是新增订单
const clickTable = async (tableId: number) => {
  // 没有开台去新增订单
  if (tableIdList.value.indexOf(tableId) == -1) {
    const res = await ElMessageBox.confirm('是否确认开台？', { confirmButtonText: '确认', cancelButtonText: '取消' }).catch(() => {
      return 'cancel';
    });
    if (res == 'cancel') return;
    const _timestamp = new Date().getTime(); // 开始时间
    const _orderId = _timestamp + '-' + tableId; // 订单id    
    await db.order_store.add({ id: _orderId, table_id: tableId, start_at: _timestamp, end_at: -1 });
    await getCurrentOrderList();
  }
  currentOrder.value = currentOrderList.value.find((item) => item.table_id == tableId); // 当前订单
  isShowDawer.value = true; // 打开消费详情抽屉
};

/**
 * 计时功能
 */
import { useDateFormat, useTimestamp } from '@vueuse/core';
import { timestampDiffer } from '@/utils/format.ts';
const { timestamp, pause, resume } = useTimestamp({ controls: true }); // 当前时间戳
pause(); // 初始化暂停当前时间计时
// 监听订单详情抽屉打开状态
watch(isShowDawer, (newValue) => {
  if (newValue) resume(); // 开始当前时间计时
  else pause(); // 暂停当前时间计时
})
// 计算差值
const differ = ref<string>();
watch(timestamp, (newValue) => {
  if (!currentOrder.value) differ.value = '0';
  else differ.value = timestampDiffer(currentOrder.value.start_at, newValue);
});

/**
 * 消费功能
 */
import type { Goods, Order_Goods } from "@/assets/type.ts";
import { goodsType } from '@/assets/constant.ts';
const isShowTransfer = ref(false); // 是否打开新增消费穿梭框
const currentGoodsTypeId = ref<number>(); // 当前商品类型id
const currentGoodsList = ref<Goods[]>(); // 当前类型中的商品列表
const selectedGoods = ref<Goods[]>(); // 选中但未新增的商品
const newGoods = ref<Order_Goods[]>([]); // 新增的商品
// 监听开关，重置数据
watch(isShowTransfer, () => {
  currentGoodsTypeId.value = undefined;
  newGoods.value = [];
})
// 监听类型切换，获取数据
watch(currentGoodsTypeId, async (newValue) => {
  if (typeof newValue != 'number') currentGoodsList.value = [];
  else currentGoodsList.value = await db.goods_store.where({ type_id: newValue }).toArray();
});
// 选择商品
const changeSelection = (e: Goods[]) => {
  let _arr: Goods[] | undefined = []
  e.forEach(item => _arr?.push({ ...item }));
  selectedGoods.value = _arr;
}
// 新增商品
const addGoods = () => {
  if (!selectedGoods.value) return;
  for (const item of selectedGoods.value) {
    newGoods.value.push({
      name: item.name, price: item.price, number: 1, time_at: timestamp.value,
    })
  }
  currentGoodsTypeId.value = undefined
};
// 更新订单
const updateOrder = async () => {
  const _currentOrder = await db.order_store.get({ id: currentOrder.value?.id });
  if (!_currentOrder) return;
  if (!_currentOrder.goods_list) _currentOrder.goods_list = [];
  newGoods.value.forEach(item => _currentOrder.goods_list?.push({ ...item }))
  db.order_store.update(_currentOrder.id, _currentOrder)
    .then(() => {
      currentOrder.value = _currentOrder;
      getCurrentOrderList()
    })
    .catch(error => console.log(error)
    );
  isShowTransfer.value = false
}
// 删除消费
const deleteOrderGoods = async (e: Order_Goods) => {
  const _currentOrder = await db.order_store.get({ id: currentOrder.value?.id });
  if (!_currentOrder?.goods_list) return;
  const _i = getIndexInArr(_currentOrder.goods_list, { ...e });
  _currentOrder.goods_list.splice(_i, 1);
  db.order_store.update(_currentOrder.id, _currentOrder)
    .then(() => {
      currentOrder.value = _currentOrder;
      getCurrentOrderList()
    })
    .catch(error => console.log(error)
    );

}
//从数组中获取对象的索引
const getIndexInArr = (_arr: object[], _obj: object) => {
  for (var i = 0; i < _arr.length; i++) {
    if (JSON.stringify(_arr[i]) == JSON.stringify(_obj)) {
      return i;
    }
  }
  return -1;
};

/**
 * 结算功能
 */
const isShowDialog = ref(false);
// 结算
const clickEndOrder = async () => {
  const _timestamp = new Date().getTime(); // 结束时间
  const _currentOrder = await db.order_store.get({ id: currentOrder.value?.id });
  if (!_currentOrder) return;
  _currentOrder.end_at = _timestamp;
  db.order_store.update(_currentOrder.id, _currentOrder)
    .then(() => {
      getCurrentOrderList()
      isShowDialog.value = false;
      isShowDawer.value = false;
    })
    .catch(error => console.log(error)
    );

};

/**
 * 统计收费
 */
const currentOrderPrice = computed(() => {
  let _num = 0;
  currentOrder.value?.goods_list?.forEach(item => _num += item.price)
  return _num;
})

</script>
