<template>
  <el-container class="h-100vh">
    <el-aside width="200px">
      <el-menu class="h-100vh flex-column-center" :default-active="currentRoute" router>
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

const route = useRoute();
const currentRoute = ref(route.fullPath); // 当前路由地址

</script>

<style>
:root {
  --app-theme-color-1: #d7fff1;
  --app-theme-color-2: #8cd790;
  --app-theme-color-3: #77af9c;
  --app-theme-color-4: #2cbf9c;
  --app-theme-color-5: #285943;
  --el-menu-active-color: var(--app-theme-color-4);
}
</style>