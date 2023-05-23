<template>
  <div class="flex w-100% h-auto">
    <div class="flex-column-center m-2 w-120px h-160px border border-rounded-4 bg-#fff cursor-pointer"
      @click="isShowDialog = true">
      <img class="w-80px h-80px" src="@/assets/img/img-add.png" alt="添加桌台类型">
      <div class="text-4">添加桌台类型</div>
    </div>
  </div>

  <el-dialog v-model="isShowDialog" title="新增桌台类型" :before-close="handleClose">
    <el-form :model="tableForm" label-width="80px">
      <el-form-item label="类型名称" prop="name">
        <el-input v-model="tableForm.name" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="addTable"> 确认 </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
const isShowDialog = ref(false)
const tableForm = reactive({ name: '' })

// 处理关闭：重置表单
const handleClose = (done: () => void) => {
  tableForm.name = ''
  done()
}

// 新增类型
const addTable = (): void => {
  if (/^.{1,9}$/.test(tableForm.name)) {
    tableForm.name = ''
    isShowDialog.value = false
  } else {
    ElMessage.error('请输入 1~9 位类型名称')
  }

}
</script>
