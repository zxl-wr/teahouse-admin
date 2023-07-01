<template>
  <el-container class="h-100vh">
    <el-aside width="200px">
      <el-menu class="flex-column-center h-100vh border-none" :default-active="currentRoute" router>
        <template v-for="(route, index) in routes">
          <el-menu-item class="justify-center m-y-4 w-100% text-6" :index="route.path" v-if="!route.hidden" :key="index">
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
import { routes } from '@/router';

const currentRoute = ref(); // 当前路由地址
const route = useRoute();
watch(
  () => route.path,
  (newValue) => {
    currentRoute.value = newValue;
  },
  { immediate: true, deep: true }
);

currentRoute.value = route.path;
</script>

<style>
:root {
  /* 自定义 */
  --app-bg-color: #f2f3f5;
  --app-color-theme: #2cbf9c;
  --app-color-theme-light-3: #35d1ad;
  --app-color-theme-light-5: #62dbbf;
  --app-color-theme-light-7: #8fe6d1;
  --app-color-theme-light-8: #bcf0e4;
  --app-color-theme-light-9: #e9faf6;
  --app-color-theme-dark-2: #22967b;
  /* Element-Plus */
  --el-color-primary: var(--app-color-theme);
  --el-color-primary-light-3: var(--app-color-theme-light-3);
  --el-color-primary-light-5: var(--app-color-theme-light-5);
  --el-color-primary-light-7: var(--app-color-theme-light-7);
  --el-color-primary-light-8: var(--app-color-theme-light-8);
  --el-color-primary-light-9: var(--app-color-theme-light-9);
  --el-color-primary-dark-2: var(--app-color-theme-dark-2);
  --el-color-success: var(--app-color-theme);
  --el-color-success-light-3: var(--app-color-theme-light-3);
  --el-color-success-light-5: var(--app-color-theme-light-5);
  --el-color-success-light-7: var(--app-color-theme-light-7);
  --el-color-success-light-8: var(--app-color-theme-light-8);
  --el-color-success-light-9: var(--app-color-theme-light-9);
  --el-color-success-dark-2: var(--app-color-theme-dark-2);
}

/* 自定义 */
.card {
  border-color: var(--app-color-theme) !important;
}

/* Element-Plus */
.el-menu {
  background-color: var(--app-color-theme);
}

.el-menu-item.is-active {
  background-color: var(--app-bg-color);
}

.el-main {
  background-color: var(--app-bg-color);
}
</style>
