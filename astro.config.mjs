import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  // [TODO: 部署前替换为你的实际域名]
  // site: 'https://your-domain.com',
});
