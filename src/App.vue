<template>
  <el-container class="h-100vh">
    <el-aside width="200px">
      <el-menu class="flex-column-center h-100vh border-none" :default-active="currentRoute" router>
        <template v-for="(route, index) in routes">
          <el-menu-item class="justify-center m-y-4 w-100%  text-6" :index="route.path" v-if="!route.hidden" :key="index">
            {{ route.meta?.title }}
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { routes } from "@/router";

const currentRoute = ref(); // 当前路由地址
const route = useRoute()
watch(
  () => route.path,
  (newValue) => { currentRoute.value = newValue },
  { immediate: true, deep: true }
)

currentRoute.value = route.path
</script>

<style>
:root {
  --el-color-primary: #2cbf9c;
  --el-color-primary-light-3: #35d1ad;
  --el-color-primary-light-5: #62dbbf;
  --el-color-primary-light-7: #8fe6d1;
  --el-color-primary-light-8: #bcf0e4;
  --el-color-primary-light-9: #e9faf6;
  --el-color-primary-dark-2: #22967b;
  --el-color-success: var(--el-color-primary);
  --el-color-success-light-3: var(--el-color-primary-light-3);
  --el-color-success-light-5: var(--el-color-primary-light-5);
  --el-color-success-light-7: var(--el-color-primary-light-7);
  --el-color-success-light-8: var(--el-color-primary-light-8);
  --el-color-success-light-9: var(--el-color-primary-light-9);
  --el-color-success-dark-2: var(--el-color-primary-dark-2);
  --el-bg-color: var(--el-color-primary-light-9);
  --el-border-color-light: var(--el-color-primary);
}

.el-main,
.el-menu-item.is-active {
  background-color: var(--el-color-primary-light-9) !important;
}

.el-dialog {
  --el-dialog-bg-color: #fff !important;
}

.border {
  border-color: var(--el-color-primary) !important;
}
</style>