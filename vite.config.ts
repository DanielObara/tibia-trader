import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(async ({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const { withZephyr } = await import('vite-plugin-zephyr');
    const { default: federation } = await import('@originjs/vite-plugin-federation');

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        withZephyr(),
        federation({
            name: 'tibia_trader',
            remotes: {
                // Fallback: Use Staging/Prod Remote for stability even in Local Dev
                // This avoids 404s from local Zephyr serving issues
                oracle_advisor: mode === 'development'
                    ? 'http://localhost:5001/assets/remoteEntry.js'
                    : undefined,
            },
            shared: ['react', 'react-dom']
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY),
        'process.env.VITE_API_KEY': JSON.stringify(env.VITE_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        target: 'esnext'
      }
    };
});
