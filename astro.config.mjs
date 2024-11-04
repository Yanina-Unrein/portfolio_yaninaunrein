import { defineConfig } from 'astro/config';
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel(),
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: {
      prefixDefaultLocale: false
    }
  },
  devToolbar: {
    enabled: false
  },
  pages: {
    '404': [
      { path: '/404', locale: 'es' },
      { path: '/en/404', locale: 'en' }
    ]
  }
});