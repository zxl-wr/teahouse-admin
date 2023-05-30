// 订单类型
export interface Order {
  id: string; // 订单id(时间戳+桌台id)
  table_id: number; // 桌台id
  start_at: number; // 开始时间
  end_at: number; // 结束时间
  goods_list?: Order_Goods[]; // 商品列表
  price?: number; // 价格
}

// 商品列表
export interface Goods {
  id?: string | number; // 商品id
  name: string; // 名称
  type_id: number | string; // 商品类型id
  price: number; // 单价
}

// 订单中已购商品的类型
export interface Order_Goods {
  name: string; // 名称
  price: number; // 价格
  number: number; // 数量
  time_at: number; // 时间
}

// 收费格式
export interface Charge {
  district: number[]; // 时间区间
  type: number; // 收费类型：0（区间收费）/1（按时收费/小时）
  price: number; // 金额
}
