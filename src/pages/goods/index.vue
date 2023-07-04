<template>
  <!-- 类型按钮 -->
  <el-row class="mb-4">
    <el-button :type="currentTab == tab.id ? 'primary' : ''" v-for="tab in goodsType" :key="tab.id" @click="currentTab = tab.id">
      {{ tab.name }}
    </el-button>
    <el-button class="!ml-auto" type="primary" @click="isShowDialog = true"> + 增加 </el-button>
  </el-row>
  <!-- 数据表格 -->
  <el-table :data="tableData" height="600">
    <el-table-column prop="id" label="序号" />
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="price" label="价格" />
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="danger" @click="deleteGoods(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 新增弹窗 -->
  <el-dialog v-model="isShowDialog" title="新增商品" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form style="max-width: 460px" :model="newGoods" label-width="100px">
      <el-form-item label="类型">
        <el-select v-model="newGoods.type_id" clearable placeholder="请选择类型">
          <el-option v-for="item in goodsType.filter((i) => i.id >= 0)" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
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
/**
 * 获取商品数据
 */
import { goodsType } from '@/assets/constant.ts'; // 商品类型
import { db } from '@/utils/indexDB.ts'; // 数据库
const currentTab = ref(-1); // 默认类型
const tableData = ref<object[]>([]); // 表格数据
// 获取表单数据
const getTableData = async () => {
  if (currentTab.value == -1) tableData.value = await db.goods_store.orderBy('id').toArray();
  else tableData.value = await db.goods_store.where({ type_id: currentTab.value }).toArray();
};
onMounted(() => {
  getTableData();
});
watch(currentTab, () => getTableData()); // 监听类型切换

/**
 * 新增商品功能
 */
import { Goods } from '@/assets/type.ts';
import { IndexableType } from 'dexie';
// 新增的数据
const newGoods = reactive<Goods>({
  name: '', // 名称
  type_id: '', // 商品类型id
  price: 0, // 单价
});
const isShowDialog = ref(false); // 是否打开新增商品弹窗
// 关闭新增弹框
const closeDialog = () => {
  newGoods.name = '';
  newGoods.type_id = '';
  newGoods.price = 0;
  isShowDialog.value = false;
};
// 新增商品
const addGoods = async () => {
  await db.goods_store.add({ name: newGoods.name, type_id: newGoods.type_id, price: newGoods.price });
  getTableData();
  closeDialog();
};

/**
 * 删除商品
 */
const deleteGoods = async (id: IndexableType) => {
  await db.goods_store.delete(id);
  getTableData();
};
</script>
