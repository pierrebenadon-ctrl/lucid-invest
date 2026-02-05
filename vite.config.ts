import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // Charge les variables d'environnement (comme GEMINI_API_KEY)
    const env = loadEnv(mode, process.cwd(), '');
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // C'est ici qu'on fait le pont entre Vercel et ton geminiService.ts
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          // Permet d'utiliser @/ pour tes imports si besoin
          '@': path.resolve(__dirname, './src'),
        }
      },
      build: {
        outDir: 'dist',
        sourcemap: false
      }
    };
});
