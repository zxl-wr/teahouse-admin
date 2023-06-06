import { defineStore } from "pinia";

interface Business {
  name: string; // 名称
  phone: string; // 电话
  address: string; // 地址
  width: number; // 打印宽度
}

// 默认商家
const defineBusiness: Business = {
  name: "天运茶楼",
  phone: "0551-65181929",
  address: "合肥市蜀山区金牛路颐和小学南200米",
  width: 400,
};

// 优先查看缓存里的商家
let _localChargeRates: any = localStorage.getItem("app_setting_business") || "";
if (!_localChargeRates) _localChargeRates = defineBusiness;
else _localChargeRates = JSON.parse(_localChargeRates);

// 存入缓存
function setLocalStorage(value: Business) {
  const _str: string = JSON.stringify(value); // 转化为字符串
  localStorage.setItem("app_setting_business", _str); // 存入缓存
}

export const useBusinessStore = defineStore("app_setting_business", () => {
  const business = ref<Business>(_localChargeRates); // 商家信息

  // 更新商家信息
  function updateBusiness(date: Business) {
    business.value = date;
    setLocalStorage(date);
  }

  return { business, updateBusiness };
});
