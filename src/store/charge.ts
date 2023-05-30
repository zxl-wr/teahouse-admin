import { defineStore } from 'pinia';
import { Charge } from '@/assets/type';

// 默认收费标准
const defineChargeRates = [
  { district: [0, 6], type: 0, price: 100 },
  { district: [6, 12], type: 1, price: 10 },
  { district: [12, 24], type: 0, price: 200 },
];

// 优先查看缓存里的订单
let localChargeRates: Charge[];
const _localChargeRates: string = localStorage.getItem('app_setting_charge') || '';
if (!_localChargeRates) localChargeRates = defineChargeRates;
else localChargeRates = JSON.parse(_localChargeRates);

// 存入缓存
function setLocalStorage(value: Charge[]) {
  const _str: string = JSON.stringify(value); // 转化为字符串
  localStorage.setItem('app_setting_charge', _str); // 存入缓存
}

export const useChargeStore = defineStore('app_setting_charge', () => {
  const chargeRates = ref<Charge[]>(localChargeRates); // 收费标准

  // 更新收费标准
  function updateChargeRates(date: Charge[]) {
    chargeRates.value = date;
    setLocalStorage(date);
  }

  return { chargeRates, updateChargeRates };
});
