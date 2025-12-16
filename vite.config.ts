import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    // 'base: "./"' ensures assets use relative paths, which is safer for Netlify drag-and-drop
    base: './', 
    define: {
      // This ensures process.env.API_KEY works in the frontend code
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    },
    server: {
      port: 5174,
      strictPort: true,
    },
  };
});