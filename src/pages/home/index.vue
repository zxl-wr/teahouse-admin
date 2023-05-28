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
        <div class="mb-8 text-8 text-center c-#f4516c">￥200</div>
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
  <el-dialog v-model="isShowTransfer" title="新增消费" width="900" align-center :close-on-click-modal="false"
    :close-on-press-escape="false">
    <el-select class="mb-4" v-model="currentGoodsTypeId" placeholder="请选择类型">
      <el-option v-for="item in goodsType.filter((i) => i.id >= 0)" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>
    <div class="flex-row">
      <el-table :data="goodsList" style="width: 50%" height="400" border @selection-change="changeSelection">
        <el-table-column type="selection" width="40" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="price" label="价格" />
      </el-table>
      <el-button class="mx-2" type="primary" @click="addGoods"> 新增 > </el-button>
      <el-table :data="newGoods" style="width: 50%" height="400" border stripe>
        <el-table-column prop="name" label="新增消费" />
        <el-table-column prop="price" label="单价" />
        <el-table-column prop="number" label="数量" />
      </el-table>
    </div>
  </el-dialog>
  <!-- 结算弹窗 -->
  <el-dialog v-model="isShowDialog" title="结账">
    <el-table :data="goodsData" max-height="300">
      <el-table-column prop="name" label="名称" align="center" />
      <el-table-column prop="price" label="单价" align="center" />
      <el-table-column prop="number" label="数量" align="center" />
      <el-table-column label="总计" align="center">
        <template #default="scope">
          {{ scope.row.price * scope.row.number }}
        </template>
      </el-table-column>
    </el-table>
    <div class="mx-8 text-8 text-end c-#f4516c">￥200</div>
    <template #footer>
      <el-button @click="isShowDialog = false">取消</el-button>
      <el-button type="danger" @click="clickEndOrder">确定</el-button>
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
    return item.table_id;
  })
); //  当前订单中的桌台id数组
// 分别已开台和未开台的桌台
const filterTableImg = (id: number) => {
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
const currentOrder = ref<Order | undefined>(); // 当前订单
const { addOrder } = orderStore; // 新增订单
const { timestamp, pause, resume } = useTimestamp({ controls: true }); // 当前时间戳
pause(); // 先暂停当前时间计时
let start_at = ref(); // 订单开始时间格式化
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
    addOrder({ id: _orderId, table_id: tableId, start_at: _timestamp });
  }
  resume(); // 开始当前时间计时
  currentOrder.value = currentOrderList.value.find((item) => item.table_id == tableId); // 当前订单
  if (!currentOrder.value) return;
  start_at = useDateFormat(currentOrder.value.start_at, 'YYYY-MM-DD HH:mm:ss'); // 订单开始时间格式化
  isShowDawer.value = true; // 打开消费详情抽屉
};
// 关闭消费详情抽屉
const handleDawerClose = (done: () => void) => {
  pause(); // 暂停当前时间计时
  done();
};
// 计算差值
import { timestampDiffer } from '@/utils/format.ts';
const differ = ref<string>();
watch(timestamp, (newValue) => {
  if (!currentOrder.value) {
    differ.value = '0';
    return;
  }
  differ.value = timestampDiffer(currentOrder.value.start_at, newValue);
});

/**
 * 消费功能
 */
import { goodsType } from '@/assets/constant.ts';// 商品类型
import { db } from '@/utils/indexDB.ts';// 数据库
import { Goods, Order_Goods } from "@/assets/type.ts";
const isShowTransfer = ref(false); // 是否打开新增消费穿梭框
const currentGoodsTypeId = ref(); // 当前商品类型id
const goodsList = ref<Goods[]>([]); // 当前类型中的商品列表
const selectedGoods = ref<Goods[]>([]); // 选中但未新增的商品
const newGoods = ref<Order_Goods[]>([]); // 新增的商品
const goodsData = ref<Order_Goods[]>([]); // 消费的商品
// 监听开关，重置数据
watch(isShowTransfer, (newValue) => {
  currentGoodsTypeId.value = '';
  if (newValue) newGoods.value = goodsData.value;
})
// 监听类型切换，获取数据
watch(currentGoodsTypeId, async (newValue) => {
  if (newValue == -1) goodsList.value = [];
  else {
    const res = await db.goods_store.where({ type_id: newValue }).toArray();
    const _ids = newGoods.value.map(item => { return item.goods_id })
    goodsList.value = res.filter(item => _ids.indexOf(item?.id) == -1)
  }
});
// 选择商品
const changeSelection = (e: Goods[]) => {
  selectedGoods.value = e;
}
// 新增商品
const addGoods = () => {
  for (const item of selectedGoods.value) {
    newGoods.value.push({ goods_id: item.id, number: 1 })
  }
  currentGoodsTypeId.value = '';
};

/**
 * 结算功能
 */
const isShowDialog = ref(false);
const { endOrder } = orderStore;
// 结算
const clickEndOrder = () => {
  isShowDawer.value = false;
  endOrder(currentOrder.value?.table_id);
  isShowDialog.value = false;
};
</script>
