import Dexie, { Table } from "dexie";
import { Order, Goods } from "@/assets/type.ts";

const dbName = "app_db"; // 数据库名称

export class appDB extends Dexie {
  order_store!: Table<Order>;
  goods_store!: Table<Goods>;

  constructor() {
    super(dbName);
    this.version(1).stores({
      order_store: "++id, table_id",
      goods_store: "++id, type_id",
    });
  }
}

export const db = new appDB();
