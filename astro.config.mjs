import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  // 部署前替换为你的实际信息
  site: 'https://your-username.github.io',
  base: '/',
  //base: '/anemoi-blog',
});
