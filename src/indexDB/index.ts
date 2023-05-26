const dbName = 'app-db'; // 数据库名称
const request = window.indexedDB.open(dbName);

/**
 * 打开数据库
 * @param dbName 数据库名称
 * @returns 数据库实例
 */
export const openDB = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    // 数据库打开成功回调
    request.onsuccess = () => {
      console.log('数据库打开成功');
      resolve(request.result);
    };
    // 数据库打开失败的回调
    request.onerror = (error: any) => {
      console.log('数据库打开失败');
      reject(error);
    };
  });
};

/**
 * 关闭数据库
 */
export const closeDB = () => {
  let db = request.result;
  db.close();
  console.log('数据库已关闭');
};

/**
 * 更新数据库,新建表
 * @param version 数据库的版本
 * @param storeName 创建表的名字
 * @param keyPath 表的主键
 * @param index 表的索引
 */
export const updateDB = (version: number, storeName: string, keyPath: string, index: string[] | undefined) => {
  const request = window.indexedDB.open(dbName, version); // 打开数据库，若没有则会创建
  // 数据库升级
  request.onupgradeneeded = (event: any) => {
    console.log('数据库更新');
    const db = event.target.result; // 数据库对象
    if (db.objectStoreNames.contains(storeName)) return; // 判断存储库是否存在，如果不存在再新建
    const objectStore = db.createObjectStore(storeName, { keyPath }); // 创建表( 表名，{设置主键})
    if (!index) return; // 是否创建索引，如果没有就不创建
    for (let i = 0; i < index.length; i++) objectStore.createIndex(index[i], index[i]);
  };
};

/**
 * 读取数据
 * @param storeName 表名
 * @returns 数据
 */
export const readDB = (storeName: string): Promise<object[]> => {
  let db = request.result;
  return new Promise((resolve, reject) => {
    const res = db.transaction([storeName]).objectStore(storeName).getAll();
    res.onsuccess = (event: any) => {
      console.log('获取数据成功');
      let data: object[] = event.target.result || [];
      resolve(data);
    };
    res.onerror = (error: any) => {
      console.log('获取数据失败');
      reject(error);
    };
  });
};

/**
 * 新增数据
 * @param db 数据库实例
 * @param storeName 表名
 * @param data 数据
 */
export const addData = (storeName: string, data: object): Promise<boolean> => {
  let db = request.result;
  console.log(db);

  return new Promise((resolve, reject) => {
    const res = db.transaction([storeName], 'readwrite').objectStore(storeName).add(data);
    res.onsuccess = () => {
      console.log('数据写入成功');
      resolve(true);
    };
    res.onerror = (event: any) => {
      console.error('数据写入失败，原因：', event.target.error);
      reject(false);
    };
  });
};

// /**
//  * 删除数据
//  * @param  db  数据库实例
//  * @param {string} storeName 仓库名称
//  * @param {string} key 主键值
//  */
// export const remove = (db: any, storeName: string, key: string | number) => {
//   var request = db.transaction([storeName], 'readwrite').objectStore(storeName).delete(key);
//   request.onsuccess = () => {
//     console.log('数据删除成功');
//   };
// };
