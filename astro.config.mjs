import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://heidiblondin.com',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    mdx(),
    sitemap({
      filter: (page) =>
        !page.includes('thank-you') &&
        !page.includes('contact-thank-you') &&
        !page.includes('insurance-submitted') &&
        // Articles canonicalise to /{slug}; the /blog/{slug} aliases are noindex,
        // so keep them out of the sitemap. /blog/ and /blog/page/N stay in.
        !/\/blog\/(?!page\/)./.test(page),
    }),
  ],
  output: 'static',
  adapter: vercel(),
});
