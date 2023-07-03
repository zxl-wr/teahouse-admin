import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import UnoCSS from 'unocss/vite';
import { presetUno } from 'unocss';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS({
      // UnoCSS 预设
      presets: [presetUno()],
      // 自定义规则
      rules: [
        ['flex', { display: 'flex', 'flex-wrap': 'wrap' }],
        ['flex-row', { display: 'flex', 'flex-direction': 'row', 'align-items': 'center' }],
        ['flex-row-center', { display: 'flex', 'flex-direction': 'row', 'align-items': 'center', 'justify-content': 'center' }],
        ['flex-row-between', { display: 'flex', 'flex-direction': 'row', 'align-items': 'center', 'justify-content': 'space-between' }],
        ['flex-column', { display: 'flex', 'flex-direction': 'column', 'align-items': 'center' }],
        ['flex-column-center', { display: 'flex', 'flex-direction': 'column', 'align-items': 'center', 'justify-content': 'center' }],
        ['flex-column-between', { display: 'flex', 'flex-direction': 'column', 'align-items': 'center', 'justify-content': 'space-between' }],
        ['card', { border: '1px solid', 'border-radius': '0.5rem', cursor: 'pointer', overflow: 'hidden' }],
      ],
    }),
    AutoImport({
      imports: [
        // 插件预设支持导入的api
        'vue',
        'vue-router',
        'pinia',
        // 自定义导入的api
      ],
      resolvers: [ElementPlusResolver()],
      dts: 'src/auto-imports.d.ts',
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
