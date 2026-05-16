import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'anemoi-blog',
    globals: true,
    environment: 'happy-dom',
    include: ['tests/unit/**/*.test.ts'],
    exclude: ['node_modules', 'dist', '.astro'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/utils/**/*.ts', 'src/content/**/*.ts'],
      exclude: ['node_modules', 'dist', '.astro', 'tests'],
    },
  },

});
