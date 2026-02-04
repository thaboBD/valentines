import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // Set base to your repository name for GitHub Pages
  // For example: base: '/valentine-envelope/'
  // Change this to match your repository name
  base: process.env.NODE_ENV === 'production' ? '/valentines/' : '/',

  build: {
    // Output directory
    outDir: 'dist',

    // Generate sourcemaps for debugging
    sourcemap: false,

    // Ensure assets are properly chunked
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['gsap', 'luxon', 'canvas-confetti'],
        },
      },
    },
  },

  // Server configuration for development
  server: {
    port: 3000,
    open: true,
  },

  // Preview server configuration
  preview: {
    port: 4173,
    open: true,
  },
});
