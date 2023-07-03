<template>
  <div class="mt-200px mx-auto w-200px h-200px b-rd-100 text-12 text-center line-height-200px bg-#2cbf9c color-#fff" @click="reset">
    重置
  </div>
</template>

<script lang="ts" setup>
import {db} from '@/utils/indexDB.ts'; // 数据库

// 重置软件
const reset = () => {
  ElMessageBox.confirm('是否确认重置软件？重置后请重启软件！', {confirmButtonText: '确认', cancelButtonText: '取消'}).then(() => {
    localStorage.clear();
    db.delete();
    Niva.api.window.close(0);
  });
};
</script>
