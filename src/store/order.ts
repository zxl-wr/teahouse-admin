import { defineStore } from 'pinia';
import type { Order } from '@/assets/type';

// 优先查看缓存里的订单
const localOrder: string = localStorage.getItem('app_current_order_list') || '[]';
const _arr: Order[] = JSON.parse(localOrder);

// 存入缓存
function setLocalStorage(value: Order[]) {
  const _str: string = JSON.stringify(value); // 转化为字符串
  localStorage.setItem('app_current_order_list', _str); // 存入缓存
}

export const useOrderStore = defineStore('app_current_order_list', () => {
  const currentOrderList = ref<Order[]>(_arr); // 当前订单

  // 新增订单
  function addOrder(order: Order) {
    currentOrderList.value.push(order);
    setLocalStorage(currentOrderList.value);
  }

  // 结束订单
  function endOrder(tableId: number | undefined) {
    if (tableId != 0 && !tableId) return; // 没有该桌台
    currentOrderList.value = currentOrderList.value.filter((item) => item.table_id != tableId); // 过滤出该桌台的订单
    setLocalStorage(currentOrderList.value);
  }

  return { currentOrderList, addOrder, endOrder };
});
