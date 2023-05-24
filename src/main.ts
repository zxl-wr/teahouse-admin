import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import 'virtual:uno.css';

const app = createApp(App);
// 全局仓库
const pinia = createPinia();
app.use(pinia);
// 路由
app.use(router);

app.mount('#app');
