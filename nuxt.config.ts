import type { NuxtPage } from "@nuxt/schema";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  experimental: {
    typedPages: true,
  },
  hooks: {
    "pages:extend"(pages) {
      function removePagesMatching(pages: NuxtPage[] = []) {
        const pagesToRemove: NuxtPage[] = [];
        for (const page of pages) {
          if (
            page.file &&
            page.path.endsWith("/index") &&
            !/\.page\.vue$/.test(page.file)
          ) {
            // Remove all pages that are not .page.vue, but leave the index.vue files intact.
            pagesToRemove.push(page);
          } else {
            removePagesMatching(page.children);
          }
        }
        for (const page of pagesToRemove) {
          const index = pages.indexOf(page);
          if (index !== -1) {
            pages.splice(index, 1);
          }
        }
      }

      removePagesMatching(pages);

      pages.forEach((page) => {
        if (page.path) {
          page.path = page.path.replace(/\.page/, "");
          page.name = page.name?.replace(/\.page/, "");
        }
      });
    },
  },
});
