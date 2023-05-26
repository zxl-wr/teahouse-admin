<template>
  <!-- 类型按钮 -->
  <el-row class="mb-4">
    <el-button :type="currentTab == tab.id ? 'primary' : ''" v-for="tab in goodsType" :key="tab.id"
      @click="currentTab = tab.id">
      {{ tab.name }}
    </el-button>
    <el-button class="!ml-auto" type="primary" @click="openDialog">
      + 增加
    </el-button>
  </el-row>
  <!-- 数据表格 -->
  <el-table :data="tableData" height="600">
    <el-table-column prop="id" label="序号" />
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="price" label="价格" />
    <el-table-column label="操作">
      <el-button type="danger">删除</el-button>
    </el-table-column>
  </el-table>
  <!-- 新增弹窗 -->
  <el-dialog v-model="isShowDialog" title="新增商品" :show-close="false" :close-on-click-modal="false"
    :close-on-press-escape="false">
    <el-form style="max-width: 460px" :model="newGoods" label-width="100px">
      <el-form-item label="类型">
        <el-select v-model="newGoods.type_id" clearable placeholder="请选择类型">
          <el-option v-for="item in goodsType.filter((i) => i.id >= 0)" :key="item.id" :label="item.name"
            :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="ID">
        <el-input v-model="newGoods.id" disabled />
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="newGoods.name" />
      </el-form-item>
      <el-form-item label="价格 / 元">
        <el-input-number v-model="newGoods.price" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="addGoods">确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
// 商品类型
import { goodsType } from '@/assets/constant.ts';
const currentTab = ref(-1);

// 商品数据
import { openDB, closeDB, updateDB, readDB } from '@/indexDB';
const tableData = ref<object[]>([]);
const goodsLength = computed(() => tableData.value.length);
// 获取表单数据
const getTableData = async () => {
  const db = await openDB().catch(() => { return false });
  if (!db) return;
  const DBstores = Object.values(db.objectStoreNames);
  const DBversion = db.version;
  if (DBstores.indexOf('goods_store') == -1) updateDB(DBversion + 1, 'goods_store', 'id', ['type_id']);
  const _data = await readDB('goods_store').catch(() => { return false });
  if (typeof _data == 'boolean') return;
  tableData.value = _data;
  closeDB()
};
onMounted(() => {
  getTableData();
});

/**
 * 新增商品功能
 */
import { Goods } from '@/assets/type.ts';
import { addData } from '@/indexDB';
const isShowDialog = ref(false);
const newGoods = reactive<Goods>({
  id: '', // 商品id
  name: '', // 名称
  type_id: '', // 商品类型id
  price: 0, // 单价
});
// 打开新增弹框
const openDialog = () => {
  newGoods.id = goodsLength.value + 1;
  isShowDialog.value = true;
};
// 关闭新增弹框
const closeDialog = () => {
  newGoods.id = '';
  newGoods.name = '';
  newGoods.type_id = '';
  newGoods.price = 0;
  isShowDialog.value = false;
};
// 新增商品
const addGoods = async () => {
  const db = await openDB().catch(() => { return false });
  if (!db) return;
  addData('goods_store', newGoods)
};
</script>
