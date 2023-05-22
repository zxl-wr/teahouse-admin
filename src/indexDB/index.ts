/**
 * 打开数据库
 * @param dbName 数据库名称
 * @returns 数据库实例
 */
export const openDB = (dbName: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(dbName);
    // 数据库打开成功回调
    request.onsuccess = () => {
      console.log("数据库打开成功");
      resolve(request.result);
    };
    // 数据库打开失败的回调
    request.onerror = (error: any) => {
      console.log("数据库打开失败");
      reject(error);
    };
  });
};

/**
 * 打开数据库,新建表
 * @param dbName 数据库的名字
 * @param version 数据库的版本
 * @param storeName 创建表的名字
 * @param index 表的字段
 */
export const updateDB = (
  dbName: string,
  version: number,
  storeName: string,
  index: any[]
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(dbName, version); // 打开数据库，若没有则会创建

    // 数据库打开失败的回调
    request.onerror = (error: any) => {
      console.log("数据库打开失败");
      reject(error);
    };

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result; // 数据库对象
      const objectStore = db.createObjectStore(storeName, { keyPath: "id" }); // 创建表( 表名，{设置主键})
      for (let i = 0; i < index.length; i++) {
        objectStore.createIndex(index[i], index[i]);
      }
      resolve(request.result);
    };
  });
};
