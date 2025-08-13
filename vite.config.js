import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimasi untuk mobile
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks untuk caching yang lebih baik
          'react-vendor': ['react', 'react-dom'],
          'mui-vendor': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          'router-vendor': ['react-router-dom'],
          'motion-vendor': ['framer-motion'],
          'utils': ['aos', 'sweetalert2', '@supabase/supabase-js']
        }
      }
    },
    // Optimasi size
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log']
      }
    },
    // Chunk size warning
    chunkSizeWarningLimit: 1000
  },
  // Optimasi development
  server: {
    host: true
  },
  // Preload optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@mui/material',
      '@emotion/react',
      '@emotion/styled'
    ]
  }
})
