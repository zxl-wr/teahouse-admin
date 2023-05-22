// uno.config.ts
import { defineConfig, presetUno } from 'unocss';

export default defineConfig({
  // ...UnoCSS options
  presets: [presetUno()],
  // xs sm ml lg xl
  rules: [
    ['flex-row', { display: 'flex', 'flex-direction': 'row' }],
    ['flex-row-center', { display: 'flex', 'flex-direction': 'row', 'align-items': 'center' }],
    ['flex-row-between', { display: 'flex', 'flex-direction': 'row', 'align-items': 'center', 'justify-content': 'space-between' }],
    ['flex-column', { display: 'flex', 'flex-direction': 'column', 'align-items': 'center' }],
    ['flex-column-center', { display: 'flex', 'flex-direction': 'column', 'align-items': 'center', 'justify-content': 'center' }],
    ['flex-column-between', { display: 'flex', 'flex-direction': 'column', 'align-items': 'center', 'justify-content': 'space-between' }],
  ],
});
