import { defineConfig } from 'astro/config';
import keystatic from '@keystatic/astro';
import react from '@astrojs/react'; // To powinno się pojawić

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [
    react(), // React musi być na liście
    keystatic()
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});