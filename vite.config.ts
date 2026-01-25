import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
          '@core': path.resolve(__dirname, './src/core'),
          '@features': path.resolve(__dirname, './src/features'),
          '@shared': path.resolve(__dirname, './src/shared'),
          '@assets': path.resolve(__dirname, './src/assets'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              // Vendor splitting for better caching
              'react-vendor': ['react', 'react-dom', 'react-router-dom'],
              'ui-vendor': ['lucide-react', 'recharts'],
            },
          },
        },
        // Optimize chunk size warnings
        chunkSizeWarningLimit: 600,
        // Enable source maps for production debugging
        sourcemap: false,
        // Minification settings (using esbuild - faster than terser)
        minify: 'esbuild',
      },
      // Performance optimizations
      optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom', 'lucide-react', 'recharts'],
      },
    };
});
