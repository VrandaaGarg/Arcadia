import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";
import viteCompression from "vite-plugin-compression";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({ open: true }), // Visualize bundle size
    viteCompression() // Enable gzip compression
  ],
  build: {
    minify: 'terser', // Minify the code
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
      },
    },
  },
  server: {
    host: '0.0.0.0', // Allow access from all hosts
    port: 5173, // Default port for Vite
    strictPort: true, // Ensure the port is not changed if 5173 is in use
    hmr: {
      host: 'localhost', // Use localhost for HMR
      port: 5173
    },
    allowedHosts: ['*', 'breezy-roses-trade.loca.lt'] // Allow all hosts and specific host
  }
});
