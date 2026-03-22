import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';
import tailwindcss from '@tailwindcss/vite';
import robots from 'astro-robots-txt';
import sitemap from 'astro-sitemap';
import remarkBannerStatic from './src/utils/remarkBannerStatic.js';

export default defineConfig({
  site: 'https://przemekmiros.pl/',
  output: 'static',
  compressHTML: false,
  adapter: netlify(),
  integrations: [
    react(),
    sitemap(),
    robots({
      policy: [
        { userAgent: '*', allow: '/' }
      ],
      sitemap: 'https://przemekmiros.pl/sitemap-index.xml'
    })
  ],
  markdown: {
    remarkPlugins: [remarkBannerStatic],
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
