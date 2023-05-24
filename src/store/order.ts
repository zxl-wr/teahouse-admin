import { defineStore } from 'pinia';
import type { Order } from '@/assets/type';

// 优先查看缓存里的订单
const localOrder: string = localStorage.getItem('order') || '[]';
const _arr: Order[] = JSON.parse(localOrder);

// 存入缓存
function setLocalStorage(value: Order[]) {
  const _str: string = JSON.stringify(value); // 转化为字符串
  localStorage.setItem('order', _str); // 存入缓存
}

export const useOrderStore = defineStore('order', () => {
  const currentOrderList = ref<Order[]>(_arr); // 当前订单

  // 新增订单
  function addOrder(order: Order) {
    currentOrderList.value.push(order);
    setLocalStorage(currentOrderList.value);
  }

  // 结束订单
  function endOrder(tableId: string | number) {
    currentOrderList.value = currentOrderList.value.filter((item) => item.tableId != tableId); // 过滤出该桌台的订单
    console.log(currentOrderList.value);
    
    setLocalStorage(currentOrderList.value);
  }

  return { currentOrderList, addOrder, endOrder };
});
