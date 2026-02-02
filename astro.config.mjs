import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';
import tailwindcss from '@tailwindcss/vite';
import robots from 'astro-robots-txt';
import sitemap from 'astro-sitemap';
import min from 'astro-min';
import remarkBannerStatic from './src/utils/remarkBannerStatic.js';

export default defineConfig({
  site: 'https://przemekmiros.pl/',
  output: 'static',
  adapter: netlify(),
  integrations: [
    react(),
    sitemap(),
    robots({
      policy: [
        { userAgent: '*', allow: '/' }
      ],
      sitemap: 'https://przemekmiros.pl/sitemap-index.xml'
    }),
    min()
  ],
  markdown: {
    remarkPlugins: [remarkBannerStatic],
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
