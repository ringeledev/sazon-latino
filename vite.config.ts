import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// Demo build (GitHub Pages): VITE_DEMO=true swaps Supabase, printing and realtime
// for in-browser fakes. Normal builds are unchanged.
const isDemo = process.env.VITE_DEMO === "true";
const src = (p: string) => path.resolve(__dirname, "./src", p);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    !isDemo &&
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["pwa-192x192.png", "pwa-512x512.png"],
        manifest: {
          name: "Sazón Latino",
          short_name: "Sazón Latino",
          description: "Sistema de gestión de pedidos - Sazón Latino",
          theme_color: "#1a160e",
          background_color: "#1a160e",
          display: "standalone",
          orientation: "portrait",
          start_url: "/",
          icons: [
            {
              src: "/pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
          globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
              handler: "NetworkFirst",
              options: {
                cacheName: "supabase-cache",
                networkTimeoutSeconds: 5,
              },
            },
          ],
        },
      }),
  ].filter(Boolean),
  resolve: {
    alias: [
      ...(isDemo
        ? [
            { find: /^@\/services\/db$/, replacement: src("services/db.demo.ts") },
            { find: /^@\/services\/print$/, replacement: src("services/print.demo.ts") },
            { find: /^@\/lib\/supabase$/, replacement: src("lib/supabase.demo.ts") },
            { find: /^@\/hooks\/useRealtimePedidos$/, replacement: src("hooks/useRealtimePedidos.demo.ts") },
            { find: /^date-fns\/locale$/, replacement: src("lib/dateLocale.demo.ts") },
          ]
        : []),
      { find: "@", replacement: path.resolve(__dirname, "./src") },
    ],
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
