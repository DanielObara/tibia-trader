import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import { withZephyr } from 'vite-plugin-zephyr';

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    server: {
        port: 5001, // Different port from Host
        cors: true,  // Important for Module Federation
    },
    plugins: [
      react(),
      withZephyr(),
      federation({
        name: 'oracle_advisor',
        filename: 'remoteEntry.js',
        // Expose the component
        exposes: {
          './OracleAdvisor': './src/OracleAdvisor.tsx',
        },
        shared: ['react', 'react-dom']
      })
    ],
    build: {
      target: 'esnext',
      minify: false,
      cssCodeSplit: false
    }
  };
});
