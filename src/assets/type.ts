// 订单类型
export interface Order {
  id: string; // 订单id(时间戳+桌台id)
  table_id: number; // 桌台id
  start_at: number; // 开始时间
  end_at?: number; // 结束时间
  goods_list?: Order_Goods[]; // 商品列表
  price?: number; // 价格
}

// 商品列表
export interface Goods {
  name: string; // 名称
  type_id: number | string; // 商品类型id
  price: number; // 单价
}

// 订单中已购商品的类型
export interface Order_Goods {
  goods_id: number | string; // 商品id
  number: number; // 数量
}
