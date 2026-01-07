// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://HaruLab.github.io',
  base: import.meta.env.PROD ? '/HARUME_Portfolio' : '/',
  integrations: [react()],
  server: {
    host: true,
  },
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['@react-three/cannon', 'cannon-es']
    },
    resolve: {
      alias: {
        '@react-three/cannon': '@react-three/cannon/dist/index.js'
      }
    }
  }
});